// src/app/tutor/layout.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/shared/Logo";
import { TutorSidebar } from "@/components/tutor/TutorSidebar";
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
  MessageSquareQuote,
  DollarSign,
  PanelLeft
} from "lucide-react";

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  // State for desktop navbar collapse
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const toggleNavbarCollapsed = () => setIsNavbarCollapsed(prev => !prev);

  // State for mobile navbar open/close (off-canvas)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const toggleMobileNav = () => setIsMobileNavOpen(prev => !prev);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // If screen size changes to desktop, close mobile nav
    if (!isMobile && isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
    // If screen size changes to mobile, and desktop was collapsed, we might want to ensure mobile is closed initially
    // or respect the previous desktop 'open' state as 'expanded'
    if (isMobile) {
      setIsNavbarCollapsed(false); // Desktop collapse state is not relevant on mobile
    }
  }, [isMobile, isMobileNavOpen]);


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
     router.replace("/");
    return <div className="flex h-screen items-center justify-center">User data not available. Redirecting...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {/* No VerificationBanner here */}
      <header
        className={cn(
          "bg-card shadow-sm w-full p-4 flex items-center justify-between",
          "sticky top-0 z-30", // No var(--verification-banner-height,0px) needed
          `h-[${headerHeight}]`
        )}
      >
        <div className="flex items-center gap-2">
          {isMobile && hasMounted ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileNav}
              className="text-gray-600 hover:text-primary md:hidden"
              aria-label="Open navigation menu"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          ) : hasMounted && !isMobile ? (
             <Button
              variant="ghost"
              size="icon"
              onClick={toggleNavbarCollapsed}
              className="text-gray-600 hover:text-primary hidden md:flex"
              aria-label={isNavbarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          ): null}
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
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-xs h-8 flex items-center"
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" /> Log Out
          </Button>
        </div>
      </header>

      <div className={cn("flex flex-1 overflow-hidden")}> {/* Removed items-stretch and h-full */}
        <TutorSidebar
          isMobile={isMobile}
          isMobileNavOpen={isMobileNavOpen}
          toggleMobileNav={toggleMobileNav}
          isNavbarCollapsed={isNavbarCollapsed} // For desktop collapse
          navItems={tutorNavItems}
          accountNavItems={accountSettingsNavItems}
          logoutNavItem={logoutNavItem}
          user={user}
        />
        <main className={cn("flex-1 flex flex-col overflow-y-auto bg-secondary")}>
          {/* The page content children will have their own padding as needed */}
          {children}
        </main>
      </div>
    </div>
  );
}
