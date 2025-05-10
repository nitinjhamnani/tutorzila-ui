import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}