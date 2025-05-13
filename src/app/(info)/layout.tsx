
"use client";
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';

export default function InfoPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* AppHeader is rendered inside the main content flow of RootLayout, so it will be below VerificationBanner */}
      <AppHeader />
      <div className="bg-secondary min-h-[calc(100vh_-_var(--header-height)_-_var(--footer-height,0px)_-_var(--verification-banner-height,0px))]"> {/* Adjust min-height for footer and banner */}
        <div className="animate-in fade-in duration-500 ease-out">
          {children}
        </div>
      </div>
      <AppFooter />
      {/* No style tag needed here as --verification-banner-height is global */}
    </>
  );
}
