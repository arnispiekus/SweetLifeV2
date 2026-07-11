import { menuData, type MenuCategory } from '@/data/menuData';

/**
 * Live menu integration.
 *
 * sinra-os (mum's admin app) is the single source of truth for the menu. When
 * she edits a price / availability there, it fires a signed revalidate webhook
 * at /api/revalidate here, and this module fetches the fresh menu from the
 * sinra-os public API on the next request.
 *
 * SAFE BY DEFAULT: the live path is only used when LIVE_MENU=1 and
 * SINRA_PUBLIC_MENU_URL is set. Any failure — flag off, url unset, network
 * error, non-200, an unparseable body, or a live menu that fails the
 * completeness gate (see isCompleteEnough) — falls back to the curated static
 * `menuData`, so the public site can never render an empty, sparse or broken
 * menu. Populating + curating the live DB to match the static menu (images,
 * dietary tags in item names) is the prerequisite before flipping LIVE_MENU on.
 */

// This deployment serves the Newry site. sinra-os items carry an `available_at`
// location array (e.g. ['newry'] | ['newry','drogheda']); items not offered
// here must not appear. Fail-closed: missing/empty location data means the
// item is NOT available anywhere. This PR and sinra-os #5 (which populates
// available_at) land together, so live data always carries the field by the
// time this path is active — a divergence between the two must hide items,
// never leak them.
const SITE_LOCATION = 'newry';

interface ApiVariant {
  id: number;
  name: string;
  // Supabase serialises numeric/decimal columns as strings.
  price: string | number | null;
}

interface ApiMenuItem {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: string | number | null;
  is_available: boolean;
  image_url: string | null;
  // Present when the item is priced by variant (sinra attaches item_variants).
  item_variants?: ApiVariant[] | null;
  // Cross-PR (sinra-os #5): these are edited in the admin item editor but are
  // NOT yet in the public API SELECT. Modelled here so the consumer is coherent
  // the moment sinra exposes them; inert (undefined) until then.
  seasonal?: string | null;
  available_at?: string[] | null;
}

interface ApiSubsection {
  id: number;
  menu_items?: ApiMenuItem[] | null;
}

interface ApiSection {
  id: number;
  name: string;
  subsections?: ApiSubsection[] | null;
}

interface ApiMenu {
  business?: { name: string; slug: string };
  sections?: ApiSection[] | null;
}

// Curated-menu size, used to derive the completeness thresholds below.
const STATIC_ITEM_COUNT = menuData.reduce((n, c) => n + c.items.length, 0);
const STATIC_CATEGORY_COUNT = menuData.length;

// Completeness gate (see finding: "sparse menu" safety). A live response must
// carry at least half of the curated menu's breadth before it is allowed to
// replace it; anything less almost certainly means a broken query / half-seeded
// DB, and we fall back to the static menu rather than show a one-item page.
// Derived from the static counts so it auto-tracks curation growth.
export const MIN_LIVE_CATEGORIES = Math.ceil(STATIC_CATEGORY_COUNT * 0.5);
export const MIN_LIVE_ITEMS = Math.ceil(STATIC_ITEM_COUNT * 0.5);

// Parse a price coming off the API (string | number | null). Returns a finite,
// strictly-positive number or null — never NaN, zero, or negative, so the UI can
// never render "£NaN" or "£0.00" / "from £0.00". A zero, blank/whitespace-only,
// or negative value means the item is unpriced (or a data error) and must be
// dropped rather than shown as free.
function parsePrice(value: unknown): number | null {
  if (value == null || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Is this item offered at the location this site serves? Fail-closed: missing
// or empty location data means "not available here" — see SITE_LOCATION note.
function availableHere(available_at: string[] | null | undefined): boolean {
  if (!Array.isArray(available_at) || available_at.length === 0) return false;
  return available_at.includes(SITE_LOCATION);
}

// Normalise an item name for image matching: drop dietary suffixes like "(GF)"
// and punctuation so "Chai Latte (V)" matches the static "Chai Latte" image.
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([a-z]+\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Build a name→image lookup from the curated static menu, so live items keep
// their photography when a matching name exists (the DB image_url wins if set).
const STATIC_IMAGE_BY_NAME: Map<string, string> = new Map(
  menuData
    .flatMap((c) => c.items)
    .filter((i): i is typeof i & { image: string } => Boolean(i.image))
    .map((i) => [normalizeName(i.name), i.image])
);

// Resolve an item's displayable price from its parent price and any variants.
// Returns the effective price and whether it is a "from" (lowest-of-many) price.
// Returns null when no valid price can be derived (item should be dropped).
function resolvePrice(it: ApiMenuItem): { price: number; from: boolean } | null {
  const base = parsePrice(it.price);
  const variantPrices = (it.item_variants ?? [])
    .map((v) => parsePrice(v.price))
    .filter((p): p is number => p != null);

  const candidates = base != null ? [base, ...variantPrices] : variantPrices;
  if (candidates.length === 0) return null;

  const price = Math.min(...candidates);
  // "from" only when there is genuine price spread across variants.
  const from = new Set(candidates).size > 1;
  return { price, from };
}

/**
 * Map the sinra-os public menu API response into the shape the site's
 * MenuCategory/MenuItem components already render. Pure + exported for tests.
 *
 * Per-item validation drops anything unrenderable — an item is kept only if it
 * has a string name, is marked is_available, is available at this location,
 * and yields a valid price (from its own price or its variants). A section
 * with a non-string name is dropped entirely rather than risk rendering a
 * malformed heading. All of this runs before the completeness gate
 * (isCompleteEnough), so malformed or missing data is always counted as
 * absent, never as present. Categories left empty are dropped.
 */
export function mapApiMenu(api: ApiMenu): MenuCategory[] {
  return (api.sections ?? [])
    .filter((section) => typeof section?.name === 'string' && section.name.trim() !== '')
    .map((section) => {
      const items = (section.subsections ?? [])
        .flatMap((ss) => ss.menu_items ?? [])
        .filter(
          (it) =>
            typeof it?.name === 'string' &&
            it.name.trim() !== '' &&
            it.is_available === true &&
            availableHere(it.available_at)
        )
        .map((it) => {
          const resolved = resolvePrice(it);
          if (resolved == null) return null;
          const seasonal = typeof it.seasonal === 'string' && it.seasonal.trim() !== ''
            ? it.seasonal.trim()
            : undefined;
          return {
            id: it.id,
            name: it.name,
            description: it.description ?? '',
            price: resolved.price,
            priceFrom: resolved.from || undefined,
            image: it.image_url ?? STATIC_IMAGE_BY_NAME.get(normalizeName(it.name)),
            seasonal,
          };
        })
        .filter((it): it is NonNullable<typeof it> => it != null);
      return { id: section.id, name: section.name, items };
    })
    .filter((cat) => cat.items.length > 0);
}

/**
 * Is a mapped live menu complete enough to replace the curated static menu?
 * Guards against a broken/half-seeded upstream silently wiping the public menu
 * down to a handful of items. Exported for tests.
 */
export function isCompleteEnough(categories: MenuCategory[]): boolean {
  const itemCount = categories.reduce((n, c) => n + c.items.length, 0);
  return categories.length >= MIN_LIVE_CATEGORIES && itemCount >= MIN_LIVE_ITEMS;
}

/**
 * Resolve the menu categories for the public /menu page. Returns live data when
 * enabled and healthy, otherwise the curated static menu. Never throws.
 */
export async function getMenuCategories(): Promise<MenuCategory[]> {
  const url = process.env.SINRA_PUBLIC_MENU_URL;
  if (process.env.LIVE_MENU !== '1' || !url) return menuData;

  try {
    // ISR-cached at 300s; the signed webhook forces an earlier refresh by
    // calling revalidatePath('/menu'), which re-runs this fetch. The
    // `Cache-Control: no-cache` request header asks the upstream CDN to
    // revalidate with its origin on that refetch so we don't read a stale edge
    // copy. This is best-effort (a CDN may ignore request no-cache); the
    // authoritative freshness fix is sinra revalidating its own public route on
    // mutation — see PR notes / sinra-os #5. An 8s abort deadline guards
    // against a stalled connection/body hanging the build/ISR request until
    // platform timeout; the catch below falls back to the static menu.
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return menuData;
    const json = (await res.json()) as ApiMenu;
    const mapped = mapApiMenu(json);
    return isCompleteEnough(mapped) ? mapped : menuData;
  } catch {
    return menuData;
  }
}
