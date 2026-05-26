"""Compare the 187 SVG-extracted Canva photos against the existing public/menu-photos/ set.

For each SVG photo, find:
  - Visual match in current bound set (exact/near-duplicate) → upgrade candidate
  - No match → potential new photo for the 29 gaps or extras

Output:
  matches/svg-upgrades.json   — SVG photos that visually match an existing
                                 bound photo (could replace for higher quality)
  matches/svg-novel.json      — SVG photos that don't match anything bound
                                 (candidates for the 29 gaps)
"""
import json
from pathlib import Path

import imagehash
from PIL import Image

ROOT = Path("menu-extraction/sources")
SVG_DIR = ROOT / "from-svg/newry-v2-clean"
BOUND_DIR = Path("public/menu-photos")
DB_ITEMS = json.load(open(ROOT / "db_items.json"))

DIST_EXACT_MAX = 6    # pHash distance ≤6 ~ duplicate
DIST_NEAR_MAX  = 14   # ≤14 ~ same subject, different framing

def phash_of(p: Path) -> imagehash.ImageHash | None:
    try:
        with Image.open(p) as img:
            img = img.convert("RGB")
            return imagehash.phash(img)
    except Exception as e:
        print(f"  WARN skip {p.name}: {e}")
        return None

print("Hashing bound photos…")
bound: list[tuple[Path, imagehash.ImageHash]] = []
for p in BOUND_DIR.rglob("*.*"):
    if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".heic"}:
        h = phash_of(p)
        if h is not None:
            bound.append((p, h))
print(f"  {len(bound)} bound photos")

print("Hashing SVG extracts…")
svg: list[tuple[Path, imagehash.ImageHash]] = []
for p in SVG_DIR.glob("*.*"):
    if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
        h = phash_of(p)
        if h is not None:
            svg.append((p, h))
print(f"  {len(svg)} SVG extracts")

# Reverse-index from bound path back to DB item (by image_url match)
db_by_url: dict[str, dict] = {it["image_url"]: it for it in DB_ITEMS if it.get("image_url")}

def db_item_for(bound_path: Path) -> dict | None:
    url = "/" + bound_path.relative_to("public").as_posix()
    return db_by_url.get(url)

upgrades = []   # SVG -> nearest bound photo (with item)
novel = []      # SVG with no good bound match

for sp, sh in svg:
    best_d = 999
    best_b = None
    for bp, bh in bound:
        d = sh - bh
        if d < best_d:
            best_d, best_b = d, bp
    if best_d <= DIST_EXACT_MAX:
        upgrades.append({
            "svg_path": str(sp),
            "matched_bound_path": str(best_b),
            "distance": best_d,
            "match_type": "duplicate",
            "db_item": db_item_for(best_b),
            "svg_size_kb": sp.stat().st_size // 1024,
            "bound_size_kb": best_b.stat().st_size // 1024,
        })
    elif best_d <= DIST_NEAR_MAX:
        upgrades.append({
            "svg_path": str(sp),
            "matched_bound_path": str(best_b),
            "distance": best_d,
            "match_type": "near",
            "db_item": db_item_for(best_b),
            "svg_size_kb": sp.stat().st_size // 1024,
            "bound_size_kb": best_b.stat().st_size // 1024,
        })
    else:
        novel.append({
            "svg_path": str(sp),
            "svg_size_kb": sp.stat().st_size // 1024,
            "nearest_bound": str(best_b),
            "nearest_distance": best_d,
        })

(ROOT / "matches/svg-upgrades.json").write_text(json.dumps(upgrades, indent=2, default=int))
(ROOT / "matches/svg-novel.json").write_text(json.dumps(novel, indent=2, default=int))
print(f"\nUpgrade candidates (SVG matches a bound photo): {len(upgrades)}")
print(f"  duplicates (could upgrade quality): {sum(1 for u in upgrades if u['match_type'] == 'duplicate')}")
print(f"  near-match (different framing of same dish): {sum(1 for u in upgrades if u['match_type'] == 'near')}")
print(f"Novel SVG photos (potential new bindings): {len(novel)}")
print(f"\nFiles → matches/svg-upgrades.json, matches/svg-novel.json")
