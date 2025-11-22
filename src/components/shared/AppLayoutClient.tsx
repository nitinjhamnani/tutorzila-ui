
"use client";

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';
import { Provider as JotaiProvider } from "jotai";

function LayoutVisibilityController({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const pathsWithDedicatedLayouts = [
    '/parent/',
    '/tutor/',
    '/auth/',
    '/admin/',
  ];

  const isDedicatedLayout = pathsWithDedicatedLayouts.some(path => pathname.startsWith(path));
  
  // The homepage now controls its own visibility during redirects, so we just check for dedicated layouts here.
  const showPublicNavigation = !isDedicatedLayout;

  return (
    <>
      {showPublicNavigation && <AppHeader />}
      <main className="flex-grow">
        {children}
      </main>
      {showPublicNavigation && <AppFooter />}
    </>
  );
}

export function AppLayoutClient({ children }: { children: ReactNode }) {
  return (
    <JotaiProvider>
      <LayoutVisibilityController>
        {children}
      </LayoutVisibilityController>
    </JotaiProvider>
  );
}

    