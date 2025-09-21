
"use client";

import { useAtom } from "jotai";
import { loaderAtom } from "@/lib/state/loader";
import { useCallback } from "react";

export function useGlobalLoader() {
  const [, setIsLoading] = useAtom(loaderAtom);

  const showLoader = useCallback((message?: string) => {
    setIsLoading({ isLoading: true, message });
  }, [setIsLoading]);

  const hideLoader = useCallback(() => {
    setIsLoading({ isLoading: false, message: undefined });
  }, [setIsLoading]);

  return { showLoader, hideLoader };
}
