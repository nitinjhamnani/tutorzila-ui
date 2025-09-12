
"use client";

import { useState, useEffect } from 'react';

const PHONEPE_SCRIPT_URL = "https://mercury-uat.phonepe.com/web/bundle/checkout.js";

interface UsePhonePeReturn {
  scriptLoaded: boolean;
  isScriptLoading: boolean;
  loadError: Error | null;
}

export function usePhonePe(): UsePhonePeReturn {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isScriptLoading, setIsScriptLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if the script is already on the page
    if (document.querySelector(`script[src="${PHONEPE_SCRIPT_URL}"]`)) {
      setScriptLoaded(true);
      setIsScriptLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = PHONEPE_SCRIPT_URL;
    script.async = true;

    const handleLoad = () => {
      setScriptLoaded(true);
      setIsScriptLoading(false);
    };

    const handleError = () => {
      setLoadError(new Error(`Failed to load PhonePe script from ${PHONEPE_SCRIPT_URL}`));
      setIsScriptLoading(false);
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      // It's often better to leave the script in the DOM after it's loaded
      // to avoid re-loading if the hook is used in multiple places.
    };
  }, []);

  return { scriptLoaded, isScriptLoading, loadError };
}
