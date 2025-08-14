
"use client";
import type { ReactNode } from 'react';

export default function InfoPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="bg-secondary min-h-[calc(100vh_-_var(--header-height)_-_var(--footer-height,0px))]"> {/* Adjust min-height for footer */}
        <div className="animate-in fade-in duration-500 ease-out">
          {children}
        </div>
      </div>
    </>
  );
}
