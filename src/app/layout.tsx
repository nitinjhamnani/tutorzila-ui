import type { Metadata, Viewport } from "next";
import { Montserrat } from 'next/font/google'; // Changed from Roboto
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import logoAsset from '@/assets/images/logo.png';

const montserrat = Montserrat({ // Changed from roboto
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'], // Adjusted weights for Montserrat
  variable: '--font-montserrat', // Changed variable name
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
    <html lang="en" className={`${montserrat.variable}`} suppressHydrationWarning> {/* Use montserrat variable */}
      <body
        className="antialiased min-h-screen flex flex-col font-sans tracking-wide" // font-sans will now use Montserrat via Tailwind config
      >
        <Providers>
          <main className="flex-grow animate-in fade-in duration-500 ease-out">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
