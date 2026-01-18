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

### Phase 3: Home & Static Pages
**Goal:** Build the main pages — Home, About, Contact with enhanced design.

- Create HomePage with hero, featured sections, carousels
- Create AboutPage with cafe story and team info
- Create ContactPage with Google Maps embed and info
- Migrate PageHeader and SectionHeader components
- Implement Framer Motion page transitions
- Add carousel components (Swiper or alternative)

**Research:** Consider Swiper vs other carousel options for Next.js

---

### Phase 4: Menu System
**Goal:** Display full menu with categories, items, and Revolut Checkout links.

- Migrate menuData.ts with all 90+ items
- Create MenuPage with category navigation
- Create MenuCategory and MenuItem components
- Create SpecialtyMenuPage for featured items
- Add "Order Now" links to Revolut Checkout
- Optimize menu images with Next.js Image component

**Research:** Verify Revolut Checkout link format for menu items

---

### Phase 5: Sushi Ordering
**Goal:** Improved sushi pre-order flow with cleaner UX to Revolut Checkout.

- Create SushiPage with variation/size selection
- Migrate sushi image gallery and video
- Implement date/time picker with 24-hour validation
- Create pre-order form with validation
- Connect form submission to Resend for notifications
- Link to appropriate Revolut Checkout payment

**Research:** Resend API setup and email templates

---

### Phase 6: Bookings & Email
**Goal:** WhatsApp-primary booking system with Resend email backup.

- Create BookingsPage with event space info
- Implement prominent WhatsApp CTA button
- Create backup contact form
- Set up Resend for form submissions
- Create email templates for inquiries
- Add confirmation/thank you states

**Research:** Resend integration with Next.js API routes

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
| 3 | Home & Static | Home, About, Contact pages | Carousel options | pending |
| 4 | Menu System | Full menu with Revolut links | Revolut link format | pending |
| 5 | Sushi Ordering | Pre-order flow with Resend | Resend API | pending |
| 6 | Bookings & Email | WhatsApp + email backup | Resend + Next.js | pending |
| 7 | Blog & Launch | Blog, polish, deploy | MDX setup | pending |

---
*Last updated: 2025-01-18 (Phase 2 complete)*
