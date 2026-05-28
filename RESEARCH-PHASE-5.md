# Phase 5 v2 — viral cafe/AI-food research brief

**Generated:** 2026-05-27 · scope: last 30 days · slices: Korean cafe + AI-gen food + UK/Ireland cafe + viral food ASMR

## TL;DR

**We've been making pretty product shots when the actual format winning 2026 is narrative + character + story.** The Sweet Life bingsu close-ups are technically competent but they're the same thing brands have posted for years. What's exploding right now is AI used as a *storytelling* tool, not a *photography* tool. We need to add four layers we don't have: **characters, trending audio, longer runtime, and UGC honesty**.

## The biggest data point

**AI Cinema → Fruit Love Island** (launched 2026-03-13)
- 3M followers in 9 days · 300M total views · single episode = 39M views
- Format: Love Island parody where contestants are AI-generated fruits (Strawberina, Bananito)
- Built on **Seedance 2.0** (the model we tested first)
- It's not visually beautiful — many call it "slop". People watch for **story**, not aesthetics. Tropes (love triangles, recouplings, eliminations) carry the format
- Halted on 2026-03-28; spawned the "Slop Opera" genre — competitors are still riding it

**Implication for Sweet Life:** We have 28 menu items with names and personalities. We could build a character-driven series, not a product catalog. *"Bingsu Bachelorette" — Strawberry Cheesecake eliminates Croissant, Frappé, Pancake. Format mimics Love Island.*

## Four dominant viral formats (last 30 days)

### Format A — Character-driven AI micro-drama *(highest ceiling)*
Personify products. Give them archetypes. Run a narrative arc across multiple clips.

- **Reference:** AI Cinema / Fruit Love Island (300M views)
- **Model:** Seedance 2.0 (proven)
- **Length:** 30-90s per episode, stitched from 3-6 clips
- **What it asks of us:** A series concept, not a catalog. Each menu item becomes a character with personality.
- **Cost:** moderate — ~150 cr per episode if 6 × 25cr clips

### Format B — ASMR + trending audio *(safest)*
Visual maximalism + auditory triggers + no dialogue. The model: Bayashi (60M followers).

- **References:** Bayashi (@bayashi.tiktok), Zach Choi (33M), Jane ASMR (24M Korean food), HunniBee (9.1M candy ASMR)
- **What we lack right now:** **audio**. Our Seedance test ran with audio enabled but our prompts had no audio direction. Layered foley = pour, snap, drip, crunch.
- **Bonus rule:** *Trending audio = +45% views over original sound.* We're losing nearly half our reach just on this.
- **Cost:** same as current (~25 cr/video)

### Format C — UGC review POV *(local resonance)*
Mimic the format that actually converts in our geography. Belfast/Newry creators look like this.

- **Top Belfast comps:**
  - **@belfastfoodiegirlofficial** (23.8k IG) — cafes, desserts, açai bowls *(closest to Sweet Life)*
  - **@paul_isitworthit** (45.1k IG) — honest food reviews
  - **@nifoodreviews** (63.5k TikTok) — restaurant reviews
  - **@nifoodblogger** (16.1k TikTok) — breakfast, local cafes
  - **@thekevzofficial** (8.2k TikTok) — Asian food specifically
- **Format:** handheld, first-person, casual delivery, no music or trending audio
- **What it asks of us:** A creator persona (Soul ID character in Higgsfield) or licensing a real local creator. Brand-voice says "no human talent stable yet" — this is the case to build one.

### Format D — Long-form aesthetic process *(counterintuitive winner)*
The Chowhound data says 60-180s clips get **43.2% more views** than the shorter format we've been making. Aesthetic kitchen content + marble countertop + slow process.

- **Reference:** @sofia_hrdz "banana bread latte" format — polished, calm, lifestyle
- **What it asks of us:** Stitching 4-6 of our 5-15s Seedance clips into a single 60-180s "how it's made" reel. We already have the bingsu builds + drink pours captured in static photos.

## What our Batch 1 videos lack

| Layer | Our videos | Top of feed has |
|---|---|---|
| **Story** | Product on table | Character with motive |
| **Audio** | Silent / generic foley | Trending track (+45% views) or signature ASMR |
| **Length** | 5-8s | 60-180s wins by 43% |
| **Tone** | Polished brand-y | UGC honesty ("Reali-TEA" trend) |
| **Locale** | Generic café | NI/UK creator energy |

## Recommended Phase 5 v2 strategy

**Step 1 — Pick one format to commit to.** I'd recommend **Format A (character micro-drama)** because the ceiling is highest *and* it forces us to write before we generate. Strongest hypothesis: "Sweet Life Bingsu Bachelorette" — one episode = ~150 cr, runway for 2-3 pilot episodes inside the current budget if topped up.

**Step 2 — Add the missing layers no matter which format wins.** Whatever we pick: trending audio, longer cut, less polish.

**Step 3 — Top up Higgsfield credits.** 14.75 cr remaining will not get us a meaningful Batch 2. Format A needs ~150 cr per episode; Format B needs ~200 cr for 8 videos with proper audio direction.

**Step 4 — Optional: pull deeper data on specific competitors.** Brightdata web_data hooks let us pull @belfastfoodiegirlofficial's actual top-10 posts to reverse-engineer her exact format (the `analyze-video` skill in ad-creative-director can rip a video into a reusable Seedance template).

## Open questions

1. Are you up for the writing work that Format A requires (character bible, episode beats), or want to stay closer to product-focused content?
2. Want me to pull the top-10 posts from @belfastfoodiegirlofficial + @nifoodreviews and reverse-engineer their format via the `analyze-video` skill?
3. Credit top-up — what budget are you willing to commit to a Batch 2 before further validation?

## Sources

- TikTok food trends 2026 — [Chowhound](https://www.chowhound.com/2142824/tiktok-food-trends-2026/)
- Fruit Love Island — [Wikipedia](https://en.wikipedia.org/wiki/Fruit_Love_Island) · [Philstar](https://www.philstar.com/entertainment/2026/04/05/2518845/ai-generated-fruit-love-island-takes-tiktok-storm) · [Slop Opera analysis](https://software.informer.com/Stories/the-slop-opera-why-ai-fruit-dramas-took-over-tiktok.html)
- ASMR creator ranking — [Amra & Elma](https://www.amraandelma.com/influencers-going-viral-with-asmr-content/)
- Belfast food creators — [Joli](https://joliapp.com/belfast/food-influencers/)
- Dublin food creators — [Joli](https://joliapp.com/dublin/food-influencers/) · [Modash](https://www.modash.io/find-influencers/ireland/dublin/food)
- Bingsu trend overview — [Korea Experience](https://koreaexperience.com/blog/best-korean-desserts-bingsu-hotteok-and-more-2026)
- AI video model comparison — [Pixflow](https://pixflow.net/blog/best-ai-video-generator/)
