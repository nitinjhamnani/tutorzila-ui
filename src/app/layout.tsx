
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';
import './globals.css';
import Providers from '@/components/providers';
import { GlobalLoader } from '@/components/shared/GlobalLoader';
import { AppLayoutClient } from '@/components/shared/AppLayoutClient';

export const metadata: Metadata = {
  title: 'Tutorzila - Find Your Perfect Tutor',
  description: 'Tutorzila is the leading platform connecting parents with qualified, passionate tutors for personalized learning. Post tuition requirements, browse tutor profiles, and start learning today.',
  icons: {
    icon: '/IconOnly_Transparent.png?v=1',
    apple: '/IconOnly_Transparent.png?v=1',
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Tutorzila',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#DE6262" />
      </head>
      <body>
        <Providers>
          <AppLayoutClient>{children}</AppLayoutClient>
          <GlobalLoader />
        </Providers>
      </body>
    </html>
  );
}
