
"use client";

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';

export function AppLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const pathsWithDedicatedLayouts = [
    '/parent',
    '/tutor',
    '/auth',
    '/admin',
  ];

  const showPublicNavigation = !pathsWithDedicatedLayouts.some(path => pathname.startsWith(path));

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
