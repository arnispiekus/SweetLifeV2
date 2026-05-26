"""Single test image generation: Taro Bingsu via gemini-2.5-flash-image."""
import os
import subprocess
from pathlib import Path
from google import genai
from PIL import Image

REFS_DIR = Path("/Users/arnispiekus/Work/Github/ugc-engine/brands/sweet-life-newry/references/products/bingsu")
OUT_DIR = Path("/Users/arnispiekus/Work/Github/sweet-life-v2/menu-extraction/sources/gen-tests")
OUT_DIR.mkdir(parents=True, exist_ok=True)

ref_imgs = sorted(REFS_DIR.glob("*.jpg"))[:2]
print(f"References: {[r.name for r in ref_imgs]}")

PROMPT = """A single Taro Bingsu — Korean shaved-ice dessert — for a café menu thumbnail. Square aspect ratio.

Subject: a tall, generous mound of finely shaved milky ice, gently sagging at the edges (real bingsu has soft ice that yields, never a perfect uniform pyramid). Taro flavor — pale violet color, drizzled with a thin condensed milk swirl over the top. A modest topping of crushed taro pieces and a few tiny mochi balls or red bean dots. Served in a wide, off-white ceramic bowl with a slightly rough thrown texture (not glossy, not logoed).

Composition: three-quarter angle from slightly above, hero subject occupies 60% of frame. Shallow depth of field — bowl tack sharp, soft fall-off in the background.

Lighting: natural window light from upper-left, warm color temperature (4500K), gentle shadow with visible texture in the ice crystals. Avoid harsh top-down lighting or ring-light look.

Background: warm cream-coloured weathered linen with subtle marble paper texture below the bowl. Out-of-focus warm tones, never pure white.

Aesthetic: editorial food photography, restrained styling. Real bingsu, not synthetic-looking AI. NO synthetic AI artifacts.

Avoid: amber Instagram filter, plastic-looking sheen, perfectly uniform geometric ice mound, anime/kawaii style."""

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
print("Generating…")
response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[PROMPT, Image.open(ref_imgs[0]), Image.open(ref_imgs[1])],
)

saved = []
for i, part in enumerate(response.candidates[0].content.parts):
    if hasattr(part, "inline_data") and part.inline_data and part.inline_data.data:
        out = OUT_DIR / f"taro-bingsu-test-{i}.png"
        out.write_bytes(part.inline_data.data)
        print(f"  Saved: {out}  ({len(part.inline_data.data)//1024} KB)")
        saved.append(out)
    elif part.text:
        print(f"  Text: {part.text[:200]}")

print(f"\nGenerated: {len(saved)} image(s)")
if saved:
    subprocess.run(["open", str(saved[0])], check=False)
