import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import StructuredData from "@/components/seo/StructuredData";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sweetlife.cafe"),
  title: {
    default: "Sweet Life Cafe | Korean Cafe & Restaurant in Newry",
    template: "%s | Sweet Life Cafe",
  },
  description: "Sweet Life Cafe - Authentic Korean cuisine, Bingsu, Bubble Tea, specialty coffee, sushi, and more in the heart of Newry. Order online for pickup or delivery.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "cafe newry",
    "korean food newry",
    "bingsu ireland",
    "bubble tea newry",
    "breakfast newry",
    "lunch newry",
    "sushi newry",
    "coffee shop newry",
    "sweet life cafe",
  ],
  authors: [{ name: "Sweet Life Cafe" }],
  openGraph: {
    title: "Sweet Life Cafe | Korean Cafe & Restaurant in Newry",
    description: "Authentic Korean cuisine, Bingsu, Bubble Tea, specialty coffee, and more. Order online or visit us at 12 Monaghan St, Newry.",
    url: "https://sweetlife.cafe",
    siteName: "Sweet Life Cafe",
    locale: "en_GB",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sweet Life Cafe | Korean Cafe & Restaurant in Newry",
    description: "Authentic Korean cuisine, Bingsu, Bubble Tea, specialty coffee, and more in Newry.",
    images: ["https://sweetlife.cafe/SweetLifeCafe_Hero_1.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "MLuewCXrpyCpbnmeCzUU6PpS6bXy6ntXJdAVDin-8pw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/SweetLifeCafe_Hero_1.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <StructuredData />
        {/* Source: Bailey, 9 Sep 2026. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3JD4LH4N1T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3JD4LH4N1T');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1595394785271696');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className={`${plusJakartaSans.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-16">{children}</main>
          <Footer />
          <WhatsAppWidget />
        </div>
        {/* explicit mode: auto would also collect on preview deployments (they run production bundles) */}
        <Analytics mode={process.env.VERCEL_ENV === "production" ? "production" : "development"} />
      </body>
    </html>
  );
}
