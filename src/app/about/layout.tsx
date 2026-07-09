import type { Metadata } from 'next';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';

const TITLE = 'About Us';
const DESCRIPTION = 'A family-owned Korean cafe bringing authentic flavours and warm hospitality to Newry since 2019. Discover our story, our values, and our commitment to fresh, made-to-order food.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: `${TITLE} | Sweet Life Cafe`,
    description: DESCRIPTION,
    url: `${SITE_URL}/about`,
    siteName: 'Sweet Life Cafe',
    locale: 'en_GB',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
