import type { Metadata } from 'next';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';

const TITLE = 'Specialty Menu';
const DESCRIPTION = 'Explore our signature Korean specialties including Bingsu shaved ice desserts, Golden Toast, Bubble Teas, Milk Teas, and Fruit Teas at Sweet Life Cafe Newry.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/specialty-menu',
  },
  openGraph: {
    title: `${TITLE} | Sweet Life Cafe`,
    description: DESCRIPTION,
    url: `${SITE_URL}/specialty-menu`,
    siteName: 'Sweet Life Cafe',
    locale: 'en_GB',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function SpecialtyMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
