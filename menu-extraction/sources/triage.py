"""Smarter triage of the 57 unsure matches.

For each unsure photo, decide:
- CONFIDENT  — clear filename→item match, recommend apply
- AMBIGUOUS  — multiple plausible items, must ask user
- NO_MATCH   — photo has no DB equivalent (skip/discard)

Outputs:
  matches/TRIAGE.md      — human-readable per-photo recommendation
  matches/triage.json    — structured data for the apply step
"""
import json
import re
from pathlib import Path

ROOT = Path("menu-extraction/sources")
unsure = json.load(open(ROOT / "matches/unsure.json"))
db_items = json.load(open(ROOT / "db_items.json"))

# Aliases: filename token -> set of DB-name tokens it can refer to
FILENAME_ALIASES = {
    "fruittea":  ["fruit tea", "jasmine green tea", "assam black tea", "mojito"],
    "milktea":   ["milk tea"],
    "frappe":    ["frappe"],
    "smoothie":  ["smoothie", "smoothie bowl"],
    "gt":        ["golden toast"],
    "bingsu":    ["bingsu"],
    "biscoff":   ["biscoff", "lotus"],  # Biscoff IS Lotus brand
    "carmel":    ["caramel"],            # common misspelling
    "beuno":     ["bueno"],              # KinderBeuno -> Kinder Bueno
    "souffle":   ["souffle"],
    "waffle":    ["waffle"],
    "pancake":   ["pancake"],
}

DROP_TOKENS = {"the", "and", "with", "gf", "v", "k", "decaf", "vegan",
               "homemade", "made", "fresh"}

def tokens(s: str) -> list[str]:
    s = re.sub(r"([a-z])([A-Z])", r"\1 \2", s)
    s = re.sub(r"\.\w+$", "", s)
    s = re.sub(r"[^a-zA-Z0-9 ]+", " ", s).lower()
    return [t for t in s.split() if len(t) > 2 and t not in DROP_TOKENS]

def expand_aliases(toks: list[str]) -> set[str]:
    out: set[str] = set(toks)
    for t in toks:
        for alias_t, expansions in FILENAME_ALIASES.items():
            if t == alias_t:
                for exp in expansions:
                    out.update(exp.split())
    return out

def in_section(item, section_slugs: list[str]) -> bool:
    return item["section_slug"] in section_slugs

def candidates(photo_name: str, section_slugs: list[str]) -> list[dict]:
    """Find DB items whose name contains every distinctive token of the photo
    (after alias expansion), preferring same-section."""
    photo_toks = tokens(photo_name)
    photo_set = expand_aliases(photo_toks)

    # Distinctive = non-generic tokens (drop suffix-only words)
    suffixes = {"bingsu", "latte", "tea", "milkshake", "smoothie", "frappe",
                "milk", "fruit", "toast", "golden", "waffle", "pancake", "souffle",
                "shake", "protein", "burger", "cake", "salad", "ice", "cream",
                "panini", "pizza", "bowl"}
    distinctive = [t for t in photo_toks if t not in suffixes]

    matches = []
    for it in db_items:
        item_set = set(tokens(it["name"]))
        # All distinctive photo tokens must appear in item name
        # (Apply alias expansion: if photo has "biscoff", item with "lotus" counts.)
        photo_distinct_set = set()
        for t in distinctive:
            if t in FILENAME_ALIASES:
                photo_distinct_set.update(FILENAME_ALIASES[t])
            else:
                photo_distinct_set.add(t)
        # All photo distinctive tokens must be reachable in item name
        if photo_distinct_set and all(
            any(d in it_t or it_t in d for it_t in item_set) for d in photo_distinct_set
        ):
            matches.append(it)
    # Filter by section if folder maps to one
    in_sec = [m for m in matches if in_section(m, section_slugs)] if section_slugs else []
    return in_sec if in_sec else matches

confident, ambiguous, no_match = [], [], []

for m in unsure:
    pn = m["photo_name"]
    folder = m["drive_folder"]
    section_slugs = m["expected_section_slugs"]

    # Beverages folder = soft drinks, no DB section
    if folder == "Beverages":
        no_match.append({**m, "reason": "Soft drinks not in menu (Beverages excluded by user decision)"})
        continue

    cands = candidates(pn, section_slugs)
    if len(cands) == 1:
        confident.append({**m, "chosen": cands[0]})
    elif len(cands) == 0:
        no_match.append({**m, "reason": "No DB item shares the distinctive tokens"})
    else:
        ambiguous.append({**m, "candidates": cands})

print(f"Confident:  {len(confident)}")
print(f"Ambiguous:  {len(ambiguous)}")
print(f"No match:   {len(no_match)}")

# Write structured output
(ROOT / "matches/triage.json").write_text(json.dumps({
    "confident": confident, "ambiguous": ambiguous, "no_match": no_match
}, indent=2))

# Write human-readable markdown
lines = ["# Unsure triage — please confirm", "",
         f"57 unsure photos re-analyzed with smarter rules (alias expansion,",
         f"distinctive-token matching, section narrowing). Result:", "",
         f"- **{len(confident)} confident** — single DB item fits → apply on approval",
         f"- **{len(ambiguous)} ambiguous** — multiple DB items fit → please pick",
         f"- **{len(no_match)} no match** — photo has no DB equivalent → skip", "",
         "## Confident (would auto-apply on your OK)", ""]
for x in confident:
    it = x["chosen"]
    lines.append(f"- `{x['drive_folder']}/{x['photo_name']}` → **{it['name']}** ({it['section_slug']})")
lines.append("")
lines.append("## Ambiguous (please pick one per item)")
lines.append("")
for x in ambiguous:
    lines.append(f"### `{x['drive_folder']}/{x['photo_name']}`")
    for i, c in enumerate(x["candidates"], 1):
        lines.append(f"  {i}. {c['name']} ({c['section_slug']})")
    lines.append("")
lines.append("## No match (skip these)")
lines.append("")
for x in no_match:
    lines.append(f"- `{x['drive_folder']}/{x['photo_name']}` — {x['reason']}")
(ROOT / "matches/TRIAGE.md").write_text("\n".join(lines))
print(f"  → matches/TRIAGE.md + matches/triage.json")
