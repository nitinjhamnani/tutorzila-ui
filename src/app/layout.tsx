
import type { Metadata, Viewport } from "next";
import { Roboto } from 'next/font/google';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from "@/components/shared/AppHeader";
import { Providers } from "./providers";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
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
    icon: "/assets/images/favicon.ico", // User should provide this
    apple: "/assets/images/tutorzila-apple-touch-icon.png", // User should provide this
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
    <html lang="en" className={`${roboto.variable}`} suppressHydrationWarning>
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
