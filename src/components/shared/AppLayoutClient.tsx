
"use client";

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';
import { Provider as JotaiProvider } from "jotai";
import { useAuthMock } from '@/hooks/use-auth-mock';
import { useGlobalLoader } from '@/hooks/use-global-loader';
import { useEffect } from 'react';

function LayoutVisibilityController({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const { showLoader, hideLoader } = useGlobalLoader();

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated && user) {
      const publicPaths = ['/', '/become-a-tutor', '/tutors-in-bangalore'];
      if (publicPaths.includes(pathname)) {
        showLoader("Redirecting to your dashboard...");
        let targetPath = "/";
        switch (user.role) {
          case 'admin':
            targetPath = '/admin/dashboard';
            break;
          case 'tutor':
            targetPath = '/tutor/dashboard';
            break;
          case 'parent':
            targetPath = '/parent/dashboard';
            break;
          default:
            hideLoader(); // Should not happen
            break;
        }
        if (targetPath !== "/") {
          router.replace(targetPath);
        }
      }
    } else if (!isCheckingAuth) {
      hideLoader();
    }
  }, [isCheckingAuth, isAuthenticated, user, router, showLoader, hideLoader, pathname]);

  const pathsWithDedicatedLayouts = [
    '/parent/',
    '/tutor/',
    '/auth/',
    '/admin/',
  ];

  const isDedicatedLayout = pathsWithDedicatedLayouts.some(path => pathname.startsWith(path));

  // If we are checking auth or redirecting, show nothing but the children (which will be a loader or blank screen)
  if (isCheckingAuth || (isAuthenticated && !isDedicatedLayout)) {
    return <main className="flex-grow">{children}</main>;
  }

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
