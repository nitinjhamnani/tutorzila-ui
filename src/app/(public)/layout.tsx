
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter'; // Added

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter /> {/* Added */}
    </>
  );
}
