# Phase 5 — state snapshot (paused 2026-05-27)

Single source of truth for Phase 5 video. Resume from this file.

## Where we are

Paused at the **stitched-reels delivered** checkpoint. Three Batch 1 reels are ready to post to TikTok/IG. Strategy pivot complete: from "more product clips" → "longer-form + audio + location anchoring + cafe interior B-roll".

## Numbers

| Metric | Value |
|---|---|
| Higgsfield credits remaining | **14.75** |
| Higgsfield credits spent on Phase 5 | ~575 (Batch 1: 200, retries/NSFW: 25, hook bake-off: 75, Seedance tests: 108, Kling/Seedance baseline: 31, marketing studio + variants: ~135) |
| Phase 5 deliverables ready | 8 raw clips + 3 stitched reels + 1 baseline test (kling) + 1 baseline test (seedance) + 3 hook bake-off + 3 seedance 8s tests |
| Greenlit budget for Batch 2 | **~600 cr top-up** committed (not yet purchased) |

## Files & locations

**Documentation**
- `RESEARCH-PHASE-5.md` — research brief: 4 viral formats, competitor map, missing layers
- `PHASE-5-STATE.md` — this file
- `GOAL.md` — original 6-phase north star
- `REVIEW.md` — overnight Phase 1-4 review

**Scripts**
- `menu-extraction/sources/phase5_batch.py` — Batch 1 runner (Higgsfield Marketing Studio Video, parallel)
- `menu-extraction/sources/phase5_stitch.py` — Reel stitcher (ffmpeg concat, no audio, no burned-in text)
- `menu-extraction/sources/phase5_video_run.py` — legacy (early seedance attempt, ignored)

**Output**
- `public/videos/test/` — bake-offs and baseline tests (kling vs seedance vs marketing-studio hooks)
- `public/videos/batch1/` — 8 final 5s clips with winning Product Hit hook (Marketing Studio Video)
- `public/videos/stitched/` — 3 reels ready to post (A: bingsu pair 10.1s · B: drinks trio 15.1s · C: sweet treats 15.1s) + `review.html` with posting playbook

## Key strategic decisions made

1. **Format winner from bake-off: Higgsfield Marketing Studio Video with `hook_id` = Product Hit (3d45fb46-…)**. Beat Blizzard and Product Crash for our food category. Beat raw Seedance "Red Cascade" prompt too.
2. **Seedance 2.0** is the underlying model under Marketing Studio; concurrent job limit on Plus plan = 6.
3. **Mode `product_showcase`** works without avatar (no human talent stable yet, per brand voice).
4. **NSFW filter** occasionally false-positives on the word "banana" in prompts — workaround: "fresh sliced fruit".
5. **5s clips at 720p 9:16** = 25 cr each via Marketing Studio Video; 8s = 40 cr.
6. **Stitch instead of generating long clips** — concat 5s clips into 15–60s reels via ffmpeg. Cheap, fast, matches the "60–180s wins by 43%" research finding.
7. **No burned-in text in MP4s** — text + location sticker added in TikTok/Reels native editor where the location sticker is clickable (= real footfall driver). Posting playbook captures exact text, timing, hashtags, audio direction in `public/videos/stitched/review.html`.
8. **Direction set by user**: product-focused brand awareness + footfall. *Not* character-driven micro-drama (despite Fruit Love Island doing 300M views — user explicitly rejected the "brain rot" path).

## What worked / didn't

✅ **Marketing Studio Video with Product Hit hook** — visually crisp, hook-driven, scroll-stop quality.
✅ **Parallel batch execution** — 8 jobs in ~7 min (mostly). Concurrent limit of 6 is real but only mildly disruptive.
✅ **Stitching via ffmpeg concat (re-encode)** — smooth output, no codec mismatches.

❌ **Raw Seedance with custom hook-engineered prompts** — produced "boring AI slop" (user words). Marketing Studio's server-side preset hooks crushed our hand-rolled prompts.
❌ **drawtext filter** — ffmpeg 8.1.1 from Homebrew is built without libfreetype. Worked around by skipping burned-in text.
❌ **Brightdata scraping** — token expired across all endpoints. Composio Instagram requires managed Business accounts. WebFetch fails on IG (JS-rendered). Deep-dive on @belfastfoodiegirlofficial blocked without infra rotation.

## Next steps when resuming

In order (each step optional, but recommended sequence):

1. **Post stitched reels A/B/C** — follow `public/videos/stitched/review.html` playbook. Track view counts as Batch 1 performance baseline.
2. **Top up Higgsfield credits** to ~600 cr (account: team@sweetlife.cafe).
3. **Generate cafe interior B-roll** (~150 cr) — 4–6 shots of the actual physical space using brand-voice description prompts. Examples:
   - "Warm cafe interior, off-white speckled ceramics on weathered wood counter, soft window light from left, slight depth-of-field, café morning, no people, 9:16, photorealistic"
   - "Hand sliding a bowl of bingsu across a cream linen counter to a customer, top-down, café interior background, 9:16, documentary"
   - "Close-up: branded cream paper bag with twine, hand of an off-camera barista placing it on counter, café ambient light, 9:16"
4. **Restitch reels A/B/C** with one interior shot inserted before the outro card.
5. **New product clips with audio direction in the prompt** (~250 cr for 10 × 5s) — wider menu coverage. Audio direction example: "soft natural room ambience, faint ice crackle and gentle pour, no music".
6. **Performance review** — after a week of posting, look at watch-time and saves. Decide whether to do Batch 3 or pivot format.

## Open infrastructure issues (block deeper research)

- **Brightdata token (`83e661f8-…` in Infisical `claude-dev/dev`) is expired.** Needs rotation on Brightdata dashboard.
- **Composio session has `googledrive / googlephotos / canva / instagram` — no TikTok toolkit.** Would need to regenerate the session including the `tiktok` toolkit (see `~/.claude/projects/-Users-arnispiekus-Work-Github-sweet-life-v2/memory/reference_composio_mcp.md` for setup script).
- **Instagram Graph API can only query Business accounts you manage**, not arbitrary public creators. Researching specific competitors will need Brightdata fixed OR a different IG scraping path (Apify, Instaloader, etc.).

## Open creative questions for the user

1. Are you happy with the Product Hit aesthetic, or do you want me to try one more model (Veo 3.1 full, not Lite) for B-roll generation?
2. For the interior B-roll: pure AI from description (you chose this) or do you want to grab phone photos of the actual cafe to use as start frames? (You chose pure AI; this question stays open in case you reconsider.)
3. Do you want me to set up basic analytics/UTM tagging on the `sweetlife.cafe` link so we can attribute footfall to specific reels?

## Resume command

> "Resume Phase 5 from PHASE-5-STATE.md — credits topped up, ready to generate interior B-roll"

The next session can read this file + RESEARCH-PHASE-5.md and pick up without ramp-up cost.
