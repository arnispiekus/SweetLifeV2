"""Label the 187 SVG-extracted Canva photos using Gemini Vision.

For each image, get a short kebab-case label identifying the food/drink.
Save to references/svg-labels.json.
"""
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from google import genai
from google.genai import types

SRC_DIR = Path("/Users/arnispiekus/Work/Github/ugc-engine/brands/sweet-life-newry/references/aesthetics/canva-menu-svg")
MAP_PATH = SRC_DIR.parent.parent / "svg-labels.json"

if not SRC_DIR.exists():
    print(f"ERROR: {SRC_DIR} does not exist"); sys.exit(1)

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

SYSTEM_PROMPT = (
    "You are labeling food photography for Sweet Life café (a Korean-inflected dessert café in Newry, NI).\n"
    "The café sells: bingsu (Korean shaved-ice dessert), milk teas, fruit teas, smoothies, frappes, "
    "milkshakes, protein shakes, gourmet lattes, espresso drinks, sushi platters, soufflé pancakes, "
    "American pancakes, waffles, crêpes, golden toast, burgers, paninis, baguettes, salads, sandwiches, "
    "wraps, bagels, cakes, cookies, croissants, scones, bakery items, omelettes, breakfast plates, "
    "and various keto/vegan/GF variants.\n\n"
    "Look at the image and respond with ONE short label in lowercase-kebab-case identifying the dish.\n\n"
    "Examples of valid labels:\n"
    "- taro-bingsu\n"
    "- iced-matcha-latte\n"
    "- sourdough-pizza\n"
    "- chocolate-cake-slice\n"
    "- belgian-waffle-strawberry\n"
    "- bingsu-generic\n"
    "- drink-generic\n"
    "- food-generic\n"
    "- not-food\n"
    "- paper-texture\n"
    "- logo\n\n"
    "Be SPECIFIC when you can identify the flavor or variant. If unsure, use the -generic forms.\n"
    "Reply with ONLY the label. No prose, no quotes, no punctuation other than hyphens."
)

EXT_TO_MIME = {".png": "image/png", ".jpeg": "image/jpeg", ".jpg": "image/jpeg",
               ".webp": "image/webp", ".gif": "image/gif"}

def label_image(path: Path) -> tuple[str, str]:
    media_type = EXT_TO_MIME.get(path.suffix.lower(), "image/jpeg")
    try:
        img_bytes = path.read_bytes()
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                max_output_tokens=20,
                temperature=0.1,
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
            contents=[
                types.Part.from_bytes(data=img_bytes, mime_type=media_type),
            ],
        )
        text = (response.text or "").strip().lower()
        label = "".join(c if c.isalnum() or c == "-" else "" for c in text.split("\n")[0])
        return (path.name, label or "unlabeled")
    except Exception as e:
        return (path.name, f"ERROR:{type(e).__name__}:{str(e)[:80]}")

def main():
    files = sorted(SRC_DIR.glob("*.*"))
    files = [f for f in files if f.suffix.lower() in EXT_TO_MIME]
    print(f"Labeling {len(files)} images with Gemini 2.0 Flash...")

    labels: dict[str, str] = {}
    start = time.time()
    with ThreadPoolExecutor(max_workers=4) as ex:    # Gemini has tighter rate limits
        for i, (name, label) in enumerate(ex.map(label_image, files), 1):
            labels[name] = label
            if i % 20 == 0 or i == len(files):
                elapsed = time.time() - start
                print(f"  {i}/{len(files)} in {elapsed:.1f}s — last: {name} → {label}")

    MAP_PATH.write_text(json.dumps(labels, indent=2, sort_keys=True))
    print(f"\nLabels → {MAP_PATH}")

    from collections import Counter
    counter = Counter(labels.values())
    print(f"\nUnique labels: {len(counter)}")
    print(f"Top 20 labels:")
    for label, n in counter.most_common(20):
        print(f"  {n:3d}  {label}")
    errs = sum(1 for l in labels.values() if l.startswith("error"))
    print(f"\nErrors: {errs}")

if __name__ == "__main__":
    main()
