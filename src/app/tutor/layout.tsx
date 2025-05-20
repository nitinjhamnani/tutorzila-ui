
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
  SheetTitle, // Keep if used by SidebarHeader from ui/sidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  DollarSign,
  UserCircle,
  Settings as SettingsIcon, // Alias for clarity
  LogOut,
  Menu as MenuIcon, // Alias for clarity
  Bell,
  PanelLeft,
  MessageSquareQuote,
  ListChecks,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/shared/Logo";
// VerificationBanner is removed

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  // ALL HOOKS CALLED AT THE TOP LEVEL
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
  }, [hasMounted, headerHeight]); // Added headerHeight to dependency array

  // Effect for redirection, depends on auth state and routing objects
  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || user?.role !== 'tutor') {
        router.replace("/");
      }
    }
  }, [hasMounted, isCheckingAuth, isAuthenticated, user, router]);


  const tutorNavItems = [
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: false },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase, disabled: false },
    { href: "/tutor/demo-sessions", label: "Demos", icon: MessageSquareQuote, disabled: false },
    { href: "/tutor/classes", label: "Classes", icon: School, disabled: false },
    { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: false },
    { href: "/tutor/leads", label: "Leads", icon: ListChecks, disabled: false }, // Changed icon from ShoppingBag to ListChecks
    { href: "/tutor/transactions", label: "Transactions", icon: ListChecks, disabled: true },
  ];

  const accountSettingsNavItems = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];
  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

  // Conditional returns AFTER all hooks
  if (!hasMounted || isCheckingAuth) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Area...</div>;
  }

  if (!isAuthenticated || user?.role !== 'tutor') {
    // This state will be brief as the useEffect above will redirect.
    // It's good practice to have a consistent return type or a clear loading/redirect indicator.
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }
   if (!user) { // Should ideally be caught by !isAuthenticated
    return <div className="flex h-screen items-center justify-center">User data not available. Redirecting...</div>;
  }

  // paddingTopForContentArea is now calculated directly where used or using CSS var
  // const paddingTopForContentArea = hasMounted ? "pt-[var(--header-height)]" : "pt-0";

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
               {/* Sidebar Trigger - visible on all screen sizes now to control either mobile sheet or desktop collapse */}
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
              {/* Logout Button moved to sidebar footer */}
            </div>
          </header>
        )}

        {/* This div contains the sidebar and the main page content. */}
        <div className={cn("flex flex-1 overflow-hidden", hasMounted ? "pt-[var(--header-height)]" : "pt-0")}>
          <TutorSidebar
            isMobile={isMobile}
            isMobileNavOpen={isMobileNavOpen}
            toggleMobileNav={toggleMobileNav}
            isNavbarCollapsed={isNavbarCollapsed}
            toggleNavbarCollapsed={toggleNavbarCollapsed} // Pass this down
            user={user}
            tutorNavItems={tutorNavItems}
            accountSettingsNavItems={accountSettingsNavItems}
            logoutNavItem={logoutNavItem}
          />
          <main className={cn("flex-1 flex flex-col overflow-y-auto bg-secondary")}>
            {/* Content padding handled by individual pages or a wrapper here if consistent padding is desired */}
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
