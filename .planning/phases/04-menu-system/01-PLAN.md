# Phase 4: Menu System — Plan 01

## Objective

Build the complete menu system — MenuPage with all 13 categories (164+ items), SpecialtyMenuPage with Bingsu/Golden Toast/Bubble Teas, and supporting menu components. All menu data will be migrated from the reference codebase and adapted for Next.js.

## Execution Context

**Reference Codebase:** `/Users/arnispiekus/Work/Github/SweetLifeNewry`

**Key Source Files:**
- `src/data/menuData.ts` — 13 categories, 164+ items with prices and images
- `src/pages/MenuPage.tsx` — Main menu page with PDF download and category list
- `src/pages/SpecialtyMenuPage.tsx` — Bingsu, Golden Toast, Bubble Teas carousels
- `src/components/menu/MenuCategory.tsx` — Collapsible category with items grid
- `src/components/menu/MenuItem.tsx` — Individual menu item card

**Target Project:** `/Users/arnispiekus/Work/Github/sweet-life-v2`

## Context

**What exists:**
- Next.js 16 with App Router configured
- Tailwind 4 with Sweet Life theme (primary: #F79D28)
- Poppins font configured
- Global CSS utilities (btn, section, card, nav-link, fade-in)
- PageHeader, SectionHeader, WaveSeparator, FeaturedCarousel, GoogleReviews components
- Swiper 12 installed
- All menu images copied to public/ (CoffeeTea/, Bakery/, Breakfast/, etc.)

**Migration patterns established:**
- `Link from 'react-router-dom'` → `Link from 'next/link'`
- `to="..."` → `href="..."`
- Add `'use client'` directive to components with hooks/state
- Use Next.js `Image` component for optimized images

**Menu Data Summary:**
- 13 categories: Coffee & Tea (17), Bakery (5), Breakfast (19), Lunch (20), Create Your Own (19), Salads (7), Keto/Vegan/GF (18), Cakes (20), Gourmet Lattes (17), Signature Drinks (6), Hot Desserts (6), Beverages (10)
- Price range: £1.20 - £21.60
- Dietary tags in descriptions: (K) Ketogenic, (V) Vegan, (GF) Gluten Free
- Image path pattern: `/CategoryName/ItemName.webp`

**Specialty Items:**
- Bingsu: 12 flavors (Korean shaved ice)
- Golden Toast: 5 varieties
- Milk Teas: 10 flavors
- Fruit Teas: 7 flavors
- Boba add-ons: +£1.00 (Tapioca, Popping Boba, Rainbow Jelly)

**External Links:**
- FoodServe ordering: `https://www.foodserveadmin.com/ordering/restaurant/menu?restaurant_uid=bf3e6aff-e235-4431-a82f-c5653e976642&client_is_mobile=true`
- PDF menu: `/SweetLifeMenuNewry.pdf` (needs to be copied to public/)

---

## Tasks

### 1. Copy Menu Data File
**File:** `src/data/menuData.ts`

Copy the complete menuData.ts from reference codebase. This includes:
- `MenuItem` interface (id, name, description, price, image?)
- `MenuCategory` interface (id, name, items)
- `menuData` array with all 13 categories
- `sushiData` array (6 items, used in Phase 5)

No modifications needed — the data structure works as-is.

---

### 2. Create MenuItem Component
**File:** `src/components/menu/MenuItem.tsx`

Migrate the MenuItem component from reference.

**Props:** `name: string`, `description: string`, `price: number`, `image?: string`

**Features:**
- Horizontal card layout with optional image (24x24px thumbnail)
- Image on left, content on right
- Price formatted with £ symbol and 2 decimal places
- Hover shadow effect
- Uses Next.js `Image` component for optimization

---

### 3. Create MenuCategory Component
**File:** `src/components/menu/MenuCategory.tsx`

Migrate the collapsible category component.

**Props:** `name: string`, `items: MenuItem[]`

**Features:**
- `'use client'` directive (uses useState)
- Collapsible section with ChevronDown/ChevronUp icons
- Button header with category name
- Grid layout: 1 column mobile, 2 columns desktop
- Animation on expand (fade-in)
- Import and render MenuItem components

---

### 4. Copy PDF Menu File
**File:** `public/SweetLifeMenuNewry.pdf`

Copy the PDF menu from reference codebase to public folder for download functionality.

```bash
cp /Users/arnispiekus/Work/Github/SweetLifeNewry/public/SweetLifeMenuNewry.pdf public/
```

---

### 5. Create MenuPage
**File:** `src/app/menu/page.tsx`

Migrate the full MenuPage with sections:

1. **PageHeader** — "Our Menu" with displayfridge.webp background
2. **WaveSeparator** — Transition from primary to content
3. **PDF Menu Section** — View/Download buttons for PDF menu
4. **Our Specialties** — FeaturedCarousel + links to specialty-menu and FoodServe
5. **Full Menu** — All 13 MenuCategory components with menuData
6. **Dietary Info** — Note about allergies and dietary options

**Conversions needed:**
- All `<Link to="...">` → `<Link href="...">`
- Import menuData from `@/data/menuData`
- Use existing PageHeader, SectionHeader, WaveSeparator, FeaturedCarousel

---

### 6. Create Specialty Data File
**File:** `src/data/specialtyData.ts`

Extract specialty menu data from SpecialtyMenuPage into a dedicated data file:
- `bingsuItems` (12 items)
- `goldenToastItems` (5 items)
- `milkTeaItems` (10 items)
- `fruitTeaItems` (7 items)
- `bobaItems` (3 items)

This keeps the page component cleaner and data reusable.

---

### 7. Create SpecialtyMenuPage
**File:** `src/app/specialty-menu/page.tsx`

Migrate the specialty menu page with sections:

1. **PageHeader** — "Specialty Menu" with displayfridge.webp background
2. **WaveSeparator** — Transition to white
3. **Bingsu Section** — Korean shaved ice with snowfall animation, 12 flavors carousel
4. **Golden Toast Section** — 5 varieties carousel on gray background
5. **Bubble Teas Section** — Floating bubbles animation with:
   - Boba add-ons grid (+£1.00)
   - Milk Teas carousel (10 flavors)
   - Fruit Teas carousel (7 flavors)
6. **Call to Action** — Links to full menu and contact

**Requirements:**
- `'use client'` directive (uses Swiper)
- Custom CSS animations (snowfall, floating bubbles) via `<style>` tag
- Swiper pagination color override for brand consistency
- Responsive: 1 slide mobile, 2-4 slides desktop

---

### 8. Add Metadata for Menu Pages
**Files:** Each page file

Add Next.js metadata exports:

```typescript
export const metadata = {
  title: 'Page Title | Sweet Life Café',
  description: 'SEO description',
};
```

- Menu: "Our Menu | Sweet Life Café – Full Menu & Prices"
- Specialty Menu: "Specialty Menu | Sweet Life Café – Bingsu, Golden Toast & Bubble Tea"

---

### 9. Optimize Images with Next.js Image Component

Convert menu item images to use Next.js `<Image>` component where practical:
- MenuItem thumbnails (24x24 → optimized)
- Specialty carousel cards (aspect-square)

**Note:** Some images with complex styling (backgrounds, overlays) may remain as CSS background-image or standard `<img>` for simpler implementation.

---

### 10. Verify Build and Lint

Run `npm run build` and `npm run lint` to ensure:
- No TypeScript errors
- No ESLint warnings
- All imports resolve correctly
- Pages render without errors

---

### 11. Manual Verification

Test all menu pages in browser:
- [ ] Menu page loads with PageHeader
- [ ] PDF View/Download buttons work
- [ ] FeaturedCarousel displays and auto-scrolls
- [ ] All 13 categories display with correct items
- [ ] Categories expand/collapse properly
- [ ] Menu items show name, description, price, and image
- [ ] Specialty menu page loads with all sections
- [ ] Bingsu snowfall animation works
- [ ] Bubble tea floating bubbles animation works
- [ ] All carousels auto-scroll and respond to breakpoints
- [ ] Links to /menu, /specialty-menu, and FoodServe work
- [ ] Mobile responsive layout works
- [ ] No console errors

---

## Checkpoints

1. **After Task 3** (data and components created): Run build to verify compilation
2. **After Task 5** (MenuPage complete): Visual test menu page in browser
3. **After Task 7** (SpecialtyMenuPage complete): Visual test specialty page
4. **After Task 10** (build + lint): Ready for final verification
5. **After Task 11** (manual verification): Ready for commit

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
- Menu page renders at localhost:3000/menu
- Specialty menu page renders at localhost:3000/specialty-menu
- All 164+ menu items display correctly in categories
- Carousels function properly on all breakpoints
- PDF download works

---

## Success Criteria

- [ ] menuData.ts migrated with all 13 categories and 164+ items
- [ ] MenuItem and MenuCategory components created
- [ ] MenuPage fully migrated with PDF section and all categories
- [ ] SpecialtyMenuPage fully migrated with Bingsu/Toast/Bubble Tea
- [ ] specialtyData.ts created for clean data separation
- [ ] All pages have SEO metadata
- [ ] Build passes
- [ ] Lint passes
- [ ] Mobile responsive verified
- [ ] Animations work (snowfall, floating bubbles, carousels)
- [ ] No console errors in browser

---

## Output

**Files to create:**
- `src/data/menuData.ts`
- `src/data/specialtyData.ts`
- `src/components/menu/MenuItem.tsx`
- `src/components/menu/MenuCategory.tsx`
- `src/app/menu/page.tsx`
- `src/app/specialty-menu/page.tsx`
- `public/SweetLifeMenuNewry.pdf` (copy)

**Commits:** Aim for 3-4 logical commits:
1. Add menuData and specialtyData files
2. Create MenuItem and MenuCategory components
3. Create MenuPage with all sections
4. Create SpecialtyMenuPage with animations

---

## Notes

- The PDF menu file needs to be copied from the reference codebase
- FoodServe external ordering link is used for the "Order Now" CTA
- Dietary tags (K), (V), (GF) appear in item descriptions — no separate filtering implemented
- Specialty items have hardcoded data arrays (not from menuData)
- Swiper pagination bullet colors match brand primary (#F79D28)
- Snowfall and floating bubble animations use CSS keyframes via inline `<style>` tag

---
*Plan created: 2025-01-18*
