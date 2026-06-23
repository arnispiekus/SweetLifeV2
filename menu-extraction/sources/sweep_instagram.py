"""List Instagram posts and account info.

Usage: sweep_instagram.py <user_id> <output_dir>
"""
import json
import sys
from pathlib import Path
from _client import call

def main() -> None:
    user_id, out_dir = sys.argv[1], Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Account info for {user_id!r}...", flush=True)
    info = call("INSTAGRAM_GET_USER_INFO", user_id)
    (out_dir / "account.json").write_text(json.dumps(info, indent=2, default=str))
    print(f"  → biography: {info.get('biography','')[:80]}")
    print(f"  → followers/media: {info.get('followers_count','?')}/{info.get('media_count','?')}")

    print(f"Listing recent media...", flush=True)
    media = call("INSTAGRAM_GET_USER_MEDIA", user_id)
    # Some Composio variants nest in 'data'
    items = media.get("data") if isinstance(media.get("data"), list) else media.get("media", media)
    if not isinstance(items, list):
        items = [items] if items else []
    (out_dir / "media.json").write_text(json.dumps(items, indent=2, default=str))
    print(f"  → {len(items)} media items")

if __name__ == "__main__":
    main()
