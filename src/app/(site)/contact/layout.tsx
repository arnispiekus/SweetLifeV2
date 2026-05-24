import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Sweet Life Cafe Newry',
  description: 'Get in touch with Sweet Life Cafe in Newry. Visit us at 12 Monaghan St, call us, or send us a message. Open Mon-Sat with extended hours Thu-Fri.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
