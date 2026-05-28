# Sweet Life Menu System

The menu is no longer hardcoded. It lives in a **Supabase Postgres database** and feeds
three things automatically:

```
                    ┌─────────────────────────┐
                    │   Supabase (Postgres)    │
                    │   "Sweet Life Newry"     │
                    │   ref: ftcpmjulnoaehbygvhsm
                    └────────────┬────────────┘
                                 │  (single source of truth)
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
   Website /menu          PDF /menu.pdf           Admin /admin
   (live, ISR 60s)     (on-demand download)    (mum edits here)
```

Change a price once in the admin, and the website + PDF both update within ~60 seconds.

---

## 1. Database

**Project:** Supabase "Sweet Life Newry" (`ftcpmjulnoaehbygvhsm`, region eu-west-2).

**Schema** (normalised):

| Table | Purpose |
|---|---|
| `sections` | Top-level menu groups (Coffee & Tea, Lunch, …) |
| `subsections` | Groups within a section (Coffee, Tea, Matcha, …) |
| `menu_items` | The items themselves — name, description, price, image_url, tags, availability |
| `item_variants` | Size/version variants (e.g. Double Espresso, Bingsu Medium/Large) |
| `modifier_groups` / `modifier_options` | Add-ons (Add Syrup, Flavoured Matcha, …) |
| `item_modifier_groups` | Links items to their modifier groups |
| `allergens` / `item_allergens` | Allergen codes (G, M, Eg, …) and item links |

Key `menu_items` columns:
- `price` — the **in-store price** (the website shows this directly; no markup).
- `is_available` — unticking hides the item from the public site/PDF.
- `needs_review` — flags items imported from Revolut that need a human to confirm name/description/allergens.
- `revolut_product_id` — the exact Revolut POS product name, so future CSV exports diff precisely.
- `image_url` — path under `/public` (e.g. `/CoffeeTea/Latte.webp`).
- `tags` — free-form (`new`, `popular`, …).

**Security (RLS):**
- Anyone (anon) can **read** available items only.
- **Writes** require an authenticated admin session. The app never ships a service-role key.

---

## 2. Website (`/menu`)

- Server-rendered and **ISR-cached for 60 seconds** (`src/app/(site)/menu/page.tsx`).
- Data comes from `getMenu()` in `src/lib/menu.ts`, which uses a **cookieless anon client**
  so the page stays cacheable.
- Each Supabase section becomes one on-screen category (subsections are flattened).
- Shows true in-store prices. Items without a photo render as text-only cards.

To change what shows on the site, edit items in the **admin** (below) — do not edit code.

---

## 3. Admin (`/admin`)

A password-protected area for editing the menu without touching code or Canva.

### Logging in
1. Go to `/admin` → you'll be sent to `/admin/login`.
2. Sign in with your email + password (Supabase Auth).
3. To add or reset a user: Supabase Dashboard → Authentication → Users.

### What you can do
- **Search** for any item by name.
- **Edit** price, name, description inline. A **Save** button appears when you change something.
- **Availability** — untick the checkbox to hide an item from the website/PDF (without deleting it).
- **Add item** — under any subsection, click "Add item" (name + price). New items are flagged
  `needs_review` so you remember to add a description/allergens later.
- **Delete** — the trash icon (asks for confirmation).

Changes save straight to the database; the website and PDF refresh within ~60 seconds.

### How it's built
- Auth/session: `@supabase/ssr` (`src/lib/supabase/{server,client,middleware}.ts`).
- Route protection: `src/proxy.ts` (Next.js 16 renamed `middleware` → `proxy`). Unauthenticated
  visitors to `/admin/*` are redirected to login.
- UI: `src/components/admin/MenuManager.tsx`. Writes go directly to Supabase, allowed by the
  "authenticated write" RLS policies.

---

## 4. PDF menu (`/menu.pdf`)

- Generated **on demand** from the database with `@react-pdf/renderer` (`src/lib/menu-pdf.tsx`).
- Always reflects current in-store prices. ISR-cached 60s.
- Linked from the menu page ("View / Download PDF") and the admin nav.

---

## 5. Keeping in sync with Revolut (the till)

**Revolut has no public catalog API**, so syncing is a manual export → reconcile step
(only needed when the till and website drift apart):

1. In the Revolut POS web portal, export the product list as CSV.
2. Save it to `menu-extraction/revolut-export.csv`.
3. Run the reconciliation (see `menu-extraction/`) to diff against the database.
4. Apply approved changes.

Rules agreed with the owner:
- **Highest price wins** when the till and website disagree.
- The website **keeps the menu granular** (individual drink/dessert flavours) even though the
  till groups them into generic SKUs.

See `menu-extraction/revolut-pos-cleanup.md` for the outstanding till cleanup list.

---

## 6. The data pipeline (`menu-extraction/`)

How the database was originally built and can be re-seeded:

| File | Purpose |
|---|---|
| `menu.json` | Structured menu parsed from the original Canva PDF — the seed source of truth |
| `build_seed.py` | Generates `seed.sql` from `menu.json` |
| `split_seed.py` | Splits `seed.sql` into batches for the Supabase Management API |
| `match_images.py` | Matches `/public` images to items → `apply_images.sql` |
| `reconciliation-report.md` | Full Revolut-vs-menu diff |
| `revolut-pos-cleanup.md` | Action list for the till |
| `revolut-research.md` | Why there's no Revolut API |

Large SQL is applied via the Supabase **Management API**
(`POST https://api.supabase.com/v1/projects/<ref>/database/query`) using the
`SUPABASE_ACCESS_TOKEN` from Infisical (project `claude-dev`) with a real `User-Agent` header.

---

## 7. Environment variables

In `.env.local` (and Vercel project settings):

```
NEXT_PUBLIC_SUPABASE_URL=https://ftcpmjulnoaehbygvhsm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
RESEND_API_KEY=<resend key>
```

The anon key is safe to expose (read-only via RLS). The service-role key is **not** used by the app.

---

## 8. Common tasks

| I want to… | Do this |
|---|---|
| Change a price | Admin → search item → edit price → Save |
| Hide an item temporarily | Admin → untick availability |
| Add a new item | Admin → Add item under a subsection |
| Add a photo to an item | Drop the image in `/public/<Folder>/`, set `image_url` on the item (admin image upload is a future enhancement) |
| Reprint the menu | Open `/menu.pdf` → print/download |
| Reconcile with the till | Export Revolut CSV → `menu-extraction/` reconcile |
