
import type { Metadata } from "next";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable}`} suppressHydrationWarning>
      <body
        className="antialiased min-h-screen flex flex-col font-sans"
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
