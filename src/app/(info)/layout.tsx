import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shared/AppHeader'; // Added

export default function InfoPageLayout({ children }: { children: ReactNode }) {
  return (
    <> {/* Added Fragment */}
      <AppHeader /> {/* Added Header */}
      <div className="bg-secondary min-h-[calc(100vh-4rem)]"> 
        <div className="animate-in fade-in duration-500 ease-out">
          {children}
        </div>
      </div>
    </>
  );
}