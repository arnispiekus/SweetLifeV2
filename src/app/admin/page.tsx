import { createClient } from '@/lib/supabase/server';
import MenuManager, { type AdminSection } from '@/components/admin/MenuManager';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sections')
    .select(
      `
      id, name, display_order,
      subsections (
        id, name, display_order,
        menu_items (
          id, name, description, price, is_available, needs_review, display_order
        )
      )
    `,
    )
    .order('display_order');

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 rounded-lg p-4">
        Failed to load menu: {error.message}
      </div>
    );
  }

  type RawSection = {
    id: number;
    name: string;
    display_order: number;
    subsections: {
      id: number;
      name: string;
      display_order: number;
      menu_items: {
        id: number;
        name: string;
        description: string | null;
        price: number | null;
        is_available: boolean;
        needs_review: boolean;
        display_order: number;
      }[];
    }[];
  };

  const sections: AdminSection[] = ((data ?? []) as RawSection[]).map((s) => ({
    id: s.id,
    name: s.name,
    subsections: [...s.subsections]
      .sort((a, b) => a.display_order - b.display_order)
      .map((sub) => ({
        id: sub.id,
        name: sub.name,
        items: [...sub.menu_items]
          .sort((a, b) => a.display_order - b.display_order)
          .map((i) => ({
            id: i.id,
            name: i.name,
            description: i.description ?? '',
            price: i.price,
            is_available: i.is_available,
            needs_review: i.needs_review,
          })),
      })),
  }));

  return <MenuManager initialSections={sections} />;
}
