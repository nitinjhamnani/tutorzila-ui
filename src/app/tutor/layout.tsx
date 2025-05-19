
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import type { User, TutorProfile } from "@/types";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
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
  DollarSign,
  PanelLeft,
} from "lucide-react";
import { TutorSidebar } from "@/components/tutor/TutorSidebar"; // Added import

// Define the structure for navigation items
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
}

interface LogoutNavItem {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  // State for sidebar collapse on desktop
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  // State for mobile navigation open/close
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (isMobile) {
      setIsMobileNavOpen(false); // Ensure mobile nav is closed initially on mobile
      setIsNavbarCollapsed(false); // Desktop collapse state doesn't apply to mobile sheet
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


  const tutorNavItems: NavItem[] = [
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: false },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase, disabled: false },
    { href: "/tutor/demo-sessions", label: "Demos", icon: CalendarDays, disabled: false },
    { href: "/tutor/classes", label: "Classes", icon: School, disabled: false },
    { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: true },
  ];

  const accountSettingsNavItems: NavItem[] = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];
  const logoutNavItem: LogoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

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
            {/* Combined Trigger for Mobile and Desktop */}
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
            {/* User Avatar and Name Removed from Header */}
          </div>
        </header>
      )}

      {/* This div contains the sidebar and the main page content. */}
      <div className={cn("flex flex-1")}> {/* Removed overflow-hidden and items-stretch temporarily for debugging height */}
        <TutorSidebar
          isMobile={isMobile}
          isMobileNavOpen={isMobileNavOpen}
          toggleMobileNav={toggleMobileNav}
          isNavbarCollapsed={isNavbarCollapsed}
          toggleNavbarCollapsed={toggleNavbarCollapsed} // Pass this for desktop collapse button inside sidebar
          user={user}
          tutorNavItems={tutorNavItems}
          accountSettingsNavItems={accountSettingsNavItems}
          logoutNavItem={logoutNavItem}
        />
        <main
          className={cn(
            "flex-1 flex flex-col overflow-y-auto bg-secondary",
            hasMounted ? "pt-[var(--header-height)]" : "pt-0" // This ensures content starts below header
          )}
        >
          <div className="flex-grow p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
