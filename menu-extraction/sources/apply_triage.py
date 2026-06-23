"""Apply triage decisions from the 57 unsure photos.

User decisions (locked in 2026-05-26):
1. FruitTea filenames → Jasmine Green Tea (Lemon/Passionfruit → Assam Black Tea)
2. Generic photos (Croissant.jpg, Scone.jpg, Bagel.jpg) → ALL variants in that family
3. GT suffix → Golden Toast
4. Missing items → ADD to DB

Workflow:
  - Identify each unsure photo's target item(s) per the rules above
  - Download photos still missing from public/menu-photos/
  - Generate SQL updates (existing items) + inserts (new items)
  - Print summary; SQL goes to matches/apply_triage.sql for inspection
"""
import json
import os
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent           # menu-extraction/sources
REPO = ROOT.parents[1]                            # sweet-life-v2
PUBLIC = REPO / "public"
PLAN_OUT = ROOT / "matches" / "apply_triage.sql"

unsure = json.load(open(ROOT / "matches/unsure.json"))
db_items = json.load(open(ROOT / "db_items.json"))

# Index DB items by name (case-insensitive substring) and by id
by_name_ci = {it["name"].lower(): it for it in db_items}
def find_item(predicate) -> dict | None:
    for it in db_items:
        if predicate(it):
            return it
    return None

def find_all(predicate) -> list[dict]:
    return [it for it in db_items if predicate(it)]

# --- Decision rules ---------------------------------------------------------

def fruittea_target(stem: str) -> str | None:
    """e.g. 'RaspberryFruitTea' -> 'Raspberry Jasmine Green Tea'."""
    flavor = stem.replace("FruitTea", "").lower()
    # Try Jasmine Green Tea first
    jgt = find_item(lambda it: flavor in it["name"].lower() and "jasmine green tea" in it["name"].lower())
    if jgt:
        return jgt["name"]
    # Fall back to Assam Black Tea
    abt = find_item(lambda it: flavor in it["name"].lower() and "assam black tea" in it["name"].lower())
    if abt:
        return abt["name"]
    return None

def gt_target(stem: str) -> str | None:
    """e.g. 'ChocoBananaGT' -> 'Choco Banana Golden Toast'."""
    flavor_raw = stem.replace("GT", "").strip()
    # Split camelCase
    flavor = re.sub(r"([a-z])([A-Z])", r"\1 \2", flavor_raw).lower()
    target = find_item(
        lambda it: it["section_slug"] == "golden-toast"
        and all(t in it["name"].lower() for t in flavor.split())
    )
    return target["name"] if target else None

# Items to ADD to DB (new items implied by unmatched photos).
# Each: (subsection_id, slug, name, description). Section IDs verified earlier.
NEW_ITEMS = [
    (24, "bubble-waffle",        "Bubble Waffle",          "Hong Kong-style bubble waffle."),
    (10, "mixed-grain-energy-bowl","Mixed Grain Energy Bowl","Hearty grain bowl for a wholesome start."),
    (10, "english-muffin",       "English Muffin",         "Classic toasted English muffin."),
    # Bingsu additions (subsection inferred via section bingsu; will look up at insert time)
    ("bingsu",            "dubai-chocolate-bingsu", "Dubai Chocolate Bingsu",  "Dubai chocolate flavour shaved-ice dessert."),
    # Cake variants
    ("cakes-cookies-bites","biscoff-rocky-road",     "Biscoff Rocky Road",      "Rocky road with Biscoff (Lotus) crumble."),
    # Pizza Quesadilla hybrid
    ("lunch",             "pizza-quesadilla",       "Pizza Quesadilla",        "Pizza-style quesadilla."),
    # Generic frappe / smoothie photos
    # SKIP "Frappe.jpg" / "Smoothie.jpg" — these are GENERIC; user prefers binding to specific items only. They'll just live in public/menu-photos/_generic/ for catalog use.
]

# Specific bindings (photo_path -> target item name or 'NEW:name')
SPECIFIC = {
    # Already in DB but matcher mis-scored:
    "/Sweet Life Menu Item Photos/Bingsu/CarmelApplePie.webp":      "Caramel Apple Bingsu",
    "/Sweet Life Menu Item Photos/Bingsu/BiscoffBananaBingsu.webp": "Lotus Banana Bingsu",
    "/Sweet Life Menu Item Photos/Breakfast & Brunch/Almond Belgian Waffle.jpeg": "Almond Belgium Waffle (K)",
    "/Sweet Life Menu Item Photos/Breakfast & Brunch/English Muffin.jpg": "NEW:English Muffin",
    "/Sweet Life Menu Item Photos/Breakfast & Brunch/Mixed Grain Energy Bowl.jpg": "NEW:Mixed Grain Energy Bowl",
    "/Sweet Life Menu Item Photos/Hot Desserts/Bubble Waffle.jpg":  "NEW:Bubble Waffle",
    "/Sweet Life Menu Item Photos/Hot Desserts/Belgian Waffle.jpg": "Almond Belgium Waffle (K)",  # fallback - no plain Belgian Waffle in DB; user might want to add one later
    "/Sweet Life Menu Item Photos/Bingsu/DubaiChocolateBingsu.webp": "NEW:Dubai Chocolate Bingsu",
    "/Sweet Life Menu Item Photos/Cakes, Cookies & Bites/Biscoff Rocky Road.jpg": "NEW:Biscoff Rocky Road",
    "/Sweet Life Menu Item Photos/Create Your Own/Pizza Quesedilla.jpeg": "NEW:Pizza Quesadilla",
    "/Sweet Life Menu Item Photos/Lunch/Pizza Quesedilla.jpeg":     "NEW:Pizza Quesadilla",
    # Disambiguation per triage (single most-likely candidate):
    "/Sweet Life Menu Item Photos/Hot Desserts/ChocoBananaGT.webp": "Choco Banana Golden Toast",
    "/Sweet Life Menu Item Photos/Hot Desserts/MixedBerryGT.webp":  "Mixed Berry Golden Toast",
    "/Sweet Life Menu Item Photos/Hot Desserts/ApplePieGT.webp":    "Apple Pie Golden Toast",
    "/Sweet Life Menu Item Photos/Hot Desserts/SmoreGT.webp":       "S'more Golden Toast",
    "/Sweet Life Menu Item Photos/Hot Desserts/MangoGT.webp":       "Mango Golden Toast",
    "/Sweet Life Menu Item Photos/Cakes, Cookies & Bites/Caramel Square.jpeg": "Belgium Caramel Square",
    "/Sweet Life Menu Item Photos/Cakes, Cookies & Bites/Snickers Cake (GF).jpeg": "Snickers Cake / Toblerone (GF)",
    "/Sweet Life Menu Item Photos/Keto, Vegan & Gluten Free/Vegan Toastie.png": "Toastie/Sandwich (GF)",
    "/Sweet Life Menu Item Photos/Keto, Vegan & Gluten Free/Vegan Sandwich.png": "Toastie/Sandwich (GF)",
    "/Sweet Life Menu Item Photos/Keto, Vegan & Gluten Free/Snickers Cake.jpeg": "Snickers Cake / Toblerone (GF)",
    "/Sweet Life Menu Item Photos/Create Your Own/Omelette Tortilla.jpeg": "Tortilla Omelette",
    "/Sweet Life Menu Item Photos/Breakfast & Brunch/Omelette Tortilla.jpeg": "Tortilla Omelette",  # the Breakfast Tortilla Omelette (id 43)
    "/Sweet Life Menu Item Photos/Breakfast & Brunch/Mozzarella Omelette Sandwich.jpeg": "Mozzarella Omelette Sandwich (K)",
    "/Sweet Life Menu Item Photos/Create Your Own/Crepe (Savory).jpg": "Crepe",  # in lunch
    "/Sweet Life Menu Item Photos/Create Your Own/Pasta.jpg": "Pasta Tagliatelle",
    "/Sweet Life Menu Item Photos/Lunch/Goujons.png": "Chicken Goujons x3",
    "/Sweet Life Menu Item Photos/Lunch/Goujons & Fries.png": "Goujons & Chips",
    "/Sweet Life Menu Item Photos/Lunch/Black Jack Burger.jpeg": "Black Jack Pulled Pork Burger",
    "/Sweet Life Menu Item Photos/Lunch/Ramen.jpeg": "Ramen Soup (*V)",
    "/Sweet Life Menu Item Photos/Lunch/Meatball Pasta.jpg": "Meatball Tagliatelle Pasta",
    "/Sweet Life Menu Item Photos/Lunch/Soup.jpeg": "Homemade Soup of the Day",
    "/Sweet Life Menu Item Photos/Lunch/Fries.png": "Chips",  # the Lunch section's "Chips" item — fries == chips
    "/Sweet Life Menu Item Photos/Breakfast & Brunch/French Toast.png": "French Toast x2 with Bacon & Maple Syrup",
    "/Sweet Life Menu Item Photos/Coffee & Tea/Mocha.jpg": "Mocha / White Mocha",
}

# Generic photos — bind to ALL items in that family
GENERIC_FAMILIES = {
    "/Sweet Life Menu Item Photos/Bakery & Pastries/Croissant.jpg":
        lambda it: it["section_slug"] == "bakery-pastries" and "croissant" in it["name"].lower(),
    "/Sweet Life Menu Item Photos/Bakery & Pastries/Scone.jpg":
        lambda it: it["section_slug"] == "bakery-pastries" and "scone" in it["name"].lower(),
    "/Sweet Life Menu Item Photos/Create Your Own/Bagel.jpg":
        lambda it: it["section_slug"] == "lunch" and "bagel" in it["name"].lower(),
    "/Sweet Life Menu Item Photos/Create Your Own/Pizza Bagel.jpg":
        lambda it: it["name"] == "Sourdough Pizza Bagel",
    "/Sweet Life Menu Item Photos/Shakes, Smoothies & Frappes/Frappe.jpg":
        lambda it: it["section_slug"] == "signature-drinks" and "frappe" in it["name"].lower(),
    "/Sweet Life Menu Item Photos/Shakes, Smoothies & Frappes/Smoothie.jpg":
        lambda it: it["section_slug"] == "signature-drinks" and "smoothie" in it["name"].lower(),
}

# ---------------------------------------------------------------------------

def safe(s: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "-", s).strip("-")

def slug_of(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")

# Build the binding list: (photo_id, target_path, list-of-item-names-or-new-markers)
bindings = []
for m in unsure:
    path = m["photo_path"]
    photo_id = m["photo_id"]
    folder = m["drive_folder"]

    if folder == "Beverages":
        continue   # soft drinks skipped

    targets: list[str] = []

    # FruitTea pattern
    if "FruitTea" in m["photo_name"]:
        t = fruittea_target(m["photo_name"].rsplit(".",1)[0])
        if t:
            targets = [t]
    # GT pattern
    elif m["photo_name"].endswith("GT.webp") or "GT." in m["photo_name"]:
        t = gt_target(m["photo_name"].rsplit(".",1)[0])
        if t:
            targets = [t]
    # Explicit specific mapping
    elif path in SPECIFIC:
        targets = [SPECIFIC[path]]
    # Generic family
    elif path in GENERIC_FAMILIES:
        targets = [it["name"] for it in db_items if GENERIC_FAMILIES[path](it)]
    # Carmel Apple Pie — typo of Caramel Apple Bingsu
    elif "CarmelApplePie" in m["photo_name"]:
        targets = ["Caramel Apple Bingsu"]

    if not targets:
        continue

    # Determine target_path: section from first target
    # NEW:X items go to the appropriate section folder; existing items go to their section folder
    first = targets[0]
    if first.startswith("NEW:"):
        new_name = first[4:]
        # Look up section for this new item from NEW_ITEMS
        target_section = next(
            (sec_or_subid if isinstance(sec_or_subid, str) else None
             for sec_or_subid, slug, name, desc in NEW_ITEMS if name == new_name),
            None,
        )
        # If subsection id given (int), derive section_slug via db_items? new items aren't yet — hardcode
        sub_to_section = {10: "lunch", 24: "pancakes-waffles"}
        target_section = target_section or sub_to_section.get(
            next(sub for sub, _, name, _ in NEW_ITEMS if name == new_name), "misc")
        target_path = f"/menu-photos/{target_section}/{safe(m['photo_name'])}"
    else:
        # Look up existing item
        it = by_name_ci.get(first.lower())
        if it is None:
            print(f"  WARN: target '{first}' not found in DB; skipping {m['photo_name']}")
            continue
        target_path = f"/menu-photos/{it['section_slug']}/{safe(m['photo_name'])}"

    bindings.append({
        "photo_id": photo_id, "photo_path": path, "photo_name": m["photo_name"],
        "target_path": target_path, "targets": targets,
    })

print(f"Bindings to apply: {len(bindings)}")
print(f"  → unique photos to download: {len(set(b['photo_id'] for b in bindings))}")

# --- Download phase ---------------------------------------------------------
api_key = os.environ.get("COMPOSIO_API_KEY")
if not api_key:
    print("ERROR: COMPOSIO_API_KEY not set", file=sys.stderr)
    sys.exit(1)
from composio import Composio
composio = Composio(api_key=api_key)

def download(b):
    target = PUBLIC / b["target_path"].lstrip("/")
    if target.exists():
        return ("skipped", b["photo_id"])
    target.parent.mkdir(parents=True, exist_ok=True)
    try:
        r = composio.tools.execute(
            "GOOGLEDRIVE_DOWNLOAD_FILE",
            user_id="Ruta - Mum",
            arguments={"file_id": b["photo_id"]},
            dangerously_skip_version_check=True,
        )
        s3 = r["data"]["downloaded_file_content"]["s3url"]
        data = urllib.request.urlopen(s3).read()
        target.write_bytes(data)
        return ("downloaded", b["photo_id"])
    except Exception as e:
        return ("failed", b["photo_id"], str(e)[:200])

uniq = {b["photo_id"]: b for b in bindings}.values()
print(f"Downloading {len(uniq)} unique photos (8 concurrent)...")
with ThreadPoolExecutor(max_workers=8) as ex:
    results = list(ex.map(download, uniq))
counts = {}
for r in results:
    counts[r[0]] = counts.get(r[0], 0) + 1
print(f"  Result: {counts}")
failures = [r for r in results if r[0] == "failed"]
if failures:
    print(f"  FAILURES:")
    for f in failures:
        print(f"    {f[1]}: {f[2]}")

# --- SQL phase --------------------------------------------------------------
sql_lines = ["-- Triage apply: bind unsure photos and insert new items", ""]
sql_lines.append("-- 1. Insert new items implied by unmatched photos")

# Insert NEW_ITEMS; section/subsection lookup
# For sub by section_slug, we need subsection IDs. Pick Mains/main subsection for new items
# Already known subsection ids from earlier query:
#   bingsu has no top-level subsection (will lookup); pancakes-waffles -> Waffle=24, lunch -> Mains=10, cakes-cookies-bites -> ?
# We'll generate INSERT...SELECT to discover subsection at runtime
new_items_sql = []
for entry in NEW_ITEMS:
    sub_or_sec, slug, name, desc = entry
    if isinstance(sub_or_sec, int):
        # Direct subsection id
        sql = (
            f"INSERT INTO menu_items (subsection_id, slug, name, description, is_available, available_at, notes) "
            f"VALUES ({sub_or_sec}, '{slug}', $${name}$$, $${desc}$$, true, ARRAY['newry']::TEXT[], "
            f"'Added 2026-05-26 from unmatched photo triage') "
            f"ON CONFLICT (slug) DO NOTHING;"
        )
    else:
        # Section slug: pick the first subsection of that section
        section_slug = sub_or_sec
        sql = (
            f"INSERT INTO menu_items (subsection_id, slug, name, description, is_available, available_at, notes) "
            f"SELECT ss.id, '{slug}', $${name}$$, $${desc}$$, true, ARRAY['newry']::TEXT[], "
            f"'Added 2026-05-26 from unmatched photo triage' "
            f"FROM subsections ss JOIN sections s ON ss.section_id = s.id "
            f"WHERE s.slug = '{section_slug}' ORDER BY ss.id LIMIT 1 "
            f"ON CONFLICT (slug) DO NOTHING;"
        )
    new_items_sql.append(sql)
sql_lines.extend(new_items_sql)
sql_lines.append("")

# 2. UPDATE statements for bindings
sql_lines.append("-- 2. Bind photos to items (existing + newly inserted)")
for b in bindings:
    for tgt in b["targets"]:
        if tgt.startswith("NEW:"):
            item_name = tgt[4:].replace("'", "''")
            sql_lines.append(
                f"UPDATE menu_items SET image_url = '{b['target_path']}' WHERE name = $${item_name}$$;"
            )
        else:
            item_name = tgt.replace("'", "''")
            sql_lines.append(
                f"UPDATE menu_items SET image_url = '{b['target_path']}' WHERE name = $${item_name}$$;"
            )

PLAN_OUT.write_text("\n".join(sql_lines))
print(f"\nWrote {PLAN_OUT.relative_to(REPO)} ({sum(1 for l in sql_lines if l.startswith(('UPDATE','INSERT')))} statements)")
print("Run: review the SQL, then apply via Supabase MCP.")
