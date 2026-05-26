"""Phase 4 social — IG feed, story, reels covers, Pinterest pins."""
import json, os, sys, time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from google import genai

REPO = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
OUT = REPO / "public/social/posts"
OUT.mkdir(parents=True, exist_ok=True)
LOG = REPO / "menu-extraction/sources/matches/phase4_social_log.json"
ITEMS = json.load(open(REPO / "menu-extraction/sources/phase4_social.json"))

client = genai.Client(api_key=os.environ["SWEETLIFE_GEMINI_API_KEY"])

BRAND = """
Sweet Life café — Korean-inflected dessert café in Newry, Northern Ireland.
Aesthetic: warm cream paper, terracotta + olive + gold accents, off-white speckled ceramic, marble or warm wood tables, natural window light from upper-left, editorial restraint.
Strictly avoid: amber Instagram filter, anime/kawaii style, plastic-looking AI sheen, dotted-leader typography, stock-photo poses, oversharpened HDR.
"""

def gen_one(item):
    full = f"{item['prompt']}\n\n{BRAND}\n\nReal photograph, photorealistic, editorial. Platform: {item['platform']}, aspect ratio {item['ratio']}."
    for attempt in range(3):
        try:
            response = client.models.generate_content(model="gemini-2.5-flash-image", contents=[full])
            for part in response.candidates[0].content.parts:
                if hasattr(part, "inline_data") and part.inline_data and part.inline_data.data:
                    target = OUT / f"{item['id']}.png"
                    target.write_bytes(part.inline_data.data)
                    return {"id": item["id"], "status": "ok"}
        except Exception: pass
        time.sleep(2 * (attempt + 1))
    return {"id": item["id"], "status": "fail"}

def main():
    if "--apply" not in sys.argv:
        print(f"Dry run: {len(ITEMS)}")
        return
    print(f"Phase 4 social — {len(ITEMS)} items")
    log = {"results": []}
    LOG.write_text(json.dumps(log, indent=2))
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(gen_one, it): it for it in ITEMS}
        for i, fut in enumerate(as_completed(futs), 1):
            r = fut.result()
            log["results"].append(r)
            LOG.write_text(json.dumps(log, indent=2))
            print(f"  [{i}/{len(ITEMS)}] {r.get('status','?'):5s} {r.get('id','?')}", flush=True)
    ok = sum(1 for r in log["results"] if r["status"] == "ok")
    print(f"\nDone. ok={ok}/{len(ITEMS)}")

if __name__ == "__main__":
    main()
