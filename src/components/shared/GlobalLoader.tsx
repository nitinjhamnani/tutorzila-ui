
"use client";

import { useAtom } from "jotai";
import { loaderAtom } from "@/lib/state/loader";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function GlobalLoader() {
  const [isLoading] = useAtom(loaderAtom);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary-foreground" />
        <p className="text-sm font-medium text-primary-foreground">Processing...</p>
      </div>
    </div>
  );
}
