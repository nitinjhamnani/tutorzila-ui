
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
    // This effect handles redirection logic for authenticated users on public pages
    if (!isCheckingAuth && isAuthenticated && user) {
      const publicPaths = ['/', '/become-a-tutor', '/tutors-in-bangalore', '/terms-and-conditions', '/privacy-policy', '/faq', '/contact-us'];
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
            // If role is unknown, hide loader and stay on the page
            hideLoader();
            break;
        }
        if (targetPath !== "/") {
          router.replace(targetPath);
        }
      }
    } else if (!isCheckingAuth) {
        // If auth check is complete and user is not being redirected, ensure loader is hidden.
        // This is crucial for pages that don't trigger redirects but might have shown a loader initially.
        hideLoader();
    }
  }, [isCheckingAuth, isAuthenticated, user, router, showLoader, hideLoader, pathname]);

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
    return null; // Render nothing on the server and during initial client-side auth check
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
