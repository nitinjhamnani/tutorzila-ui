// src/app/tutor/layout.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// Sidebar related imports are removed
import { Button } from "@/components/ui/button";
import { VerificationBanner } from "@/components/shared/VerificationBanner";
import {
  Bell,
  Settings as SettingsIcon,
  // Icons for sidebar menu items are no longer needed here unless used in header
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile"; // Kept if header has mobile-specific behavior
import { Logo } from "@/components/shared/Logo";
// Removed SidebarTrigger and other sidebar components from here

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile(); // Still potentially useful for other responsive elements
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Navigation item arrays are removed as sidebar is removed

  const headerHeight = "4rem"; // For h-16 or p-4 header, if integrated header remains

  useEffect(() => {
    if (hasMounted) {
      document.documentElement.style.setProperty('--header-height', headerHeight);
    } else {
      document.documentElement.style.setProperty('--header-height', '0px');
    }
    return () => {
      document.documentElement.style.setProperty('--header-height', '0px');
    };
  }, [hasMounted]);

  if (isCheckingAuth && !hasMounted) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Area...</div>;
  }

  if (hasMounted && !isAuthenticated) {
    router.replace("/");
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }
  if (hasMounted && isAuthenticated && user?.role !== 'tutor') {
    router.replace("/");
    return <div className="flex h-screen items-center justify-center">Access Denied. Redirecting...</div>;
  }
   if (!user && hasMounted) {
    // This state should ideally not be reached if auth checks are robust.
    // Redirecting to home as a fallback.
    router.replace("/");
    return <div className="flex h-screen items-center justify-center">User data not available. Redirecting...</div>;
  }

  const paddingTopForContentArea = "pt-[calc(var(--verification-banner-height,0px)_+_var(--header-height,0px))]";

  return (
    <div className="flex flex-col min-h-screen">
      <VerificationBanner />

      {/* Integrated Header - Sticky */}
      {hasMounted && (
        <header
          className={cn(
            "bg-card shadow-sm w-full p-4 flex items-center justify-between",
            "sticky top-[var(--verification-banner-height,0px)] z-30",
            `h-[${headerHeight}]` // Ensure header has a defined height for padding calculation
          )}
        >
          <div className="flex items-center gap-2">
            {/* SidebarTrigger removed */}
            <Link href="/tutor/dashboard">
              <Logo className="h-8 w-auto" /> {/* Adjusted height */}
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative h-8 w-8">
              <Bell className="w-4 h-4" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
              <SettingsIcon className="w-4 h-4" />
              <span className="sr-only">Settings</span>
            </Button>
            {user && (
              <div className="flex items-center gap-1.5">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                    {user.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-muted-foreground hidden md:inline">{user.name}</span>
              </div>
            )}
             <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-xs h-8"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" /> Log Out
              </Button>
          </div>
        </header>
      )}

      {/* Main Content Area - No SidebarProvider, Sidebar, or SidebarInset */}
      <main
        className={cn(
          "flex-1 bg-secondary overflow-y-auto",
          paddingTopForContentArea, // Pushes content below header and banner
          "pb-4 md:pb-6 px-4 md:px-6"
        )}
      >
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
