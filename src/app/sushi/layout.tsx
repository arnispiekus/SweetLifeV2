import type { Metadata } from 'next';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';

const TITLE = 'Sushi';
const DESCRIPTION = 'Fresh sushi platters available for pre-order at Sweet Life Cafe Newry, including a vegan option. Order ahead for pickup.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/sushi',
  },
  openGraph: {
    title: `${TITLE} | Sweet Life Cafe`,
    description: DESCRIPTION,
    url: `${SITE_URL}/sushi`,
    siteName: 'Sweet Life Cafe',
    locale: 'en_GB',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function SushiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
