
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';
import './globals.css';
import Providers from '@/components/providers';
import { GlobalLoader } from '@/components/shared/GlobalLoader';
import { AppLayoutClient } from '@/components/shared/AppLayoutClient';

export const metadata: Metadata = {
  title: 'Tutorzila - Find Home Tutors in Bangalore & Online Tutors Across India',
  description:
    'Find the best online and home tutors in Bangalore and across India. Tutorzila connects you with qualified tutors for Math, Science, English, and more. Post your tuition needs and find the perfect match today.',
  // register multiple icons (array) + apple touch icon
  icons: {
    icon: [
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
      // you can also keep your PNG logo if needed:
      { url: '/IconOnly_Transparent.png?v=1', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  // point to your manifest (keep whichever filename you actually have in public/)
  manifest: '/manifest.json',
  other: {
    'keywords': 'home tutor, online tutor, home tutors in Bangalore, math tutor, science tutor, english tutor, private tutor, tuition, Bangalore, all subjects',
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
