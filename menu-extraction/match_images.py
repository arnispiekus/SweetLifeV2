#!/usr/bin/env python3
"""Match /public images to menu_items by normalised name, preferring the
section's image folder. Emits apply_images.sql + a report of unmatched items.
"""
import json
import os
import re
import urllib.request
from pathlib import Path

ROOT = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
PUBLIC = ROOT / "public"
TOKEN = os.popen(
    "infisical secrets get SUPABASE_ACCESS_TOKEN --projectId=5c0c4346-3c12-4ccd-9c36-a2262eab9987 "
    "--env=dev --plain --silent --domain=https://secrets.elevateoco.com 2>/dev/null"
).read().strip()
PROJECT = "ftcpmjulnoaehbygvhsm"

# section_slug -> preferred image subfolder(s)
SECTION_FOLDERS = {
    "coffee-tea": ["CoffeeTea"],
    "bakery-pastries": ["Bakery"],
    "breakfast-brunch": ["Breakfast"],
    "lunch": ["Lunch", "CreateYourOwn"],
    "salads": ["Salads"],
    "keto-vegan-gluten-free": ["Keto"],
    "cakes-cookies-bites": ["Cakes"],
    "bingsu": ["Bingsu"],
    "golden-toast": ["GoldenToast"],
    "pancakes-waffles": ["HotDesserts"],
    "signature-drinks": ["SignatureDrinks", "MilkTea", "FruitTea", "Boba"],
    "gourmet-lattes": ["GourmetLatte"],
}

STOPWORDS = {"the", "of", "with", "and", "a"}


def norm(s: str) -> str:
    s = s.lower()
    s = re.sub(r"\((gf|k|v|gf\*|v\*)\)", " ", s)  # dietary tags
    s = re.sub(r"[^a-z0-9]+", " ", s)
    toks = [t for t in s.split() if t not in STOPWORDS]
    return "".join(toks)


def query(sql: str):
    req = urllib.request.Request(
        f"https://api.supabase.com/v1/projects/{PROJECT}/database/query",
        data=json.dumps({"query": sql}).encode(),
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json",
            "User-Agent": "sweet-life-seed/1.0",
        },
        method="POST",
    )
    return json.loads(urllib.request.urlopen(req, timeout=60).read())


# Index images by (folder, normalised basename) and a global normalised index
images = []  # (rel_path, folder, norm_name)
for dirpath, _, files in os.walk(PUBLIC):
    for f in files:
        if not f.lower().endswith((".webp", ".jpg", ".jpeg", ".png")):
            continue
        rel = "/" + os.path.relpath(os.path.join(dirpath, f), PUBLIC)
        folder = os.path.relpath(dirpath, PUBLIC).split(os.sep)[0] if dirpath != str(PUBLIC) else ""
        base = re.sub(r"\.(webp|jpg|jpeg|png)$", "", f, flags=re.I)
        base = re.sub(r"\.png$", "", base, flags=re.I)  # handle Bingsu.png.webp
        images.append((rel, folder, norm(base)))

by_folder = {}
for rel, folder, nm in images:
    by_folder.setdefault(folder, {}).setdefault(nm, rel)
global_idx = {}
for rel, folder, nm in images:
    global_idx.setdefault(nm, rel)

items = query("SELECT mi.id, mi.name, sec.slug AS section_slug "
              "FROM public.menu_items mi "
              "JOIN public.subsections sub ON sub.id=mi.subsection_id "
              "JOIN public.sections sec ON sec.id=sub.section_id ORDER BY mi.id")

import difflib

# Generic type-image fallbacks for granular items that share one photo.
# keyword (in normalised name) -> image path
TYPE_FALLBACK = [
    ("goldentoast", "/HotDesserts/GoldenToast.webp"),
    ("soufflepancake", "/HotDesserts/SoufflePancakes.webp"),
    ("americanpancake", "/HotDesserts/AmericanPancakes.webp"),
    ("waffle", "/HotDesserts/BelgianWaffle.webp"),
    ("milktea", "/MilkTea"),
    ("greentea", "/FruitTea"),
    ("blacktea", "/FruitTea"),
    ("smoothie", "/SignatureDrinks"),
    ("frappe", "/SignatureDrinks"),
    ("milkshake", "/SignatureDrinks"),
    ("proteinshake", "/SignatureDrinks"),
]


def folder_first_image(folder_path: str):
    """Return first image found under public<folder_path> (folder or file)."""
    p = PUBLIC / folder_path.lstrip("/")
    if p.is_file():
        return folder_path
    if p.is_dir():
        for f in sorted(os.listdir(p)):
            if f.lower().endswith((".webp", ".jpg", ".jpeg", ".png")):
                return folder_path.rstrip("/") + "/" + f
    return None


matched, unmatched = [], []
for it in items:
    nm = norm(it["name"])
    folders = SECTION_FOLDERS.get(it["section_slug"], [])
    hit = None
    # 1. exact match within preferred folders
    for fdr in folders:
        if nm in by_folder.get(fdr, {}):
            hit = by_folder[fdr][nm]; break
    # 2. partial (contains) within preferred folders
    if not hit:
        for fdr in folders:
            for img_nm, rel in by_folder.get(fdr, {}).items():
                if len(nm) >= 5 and (nm in img_nm or img_nm in nm):
                    hit = rel; break
            if hit: break
    # 3. fuzzy match within preferred folders (typos e.g. Cappuccino/Capuccino)
    if not hit:
        for fdr in folders:
            cands = list(by_folder.get(fdr, {}).keys())
            close = difflib.get_close_matches(nm, cands, n=1, cutoff=0.85)
            if close:
                hit = by_folder[fdr][close[0]]; break
    # 4. exact match anywhere
    if not hit and nm in global_idx:
        hit = global_idx[nm]
    # 5. generic type-image fallback
    if not hit:
        for kw, path in TYPE_FALLBACK:
            if kw in nm:
                hit = folder_first_image(path)
                if hit: break
    if hit:
        matched.append((it["id"], it["name"], hit))
    else:
        unmatched.append((it["id"], it["name"], it["section_slug"]))

# Emit SQL
lines = ["-- Image matches (menu_items.image_url)"]
for iid, name, rel in matched:
    safe = rel.replace("'", "''")
    lines.append(f"UPDATE public.menu_items SET image_url='{safe}' WHERE id={iid};")
(ROOT / "menu-extraction" / "apply_images.sql").write_text("\n".join(lines) + "\n")

print(f"Matched: {len(matched)} / {len(items)}")
print(f"Unmatched: {len(unmatched)}")
print("\n=== UNMATCHED (need manual image or new photo) ===")
for iid, name, slug in unmatched:
    print(f"  [{slug}] {name}")
