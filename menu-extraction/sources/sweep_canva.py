"""List Canva designs and root-folder items.

Usage: sweep_canva.py <user_id> <output_dir>
"""
import json
import sys
from pathlib import Path
from _client import call

def list_designs(user_id: str) -> list[dict]:
    items, cont = [], None
    while True:
        args = {"sort_by": "modified_descending"}
        if cont:
            args["continuation"] = cont
        d = call("CANVA_LIST_USER_DESIGNS", user_id, **args)
        items.extend(d.get("items", []))
        cont = d.get("continuation")
        if not cont:
            break
    return items

def list_folder(user_id: str, folder_id: str = "root") -> list[dict]:
    items, cont = [], None
    while True:
        args = {"folderId": folder_id, "sort_by": "modified_descending"}
        if cont:
            args["continuation"] = cont
        d = call("CANVA_LIST_FOLDER_ITEMS_BY_TYPE_WITH_SORTING", user_id, **args)
        items.extend(d.get("items", []))
        cont = d.get("continuation")
        if not cont:
            break
    return items

def main() -> None:
    user_id, out_dir = sys.argv[1], Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"Listing Canva designs for {user_id!r}...", flush=True)
    designs = list_designs(user_id)
    (out_dir / "designs.json").write_text(json.dumps(designs, indent=2, default=str))
    print(f"  → {len(designs)} designs")
    print(f"Listing Canva root folder...", flush=True)
    root = list_folder(user_id, "root")
    (out_dir / "root_folder.json").write_text(json.dumps(root, indent=2, default=str))
    print(f"  → {len(root)} root items")

if __name__ == "__main__":
    main()
