"""List Google Photos albums and media items.

Usage: sweep_photos.py <user_id> <output_dir>
"""
import json
import sys
from pathlib import Path
from _client import call

def list_albums(user_id: str) -> list[dict]:
    items, page_token = [], None
    while True:
        args = {"pageSize": 50}
        if page_token:
            args["pageToken"] = page_token
        d = call("GOOGLEPHOTOS_LIST_ALBUMS", user_id, **args)
        items.extend(d.get("albums", []))
        page_token = d.get("nextPageToken")
        if not page_token:
            break
    return items

def list_media(user_id: str, max_items: int = 5000) -> list[dict]:
    items, page_token = [], None
    while len(items) < max_items:
        args = {"pageSize": 100}
        if page_token:
            args["pageToken"] = page_token
        try:
            d = call("GOOGLEPHOTOS_LIST_MEDIA_ITEMS", user_id, **args)
        except Exception as e:
            print(f"  WARN: {e}")
            break
        items.extend(d.get("mediaItems", []))
        page_token = d.get("nextPageToken")
        if not page_token:
            break
    return items[:max_items]

def main() -> None:
    user_id, out_dir = sys.argv[1], Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"Listing Photos albums for {user_id!r}...", flush=True)
    albums = list_albums(user_id)
    (out_dir / "albums.json").write_text(json.dumps(albums, indent=2, default=str))
    print(f"  → {len(albums)} albums")
    print(f"Listing media items (up to 5000)...", flush=True)
    media = list_media(user_id)
    (out_dir / "media.json").write_text(json.dumps(media, indent=2, default=str))
    print(f"  → {len(media)} media items")

if __name__ == "__main__":
    main()
