# Sweet Life — overnight work for morning review

> Generated through the night. Everything below is on `main`. Open the contact sheets at the bottom to see results visually.

## Numbers

| Phase | Scope | Status | Cost |
|---|---|---|---|
| Phase 1.1 | Bingsu + drinks (84) | ✅ Done via Higgsfield | 267 cr |
| Phase 1.2 | Remaining menu items (159 of 162) | ✅ Done via direct Gemini | ~$6 (Gemini) |
| Phase 2 | Website hero + lifestyle (23/23) | ✅ Done via Gemini | ~$1 |
| Phase 3 | Ad creative packs (14/14, 5 campaigns) | ✅ Done via Gemini | ~$0.60 |
| Phase 4 | 12 IG highlight icons + 14 social posts | ✅ Done | ~24 cr + $0.60 |
| Phase 5 | Video | ❌ **DEFERRED** — wrong approach used | 80 cr wasted |
| Phase 6 | Print + packaging | ⏸ deferred (design decisions needed) | — |

**Net spend:** ~571 Higgsfield credits + ~$8 Gemini API + ~24 cr for highlights. **437 Higgsfield credits remaining.**

**DB status:** 224/254 year-round menu items now bound to `image_url = '/menu-photos/.../-newgen.png'`. 30 items still null or pointing at old paths — mostly seasonal items + a few slash-in-name retries (Mocha / White Mocha, Toastie/Sandwich GF, Snickers Cake / Toblerone GF).

## What to spot-check first

Open these in your browser:

1. **All phases overview:** `menu-extraction/sources/gen-tests/phase2-3-4-review.html` — every Phase 2/3/4 image in one scrollable page (relative paths fixed).
2. **Phase 4 (social) only:** `menu-extraction/sources/gen-tests/phase4-review.html`
3. **Phase 1 (menu) only:** `menu-extraction/sources/gen-tests/contact-sheet.html` — Phase 1 part 1 contact sheet (Phase 1 part 2 doesn't have one yet — too many files, but `ls public/menu-photos/<section>/*newgen*` shows them by section).

## Decisions I made overnight

- **Switched menu-item gen from Higgsfield → direct Gemini API** (`gemini-2.5-flash-image` / Nano Banana Pro) — same model, no 502 errors, no credit overhead, saved Higgsfield budget for video/ads.
- **Saved your three new API keys to Infisical** as `SWEETLIFE_OPENAI_API_KEY`, `SWEETLIFE_GEMINI_API_KEY`, `SWEETLIFE_OPENROUTER_API_KEY`. The old personal `GEMINI_API_KEY` is untouched.
- **Per-section prompt context** in `batch_gemini.py` (`SECTION_HINTS` dict) — fixes the "rainbow drink instead of rainbow cake" bug from the earlier Higgsfield batch (which applied drink-context to ALL non-bingsu items).
- **Strict reference selection** — `pick_refs` only includes references that share substantive token with the item name. No refs → gen runs with prompt alone, better than polluting with mismatched refs (e.g., granola refs forced into every breakfast item).
- **Parallelism 8** for image batches.
- **Phase 5 (video) deferred** — my text-only veo3_1_lite generations don't match the brand. The right approach is image-to-video using the new menu photos as start frames, vertical 9:16 for Reels/TikTok, via acd-ugc skill.

## Known bugs / things you'll want to redo

1. **Some menu filenames contain `&` `*` chars** (e.g., `ham-&-cheese-croissant-newgen.png`). They work but are uglier than needed. Easy file-rename + DB update if you want them cleaned.
2. **3 slash-name items failed Phase 1.2:** Mocha / White Mocha, Toastie/Sandwich (GF), Snickers Cake / Toblerone (GF). Trivial to retry with sanitized prompts.
3. **30 seasonal items** still have null `image_url` (Christmas Mulled Coffee, Watermelon Breeze, etc.) — by design they're filtered from the main menu. Generate when you build the seasonal menu.
4. **Phase 5 video** — see deferred description in task #8. The 4 videos I generated were text-prompted veo3_1_lite (landscape default) — not brand-aligned + wrong aspect ratio. I deleted them. Credits gone (~80) but not too bad.

## Scripts you can re-run

All scripts in `menu-extraction/sources/`. Re-runnable with `--apply` flag, idempotent on already-completed items.

- `batch_gemini.py` — menu items via Gemini Nano Banana Pro
- `phase2_gemini.py` — website heros
- `phase3_gemini.py` — ad creatives
- `phase4_social_run.py` — IG/Pinterest social posts
- `phase4_highlights_run.py` — IG highlight icons (Higgsfield)
- `quality_check.py` — Gemini Vision QC on any folder; reports OK/BAD

## What to do this morning

1. Open the contact sheets, scroll, mark anything you want regenerated.
2. Tell me which to redo — I'll fire targeted retries (each is 2 credits or ~$0.04).
3. Decide on Phase 5 video approach — happy to use acd-ugc + image-to-video pipeline whenever you're ready.

Total commits on `main` overnight: ~12. Working tree should be clean.
