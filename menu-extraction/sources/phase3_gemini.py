"""Phase 3 — ad creative packs via Gemini."""
import json, os, sys, time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from google import genai

REPO = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
OUT_BASE = REPO / "public/ad-creatives"
OUT_BASE.mkdir(parents=True, exist_ok=True)
LOG = REPO / "menu-extraction/sources/matches/phase3_log.json"
CAMPAIGNS = json.load(open(REPO / "menu-extraction/sources/phase3_campaigns.json"))

client = genai.Client(api_key=os.environ["SWEETLIFE_GEMINI_API_KEY"])

BRAND_BLOCK = """
Sweet Life café — Korean-inflected dessert café in Newry, Northern Ireland.
Aesthetic: warm cream paper background, terracotta + olive + gold accents, off-white speckled ceramic, marble or warm wood tables, natural window light from upper-left, editorial restraint. Korean dessert café character.
Strictly avoid: amber Instagram filter, anime/kawaii style, plastic-looking AI sheen, dotted-leader typography, gold-leaf accents, stock-photo poses, oversharpened HDR, generic café tropes.
"""

def gen_variant(campaign, variant_idx):
    full = f"""{campaign['prompt']}

{BRAND_BLOCK}

Product context: {campaign['product_context']}
Brand context: {campaign['brand_context']}

Channel: {campaign['channel']} ({campaign['format']}). Real photograph, photorealistic, editorial. Variant {variant_idx + 1} of {campaign['count']} — vary composition/angle slightly between variants.
Leave generous negative space for ad copy overlay."""
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash-image",
                contents=[full],
            )
            for part in response.candidates[0].content.parts:
                if hasattr(part, "inline_data") and part.inline_data and part.inline_data.data:
                    out_dir = OUT_BASE / campaign["id"]
                    out_dir.mkdir(parents=True, exist_ok=True)
                    target = out_dir / f"variant-{variant_idx + 1}.png"
                    target.write_bytes(part.inline_data.data)
                    return {"campaign": campaign["id"], "variant": variant_idx + 1, "status": "ok"}
        except Exception:
            pass
        time.sleep(2 * (attempt + 1))
    return {"campaign": campaign["id"], "variant": variant_idx + 1, "status": "fail"}

def main():
    if "--apply" not in sys.argv:
        print(f"Dry run: {len(CAMPAIGNS)} campaigns")
        return
    print(f"Phase 3 — {sum(c['count'] for c in CAMPAIGNS)} ad creatives across {len(CAMPAIGNS)} campaigns")
    log = {"results": []}
    LOG.write_text(json.dumps(log, indent=2))
    jobs = [(c, i) for c in CAMPAIGNS for i in range(c["count"])]
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(gen_variant, c, i): (c, i) for c, i in jobs}
        for i, fut in enumerate(as_completed(futs), 1):
            r = fut.result()
            log["results"].append(r)
            LOG.write_text(json.dumps(log, indent=2))
            print(f"  [{i}/{len(jobs)}] {r.get('status','?'):5s} {r.get('campaign','?')}-v{r.get('variant','?')}", flush=True)
    ok = sum(1 for r in log["results"] if r["status"] == "ok")
    print(f"\nDone. ok={ok}/{len(jobs)}")

if __name__ == "__main__":
    main()
