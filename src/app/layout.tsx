
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from "@/components/shared/AppHeader";
import { Providers } from "./providers"; // Jotai Provider

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Tutorzila - Find Your Perfect Tutor",
  description: "Connecting parents with qualified tutors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body
        className="antialiased min-h-screen flex flex-col font-sans"
      >
        <Providers> {/* Jotai Provider */}
          <AppHeader />
          <main className="flex-grow">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
