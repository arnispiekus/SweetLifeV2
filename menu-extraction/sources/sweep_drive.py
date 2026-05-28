"""Recursively walk a Google Drive and write tree.json + flat.json.

Usage: sweep_drive.py <user_id> <output_dir>
Example: sweep_drive.py "Ruta - Mum" sources/drive/ruta_mum
"""
import json
import sys
from pathlib import Path
from _client import call

KEEP_FIELDS = ("id", "name", "mimeType", "parents", "size", "modifiedTime", "createdTime",
               "webViewLink", "owners", "trashed", "shared")

def list_children(user_id: str, folder_id: str) -> list[dict]:
    """Return all files & folders directly under folder_id (paginated)."""
    items, page_token = [], None
    while True:
        args = {
            "q": f"'{folder_id}' in parents and trashed = false",
            "pageSize": 1000,
            "fields": f"nextPageToken,files({','.join(KEEP_FIELDS)})",
        }
        if page_token:
            args["pageToken"] = page_token
        data = call("GOOGLEDRIVE_FIND_FILE", user_id, **args)
        items.extend(data.get("files", []))
        page_token = data.get("nextPageToken")
        if not page_token:
            break
    return items

def walk(user_id: str, folder_id: str = "root", depth: int = 0, max_depth: int = 8,
         path: str = "/", flat: list | None = None) -> dict:
    flat = flat if flat is not None else []
    children = list_children(user_id, folder_id)
    out_children = []
    for c in children:
        cpath = f"{path}{c['name']}/" if c["mimeType"] == "application/vnd.google-apps.folder" else f"{path}{c['name']}"
        record = {k: c.get(k) for k in KEEP_FIELDS}
        record["path"] = cpath
        flat.append(record)
        if c["mimeType"] == "application/vnd.google-apps.folder" and depth < max_depth:
            sub = walk(user_id, c["id"], depth + 1, max_depth, cpath, flat)
            out_children.append({**record, "children": sub["children"]})
        else:
            out_children.append(record)
    return {"folder_id": folder_id, "path": path, "children": out_children, "flat_count": len(flat)}

def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    user_id, out_dir = sys.argv[1], Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Walking Drive for {user_id!r}...", flush=True)
    flat: list[dict] = []
    tree = walk(user_id, "root", flat=flat)
    tree["root_user_id"] = user_id
    tree["flat_count"] = len(flat)

    (out_dir / "tree.json").write_text(json.dumps(tree, indent=2))
    (out_dir / "flat.json").write_text(json.dumps(flat, indent=2))
    print(f"  → {len(flat)} files/folders → {out_dir}/{{tree,flat}}.json")

if __name__ == "__main__":
    main()
