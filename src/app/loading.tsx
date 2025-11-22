"use client";

import { GlobalLoader } from "@/components/shared/GlobalLoader";

export default function Loading() {
  // This is a special Next.js file that automatically
  // wraps a page and shows this UI while the page is loading.
  // We'll always show the loader here.
  return <GlobalLoader forceShow={true} />;
}
