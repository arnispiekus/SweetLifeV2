import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private Room Bookings | Sweet Life Cafe Newry',
  description: 'Book the private event space at Sweet Life Cafe Newry for birthdays, celebrations, and gatherings. Catering included - enquire by phone or WhatsApp.',
  alternates: {
    canonical: '/bookings',
  },
};

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
