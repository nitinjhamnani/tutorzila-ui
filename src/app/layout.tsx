
import type { Metadata } from "next";
import { Roboto } from 'next/font/google'; // Changed from Poppins to Roboto
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from "@/components/shared/AppHeader";
import { Providers } from "./providers"; // Jotai Provider

const roboto = Roboto({ // Changed from poppins to roboto
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'], // Adjusted weights for Roboto
  variable: '--font-roboto', // Changed variable name
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
    <html lang="en" className={`${roboto.variable}`} suppressHydrationWarning> {/* Changed variable */}
      <body
        className="antialiased min-h-screen flex flex-col font-sans"
      >
        <Providers> {/* Jotai Provider */}
          <AppHeader />
          <main className="flex-grow animate-in fade-in duration-500 ease-out">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

