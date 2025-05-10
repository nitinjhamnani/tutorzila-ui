
import type { ReactNode } from 'react';

export default function InfoPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-secondary min-h-[calc(100vh-4rem)]"> 
      <div className="animate-in fade-in duration-500 ease-out">
        {children}
      </div>
    </div>
  );
}
