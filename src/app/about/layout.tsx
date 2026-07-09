import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Sweet Life Cafe Newry',
  description: 'A family-owned Korean cafe bringing authentic flavours and warm hospitality to Newry since 2019. Discover our story, our values, and our commitment to fresh, made-to-order food.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
