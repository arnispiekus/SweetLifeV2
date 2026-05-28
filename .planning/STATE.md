# Sweet Life V2 — State

## Current Position

**Milestone:** 1 - Website Rebuild — **COMPLETE** (2026-05-21)
**Status:** Deployed to Vercel under arnispiekus account, live on https://sweetlife.cafe via Cloudflare DNS, Resend domain verified for transactional email. Ready for M2 (Sinra integration).

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| 1 - Foundation Setup | **complete** | 4 commits, all tasks done |
| 2 - Core Layout | **complete** | 5 commits, Header/Footer/WhatsApp done |
| 3 - Home & Static | **complete** | 7 commits, Home/About/Contact pages done |
| 4 - Menu System | **complete** | 6 commits, Menu/SpecialtyMenu pages done |
| 5 - Sushi Ordering | **complete** | 8 commits, Sushi page with pre-order form |
| 6 - Bookings & Email | **complete** | 6 commits, Bookings page + Contact form wired |
| 7 - Polish & Launch | **complete** | Plan 01 (7 commits) + Plan 02 (5 commits) |

## Recent Activity

- 2026-05-21: **Out-of-band migration (not via GSD)** — Repo transferred Roseyco-management/SweetLifeV2 → arnispiekus/SweetLifeV2. Re-imported on personal Vercel team. Domain `sweetlife.cafe` now lives on Arnis's Cloudflare account, nameservers switched, apex CNAME-flattens to Vercel and www proxies through CF → Vercel (both serving 200). Resend `sweetlife.cafe` verified in eu-west-1 (DKIM + SPF + MX records added to Cloudflare). Fixed 10 files of stale `sweetlifecafe.co.uk` references (URLs in metadata, sitemap, robots, structured data, and email addresses in contact form, sushi orders, footer, WhatsApp CTA). Old Vercel project on rosey-co-team left in place by choice (user said skip cleanup).
- 2025-01-18: Project initialized
- 2025-01-18: Roadmap created with 7 phases
- 2025-01-18: Phase 1 executed — dependencies, theme, fonts, structure, images
- 2025-01-18: Phase 2 executed — Header, Footer, WhatsApp widget, layout integration
- 2025-01-18: Phase 3 executed — Home, About, Contact pages with UI components
- 2025-01-18: Phase 4 executed — Menu system with 13 categories, specialty page with animations
- 2025-01-18: Phase 5 executed — Sushi pre-order with gallery, video, form, Resend email
- 2025-01-18: Phase 6 executed — Bookings page + Contact form email wiring
- 2025-01-18: Phase 7 Plan 01 executed — Framer Motion animations throughout site
- 2025-01-18: Phase 7 Plan 02 executed — SEO structured data, Lighthouse fixes, sitemap, robots.txt

## What's Ready

- Tailwind 4 configured with Sweet Life brand colors
- Poppins font via Next.js font optimization
- Global utility classes migrated (btn, card, section, nav-link)
- Project structure created (components/, lib/, data/, content/)
- 263MB of images copied to public/
- Header with desktop/mobile navigation
- Footer with contact info and opening hours
- WhatsApp floating chat button
- Root layout wrapping all pages
- **PageHeader** — hero banner for subpages
- **SectionHeader** — section title component
- **FeaturedCarousel** — Swiper-based specialty carousel
- **GoogleReviews** — customer reviews carousel
- **WaveSeparator** — visual wave transitions
- **LazyVideo** — lazy-loading video component
- **HomePage** — 9 sections with all content
- **About Page** — story, values, promise sections
- **Contact Page** — form with Resend email integration
- **MenuPage** — 13 categories with 164+ items, PDF download
- **SpecialtyMenuPage** — Bingsu, Golden Toast, Bubble Tea with animations
- **SushiPage** — pre-order with gallery, video, form
- **SushiGallery** — Swiper carousel for 12 sushi images
- **SushiOrderForm** — variation/size selection, validation, API submission
- **BookingsPage** — venue info, event types, booking process, WhatsApp CTA
- **WhatsAppBookingCTA** — prominent booking button with pre-filled message
- **MenuItem** — menu item card component
- **MenuCategory** — collapsible category accordion
- **menuData.ts** — all menu data with interfaces
- **specialtyData.ts** — specialty menu data
- **sushiData.ts** — sushi variations, sizes, prices, payment links
- **bookingsData.ts** — event types, included items, booking steps
- **sushiValidation.ts** — datetime and order validation
- **contactValidation.ts** — email and form validation
- **API route** — /api/sushi-order with Resend integration
- **API route** — /api/contact with Resend integration
- All pages have SEO metadata
- Build and lint passing
- **Motion components** — FadeIn, ScrollReveal, StaggerContainer, MotionLink, MotionButton, MotionCard
- **Scroll animations** — All pages have viewport-triggered reveals
- **Hover effects** — Buttons scale, cards lift with shadow
- **StructuredData** — JSON-LD Restaurant schema for rich search results
- **sitemap.xml** — Next.js generated sitemap with all pages
- **robots.txt** — Crawler guidance with sitemap reference
- **OpenGraph images** — Social sharing images configured
- **Lighthouse optimized** — 100 Accessibility, 100 SEO

## Blockers

None

## Notes

- Contact form and sushi order form both use Resend with lazy initialization
- Resend API key needed in .env.local for email notifications
- FoodServe ordering link integrated in menu pages
- Reference codebase available at `/Users/arnispiekus/Work/Github/SweetLifeNewry` for component migration
- Blog system dropped from scope (stale SEO posts)
- **Deployed live at https://sweetlife.cafe** — Vercel + Cloudflare + Resend all green
- **Senders verified:** `noreply@sweetlife.cafe` (contact form), `orders@sweetlife.cafe` (sushi orders) — both via Resend (`RESEND_API_KEY` is in Infisical `claude-dev/dev` under name `RESEND_API_KEY`)

## What's NOT done (carried forward to M2 / new project sinra-os)

- Admin dashboard for mum to manage menu / orders / bookings (was explicitly Out of Scope in M1; reversed for M2 via Sinra)
- Integration with Sinra (Hermes agent on sinra-vps) for AI-assisted ops
- WhatsApp Business app → Cloud API migration (required for Sinra to handle messages)
- Meta + Google Ads management surface
- Email inbox routing (info@sweetlife.cafe → Sinra for drafting replies)
- Old domain `sweetlifecafe.co.uk` retirement plan (still pending Cloudflare, Netlify A records, Zoho MX)
- DNS housekeeping: dedupe wildcard A records, remove `_domainconnect` CNAME from Cloudflare

---
*Last updated: 2026-05-22 — M1 marked complete, M2 (Sinra integration) about to be scoped*
