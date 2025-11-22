
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
  const { showLoader, hideLoader, loaderState } = useGlobalLoader();

  useEffect(() => {
    // This effect handles redirection logic
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
            hideLoader();
            break;
        }
        if (targetPath !== "/") {
          router.replace(targetPath);
        }
      }
    } else if (!isCheckingAuth) {
        // If we are done checking and the user is not authenticated on a protected page, or if a page just needs the loader to hide on mount.
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

  // If the loader is active, we want to show the current page content underneath it, not a blank screen.
  if (loaderState.isLoading) {
    return <main className="flex-grow">{children}</main>;
  }
  
  if (isCheckingAuth) {
    return null; // Render nothing while we wait for auth state to be confirmed client-side
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
    </JotaiProvider>
  );
}
