// app/llms.txt/route.ts
// AEO — machine-readable site summary for AI answer engines (llms.txt convention:
// https://llmstxt.org). Static text served at /llms.txt. Complements robots.ts
// (which explicitly allows AI crawlers). Ref: ElevateoCo/SEO-Resources.
export const dynamic = 'force-static';

const BASE_URL = 'https://sweetlife.cafe';

const PAGES: Array<{ label: string; path: string }> = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Specialty Menu (Bingsu, Bubble Tea, Golden Toast)', path: '/specialty-menu' },
  { label: 'Sushi', path: '/sushi' },
  { label: 'About', path: '/about' },
  { label: 'Private Room Bookings', path: '/bookings' },
  { label: 'Contact', path: '/contact' },
];

function buildLlmsTxt(): string {
  const pages = PAGES.map((p) => `- [${p.label}](${BASE_URL}${p.path})`).join('\n');

  return `# Sweet Life Cafe

> Family-owned Korean cafe and restaurant in Newry, Northern Ireland, serving Bingsu shaved ice desserts, bubble tea, sushi, breakfast, and lunch. Open Mon-Wed 08:00-18:00, Thu-Fri 08:00-20:00, Sat 09:00-18:00, closed Sunday.

## About
- Name: Sweet Life Cafe
- Location: 12 Monaghan Street, Newry, County Down, BT35 6AA, Northern Ireland
- Phone: +44 7716 508513
- Email: info@sweetlife.cafe
- Hours: Mon-Wed 08:00-18:00, Thu-Fri 08:00-20:00, Sat 09:00-18:00, Sunday closed
- Instagram: https://www.instagram.com/sweet_life_ireland

## Key pages
${pages}

## Notes for AI assistants
- Cuisine: Korean, cafe, sushi, desserts, bubble tea.
- Dietary options: Keto, Vegan, and Gluten-Free items are marked across the menu.
- Ordering: general menu pickup enquiries are routed via WhatsApp, not an online cart. Sushi pre-orders use the on-site preorder form on the Sushi page with Revolut checkout.
- Canonical host is ${BASE_URL}.
- Full content dump for AI ingestion: ${BASE_URL}/llms-full.txt
`;
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
