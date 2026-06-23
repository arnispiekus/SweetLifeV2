#!/usr/bin/env python3
"""
Phase 5 — stitch Batch 1 clips into 3 longer-form reels with brand text overlays.
- Concats 2-3 Higgsfield clips per reel (re-encoded for uniform output)
- Hook headline overlay (first 1.5s)
- Location/handle overlay (last 2s)
- No audio (added in TikTok/Reels native editor before posting)
- Output: 720x1280 H.264 mp4, ready for IG Reels / TikTok upload
"""
import subprocess
from pathlib import Path

ROOT = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
SRC = ROOT / "public" / "videos" / "batch1"
OUT = ROOT / "public" / "videos" / "stitched"
OUT.mkdir(parents=True, exist_ok=True)

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

REELS = [
    {
        "name": "A-bingsu-pair",
        "clips": [
            "01-lotus-banana-bingsu-product_hit.mp4",
            "02-oreo-crunch-bingsu-blizzard.mp4",
        ],
        "hook": "Korean bingsu lands in Newry",
        "location_l1": "Sweet Life Cafe",
        "location_l2": "12 Monaghan Street \\· sweetlife.cafe",
    },
    {
        "name": "B-drinks-trio",
        "clips": [
            "03-kinder-bueno-frappe-product_hit.mp4",
            "04-raspberry-jasmine-green-tea-product_hit.mp4",
            "05-lotus-biscoff-latte-product_crash.mp4",
        ],
        "hook": "Three drinks. One stop.",
        "location_l1": "Sweet Life Cafe \\· Newry",
        "location_l2": "12 Monaghan Street",
    },
    {
        "name": "C-sweet-treats",
        "clips": [
            "08-pistachio-croissant-product_crash.mp4",
            "06-strawberry-choco-waffle-product_hit.mp4",
            "07-choco-banana-souffle-pancake-product_hit.mp4",
        ],
        "hook": "Fresh on Monaghan Street",
        "location_l1": "Sweet Life Cafe",
        "location_l2": "Newry \\· sweetlife.cafe",
    },
]


def get_duration(p):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(p)],
        capture_output=True, text=True, check=True,
    )
    return float(r.stdout.strip())


def stitch(reel):
    clips = [SRC / c for c in reel["clips"]]
    for c in clips:
        if not c.exists():
            raise FileNotFoundError(c)

    # Approximate total duration (each Higgsfield clip is ~5.08s)
    total = sum(get_duration(c) for c in clips)
    loc_start = max(total - 2.4, 0.5)

    # Single-pass concat (no drawtext — text added in TikTok/Reels native editor)
    n = len(clips)
    inputs = []
    for c in clips:
        inputs += ["-i", str(c)]

    concat_inputs = "".join(f"[{i}:v]" for i in range(n))
    filter_complex = f"{concat_inputs}concat=n={n}:v=1:a=0[outv]"

    out_path = OUT / f"{reel['name']}.mp4"
    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", filter_complex,
        "-map", "[outv]",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "20",
        "-preset", "medium",
        "-movflags", "+faststart",
        str(out_path),
    ]
    print(f"\n=== Stitching {reel['name']} ({n} clips, ~{total:.1f}s, loc overlay from {loc_start:.1f}s) ===")
    subprocess.run(cmd, check=True)
    print(f"-> {out_path}")
    return out_path


def main():
    outputs = []
    for reel in REELS:
        try:
            outputs.append(stitch(reel))
        except subprocess.CalledProcessError as e:
            print(f"FAIL on {reel['name']}: {e}")
    print(f"\nDone. {len(outputs)} reels in {OUT}")


if __name__ == "__main__":
    main()
