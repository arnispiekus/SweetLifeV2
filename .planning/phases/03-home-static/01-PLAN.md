# Phase 3: Home & Static Pages — Plan 01

## Objective

Build the main content pages — Home, About, and Contact — with all supporting UI components (PageHeader, SectionHeader, FeaturedCarousel, GoogleReviews). Pages will be migrated from the reference codebase and adapted for Next.js App Router.

## Execution Context

**Reference Codebase:** `/Users/arnispiekus/Work/Github/SweetLifeNewry`

**Key Source Files:**
- `src/pages/HomePage.tsx` — Home page with 9 sections
- `src/pages/AboutPage.tsx` — About page with story and values
- `src/pages/ContactPage.tsx` — Contact form and info
- `src/components/ui/PageHeader.tsx` — Hero banner for subpages
- `src/components/ui/SectionHeader.tsx` — Section title component
- `src/components/ui/FeaturedCarousel.tsx` — Swiper-based specialty carousel
- `src/components/ui/GoogleReviews.tsx` — Customer reviews carousel

**Target Project:** `/Users/arnispiekus/Work/Github/sweet-life-v2`

## Context

**What exists:**
- Next.js 16 with App Router configured
- Tailwind 4 with Sweet Life theme (primary: #F79D28)
- Poppins font configured
- Global CSS utilities (btn, section, card, nav-link, fade-in)
- Header, Footer, WhatsAppWidget components
- Root layout wrapping all pages
- Swiper 12 and Framer Motion installed
- All images copied to public/

**Migration patterns established in Phase 2:**
- `Link from 'react-router-dom'` → `Link from 'next/link'`
- `to="..."` → `href="..."`
- `useLocation()` → `usePathname()` from `next/navigation`
- Add `'use client'` directive to components with hooks/state
- Use Next.js `Image` component for optimized images

**Contact form note:** The reference uses Netlify Forms. For Next.js, we'll create a simple form structure now and implement server action / API route handling in Phase 6 (Bookings & Email with Resend).

---

## Tasks

### 1. Create PageHeader Component
**File:** `src/components/ui/PageHeader.tsx`

Migrate the PageHeader component from reference. This is a reusable hero banner for subpages.

**Props:** `title: string`, `subtitle?: string`, `backgroundImage?: string`

**Features:**
- Full-width section with background image and dark overlay
- Centered title (h1) and optional subtitle
- Uses `fade-in` animation class
- Responsive padding (py-24 md:py-32)

**Test:** Import and render in a test page to verify styling.

---

### 2. Create SectionHeader Component
**File:** `src/components/ui/SectionHeader.tsx`

Migrate the SectionHeader component from reference.

**Props:** `title: string`, `subtitle?: string`, `centered?: boolean`

**Features:**
- Uses `.section-title` and `.section-subtitle` classes from globals.css
- Optional centered layout with `mx-auto` on subtitle

---

### 3. Create FeaturedCarousel Component
**File:** `src/components/ui/FeaturedCarousel.tsx`

Migrate the Swiper-based featured items carousel.

**Requirements:**
- `'use client'` directive (uses Swiper which requires client-side)
- Import Swiper, SwiperSlide from 'swiper/react'
- Import Autoplay, Pagination modules
- Import swiper CSS: 'swiper/css' and 'swiper/css/pagination'
- Custom pagination bullet styling (inline style tag)
- 8 featured items with hardcoded data
- Responsive: 1 slide mobile, 4 slides desktop
- Auto-scroll every 4 seconds
- Card hover effects (shadow, translate)

**Image paths:** All images exist in public/ (Bingsu.png.webp, GoldenToastBK.webp, etc.)

---

### 4. Create GoogleReviews Component
**File:** `src/components/ui/GoogleReviews.tsx`

Migrate the customer reviews carousel.

**Requirements:**
- `'use client'` directive (uses state, effects)
- 12 hardcoded 5-star reviews
- Custom carousel (no Swiper) with prev/next buttons
- Auto-scroll every 5 seconds, pause on hover
- Desktop: 3 reviews visible, Mobile: 1 review
- Expandable text (truncated at 150 chars with "Read More")
- Star rating display with Lucide Star icon

**Note:** The `isMobile` detection using `window.innerWidth` needs adjustment for SSR. Use a state-based approach with useEffect.

---

### 5. Create WaveSeparator Component
**File:** `src/components/ui/WaveSeparator.tsx`

Extract the wave SVG pattern used between sections.

**Props:** `className?: string` (for fill color, default 'text-primary')

This component creates visual transitions between sections on About and Contact pages.

---

### 6. Create HomePage
**File:** `src/app/page.tsx` (replace existing test content)

Migrate the full HomePage with all 9 sections:

1. **Hero Section** - Full-height background, headline, CTAs
2. **SEO Content** - Hidden rich text for search engines (sr-only)
3. **Online Ordering Promo** - Two-column with benefits list
4. **Our Specialties** - FeaturedCarousel component
5. **About Us Preview** - Two-column with image
6. **Google Reviews** - GoogleReviews component
7. **Sushi Highlight** - Image + text, pre-order notice
8. **Private Room** - Events space promotion
9. **Visit Us** - Google Maps embed + hours/contact

**Conversions needed:**
- All `<Link to="...">` → `<Link href="...">`
- All `<img src="...">` → Next.js `<Image>` where appropriate
- External links (FoodServe) remain as `<a>` tags

---

### 7. Create About Page
**File:** `src/app/about/page.tsx`

Migrate AboutPage with:
- PageHeader with background image
- WaveSeparator transition
- Origin story section with quote card and image grid
- Values section (4 icons with hover effects)
- Promise section (centered quote card)

**Icons used:** Coffee, Heart, Users, Utensils from lucide-react

---

### 8. Create Contact Page
**File:** `src/app/contact/page.tsx`

Migrate ContactPage with:
- PageHeader with background image
- WaveSeparator transition
- Two-column layout: form left, info right
- Contact form (name, email, subject, message)
- Google Maps embed (iframe)
- Contact info cards (address, phone, email, WhatsApp)
- Opening hours display

**Form handling:** Create form structure with standard HTML form. Add `action` attribute placeholder for future API route. No Netlify-specific attributes.

---

### 9. Add Metadata for Pages
**Files:** Each page file

Add Next.js metadata exports:

```typescript
export const metadata = {
  title: 'Page Title | Sweet Life Café',
  description: 'Page description for SEO',
};
```

- Home: "Sweet Life Café – Korean Café in Newry | Bingsu, Bubble Tea & More"
- About: "About Us | Sweet Life Café – Our Story"
- Contact: "Contact Us | Sweet Life Café – Get in Touch"

---

### 10. Optimize Images with Next.js Image Component

Convert key images to use Next.js `<Image>` component for optimization:
- Hero backgrounds (consider using CSS background-image for full-bleed)
- Feature images in content sections
- About page image grid

**Note:** Some images (hero backgrounds with overlays) may stay as CSS background-image for simpler overlay implementation.

---

### 11. Verify Build and Lint

Run `npm run build` and `npm run lint` to ensure:
- No TypeScript errors
- No ESLint warnings
- All imports resolve correctly
- Pages render without errors

---

### 12. Manual Verification

Test all three pages in browser:
- [ ] Home page loads with all 9 sections
- [ ] FeaturedCarousel auto-scrolls and responds to breakpoints
- [ ] GoogleReviews carousel works with prev/next buttons
- [ ] About page displays story and values
- [ ] Contact page shows form and map
- [ ] All internal links work (menu, sushi, bookings point to correct routes even if pages don't exist yet)
- [ ] Mobile responsive layout works
- [ ] No console errors

---

## Checkpoints

1. **After Task 5** (all UI components created): Run build to verify components compile
2. **After Task 6** (HomePage complete): Visual test homepage in browser
3. **After Task 8** (all pages complete): Full build + lint check
4. **After Task 12** (manual verification): Ready for commit

---

## Verification

```bash
# Build check
npm run build

# Lint check
npm run lint

# Dev server for manual testing
npm run dev
```

**Expected outcomes:**
- Build succeeds with no errors
- Lint passes with no warnings
- All three pages render correctly at localhost:3000, /about, /contact
- Carousels function properly
- Links navigate correctly

---

## Success Criteria

- [ ] PageHeader, SectionHeader, FeaturedCarousel, GoogleReviews, WaveSeparator components created
- [ ] HomePage fully migrated with all 9 sections
- [ ] AboutPage fully migrated with story and values
- [ ] ContactPage fully migrated with form and info
- [ ] All pages have SEO metadata
- [ ] Build passes
- [ ] Lint passes
- [ ] Mobile responsive verified
- [ ] No console errors in browser

---

## Output

**Files to create:**
- `src/components/ui/PageHeader.tsx`
- `src/components/ui/SectionHeader.tsx`
- `src/components/ui/FeaturedCarousel.tsx`
- `src/components/ui/GoogleReviews.tsx`
- `src/components/ui/WaveSeparator.tsx`
- `src/app/page.tsx` (replace existing)
- `src/app/about/page.tsx`
- `src/app/contact/page.tsx`

**Commits:** Aim for 3-5 logical commits:
1. Add PageHeader, SectionHeader, WaveSeparator components
2. Add FeaturedCarousel and GoogleReviews components
3. Create HomePage with all sections
4. Create About and Contact pages
5. Add metadata and final polish

---

## Notes

- Contact form is UI-only for now; server-side handling comes in Phase 6
- Some internal links (menu, sushi, bookings) will point to routes that don't exist yet — this is expected
- The `isMobile` detection in GoogleReviews needs SSR-safe implementation using useEffect
- FoodServe external ordering link: `https://www.foodserveadmin.com/ordering/restaurant/menu?restaurant_uid=bf3e6aff-e235-4431-a82f-c5653e976642`

---
*Plan created: 2025-01-18*
