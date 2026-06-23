"""Finalize Drive cleanup + share organised folders to Sweet Life Work.

Source: Ruta - Mum (rutap08@gmail.com)
Destination: Sweet Life Work (team@sweetlife.cafe)

Cleanup tasks:
  - Flatten nested folders that kept their original names (e.g. /food/Food/)
  - Merge the duplicate /Sweet Life Images/deliveroo/ pair
  - Promote the loose contents of /Sweet Life Images/sweet life images/ if any

Sharing:
  - /Sweet Life Menu/                    → team@sweetlife.cafe : commenter
  - /Sweet Life Menu Item Photos/        → team@sweetlife.cafe : writer (editor)
  - /Sweet Life Images/brand-assets/     → team@sweetlife.cafe : reader (viewer)
  - /Sweet Life Images/deliveroo/        → team@sweetlife.cafe : reader
  - /Sweet Life Images/usb-library/      → team@sweetlife.cafe : reader
  - /Sweet Life Video/Filtered/          → team@sweetlife.cafe : reader

Run:
  drive_finalize.py --dry-run | --apply
"""
import json, os, sys, time
from pathlib import Path
from composio import Composio

ROOT = Path(__file__).resolve().parent
FLAT = json.load(open(ROOT / "drive/ruta_mum/flat.json"))
LOG_PATH = ROOT / "matches" / "drive_finalize_log.json"
USER_ID = "Ruta - Mum"
TARGET_EMAIL = "team@sweetlife.cafe"

# path -> id
PATH_TO_ID: dict[str, str] = {}
PATH_TO_MIMETYPE: dict[str, str] = {}
for f in FLAT:
    PATH_TO_ID[f["path"]] = f["id"]
    PATH_TO_MIMETYPE[f["path"]] = f["mimeType"]

def find_dup_paths(directory: str, folder_name: str) -> list[dict]:
    """Find duplicate folders with same name at the same directory level."""
    return [f for f in FLAT
            if f["mimeType"] == "application/vnd.google-apps.folder"
            and f["name"] == folder_name
            and f["path"].startswith(directory)
            and f["path"].count("/") == directory.count("/") + 1]

# 1. Flatten operations: move ALL children of <nested> up to <parent>, then "leave empty"
FLATTEN_PAIRS = [
    ("/Sweet Life Images/food/Food/",                          "/Sweet Life Images/food/"),
    ("/Sweet Life Images/drinks/Drinks/",                      "/Sweet Life Images/drinks/"),
    ("/Sweet Life Images/bingsu/Bingsu/",                      "/Sweet Life Images/bingsu/"),
    ("/Sweet Life Images/usb-library/USB Sweet Life Photo/",   "/Sweet Life Images/usb-library/"),
    ("/Sweet Life Images/design-refs/Fivver/",                 "/Sweet Life Images/design-refs/"),
    ("/Sweet Life Images/design-refs/palete/",                 "/Sweet Life Images/design-refs/"),
    ("/Sweet Life Images/_archive/old-menu/old menu/",         "/Sweet Life Images/_archive/old-menu/"),
]

# 2. Merge duplicates: source path -> target path
# After the reorg there are two "deliveroo" folders at /Sweet Life Images/.
# Keep the one with the actual deliveroo content (renamed from "Deliveroo nuotraukos 2"),
# fold the empty newly-created one into it.
# (We detect at runtime — pick the non-empty one as target.)

# 3. Folders to share with Sweet Life Work
SHARES = [
    ("/Sweet Life Menu/",                "commenter"),
    ("/Sweet Life Menu Item Photos/",    "writer"),
    ("/Sweet Life Images/brand-assets/", "reader"),
    ("/Sweet Life Images/deliveroo/",    "reader"),
    ("/Sweet Life Images/usb-library/",  "reader"),
    ("/Sweet Life Video/Filtered/",      "reader"),
]

def main():
    dry = "--apply" not in sys.argv
    print(f"Mode: {'DRY RUN' if dry else 'LIVE'}")

    api = os.environ.get("COMPOSIO_API_KEY")
    if not api: print("ERROR: COMPOSIO_API_KEY missing"); sys.exit(1)
    composio = Composio(api_key=api)

    log = {"flattened": [], "merged_dup": [], "shared": [], "skipped": [], "failed": []}

    def call(slug, **args):
        return composio.tools.execute(slug, user_id=USER_ID, arguments=args,
                                       dangerously_skip_version_check=True)

    # -------- 1. Flatten nested duplicates --------
    print(f"\n--- Flatten nested folders ({len(FLATTEN_PAIRS)} pairs) ---")
    for nested, parent in FLATTEN_PAIRS:
        nested_id = PATH_TO_ID.get(nested)
        parent_id = PATH_TO_ID.get(parent)
        if not nested_id or not parent_id:
            log["skipped"].append({"flatten": (nested, parent), "reason": "not found in cache"})
            print(f"  SKIP   {nested} (not in cached tree)")
            continue
        # find children of `nested` in cache
        children = [f for f in FLAT if f["path"].startswith(nested) and f["path"] != nested]
        # only direct children
        direct = [f for f in children if f["path"].rstrip("/").count("/") == nested.rstrip("/").count("/") + 1]
        print(f"  {nested} → {parent} ({len(direct)} items)")
        for c in direct:
            if dry: continue
            try:
                meta = call("GOOGLEDRIVE_GET_FILE_METADATA",
                            fileId=c["id"], fields="parents", supportsAllDrives=True)
                ps = ((meta.get("data") or {}).get("parents") or [])
                call("GOOGLEDRIVE_MOVE_FILE",
                     file_id=c["id"], add_parents=parent_id,
                     remove_parents=",".join(ps) if ps else None,
                     supports_all_drives=True)
                log["flattened"].append({"file": c["path"], "to": parent})
            except Exception as e:
                log["failed"].append({"flatten_child": c["path"], "err": str(e)[:200]})

    # -------- 2. Merge duplicate deliveroo (skipped — confirmed empty dup, manual delete) --------
    print(f"\n--- Skipping deliveroo merge (empty dup, no data loss; manual delete in Drive UI) ---")
    if False:  # disabled — see comment above
        dups = find_dup_paths("/Sweet Life Images/", "deliveroo")
        # Choose the one with the most direct children as target; move from others.
        def child_count(folder):
            p = folder["path"]
            return sum(1 for f in FLAT
                       if f["path"].startswith(p) and f["path"] != p
                       and f["path"].rstrip("/").count("/") == p.rstrip("/").count("/") + 1)
        dups.sort(key=child_count, reverse=True)
        keep = dups[0]
        print(f"  keeping {keep['id']} ({child_count(keep)} children)")
        for other in dups[1:]:
            kids = [f for f in FLAT
                    if f["path"].startswith(other["path"]) and f["path"] != other["path"]
                    and f["path"].rstrip("/").count("/") == other["path"].rstrip("/").count("/") + 1]
            print(f"  merging {other['id']} ({len(kids)} children)")
            for c in kids:
                if dry: continue
                try:
                    meta = call("GOOGLEDRIVE_GET_FILE_METADATA",
                                fileId=c["id"], fields="parents", supportsAllDrives=True)
                    ps = ((meta.get("data") or {}).get("parents") or [])
                    call("GOOGLEDRIVE_MOVE_FILE",
                         file_id=c["id"], add_parents=keep["id"],
                         remove_parents=",".join(ps) if ps else None,
                         supports_all_drives=True)
                    log["merged_dup"].append({"file": c["path"], "from": other["id"], "to": keep["id"]})
                except Exception as e:
                    log["failed"].append({"merge_child": c["path"], "err": str(e)[:200]})
    # (else branch not relevant — merge disabled)

    # -------- 3. Share to Sweet Life Work --------
    print(f"\n--- Share organised folders with {TARGET_EMAIL} ---")
    for path, role in SHARES:
        fid = PATH_TO_ID.get(path)
        if not fid:
            log["skipped"].append({"share": path, "reason": "folder not in cache"})
            print(f"  SKIP   {path} (not found)")
            continue
        if dry:
            print(f"  DRY    {role:9s}  {path}")
            continue
        try:
            r = call("GOOGLEDRIVE_CREATE_PERMISSION",
                     file_id=fid, type="user",
                     role=role, email_address=TARGET_EMAIL,
                     supports_all_drives=True,
                     send_notification_email=True,
                     email_message="Sweet Life menu work organised by Claude — access for the team account.")
            ok = r.get("successful", False) if isinstance(r, dict) else False
            log["shared"].append({"path": path, "role": role, "ok": ok})
            print(f"  SHARE  {role:9s}  {path}")
        except Exception as e:
            log["failed"].append({"share": path, "err": str(e)[:200]})
            print(f"  FAIL   {path}: {str(e)[:120]}")

    LOG_PATH.write_text(json.dumps(log, indent=2))
    print(f"\nSummary:")
    print(f"  flattened (file moves): {len(log['flattened'])}")
    print(f"  merged duplicate files: {len(log['merged_dup'])}")
    print(f"  shared folders:         {len(log['shared'])}")
    print(f"  skipped:                {len(log['skipped'])}")
    print(f"  failed:                 {len(log['failed'])}")
    print(f"Log → {LOG_PATH.relative_to(ROOT.parent.parent)}")

if __name__ == "__main__":
    main()
