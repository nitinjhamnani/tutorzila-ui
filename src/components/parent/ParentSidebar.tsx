
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { LogOut } from "lucide-react";

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

interface ParentSidebarProps {
  isMobile: boolean;
  isNavbarOpen: boolean; // For mobile off-canvas
  isNavbarCollapsed: boolean; // For desktop collapse
  toggleNav: () => void; // Generic toggle, behavior depends on context (mobile/desktop)
  user: User | null;
  navItems: NavItem[];
  accountNavItems: NavItem[];
  logoutNavItem: LogoutNavItem;
}

export function ParentSidebar({
  isMobile,
  isNavbarOpen,
  isNavbarCollapsed,
  toggleNav, // This will be called by the header's main toggle button
  user,
  navItems,
  accountNavItems,
  logoutNavItem,
}: ParentSidebarProps) {
  const pathname = usePathname();

  // Determine actual collapsed state for desktop
  const desktopActuallyCollapsed = !isMobile && isNavbarCollapsed;

  return (
    <nav
      className={cn(
        "bg-card border-r border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out",
        isMobile
          ? cn(
              "fixed inset-y-0 left-0 z-40 w-60 transform",
              `top-[var(--header-height,0px)] h-[calc(100vh_-_var(--header-height,0px))]`,
              isNavbarOpen ? "translate-x-0" : "-translate-x-full"
            )
          : cn( // Desktop
              "relative hidden md:flex md:flex-col h-full", // h-full to take parent's height
              isNavbarCollapsed ? "w-20" : "w-60"
            )
      )}
      aria-label="Parent Navigation"
    >
      {/* Navbar Header/Logo Section - Desktop specific collapse trigger removed from here */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-border shrink-0 px-4",
          desktopActuallyCollapsed && "justify-center"
        )}
      >
        {(!isMobile && !isNavbarCollapsed) && (
          <Link href="/parent/dashboard" className="flex-shrink-0">
            <Logo className="h-8 w-auto" />
          </Link>
        )}
         {/* The main toggle is now in the header within layout.tsx */}
      </div>

      {/* Navigation Links */}
      <div className="flex-grow overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href ? pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== "/parent/dashboard") : false;
          return (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              onClick={isMobile && isNavbarOpen ? toggleNav : undefined} // Close mobile nav on item click
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.disabled && "opacity-50 cursor-not-allowed",
                desktopActuallyCollapsed && "justify-center"
              )}
              title={desktopActuallyCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", desktopActuallyCollapsed ? "mr-0" : "mr-3")} />
              {(!isMobile && !isNavbarCollapsed || isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* User/Account Section */}
      <div className="mt-auto p-3 border-t border-border shrink-0">
        {accountNavItems.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          return (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              onClick={isMobile && isNavbarOpen ? toggleNav : undefined}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out mb-1",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.disabled && "opacity-50 cursor-not-allowed",
                desktopActuallyCollapsed && "justify-center"
              )}
              title={desktopActuallyCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", desktopActuallyCollapsed ? "mr-0" : "mr-3")} />
              {(!isMobile && !isNavbarCollapsed || isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
        <Button
          variant="ghost"
          onClick={() => {
            logoutNavItem.onClick();
            if (isMobile && isNavbarOpen) toggleNav();
          }}
          className={cn(
            "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10",
            desktopActuallyCollapsed ? "justify-center" : "justify-start",
            "hover:text-destructive"
          )}
          title={desktopActuallyCollapsed ? logoutNavItem.label : undefined}
        >
          <logoutNavItem.icon className={cn("h-5 w-5 shrink-0", desktopActuallyCollapsed ? "mr-0" : "mr-3")} />
          {(!isMobile && !isNavbarCollapsed || isMobile) && <span>{logoutNavItem.label}</span>}
        </Button>
      </div>
    </nav>
  );
}
