
"use client";

import { useAtom } from "jotai";
import { loaderAtom } from "@/lib/state/loader";
import { useCallback } from "react";

export function useGlobalLoader() {
  const [loaderState, setLoaderState] = useAtom(loaderAtom);

  const showLoader = useCallback((message?: string) => {
    setLoaderState({ isLoading: true, message });
  }, [setLoaderState]);

  const hideLoader = useCallback(() => {
    setLoaderState({ isLoading: false, message: undefined });
  }, [setLoaderState]);

  return { showLoader, hideLoader, loaderState };
}
