"""Phase 5 — 4 product video tests via Higgsfield veo3_1_lite."""
import json, os, subprocess, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REPO = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
OUT = REPO / "public/videos"
OUT.mkdir(parents=True, exist_ok=True)
LOG = REPO / "menu-extraction/sources/matches/phase5_log.json"
ITEMS = json.load(open(REPO / "menu-extraction/sources/phase5_video.json"))

def gen_one(item):
    cmd = ["higgsfield", "generate", "create", item["model"],
           "--prompt", item["prompt"], "--wait", "--wait-timeout", "15m"]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=1200)
        if r.returncode == 0:
            for line in reversed(r.stdout.splitlines()):
                line = line.strip()
                if line.startswith("https://"):
                    ext = "mp4" if "mp4" in line.lower() else "mp4"
                    target = OUT / f"{item['id']}.{ext}"
                    urllib.request.urlretrieve(line, target)
                    return {"id": item["id"], "status": "ok", "url": line, "path": str(target.relative_to(REPO))}
    except Exception as e:
        pass
    return {"id": item["id"], "status": "fail"}

def main():
    if "--apply" not in sys.argv:
        print(f"Dry: {len(ITEMS)} videos")
        return
    print(f"Phase 5 video — {len(ITEMS)} items")
    log = {"results": []}
    LOG.write_text(json.dumps(log, indent=2))
    with ThreadPoolExecutor(max_workers=2) as ex:    # video is heavy; only 2 at a time
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
