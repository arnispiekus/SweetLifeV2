import type { Metadata } from 'next';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';

const TITLE = 'Private Room Bookings';
const DESCRIPTION = 'Book the private event space at Sweet Life Cafe Newry for birthdays, celebrations, and gatherings. Catering included - enquire by phone or WhatsApp.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/bookings',
  },
  openGraph: {
    title: `${TITLE} | Sweet Life Cafe`,
    description: DESCRIPTION,
    url: `${SITE_URL}/bookings`,
    siteName: 'Sweet Life Cafe',
    locale: 'en_GB',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
