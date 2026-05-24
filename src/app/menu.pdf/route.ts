import { getMenu } from '@/lib/menu';
import { renderMenuPdf } from '@/lib/menu-pdf';

export const runtime = 'nodejs';
export const revalidate = 60;

export async function GET() {
  const categories = await getMenu();
  const pdf = await renderMenuPdf(categories);

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="SweetLifeMenuNewry.pdf"',
      'Cache-Control': 'public, max-age=0, s-maxage=60',
    },
  });
}
