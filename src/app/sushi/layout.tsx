import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sushi | Sweet Life Cafe Newry',
  description: 'Fresh sushi platters available for pre-order at Sweet Life Cafe Newry, including vegan and gluten-free options. Order ahead for pickup.',
  alternates: {
    canonical: '/sushi',
  },
};

export default function SushiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
