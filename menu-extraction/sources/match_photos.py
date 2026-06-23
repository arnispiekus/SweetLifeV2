"""Match Drive photos in /Sweet Life Menu Item Photos/<Section>/ to DB menu_items.

Outputs in menu-extraction/sources/matches/:
  confident.json   — high-confidence matches (auto-applicable)
  unsure.json      — moderate score or cross-section, needs human review
  unmatched.json   — photos that don't fit any DB item
  no_photo.json    — DB items that have no matching photo
"""
import json
import re
from collections import defaultdict
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path("menu-extraction/sources")
DRIVE_FLAT = json.load(open(ROOT / "drive/ruta_mum/flat.json"))
DB_ITEMS = json.load(open(ROOT / "db_items.json"))

# Drive folder under /Sweet Life Menu Item Photos/ -> DB section slug(s)
# A folder may map to multiple DB sections (e.g. Hot Desserts -> golden-toast + pancakes-waffles)
SECTION_MAP = {
    "Bakery & Pastries":            ["bakery-pastries"],
    "Bingsu":                       ["bingsu"],
    "Breakfast & Brunch":           ["breakfast-brunch"],
    "Cakes, Cookies & Bites":       ["cakes-cookies-bites"],
    "Coffee & Tea":                 ["coffee-tea"],
    "Create Your Own":              ["lunch"],
    "Gourmet Lattes":               ["gourmet-lattes"],
    "Hot Desserts":                 ["golden-toast", "pancakes-waffles"],
    "Keto, Vegan & Gluten Free":    ["keto-vegan-gluten-free"],
    "Lunch":                        ["lunch"],
    "Salads":                       ["salads"],
    "Shakes, Smoothies & Frappes":  ["signature-drinks"],
    "Signature Drinks":             ["signature-drinks"],
    "Sushi (Pre-Order)":            ["sushi-pre-order-only"],
    # "Beverages" -> no DB section; soft drinks aren't in our menu
}

IMAGE_MIMES = {"image/jpeg", "image/png", "image/webp", "image/heif", "image/tiff", "image/gif"}

def split_camel(s: str) -> str:
    s = re.sub(r"([a-z])([A-Z])", r"\1 \2", s)
    s = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", s)
    return s

def normalize(s: str) -> str:
    # drop extension, strip punctuation, lowercase, split camelCase
    s = re.sub(r"\.\w+$", "", s)
    s = split_camel(s)
    s = re.sub(r"[^a-zA-Z0-9 ]+", " ", s)
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s

# Suffix words we strip when comparing names — the filename style is "TaroBingsu" but DB is "Taro Bingsu"
# These are kept in the normalized string but we ALSO compute a "core" without them
SUFFIX_WORDS = {"bingsu", "latte", "milk tea", "fruit tea", "milkshake", "smoothie",
                "frappe", "protein shake", "golden toast", "souffle pancake",
                "american pancake", "waffle", "tea", "burger", "cake", "salad"}

def core(s: str) -> str:
    n = normalize(s)
    # Strip parenthetical tags from DB names like "(GF)" "(V)(GF*)"
    n = re.sub(r"\b(gf|v|k|decaf)\b", "", n)
    n = re.sub(r"\s+", " ", n).strip()
    return n

def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a, b).ratio()

def best_match(photo_name: str, photo_section_slugs: list[str], items: list[dict]) -> tuple[dict | None, float, dict | None, float]:
    """Return (best_in_section, score_in_section, best_overall, score_overall)."""
    pn = core(photo_name)
    in_section, overall = [], []
    for it in items:
        score = similarity(pn, core(it["name"]))
        overall.append((score, it))
        if it["section_slug"] in photo_section_slugs:
            in_section.append((score, it))
    in_section.sort(key=lambda x: x[0], reverse=True)
    overall.sort(key=lambda x: x[0], reverse=True)
    best_sec = in_section[0] if in_section else (0.0, None)
    best_all = overall[0]
    return best_sec[1], best_sec[0], best_all[1], best_all[0]

def main() -> None:
    photos = [
        f for f in DRIVE_FLAT
        if f["path"].startswith("/Sweet Life Menu Item Photos/")
        and f["mimeType"] in IMAGE_MIMES
    ]
    print(f"Photos in 'Sweet Life Menu Item Photos': {len(photos)}")

    confident, unsure, unmatched = [], [], []
    matched_item_ids: set[int] = set()

    for p in photos:
        # parse the section folder out of the path (path[3] is the section name, if any)
        parts = p["path"].split("/")
        folder = parts[2] if len(parts) > 2 else None
        # photo in root of "Sweet Life Menu Item Photos" -> folder is the file itself, section_slugs = []
        if folder and folder == p["name"]:
            section_slugs = []
        else:
            section_slugs = SECTION_MAP.get(folder, [])

        best_sec, score_sec, best_all, score_all = best_match(p["name"], section_slugs, DB_ITEMS)

        record = {
            "photo_name": p["name"],
            "photo_path": p["path"],
            "photo_id": p["id"],
            "drive_folder": folder,
            "expected_section_slugs": section_slugs,
            "best_in_section": {"item": best_sec, "score": round(score_sec, 3)} if best_sec else None,
            "best_overall": {"item": best_all, "score": round(score_all, 3)},
        }

        if best_sec and score_sec >= 0.78:
            confident.append(record)
            matched_item_ids.add(best_sec["id"])
        elif best_sec and score_sec >= 0.55:
            unsure.append(record)
        elif score_all >= 0.78 and best_all["section_slug"] in section_slugs:
            confident.append(record)
            matched_item_ids.add(best_all["id"])
        elif score_all >= 0.55:
            unsure.append(record)
        else:
            unmatched.append(record)

    no_photo = [
        it for it in DB_ITEMS
        if it["id"] not in matched_item_ids
    ]

    out_dir = ROOT / "matches"
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "confident.json").write_text(json.dumps(confident, indent=2))
    (out_dir / "unsure.json").write_text(json.dumps(unsure, indent=2))
    (out_dir / "unmatched.json").write_text(json.dumps(unmatched, indent=2))
    (out_dir / "no_photo.json").write_text(json.dumps(no_photo, indent=2))

    print(f"  Confident:  {len(confident)}")
    print(f"  Unsure:     {len(unsure)}")
    print(f"  Unmatched:  {len(unmatched)}")
    print(f"  DB items w/o photo: {len(no_photo)}")
    print(f"  Output → {out_dir}/")

if __name__ == "__main__":
    main()
