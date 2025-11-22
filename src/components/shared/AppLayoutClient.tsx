
"use client";

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';
import { Provider as JotaiProvider } from "jotai";
import { useAuthMock } from '@/hooks/use-auth-mock';
import { GlobalLoader } from '@/components/shared/GlobalLoader';
import { useEffect } from 'react';
import { useAtom } from "jotai";
import { loaderAtom } from "@/lib/state/loader";

function LayoutVisibilityController({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  
  const pathsWithDedicatedLayouts = [
    '/parent/',
    '/tutor/',
    '/admin/',
  ];

  if (pathname === '/admin/login') {
    return <main className="flex-grow">{children}</main>;
  }

  const isDedicatedLayout = pathsWithDedicatedLayouts.some(path => pathname.startsWith(path));
  
  if (isCheckingAuth) {
    return <GlobalLoader forceShow={true} />; 
  }
  
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
      {/* GlobalLoader is now a sibling to ensure it can overlay everything */}
      <GlobalLoader />
    </JotaiProvider>
  );
}
