
"use client";

import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';
import './globals.css';
import { usePathname } from 'next/navigation';
import Providers from '@/components/providers';
import { GlobalLoader } from '@/components/shared/GlobalLoader';

// This is a client component because usePathname can only be used in client components.
// However, the children it renders can be server components.

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Paths that have their own dedicated layout/header/footer structure
  // or where the main public header/footer are not desired.
  const pathsWithDedicatedLayouts = [
    '/parent',
    '/tutor',
    '/auth', // Auth pages like sign-in/sign-up have minimal layout
  ];
  
  // Info pages now use the public layout.
  const isInfoPage = pathname.startsWith('/faq') || pathname.startsWith('/terms-and-conditions') || pathname.startsWith('/privacy-policy');
  
  const showPublicNavigation = !pathsWithDedicatedLayouts.some(path => pathname.startsWith(path));

  return (
    <html lang="en">
      <body>
        <Providers>
          {showPublicNavigation && <AppHeader />}
          <main className="flex-grow">
            {children}
          </main>
          {showPublicNavigation && <AppFooter />}
          <GlobalLoader />
        </Providers>
      </body>
    </html>
  );
}
