#!/usr/bin/env python3
"""Generate the Arabic voiceover (one MP3 per scene) and sync it to the scene plan.

Engine "edge" uses the free `edge-tts` package (Microsoft Edge neural voices):
no API key, no credits, no paid service.   pip install edge-tts

For every scene in content/video-01.json the script:
  1. synthesizes the narration,
  2. measures the real duration with ffprobe,
  3. speeds the clip up (up to --max-tempo) if it would not fit inside the scene,
  4. normalizes loudness,
  5. writes public/audio/manifest.json, which the Remotion code reads to place the
     audio, time the subtitles and trigger the visuals on the spoken words.

Usage:
  python3 scripts/generate_voiceover.py                      # edge-tts, ar-SA-ZariyahNeural
  python3 scripts/generate_voiceover.py --voice ar-SA-HamedNeural
  python3 scripts/generate_voiceover.py --engine mock        # silent placeholders (tests the sync only)

Prefer your own recording? Put one file per scene in content/voice-recordings/
(<scene-id>.mp3, .wav, .m4a or .ogg) and run:
  python3 scripts/generate_voiceover.py --engine recordings
Your originals are only read, never modified; processed copies go to public/audio/voice/.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content" / "video-01.json"
MANIFEST = ROOT / "public" / "audio" / "manifest.json"
VOICE_DIR = ROOT / "public" / "audio" / "voice"
RECORDINGS_DIR = ROOT / "content" / "voice-recordings"
RECORDING_EXTS = (".mp3", ".wav", ".m4a", ".ogg")


def run(cmd: list[str]) -> str:
    result = subprocess.run(cmd, check=True, capture_output=True, text=True)
    return result.stdout.strip()


def probe_duration(path: Path) -> float:
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)])
    return float(out)


def post_process(src: Path, dst: Path, tempo: float, normalize: bool = True) -> None:
    """Optional speed-up (pitch preserved), loudness normalisation, mono 48 kHz MP3."""
    filters = []
    if tempo > 1.001:
        filters.append(f"atempo={tempo:.4f}")
    if normalize:
        filters.append("loudnorm=I=-16:TP=-1.5:LRA=11")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(src)]
    if filters:
        cmd += ["-af", ",".join(filters)]
    cmd += ["-ar", "48000", "-ac", "1", "-b:a", "128k", str(dst)]
    try:
        run(cmd)
    except subprocess.CalledProcessError as err:
        dst.unlink(missing_ok=True)
        sys.exit(f"ffmpeg failed on {src.name}: {(err.stderr or '').strip() or err}")


async def synth_edge(text: str, voice: str, rate: str, out: Path) -> None:
    try:
        import edge_tts  # type: ignore
    except ImportError:
        sys.exit("edge-tts is not installed. Run: pip install edge-tts")
    await edge_tts.Communicate(text, voice, rate=rate).save(str(out))


def synth_mock(text: str, out: Path) -> None:
    """Silent clip whose length mimics speech (~2.3 words/second). For pipeline tests only."""
    seconds = max(1.0, len(text.split()) / 2.3)
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono", "-t", f"{seconds:.2f}", "-b:a", "64k", str(out)])


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--engine", choices=["edge", "mock", "recordings"], default="edge")
    parser.add_argument("--voice", default="ar-SA-ZariyahNeural", help="edge-tts voice (e.g. ar-SA-HamedNeural, ar-EG-SalmaNeural)")
    parser.add_argument("--rate", default="-4%", help="edge-tts speaking rate, e.g. -4%% for a calm, clear delivery")
    parser.add_argument("--max-tempo", type=float, default=1.3, help="maximum speed-up allowed to fit a scene")
    args = parser.parse_args()

    plan = json.loads(CONTENT.read_text(encoding="utf-8"))
    lead = float(plan["voiceLeadSeconds"])
    tail = float(plan["voiceTailSeconds"])
    VOICE_DIR.mkdir(parents=True, exist_ok=True)

    scenes_out: dict[str, dict] = {}
    problems: list[str] = []

    for scene in plan["scenes"]:
        sid = scene["id"]
        budget = float(scene["seconds"]) - lead - tail
        final = VOICE_DIR / f"{sid}.mp3"
        raw = VOICE_DIR / f"{sid}.raw.mp3"

        if args.engine == "recordings":
            source = next((RECORDINGS_DIR / f"{sid}{ext}" for ext in RECORDING_EXTS if (RECORDINGS_DIR / f"{sid}{ext}").exists()), None)
            if source is None:
                problems.append(f"{sid}: no recording found in {RECORDINGS_DIR.relative_to(ROOT)}/ (expected {sid}.mp3/.wav/.m4a/.ogg)")
                continue
            raw = source  # read-only: the original is never touched
        elif args.engine == "mock":
            synth_mock(scene["narration"], raw)
        else:
            asyncio.run(synth_edge(scene["narration"], args.voice, args.rate, raw))

        natural = probe_duration(raw)
        tempo = 1.0
        if natural > budget:
            tempo = natural / budget * 1.01
            if tempo > args.max_tempo:
                problems.append(f"{sid}: narration is {natural:.1f}s but only {budget:.1f}s fit (needs x{tempo:.2f}); shorten the text or lengthen the scene")
                tempo = args.max_tempo

        post_process(raw, final, tempo, normalize=args.engine != "mock")
        if args.engine != "recordings":
            raw.unlink(missing_ok=True)
        duration = probe_duration(final)
        if duration > budget + 0.05:
            problems.append(f"{sid}: still {duration:.1f}s after speed-up, scene budget is {budget:.1f}s")

        scenes_out[sid] = {"file": f"audio/voice/{sid}.mp3", "durationSec": round(duration, 3)}
        print(f"  {sid:<10} narration {natural:5.1f}s -> {duration:5.1f}s (budget {budget:4.1f}s, tempo x{tempo:.2f})")

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    manifest["voiceover"] = {
        "enabled": bool(scenes_out) and not problems,
        "engine": args.engine,
        "voice": args.voice if args.engine == "edge" else None,
        "scenes": scenes_out,
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if problems:
        print("\nProblems (voiceover left disabled in the manifest):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        return 2
    print(f"\nVoiceover ready ({args.engine}). Manifest updated: {MANIFEST.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
