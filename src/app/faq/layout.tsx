
import type { ReactNode } from 'react';
import InfoPageLayout from '@/app/(info)/layout';

export default function FAQPageLayout({ children }: { children: ReactNode }) {
  return <InfoPageLayout>{children}</InfoPageLayout>;
}
