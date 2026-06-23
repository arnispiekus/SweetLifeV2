"""Quality-check generated menu images via Gemini Vision.

For each public/menu-photos/<section>/<slug>-newgen.png:
  - Send to gemini-2.5-flash with the item name
  - Ask: does this image match the item? OK / BAD: reason
  - Save to matches/quality_review.json
  - Print summary + list of BAD items
"""
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from google import genai
from google.genai import types

REPO = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
OUT = REPO / "menu-extraction/sources/matches/quality_review.json"

# Load all batch items to know name+slug mappings
batch_full = json.load(open(REPO / "menu-extraction/sources/batch_items.json"))
batch_phase1b = json.load(open(REPO / "menu-extraction/sources/batch_items_remaining.json"))
# Plus original Phase 1 part 1 — load from DB or just enumerate from public/menu-photos
all_items = {it["slug"]: it for it in batch_full + batch_phase1b}

# Also enumerate any newgen files
for f in (REPO / "public/menu-photos").rglob("*-newgen.png"):
    slug = f.stem.replace("-newgen", "")
    if slug not in all_items:
        # Reverse-engineer name from slug
        name = " ".join(w.capitalize() for w in slug.split("-"))
        section = f.parent.name
        all_items[slug] = {"slug": slug, "name": name, "section_slug": section}

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

SYSTEM = (
    "You are a quality reviewer for Sweet Life café menu photography. "
    "Look at the image and decide if it's a faithful, brand-aligned representation of the named menu item.\n\n"
    "Pass criteria:\n"
    "- Subject IS the named dish (not a generic substitute)\n"
    "- Looks like real photography, not synthetic AI sheen\n"
    "- Warm cream / wood / marble background (no neon, no Instagram amber)\n"
    "- No clearly wrong elements (e.g., bingsu with cake, latte with smoothie)\n\n"
    "Reply with exactly one line:\n"
    "  OK\n"
    "OR\n"
    "  BAD: <specific reason in <60 chars>\n\n"
    "Examples:\n"
    "  OK\n"
    "  BAD: shows granola, not the named egg toast\n"
    "  BAD: bingsu texture is melted, looks like sorbet not snow\n"
    "  BAD: plastic-looking synthetic sheen, AI fake\n"
    "  BAD: wrong subject — image is a croissant but item is a scone\n"
)

def check_one(slug: str, item: dict, img_path: Path) -> dict:
    try:
        with open(img_path, "rb") as f:
            data = f.read()
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM,
                max_output_tokens=60,
                temperature=0.0,
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
            contents=[
                types.Part.from_bytes(data=data, mime_type="image/png"),
                f"Item name: {item['name']}\n\nVerdict?",
            ],
        )
        text = (response.text or "").strip().split("\n")[0]
        verdict = "ok" if text.upper().startswith("OK") else "bad"
        reason = text.replace("BAD:", "").strip() if verdict == "bad" else ""
        return {"slug": slug, "name": item["name"], "section": item.get("section_slug"),
                "verdict": verdict, "reason": reason, "raw": text}
    except Exception as e:
        return {"slug": slug, "verdict": "error", "reason": str(e)[:120]}

def main():
    files = list((REPO / "public/menu-photos").rglob("*-newgen.png"))
    print(f"To quality-check: {len(files)} images")
    targets = []
    for f in files:
        slug = f.stem.replace("-newgen", "")
        item = all_items.get(slug)
        if item:
            targets.append((slug, item, f))
    print(f"  Matched to known items: {len(targets)}")

    results = []
    start = time.time()
    with ThreadPoolExecutor(max_workers=4) as ex:
        for i, r in enumerate(ex.map(lambda t: check_one(*t), targets), 1):
            results.append(r)
            if i % 30 == 0:
                print(f"  {i}/{len(targets)} in {time.time()-start:.0f}s")

    OUT.write_text(json.dumps(results, indent=2))
    ok = sum(1 for r in results if r["verdict"] == "ok")
    bad = [r for r in results if r["verdict"] == "bad"]
    err = [r for r in results if r["verdict"] == "error"]
    print(f"\nOK: {ok}, BAD: {len(bad)}, ERROR: {len(err)}")
    print(f"\nBAD list:")
    for r in bad:
        print(f"  {r['section']:25s} {r['name'][:40]:40s} — {r['reason']}")
    if err:
        print(f"\nERROR list:")
        for r in err[:10]:
            print(f"  {r.get('slug','?')}: {r.get('reason','')[:100]}")

if __name__ == "__main__":
    main()
