
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
import { useIsMobile } from "../../hooks/use-mobile";
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
  LifeBuoy,
} from "lucide-react";

export default function ParentSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [hasMounted, setHasMounted] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(!isMobile); // For mobile off-canvas
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false); // For desktop collapse

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      setIsNavbarOpen(!isMobile); // Set initial state based on current viewport
    }
  }, [isMobile]);

  const toggleNavbarCollapsed = () => {
    if (!isMobile) {
      setIsNavbarCollapsed(prev => !prev);
    }
  };

  const toggleMobileNav = () => {
    if (isMobile) {
      setIsNavbarOpen(prev => !prev);
    }
  };
  
  const handleLogout = () => {
    logout();
  };  const parentNavItems = [
    { href: "/parent/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/parent/my-enquiries", label: "My Enquiries", icon: ListChecks },
    { href: "/parent/find-tutor", label: "Find Tutors", icon: SearchCheck }, 
    { href: "/parent/demo-sessions", label: "Demo Sessions", icon: MessageSquareQuote, disabled: false },
    { href: "/parent/payments", label: "My Payments", icon: DollarSign, disabled: false },
    { href: "/parent/support", label: "My Support", icon: LifeBuoy, disabled: false },
  ];

  const accountSettingsNavItems = [
    { href: "/parent/my-account", label: "My Account", icon: UserCircle, disabled: false },
  ];

  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: handleLogout };

  const headerHeight = "4rem"; 

  useEffect(() => {
    if (hasMounted) {
      document.documentElement.style.setProperty('--header-height', headerHeight);
    }
    return () => {
      document.documentElement.style.setProperty('--header-height', '0px');
    };
  }, [hasMounted]);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || user?.role !== 'parent') {
        router.replace("/");
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, user, router]);

  if (isCheckingAuth && !hasMounted) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Parent Area...</div>;
  }
  
  if (hasMounted && (!isAuthenticated || (user && user.role !== 'parent'))) {
    return null;
  }
   if (!user && hasMounted) { 
     return <div className="flex h-screen items-center justify-center">User data not available. Redirecting...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-secondary">
      {/* Integrated Header */}
      {hasMounted && (
        <header
          className={cn(
            "bg-card shadow-sm w-full p-4 flex items-center justify-between",
            "sticky top-0 z-40", 
            "h-[var(--header-height)]"
          )}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={isMobile ? toggleMobileNav : toggleNavbarCollapsed}
              className="text-gray-600 hover:text-white hover:bg-primary/80"
              aria-label={isMobile ? (isMobileNavOpen ? "Close sidebar" : "Open sidebar") : (isNavbarCollapsed ? "Expand sidebar" : "Collapse sidebar")}
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
            <Link href="/parent/dashboard">
              <Logo className="h-16 w-auto p-0" />
            </Link>
          </div>
        </header>
      )}

      <div className={cn("flex flex-1 overflow-hidden")}> 
        <ParentSidebar
          isMobile={isMobile}
          isMobileNavOpen={isNavbarOpen} // Use isNavbarOpen for mobile
          toggleMobileNav={toggleMobileNav}
          isNavbarCollapsed={isNavbarCollapsed} // Use isNavbarCollapsed for desktop
          toggleNavbarCollapsed={toggleNavbarCollapsed}
          user={user}
          navItems={parentNavItems}
          accountNavItems={accountSettingsNavItems}
          logoutNavItem={logoutNavItem}
        />
        <main
          className={cn(
            "flex-1 flex flex-col overflow-y-auto bg-secondary"
          )}
        >
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
            {children}
          </div>
        </main>
      </div>
       {isMobile && isNavbarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={toggleMobileNav}
          aria-label="Close navigation menu"
        />
      )}
    </div>
  );
}
