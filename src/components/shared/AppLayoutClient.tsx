
"use client";

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';
import { Provider as JotaiProvider, useAtomValue } from "jotai";
import { layoutVisibilityAtom } from '@/lib/state/layout';

function LayoutVisibilityController({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLayoutVisible = useAtomValue(layoutVisibilityAtom);

  const pathsWithDedicatedLayouts = [
    '/parent/',
    '/tutor/',
    '/auth/',
    '/admin/',
  ];

  const isDedicatedLayout = pathsWithDedicatedLayouts.some(path => pathname.startsWith(path));
  
  // Conditionally render header/footer based on both route and visibility state
  const showPublicNavigation = !isDedicatedLayout && isLayoutVisible;

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
