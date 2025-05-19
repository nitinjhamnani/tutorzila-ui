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
  PanelLeft,
  DollarSign,
  MessageSquareQuote,
} from "lucide-react";
import { TutorSidebar } from "@/components/tutor/TutorSidebar";


export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // For mobile nav
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false); // For desktop collapse

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      setIsNavbarCollapsed(window.innerWidth < 1024); // Example: collapse on smaller desktop
    }
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsNavbarOpen(false); // Close mobile nav if screen becomes desktop
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
    router.replace("/"); // Or parent/admin dashboard if applicable
    return <div className="flex h-screen items-center justify-center">Access Denied. Redirecting...</div>;
  }
  if (!user && hasMounted) { // Should be caught by !isAuthenticated, but as a fallback
    router.replace("/");
    return <div className="flex h-screen items-center justify-center">User data not available. Redirecting...</div>;
  }

  const paddingTopForContentArea = `pt-[var(--header-height,0px)]`;

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {/* Integrated Header */}
      {hasMounted && (
        <header
          className={cn(
            "bg-card shadow-sm w-full p-4 flex items-center justify-between",
            "sticky top-0 z-30",
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
      )}

      {/* Main Content Area: Sidebar + Page Content */}
      <div className={cn("flex flex-1", paddingTopForContentArea)}> {/* Removed overflow-hidden */}
        <TutorSidebar
          isMobile={isMobile}
          isMobileNavOpen={isMobileNavOpen}
          toggleMobileNav={toggleMobileNav}
          isNavbarCollapsed={isNavbarCollapsed}
          user={user}
          logout={logout}
        />
        <main className="flex-1 flex flex-col overflow-y-auto"> {/* Main content takes remaining space and scrolls */}
          <div className="p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
