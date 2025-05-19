
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent, // Ensure this is the custom SidebarContent_custom if aliased
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SheetTitle, // This is DialogPrimitive.Title
} from "@/components/ui/sidebar"; // Assuming custom sidebar components are re-exported here
import { Button } from "@/components/ui/button";
// import { VerificationBanner } from "@/components/shared/VerificationBanner"; // Removed
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  UserCircle,
  Settings as SettingsIcon, // Alias for clarity
  LogOut,
  Menu as MenuIcon, // Alias for clarity
  Bell,
  MessageSquareQuote,
  DollarSign,
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
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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

  const tutorNavItems = [
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: false },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase, disabled: false },
    { href: "/tutor/demo-sessions", label: "Demos", icon: CalendarDays, disabled: false },
    { href: "/tutor/classes", label: "Classes", icon: School, disabled: false },
    // { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: true },
  ];

  const accountSettingsNavItems = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];
  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

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

  const paddingTopForContentArea = "pt-[var(--header-height,0px)]";

  return (
    <div className="flex flex-col min-h-screen">
      {/* <VerificationBanner /> Removed as per user request */}
      <SidebarProvider defaultOpen={!isMobile}>
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
              <SidebarTrigger onClick={isMobile ? toggleMobileNav : toggleNavbarCollapsed}>
                <MenuIcon className="h-6 w-6 text-gray-600 hover:text-primary" />
              </SidebarTrigger>
              <Link href="/tutor/dashboard">
                <Logo className="h-10 w-auto" /> {/* Corrected logo height */}
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
              {/* User Avatar and Name Removed */}
              <Button
                variant="outline"
                size="sm"
                onClick={logoutNavItem.onClick}
                className="text-xs h-8 border-destructive text-destructive hover:bg-destructive/10"
              >
                <logoutNavItem.icon className="mr-1.5 h-3.5 w-3.5" /> Log Out
              </Button>
            </div>
          </header>
        )}

        <div className={cn("flex flex-1 overflow-hidden", hasMounted ? paddingTopForContentArea : "pt-0")}>
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
            "flex-1 flex flex-col overflow-hidden bg-secondary",
            // No conditional margin needed here if sidebar is fixed/absolute for mobile
            // and part of flex flow for desktop
          )}>
            <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
                {children}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
