# Sweet Life V2 — Roadmap

## Milestone 1: Website Rebuild

Complete migration from Vite/React to Next.js with Revolut Checkout integration.

### Phase 1: Foundation Setup ✓
**Goal:** Configure Next.js project with Tailwind theme, fonts, and base structure migrated from existing site.

**Status:** Complete (1 plan, 4 commits)

- ✓ Set up Tailwind config with Sweet Life theme (primary: #F79D28)
- ✓ Configure Poppins font from Google Fonts
- ✓ Migrate global styles from existing index.css
- ✓ Set up project structure (components/, lib/, data/, content/)
- ✓ Copy and organize images from existing public/ folder
- ✓ Install core dependencies (Framer Motion, Lucide React, etc.)

**Research:** None needed — straightforward migration

---

### Phase 2: Core Layout Components ✓
**Goal:** Build the shell — Header, Footer, Layout wrapper that appear on every page.

**Status:** Complete (1 plan, 5 commits)

- ✓ Migrate and adapt Header component with navigation
- ✓ Migrate and adapt Footer component with links/social
- ✓ Integrate Header/Footer into root layout.tsx
- ✓ Implement mobile navigation (hamburger menu)
- ✓ Add WhatsApp floating widget
- ✓ Responsive design verified

**Research:** None needed — adapting existing components

---

### Phase 3: Home & Static Pages ✓
**Goal:** Build the main pages — Home, About, Contact with enhanced design.

**Status:** Complete (1 plan, 7 commits)

- ✓ Create HomePage with hero, featured sections, carousels
- ✓ Create AboutPage with cafe story and values
- ✓ Create ContactPage with Google Maps embed and info
- ✓ Migrate PageHeader and SectionHeader components
- ✓ Add FeaturedCarousel (Swiper) and GoogleReviews carousel
- ✓ Add WaveSeparator component

**Research:** Swiper 12 used for FeaturedCarousel

---

### Phase 4: Menu System ✓
**Goal:** Display full menu with categories, items, and Revolut Checkout links.

**Status:** Complete (1 plan, 6 commits)

- ✓ Migrate menuData.ts with all 164+ items in 13 categories
- ✓ Create MenuPage with category navigation and PDF download
- ✓ Create MenuCategory and MenuItem components
- ✓ Create SpecialtyMenuPage with Bingsu, Golden Toast, Bubble Tea
- ✓ Add FoodServe ordering links
- ✓ Optimize menu images with Next.js Image component
- ✓ Add specialty data file (specialtyData.ts)
- ✓ Add snowfall and floating bubbles animations

**Research:** FoodServe used for ordering (not Revolut directly)

---

### Phase 5: Sushi Ordering ✓
**Goal:** Improved sushi pre-order flow with cleaner UX to Revolut Checkout.

**Status:** Complete (1 plan, 8 commits)

- ✓ Create SushiPage with variation/size selection
- ✓ Migrate sushi image gallery (12 images) and video
- ✓ Create LazyVideo component with IntersectionObserver
- ✓ Implement date/time picker with 24-hour validation
- ✓ Create SushiOrderForm with validation and API submission
- ✓ Create sushiData.ts with variations, sizes, and payment links
- ✓ Create sushiValidation.ts for datetime and order validation
- ✓ Connect form submission to Resend API route
- ✓ Link to Revolut Checkout payments per size

**Research:** Resend API with lazy initialization for build compatibility

---

### Phase 6: Bookings & Email ✓
**Goal:** WhatsApp-primary booking system with Resend email backup.

**Status:** Complete (1 plan, 6 commits)

- ✓ Create BookingsPage with event space info and venue details
- ✓ Implement prominent WhatsApp CTA button with pre-filled message
- ✓ Wire up Contact page form with Resend integration
- ✓ Create contactValidation.ts for form validation
- ✓ Create contact API route with HTML email template
- ✓ Add confirmation and error states to form

**Research:** Resend integration pattern reused from sushi order

---

### Phase 7: Blog & Launch
**Goal:** Migrate blog system, polish animations, deploy to Vercel.

- Migrate markdown blog posts from existing site
- Create blog listing page with post cards
- Create dynamic blog post pages with MDX/markdown
- Add Framer Motion animations throughout
- Optimize performance (Lighthouse audit)
- Configure SEO metadata and structured data
- Deploy to Vercel
- Test all functionality
- DNS switch from Netlify when ready

**Research:** Next.js MDX setup for blog posts

---

## Summary

| Phase | Name | Goal | Research | Status |
|-------|------|------|----------|--------|
| 1 | Foundation Setup | Tailwind, fonts, structure | No | ✓ |
| 2 | Core Layout | Header, Footer, Layout | No | ✓ |
| 3 | Home & Static | Home, About, Contact pages | Swiper 12 used | ✓ |
| 4 | Menu System | Full menu with FoodServe links | FoodServe used | ✓ |
| 5 | Sushi Ordering | Pre-order flow with Resend | Resend API | ✓ |
| 6 | Bookings & Email | WhatsApp + email backup | Resend reused | ✓ |
| 7 | Blog & Launch | Blog, polish, deploy | MDX setup | pending |

---
*Last updated: 2025-01-18 (Phase 6 complete)*
