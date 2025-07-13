
"use client";

import { useAtom } from "jotai";
import { loaderAtom } from "@/lib/state/loader";
import { useCallback } from "react";

export function useGlobalLoader() {
  const [, setIsLoading] = useAtom(loaderAtom);

  const showLoader = useCallback(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return { showLoader, hideLoader };
}
