"""Execute the Drive reorganization plan on mum's Drive (user_id 'Ruta - Mum').

Honours the user's locked decisions:
- Skip Maryna doc (leave at root)
- Skip Drogheda A5 folder (no files to place there)
- Use single /finance/ folder for now (terminal-split deferred)
- Never delete folders (only .DS_Store-style junk); empty folders are harmless

Strategy:
- Resolve every folder path to a Drive folder ID via cached flat.json
- Create destination folders idempotently (search before create)
- Use GOOGLEDRIVE_MOVE_FILE for files (with add_parents + remove_parents)
- Track outcomes in apply_drive_reorg_log.json for resume

Usage:
  apply_drive_reorg.py --dry-run     show planned operations, no API calls
  apply_drive_reorg.py --apply       execute against Drive
"""
import json
import os
import sys
import time
from pathlib import Path
from composio import Composio

ROOT = Path(__file__).resolve().parent
FLAT = json.load(open(ROOT / "drive/ruta_mum/flat.json"))
LOG_PATH = ROOT / "matches" / "apply_drive_reorg_log.json"
USER_ID = "Ruta - Mum"

# path -> id (folder paths end in /)
PATH_TO_ID: dict[str, str] = {"/": "root"}
for f in FLAT:
    PATH_TO_ID[f["path"]] = f["id"]

def folder_id(path: str) -> str | None:
    # Folder paths in flat.json end with "/"
    if not path.endswith("/"):
        path = path + "/"
    return PATH_TO_ID.get(path)

def file_id(path: str) -> str | None:
    return PATH_TO_ID.get(path)

# ----- The plan as concrete operations -----
# Each is (op_type, *args). Folder paths use trailing "/".
PLAN: list[tuple] = []

def mkdir(path: str) -> None:
    PLAN.append(("MKDIR", path))

def move_file(src_path: str, dest_dir: str) -> None:
    PLAN.append(("MOVE", src_path, dest_dir))

def move_files(srcs: list[str], dest_dir: str) -> None:
    for s in srcs:
        move_file(s, dest_dir)

# --- 2a. Menu PDF consolidation -------------------------------------------
# Don't rename top-level folders to avoid collisions. Instead, build
# the new structure inside the existing /Sweet Life Menu/ folder and
# move files in.
for d in [
    "/Sweet Life Menu/current/",
    "/Sweet Life Menu/current/Newry V2/",
    "/Sweet Life Menu/current/Drogheda V2/",
    "/Sweet Life Menu/current/Newry A5/",
    "/Sweet Life Menu/_archive/",
    "/Sweet Life Menu/_archive/pre-v2/",
    "/Sweet Life Menu/_archive/menu-newry-misc/",
]:
    mkdir(d)

# Steps 2,3 — current Newry V2
move_files([
    "/Sweet Life Menu V2/Sweet Life Menu Newry V2 (resize).pdf",
    "/Sweet Life Menu V2/Sweet Life Menu Newry V2 (2).pdf",
], "/Sweet Life Menu/current/Newry V2/")

# Step 4 — older Newry V2 draft to archive
move_file("/Sweet Life Menu V2/Sweet Life Menu Newry V2 (1).pdf",
          "/Sweet Life Menu/_archive/pre-v2/")

# Steps 5,6 — Drogheda V2 current
move_files([
    "/Sweet Life Menu V2/Sweet Life Menu Drogheda V2 (increased bleed) .pdf",
    "/Sweet Life Menu V2/Sweet Life Menu Drogheda V2 (3).pdf",
], "/Sweet Life Menu/current/Drogheda V2/")

# Step 7 — root Drogheda PDF to archive
move_file("/Sweet Life Menu Drogheda V2.pdf",
          "/Sweet Life Menu/_archive/pre-v2/")

# Step 8 — A5 menus
move_files([
    "/Sweet Life Menu Newry/Breakfast + Food Menu A5.pdf",
    "/Sweet Life Menu Newry/Light Breakfast + Food Menu A5.pdf",
    "/Sweet Life Menu Newry/Coffee + Frappe Menu Newry (A5).pdf",
    "/Sweet Life Menu Newry/Desserts + Drinks Menu NEWRY (A5).pdf",
], "/Sweet Life Menu/current/Newry A5/")

# Step 9 — WhatsApp menu photo
move_file("/Sweet Life Menu Newry/WhatsApp Image 2024-01-09 at 22.27.18.jpeg",
          "/Sweet Life Menu/_archive/menu-newry-misc/")

# Step 11 — older PDFs in /Sweet Life Menu/ -> _archive/pre-v2/
move_files([
    "/Sweet Life Menu/Untitled design.pdf",
    "/Sweet Life Menu/Smoothie menu instagram post.pdf",
    "/Sweet Life Menu/jpg2pdf.pdf.pdf",
    "/Sweet Life Menu/0.0 MG (1).pdf",
    "/Sweet Life Menu/Healthy Breakfast Available between 9.30-12.00.pdf",
    "/Sweet Life Menu/Sweet Life Main Menu A0 A2-2.pdf",
], "/Sweet Life Menu/_archive/pre-v2/")

# Step 12 — large-format prints from root to /Sweet Life Business/print-assets/
mkdir("/Sweet Life Business/")
mkdir("/Sweet Life Business/print-assets/")
move_files([
    "/Sweet Life Main Menu A0 A2-4.pdf",
    "/irland menu A0 copy.pdf",
], "/Sweet Life Business/print-assets/")

# --- 2b. Sweet Life Images cleanup ----------------------------------------
mkdir("/Sweet Life Images/brand-assets/")
mkdir("/Sweet Life Images/deliveroo/")
mkdir("/Sweet Life Images/usb-library/")
mkdir("/Sweet Life Images/food/")
mkdir("/Sweet Life Images/drinks/")
mkdir("/Sweet Life Images/bingsu/")
mkdir("/Sweet Life Images/design-refs/")
mkdir("/Sweet Life Images/_archive/")
mkdir("/Sweet Life Images/_archive/old-menu/")
mkdir("/Sweet Life Images/_archive/misc-2023/")

# Step 13 — would rename "Deliveroo nuotraukos 2" to "deliveroo".
#  Folder rename causes the canonical Drive name to change. Do it via UPDATE_FILE_PUT.
PLAN.append(("RENAME", "/Sweet Life Images/Deliveroo nuotraukos 2/", "deliveroo"))

# Step 14
move_file("/Sweet Life Images/SWEET LIFE_LOGO(PNG).png",
          "/Sweet Life Images/brand-assets/")

# Step 15
move_file("/Sweet Life Video/LOGO/SweetLifeLogoSOCIALS.png",
          "/Sweet Life Images/brand-assets/")

# Steps 17-20 — promote nested subfolders out one level (move the FOLDER itself)
# Note: Drive permits moving a folder; we move the whole "Food", "Drinks", etc. folder.
# But the simpler approach is to leave the existing subfolders and just move file-level.
# Here we treat the SUBFOLDER itself as a movable item.
move_file("/Sweet Life Images/sweet life images/USB Sweet Life Photo/",
          "/Sweet Life Images/usb-library/")
move_file("/Sweet Life Images/sweet life images/Food/",
          "/Sweet Life Images/food/")
move_file("/Sweet Life Images/sweet life images/Drinks/",
          "/Sweet Life Images/drinks/")
move_file("/Sweet Life Images/sweet life images/Bingsu/",
          "/Sweet Life Images/bingsu/")
move_file("/Sweet Life Images/sweet life images/Fivver/",
          "/Sweet Life Images/design-refs/")
move_file("/Sweet Life Images/sweet life images/palete/",
          "/Sweet Life Images/design-refs/")
move_file("/Sweet Life Images/sweet life images/old menu/",
          "/Sweet Life Images/_archive/old-menu/")

# Step 22 — junk + misc files
move_files([
    "/Sweet Life Images/sweet life images/WhatsApp Image 2023-08-28 at 21.47.45.jpeg",
    "/Sweet Life Images/sweet life images/WhatsApp Image 2023-08-28 at 21.45.54.jpeg",
    "/Sweet Life Images/sweet life images/Screenshot 2023-08-17 at 19.26.07.png",
    "/Sweet Life Images/sweet life images/Screenshot 2023-08-16 at 21.09.24.png",
    "/Sweet Life Images/sweet life images/Screenshot 2023-01-29 at 00.13.49.png",
    "/Sweet Life Images/sweet life images/Grey Simple Poke Bowl Food Menu Instagram Post.webarchive",
    "/Sweet Life Images/sweet life images/Yellow And Brown Bibimbap Menu Instagram Post (A4 Document).webarchive",
], "/Sweet Life Images/_archive/misc-2023/")

# --- 2c. Sweet Life Video cleanup -----------------------------------------
mkdir("/Sweet Life Video/_unorganised/")
# Steps 25,26 — UUID + IMG_* loose files at Drive ROOT (not Video root).
# Identify all .MP4/.MOV/.HEIC at root path "/X" (one slash count)
for f in FLAT:
    if f["path"].count("/") != 1:    # root level
        continue
    if f["mimeType"] in ("video/mp4", "video/quicktime", "image/heif"):
        # Skip if already in Sweet Life Video
        move_file(f["path"], "/Sweet Life Video/_unorganised/")

# --- 2d. Loose root-level Sweet Life documents ----------------------------
mkdir("/Sweet Life Business/ops/")
mkdir("/Sweet Life Business/ops/hr/")
mkdir("/Sweet Life Business/finance/")
mkdir("/Sweet Life Business/slides/")
mkdir("/Sweet Life Business/reference/")

# Step 28
move_files(["/Sweet Life Slides", "/Copy of Sweet Life Slides"],
           "/Sweet Life Business/slides/")

# Step 29 — Maryna doc EXCLUDED per user decision
# Only move the non-Maryna reference doc
move_file("/Sweet Life Reference ", "/Sweet Life Business/reference/")

# Step 30
move_file("/Sweet Life Order.pdf", "/Sweet Life Business/ops/")

# Step 31
move_file("/Missing Menu", "/Sweet Life Business/reference/")

# Step 32 — weekly rotas (collect all "Week*" and rota files at root)
ROTA_NAMES = [
    "Week 13 Newry", "Week 13 Newry.xlsx", "Week 18", "Week Week 18.xlsx",
    "Week 21 Newry", "Week 35", "Week 47 Newry.pdf",
    "Week Week 24 Drogheda.xlsx", "Newry Week 36 Newry.xlsx",
    "Rota Template", "Employee shift schedule", "Weekly time sheet",
]
for f in FLAT:
    if f["path"].count("/") != 1:
        continue
    if any(f["name"].startswith(prefix) or f["name"] == prefix for prefix in ROTA_NAMES):
        move_file(f["path"], "/Sweet Life Business/ops/")

# Step 33 — finance files
FINANCE_KEYWORDS = ("Sumup", "MCK39TEP", "MDFE4MDX", "VAT_", "transactions-report", "download")
for f in FLAT:
    if f["path"].count("/") != 1:
        continue
    if any(k in f["name"] for k in FINANCE_KEYWORDS):
        move_file(f["path"], "/Sweet Life Business/finance/")

# Step 34 — HR warnings
for f in FLAT:
    if f["path"].count("/") != 1:
        continue
    if f["name"].startswith("Warning") or f["name"].startswith("Copy of Warning"):
        move_file(f["path"], "/Sweet Life Business/ops/hr/")

# ----- Executor -----------------------------------------------------------

def main():
    dry = "--apply" not in sys.argv
    print(f"Mode: {'DRY RUN (no API calls)' if dry else 'LIVE EXECUTE'}")
    print(f"Operations: {len(PLAN)}")

    composio = None
    if not dry:
        api = os.environ.get("COMPOSIO_API_KEY")
        if not api:
            print("ERROR: COMPOSIO_API_KEY not set"); sys.exit(1)
        composio = Composio(api_key=api)

    log = {"created_folders": {}, "moves": [], "renames": [], "skipped": [], "failed": []}
    created_paths: dict[str, str] = {}  # path -> folder_id (newly created or existing)

    def resolve_dest(path: str) -> str | None:
        """Get folder ID for a destination path, preferring newly-created."""
        if not path.endswith("/"):
            path = path + "/"
        if path in created_paths:
            return created_paths[path]
        fid = folder_id(path)
        if fid:
            created_paths[path] = fid
            return fid
        return None

    for i, op in enumerate(PLAN, 1):
        kind = op[0]
        if kind == "MKDIR":
            target = op[1]
            existing = folder_id(target)
            if existing:
                log["created_folders"][target] = existing
                created_paths[target] = existing
                continue
            parent = target.rstrip("/").rsplit("/", 1)[0] + "/"
            parent = parent if parent != "" else "/"
            parent_id = resolve_dest(parent)
            if parent_id is None:
                log["failed"].append({"op": op, "err": f"parent not found: {parent}"})
                print(f"  [{i}/{len(PLAN)}] FAIL MKDIR {target} — parent missing")
                continue
            name = target.rstrip("/").rsplit("/", 1)[1]
            if dry:
                print(f"  [{i}/{len(PLAN)}] DRY MKDIR  {target}")
                created_paths[target] = f"<would-create:{name}>"
            else:
                try:
                    r = composio.tools.execute(
                        "GOOGLEDRIVE_CREATE_FOLDER",
                        user_id=USER_ID,
                        arguments={"name": name, "parent_id": parent_id},
                        dangerously_skip_version_check=True,
                    )
                    new_id = (r.get("data") or {}).get("id")
                    if not new_id:
                        raise ValueError(f"no id in response: {str(r)[:200]}")
                    log["created_folders"][target] = new_id
                    created_paths[target] = new_id
                    print(f"  [{i}/{len(PLAN)}] CREATE {target} id={new_id}")
                except Exception as e:
                    log["failed"].append({"op": op, "err": str(e)[:200]})
                    print(f"  [{i}/{len(PLAN)}] FAIL CREATE {target}: {e}")
            continue

        if kind == "MOVE":
            src, dest = op[1], op[2]
            src_id = PATH_TO_ID.get(src) or PATH_TO_ID.get(src.rstrip("/") + "/")
            if not src_id:
                log["skipped"].append({"op": op, "reason": "source not in cached tree"})
                if dry: print(f"  [{i}/{len(PLAN)}] SKIP  {src} (source not in cached tree)")
                continue
            dest_id = resolve_dest(dest)
            if not dest_id or (isinstance(dest_id, str) and dest_id.startswith("<would-create")):
                if dry:
                    print(f"  [{i}/{len(PLAN)}] DRY MOVE   {src} → {dest}")
                    continue
                log["failed"].append({"op": op, "err": f"dest not resolved: {dest}"})
                continue
            if dry:
                print(f"  [{i}/{len(PLAN)}] DRY MOVE   {src} → {dest}")
                continue
            # Look up current parents
            try:
                meta = composio.tools.execute(
                    "GOOGLEDRIVE_GET_FILE_METADATA",
                    user_id=USER_ID,
                    arguments={"fileId": src_id, "fields": "parents,name"},
                    dangerously_skip_version_check=True,
                )
                parents = ((meta.get("data") or {}).get("parents") or [])
                args = {"file_id": src_id, "add_parents": dest_id,
                        "supports_all_drives": True}
                if parents:
                    args["remove_parents"] = ",".join(parents)
                r = composio.tools.execute(
                    "GOOGLEDRIVE_MOVE_FILE", user_id=USER_ID,
                    arguments=args, dangerously_skip_version_check=True,
                )
                log["moves"].append({"src": src, "dest": dest, "file_id": src_id})
                print(f"  [{i}/{len(PLAN)}] MOVE  {src} → {dest}")
            except Exception as e:
                log["failed"].append({"op": op, "err": str(e)[:200]})
                print(f"  [{i}/{len(PLAN)}] FAIL MOVE {src}: {str(e)[:120]}")
            continue

        if kind == "RENAME":
            src, new_name = op[1], op[2]
            src_id = PATH_TO_ID.get(src)
            if not src_id:
                log["skipped"].append({"op": op, "reason": "source not found"})
                continue
            if dry:
                print(f"  [{i}/{len(PLAN)}] DRY RENAME {src} → {new_name}")
                continue
            try:
                r = composio.tools.execute(
                    "GOOGLEDRIVE_UPDATE_FILE_PUT", user_id=USER_ID,
                    arguments={"fileId": src_id, "name": new_name,
                               "supports_all_drives": True},
                    dangerously_skip_version_check=True,
                )
                log["renames"].append({"src": src, "new_name": new_name})
                print(f"  [{i}/{len(PLAN)}] RENAME {src} → {new_name}")
            except Exception as e:
                log["failed"].append({"op": op, "err": str(e)[:200]})
                print(f"  [{i}/{len(PLAN)}] FAIL RENAME {src}: {e}")

    LOG_PATH.write_text(json.dumps(log, indent=2))
    print(f"\nSummary: created={len(log['created_folders'])}, moves={len(log['moves'])}, "
          f"renames={len(log['renames'])}, skipped={len(log['skipped'])}, failed={len(log['failed'])}")
    print(f"Log → {LOG_PATH.relative_to(ROOT.parent.parent)}")

if __name__ == "__main__":
    main()
