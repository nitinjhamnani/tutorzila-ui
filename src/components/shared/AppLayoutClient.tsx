
"use client";

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';
import { Provider as JotaiProvider } from "jotai";
import { useAuthMock } from '@/hooks/use-auth-mock';
import { GlobalLoader } from '@/components/shared/GlobalLoader';
import { useEffect } from 'react';

function LayoutVisibilityController({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();

  useEffect(() => {
    // This effect ensures the loader is hidden after initial auth checks are done.
  }, [isCheckingAuth, pathname]);

  const pathsWithDedicatedLayouts = [
    '/parent/',
    '/tutor/',
    '/admin/',
  ];

  // The login page is a special case that shouldn't show public nav
  if (pathname === '/admin/login') {
    return <main className="flex-grow">{children}</main>;
  }

  const isDedicatedLayout = pathsWithDedicatedLayouts.some(path => pathname.startsWith(path));
  
  if (isCheckingAuth) {
    return <GlobalLoader forceShow={true} />; // Always show loader during auth check
  }
  
  // Show the public layout (header/footer) only for non-dedicated layout paths
  const showPublicNavigation = !isDedicatedLayout;

  return (
    <>
      {showPublicNavigation && <AppHeader key={pathname} />}
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
