
import type { Metadata, Viewport } from "next";
import { Montserrat } from 'next/font/google'; // Changed from Roboto to Montserrat
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from "@/components/shared/AppHeader";
import { Providers } from "./providers";

const montserrat = Montserrat({ // Changed from roboto to montserrat
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
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
    // startupImage: [ // Optional: specify startup images for iOS
    //   { url: '/assets/images/apple-splash-2048x2732.png', media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
    // ],
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
    <html lang="en" className={`${montserrat.variable}`} suppressHydrationWarning> {/* Changed variable */}
      <body
        className="antialiased min-h-screen flex flex-col font-sans tracking-wide"
      >
        <Providers>
          <AppHeader />
          <main className="flex-grow animate-in fade-in duration-500 ease-out">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
