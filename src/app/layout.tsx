
"use client";

import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';
import './globals.css'; // Make sure your global styles are imported
import { usePathname } from 'next/navigation';
import Providers from '@/components/providers';
import { GlobalLoader } from '@/components/shared/GlobalLoader';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Paths that have their own dedicated layout/header/footer structure
  // or where the main public header/footer are not desired.
  const pathsWithDedicatedLayouts = [
    '/parent',
    '/tutor',
    '/auth', // Auth pages like sign-in/sign-up have minimal layout
    '/faq', // Info pages have their own layout including AppHeader/AppFooter
    '/terms-and-conditions', // Info pages
    '/privacy-policy', // Info pages
  ];

  const showPublicNavigation = !pathsWithDedicatedLayouts.some(path => pathname.startsWith(path));

  return (
    <html>
      <body>
        <Providers>
          {showPublicNavigation && <AppHeader />}
          {children}
          {showPublicNavigation && <AppFooter />}
          <GlobalLoader />
        </Providers>
      </body>
    </html>
  );
}
