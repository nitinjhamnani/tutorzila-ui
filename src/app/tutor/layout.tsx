
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import {
//   SidebarProvider,
//   Sidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarFooter,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarInset,
//   // SidebarTrigger, // This is now part of TutorSidebar
// } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
// import { VerificationBanner } from "@/components/shared/VerificationBanner"; // Removed
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  UserCircle,
  Settings as SettingsIcon, // Alias to avoid conflict if 'Settings' is used elsewhere
  LogOut,
  Menu as MenuIcon, // Alias to avoid conflict if 'Menu' is used elsewhere
  Bell,
  DollarSign,
  MessageSquareQuote,
  PanelLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/shared/Logo";
import { TutorSidebar } from "@/components/tutor/TutorSidebar"; // Make sure this path is correct

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
    if (!isMobile) {
      setIsMobileNavOpen(false); // Ensure mobile nav is closed on desktop
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
    { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: false }, // Enabled this link
  ];

  const accountSettingsNavItems = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
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
    // Return cleanup function if necessary, but for this simple case, it might not be.
    return () => {
      document.documentElement.style.setProperty('--header-height', '0px'); // Reset on unmount
    };
  }, [hasMounted]);


  if (isCheckingAuth || !hasMounted) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Area...</div>;
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') router.replace("/");
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }

  if (user?.role !== 'tutor') {
    if (typeof window !== 'undefined') router.replace("/");
    return <div className="flex h-screen items-center justify-center">Access Denied. Redirecting...</div>;
  }

   if (!user) { // Should be caught by !isAuthenticated, but as a fallback
    return <div className="flex h-screen items-center justify-center">User data not available.</div>;
  }

  // const paddingTopForContentArea = hasMounted ? "pt-[var(--header-height)]" : "pt-0";


  return (
    <div className="flex flex-col min-h-screen">
      {/* <VerificationBanner /> Removed as per user request */}
      {/* SidebarProvider now wraps the header and the main content flex container */}
        {/* Integrated Header - Sticky and within SidebarProvider */}
        {hasMounted && (
          <header
            className={cn(
              "bg-card shadow-sm w-full p-4 flex items-center justify-between",
              "sticky top-0 z-30", // Removed var(--verification-banner-height,0px)
              `h-[${headerHeight}]`
            )}
          >
            <div className="flex items-center gap-2">
              {/* Unified Trigger for both mobile (off-canvas) and desktop (collapse) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={isMobile ? toggleMobileNav : toggleNavbarCollapsed}
                className="text-gray-600 hover:text-primary"
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
              {/* Logout Button integrated here */}
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
          <main
            className={cn(
              "flex-1 flex flex-col overflow-y-auto bg-secondary", // Main content scroll
               hasMounted ? "pt-[var(--header-height)]" : "pt-0" // Offset by header height
            )}
          >
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full h-full"> {/* Ensure content can take full height */}
              {children}
            </div>
          </main>
        </div>
    </div>
  );
}

