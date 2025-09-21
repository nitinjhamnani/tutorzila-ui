
"use client";

import { useAtom } from "jotai";
import { loaderAtom } from "@/lib/state/loader";
import { cn } from "@/lib/utils";

export function GlobalLoader() {
  const [loaderState] = useAtom(loaderAtom);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300",
        loaderState.isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <svg
          className="creative-loader h-12 w-12 text-primary"
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="loader-path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          ></circle>
        </svg>
        {loaderState.message && (
          <p className="text-sm font-medium text-white">{loaderState.message}</p>
        )}
      </div>
    </div>
  );
}
