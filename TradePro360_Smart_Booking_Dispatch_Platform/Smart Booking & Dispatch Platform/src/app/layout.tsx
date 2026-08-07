import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Barlow_Condensed } from "next/font/google";
import "./maplibre-gl.css";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import { BrandStyleProvider } from "@/components/theme/brand-style-provider";
import { Toaster } from "@/components/ui/sonner";
import { StoreSync } from "@/components/common/store-sync";
import { GlobalHomeButton } from "@/components/common/global-home-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TradeWeb — Smart Booking & Dispatch Platform",
    template: "%s | TradeWeb",
  },
  description:
    "AI-powered job dispatch, live engineer tracking, instant UK quotes, VAT invoicing and a white-label customer portal for plumbers, electricians, cleaners and heating engineers.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ThemeProvider>
          <BrandStyleProvider />
          <StoreSync />
          {children}
          <GlobalHomeButton />
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
