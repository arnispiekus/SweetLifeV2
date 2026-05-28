"""Batch image gen via direct Gemini (gemini-2.5-flash-image / Nano Banana Pro)."""
import json, os, sys, time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from PIL import Image
from google import genai

REPO = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
BRAND = Path("/Users/arnispiekus/Work/Github/ugc-engine/brands/sweet-life-newry")
LOG = REPO / "menu-extraction/sources/matches/batch_gemini_log.json"

SECTION_TO_REF_FOLDER = {
    "croissants": "croissants", "scones": "croissants", "other-pastries": "cakes",
    "acai-granola-bowl": "breakfast-bowls", "breakfast-brunch": "breakfast-bowls",
    "add-ice-cream": "ice-cream", "cakes-pies": "cakes", "cookies-small-bites": "cakes",
    "soft-serve-ice-cream": "ice-cream", "coffee": "lattes-coffee", "matcha": "lattes-coffee",
    "tea": "teas", "golden-toast": "golden-toast", "gluten-free": "cakes",
    "keto": "sandwiches", "vegan": "sandwiches", "create-your-own": "sandwiches",
    "mains": "bowls", "american-pancake": "souffle-pancakes", "crepe": "souffle-pancakes",
    "souffle-pancake": "souffle-pancakes", "waffle": "waffles", "salads": "salads",
    "sushi-platters": "sushi",
}

GENERIC = {"the","with","and","of","day","life","sweet","new","fresh","homemade","made","gf","v","k","decaf","mix","mixed"}

def pick_refs(name, ref_dir, max_refs=3):
    if not ref_dir or not ref_dir.exists(): return []
    toks = [t for t in name.lower().replace("(", " ").replace(")", " ").replace("'", "").replace("/", " ").replace("-", " ").split() if len(t) >= 4 and t not in GENERIC]
    if not toks: return []
    cands = [f for f in ref_dir.glob("*.*") if f.suffix.lower() in {".jpg",".jpeg",".png",".webp"} and f.is_file()]
    scored = []
    for f in cands:
        fn = f.name.lower().replace("-"," ").replace("_"," ")
        m = sum(1 for t in toks if t in fn)
        if m == 0: continue
        scored.append((m, f))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [f for _, f in scored[:max_refs]]

BRAND_PROMPT = """A real photograph of {item_name} for Sweet Life cafe in Newry, Northern Ireland — a Korean-inflected dessert cafe.

Setting & styling: served in off-white speckled ceramic with hand-thrown irregularity, on warm cream linen or pale marble cafe table. Background is warm cream paper or soft-focus cafe interior — never pure white, never neon.

Lighting: natural window light from upper-left, 4500K warm temperature, soft directional fall-off. Subtle contact shadow at base.

Composition: three-quarter angle from slightly above (20-30 degrees elevation), hero subject occupies 50-60% of frame. Shallow depth of field — front of subject tack sharp, soft falloff toward background. Square 1:1 aspect for menu thumbnails.

Aesthetic: editorial food photography, neighborhood cafe restraint. Real materials with real texture (ice crystals visible on shaved ice, crumb visible on baked goods, latte art with actual milk fold).

Strictly avoid: amber Instagram filter, plastic-looking AI sheen, perfect symmetry, anime/kawaii style, dotted-leader typography, gold-leaf accents, oversharpened HDR halos, generic stock-photo poses, synthetic geometry.

Item-specific notes: {item_specific}"""

SECTION_HINTS = {
    "bingsu": "Fine snow-like shaved-ice ribbons forming a tall sagging mound (NOT crushed ice, NOT a sorbet scoop). Drizzle of condensed milk visible. Flavor-appropriate toppings.",
    "signature-drinks": "Tall slender glass with ice cubes (if iced) and visible condensation. Fresh garnish (citrus slice, herb, fruit). Layered color visible through the glass.",
    "gourmet-lattes": "Ceramic cup or tall glass. Visible milk fold and crema. Saucer if applicable. Steam wisps for hot drinks; condensation for cold.",
    "coffee-tea": "Ceramic cup on saucer. Crema or tea color visible. Steam rising for hot drinks.",
    "cakes-cookies-bites": "Slice or piece on a small dessert plate, fork beside. Crumb and frosting texture visible. THIS IS A CAKE/COOKIE/DESSERT, not a drink.",
    "bakery-pastries": "On a wooden board or in a small basket. Crisp golden crust. THIS IS A BAKERY ITEM, not a drink.",
    "breakfast-brunch": "Plated on a wide ceramic plate, possibly with small garnish or side. Morning light feel. THIS IS A BREAKFAST DISH, not a drink.",
    "lunch": "Plated on speckled ceramic, side accompaniments visible (chips/fries/salad as applicable). THIS IS A LUNCH DISH, not a drink.",
    "salads": "Wide shallow bowl, fresh greens with vibrant color contrast. Vinaigrette glisten on leaves.",
    "keto-vegan-gluten-free": "Plated cleanly, looks like the regular menu version but with appropriate dietary attributes shown.",
    "pancakes-waffles": "Stack or single piece on a small plate, drizzle of syrup or sauce, fresh fruit garnish.",
    "golden-toast": "Korean golden toast — thick brioche cube hollowed and filled with ice cream + sauce + fruit. Square presentation.",
    "sushi-pre-order-only": "Slate board or wooden tray, assorted sushi pieces, pickled ginger + wasabi + soy dish as accompaniment.",
}

client = genai.Client(api_key=os.environ["SWEETLIFE_GEMINI_API_KEY"])

def gen_one(item):
    section = item["section_slug"]; sub = item["subsection_slug"]
    ref_subdir = SECTION_TO_REF_FOLDER.get(sub, "")
    ref_dir = BRAND / "references/products" / ref_subdir if ref_subdir else None
    refs = pick_refs(item["name"], ref_dir, 3)
    item_specific = SECTION_HINTS.get(section, "Plated clearly, single hero item, visible texture.")
    prompt = BRAND_PROMPT.format(item_name=item["name"], item_specific=item_specific)
    contents = [prompt]
    for r in refs:
        try: contents.append(Image.open(r))
        except Exception: pass
    for attempt in range(3):
        try:
            response = client.models.generate_content(model="gemini-2.5-flash-image", contents=contents)
            for part in response.candidates[0].content.parts:
                if hasattr(part, "inline_data") and part.inline_data and part.inline_data.data:
                    target_dir = REPO / "public/menu-photos" / section
                    target_dir.mkdir(parents=True, exist_ok=True)
                    target = target_dir / f"{item['slug']}-newgen.png"
                    target.write_bytes(part.inline_data.data)
                    return {"item_id": item["id"], "item_name": item["name"], "status": "ok",
                            "path": str(target.relative_to(REPO)), "refs": [r.name for r in refs]}
        except Exception as e:
            pass
        time.sleep(2 * (attempt + 1))
    return {"item_id": item["id"], "item_name": item["name"], "status": "fail"}

def main():
    items_path = REPO / "menu-extraction/sources/batch_items_remaining.json"
    items = json.load(open(items_path))
    print(f"Gemini batch: {len(items)} items")
    if "--apply" not in sys.argv:
        print("Dry run.")
        return
    log = {"started": time.time(), "results": []}
    LOG.write_text(json.dumps(log, indent=2))
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(gen_one, it): it for it in items}
        for i, fut in enumerate(as_completed(futs), 1):
            r = fut.result()
            log["results"].append(r)
            LOG.write_text(json.dumps(log, indent=2))
            print(f"  [{i}/{len(items)}] {r.get('status','?'):5s} {r.get('item_name','?')}", flush=True)
    ok = sum(1 for r in log["results"] if r["status"] == "ok")
    print(f"\nDone. ok={ok}/{len(items)}")

if __name__ == "__main__":
    main()
