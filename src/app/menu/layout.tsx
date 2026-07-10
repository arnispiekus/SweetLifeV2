import type { Metadata } from 'next';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';

const TITLE = 'Menu';
const DESCRIPTION = 'Browse the full Sweet Life Cafe menu - Korean dishes, breakfast, lunch, sushi, Bingsu, and drinks, with Keto, Vegan, and Gluten-Free options. Order online or download the PDF.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/menu',
  },
  openGraph: {
    title: `${TITLE} | Sweet Life Cafe`,
    description: DESCRIPTION,
    url: `${SITE_URL}/menu`,
    siteName: 'Sweet Life Cafe',
    locale: 'en_GB',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
