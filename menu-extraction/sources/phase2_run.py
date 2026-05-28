"""Phase 2 — generate website hero / lifestyle imagery.

Each item gets product-photoshoot create (mode = lifestyle_scene |
closeup_product_with_person | hero_banner) — these modes use gpt_image_2
under the hood (~7 credits each). Output → public/website-images/<id>.png.

Higher quality than nano_banana_2 (the model handles complex multi-subject
compositions better) — appropriate for hero shots that users see first.
"""
import json, os, subprocess, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REPO = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
BRAND = Path("/Users/arnispiekus/Work/Github/ugc-engine/brands/sweet-life-newry")
OUT_DIR = REPO / "public/website-images"
OUT_DIR.mkdir(parents=True, exist_ok=True)
LOG = REPO / "menu-extraction/sources/matches/phase2_log.json"

ITEMS = json.load(open(REPO / "menu-extraction/sources/phase2_items.json"))

# Reference pools by subject category — feed 2-3 brand-aligned refs into each gen
REF_POOLS = {
    "bingsu":   BRAND / "references/products/bingsu",
    "drinks":   BRAND / "references/products/milk-teas",
    "lattes":   BRAND / "references/products/lattes-coffee",
    "cakes":    BRAND / "references/products/cakes",
    "lunch":    BRAND / "references/products/bowls",
    "breakfast":BRAND / "references/products/breakfast-bowls",
    "waffles":  BRAND / "references/products/waffles",
    "bakery":   BRAND / "references/products/croissants",
    "salads":   BRAND / "references/products/salads",
    "sushi":    BRAND / "references/products/sushi",
    "interior": BRAND / "references/aesthetics/canva-menu-svg",   # fallback aesthetic
}

def pick_refs(item: dict) -> list[Path]:
    """Choose 2-3 references that match the item subject."""
    name = item["name"].lower()
    pool_keys = []
    for k in REF_POOLS:
        if k in name or k in item["prompt"].lower():
            pool_keys.append(k)
    if not pool_keys:
        pool_keys = ["interior"]
    refs = []
    for k in pool_keys:
        pool = REF_POOLS[k]
        if pool.exists():
            cands = [f for f in pool.glob("*.*") if f.suffix.lower() not in {".heic"} and f.is_file()][:2]
            refs.extend(cands)
        if len(refs) >= 3:
            break
    return refs[:3]

def run_one(item: dict) -> dict:
    refs = pick_refs(item)
    cmd = [
        "higgsfield", "product-photoshoot", "create",
        "--mode", item["mode"],
        "--prompt", item["prompt"],
        "--brand_context",
        "Sweet Life café in Newry — Korean-inflected dessert café. Warm cream paper, terracotta + olive + gold accents, off-white speckled ceramic, marble or warm wood tables, natural window light from upper-left. Editorial restraint. Forbidden: amber Instagram filter, anime/kawaii style, plastic-looking sheen, dotted-leader typography.",
    ]
    for r in refs:
        cmd += ["--image", str(r)]
    for attempt in range(3):
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
            if res.returncode == 0:
                for line in reversed(res.stdout.splitlines()):
                    line = line.strip()
                    if line.startswith("https://"):
                        # Download
                        target = OUT_DIR / f"{item['id']}.png"
                        urllib.request.urlretrieve(line, target)
                        return {"id": item["id"], "status": "ok", "url": line,
                                "path": str(target.relative_to(REPO)),
                                "refs": [r.name for r in refs]}
        except Exception as e:
            pass
        time.sleep(2 * (attempt + 1))
    return {"id": item["id"], "status": "fail", "name": item["name"]}

def main():
    if "--apply" not in sys.argv:
        print(f"Dry-run: would generate {len(ITEMS)} website images.")
        return
    print(f"Phase 2 — generating {len(ITEMS)} website hero/lifestyle images...")
    log = {"results": []}
    LOG.write_text(json.dumps(log, indent=2))
    with ThreadPoolExecutor(max_workers=2) as ex:
        futs = {ex.submit(run_one, it): it for it in ITEMS}
        for i, fut in enumerate(as_completed(futs), 1):
            r = fut.result()
            log["results"].append(r)
            LOG.write_text(json.dumps(log, indent=2))
            print(f"  [{i}/{len(ITEMS)}] {r.get('status','?'):5s} {r.get('id','?')}", flush=True)
    ok = sum(1 for r in log["results"] if r["status"] == "ok")
    print(f"\nDone. ok={ok}/{len(ITEMS)}")

if __name__ == "__main__":
    main()
