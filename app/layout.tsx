import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Banner } from "@/components/Banner";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { clerkEnabled } from "@/lib/auth";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: { default: "Ordinance — Livingston permits, in plain English", template: "%s · Ordinance" },
  description:
    "An unofficial, student-built helper that explains Livingston, NJ permit and zoning rules in plain English, with links to the exact code sections.",
};

export const viewport: Viewport = { themeColor: "#f6f4ee" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  const page = (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrument.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <Banner />
        <Nav />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
  return clerkEnabled() ? <ClerkProvider>{page}</ClerkProvider> : page;
}
