"""Phase 3 — generate ad creative packs.

For each campaign, run higgsfield product-photoshoot create --mode
ad_creative_pack — Higgsfield generates a coordinated pack of static ad
variants sized for Meta/TikTok/Pinterest/Google sizes.

Output: public/ad-creatives/<campaign_id>/<n>.png
"""
import json, os, subprocess, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REPO = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
BRAND = Path("/Users/arnispiekus/Work/Github/ugc-engine/brands/sweet-life-newry")
OUT_BASE = REPO / "public/ad-creatives"
OUT_BASE.mkdir(parents=True, exist_ok=True)
LOG = REPO / "menu-extraction/sources/matches/phase3_log.json"

CAMPAIGNS = json.load(open(REPO / "menu-extraction/sources/phase3_campaigns.json"))

def pick_brand_refs(camp_id: str, n: int = 3) -> list[Path]:
    """Pull 2-3 brand-aligned references."""
    # Use top professional Deliveroo + clean menu shots
    pools = [
        BRAND / "references/products/bingsu" if "bingsu" in camp_id else None,
        BRAND / "references/products/lattes-coffee" if any(k in camp_id for k in ["drinks","brunch","emergency","bao"]) else None,
        BRAND / "references/products/milk-teas" if "drinks" in camp_id else None,
        BRAND / "references/products/breakfast-bowls" if "brunch" in camp_id else None,
    ]
    refs = []
    for p in pools:
        if p is None or not p.exists():
            continue
        cands = [f for f in p.glob("*.*") if f.suffix.lower() not in {".heic"} and f.is_file()][:2]
        refs.extend(cands)
    return refs[:n]

def run_one(camp: dict) -> dict:
    refs = pick_brand_refs(camp["id"])
    cmd = [
        "higgsfield", "product-photoshoot", "create",
        "--mode", "ad_creative_pack",
        "--prompt", camp["prompt"],
        "--product_context", camp["product_context"],
        "--brand_context", camp["brand_context"],
        "--count", str(camp.get("count", 3)),
    ]
    for r in refs:
        cmd += ["--image", str(r)]
    for attempt in range(3):
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=900)
            if res.returncode == 0:
                urls = [ln.strip() for ln in res.stdout.splitlines() if ln.strip().startswith("https://")]
                if urls:
                    out_dir = OUT_BASE / camp["id"]
                    out_dir.mkdir(parents=True, exist_ok=True)
                    paths = []
                    for i, url in enumerate(urls):
                        target = out_dir / f"variant-{i+1}.png"
                        urllib.request.urlretrieve(url, target)
                        paths.append(str(target.relative_to(REPO)))
                    return {"id": camp["id"], "status": "ok", "count": len(urls), "paths": paths}
        except Exception:
            pass
        time.sleep(3 * (attempt + 1))
    return {"id": camp["id"], "status": "fail"}

def main():
    if "--apply" not in sys.argv:
        print(f"Dry-run: would generate {len(CAMPAIGNS)} ad creative packs.")
        for c in CAMPAIGNS:
            print(f"  {c['id']}: {c['count']} variants for {c['channel']} / {c['format']}")
        return
    print(f"Phase 3 — generating {len(CAMPAIGNS)} ad creative packs...")
    log = {"results": []}
    LOG.write_text(json.dumps(log, indent=2))
    # Sequential — ad packs are heavy
    for i, camp in enumerate(CAMPAIGNS, 1):
        r = run_one(camp)
        log["results"].append(r)
        LOG.write_text(json.dumps(log, indent=2))
        print(f"  [{i}/{len(CAMPAIGNS)}] {r.get('status','?'):5s} {r.get('id','?')} ({r.get('count',0)} variants)", flush=True)
    ok = sum(1 for r in log["results"] if r["status"] == "ok")
    print(f"\nDone. ok={ok}/{len(CAMPAIGNS)}")

if __name__ == "__main__":
    main()
