"""Label all unlabeled reference images with Gemini Vision, then sort them
into section folders under references/products/<section>/.

Targets:
  - references/aesthetics/canva-menu-pdf-extra/  (591 PDF extracts)
  - references/products/usb-library/             (42 mum's USB photos)
  - references/products/images-sweet-life-images/ (47 misc photos)
  - references/products/menu-item-photos-extra/   (25 extras)
  - references/products/video-stills/             (104 video stills)
  - references/products/images-_archive/         (6 old menus)
  - references/products/images-design-refs/      (4 misc design refs)

Skip: anything already in a *labeled* section folder (bingsu/, drinks/, etc.)
and anything in canva-menu-svg/ (already labeled).

Routes by label to:
  references/products/bingsu/, drinks/, food/, bakery/, cakes/, lunch/,
  breakfast/, sushi/, lattes/, frappes/, smoothies/, milkshakes/, salads/,
  pancakes-waffles/, signature/, savory/, unknown/
"""
import json
import os
import shutil
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from google import genai
from google.genai import types

BRAND = Path("/Users/arnispiekus/Work/Github/ugc-engine/brands/sweet-life-newry")
REFS = BRAND / "references"

# Folders to label + sort (path -> True if route into products/, False if stays aesthetic)
TARGETS = [
    (REFS / "aesthetics/canva-menu-pdf-extra",      True),
    (REFS / "products/usb-library",                 True),
    (REFS / "products/images-sweet-life-images",    True),
    (REFS / "products/menu-item-photos-extra",      True),
    (REFS / "products/video-stills",                True),
    (REFS / "products/images-_archive",             True),
    (REFS / "products/images-design-refs",          False),  # keep as aesthetic
    (REFS / "products/food",                        True),   # already named, but resort to specific section
    (REFS / "products/drinks",                      True),
    (REFS / "products/bingsu",                      True),
    (REFS / "products/deliveroo",                   True),
]

# Section routing by label keyword
def route_label(label: str) -> str:
    l = label.lower()
    if any(k in l for k in ["bingsu"]):
        return "bingsu"
    if any(k in l for k in ["milkshake", "milk-shake"]):
        return "milkshakes"
    if any(k in l for k in ["protein-shake"]):
        return "protein-shakes"
    if any(k in l for k in ["frappe"]):
        return "frappes"
    if any(k in l for k in ["smoothie"]):
        return "smoothies"
    if any(k in l for k in ["milk-tea", "boba"]):
        return "milk-teas"
    if "tea" in l and ("fruit" in l or "jasmine" in l or "assam" in l or "lychee" in l or "passionfruit" in l or "lemon" in l):
        return "fruit-teas"
    if any(k in l for k in ["latte", "espresso", "americano", "cappuccino", "mocha", "macchiato", "flat-white", "hot-chocolate", "matcha"]):
        return "lattes-coffee"
    if any(k in l for k in ["mojito", "refresher", "velvet-sip", "oasis"]):
        return "refreshing-drinks"
    if "tea" in l:
        return "teas"
    if any(k in l for k in ["bingsu"]):
        return "bingsu"
    if any(k in l for k in ["souffle-pancake", "soufflé-pancake", "soufle-pancake"]):
        return "souffle-pancakes"
    if any(k in l for k in ["waffle"]):
        return "waffles"
    if any(k in l for k in ["pancake"]):
        return "pancakes"
    if any(k in l for k in ["golden-toast", "toast"]):
        return "golden-toast"
    if any(k in l for k in ["sushi", "roll", "platter", "maki", "nigiri"]):
        return "sushi"
    if any(k in l for k in ["burger"]):
        return "burgers"
    if any(k in l for k in ["pizza", "quesadilla"]):
        return "pizza-quesadilla"
    if any(k in l for k in ["bagel"]):
        return "bagels"
    if any(k in l for k in ["sandwich", "toastie", "panini"]):
        return "sandwiches"
    if any(k in l for k in ["baguette", "wrap"]):
        return "wraps-baguettes"
    if any(k in l for k in ["taco", "burrito"]):
        return "tacos"
    if any(k in l for k in ["ramen", "soup", "noodle"]):
        return "ramen-soup"
    if any(k in l for k in ["pasta", "tagliatelle"]):
        return "pasta"
    if any(k in l for k in ["bowl", "poke", "bibimbap", "rice"]):
        return "bowls"
    if any(k in l for k in ["jacket-potato"]):
        return "lunch-other"
    if any(k in l for k in ["fries", "chips", "goujons"]):
        return "sides"
    if any(k in l for k in ["salad", "caprese", "caesar"]):
        return "salads"
    if any(k in l for k in ["acai", "granola", "smoothie-bowl"]):
        return "breakfast-bowls"
    if any(k in l for k in ["omelette", "egg", "french-toast", "porridge", "breakfast-muffin", "salmon-sunrise", "ciabatta"]):
        return "breakfast"
    if any(k in l for k in ["croissant"]):
        return "croissants"
    if any(k in l for k in ["scone"]):
        return "scones"
    if any(k in l for k in ["muffin"]):
        return "muffins"
    if any(k in l for k in ["donut", "doughnut"]):
        return "donuts"
    if any(k in l for k in ["danish", "cinnamon-bun", "sausage-roll", "pie"]):
        return "bakery"
    if any(k in l for k in ["cake", "cheesecake", "gateaux", "gateau", "tiramisu", "rocky-road", "brownie", "cookie", "macaroon", "biscuit", "dubai-chocolate"]):
        return "cakes"
    if any(k in l for k in ["soft-serve", "ice-cream", "icecream"]):
        return "ice-cream"
    if any(k in l for k in ["frappe-generic", "drink-generic", "drinks"]):
        return "drinks-generic"
    if any(k in l for k in ["food-generic"]):
        return "food-generic"
    if any(k in l for k in ["not-food", "logo", "paper-texture", "background", "decoration", "border", "wordmark", "watermark", "icon"]):
        return "_aesthetic"
    return "unsorted"

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

SYSTEM_PROMPT = (
    "You are labeling food photography for Sweet Life café (Korean-inflected dessert café).\n"
    "Sells: bingsu, milk teas, fruit teas, smoothies, frappes, milkshakes, protein shakes, "
    "gourmet lattes, espresso, sushi platters, soufflé pancakes, American pancakes, waffles, crêpes, "
    "golden toast, burgers, paninis, baguettes, salads, sandwiches, wraps, bagels, cakes, cookies, "
    "croissants, scones, bakery, omelettes, breakfast plates, keto/vegan/GF variants.\n\n"
    "Reply with ONE label in lowercase-kebab-case identifying the dish.\n"
    "Be specific when you can (e.g. taro-bingsu, iced-matcha-latte, sourdough-pizza, chocolate-cake-slice, brown-sugar-milk-tea).\n"
    "Use -generic fallbacks (bingsu-generic, drink-generic, food-generic) if flavor unclear.\n"
    "Use 'logo', 'paper-texture', 'not-food' for backgrounds/branding.\n"
    "Reply with ONLY the label. No prose, no quotes."
)

EXT_TO_MIME = {".png":"image/png",".jpeg":"image/jpeg",".jpg":"image/jpeg",
               ".webp":"image/webp",".gif":"image/gif",".tiff":"image/tiff",
               ".heic":"image/heic"}

def label_one(path: Path) -> tuple[Path, str]:
    media_type = EXT_TO_MIME.get(path.suffix.lower(), "image/jpeg")
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                max_output_tokens=20,
                temperature=0.1,
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
            contents=[types.Part.from_bytes(data=path.read_bytes(), mime_type=media_type)],
        )
        text = (response.text or "").strip().lower().split("\n")[0]
        label = "".join(c if c.isalnum() or c == "-" else "" for c in text)
        return (path, label or "unlabeled")
    except Exception as e:
        return (path, f"error-{type(e).__name__.lower()}")

def main():
    if "--apply" not in sys.argv:
        print("Dry-run mode. Re-run with --apply to label + sort.")
        # Just count
        for tdir, _ in TARGETS:
            if tdir.exists():
                files = [f for f in tdir.glob("*.*") if f.suffix.lower() in EXT_TO_MIME]
                print(f"  {tdir.relative_to(BRAND)}: {len(files)} files")
        return

    # Collect all files
    targets: list[tuple[Path, bool]] = []
    for tdir, into_products in TARGETS:
        if not tdir.exists():
            continue
        for f in tdir.glob("*.*"):
            if f.suffix.lower() in EXT_TO_MIME:
                targets.append((f, into_products))
    print(f"To label: {len(targets)} files")

    # Label all
    labels: dict[str, str] = {}
    start = time.time()
    with ThreadPoolExecutor(max_workers=4) as ex:
        for i, (p, label) in enumerate(ex.map(lambda x: label_one(x[0]), targets), 1):
            labels[str(p)] = label
            if i % 50 == 0 or i == len(targets):
                print(f"  {i}/{len(targets)} in {time.time()-start:.1f}s — last: {p.name} → {label}")

    # Save labels manifest
    (BRAND / "references/all-labels.json").write_text(json.dumps(
        {str(k): v for k, v in labels.items()}, indent=2, sort_keys=True))

    # Sort by routing
    print("\nSorting into section folders...")
    moved = 0
    for (path, into_products), label in zip(targets, labels.values()):
        section = route_label(label)
        if section == "_aesthetic":
            dest_dir = REFS / "aesthetics/decorative"
        else:
            dest_dir = REFS / f"products/{section}"
        dest_dir.mkdir(parents=True, exist_ok=True)
        new_name = f"{label}-{path.stem}{path.suffix}"
        dest = dest_dir / new_name
        if dest.exists():
            continue
        try:
            shutil.move(str(path), str(dest))
            moved += 1
        except Exception as e:
            print(f"  FAIL move {path}: {e}")
    print(f"Moved: {moved}")

    # Section counts
    print("\nFinal reference library by section:")
    for sub in sorted((REFS / "products").iterdir()):
        if sub.is_dir():
            n = sum(1 for f in sub.iterdir() if f.is_file())
            if n > 0:
                print(f"  {sub.name}: {n}")

if __name__ == "__main__":
    main()
