// src/app/tutor/layout.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  // Sidebar, // TutorSidebar is custom
  // SidebarHeader as ShadcnSidebarHeader, // Renamed to avoid conflict
  // SidebarContent, // TutorSidebar has its own content structure
  // SidebarFooter, // TutorSidebar has its own footer structure
  // SidebarMenu, // TutorSidebar has its own menu structure
  // SidebarMenuItem, // TutorSidebar has its own menu item structure
  // SidebarMenuButton, // TutorSidebar has its own menu button structure
  SidebarInset,
  // SidebarTrigger, // This is used in the header
} from "@/components/ui/sidebar"; // Keep SidebarProvider & SidebarInset
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/shared/Logo";
import { TutorSidebar } from "@/components/tutor/TutorSidebar"; // Import the custom sidebar
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  DollarSign,
  MessageSquareQuote,
  ListChecks, // For Transactions
  UserCircle,
  Settings as SettingsIcon, // Alias for clarity
  LogOut,
  Menu as MenuIcon, // Alias for clarity
  Bell,
  PanelLeft, // For desktop sidebar toggle
} from "lucide-react";

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  // State for custom TutorSidebar
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      setIsNavbarCollapsed(!isMobile); // Default collapsed on mobile if not an overlay
      setIsMobileNavOpen(false); // Ensure mobile nav is closed on resize to desktop
    }
  }, [isMobile, hasMounted]);

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

  const headerHeight = "4rem"; // Corresponds to h-16 or p-4 header
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
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase },
    { href: "/tutor/demo-sessions", label: "Demos", icon: MessageSquareQuote },
    { href: "/tutor/classes", label: "Classes", icon: School },
    { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: false },
    { href: "/tutor/transactions", label: "Transactions", icon: ListChecks, disabled: false },
  ];

  const accountSettingsNavItems = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];
  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

  // Conditional rendering for loading/auth states
  if (isCheckingAuth && !hasMounted) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Area...</div>;
  }

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || user?.role !== 'tutor') {
        router.replace("/");
      }
    }
  }, [hasMounted, isCheckingAuth, isAuthenticated, user, router]);

  if (hasMounted && (!isAuthenticated || user?.role !== 'tutor')) {
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }
  
  if (!user) { // Handles case where user is null after auth check (should be caught by above)
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">User not found. Redirecting...</div>;
  }

  const paddingTopForContentArea = hasMounted ? "pt-[var(--header-height)]" : "pt-0";

  return (
    <div className="flex flex-col min-h-screen">
      {/* <VerificationBanner /> Removed as per user request */}
      
      {/* Integrated Header - Sticky */}
      {hasMounted && (
        <header
          className={cn(
            "bg-card shadow-sm w-full p-4 flex items-center justify-between sticky top-0 z-30",
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
            {/* User Avatar and Name Removed as per request */}
          </div>
        </header>
      )}

      {/* Main Content Area for Sidebar and Page Content */}
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
        <main className={cn("flex-1 flex flex-col overflow-y-auto bg-secondary")}>
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full h-full p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
