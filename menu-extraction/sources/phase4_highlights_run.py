"""Phase 4 — generate 12 IG highlight icons in a cohesive line-illustration style.

Output: public/social/highlights/<id>.png — 1080x1080 (IG crops to circle).
Style locked: minimalist single-line ink illustration on warm cream paper,
terracotta accent. Each icon centered, generous margin, no text.

Uses nano_banana_2 (2 credits/each). Skip product-photoshoot enhancer since
the style is line-art not photography — direct prompt is better.
"""
import json, os, subprocess, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REPO = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
OUT = REPO / "public/social/highlights"
OUT.mkdir(parents=True, exist_ok=True)
LOG = REPO / "menu-extraction/sources/matches/phase4_highlights_log.json"

ITEMS = json.load(open(REPO / "menu-extraction/sources/phase4_highlights.json"))

STYLE_BASE = """A minimalist Instagram-highlight icon for Sweet Life cafe — a Korean-inflected dessert cafe in Newry, Northern Ireland.

Style: single-line ink illustration in deep coffee-brown (#1c140d) with one accent of warm terracotta (#b94a2c). Drawn in a confident hand-drawn style — slightly imperfect, never sterile. NO text, NO words, NO logo.

Composition: square 1080x1080, generous negative space around the subject (will be cropped to a circle on Instagram). Subject centered, occupying central 50% of frame. Subject placed against a warm cream paper background (#f7f1e6) with subtle texture.

Aesthetic: editorial illustration, neighbourhood cafe character, Korean dessert cafe restraint. Forbidden: amber Instagram filter, anime/kawaii style, dotted-leader typography, generic stock-photo icons, gold-leaf accents, watercolour wash, kid-craft cuteness.

Subject for THIS icon: """

def gen_one(item: dict) -> dict:
    full_prompt = STYLE_BASE + item["subject"] + ".\n\nIntent: " + item["desc"]
    for attempt in range(3):
        try:
            r = subprocess.run(
                ["higgsfield", "generate", "create", "nano_banana_2",
                 "--prompt", full_prompt, "--wait"],
                capture_output=True, text=True, timeout=600,
            )
            if r.returncode == 0:
                for ln in reversed(r.stdout.splitlines()):
                    ln = ln.strip()
                    if ln.startswith("https://"):
                        target = OUT / f"{item['id']}.png"
                        urllib.request.urlretrieve(ln, target)
                        return {"id": item["id"], "status": "ok", "url": ln,
                                "path": str(target.relative_to(REPO))}
        except Exception:
            pass
        time.sleep(2 * (attempt + 1))
    return {"id": item["id"], "status": "fail"}

def main():
    if "--apply" not in sys.argv:
        print(f"Dry-run: would generate {len(ITEMS)} highlight icons.")
        return
    print(f"Phase 4 highlight icons — generating {len(ITEMS)}...")
    log = {"results": []}
    LOG.write_text(json.dumps(log, indent=2))
    with ThreadPoolExecutor(max_workers=2) as ex:
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
