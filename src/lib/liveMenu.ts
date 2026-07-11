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
 * error, non-200, or an empty/sparse live menu — falls back to the curated
 * static `menuData`, so the public site can never render an empty or broken
 * menu. Populating + curating the live DB to match the static menu (images,
 * dietary tags in item names) is the prerequisite before flipping LIVE_MENU on.
 */

interface ApiMenuItem {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: string | null;
  is_available: boolean;
  image_url: string | null;
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

/**
 * Map the sinra-os public menu API response into the shape the site's
 * MenuCategory/MenuItem components already render. Pure + exported for tests.
 */
export function mapApiMenu(api: ApiMenu): MenuCategory[] {
  return (api.sections ?? [])
    .map((section) => {
      const items = (section.subsections ?? [])
        .flatMap((ss) => ss.menu_items ?? [])
        .map((it) => ({
          id: it.id,
          name: it.name,
          description: it.description ?? '',
          price: it.price != null && it.price !== '' ? Number(it.price) : 0,
          image: it.image_url ?? STATIC_IMAGE_BY_NAME.get(normalizeName(it.name)),
        }));
      return { id: section.id, name: section.name, items };
    })
    .filter((cat) => cat.items.length > 0);
}

/**
 * Resolve the menu categories for the public /menu page. Returns live data when
 * enabled and healthy, otherwise the curated static menu. Never throws.
 */
export async function getMenuCategories(): Promise<MenuCategory[]> {
  const url = process.env.SINRA_PUBLIC_MENU_URL;
  if (process.env.LIVE_MENU !== '1' || !url) return menuData;

  try {
    // ISR-cached at 300s to match the menu page revalidate window; the signed
    // webhook forces an earlier refresh when mum actually changes something.
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return menuData;
    const json = (await res.json()) as ApiMenu;
    const mapped = mapApiMenu(json);
    return mapped.length > 0 ? mapped : menuData;
  } catch {
    return menuData;
  }
}
