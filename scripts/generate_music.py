#!/usr/bin/env python3
"""Synthesize an original, royalty-free cinematic ambient pad for the videos.

Because the track is generated from scratch by this script (sine/saw partials,
no samples, no third-party recordings), there is no license to track:
it is dedicated to the public domain (CC0) together with this repository's code.

Requires: python3, numpy, ffmpeg.   Usage: python3 scripts/generate_music.py [--seconds 64]
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT_FILE = ROOT / "public" / "audio" / "music" / "background.mp3"
MANIFEST = ROOT / "public" / "audio" / "manifest.json"

SR = 44100
BPM = 60.0
BEAT = 60.0 / BPM
BAR = BEAT * 4  # 4 s per bar

# Dm9 → Bbmaj7 → Gm9 → A7sus4 (each chord lasts two bars = 8 s). MIDI note numbers.
CHORDS = [
    [50, 57, 62, 65, 72],  # D3 A3 D4 F4 C5
    [46, 53, 62, 65, 69],  # Bb2 F3 D4 F4 A4
    [43, 55, 62, 70, 74],  # G2 G3 D4 Bb4 D5
    [45, 52, 62, 67, 71],  # A2 E3 D4 G4 B4
]
CHORD_SECONDS = BAR * 2


def midi_to_hz(note: float) -> float:
    return 440.0 * 2 ** ((note - 69) / 12)


def pad_voice(freq: float, t: np.ndarray) -> np.ndarray:
    """Soft detuned pad: a few sine partials + slight chorus."""
    sig = np.zeros_like(t)
    for detune, amp in ((-0.0035, 0.5), (0.0, 0.7), (0.0035, 0.5)):
        f = freq * (1 + detune)
        sig += amp * (np.sin(2 * np.pi * f * t) + 0.30 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t))
    return sig


def envelope(n: int, attack: float, release: float) -> np.ndarray:
    env = np.ones(n)
    a, r = int(attack * SR), int(release * SR)
    env[:a] = np.linspace(0, 1, a) ** 2
    env[-r:] = np.linspace(1, 0, r) ** 2
    return env


def render_progression(total_seconds: float) -> np.ndarray:
    n_total = int(total_seconds * SR)
    mix = np.zeros((n_total, 2))
    overlap = 2.5  # seconds of crossfade between chords

    chord_index = 0
    start = 0.0
    while start < total_seconds:
        chord = CHORDS[chord_index % len(CHORDS)]
        length = CHORD_SECONDS + overlap
        n = int(length * SR)
        t = np.arange(n) / SR
        env = envelope(n, attack=overlap, release=overlap)

        pad = np.zeros(n)
        for k, note in enumerate(chord):
            pad += pad_voice(midi_to_hz(note), t) * (0.55 if k == 0 else 0.4)
        pad *= env

        # Warm sub bass on the chord root, one octave lower.
        sub = np.sin(2 * np.pi * midi_to_hz(chord[0] - 12) * t) * 0.55 * env

        # Gentle arpeggio plucks on the upper notes (every half beat).
        arp = np.zeros(n)
        upper = chord[2:] + [chord[2] + 12]
        step = BEAT / 2
        for i in range(int(length / step)):
            note = upper[i % len(upper)] + 12
            t0 = int(i * step * SR)
            m = min(int(1.6 * SR), n - t0)
            if m <= 0:
                break
            tt = np.arange(m) / SR
            pluck = np.sin(2 * np.pi * midi_to_hz(note) * tt) * np.exp(-tt * 3.2)
            arp[t0 : t0 + m] += pluck * 0.12 * (0.7 + 0.3 * np.sin(i * 0.9))
        arp *= np.minimum(1, env * 2)

        # Slow stereo movement.
        pan = 0.5 + 0.35 * np.sin(2 * np.pi * (t + start) / 17.0)
        left = pad * (1 - pan * 0.3) + sub + arp * (1 - pan)
        right = pad * (1 - (1 - pan) * 0.3) + sub + arp * pan

        s = int(start * SR)
        e = min(s + n, n_total)
        mix[s:e, 0] += left[: e - s]
        mix[s:e, 1] += right[: e - s]

        start += CHORD_SECONDS
        chord_index += 1

    # Soft, slow "heartbeat" pulse for a cinematic feel.
    t = np.arange(n_total) / SR
    beat_phase = (t % BEAT) / BEAT
    pulse = np.exp(-beat_phase * 9) * np.sin(2 * np.pi * (46 - 18 * beat_phase) * t) * 0.16
    mix += pulse[:, None]

    peak = np.max(np.abs(mix)) or 1.0
    return mix / peak * 0.9


def write_wav(path: Path, data: np.ndarray) -> None:
    pcm = (np.clip(data, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--seconds", type=float, default=64.0, help="length of the generated track")
    args = parser.parse_args()

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    print(f"Synthesizing {args.seconds:.0f}s ambient track …")
    audio = render_progression(args.seconds)

    with tempfile.TemporaryDirectory() as tmp:
        wav_path = Path(tmp) / "pad.wav"
        write_wav(wav_path, audio)
        # Warm low-pass, light room echo, loudness normalisation, fade-out, MP3 encode.
        fade_start = max(args.seconds - 4, 0)
        filters = (
            "lowpass=f=5200,aecho=0.8:0.85:60|140:0.28|0.18,"
            "loudnorm=I=-20:TP=-2:LRA=9,"
            f"afade=t=in:st=0:d=2,afade=t=out:st={fade_start}:d=4"
        )
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav_path), "-af", filters, "-ar", "44100", "-b:a", "160k", str(OUT_FILE)],
            check=True,
        )

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    manifest["music"] = {
        "enabled": True,
        "file": "audio/music/background.mp3",
        "license": "Original track synthesized by scripts/generate_music.py — CC0 / public domain",
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT_FILE.relative_to(ROOT)} and enabled music in the manifest.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
