#!/usr/bin/env python3
"""
Download 137 Drive photos via Composio SDK and save to public/menu-photos/.
Then generate apply.sql with UPDATE statements for Supabase.
"""

import json
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]  # sweet-life-v2/
PLAN_FILE = Path(__file__).parent / "matches" / "apply_plan.json"
SQL_FILE = Path(__file__).parent / "matches" / "apply.sql"
FAILURES_FILE = Path(__file__).parent / "matches" / "apply_failures.json"
MAX_WORKERS = 8


def download_one(item, composio_client):
    target = REPO_ROOT / "public" / item["target_path"].lstrip("/")
    if target.exists():
        return ("skipped", item["item_id"], None)

    target.parent.mkdir(parents=True, exist_ok=True)

    try:
        r = composio_client.tools.execute(
            "GOOGLEDRIVE_DOWNLOAD_FILE",
            user_id="Ruta - Mum",
            arguments={"file_id": item["drive_file_id"]},
            dangerously_skip_version_check=True,
        )
        # Response shape: r["data"]["downloaded_file_content"]["s3url"]
        try:
            s3url = r["data"]["downloaded_file_content"]["s3url"]
        except (KeyError, TypeError):
            # Fallback: search common keys
            data = r.get("data", r)
            file_obj = (data.get("downloaded_file_content") or data.get("file") or data) if isinstance(data, dict) else {}
            s3url = (
                file_obj.get("s3url") or file_obj.get("downloadUrl") or file_obj.get("url")
                or r.get("s3url") or r.get("downloadUrl")
            )

        if not s3url:
            raise ValueError(f"Cannot find download URL in response: {json.dumps(r, default=str)[:500]}")

        file_bytes = urllib.request.urlopen(s3url).read()
        target.write_bytes(file_bytes)
        return ("downloaded", item["item_id"], None)

    except Exception as e:
        return ("failed", item["item_id"], str(e))


def main():
    api_key = os.environ.get("COMPOSIO_API_KEY")
    if not api_key:
        print("ERROR: COMPOSIO_API_KEY not set", file=sys.stderr)
        sys.exit(1)

    from composio import Composio
    composio_client = Composio(api_key=api_key)

    with open(PLAN_FILE) as f:
        plan = json.load(f)

    print(f"Plan loaded: {len(plan)} items")

    # Probe first item to confirm response shape
    first = plan[0]
    print(f"Probing first item: {first['item_name']} ({first['drive_file_id']})")
    try:
        r = composio_client.tools.execute(
            "GOOGLEDRIVE_DOWNLOAD_FILE",
            user_id="Ruta - Mum",
            arguments={"file_id": first["drive_file_id"]},
            dangerously_skip_version_check=True,
        )
        print(f"Probe response keys: {list(r.keys()) if isinstance(r, dict) else type(r)}")
        if isinstance(r, dict):
            data = r.get("data", r)
            if isinstance(data, dict):
                print(f"  data keys: {list(data.keys())}")
                file_obj = data.get("file", data)
                if isinstance(file_obj, dict):
                    print(f"  file keys: {list(file_obj.keys())}")
    except Exception as e:
        print(f"Probe failed: {e}", file=sys.stderr)

    downloaded = 0
    skipped = 0
    failed = 0
    failures = []

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(download_one, item, composio_client): item for item in plan}
        for i, future in enumerate(as_completed(futures), 1):
            status, item_id, err = future.result()
            item = futures[future]
            if status == "downloaded":
                downloaded += 1
                print(f"[{i}/{len(plan)}] ✓ {item['item_name']}")
            elif status == "skipped":
                skipped += 1
                print(f"[{i}/{len(plan)}] ~ skipped {item['item_name']}")
            else:
                failed += 1
                failures.append({"item_id": item_id, "item_name": item["item_name"], "error": err})
                print(f"[{i}/{len(plan)}] ✗ FAILED {item['item_name']}: {err}", file=sys.stderr)

    if failures:
        with open(FAILURES_FILE, "w") as f:
            json.dump(failures, f, indent=2)
        print(f"\nFailures written to {FAILURES_FILE}")

    # Generate SQL
    sql_lines = ["BEGIN;"]
    for item in plan:
        # Only generate SQL for items that were not failed
        failed_ids = {f["item_id"] for f in failures}
        if item["item_id"] not in failed_ids:
            sql_lines.append(
                f"UPDATE menu_items SET image_url = '{item['target_path']}' WHERE id = {item['item_id']};"
            )
    sql_lines.append("COMMIT;")

    with open(SQL_FILE, "w") as f:
        f.write("\n".join(sql_lines) + "\n")

    print(f"\n{'='*50}")
    print(f"Downloaded : {downloaded}")
    print(f"Skipped    : {skipped}")
    print(f"Failed     : {failed}")
    print(f"SQL file   : {SQL_FILE}")
    print(f"SQL updates: {len(plan) - failed}")


if __name__ == "__main__":
    main()
