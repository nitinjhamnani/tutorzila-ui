
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "../../components/shared/Logo";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  BarChart2,
  ShieldCheck,
  Settings as SettingsIcon,
  LogOut,
  Menu as MenuIcon,
  Bell,
  UsersRound,
} from "lucide-react";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tutors", label: "Tutors", icon: Users },
  { href: "/admin/parents", label: "Parents", icon: UsersRound },
  { href: "/admin/enquiries", label: "Enquiries", icon: Briefcase },
  { href: "/admin/approvals", label: "Approvals", icon: ShieldCheck, disabled: true },
  { href: "/admin/reports", label: "Reports", icon: BarChart2, disabled: true },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon, disabled: true },
];

const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: () => {} };


export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [hasMounted, setHasMounted] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(!isMobile);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      setIsNavbarOpen(!isMobile);
    }
  }, [isMobile]);

  const toggleNavbarCollapsed = () => {
    if (!isMobile) setIsNavbarCollapsed(prev => !prev);
  };

  const toggleMobileNav = () => {
    if (isMobile) setIsNavbarOpen(prev => !prev);
  };
  
  const handleLogout = () => {
    logout();
    router.push('/admin/login'); 
  };
  
  logoutNavItem.onClick = handleLogout;
  
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
    if (!isCheckingAuth && hasMounted && pathname !== '/admin/login' && (!isAuthenticated || user?.role !== 'admin')) {
      router.replace("/admin/login");
    }
  }, [isCheckingAuth, hasMounted, isAuthenticated, user, router, pathname]);

  // If we're on the login page, render children directly without the dashboard layout
  if (pathname === '/admin/login') {
    return <div className="flex min-h-screen items-center justify-center bg-secondary">{children}</div>;
  }
  
  // Logic for authenticated dashboard view
  if (isCheckingAuth || !hasMounted || !isAuthenticated || user?.role !== 'admin') {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Admin Area...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {hasMounted && (
        <header
          className={cn(
            "bg-card shadow-sm w-full p-3 flex items-center justify-between sticky top-0 z-30",
            `h-[${headerHeight}]`
          )}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={isMobile ? toggleMobileNav : toggleNavbarCollapsed}
              className="text-gray-600 hover:text-white hover:bg-primary/80"
              aria-label={isMobile ? (isNavbarOpen ? "Close sidebar" : "Open sidebar") : (isNavbarCollapsed ? "Expand sidebar" : "Collapse sidebar")}
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
            <Link href="/admin/dashboard">
              <Logo className="h-12 w-auto" />
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-primary/80 relative h-8 w-8">
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-white hover:bg-destructive/80 h-8 w-8"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>
      )}
      <div className={cn("flex flex-1 overflow-hidden")}> 
        <AdminSidebar
          isMobile={isMobile}
          isMobileNavOpen={isNavbarOpen}
          toggleMobileNav={toggleMobileNav}
          isNavbarCollapsed={isNavbarCollapsed}
          user={user}
          navItems={adminNavItems}
          logoutNavItem={logoutNavItem}
        />
        <main
          className={cn(
            "flex-1 flex flex-col overflow-y-auto bg-secondary p-4 sm:p-6 md:p-8"
          )}
        >
          <div className="w-full">
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
