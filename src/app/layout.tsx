
import type { Metadata } from "next";
import { Poppins } from 'next/font/google'; // Changed from Montserrat to Poppins
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from "@/components/shared/AppHeader";
import { Providers } from "./providers"; // Jotai Provider

const poppins = Poppins({ // Changed from montserrat to poppins
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Added common weights for Poppins
  variable: '--font-poppins', // Changed variable name
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
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
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

