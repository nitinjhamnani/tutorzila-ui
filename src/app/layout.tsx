
import type { Metadata } from "next";
import { Montserrat } from 'next/font/google'; // Changed from Poppins to Montserrat
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from "@/components/shared/AppHeader";
import { Providers } from "./providers"; // Jotai Provider

const montserrat = Montserrat({ // Changed from poppins to montserrat
  subsets: ['latin'],
  variable: '--font-montserrat', // Changed variable name
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
    <html lang="en" className={`${montserrat.variable}`} suppressHydrationWarning> {/* Changed variable */}
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

