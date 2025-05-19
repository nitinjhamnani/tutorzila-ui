"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  UserCircle,
  Settings as SettingsIcon, // Aliased for clarity
  LogOut,
  Menu as MenuIcon, // Aliased for clarity
  Bell,
  DollarSign,
  MessageSquareQuote,
  PanelLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { TutorSidebar } from "@/components/tutor/TutorSidebar";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// This component remains unchanged as its props are passed from this layout
// import { TutorDashboardHeader } from "@/components/dashboard/tutor/TutorDashboardHeader";

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  // State for custom vertical navbar
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (isMobile) {
      setIsMobileNavOpen(false); // Default closed on mobile
      setIsNavbarCollapsed(false); // Not applicable in the same way
    } else {
      setIsNavbarCollapsed(false); // Default expanded on desktop
    }
  }, [isMobile]);

  const toggleNavbarCollapsed = () => {
    if (!isMobile) {
      setIsNavbarCollapsed(prev => !prev);
    }
  };

  const toggleMobileNav = () => {
    if (isMobile) {
      setIsMobileNavOpen(prev => !prev);
    }
  };

  const tutorNavItems = [
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: false },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase, disabled: false },
    { href: "/tutor/demo-sessions", label: "Demos", icon: CalendarDays, disabled: false },
    { href: "/tutor/classes", label: "Classes", icon: School, disabled: false },
    { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: true },
    // { href: "/tutor/messages", label: "Messages", icon: MessageSquareQuote, disabled: true },
  ];

  const accountSettingsNavItems = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];
  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

  const headerContentHeightClass = "h-16"; // Corresponds to p-4 on header, 4rem

  useEffect(() => {
    if (hasMounted) {
      document.documentElement.style.setProperty('--header-height', '4rem');
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

  // This variable is no longer used to apply padding to the main flex container
  // const paddingTopForContentArea = hasMounted ? "pt-[var(--header-height)]" : "pt-0";

  return (
    <div className="flex flex-col min-h-screen">
      {/* <VerificationBanner /> Removed as per user request */}

      {/* Integrated Header - Sticky */}
      {hasMounted && (
        <header className={cn(
          "sticky top-0 z-30 w-full bg-card shadow-sm flex items-center justify-between",
          headerContentHeightClass // Ensures header has a consistent height for CSS var
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center justify-between">
            <div className="flex items-center">
              {/* Unified Trigger for both mobile (off-canvas) and desktop (collapse) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={isMobile ? toggleMobileNav : toggleNavbarCollapsed}
                className="text-gray-600 hover:text-primary mr-2"
                aria-label={isMobile ? (isMobileNavOpen ? "Close sidebar" : "Open sidebar") : (isNavbarCollapsed ? "Expand sidebar" : "Collapse sidebar")}
              >
                {isMobile ? <MenuIcon className="h-6 w-6" /> : <PanelLeft className="h-5 w-5" />}
              </Button>
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
          </div>
        </header>
      )}

      {/* This div contains the sidebar and the main page content. */}
      {/* It will NOT have top padding to account for the header; pages/sidebar will handle their content offset. */}
      <div className={cn("flex flex-1 overflow-hidden")}>
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
        <main className={cn(
          "flex-1 flex flex-col overflow-y-auto bg-secondary"
          // NO DYNAMIC TOP PADDING HERE
        )}>
          {/* Pages rendered as children are responsible for their own top padding if they need to clear the sticky header */}
          <div className="w-full"> {/* Simplified to allow full width for children by default */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
