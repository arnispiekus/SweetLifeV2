# Menu sources audit — 2026-05-26

Result of sweeping mum's Drive, Sweet Life Work Drive, Canva, and Instagram
via Composio SDK. Google Photos was skipped — Composio's default scope only
exposes app-created media, so it can't see mum's actual library. Not a loss:
the food photos are already in her Drive folder.

## What was found

| Source | Account (Composio user_id) | Result |
|---|---|---|
| Drive | `Ruta - Mum` | 3,953 items; menu work concentrated in 7 top-level folders |
| Drive | `Sweet Life Work` | 2 items (clean slate) |
| Canva | `Ruts - Sweet Life` | 86 designs + 83 root items |
| Instagram | `Sweet Life` | @sweet-life-newry — 322 posts, 510 followers |
| Photos | `Ruta Personal` | empty (scope-limited; skip) |

## Mum's Drive — relevant top-level folders

| Folder | Items |
|---|---|
| `/Sweet Life Menu Item Photos/` | **220** — the gold mine, already organized by section |
| `/Sweet Life Images/` | 213 — mixed (WhatsApp dumps, screenshots, "sweet life images" subfolder has 192 cleaner items) |
| `/Sweet Life Menu/` | 7 PDFs — older menu exports |
| `/Sweet Life Menu V2/` | 6 PDFs — current Newry V2 + Drogheda V2 menus |
| `/Sweet Life Menu Newry/` | 6 PDFs — Newry-specific (breakfast, food, coffee, dessert A5s) |
| `/Sweet Life Video/` | 898 videos — IG content |
| `/Sweet-Life-Amazon/` | 377 — likely supplier docs, ignore |

Unrelated (ignored): `PJ Export LTD` (1133), `Google Pixel 9 Pro XL` (823 — phone backup),
`Scotch hall`, `Saved from Chrome`, `Sportas`, `Creator Studio`.

## Photo → menu item matching (first pass)

220 photos in `/Sweet Life Menu Item Photos/` matched against 245 DB items.

| Bucket | Count |
|---|---|
| **Confident** (auto-applicable) | **141** |
| Unsure (needs human review) | 57 |
| Unmatched (no DB equivalent) | 4 — soft drinks |
| DB items WITH NO photo | 108 |

Confident matches at score ≥0.78 in the right section. Examples:

```
TaroBingsu.webp           → Taro Bingsu              (1.00)
KinderBeunoLatte.tiff     → Kinder Bueno Latte       (0.79, caught typo)
Black Jack Burger.jpg     → Black Jack Pulled Pork Burger (in-section)
Cherry Velvet Sip.jpg     → Cherry Velvet Sip        (1.00)
Prosciutto … Baguette.jpg → Prosciutto Ham & Feta Cheese Baguette (1.00)
```

Unsure bucket is mostly correct matches scoring low due to abbreviations:
`MangoGT.webp` → Mango Golden Toast (0.61). One known bug: fruit teas
named `*FruitTea` in filenames mismatch DB names like `Apple Jasmine Green Tea`
— easy to add an alias.

## DB items with NO photo yet (108)

| Section | Items missing photos |
|---|---|
| signature-drinks | 36 (milkshakes, protein shakes, smoothies, frappes — DB has generic CaramelMilkTea placeholder) |
| lunch | 18 (Black Jack Burger, Chicken Curry, Chicken Wings, etc.) |
| bakery-pastries | 13 |
| cakes-cookies-bites | 11 |
| pancakes-waffles | 8 |
| breakfast-brunch | 5 |
| keto-vegan-gluten-free | 5 |
| golden-toast | 4 |
| coffee-tea | 3 |
| gourmet-lattes | 3 |
| bingsu | 2 |

These need fresh photography (the deferred Nano-Banana-Pro/ad-creative-director session).

## Items found on Instagram but NOT in the menu DB

From the 25 most recent posts, captioning reveals:

| Item | Type | Notes |
|---|---|---|
| Watermelon Breeze | drink | new (May 2026) |
| Sweet Life Power Bowl | bowl | featured |
| Bao Buns | food | new (April 2026) — soft, fluffy |
| Orange Espresso Fizz | drink | new summer drink |
| Mango Matcha | drink | unique combo |
| Mulled Orange Coffee | drink | Christmas — limited |
| Jingle Bell Roll | sushi | Christmas — limited |
| Festive Bowl (loaded Christmas dinner) | lunch | Christmas — limited |
| Pancake Tuesday Create-Your-Own | special | Feb only |
| Valentine's specials | special | Feb only |
| Custom Christmas Catering Platters | catering | seasonal |

These need decisions: add to menu as `seasonal: christmas|valentines|pancake-tuesday`,
or `availability: limited` flag with a date window?

## Two Sweet Life locations

The Canva and Drive both have **Newry V2** AND **Drogheda V2** menus. The
website (sweetlife-v2 repo) is currently built for Newry only — confirming
with the user whether Drogheda should share the same menu or run its own
microsite/sub-menu.

## Drive cleanup proposal (for user approval)

Mum's Drive is already 70% organized. Suggested moves (none executed yet):

1. **Keep as-is** — `/Sweet Life Menu Item Photos/` (well organized already)
2. **Consolidate** — `/Sweet Life Images/` is messy; split into:
   - `/Sweet Life Images/brand-logos/` (the SWEET-LIFE-LOGO-SOCIALS asset etc.)
   - `/Sweet Life Images/social-posts/` (the IG canvas exports)
   - `/Sweet Life Images/photos/` (the 192 clean food/cafe shots in 'sweet life images' subfolder)
   - Move WhatsApp dumps + screenshots to `/_archive/` or delete
3. **Promote menu PDFs** — All three `/Sweet Life Menu*/ ` folders should merge into one canonical `/Sweet Life Menu/` with subfolders:
   - `/current/Newry V2/` ← latest Canva exports
   - `/current/Drogheda V2/` ← latest Canva exports
   - `/archive/` ← older versions
4. **Mirror to Sweet Life Work Drive** — Once cleaned, share or copy
   `/Sweet Life Menu/` and `/Sweet Life Menu Item Photos/` from
   `Ruta - Mum` → `Sweet Life Work`. Use Drive's "share" feature so we
   don't duplicate storage.

## Output files

- `sources/drive/ruta_mum/{tree,flat}.json` — full Drive inventory
- `sources/drive/sweetlife_work/{tree,flat}.json` — clean-slate Drive
- `sources/canva/{designs,root_folder}.json`
- `sources/instagram/{account,media}.json`
- `sources/db_items.json` — 245 menu items from Supabase
- `sources/matches/{confident,unsure,unmatched,no_photo}.json`
