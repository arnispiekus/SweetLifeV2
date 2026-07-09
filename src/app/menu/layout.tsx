import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu | Sweet Life Cafe Newry',
  description: 'Browse the full Sweet Life Cafe menu - Korean dishes, breakfast, lunch, sushi, Bingsu, and drinks, with Keto, Vegan, and Gluten-Free options. Order online or download the PDF.',
  alternates: {
    canonical: '/menu',
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
