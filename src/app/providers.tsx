
"use client";

import type { ReactNode } from 'react';
import { Provider as JotaiProvider } from "jotai";

export function Providers({ children }: { children: ReactNode }) {
  return <JotaiProvider>{children}</JotaiProvider>;
}
