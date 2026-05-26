# Sweet Life — overnight work for review

> **For your morning review.** Everything generated last night while you slept, organized for fast scanning. Status updates throughout the night live in this file. Final tally + open questions at the bottom.

## What ran

| Phase | Scope | Status | Credits | Output |
|---|---|---|---|---|
| Phase 1 part 1 | 12 bingsu + 20 lattes + 52 signature drinks = **84 items** | ✅ Done before midnight | 267 | `public/menu-photos/<section>/<slug>-newgen.png` |
| Phase 1 part 2 | 170 remaining menu items (bakery, breakfast, cakes, coffee, lunch, salads, KVGF, pancakes, golden toast, sushi) | 🔄 Running | est. ~340 | `public/menu-photos/<section>/<slug>-newgen.png` |
| Phase 2 | 23 website hero / lifestyle / section hero shots | ⏳ Staged | est. ~161 | `public/website-images/<id>.png` |
| Phase 3 | 5 ad creative packs (Bingsu summer, drinks summer, weekend brunch, Bao Buns, emergency workers) | ⏳ Staged | est. ~140 | `public/ad-creatives/<campaign>/variant-N.png` |
| Phase 4 | Social media content (IG feed/stories/Pinterest) | ⏸ Deferred | — | — |
| Phase 5 | Video content (Reels, in-store screens) | ⏸ Deferred | — | — |
| Phase 6 | Print + packaging | ⏸ Deferred (needs design decisions) | — | — |

## How to review fast

1. **Browse menu photos:** open `menu-extraction/sources/gen-tests/contact-sheet.html` — shows all 84 Phase 1 part 1 images at a glance. (A v2 contact sheet for the full Phase 1 will be built at the end.)
2. **Spot-check sections:** `ls public/menu-photos/<section>/` to see all gens in a section, click through.
3. **Tell me which to redo:** name the slugs / sections you want regenerated and I'll fire targeted retries. Each is 2-7 credits.

## Credit budget tracking

- **Start of session:** 1008 credits (`team@sweetlife.cafe — plus plan`)
- **After Phase 1 part 1:** 741 credits (267 spent)
- **Live count:** check `higgsfield account status`
- **Estimated end of overnight:** ~100 credits remaining if all phases complete

## Decisions I made (without you)

- **All Phase 1 part 2 uses nano_banana_2** (2 credits/item) instead of gpt_image_2 (7 credits) — only bingsu need gpt_image_2's snow-flake texture; everything else looked great on Nano Banana.
- **Phase 2 hero shots use full product-photoshoot** (gpt_image_2-backed, 7 credits) — hero quality matters more for first-impression shots.
- **Phase 3 ad packs use ad_creative_pack mode** with 3 variants per campaign — Higgsfield assembles coordinated Meta/TikTok/Pinterest sizes.
- **Phase 4-6 deferred** — social content needs your input on tone/content pillars; video burns credits fast and needs review per gen; packaging needs design decisions.
- **Skipped seasonal items** (Christmas, Valentine's, summer-2026) — already filtered to year-round only.
- **Retries on intermittent NSFW false positives** — up to 3 attempts per item, lower parallelism (2 threads) to reduce false-positive rate. Pattern is intermittent, mostly recovers.

## Known issues encountered

- **Higgsfield API hit 502 errors** during Phase 1 part 2 — slowed throughput. Retry logic eventually pushed through.
- **NSFW false positives** ~10% of bingsu gens — same prompt may succeed on retry. Mostly handled.
- **Reference image quality** — some of the menu PDF extracts have old AI-fake textures. Mum's real photos work best as references.
- **Subsection routing for KVGF / lunch** — I mapped these to neighboring section folders (e.g. keto → sandwiches/, gluten-free → cakes/) since no dedicated folder exists. Results should still be brand-aligned but may need flavor-specific refs added later.

## Files to look at

- `GOAL.md` — the full vision across 6 phases
- `menu-extraction/sources/matches/batch_regen_log.json` — per-item outcomes
- `menu-extraction/sources/matches/phase2_log.json` — Phase 2 outcomes (after Phase 2 runs)
- `menu-extraction/sources/matches/phase3_log.json` — Phase 3 outcomes (after Phase 3 runs)
- `~/Work/Github/ugc-engine/brands/sweet-life-newry/` — brand profile (voice, references, performance log)

## Final summary (will fill in when all phases complete)

_Updated at end of run._
