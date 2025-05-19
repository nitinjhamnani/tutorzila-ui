
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// Removed SidebarProvider and related ShadCN Sidebar components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/shared/Logo";
import {
  Bell,
  Settings as SettingsIcon,
  LogOut,
  Menu as MenuIcon,
} from "lucide-react";
import { TutorSidebar } from "@/components/tutor/TutorSidebar"; // Import the new sidebar

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile(); // Kept for potential mobile-specific adjustments
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // This useEffect sets a CSS variable for the header height.
  // The header has p-4, making it roughly h-16 (4rem).
  useEffect(() => {
    if (hasMounted) {
      document.documentElement.style.setProperty('--header-height', '4rem');
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
    return <div className="flex h-screen items-center justify-center">User data not available.</div>;
  }

  // Padding to push content below the header.
  // VerificationBanner was removed, so only header height is considered.
  const paddingTopForMainContentArea = "pt-[var(--header-height,0px)]";

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {/* <VerificationBanner /> Removed */}

      {/* Integrated Header - Sticky */}
      {hasMounted && (
        <header
          className={cn(
            "bg-card shadow-sm w-full p-4 flex items-center justify-between",
            "sticky top-0 z-30", // Sticks to top-0 directly
            "h-16" // Explicit height for header
          )}
        >
          <div className="flex items-center gap-2">
            {/* Mobile Sidebar Trigger can be part of TutorSidebar or managed globally if needed */}
            {/* For now, assuming TutorSidebar handles its own mobile toggling if needed */}
            <Link href="/tutor/dashboard">
              <Logo className="h-8 w-auto" />
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
             {/* Logout button moved to TutorSidebar */}
          </div>
        </header>
      )}

      {/* Main content area with new TutorSidebar */}
      <div className={cn("flex flex-1 overflow-hidden", paddingTopForMainContentArea)}>
        {hasMounted && <TutorSidebar />} {/* Render the new sidebar */}
        <main
          className={cn(
            "flex-1 overflow-y-auto bg-secondary", // Ensures main content takes remaining space and scrolls
            "pb-4 md:pb-6 px-4 md:px-6" // Standard padding for the content area itself
            // No dynamic top padding here, parent div handles offset
          )}
        >
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
