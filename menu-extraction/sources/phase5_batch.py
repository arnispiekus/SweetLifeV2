#!/usr/bin/env python3
"""
Phase 5 — variety batch via Higgsfield Marketing Studio Video.
Fires 8 image-to-video jobs in parallel with preset viral hooks.
"""
import json
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
PHOTOS = ROOT / "public" / "menu-photos"
OUT = ROOT / "public" / "videos" / "batch1"
OUT.mkdir(parents=True, exist_ok=True)

HOOKS = {
    "blizzard": "31976cc7-e597-4be2-9753-4a80153b0cc7",
    "product_crash": "8101cd3e-3cc9-4607-a171-3582daa2f6ee",
    "product_hit": "3d45fb46-254f-4c83-9685-8e3d28945a67",
}

JOBS = [
    ("01-lotus-banana-bingsu",         "bingsu/lotus-banana-bingsu-newgen.png",                       "product_hit",
     "A bowl of lotus banana bingsu — billowing fluffy snow-white shaved milk ice topped with broken Lotus Biscoff cookies, fresh banana slices, golden caramel drizzle, in a matte off-white speckled ceramic bowl on weathered light wood. Soft natural window light from upper-left, warm 4500K. Photorealistic, documentary, café setting. The bowl must remain visually consistent throughout."),
    ("02-oreo-crunch-bingsu",          "bingsu/oreo-crunch-bingsu-newgen.png",                        "blizzard",
     "A bowl of Oreo crunch bingsu — billowing fluffy snow-white shaved milk ice topped with crushed Oreo cookies, whole Oreo pieces, glossy chocolate sauce, in a matte off-white speckled ceramic bowl on weathered light wood. Soft natural window light from upper-left, warm 4500K. Photorealistic, documentary, café setting. The bowl must remain visually consistent throughout."),
    ("03-kinder-bueno-frappe",         "signature-drinks/kinder-bueno-frappe-newgen.png",             "product_hit",
     "A tall glass of Kinder Bueno frappé — thick beige milkshake base, billowing whipped cream tower on top, drizzled with chocolate sauce, Kinder Bueno bar pieces garnish, on weathered light wood. Soft natural window light from upper-left, warm 4500K. Photorealistic, documentary, café setting. The glass must remain visually consistent throughout."),
    ("04-raspberry-jasmine-green-tea", "signature-drinks/raspberry-jasmine-green-tea-newgen.png",     "product_hit",
     "A tall glass of iced raspberry jasmine green tea — deep wine-purple at the base fading to pale green at the top, ice cubes, fresh raspberries on the rim, condensation on the glass, on weathered light wood. Soft natural window light from upper-left, warm 4500K. Photorealistic, documentary, café setting. The glass must remain visually consistent throughout."),
    ("05-lotus-biscoff-latte",         "gourmet-lattes/lotus-biscoff-latte-newgen.png",               "product_crash",
     "A glass cup of Lotus Biscoff latte — espresso layered over warm caramel-spice milk, topped with golden Biscoff cookie crumb and a whole Lotus cookie on the saucer, on weathered light wood. Soft natural window light from upper-left, warm 4500K. Photorealistic, documentary, café setting. The cup must remain visually consistent throughout."),
    ("06-strawberry-choco-waffle",     "pancakes-waffles/strawberry-choco-waffle-newgen.png",         "product_hit",
     "A plate of strawberry chocolate waffle — golden Belgian waffle topped with fresh sliced strawberries, glossy chocolate sauce drizzle, dusting of icing sugar, on weathered light wood. Soft natural window light from upper-left, warm 4500K. Photorealistic, documentary, café setting. The plate must remain visually consistent throughout."),
    ("07-choco-banana-souffle-pancake","pancakes-waffles/choco-banana-souffle-pancake-newgen.png",    "product_hit",
     "A plate of soufflé pancake with chocolate and banana — three tall fluffy Japanese-style soufflé pancakes stacked, drizzled with glossy chocolate sauce, fresh banana slices, dusting of icing sugar, on weathered light wood. Soft natural window light from upper-left, warm 4500K. Photorealistic, documentary, café setting. The plate must remain visually consistent throughout."),
    ("08-pistachio-croissant",         "bakery-pastries/pistachio-croissant-newgen.png",              "product_crash",
     "A flaky golden pistachio croissant — buttery laminated pastry with pistachio cream filling visible, topped with crushed pistachios and a dusting of icing sugar, on weathered light wood next to a small ceramic cup. Soft natural window light from upper-left, warm 4500K. Photorealistic, documentary, café setting. The croissant must remain visually consistent throughout."),
]


def fire(label, photo_rel, hook, prompt):
    photo = PHOTOS / photo_rel
    if not photo.exists():
        return (label, f"MISSING START FRAME: {photo}")
    hook_id = HOOKS[hook]
    cmd = [
        "higgsfield", "generate", "create", "marketing_studio_video",
        "--prompt", prompt,
        "--start-image", str(photo),
        "--aspect_ratio", "9:16",
        "--duration", "5",
        "--mode", "product_showcase",
        "--hook_id", hook_id,
        "--resolution", "720p",
        "--wait", "--wait-timeout", "40m", "--wait-interval", "15s",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=2700)
    out = (result.stdout or "").strip() + "\n" + (result.stderr or "").strip()
    url = None
    for line in out.splitlines():
        line = line.strip()
        if line.startswith("https://") and line.endswith(".mp4"):
            url = line
            break
    if url:
        dst = OUT / f"{label}-{hook}.mp4"
        subprocess.run(["curl", "-sSL", url, "-o", str(dst)], check=True)
        return (label, str(dst))
    return (label, f"NO URL — output:\n{out[:500]}")


def main():
    print(f"Phase 5 batch: {len(JOBS)} jobs, fired in parallel")
    start = time.time()
    with ThreadPoolExecutor(max_workers=len(JOBS)) as pool:
        futures = {pool.submit(fire, *j): j[0] for j in JOBS}
        # Stagger submissions slightly so we don't hammer the API in one tick
        for fut, label in list(futures.items()):
            time.sleep(2)
        for fut in as_completed(futures):
            label = futures[fut]
            try:
                result_label, result = fut.result()
                elapsed = (time.time() - start) / 60
                print(f"[{elapsed:5.1f}m] {result_label} -> {result}")
            except Exception as e:
                print(f"FAIL {label}: {e}")

    print(f"\nAll done in {(time.time()-start)/60:.1f}m")
    print(f"Outputs in: {OUT}")


if __name__ == "__main__":
    main()
