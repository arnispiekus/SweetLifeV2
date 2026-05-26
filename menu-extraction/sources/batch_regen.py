"""Regenerate bingsu (gpt_image_2) + drinks (nano_banana_2 via enhance-only)
using Higgsfield CLI. Per-item references chosen from labeled reference library.

Outputs: public/menu-photos/<section>/<slug>-newgen.png
DB updates: image_url set after each successful gen (incremental, crash-safe).
"""
import json
import os
import subprocess
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REPO = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
BRAND = Path("/Users/arnispiekus/Work/Github/ugc-engine/brands/sweet-life-newry")
LOG_PATH = REPO / "menu-extraction/sources/matches/batch_regen_log.json"

# subsection_slug → (ref folder under products/, model, credits)
ROUTING = {
    # Phase 1 part 1 (bingsu + drinks — already done)
    "korean-shaved-ice":     ("bingsu",            "gpt_image_2",     7),
    "milk-tea":              ("milk-teas",         "nano_banana_2",   2),
    "fruit-tea":             ("fruit-teas",        "nano_banana_2",   2),
    "frappes":               ("frappes",           "nano_banana_2",   2),
    "milkshakes":            ("milkshakes",        "nano_banana_2",   2),
    "protein-shakes":        ("protein-shakes",    "nano_banana_2",   2),
    "smoothies":             ("smoothies",         "nano_banana_2",   2),
    "refreshing-drinks":     ("fruit-teas",        "nano_banana_2",   2),
    "hot-chocolates":        ("lattes-coffee",     "nano_banana_2",   2),
    "lattes-coffee-blends":  ("lattes-coffee",     "nano_banana_2",   2),
    # Phase 1 part 2 — everything else
    "croissants":            ("croissants",        "nano_banana_2",   2),
    "scones":                ("croissants",        "nano_banana_2",   2),   # fallback: croissants folder has bakery-ish
    "other-pastries":        ("cakes",             "nano_banana_2",   2),
    "acai-granola-bowl":     ("breakfast-bowls",   "nano_banana_2",   2),
    "breakfast-brunch":      ("breakfast-bowls",   "nano_banana_2",   2),
    "add-ice-cream":         ("ice-cream",         "nano_banana_2",   2),
    "cakes-pies":            ("cakes",             "nano_banana_2",   2),
    "cookies-small-bites":   ("cakes",             "nano_banana_2",   2),
    "soft-serve-ice-cream":  ("ice-cream",         "nano_banana_2",   2),
    "coffee":                ("lattes-coffee",     "nano_banana_2",   2),
    "matcha":                ("lattes-coffee",     "nano_banana_2",   2),
    "tea":                   ("teas",              "nano_banana_2",   2),
    "golden-toast":          ("golden-toast",      "nano_banana_2",   2),
    "gluten-free":           ("cakes",             "nano_banana_2",   2),
    "keto":                  ("sandwiches",        "nano_banana_2",   2),
    "vegan":                 ("sandwiches",        "nano_banana_2",   2),
    "create-your-own":       ("sandwiches",        "nano_banana_2",   2),
    "mains":                 ("bowls",             "nano_banana_2",   2),
    "american-pancake":      ("souffle-pancakes",  "nano_banana_2",   2),
    "crepe":                 ("souffle-pancakes",  "nano_banana_2",   2),
    "souffle-pancake":       ("souffle-pancakes",  "nano_banana_2",   2),
    "waffle":                ("waffles",           "nano_banana_2",   2),
    "salads":                ("salads",            "nano_banana_2",   2),
    "sushi-platters":        ("sushi",             "nano_banana_2",   2),  # may not exist, fallback handled in pick_refs
}

GENERIC_TOKENS = {"the","with","and","of","day","life","sweet","new","fresh","homemade","made","gf","v","k","decaf","mix","mixed"}

def pick_refs(item_name: str, ref_dir: Path, max_refs: int = 3) -> list[Path]:
    """Pick refs that ACTUALLY match the item.

    Rules:
    1. Item-name tokens (≥4 chars, non-generic) must appear in ref filename.
    2. Only return refs that scored a substantive hit (>=1 distinctive match).
    3. If no good match exists, return [] — let the prompt enhancer drive
       generation alone rather than pollute with mismatched refs.
    """
    if not ref_dir.exists():
        return []
    raw_tokens = item_name.lower().replace("(", " ").replace(")", " ").replace("'", "").replace("/", " ").replace("-", " ").split()
    tokens = [t for t in raw_tokens if len(t) >= 4 and t not in GENERIC_TOKENS]
    if not tokens:
        return []
    candidates = [f for f in ref_dir.glob("*.*") if f.suffix.lower() not in {".heic"} and f.is_file()]
    scored = []
    for f in candidates:
        fn = f.name.lower().replace("-", " ").replace("_", " ")
        # Count distinct token matches (no double-counting)
        matches = sum(1 for t in tokens if t in fn)
        if matches == 0:
            continue   # don't include mismatched refs
        # Bonus for real photos
        if any(p in f.name for p in ["bingsu-assortment","bingsu-platter","fruit-bingsu","SweetLifeCafe_"]):
            matches += 0.5
        scored.append((matches, f))
    if not scored:
        return []
    scored.sort(key=lambda x: x[0], reverse=True)
    return [f for _, f in scored[:max_refs]]

def run(cmd, timeout=600):
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)

def run_with_retry(cmd, max_attempts=3, timeout=600):
    """Retry on failure (intermittent NSFW false positives). Returns last result."""
    last = None
    for attempt in range(max_attempts):
        r = run(cmd, timeout=timeout)
        if r.returncode == 0 and any(line.strip().startswith("https://") for line in r.stdout.splitlines()):
            return r
        last = r
        time.sleep(2 * (attempt + 1))    # backoff
    return last

def gen_bingsu(item: dict, refs: list[Path]) -> str | None:
    cmd = [
        "higgsfield", "product-photoshoot", "create",
        "--mode", "product_shot",
        "--prompt", f"{item['name']} — authentic Korean PATBINGSU shaved-ice dessert for café menu",
        "--product_context",
        "Critical: the ice must look like FRESHLY-SHAVED snow-like ice with fine flake texture — fluffy ribbons of frozen milk-cream stacked into a mound. NOT crushed ice. NOT sorbet. NOT a scoop. Authentic Korean bingsu machine output. Condensed milk drizzle. Section-appropriate toppings.",
        "--brand_context",
        "Sweet Life café — Korean dessert café. Off-white ceramic bowl with hand-thrown irregularity, warm cream paper background, natural window light from upper-left.",
    ]
    for r in refs:
        cmd += ["--image", str(r)]
    r = run_with_retry(cmd, max_attempts=3, timeout=600)
    if r.returncode != 0:
        return None
    # Last line of stdout is the URL
    for line in reversed(r.stdout.splitlines()):
        line = line.strip()
        if line.startswith("https://"):
            return line
    return None

def gen_drink(item: dict, refs: list[Path]) -> str | None:
    # Step 1: enhance-only (free)
    cmd1 = [
        "higgsfield", "product-photoshoot", "create",
        "--mode", "product_shot", "--enhance-only", "--json",
        "--prompt", f"{item['name']} — Sweet Life signature drink for café menu thumbnail",
        "--brand_context",
        "Sweet Life café — Korean dessert café. Tall slender glass with ice cubes if iced, or ceramic cup if hot. Fresh garnish (fruit, flowers, mint). Soft natural light from upper-left. Marble or warm cream café table, blurred warm café interior background. Real photograph, not synthetic AI.",
    ]
    for r in refs:
        cmd1 += ["--image", str(r)]
    r1 = run(cmd1, timeout=120)
    if r1.returncode != 0:
        return None
    try:
        enhanced = json.loads(r1.stdout)["prompts"][0]["prompt"]
    except Exception:
        return None
    # Step 2: generate
    cmd2 = ["higgsfield", "generate", "create", "nano_banana_2", "--prompt", enhanced, "--wait"]
    for r in refs:
        cmd2 += ["--image", str(r)]
    r2 = run_with_retry(cmd2, max_attempts=3, timeout=600)
    if r2.returncode != 0:
        return None
    for line in reversed(r2.stdout.splitlines()):
        line = line.strip()
        if line.startswith("https://"):
            return line
    return None

def process(item: dict, log: dict, lock=None) -> dict:
    sub = item["subsection_slug"]
    routing = ROUTING.get(sub)
    if not routing:
        return {"item_id": item["id"], "status": "skip", "reason": f"no routing for {sub}"}
    ref_subdir, model, credits = routing
    ref_dir = BRAND / "references/products" / ref_subdir
    refs = pick_refs(item["name"], ref_dir, max_refs=3)
    if not refs:
        return {"item_id": item["id"], "status": "skip", "reason": f"no refs in {ref_subdir}"}

    is_bingsu = model == "gpt_image_2"
    try:
        url = gen_bingsu(item, refs) if is_bingsu else gen_drink(item, refs)
    except Exception as e:
        return {"item_id": item["id"], "status": "error", "reason": str(e)[:200]}
    if not url:
        return {"item_id": item["id"], "status": "fail", "reason": "no url returned"}

    target_dir = REPO / "public/menu-photos" / item["section_slug"]
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / f"{item['slug']}-newgen.png"
    try:
        urllib.request.urlretrieve(url, target)
    except Exception as e:
        return {"item_id": item["id"], "status": "fail", "reason": f"download: {e}"[:200]}

    return {
        "item_id": item["id"], "item_name": item["name"], "status": "ok",
        "model": model, "credits": credits, "url": url,
        "local_path": str(target.relative_to(REPO / "public")),
        "image_url": "/" + str(target.relative_to(REPO / "public")),
        "refs_used": [r.name for r in refs],
    }

def main():
    items_path = REPO / "menu-extraction/sources/batch_items_remaining.json"
    if not items_path.exists():
        items_path = REPO / "menu-extraction/sources/batch_items.json"
    if not items_path.exists():
        print(f"ERROR: {items_path} missing — write item list first"); sys.exit(1)
    items = json.load(open(items_path))
    print(f"To regenerate: {len(items)} items")

    if "--apply" not in sys.argv:
        print("Dry run. Add --apply to execute.")
        return

    log = {"started": time.time(), "results": []}
    LOG_PATH.write_text(json.dumps(log, indent=2))

    # Lower parallelism to 2 to reduce intermittent NSFW false positives
    with ThreadPoolExecutor(max_workers=2) as ex:
        futures = {ex.submit(process, it, log): it for it in items}
        for i, fut in enumerate(as_completed(futures), 1):
            result = fut.result()
            log["results"].append(result)
            LOG_PATH.write_text(json.dumps(log, indent=2))
            status = result.get("status", "?")
            name = result.get("item_name", f"id={result.get('item_id')}")
            print(f"  [{i}/{len(items)}] {status:5s} {name}", flush=True)

    ok = sum(1 for r in log["results"] if r["status"] == "ok")
    fail = sum(1 for r in log["results"] if r["status"] == "fail")
    err = sum(1 for r in log["results"] if r["status"] == "error")
    skip = sum(1 for r in log["results"] if r["status"] == "skip")
    print(f"\nDone. ok={ok} fail={fail} error={err} skip={skip}")
    print(f"Log: {LOG_PATH}")

if __name__ == "__main__":
    main()
