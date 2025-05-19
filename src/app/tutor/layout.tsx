
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VerificationBanner } from "@/components/shared/VerificationBanner"; // Assuming it might be re-added later or used elsewhere
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  // UserCircle, // No longer needed for accountSettingsNavItems in this simplified version
  // Settings as SettingsIcon, // No longer needed for accountSettingsNavItems
  LogOut, // Still needed for logoutNavItem if logout is from somewhere else, but header button is removed
  Menu as MenuIcon,
  Bell,
  Settings as SettingsIcon, // For header icon
  // MessageSquareQuote,
  // DollarSign,
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
    if (!isMobile) {
      setIsMobileNavOpen(false); // Close mobile nav if switching to desktop
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
    // { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: true },
  ];

  // const accountSettingsNavItems = [
  //   { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
  //   { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  // ];
  // const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };


  const headerHeight = "4rem"; 

  useEffect(() => {
    if (hasMounted) {
      document.documentElement.style.setProperty('--header-height', headerHeight);
    } else {
      document.documentElement.style.setProperty('--header-height', '0px');
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
    return <div className="flex h-screen items-center justify-center">User data not available.</div>;
  }

  const paddingTopForContentArea = hasMounted ? `pt-[var(--header-height)]` : "pt-0";

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
            {(isMobile || !isNavbarCollapsed) && ( // Show logo if mobile OR desktop expanded
               <Link href="/tutor/dashboard" onClick={isMobile ? toggleMobileNav : undefined}>
                <Logo className="h-8 w-auto" />
              </Link>
            )}
             {/* Desktop Collapse/Expand Trigger. Mobile trigger is now part of TutorSidebar */}
            {!isMobile && (
                <Button variant="ghost" size="icon" onClick={toggleNavbarCollapsed} className="text-gray-600 hover:text-primary">
                    <PanelLeft className="h-5 w-5" />
                </Button>
            )}
             {/* Mobile Nav Open Trigger (Only shown if sidebar is the primary mobile nav) */}
             {isMobile && (
                <Button variant="ghost" size="icon" onClick={toggleMobileNav} className="text-gray-600 hover:text-primary">
                    <MenuIcon className="h-6 w-6" />
                </Button>
             )}
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative h-8 w-8">
              <Bell className="w-4 h-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
              <SettingsIcon className="w-4 h-4" />
              <span className="sr-only">Settings</span>
            </Button>
            {/* Avatar and Name were removed from here as per your request */}
          </div>
        </header>
      )}

      <div className={cn("flex flex-1 overflow-hidden", hasMounted ? paddingTopForContentArea : "pt-0")}>
        <TutorSidebar
          isMobile={isMobile}
          isMobileNavOpen={isMobileNavOpen}
          toggleMobileNav={toggleMobileNav}
          isNavbarCollapsed={isNavbarCollapsed}
          toggleNavbarCollapsed={toggleNavbarCollapsed} // Pass this for desktop collapse button inside sidebar
          user={user}
          tutorNavItems={tutorNavItems}
          // accountSettingsNavItems={accountSettingsNavItems} // Removed as logout is now elsewhere potentially
          // logoutNavItem={logoutNavItem} // Removed as logout is now elsewhere potentially
        />
        <main className={cn(
          "flex-1 flex flex-col overflow-hidden bg-secondary transition-all duration-300 ease-in-out",
           // No conditional margin here, rely on sidebar's width change and flex-1
        )}>
          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
