"""Dump menu_items joined with section info from Supabase to JSON for matching."""
import json
import os
import sys
import urllib.request

SUPABASE_REF = "ftcpmjulnoaehbygvhsm"
SQL = """
SELECT mi.id, mi.name, mi.image_url, s.slug AS section_slug, s.name AS section_name
FROM menu_items mi
JOIN subsections ss ON mi.subsection_id = ss.id
JOIN sections s ON ss.section_id = s.id
ORDER BY s.name, ss.name, mi.name;
"""

token = os.environ.get("SUPABASE_ACCESS_TOKEN")
if not token:
    print("ERROR: SUPABASE_ACCESS_TOKEN env var required", file=sys.stderr)
    sys.exit(1)

req = urllib.request.Request(
    f"https://api.supabase.com/v1/projects/{SUPABASE_REF}/database/query",
    data=json.dumps({"query": SQL}).encode(),
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "User-Agent": "sweetlife-menu-dump/1.0",
    },
    method="POST",
)
with urllib.request.urlopen(req) as r:
    rows = json.load(r)

out = "menu-extraction/sources/db_items.json"
with open(out, "w") as f:
    json.dump(rows, f, indent=2)
print(f"  → {len(rows)} items → {out}")
