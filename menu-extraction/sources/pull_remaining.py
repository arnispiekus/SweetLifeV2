"""Pull all remaining Sweet Life images from mum's Drive that we missed:
  - All images recursively in /Sweet Life Images/ (deeper than direct children)
  - All images in /Sweet Life Video/ (mixed with video content)
  - All loose images in /Sweet Life Menu Item Photos/ root (Beverages + extras)

Skips: /PJ Export LTD/, /Google Pixel 9 Pro XL/, /Scotch hall/, /Saved from Chrome/ (unrelated).
"""
import json, os, sys, urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from composio import Composio

REPO = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
BRAND = Path("/Users/arnispiekus/Work/Github/ugc-engine/brands/sweet-life-newry")
FLAT = json.load(open(REPO / "menu-extraction/sources/drive/ruta_mum/flat.json"))

IMG_MIMES = {"image/jpeg","image/png","image/webp","image/heif","image/tiff","image/gif"}
INCLUDE_ROOTS = ["/Sweet Life Images/", "/Sweet Life Video/", "/Sweet Life Menu Item Photos/"]

# Build set of already-local image stems (across both repos) to skip dupes
LOCAL_NAMES = set()
for d in [REPO / "public/menu-photos", BRAND / "references"]:
    if d.exists():
        for f in d.rglob("*.*"):
            if f.suffix.lower() in {".jpg",".jpeg",".png",".webp",".heic",".tiff"}:
                LOCAL_NAMES.add(f.name)
                # Also try common renames (Drive uses spaces, locally we use dashes)
                LOCAL_NAMES.add(f.name.replace("-", " "))
                LOCAL_NAMES.add(f.name.replace(" ", "-"))

def section_from_drive_path(path: str) -> str:
    """Route Drive path to the brand reference subfolder."""
    if path.startswith("/Sweet Life Images/"):
        # Strip prefix, take next folder, fall back to misc
        parts = path[len("/Sweet Life Images/"):].split("/")
        sub = parts[0] if parts and parts[0] else "misc"
        return f"products/images-{sub.lower().replace(' ', '-')}"
    if path.startswith("/Sweet Life Video/"):
        return "products/video-stills"
    if path.startswith("/Sweet Life Menu Item Photos/"):
        return "products/menu-item-photos-extra"
    return "products/misc"

# Collect missed images
targets = []
for f in FLAT:
    if f["mimeType"] not in IMG_MIMES:
        continue
    if not any(f["path"].startswith(r) for r in INCLUDE_ROOTS):
        continue
    if f["name"] in LOCAL_NAMES:
        continue
    if f["name"].startswith(".DS_Store"):
        continue
    if f["path"].count("/") < 2:  # weird trailing-slash entries
        continue
    targets.append(f)

print(f"Images to pull: {len(targets)}")

# Group by destination
by_dest = {}
for t in targets:
    dest = section_from_drive_path(t["path"])
    by_dest.setdefault(dest, []).append(t)

print("\nBy destination:")
for dest, items in sorted(by_dest.items()):
    print(f"  {dest}: {len(items)}")

if "--apply" not in sys.argv:
    print("\n(Dry run. Re-run with --apply to download.)")
    sys.exit(0)

# Live download
composio = Composio(api_key=os.environ["COMPOSIO_API_KEY"])

def download_one(item, dest_dir: Path):
    target = dest_dir / item["name"]
    if target.exists():
        return ("skipped", item["name"])
    try:
        r = composio.tools.execute(
            "GOOGLEDRIVE_DOWNLOAD_FILE", user_id="Ruta - Mum",
            arguments={"file_id": item["id"]},
            dangerously_skip_version_check=True,
        )
        s3 = r["data"]["downloaded_file_content"]["s3url"]
        data = urllib.request.urlopen(s3).read()
        target.write_bytes(data)
        return ("downloaded", item["name"])
    except Exception as e:
        return ("failed", f"{item['name']}: {str(e)[:120]}")

total_ok = total_skip = total_fail = 0
for dest, items in sorted(by_dest.items()):
    dest_dir = BRAND / "references" / dest
    dest_dir.mkdir(parents=True, exist_ok=True)
    print(f"\n→ {dest} ({len(items)} items)")
    with ThreadPoolExecutor(max_workers=6) as ex:
        results = list(ex.map(lambda x: download_one(x, dest_dir), items))
    ok = sum(1 for r in results if r[0]=="downloaded")
    sk = sum(1 for r in results if r[0]=="skipped")
    fail = [r for r in results if r[0]=="failed"]
    total_ok += ok; total_skip += sk; total_fail += len(fail)
    print(f"  downloaded={ok}, skipped={sk}, failed={len(fail)}")
    for f in fail[:3]:
        print(f"    FAIL: {f[1]}")

print(f"\nSummary: downloaded={total_ok}, skipped={total_skip}, failed={total_fail}")
