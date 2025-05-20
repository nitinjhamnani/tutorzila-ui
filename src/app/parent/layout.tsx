
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/shared/Logo";
import {
  LayoutDashboard,
  ListChecks,
  School,
  CalendarDays,
  DollarSign,
  MessageSquareQuote,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  Menu as MenuIcon,
  Bell,
  SearchCheck,
  MessageSquare
} from "lucide-react";

export default function ParentSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [hasMounted, setHasMounted] = useState(false);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false); // For desktop
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // For mobile

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || user?.role !== 'parent') {
        router.replace("/");
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, user, router]);
  
  const toggleNavbarCollapsed = () => setIsNavbarCollapsed(prev => !prev);
  const toggleMobileNav = () => setIsMobileNavOpen(prev => !prev);

  const parentNavItems = [
    { href: "/parent/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/parent/my-requirements", label: "My Enquiries", icon: ListChecks },
    { href: "/search-tuitions", label: "Find Tutors", icon: SearchCheck }, // Public page
    { href: "/parent/my-classes", label: "My Classes", icon: CalendarDays, disabled: false },
    { href: "/parent/messages", label: "Messages", icon: MessageSquare, disabled: true },
    { href: "/parent/demo-sessions", label: "Demo Sessions", icon: MessageSquareQuote, disabled: false },
    { href: "/parent/manage-students", label: "Student Profiles", icon: School, disabled: false },
    { href: "/parent/payments", label: "My Payments", icon: DollarSign, disabled: false },
  ];

  const accountSettingsNavItems = [
    { href: "/parent/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/parent/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];
  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

  const headerHeight = "4rem"; // Assuming h-16 or p-4 header

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

  if (isCheckingAuth || (hasMounted && !isAuthenticated) || (hasMounted && user?.role !== 'parent')) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Parent Area...</div>;
  }
  if (!user && hasMounted) {
    return <div className="flex h-screen items-center justify-center">User data not available.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {/* Integrated Header - Sticky */}
      {hasMounted && (
        <header
          className={cn(
            "bg-card shadow-sm w-full p-4 flex items-center justify-between",
            "sticky top-0 z-30", // No var(--verification-banner-height) as it's removed
            `h-[${headerHeight}]`
          )}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={isMobile ? toggleMobileNav : toggleNavbarCollapsed}
              className="text-gray-600 hover:text-primary"
              aria-label={isMobile ? (isMobileNavOpen ? "Close sidebar" : "Open sidebar") : (isNavbarCollapsed ? "Expand sidebar" : "Collapse sidebar")}
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
            <Link href="/parent/dashboard">
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
                {/* <span className="text-xs font-medium text-muted-foreground hidden md:inline">{user.name}</span> */}
              </div>
            )}
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

      {/* This div contains the sidebar and the main page content. */}
      <div className={cn("flex flex-1 overflow-hidden", hasMounted ? "pt-[var(--header-height)]" : "pt-0")}>
        <ParentSidebar
          isMobile={isMobile}
          isNavbarOpen={isMobileNavOpen}
          isNavbarCollapsed={isNavbarCollapsed}
          toggleNav={isMobile ? toggleMobileNav : toggleNavbarCollapsed}
          user={user}
          navItems={parentNavItems}
          accountNavItems={accountSettingsNavItems}
          logoutNavItem={logoutNavItem}
        />
        <main
          className={cn(
            "flex-1 flex flex-col overflow-y-auto bg-secondary transition-all duration-300 ease-in-out",
            !isMobile && (isNavbarCollapsed ? "md:ml-20" : "md:ml-60")
          )}
        >
          {/* Removed explicit top padding from main, it's handled by the parent div */}
          <div className="flex-1 p-4 sm:p-6 md:p-8"> {/* Standard padding for content within main */}
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
       {isMobile && isMobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={toggleMobileNav}
          aria-label="Close navigation menu"
        />
      )}
    </div>
  );
}
