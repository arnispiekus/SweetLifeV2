"""From confident matches, produce:

  matches/apply_plan.json     — every (drive_file_id, target_path, item_id) we plan to write
  matches/UNSURE_REVIEW.md    — human-triageable list of the 57 unsure matches

The apply plan is just a plan — no DB writes or downloads happen here.
A separate apply_photos.py runs after the user signs off.
"""
import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path("menu-extraction/sources")
confident = json.load(open(ROOT / "matches/confident.json"))
unsure = json.load(open(ROOT / "matches/unsure.json"))
no_photo = json.load(open(ROOT / "matches/no_photo.json"))

def safe_name(s: str) -> str:
    s = re.sub(r"[^A-Za-z0-9._-]+", "-", s).strip("-")
    return s

# --- 1. Apply plan for confident matches -----------------------------------
plan = []
seen_items: dict[int, dict] = {}     # item_id -> chosen photo (prefer in-section + higher score)
duplicates: list[tuple] = []          # multiple photos competed for the same item

for m in confident:
    item = (m["best_in_section"] or {}).get("item") or m["best_overall"]["item"]
    score = (m["best_in_section"] or {}).get("score") or m["best_overall"]["score"]
    ext = m["photo_name"].rsplit(".", 1)[-1].lower()
    target = f"/menu-photos/{item['section_slug']}/{safe_name(m['photo_name'])}"
    rec = {
        "item_id": item["id"],
        "item_name": item["name"],
        "section_slug": item["section_slug"],
        "drive_file_id": m["photo_id"],
        "drive_path": m["photo_path"],
        "drive_filename": m["photo_name"],
        "target_path": target,
        "score": score,
    }
    if item["id"] in seen_items:
        prev = seen_items[item["id"]]
        # Keep the higher-scoring one; record the loser
        if score > prev["score"]:
            duplicates.append(("replaced", prev))
            seen_items[item["id"]] = rec
        else:
            duplicates.append(("skipped", rec))
    else:
        seen_items[item["id"]] = rec

plan = list(seen_items.values())
(ROOT / "matches/apply_plan.json").write_text(json.dumps(plan, indent=2))
print(f"Apply plan: {len(plan)} unique item-photo bindings ({len(duplicates)} duplicates resolved by score)")

# --- 2. Unsure review markdown ----------------------------------------------
by_folder: dict[str, list] = defaultdict(list)
for m in unsure:
    by_folder[m["drive_folder"] or "(root)"].append(m)

lines = ["# Unsure matches — please triage", "",
         "57 photos where the auto-matcher was less than confident. Most are correct",
         "but scored low due to abbreviated filenames; a few may be wrong.", "",
         "**For each row, choose one option:**",
         "- ✅ — accept the best-in-section match (the first listed)",
         "- 🔄 — accept the best-overall match (second listed, if shown)",
         "- ✏️ — neither; specify a different DB item (write the item name)",
         "- ❌ — no menu item exists; this photo is not needed", "",
         "Mark your choice inline after each row, e.g. `→ ✅`.",
         ""]
for folder in sorted(by_folder):
    lines.append(f"## /{folder}/  ({len(by_folder[folder])})")
    lines.append("")
    for m in by_folder[folder]:
        sec = m["best_in_section"]
        ovr = m["best_overall"]
        sec_str = (
            f"`{sec['item']['name']}` ({sec['item']['section_slug']}, {sec['score']:.2f})"
            if sec else "— none in folder's section —"
        )
        ovr_str = f"`{ovr['item']['name']}` ({ovr['item']['section_slug']}, {ovr['score']:.2f})"
        lines.append(f"- **`{m['photo_name']}`**")
        lines.append(f"  - best-in-section: {sec_str}")
        lines.append(f"  - best-overall:    {ovr_str}")
        lines.append("  - choice: ")
        lines.append("")
(ROOT / "matches/UNSURE_REVIEW.md").write_text("\n".join(lines))
print(f"Unsure review:  {len(unsure)} photos → matches/UNSURE_REVIEW.md")

# --- 3. Items still without photos, grouped, ready to feed the image session
gaps: dict[str, list] = defaultdict(list)
for it in no_photo:
    gaps[it["section_slug"]].append(it["name"])

gap_lines = ["# Items still needing photography", "",
             "After confident matches, these 108 DB items have no Drive photo bound.",
             "Some have placeholder image_urls in /public/; others are null. The",
             "dedicated image-generation session (Nano Banana Pro + ad-creative-director)",
             "should target this list.", ""]
for section in sorted(gaps):
    gap_lines.append(f"## {section}  ({len(gaps[section])})")
    for n in sorted(gaps[section]):
        gap_lines.append(f"- {n}")
    gap_lines.append("")
(ROOT / "matches/PHOTO_GAPS.md").write_text("\n".join(gap_lines))
print(f"Photo gaps:     {len(no_photo)} items → matches/PHOTO_GAPS.md")
