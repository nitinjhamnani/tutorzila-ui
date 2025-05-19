
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Button } from "@/components/ui/button";
import { X, ShieldAlert } from "lucide-react"; 
import { cn } from "@/lib/utils";

const SESSION_STORAGE_KEY = "tutorzila-verification-banner-dismissed";

export function VerificationBanner() {
  const { user, isAuthenticated } = useAuthMock();
  const [isDismissed, setIsDismissed] = useState(true); 
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissedInSession = sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
    setIsDismissed(dismissedInSession);
  }, []);

  useEffect(() => {
    const isVerified = user?.isEmailVerified && user?.isPhoneVerified;
    const shouldShow = isAuthenticated && user && !isVerified && !isDismissed;
    setShowBanner(shouldShow);

    // This component no longer sets the CSS variable
    // if (shouldShow) {
    //   document.documentElement.style.setProperty('--verification-banner-height', '3.5rem'); 
    // } else {
    //   document.documentElement.style.setProperty('--verification-banner-height', '0px');
    // }
    // return () => {
    //   document.documentElement.style.setProperty('--verification-banner-height', '0px');
    // };
  }, [user, isAuthenticated, isDismissed]);

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    setIsDismissed(true);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  let verifyMessage = "Your account is not fully verified.";
  if (user && !user.isEmailVerified && !user.isPhoneVerified) {
    verifyMessage = "Please verify your email and phone number.";
  } else if (user && !user.isEmailVerified) {
    verifyMessage = "Please verify your email address.";
  } else if (user && !user.isPhoneVerified) {
    verifyMessage = "Please verify your phone number.";
  }

  return (
    <div
      className={cn(
        "bg-primary/10 border-b border-primary/20 text-primary", 
        "px-4 py-2 flex items-center justify-between text-sm shadow-md",
        "backdrop-blur-sm bg-opacity-90"
        // Removed fixed positioning and z-index; this component is now part of normal flow
      )}
      style={{ height: 'auto' }} // Or a specific height if needed, e.g., '3.5rem'
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-primary" />
        <p className="font-medium">{verifyMessage}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="text-xs border-primary text-primary hover:bg-primary/20 hover:text-primary h-8 px-3"
        >
          <Link href="/dashboard/my-account">Verify Now</Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="h-8 w-8 text-primary hover:bg-primary/20 hover:text-primary"
          aria-label="Dismiss verification banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
