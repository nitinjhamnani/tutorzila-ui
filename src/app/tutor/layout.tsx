// src/app/tutor/layout.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TutorSidebar } from "@/components/tutor/TutorSidebar";
import { VerificationBanner } from "@/components/shared/VerificationBanner";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  UserCircle,
  Settings as SettingsIcon, // Alias to avoid conflict if Settings is used elsewhere
  LogOut,
  Menu as MenuIcon,
  Bell,
  MessageSquareQuote,
  DollarSign,
  PanelLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/shared/Logo";

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  // State for navbar collapse (desktop)
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const toggleNavbarCollapsed = () => setIsNavbarCollapsed(prev => !prev);

  // State for mobile navbar open/close (off-canvas)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const toggleMobileNav = () => setIsMobileNavOpen(prev => !prev);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Adjust mobile nav state if screen size changes
  useEffect(() => {
    if (!isMobile && isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
  }, [isMobile, isMobileNavOpen]);


  const tutorNavItems = [
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase },
    { href: "/tutor/demo-sessions", label: "Demos", icon: CalendarDays },
    { href: "/tutor/classes", label: "Classes", icon: School },
    // { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: true },
  ];

  const accountSettingsNavItems = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];
  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

  const headerHeight = "4rem"; // Assuming h-16 for header

  useEffect(() => {
    if (hasMounted) {
      document.documentElement.style.setProperty('--header-height', headerHeight);
    }
    return () => {
      document.documentElement.style.setProperty('--header-height', '0px');
    };
  }, [hasMounted, headerHeight]);

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
     // This case should ideally be handled by the !isAuthenticated check earlier
    return <div className="flex h-screen items-center justify-center">User data not available. Redirecting...</div>;
  }

  // Padding to push content below the VerificationBanner and the integrated header
  const paddingTopForContentArea = "pt-[calc(var(--verification-banner-height,0px)_+_var(--header-height,0px))]";

  return (
    <div className="flex flex-col min-h-screen">
      <VerificationBanner />

      {/* Integrated Header - Sticky */}
      {hasMounted && (
        <header
          className={cn(
            "bg-card shadow-sm w-full p-4 flex items-center justify-between",
            "sticky top-[var(--verification-banner-height,0px)] z-20", // z-20 to be below mobile nav overlay (z-30/z-40)
            `h-[${headerHeight}]`
          )}
        >
          <div className="flex items-center gap-2">
            {isMobile && (
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMobileNav}
                    className="text-gray-600 hover:text-primary md:hidden"
                >
                    <MenuIcon className="h-6 w-6" />
                </Button>
            )}
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
          </div>
        </header>
      )}

      {/* Main content area for Sidebar and Page Content */}
      <div className={cn("flex flex-1 overflow-hidden", paddingTopForContentArea)}>
        <TutorSidebar
          isMobile={isMobile}
          isMobileNavOpen={isMobileNavOpen}
          toggleMobileNav={toggleMobileNav}
          isNavbarCollapsed={isNavbarCollapsed}
          toggleNavbarCollapsed={toggleNavbarCollapsed}
          user={user}
          tutorNavItems={tutorNavItems}
          accountSettingsNavItems={accountSettingsNavItems}
          logoutNavItem={logoutNavItem}
        />

        {/* Main page content */}
        <main className={cn(
            "flex-1 flex flex-col overflow-y-auto bg-secondary",
            isMobile ? "ml-0" : (isNavbarCollapsed ? "md:ml-20" : "md:ml-60"), // Adjust margin based on desktop sidebar state
            "transition-all duration-300 ease-in-out"
        )}>
            <div className="p-4 sm:p-6 md:p-8 h-full"> {/* Added h-full */}
                {children}
            </div>
        </main>
      </div>

      {/* Mobile Overlay for closing navbar */}
      {isMobile && isMobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleMobileNav}
        />
      )}
    </div>
  );
}
