# Sweet Life — Design System

Drop this `DESIGN.md` into any tool or session and an agent should be able to
build Sweet Life surfaces that look on-brand. It captures **brand, tokens,
typography, components, layout, and editorial rules**. If anything you build
contradicts a rule here, the rule wins.

Format follows the `DESIGN.md` convention popularised by Google Stitch and
the `awesome-claude-design` catalog: human-readable markdown, agent-readable
structure, single source of truth.

---

## 1. Brand

- **Name:** Sweet Life — *café & kitchen*
- **Location:** 12 Monaghan St, Newry BT35 6AA
- **Est:** 2021
- **Voice:** Warm, editorial, slightly Korean-café modern. Confident not cute.
  Lower-case for body, occasional Sail-script flourish, never emoji.
- **Personality words:** Editorial, warm, confident, generous, grounded.
- **Anti-references:** Generic SaaS UI, neon café tropes, cluttered Canva,
  AI-default cream-amber-script-dotted "café" reflex.

---

## 2. Colour tokens

All defined as CSS custom properties in `:root`. Never use raw hex in
components — reference the token.

### Foundations
| Token | Hex | Role |
|---|---|---|
| `--paper` | `#f7f1e6` | Default page background |
| `--paper-warm` | `#efe3cd` | Inset cards / cake-of-the-week callout |
| `--paper-deep` | `#e7d6b8` | Sushi feature box bg / cream-deep cover |
| `--ink` | `#1c140d` | Primary text, rules, banners |
| `--ink-soft` | `#3b2c1f` | Descriptions, secondary body |
| `--muted` | `#7a6a59` | Page footer copy, photo-placeholder text |
| `--rule` | `#1c140d` | Hairlines, dotted leaders |

### Accents
| Token | Hex | Role |
|---|---|---|
| `--terra` | `#b94a2c` | **Primary accent** — eyebrows, group headings, italic notes, GF tag |
| `--olive` | `#5d6b3a` | Vegan tag, green-tea subtype label |
| `--gold` | `#c98a2b` | Reserved gold tag |
| `--berry` | `#7a2d3b` | Keto (K) tag, premium accents |

### Allergen palette (badge colours)
Letter code → token → hex. Light backgrounds (`Eg`, `M`, `Lu`) use **dark ink
text**, all others use **white text**.

| Code | Token | Hex | Allergen |
|---|---|---|---|
| `G` | `--aG` | `#d98f2e` | Gluten |
| `Cr` | `--aCr` | `#b62a2a` | Crustaceans |
| `Eg` | `--aEg` | `#e7c233` | Egg (text: ink) |
| `F` | `--aF` | `#2c5fb3` | Fish |
| `Ce` | `--aCe` | `#5fa848` | Celery |
| `Mu` | `--aMu` | `#a06a2b` | Mustard |
| `Se` | `--aSe` | `#7a2a86` | Sesame |
| `Pe` | `--aPe` | `#cc3a2a` | Peanut |
| `Sy` | `--aSy` | `#2e7a3b` | Soybeans |
| `M` | `--aM` | `#7fb5ea` | Milk (text: ink) |
| `N` | `--aN` | `#6b4423` | Nuts |
| `Lu` | `--aLu` | `#e8a338` | Lupin (text: ink) |
| `Ms` | `--aMs` | `#7a4ea0` | Molluscs |
| `S` | `--aS` | `#a4a4a4` | Sulphites (rendered as "SO₂", 8pt) |

### Colour strategy
**Restrained** with one strong accent (`--terra` ~10%). Never apply
gradients to text. Never use pure `#000` or `#fff`. Never add ad-hoc colours —
introduce a token first.

---

## 3. Typography

Four typefaces, each with one purpose. Load from Google Fonts in this single
`<link>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Sail&family=Inter:wght@300;400;500;600;700;800&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Family | Where it's used |
|---|---|
| **Fraunces** (variable, italic at `opsz 144`) | All display: section titles, group headings, item names, banner headlines, TOC, sushi feature |
| **Sail** (script) | **Only** the "Sweet Life" wordmark — cover at 240px, footer at 26px. Never any other text |
| **Inter** | Body text, eyebrows, badges, social labels, the "MENU" letter-spaced subtitle |
| **Roboto Mono** | All prices, page numbers (`02 / 18`), section numbers, technical labels |

### Type scale (px, on the 1240×1754 page)
| Token | Size | Notes |
|---|---|---|
| Section title (centered) | 104 | Fraunces italic, `font-variation-settings: "opsz" 144` |
| Section title (head-row, left-aligned) | 84 | Same family |
| Sushi feature headline | 90 | |
| Cover wordmark "Sweet Life" | 240 | Sail, `line-height: .85` |
| Cover MENU subtitle | 64 | Fraunces italic 300, `letter-spacing: .4em` |
| Banner headline (italic) | 54 | Fraunces italic 300 |
| Item name | 30 | Fraunces 500 |
| Item name (compact) | 24 | |
| Group heading | 28 | Fraunces 600, terracotta |
| Acai card heading | 32 | |
| Body description | 18 | Inter, ink-soft, `max-width: 88%` |
| Description (compact) | 14 | |
| Item price | 22 | Roboto Mono 500 |
| Price strip | 18 | |
| Page footer | 14 | Inter uppercase `letter-spacing: .18em` |
| Eyebrow | 14 | Terracotta, uppercase `letter-spacing: .32em` |
| Tag chip | 14 | Inter 600, uppercase, pill outline |
| Flavor chip | 14 | Inter 500, uppercase |
| Allergen badge | 11 | Inter 700, 22×22 circle |
| Allergen page badge | 32 | Fraunces 600, 78×78 circle |

### Type rules
- Body line-length ≤ 88% of column (`.item .desc { max-width: 88%; }`).
- Hierarchy via *style + scale*, not weight alone — italic Fraunces is the
  display voice; italic + size carries headings.
- Never centre body copy.
- £ amounts inside descriptions: wrap in `<strong>` (no colour change).
- "Alt" sub-prices in descriptions: `<em class="alt">…</em>` — italic
  terracotta.

---

## 4. Layout

### Page
- Native size: **1240 × 1754** (≈ A4 proportions). `@page { size: 1240px 1754px; margin: 0 }`.
- Padding: **96px top, 110px sides, 80px bottom**.
- Background: cream `--paper` plus two soft radial tints:
  `radial-gradient(1200px 700px at 12% 10%, rgba(185,74,44,.04), transparent 60%), radial-gradient(900px 700px at 95% 95%, rgba(93,107,58,.05), transparent 60%)`.
- Every section page (not cover) gets:
  - **L-shaped corner ornaments** at all four corners (42×42px, 1.5px ink, 55% opacity).
  - **Footer**: Sail "Sweet Life" wordmark left, `NN / 18` right (Roboto Mono, uppercase letter-spaced muted).
- The cover is full-bleed cream-deep with no corner ornaments.

### Grids
- Two-column body: `display:grid; grid-template-columns:1fr 1fr; gap:36px 60px;`
- Three-column bases (Create Your Own): `gap:8px 30px`
- Flavor chip grids: 5 / 4 / 3 / 2 columns depending on content density
- Allergen grid: 7 columns, `gap:30px 16px`
- Toppings build-grid: 4 columns

### Spacing rhythm
Vary intentionally. Section title block: `margin: 0 0 6px`; rule below:
`margin: 18px 0 44px`. Item gaps: `18px` standard, `10px` compact. Group
heading above content: `margin: 18px 0 6px`.

---

## 5. Components

### `.page` — section page wrapper
Fixed 1240×1754, cream paper, padding 96/110/80, corner ornaments,
page-break after each, footer wordmark + page number. Variants: `.cream-deep`
(deeper cream), `.ink` (dark mode — used inside banners and acai card).

### `.section-title` block
```
<div class="section-eyebrow">Just landed</div>
<h2 class="section-title">New on the Menu</h2>
<div class="section-rule"><span class="line"></span><span class="diamond"></span><span class="line"></span></div>
```
- Eyebrow: small uppercase terracotta, `letter-spacing .32em`.
- Title: Fraunces italic 104px, centred.
- Rule: line · 6px ink diamond · line.

### `.head-row` — section header with monogram glyphs (alt to eyebrow form)
```
<div class="head-row">
  <span class="glyph">C</span>
  <h2 class="section-title">Coffee & Tea</h2>
  <span class="glyph">T</span>
</div>
<div class="section-rule">…</div>
```
- Glyphs: 64×64 circle outlined in ink, italic Fraunces terracotta.
- Title left-aligned at 84px.

### `.item` — menu row
```
<div class="item compact">
  <div class="row">
    <span class="name">Bibimbap <span class="tag">GF</span> <span class="tag olive">V*</span><span class="badges">…</span></span>
    <span class="dots"></span>
    <span class="price">£12.00</span>
  </div>
  <div class="desc">…description… <em class="alt">Half portion £8.50.</em></div>
</div>
```
- Name: Fraunces 500, 30px (or 24px `.compact`).
- Dotted leader: 1.5px dotted ink, opacity .5, `transform: translateY(-6px)`.
- Price: Roboto Mono 22px right-aligned.
- Description: 18px Inter ink-soft, `max-width:88%`.

### `.tag` — dietary pill
Outlined pill, uppercase 14px, terracotta by default.  
Modifiers: `.olive` (Vegan / V / V*), `.berry` (Keto / K), `.gold`
(reserved).

### `.badges .b.{CODE}` — allergen badge
22×22 circle, white text (or ink for light bg), 11px Inter 700.
On the allergen page they grow to 78×78 with 32px Fraunces — same colour
map.

### `.group-h` — sub-section title inside a section
Fraunces 600 28px terracotta with an italic muted `<span class="sub">`
beside it (e.g. *Coffee · Iced Coffee +£0.20*).

### `.flavor-grid .chip` — pill chip (drink flavours, bingsu)
Outlined ink pill, 14px uppercase, paper background. `.dark` inverts to
filled-ink + paper text. Optional `<span class="tea">Subtype</span>`
(10px olive, or `.assam` for terracotta).

### `.flavor-h` — flavour block header
Italic Fraunces 30px terracotta `.lbl` · Roboto Mono 20px `.price` ·
muted 14px `.sub`.

### `.banner` — dark feature strip
Ink background, 24×32 padding, 8px radius. Italic Fraunces 54px `.big` on
the left, 15px description max-width 520px on the right (`#e2d2b1` paper-warm
text). Used for Events & Catering, Ramen, Bingsu announcements.

### `.feature-card` — product spotlight
Paper card, 1.5px ink border, 6px radius, `aspect-ratio:1/1.1`. Inside:
dashed photo placeholder + name (Fraunces 600 22px) + price (Roboto Mono
18px terracotta).

### `.acai-card` — composed dark card (Açai Granola Bowl)
Ink bg, 4-column grid: round terracotta price tag (68×68) + heading +
three short lists (Base / Spread / Crunch). `h4` uppercase terracotta-tinted
peach `#e6a98a`, body 14px paper-warm.

### `.toc-item` — table-of-contents row
Mono number / italic Fraunces title / mono page number, dotted underline,
26px Fraunces.

### `.sushi-feature` — feature panel
`--paper-deep` background, 1.5px ink border, 60px padding, centred. 90px
italic headline, 24px lead, 20px ◆ bullet list, italic terracotta CTA.

### `.qr` placeholder
240×240, 2px ink border, 8px radius. 8×8 grid of cells with three corner
finder patterns (replace with a real QR for production).

### `.socials .ic`
48×48 ink circle, paper text, 24px Fraunces letter (`f`, `t`, `G`).

### `.allergen-grid`
7-column grid of `.alg` items (78×78 colour circle + 12px uppercase label).

### `.full-bleed-bottom`
Negative-margin dark strip at the bottom of the Create Your Own page —
`margin: 24px -110px 0; padding: 24px 110px 28px; background: var(--ink);`
holds a 4-column `.build-grid` of toppings.

---

## 6. Editorial rules

- **Italic for personality** — section titles, banner headlines, group sub-
  notes, sushi feature, "alt" sub-prices, the cover tag.
- **Dotted leaders only on `.item .row .dots`** — never decorate other
  text rows with dots.
- **`em.alt` for any "but also" pricing** — half portions, alternative
  sizes (e.g., *Half portion £8.50.*).
- **One eyebrow OR one head-row per page**, never both. The drinks pages
  use the eyebrow form; the food pages use the head-row.
- **Banners go at the bottom of their page** (`margin-top: auto`).
- **No emoji as UI icons.** Glyphs are letter monograms inside circles, or
  diamond/◆ characters.
- **Don't centre body paragraphs.** Centre only titles, eyebrows, captions.

---

## 7. Page anatomy (the 18-page book)

The DB-driven booklet at `/menu.pdf` (Puppeteer-rendered) maps to these
exact pages. Static brand copy is in `src/lib/menu-booklet.ts`; everything
else comes from Supabase.

| # | Page | Source |
|---|---|---|
| 01 | Cover (Sail wordmark, Menu, QR, socials) | Static |
| 02 | Contents — italic-leader TOC | Static layout, list curated |
| 03 | New on the Menu — 3 feature cards + curated list + Events banner | Curated names → DB lookup |
| 04 | Breakfast & Brunch + Açai composed card | `breakfast-brunch` |
| 05 | Coffee & Tea (Coffee / Tea / Matcha / Extras, 2-col) | `coffee-tea` |
| 06 | Gourmet Lattes (price-tier chip blocks) | `gourmet-lattes` |
| 07 | Signature Drinks (Milk Tea / Fruit Tea / Refreshing chips) | `signature-drinks` |
| 08 | Shakes, Smoothies & Frappés (chip blocks) | `signature-drinks` |
| 09 | Bakery & Pastries + Ramen banner | `bakery-pastries` |
| 10 | Lunch (single-col compact list) | `lunch / mains` |
| 11 | Salads + photo strip placeholders | `salads` |
| 12 | Create Your Own (bases grid + dark toppings strip) | `lunch / create-your-own` + static toppings |
| 13 | Cakes, Cookies & Bites + Cake of the Week | `cakes-cookies-bites` |
| 14 | Soft-Serve Ice-cream + Bingsu banner | `cakes-cookies-bites / soft-serve` + static toppings/sauces |
| 15 | Bingsu & More (Bingsu / Golden Toast / Pancakes / Waffles / Crêpe chips) | `bingsu` + `golden-toast` + `pancakes-waffles` |
| 16 | Keto, Vegan & Gluten-Free | `keto-vegan-gluten-free` |
| 17 | Sushi feature + Events banner | Static |
| 18 | Allergen Information grid | `allergens` table |

---

## 8. Where this lives

- **Booklet generator**: `src/lib/menu-booklet.ts` — port of this design as
  templated HTML + DB queries.
- **Render route**: `src/app/menu.pdf/route.ts` — Puppeteer renders at the
  native 1240×1754, returns `application/pdf`.
- **Static brand assets**: `public/menu-art/` (paper texture, mascots,
  illustrations — currently used by the previous booklet revision; this
  editorial design intentionally doesn't reuse the cartoon mascots).
- **Source design**: `/Users/arnispiekus/Downloads/Sweet Life Menu-handoff.zip`
  (Claude Design handoff bundle — `Sweet Life Menu.html` is the canonical
  reference).
- **Website**: `src/app/(site)/menu/page.tsx` — currently uses an older
  card design; should be migrated to apply this DESIGN.md when refreshed.

---

## 9. Anti-patterns

Things this design **deliberately rejects**:

- Photo-grid with empty placeholders pretending to be a finished design.
- Per-item round photo thumbnails on text-list pages (cluttered).
- Cartoon mascots / emoji as section glyphs.
- Pacifico, Caveat, or other "friendly café" scripts. Sail is the only script.
- Cream-amber-orange-only palette. Add olive, berry, gold, ink.
- Modal popovers for booklet content.
- Centred body paragraphs.
- "Click here" / marketing voice. The booklet is a printed menu, not a
  landing page.

---

## 10. Editing the design

To change the look:

1. Adjust tokens in `src/lib/menu-booklet.ts` `:root` block — recompiles
   everything on next PDF render.
2. For component-level changes (e.g. a new `.banner` variant), update both
   this file (§5) and the CSS in `menu-booklet.ts`.
3. When in doubt, open `/Users/arnispiekus/Downloads/Sweet Life Menu-handoff.zip`
   and check the canonical HTML.

The whole point: one place to edit, predictable output everywhere.
