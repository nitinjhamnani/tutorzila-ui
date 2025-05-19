
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TutorSidebar } from "@/components/tutor/TutorSidebar";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  DollarSign,
  MessageSquareQuote,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  Menu as MenuIcon,
  Bell,
  PanelLeft,
} from "lucide-react";

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (isMobile) {
      setIsMobileNavOpen(false);
      setIsNavbarCollapsed(false);
    } else {
      setIsNavbarCollapsed(false);
    }
  }, [isMobile]);

  const toggleNavbarCollapsed = () => {
    if (!isMobile) {
      setIsNavbarCollapsed(prev => !prev);
    }
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen(prev => !prev);
  };

  const tutorNavItems = [
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase },
    { href: "/tutor/demo-sessions", label: "Demos", icon: MessageSquareQuote },
    { href: "/tutor/classes", label: "Classes", icon: School },
    { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: true },
  ];

  const accountSettingsNavItems = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle },
    { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];

  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

  const headerHeight = "4rem"; // For h-16 or p-4 header

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
    return <div className="flex h-screen items-center justify-center">User data not available.</div>;
  }

  const paddingTopForContentArea = hasMounted ? "pt-[var(--header-height)]" : "pt-0";

  return (
    <div className="flex flex-col min-h-screen">
      {/* <VerificationBanner /> Removed as per user request */}

      {/* Integrated Header - Sticky */}
      {hasMounted && (
        <header
          className={cn(
            "sticky top-0 z-30 w-full bg-card p-4 shadow-sm flex items-center justify-between",
            `h-[${headerHeight}]`
          )}
        >
          <div className="flex items-center gap-2">
            {isMobile ? (
                 <Button variant="ghost" size="icon" onClick={toggleMobileNav} className="text-gray-600 hover:text-primary md:hidden">
                    <MenuIcon className="h-6 w-6" />
                 </Button>
            ) : (
                <Button variant="ghost" size="icon" onClick={toggleNavbarCollapsed} className="text-gray-600 hover:text-primary hidden md:flex">
                    <PanelLeft className="h-5 w-5" />
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
            {/* Logout Button integrated here from logoutNavItem */}
             <Button
                variant="outline"
                size="sm"
                onClick={logoutNavItem.onClick}
                className="text-xs h-8 border-destructive text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" /> Log Out
              </Button>
          </div>
        </header>
      )}

      {/* This div contains the sidebar and the main page content. It's pushed down by paddingTopForContentArea. */}
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
        {/* The <main> tag itself does NOT get paddingTopForContentArea */}
        <main className={cn("flex-1 flex flex-col overflow-y-auto bg-secondary")}>
          <div className="flex-1 p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
