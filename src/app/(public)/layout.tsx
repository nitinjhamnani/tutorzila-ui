
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter'; 

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* AppHeader is rendered inside the main content flow of RootLayout, so it will be below VerificationBanner */}
      <AppHeader />
      {/* The children here are the page content, which is already inside RootLayout's main tag that has dynamic padding */}
      {children}
      <AppFooter /> 
      {/* No style tag needed here as --verification-banner-height is global */}
    </>
  );
}
