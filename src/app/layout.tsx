import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Sweet Life Cafe | Korean Cafe & Restaurant in Newry",
    template: "%s | Sweet Life Cafe",
  },
  description: "Sweet Life Cafe - Authentic Korean cuisine, Bingsu, Bubble Tea, specialty coffee, sushi, and more in the heart of Newry. Order online for pickup or delivery.",
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
    url: "https://sweetlifecafe.co.uk",
    siteName: "Sweet Life Cafe",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sweet Life Cafe | Korean Cafe & Restaurant in Newry",
    description: "Authentic Korean cuisine, Bingsu, Bubble Tea, specialty coffee, and more in Newry.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-16">{children}</main>
          <Footer />
          <WhatsAppWidget />
        </div>
      </body>
    </html>
  );
}
