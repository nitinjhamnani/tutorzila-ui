
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';
import './globals.css';
import Providers from '@/components/providers';
import { GlobalLoader } from '@/components/shared/GlobalLoader';
import { AppLayoutClient } from '@/components/shared/AppLayoutClient';

export const metadata: Metadata = {
  title: 'Tutorzila - Find Your Perfect Tutor',
  description: 'Tutorzila is the leading platform connecting parents with qualified, passionate tutors for personalized learning. Post tuition requirements, browse tutor profiles, and start learning today.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayoutClient>{children}</AppLayoutClient>
          <GlobalLoader />
        </Providers>
      </body>
    </html>
  );
}
