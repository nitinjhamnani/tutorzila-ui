
import type { Metadata, Viewport } from "next";
import { Montserrat } from 'next/font/google';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import logoAsset from '@/assets/images/logo.png';
import { VerificationBanner } from "@/components/shared/VerificationBanner"; // Import the banner

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'], // Added 600 and 800
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "Tutorzila - Find Your Perfect Tutor",
  description: "Connecting parents with qualified tutors.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tutorzila",
  },
  icons: {
    icon: "/assets/images/favicon.ico", 
    apple: "/assets/images/tutorzila-apple-touch-icon.png", 
  },
};

export const viewport: Viewport = {
  themeColor: "#DE6262",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable}`} suppressHydrationWarning>
      <body
        className="antialiased min-h-screen flex flex-col font-sans tracking-wide" 
      >
        <Providers>
          <VerificationBanner />
          {/* The main content area might need dynamic top padding if the banner is present and fixed.
              This is handled by CSS variable --verification-banner-height set by VerificationBanner */}
          <main className="flex-grow animate-in fade-in duration-500 ease-out pt-[var(--verification-banner-height,0px)]">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
