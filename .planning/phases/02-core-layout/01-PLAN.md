# Phase 2: Core Layout Components

## Objective

Build the site shell — Header, Footer, and WhatsApp widget that appear on every page. Convert React Router components to Next.js App Router patterns.

## Execution Context

**Reference codebase:** `/Users/arnispiekus/Work/Github/SweetLifeNewry`
- `src/components/layout/Header.tsx` — Navigation with dropdown, mobile menu, scroll behavior
- `src/components/layout/Footer.tsx` — Links, contact info, opening hours, social icons
- `src/components/layout/Layout.tsx` — Wrapper component (not needed in Next.js - use layout.tsx)
- `src/components/ui/WhatsAppWidget.tsx` — Floating chat button

**Target project:** `/Users/arnispiekus/Work/Github/sweet-life-v2`

## Context

### Migration patterns needed:
- `react-router-dom` Link → `next/link` Link
- `useLocation()` → `usePathname()` from `next/navigation`
- All components using hooks need `'use client'` directive
- Next.js Image component for logo optimization

### Key features to preserve:
- Scroll-triggered header background change
- Desktop dropdown menu for Menu items
- Mobile hamburger menu with accordion
- Active link highlighting based on current path
- WhatsApp floating widget with pulse animation
- Opening hours display in footer

### Navigation structure:
- Home: `/`
- Menu (dropdown):
  - Full Menu: `/menu`
  - Specialty Menu: `/specialty-menu`
- About Us: `/about`
- Sushi: `/sushi`
- Bookings: `/bookings`
- Contact: `/contact`
- Order Now: External link (FoodServe)

## Tasks

### Task 1: Create Header component

Create `src/components/layout/Header.tsx` as a client component.

**Convert from reference:**
1. Add `'use client'` directive at top
2. Replace `import { Link, useLocation } from 'react-router-dom'` with:
   ```tsx
   import Link from 'next/link';
   import { usePathname } from 'next/navigation';
   ```
3. Replace `location.pathname` with `pathname` from `usePathname()`
4. Keep all useState and useEffect hooks as-is
5. Replace `<Link to="...">` with `<Link href="...">`
6. Use Next.js Image for logo: `import Image from 'next/image'`
7. Keep external "Order Now" link as `<a>` tag

**Key behaviors to preserve:**
- Scroll detection for header shadow
- Mobile menu toggle
- Menu dropdown hover/click behavior
- Active link styling

### Task 2: Create Footer component

Create `src/components/layout/Footer.tsx` as a client component (needs dynamic year).

**Convert from reference:**
1. Add `'use client'` directive
2. Replace react-router Link with next/link
3. Use Next.js Image for logo
4. Keep all Lucide icons (MapPin, Clock, Phone, Mail, Instagram, Facebook)
5. Keep the hidden blog link in footer
6. Keep all external links (social media, maps, phone, email) as `<a>` tags

### Task 3: Create WhatsApp widget

Create `src/components/ui/WhatsAppWidget.tsx`.

**Convert from reference:**
1. No `'use client'` needed - no hooks, just JSX
2. Copy component almost as-is
3. Keep MessageCircle icon from lucide-react
4. Keep pulse animation and tooltip hover effect

### Task 4: Add ping animation to globals.css

Add the ping animation used by WhatsAppWidget to `src/app/globals.css`:

```css
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
```

**Note:** Check if Tailwind 4 includes `animate-ping` by default first. If so, skip this task.

### Task 5: Update root layout

Update `src/app/layout.tsx` to include Header, Footer, and WhatsApp widget.

**Changes:**
1. Import Header, Footer, WhatsAppWidget
2. Wrap `{children}` in a flex container with header/footer:
   ```tsx
   <div className="flex flex-col min-h-screen">
     <Header />
     <main className="flex-grow pt-16">{children}</main>
     <Footer />
     <WhatsAppWidget />
   </div>
   ```
3. Keep existing font and metadata configuration

### Task 6: Create test page content

Update `src/app/page.tsx` to have meaningful test content that exercises the layout:

```tsx
export default function Home() {
  return (
    <div className="section container">
      <h1 className="section-title">Welcome to Sweet Life</h1>
      <p className="section-subtitle">Testing the layout components</p>

      {/* Enough content to test scroll behavior */}
      <div className="space-y-8">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="card p-8">
            <h2 className="text-xl font-medium mb-2">Section {i}</h2>
            <p>Lorem ipsum content to test scrolling and header shadow behavior.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Task 7: Verify responsive behavior

Run dev server and verify:

```bash
cd /Users/arnispiekus/Work/Github/sweet-life-v2
npm run dev
```

**Desktop checks:**
- [ ] Header fixed at top with logo
- [ ] Navigation links visible
- [ ] Menu dropdown shows on hover
- [ ] Active link highlighting works (home should be active)
- [ ] Header gets shadow on scroll
- [ ] Footer displays with all sections
- [ ] WhatsApp widget visible bottom-right with pulse

**Mobile checks (resize browser or use devtools):**
- [ ] Logo centered on mobile
- [ ] Hamburger menu button visible
- [ ] Mobile menu opens/closes
- [ ] Menu dropdown works in mobile menu
- [ ] All links work
- [ ] Footer stacks properly
- [ ] WhatsApp widget doesn't overlap content

### Task 8: Run build to verify no errors

```bash
npm run build
```

Ensure no TypeScript or build errors.

## Verification

- [ ] Header component created at `src/components/layout/Header.tsx`
- [ ] Footer component created at `src/components/layout/Footer.tsx`
- [ ] WhatsAppWidget created at `src/components/ui/WhatsAppWidget.tsx`
- [ ] Root layout updated with Header, Footer, WhatsApp
- [ ] Navigation links work (even if pages don't exist yet)
- [ ] Mobile menu opens and closes
- [ ] Header shadow appears on scroll
- [ ] WhatsApp widget visible with hover tooltip
- [ ] `npm run build` passes with no errors
- [ ] Responsive design works on mobile and desktop

## Success Criteria

- Site has consistent header and footer on all pages
- Navigation structure matches existing site
- Mobile users can access all navigation items
- WhatsApp contact is prominent and accessible
- No console errors or build failures
- Page transitions feel smooth

## Output

- `src/components/layout/Header.tsx` — Full navigation with mobile menu
- `src/components/layout/Footer.tsx` — Contact info, links, hours
- `src/components/ui/WhatsAppWidget.tsx` — Floating chat button
- Updated `src/app/layout.tsx` — Integrated layout shell
- Updated `src/app/page.tsx` — Test content for verification
