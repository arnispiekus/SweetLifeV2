import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Specialty Menu | Sweet Life Cafe Newry',
  description: 'Explore our signature Korean specialties including Bingsu shaved ice desserts, Golden Toast, Bubble Teas, Milk Teas, and Fruit Teas at Sweet Life Cafe Newry.',
};

export default function SpecialtyMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
