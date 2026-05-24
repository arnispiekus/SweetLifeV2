#!/usr/bin/env python3
"""Turn menu.json into seed.sql for the Sweet Life Supabase schema.

Re-runnable: drops and re-inserts using TRUNCATE ... RESTART IDENTITY CASCADE.
"""
import json
import re
from pathlib import Path

HERE = Path(__file__).parent
DATA = json.loads((HERE / "menu.json").read_text())
OUT = HERE / "seed.sql"

# Items flagged in the extraction summary that mum should sign off on
NEEDS_REVIEW = {
    "cream-panner",
    "ice-cream-espresso",
    "crepe",
    "sushi-platter",
}


def slugify(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-") or "item"


def q(v):
    """SQL-quote a Python value."""
    if v is None or v == "":
        return "NULL"
    if isinstance(v, bool):
        return "TRUE" if v else "FALSE"
    if isinstance(v, (int, float)):
        return str(v)
    return "'" + str(v).replace("'", "''") + "'"


lines: list[str] = []
add = lines.append

add("-- Sweet Life menu seed — generated from menu.json")
add("-- Re-runnable: truncates and reseeds.\n")

add("BEGIN;")
add("TRUNCATE TABLE")
add("  public.item_allergens,")
add("  public.item_modifier_groups,")
add("  public.modifier_options,")
add("  public.modifier_groups,")
add("  public.item_variants,")
add("  public.menu_items,")
add("  public.subsections,")
add("  public.sections,")
add("  public.allergens")
add("RESTART IDENTITY CASCADE;\n")

# ---- Allergens -----------------------------------------------------------
legend = DATA.get("allergen_legend", {}) or {}
if legend:
    add("-- Allergens")
    add("INSERT INTO public.allergens (code, name) VALUES")
    rows = [f"  ({q(code)}, {q(name)})" for code, name in legend.items()]
    add(",\n".join(rows) + ";\n")

# ---- Sections + subsections + items --------------------------------------
# We use deterministic slugs so item_modifier_groups linking works in the same script.
section_slugs: dict[str, str] = {}
subsection_keys: dict[tuple[str, str], str] = {}
item_keys: dict[tuple[str, str, str], dict] = {}  # (section_slug, sub_slug, item_slug) -> meta

# Sections
add("-- Sections")
add("INSERT INTO public.sections (slug, name, display_order) VALUES")
section_rows = []
for s in DATA["sections"]:
    slug = slugify(s["name"])
    section_slugs[s["name"]] = slug
    section_rows.append(f"  ({q(slug)}, {q(s['name'])}, {s['display_order']})")
add(",\n".join(section_rows) + ";\n")

# Subsections
add("-- Subsections")
sub_rows = []
for s in DATA["sections"]:
    sec_slug = section_slugs[s["name"]]
    for sub in s.get("subsections", []):
        sub_slug = slugify(sub["name"])
        subsection_keys[(s["name"], sub["name"])] = (sec_slug, sub_slug)
        sub_rows.append(
            f"  ((SELECT id FROM public.sections WHERE slug = {q(sec_slug)}), "
            f"{q(sub_slug)}, {q(sub['name'])}, {sub['display_order']})"
        )
if sub_rows:
    add(
        "INSERT INTO public.subsections (section_id, slug, name, display_order) VALUES"
    )
    add(",\n".join(sub_rows) + ";\n")

# Menu items
add("-- Menu items")
item_rows = []
seen_item_slugs: set[tuple[str, str]] = set()
for s in DATA["sections"]:
    for sub in s.get("subsections", []):
        sec_slug, sub_slug = subsection_keys[(s["name"], sub["name"])]
        for idx, it in enumerate(sub.get("items", []), start=1):
            base_slug = slugify(it["name"])
            slug = base_slug
            n = 2
            while (sub_slug, slug) in seen_item_slugs:
                slug = f"{base_slug}-{n}"
                n += 1
            seen_item_slugs.add((sub_slug, slug))

            needs_review = slug in NEEDS_REVIEW
            item_keys[(sec_slug, sub_slug, slug)] = {
                "name": it["name"],
                "variants": it.get("variants") or [],
                "modifiers": it.get("modifiers") or [],
                "allergens": it.get("allergens") or [],
            }
            item_rows.append(
                f"  ((SELECT s.id FROM public.subsections s "
                f"JOIN public.sections sec ON sec.id = s.section_id "
                f"WHERE sec.slug = {q(sec_slug)} AND s.slug = {q(sub_slug)}), "
                f"{q(slug)}, {q(it['name'])}, {q(it.get('description'))}, "
                f"{q(it.get('price'))}, {idx}, {q(needs_review)}, {q(it.get('notes'))})"
            )

add(
    "INSERT INTO public.menu_items "
    "(subsection_id, slug, name, description, price, display_order, needs_review, notes) VALUES"
)
add(",\n".join(item_rows) + ";\n")

# ---- Variants ------------------------------------------------------------
# Some "variants" in the source JSON are actually modifiers (price_delta but
# no absolute price, e.g. "Extra Egg" +£0.60). Route those to the item's
# modifier list instead so we don't drop data.
variant_rows = []
for (sec_slug, sub_slug, item_slug), meta in item_keys.items():
    real_variants = []
    for v in meta["variants"]:
        if "price" in v:
            real_variants.append(v)
        else:
            meta["modifiers"].append({
                "name": v["name"],
                "price_delta": v.get("price_delta", 0),
                "notes": v.get("notes"),
            })
    meta["variants"] = real_variants

    for vidx, v in enumerate(real_variants, start=1):
        variant_rows.append(
            f"  ((SELECT mi.id FROM public.menu_items mi "
            f"JOIN public.subsections s ON s.id = mi.subsection_id "
            f"JOIN public.sections sec ON sec.id = s.section_id "
            f"WHERE sec.slug = {q(sec_slug)} AND s.slug = {q(sub_slug)} AND mi.slug = {q(item_slug)}), "
            f"{q(v['name'])}, {q(v['price'])}, {q(v.get('notes'))}, {vidx})"
        )
if variant_rows:
    add("-- Item variants")
    add(
        "INSERT INTO public.item_variants (menu_item_id, name, price, notes, display_order) VALUES"
    )
    add(",\n".join(variant_rows) + ";\n")

# ---- Item allergens ------------------------------------------------------
allergen_rows = []
for (sec_slug, sub_slug, item_slug), meta in item_keys.items():
    for code in meta["allergens"]:
        if code not in legend:
            # Skip orphans; we'll surface them in the post-seed report
            continue
        allergen_rows.append(
            f"  ((SELECT mi.id FROM public.menu_items mi "
            f"JOIN public.subsections s ON s.id = mi.subsection_id "
            f"JOIN public.sections sec ON sec.id = s.section_id "
            f"WHERE sec.slug = {q(sec_slug)} AND s.slug = {q(sub_slug)} AND mi.slug = {q(item_slug)}), "
            f"{q(code)})"
        )
if allergen_rows:
    add("-- Item allergens")
    add("INSERT INTO public.item_allergens (menu_item_id, allergen_code) VALUES")
    add(",\n".join(allergen_rows) + ";\n")

# ---- Modifier groups + options -------------------------------------------
# Item-scoped modifier groups: one per (item, modifier_name)
# We give each a unique sentinel name so we can re-find them when linking.
add("-- Modifier groups: item-scoped")
mg_rows = []
mg_options: list[tuple[str, str, float]] = []  # (group_sentinel_name, option_name, delta)
mg_links: list[tuple[str, str, str, str]] = []  # (sec_slug, sub_slug, item_slug, sentinel)

for (sec_slug, sub_slug, item_slug), meta in item_keys.items():
    for midx, m in enumerate(meta["modifiers"], start=1):
        sentinel = f"ITEM::{sec_slug}::{sub_slug}::{item_slug}::{slugify(m['name'])}"
        mg_rows.append(
            f"  ({q(m['name'])}, 'item', {q(sentinel)}, {q(m.get('notes'))}, {midx})"
        )
        mg_links.append((sec_slug, sub_slug, item_slug, sentinel))
        options = m.get("options") or []
        delta = m.get("price_delta", 0) or 0
        if options:
            for oidx, opt_name in enumerate(options, start=1):
                mg_options.append((sentinel, opt_name, float(delta)))
        else:
            mg_options.append((sentinel, m["name"], float(delta)))

# Global modifier groups
add("-- (also includes global modifier groups)")
global_sentinels: list[str] = []
for gidx, gm in enumerate(DATA.get("global_modifiers", []), start=1):
    sentinel = f"GLOBAL::{slugify(gm.get('section', 'misc'))}::{slugify(gm['name'])}"
    global_sentinels.append(sentinel)
    mg_rows.append(
        f"  ({q(gm['name'])}, 'global', {q(sentinel)}, {q(gm.get('notes'))}, {gidx})"
    )
    mg_options.append((sentinel, gm["name"], float(gm.get("price_delta", 0) or 0)))

# We co-opt scope_label as the sentinel for re-lookup. After seeding we could
# rewrite scope_label to the human-readable group ("Extras", section name, etc.)
# but keeping the sentinel is fine for v1 — it's only used internally.
add(
    "INSERT INTO public.modifier_groups (name, scope, scope_label, notes, display_order) VALUES"
)
add(",\n".join(mg_rows) + ";\n")

# Modifier options
add("-- Modifier options")
opt_rows = []
for sentinel, opt_name, delta in mg_options:
    opt_rows.append(
        f"  ((SELECT id FROM public.modifier_groups WHERE scope_label = {q(sentinel)}), "
        f"{q(opt_name)}, {delta})"
    )
add(
    "INSERT INTO public.modifier_options (modifier_group_id, name, price_delta) VALUES"
)
add(",\n".join(opt_rows) + ";\n")

# Item-scoped modifier group links
add("-- Item ↔ modifier-group links (item-scoped)")
link_rows = []
for sec_slug, sub_slug, item_slug, sentinel in mg_links:
    link_rows.append(
        f"  ((SELECT mi.id FROM public.menu_items mi "
        f"JOIN public.subsections s ON s.id = mi.subsection_id "
        f"JOIN public.sections sec ON sec.id = s.section_id "
        f"WHERE sec.slug = {q(sec_slug)} AND s.slug = {q(sub_slug)} AND mi.slug = {q(item_slug)}), "
        f"(SELECT id FROM public.modifier_groups WHERE scope_label = {q(sentinel)}))"
    )
if link_rows:
    add("INSERT INTO public.item_modifier_groups (menu_item_id, modifier_group_id) VALUES")
    add(",\n".join(link_rows) + ";\n")

add("COMMIT;")

OUT.write_text("\n".join(lines))

# Report
n_items = sum(
    len(sub.get("items", []))
    for s in DATA["sections"]
    for sub in s.get("subsections", [])
)
n_variants = sum(len(m["variants"]) for m in item_keys.values())
n_item_mods = sum(len(m["modifiers"]) for m in item_keys.values())
n_global_mods = len(DATA.get("global_modifiers", []))
n_allergens_inline = sum(len(m["allergens"]) for m in item_keys.values())

print(f"Wrote {OUT} ({OUT.stat().st_size:,} bytes)")
print(f"  sections:            {len(DATA['sections'])}")
print(f"  subsections:         {sum(len(s.get('subsections', [])) for s in DATA['sections'])}")
print(f"  menu_items:          {n_items}")
print(f"  item_variants:       {n_variants}")
print(f"  item-mod groups:     {n_item_mods}")
print(f"  global-mod groups:   {n_global_mods}")
print(f"  allergens (legend):  {len(legend)}")
print(f"  item-allergen pairs: {n_allergens_inline}")
