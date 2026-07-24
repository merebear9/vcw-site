import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickySubscribeBar from "@/components/StickySubscribeBar";
import Providers from "@/components/Providers";
import { siteUrl } from "@/lib/utils";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Vermilion County Watchdog | Holding Power Accountable",
    template: "%s | Vermilion County Watchdog",
  },
  description:
    "Hyperlocal accountability journalism for Danville and Vermilion County, Illinois. Accountability. Transparency. Exposure.",
  openGraph: {
    title: "Vermilion County Watchdog",
    description: "Holding Power Accountable in Vermilion County",
    url: siteUrl(),
    siteName: "Vermilion County Watchdog",
    images: [{ url: "/images/og-default.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vermilion County Watchdog",
    description: "Holding Power Accountable in Vermilion County",
    images: ["/images/og-default.png"],
  },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${oswald.variable} ${inter.variable} bg-vcw-black font-body text-white antialiased`}>
        <Providers>
          <Header />
          <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
          <Footer />
          <StickySubscribeBar />
        </Providers>
      </body>
    </html>
  );
}
