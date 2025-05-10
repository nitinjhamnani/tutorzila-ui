
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-4 px-6 sm:px-8 md:px-10 lg:px-12 bg-secondary">
      <div className="animate-in fade-in zoom-in-95 duration-500 ease-out">
        {children}
      </div>
    </div>
  );
}

