"""Pull additional reference photos from mum's Drive into the brand profile.

Targets:
  /Sweet Life Images/deliveroo/    → references/products/deliveroo/
  /Sweet Life Images/food/         → references/products/food/
  /Sweet Life Images/drinks/       → references/products/drinks/
  /Sweet Life Images/bingsu/       → references/products/bingsu/
  /Sweet Life Images/usb-library/  → references/products/usb-library/
  /Sweet Life Images/design-refs/  → references/aesthetics/design-refs/
  /Sweet Life Images/brand-assets/ → references/products/brand-assets/

Also copies the 187 SVG extracts to references/aesthetics/canva-menu-svg/.
"""
import json
import os
import shutil
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from composio import Composio

REPO = Path("/Users/arnispiekus/Work/Github/sweet-life-v2")
BRAND = Path("/Users/arnispiekus/Work/Github/ugc-engine/brands/sweet-life-newry")
FLAT = json.load(open(REPO / "menu-extraction/sources/drive/ruta_mum/flat.json"))
USER_ID = "Ruta - Mum"

# (drive_path_prefix, dest_subpath)
FOLDERS = [
    ("/Sweet Life Images/deliveroo/",     "references/products/deliveroo/"),
    ("/Sweet Life Images/food/",          "references/products/food/"),
    ("/Sweet Life Images/drinks/",        "references/products/drinks/"),
    ("/Sweet Life Images/bingsu/",        "references/products/bingsu/"),
    ("/Sweet Life Images/usb-library/",   "references/products/usb-library/"),
    ("/Sweet Life Images/design-refs/",   "references/aesthetics/design-refs/"),
    ("/Sweet Life Images/brand-assets/",  "references/products/brand-assets/"),
]

IMAGE_MIMES = {"image/jpeg", "image/png", "image/webp", "image/heif", "image/tiff", "image/gif"}

api = os.environ.get("COMPOSIO_API_KEY")
if not api:
    print("ERROR: COMPOSIO_API_KEY missing", file=sys.stderr); sys.exit(1)
composio = Composio(api_key=api)

def download_one(item: dict, dest: Path) -> tuple[str, str]:
    target = dest / item["name"]
    if target.exists():
        return ("skipped", item["name"])
    try:
        r = composio.tools.execute(
            "GOOGLEDRIVE_DOWNLOAD_FILE", user_id=USER_ID,
            arguments={"file_id": item["id"]},
            dangerously_skip_version_check=True,
        )
        s3 = r["data"]["downloaded_file_content"]["s3url"]
        data = urllib.request.urlopen(s3).read()
        target.write_bytes(data)
        return ("downloaded", item["name"])
    except Exception as e:
        return ("failed", f"{item['name']}: {str(e)[:120]}")

for drive_prefix, brand_subpath in FOLDERS:
    dest = BRAND / brand_subpath
    dest.mkdir(parents=True, exist_ok=True)
    # All image files DIRECTLY under this path (not deeper subfolders, after flatten)
    items = [
        f for f in FLAT
        if f["path"].startswith(drive_prefix)
        and f["mimeType"] in IMAGE_MIMES
        and f["path"].count("/") == drive_prefix.count("/")    # direct children only
    ]
    if not items:
        print(f"  {drive_prefix} → 0 items (skipping)")
        continue
    print(f"  {drive_prefix} → {len(items)} items → {brand_subpath}")
    with ThreadPoolExecutor(max_workers=6) as ex:
        results = list(ex.map(lambda i: download_one(i, dest), items))
    ok = sum(1 for r in results if r[0] == "downloaded")
    skip = sum(1 for r in results if r[0] == "skipped")
    fail = [r for r in results if r[0] == "failed"]
    print(f"    downloaded={ok}, skipped={skip}, failed={len(fail)}")
    for f in fail[:3]:
        print(f"      FAIL: {f[1]}")

# Copy SVG extracts as aesthetic refs
svg_src = REPO / "menu-extraction/sources/from-svg/newry-v2-clean"
svg_dst = BRAND / "references/aesthetics/canva-menu-svg"
if svg_src.exists():
    svg_dst.mkdir(parents=True, exist_ok=True)
    n = 0
    for f in svg_src.iterdir():
        dst_f = svg_dst / f.name
        if not dst_f.exists():
            shutil.copy2(f, dst_f)
            n += 1
    print(f"  SVG aesthetic refs: {n} new files → references/aesthetics/canva-menu-svg/")

print("\nDone. Reference library:")
for sub in sorted((BRAND / "references").rglob("*")):
    if sub.is_dir():
        n = sum(1 for f in sub.iterdir() if f.is_file())
        if n > 0:
            print(f"  {sub.relative_to(BRAND)}: {n} files")
