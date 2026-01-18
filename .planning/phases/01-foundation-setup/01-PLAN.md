# Phase 1: Foundation Setup

## Objective

Configure Next.js project with Tailwind theme, fonts, and base structure migrated from existing site.

## Execution Context

**Reference codebase:** `/Users/arnispiekus/Work/Github/SweetLifeNewry`
- `tailwind.config.js` — Theme colors (primary: #F79D28, secondary variants)
- `src/index.css` — Global styles, utility classes, animations
- `public/` — 263MB of images to copy

**Target project:** `/Users/arnispiekus/Work/Github/sweet-life-v2`

## Context

This is a migration from Vite/React to Next.js 16. The existing site has:
- Custom Tailwind theme with orange primary (#F79D28)
- Poppins font from Google Fonts
- Utility classes: btn, btn-primary, btn-outline, card, section, nav-link
- CSS animations: fadeIn, stagger-item
- Line-clamp utilities (though Tailwind 4 may have these built-in)

Next.js 16 uses Tailwind 4 which has different configuration syntax.

## Tasks

### Task 1: Install dependencies
Install required packages from existing project.

```bash
cd /Users/arnispiekus/Work/Github/sweet-life-v2
npm install framer-motion lucide-react swiper gray-matter marked
```

### Task 2: Configure Tailwind theme
Update Tailwind configuration with Sweet Life colors.

**Note:** Tailwind 4 in Next.js uses CSS-based configuration, not JS config file.

Edit `src/app/globals.css` to add theme:
```css
@import "tailwindcss";

@theme {
  --color-primary: #F79D28;
  --color-secondary-light: #F8B366;
  --color-secondary: #F5A847;
}
```

### Task 3: Configure Poppins font
Set up Google Fonts using Next.js font optimization.

Edit `src/app/layout.tsx`:
```tsx
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})
```

Apply to body and update metadata.

### Task 4: Migrate global styles
Add utility classes and animations to `globals.css`.

Migrate from existing `index.css`:
- Base body styles (bg-stone-50, text-stone-800)
- Button utilities (btn, btn-primary, btn-outline)
- Container and section utilities
- Card styles
- Nav link styles
- Fade animations
- Line-clamp utilities (check if needed in Tailwind 4)

### Task 5: Create project structure
Set up folders for components, data, and content.

```bash
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/components/menu
mkdir -p src/lib
mkdir -p src/data
mkdir -p src/content/blog
```

### Task 6: Copy images to public folder
Copy all images from existing site.

```bash
# Copy entire public folder contents (except _redirects which is Netlify-specific)
cp -r /Users/arnispiekus/Work/Github/SweetLifeNewry/public/* /Users/arnispiekus/Work/Github/sweet-life-v2/public/
# Remove Netlify-specific file
rm -f /Users/arnispiekus/Work/Github/sweet-life-v2/public/_redirects
```

### Task 7: Verify setup works
Run dev server and confirm no errors.

```bash
npm run dev
```

Check that:
- Dev server starts without errors
- Tailwind styles compile
- Font loads correctly

## Verification

- [ ] Dependencies installed (framer-motion, lucide-react, swiper, gray-matter, marked)
- [ ] Tailwind theme has primary color #F79D28
- [ ] Poppins font configured and loading
- [ ] Global utility classes available (btn, card, section, etc.)
- [ ] Project structure created (components/, lib/, data/, content/)
- [ ] Images copied to public/ folder
- [ ] Dev server runs without errors

## Success Criteria

- Next.js dev server starts successfully
- Visiting localhost shows default page with correct font
- Tailwind classes using `primary` color work
- Project is ready for component development

## Output

- Configured `globals.css` with theme and utilities
- Configured `layout.tsx` with Poppins font
- Created folder structure
- 263MB of images in public/
- All dependencies installed
