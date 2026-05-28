import { createClient } from "@supabase/supabase-js";

// Public, cookieless client for anonymous menu reads. Keeps /menu and /menu.pdf
// cacheable (ISR) instead of forcing per-request dynamic rendering.
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

export interface MenuItemView {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface MenuCategoryView {
  id: number;
  name: string;
  items: MenuItemView[];
}

// Sections that are not part of the public food/drink menu listing.
const EXCLUDED_SECTION_SLUGS = new Set(["events-catering"]);

type Row = {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  subsections: {
    id: number;
    display_order: number;
    menu_items: {
      id: number;
      name: string;
      description: string | null;
      price: number | null;
      image_url: string | null;
      display_order: number;
      item_variants: { price: number | null }[];
    }[];
  }[];
};

/**
 * Fetches the full menu from Supabase and flattens each section (with its
 * subsections) into a single category of items — matching the shape the
 * existing menu UI renders. Only available items are returned (enforced by RLS).
 */
export async function getMenu(): Promise<MenuCategoryView[]> {
  const supabase = publicClient();

  const { data, error } = await supabase
    .from("sections")
    .select(
      `
      id, name, slug, display_order,
      subsections (
        id, display_order,
        menu_items (
          id, name, description, price, image_url, display_order,
          item_variants ( price )
        )
      )
    `,
    )
    .eq("is_active", true)
    .is("subsections.menu_items.seasonal", null)
    .contains("subsections.menu_items.available_at", ["newry"])
    .order("display_order");

  if (error) throw new Error(`Failed to load menu: ${error.message}`);

  const sections = (data ?? []) as Row[];

  return sections
    .filter((s) => !EXCLUDED_SECTION_SLUGS.has(s.slug))
    .map((section) => {
      const subsections = [...section.subsections].sort(
        (a, b) => a.display_order - b.display_order,
      );

      const items: MenuItemView[] = subsections
        .flatMap((sub) =>
          [...sub.menu_items].sort(
            (a, b) => a.display_order - b.display_order,
          ),
        )
        .map((item) => {
          const variantPrices = item.item_variants
            .map((v) => v.price)
            .filter((p): p is number => p != null);
          const minVariant = variantPrices.length
            ? Math.min(...variantPrices)
            : null;
          const price = item.price ?? minVariant ?? 0;

          return {
            id: item.id,
            name: item.name,
            description: item.description ?? "",
            price,
            image: item.image_url ?? undefined,
          };
        });

      return { id: section.id, name: section.name, items };
    })
    .filter((category) => category.items.length > 0);
}
