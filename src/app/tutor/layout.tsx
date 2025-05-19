
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// Removed Sidebar-related imports
import { VerificationBanner } from "@/components/shared/VerificationBanner"; // Kept for now, will be removed in next step if confirmed
import {
  Settings as SettingsIcon,
  LogOut,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/shared/Logo";

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile(); // Still might be useful for header responsiveness
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

  const headerHeight = "4rem"; // For h-16 or p-4 header

  useEffect(() => {
    if (hasMounted) {
      document.documentElement.style.setProperty('--header-height', headerHeight);
      // VerificationBanner is removed, so its height is not considered here
      document.documentElement.style.setProperty('--verification-banner-height', '0px');

    } else {
      document.documentElement.style.setProperty('--header-height', '0px');
      document.documentElement.style.setProperty('--verification-banner-height', '0px');
    }
    return () => {
      document.documentElement.style.setProperty('--header-height', '0px');
      document.documentElement.style.setProperty('--verification-banner-height', '0px');
    };
  }, [hasMounted]);

  if (isCheckingAuth && !hasMounted) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Area...</div>;
  }

  if (hasMounted && !isAuthenticated) {
    router.replace("/"); // Redirect to home if not authenticated
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }

  if (hasMounted && isAuthenticated && user?.role !== 'tutor') {
    router.replace("/"); // Redirect to home if role is not tutor
    return <div className="flex h-screen items-center justify-center">Access Denied. Redirecting...</div>;
  }

   if (!user && hasMounted) {
    // This case should ideally be covered by !isAuthenticated, but as a fallback:
    return <div className="flex h-screen items-center justify-center">User data not available.</div>;
  }

  const paddingTopForContentArea = "pt-[var(--header-height,0px)]"; // Only accounts for header now

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {/* <VerificationBanner /> Removed as per user instruction */}

      {/* Integrated Header - Sticky */}
      {hasMounted && (
        <header
          className={cn(
            "bg-card shadow-sm w-full p-4 flex items-center justify-between",
            "sticky top-0 z-30", // Sticks to top-0 directly
            `h-[${headerHeight}]`
          )}
        >
          <div className="flex items-center gap-2">
            {/* Mobile Sidebar Trigger REMOVED as sidebar is removed */}
            <Link href="/tutor/dashboard">
              <Logo className="h-10 w-auto" /> {/* Consistent logo size */}
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
              onClick={logoutNavItem.onClick}
              className="text-xs h-8"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Log Out
            </Button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={cn("flex-1 overflow-y-auto", paddingTopForContentArea)}>
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
