"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardRedirectPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock(); // Added isCheckingAuth
  const router = useRouter();

  useEffect(() => {
    if (isCheckingAuth) {
      return; // Wait until authentication check is complete
    }

    if (!isAuthenticated) {
      router.replace("/"); // Redirect to homepage or login page if not authenticated
      return;
    }

    if (user) {
      if (user.role === "parent") {
        router.replace("/dashboard/parent");
      } else if (user.role === "tutor") {
        router.replace("/dashboard/tutor");
      } else if (user.role === "admin") {
        router.replace("/dashboard/admin");
      } else {
        // Fallback if role is unknown or not handled, redirect to homepage
        router.replace("/");
      }
    }
  }, [user, isAuthenticated, isCheckingAuth, router]);

  // Display a loading state while redirecting or checking auth
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height)-var(--footer-height,0px))] p-4">
      <Skeleton className="h-12 w-1/2 mb-4 rounded-md" />
      <Skeleton className="h-8 w-3/4 mb-6 rounded-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
       <p className="mt-8 text-lg font-medium text-muted-foreground animate-pulse">
        Loading dashboard...
      </p>
    </div>
  );
}
