
import type { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* AppHeader and AppFooter are now rendered by the root layout (src/app/layout.tsx) */}
      {children}
    </>
  );
}
