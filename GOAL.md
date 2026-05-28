# Sweet Life — brand asset goal

> **The goal:** every visual asset Sweet Life needs to operate — menu, website, ads, social, video, packaging — generated to brand spec and reusable across every channel. One brand profile, one reference library, repeatable batches.

This doc is the live north star. Cross items off as they ship; the order below is execution priority.

---

## Phase 1 — Menu item photography  *(in progress)*

**Scope:** every item in the Supabase `menu_items` table gets a real, brand-aligned photo at `public/menu-photos/<section>/<slug>-newgen.png`.

**Status as of 2026-05-26:**

| Section | Items | Status |
|---|---|---|
| Bingsu | 12 | 🔄 in batch (Higgsfield gpt_image_2) |
| Gourmet Lattes | 20 | 🔄 in batch (Higgsfield nano_banana_2) |
| Signature Drinks | 52 | 🔄 in batch (Higgsfield nano_banana_2) |
| Cakes, Cookies & Bites | 23 | ⏳ next |
| Bakery & Pastries | 16 | ⏳ next |
| Lunch | 28 | ⏳ next |
| Breakfast & Brunch | 15 | ⏳ next |
| Salads | 7 | ⏳ next |
| Keto, Vegan & Gluten-Free | 16 | ⏳ next |
| Pancakes & Waffles | 11 | ⏳ next |
| Golden Toast | 5 | ⏳ next |
| Sushi (Pre-order) | 1 | ⏳ next |
| Seasonal items (Christmas, Valentine's, Summer-2026 etc.) | 8 | ⏳ deferred |

**Pipeline (proven on bingsu + drinks):**
1. `higgsfield product-photoshoot create --enhance-only` (free) — backend prompt enhancer turns brief into 600-word photography prompt
2. `higgsfield generate create <model>` — uses gpt_image_2 (7 credits, snow-flake texture for bingsu) or nano_banana_2 (2 credits, drinks)
3. Reference photos from `brands/sweet-life-newry/references/products/<section>/` (849 labeled refs)
4. Output → `public/menu-photos/<section>/<slug>-newgen.png` + `menu_items.image_url` update in Supabase
5. Up to 3 retries per item (intermittent NSFW false positives)

---

## Phase 2 — Website hero & feature imagery

**Scope:** non-product imagery for the website that needs to be brand-aligned.

- `/` (home) — hero image (café interior or signature dish lifestyle)
- `/menu` page header
- `/about` page imagery (café story, founder)
- `/contact` page banner
- Section banners — every menu section gets a hero card image
- Lifestyle stills — customers enjoying, staff plating, café-at-dusk atmospherics

**Tooling:** Higgsfield `lifestyle_scene` mode + `hero_banner` mode. Some shots may use Nano Banana Pro for cost.

---

## Phase 3 — Ad creatives

**Scope:** paid social ad imagery + copy for Meta, TikTok, Google Ads.

- **Meta (IG/FB) static**: per campaign — new item launch, seasonal push, standard menu
- **Meta carousel**: 3–7 slide products + lifestyle
- **TikTok**: video thumbnails + hook frames
- **Google Display**: rectangle / leaderboard banners
- Each campaign as an `ad_creative_pack` via Higgsfield product-photoshoot `--mode ad_creative_pack`

**Skills (must use):**
- `higgsfield-product-photoshoot` with `--mode ad_creative_pack` — coordinated static ad variant packs (Meta/TikTok/Pinterest/Google sizes)
- `ad-image` (tenfoldmarc/ad-image-skill) — `prompt-blocks.md` patterns for ad-specific image briefs (hook + CTA layout, talent positioning)
- `claude-ads` (AgriciDaniel/claude-ads) — 250+ audit checks across Google/Meta/TikTok; run pre-launch to catch policy / quality issues
- `taste-skill` (`design-taste-frontend`) — anti-slop polish on layout, type, motion
- Copy generation: ChatGPT (the user has access); compose ad copy by item using Sweet Life brand-voice.md

---

## Phase 4 — Social media content

**Scope:** organic IG/TikTok content.

- IG feed (1080×1350): product highlights, behind-the-counter, "Today at Sweet Life"
- IG stories (1080×1920): polls, daily specials, customer features
- IG Reels covers + thumbnails
- Pinterest pins (1000×1500): aspirational lifestyle + recipe boards
- TikTok thumbnail / cover art

**Skills (must use):**
- `higgsfield-product-photoshoot` with `--mode social_carousel` (IG multi-slide), `--mode moodboard_pin` (Pinterest vertical 2:3)
- `higgsfield-marketplace-cards` — for Deliveroo / UberEats / Just Eat product card formats
- `taste-skill` for layout polish
- `nano-banana-pro-prompts-recommend-skill` — curated prompt library for social aesthetics
- `awesome-nanobanana-pro` — prompt library reference
- ChatGPT for caption copy

---

## Phase 5 — Video content

**Scope:** moving content for IG, TikTok, in-store screens.

- IG Reels / TikTok (15–30s): product showcases, day-in-the-life, behind-the-counter
- In-store screen content: looping menu animations, hero dish reveals (Remotion for programmatic)
- Brand video assets: 30s anthem, 8s product clips
- Voiceover via Deepgram / ElevenLabs

**Skills + models (must use):**
- `higgsfield-generate` for video — models: `veo3`, `veo3_1`, `veo3_1_lite`, `kling3_0`, `kling2_6`, `seedance_2_0`, `marketing_studio_video`. Test 1-2 per use case, pick winner per campaign.
- `cinematic_studio_video_v2` for moodier brand pieces
- `topaz_video` for upscaling once selected
- `soul_cast` for any AI-presenter content
- Remotion (`https://github.com/remotion-dev/remotion`) — programmatic video for menu animations, in-store screen content, daily-special reels
- Voiceover: Deepgram (already in stack) for transcription; ElevenLabs for synthesis
- `taste-skill` for cut-list / motion polish

---

## Phase 6 — Print + packaging + brand kit

**Scope:** offline assets — print, packaging, in-café signage, business cards.

- Loyalty / business cards
- Takeaway packaging design (cups, bags, wraps)
- In-store signage (specials boards, allergen guides)
- Print menu (PDF booklet exists; tighten for print delivery)
- Sticker / merch designs

**Tooling:** Canva templates from existing designs, plus Higgsfield for any photo elements needed.

---

## Cross-cutting infrastructure

- Brand profile lives at `~/Work/Github/ugc-engine/brands/sweet-life-newry/` — single source of truth for voice, palette, references
- Reference library: ~1,000 labeled assets across 28+ section folders
- Image gen pipeline: Higgsfield CLI + skills + nano_banana_2/gpt_image_2 models
- Performance log: `brands/sweet-life-newry/performance-log.md` — winners get logged after each batch
- **No credit budget** — spend the full 1000+ Higgsfield credits to ship Phase 1 + Phase 2. Top up when needed.

## What's "done" looks like

For each phase: every item in scope has an asset on disk, named consistently, referenced from the right place (DB / website code / social calendar / printer's brief).

The phases are independent enough to run in parallel once Phase 1 wraps — Drogheda menu and Newry seasonal menus can roll up similarly.
