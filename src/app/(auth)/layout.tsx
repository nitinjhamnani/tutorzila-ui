
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="animate-in fade-in zoom-in-95 duration-500 ease-out">
        {children}
      </div>
    </div>
  );
}
