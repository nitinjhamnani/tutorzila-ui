
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  // SidebarTrigger, // No longer directly used in this layout file's JSX, but TutorSidebar uses it
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  Menu as MenuIcon,
  Bell,
  DollarSign, // Added DollarSign
  MessageSquareQuote, // Added for Demos
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/shared/Logo";
import { TutorSidebar } from "@/components/tutor/TutorSidebar";


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
      setIsMobileNavOpen(false); // Ensure mobile nav is closed by default
      setIsNavbarCollapsed(false); // Desktop collapse state shouldn't affect mobile overlay
    } else {
      setIsNavbarCollapsed(false); // Default to expanded on desktop
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
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: false },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase, disabled: false },
    { href: "/tutor/demo-sessions", label: "Demos", icon: MessageSquareQuote, disabled: false },
    { href: "/tutor/classes", label: "Classes", icon: School, disabled: false },
    { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: false },
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

  // const paddingTopForContentArea = hasMounted ? "pt-[var(--header-height)]" : "pt-0";

  return (
    <div className="flex flex-col min-h-screen">
      {/* <VerificationBanner /> Removed as per user request */}
      {/* Integrated Header - Sticky */}
      {hasMounted && (
        <header
          className={cn(
            "bg-card shadow-sm w-full p-4 flex items-center justify-between",
            "sticky top-0 z-30", // Removed var(--verification-banner-height,0px)
            `h-[${headerHeight}]`
          )}
        >
          <div className="flex items-center gap-2">
            {/* Trigger for both mobile sheet and desktop collapse */}
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
            {/* Avatar and Name removed based on previous request */}
          </div>
        </header>
      )}

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
        <main className={cn("flex-1 flex flex-col overflow-y-auto bg-secondary", hasMounted ? "pt-[var(--header-height)]" : "pt-0")}>
          {/* Content is pushed down by header's height */}
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
