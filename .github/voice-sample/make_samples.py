#!/usr/bin/env python3
"""Generate short Arabic voiceover samples with several free female edge-tts voices."""
import asyncio
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = Path("out")
VOICES = [
    "ar-SA-ZariyahNeural",
    "ar-AE-FatimaNeural",
    "ar-EG-SalmaNeural",
    "ar-QA-AmalNeural",
]


async def main() -> int:
    import edge_tts

    text = (HERE / "narration.txt").read_text(encoding="utf-8").strip()
    rate = os.environ.get("RATE", "-8%")
    pitch = os.environ.get("PITCH", "-2Hz")
    OUT.mkdir(exist_ok=True)
    ok = 0
    for voice in VOICES:
        target = OUT / f"sample-{voice}.mp3"
        try:
            await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(str(target))
            print(f"OK   {voice} -> {target} ({target.stat().st_size // 1024} KB)")
            ok += 1
        except Exception as err:  # keep going: one unavailable voice must not block the others
            print(f"FAIL {voice}: {err}", file=sys.stderr)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
