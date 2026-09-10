import MenuView from './_components/MenuView';
import { getMenuCategories } from '@/lib/liveMenu';

// ISR: regenerate at most every 300s. The signed /api/revalidate webhook from
// sinra-os forces an earlier refresh whenever mum edits the menu.
export const revalidate = 300;

export default async function MenuPage() {
  const categories = await getMenuCategories();
  return <MenuView categories={categories} />;
}
