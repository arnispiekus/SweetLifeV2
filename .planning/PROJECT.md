# Sweet Life V2

Family cafe website rebuild - migrating from Vite/React to Next.js with improved ordering and design.

## Context

**What:** Complete rebuild of Sweet Life Cafe Newry website, migrating from the existing Vite/React codebase to Next.js with modern tooling and improved UX.

**Why:** The current site works but relies on external services (FoodServe) that have caused problems. The family wants full control over ordering through Revolut Checkout, better design/animations, and improved performance.

**Who:** Family-owned cafe in Newry, Northern Ireland. Serves breakfast, lunch, specialty coffees, cakes, and sushi (pre-order only). Has upstairs space for private events/bookings.

**Reference Codebase:** `/Users/arnispiekus/Work/Github/SweetLifeNewry` - existing Vite/React site with components, menu data, images, and styling to migrate.

## Requirements

### Validated

(Migration from existing site - these capabilities exist and must be preserved)

- Menu display with 13+ categories and 90+ items — existing
- Sushi pre-order system with 24-hour advance booking — existing
- Blog system with markdown posts — existing
- Contact information and Google Maps embed — existing
- Social media links (Facebook, Instagram, TikTok) — existing
- WhatsApp floating widget — existing
- Mobile-responsive design — existing
- Google Analytics tracking — existing

### Active

- [ ] Migrate to Next.js 16 with App Router
- [ ] Deploy to Vercel (replacing Netlify)
- [ ] Replace FoodServe with Revolut Checkout links for ordering
- [ ] Implement Resend for transactional emails (replacing Netlify Forms)
- [ ] Enhanced design and animations with Framer Motion
- [ ] Optimized images via Next.js Image component
- [ ] Improved sushi ordering UX (cleaner flow to Revolut Checkout)
- [ ] WhatsApp-primary booking inquiry system
- [ ] Faster page loads and better performance
- [ ] SEO preserved/improved from current site

### Out of Scope

- User accounts/login system — keep simple, not needed for v1
- Admin dashboard for managing orders/menu — Revolut handles order management
- Delivery tracking — not needed, customers pick up or use separate delivery
- Custom cart/checkout system — using Revolut Checkout instead
- Online payment processing on-site — Revolut handles all payments

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js over staying with Vite | SSR/SSG benefits, Vercel integration, Image optimization, better DX | Pending |
| Revolut Checkout links (not embedded) | Simpler integration, Revolut handles all payment/order complexity | Pending |
| WhatsApp primary for bookings | Customers prefer direct chat, form as backup only | Pending |
| No custom ordering system | Avoid complexity, Revolut Checkout already works well | Pending |
| Resend for emails | Better deliverability than Netlify Forms, API-based | Pending |

## Constraints

- **Domain:** Must keep sweetlifecafe.co.uk working (DNS switch when ready)
- **Budget:** Prefer free tiers (Vercel hobby, Resend free tier, etc.)
- **Mobile-first:** Most customers browse on phones - must be excellent mobile UX
- **Core priority:** Design/visual quality is the #1 priority for v1

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **Hosting:** Vercel
- **Email:** Resend
- **Payments/Ordering:** Revolut Checkout (external links)
- **Analytics:** Google Analytics (existing)
- **Icons:** Lucide React

## Reference Assets (from SweetLifeNewry)

- `/src/components/` — UI components to migrate/adapt
- `/src/data/menuData.ts` — Full menu database
- `/src/content/blog/` — Markdown blog posts
- `/public/` — All images (Sushi, Breakfast, Lunch, Cakes, etc.)
- `/src/index.css` — Tailwind configuration and custom styles
- `tailwind.config.js` — Theme colors (primary: #F79D28)

---
*Last updated: 2025-01-18 after initialization*
