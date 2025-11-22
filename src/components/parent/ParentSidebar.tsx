
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { PanelLeft, Menu as MenuIcon, LogOut } from "lucide-react";
import { useGlobalLoader } from "@/hooks/use-global-loader";

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

interface ParentSidebarProps {
  isMobile: boolean;
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  isNavbarCollapsed: boolean;
  toggleNavbarCollapsed?: () => void;
  user: User | null;
  navItems: NavItem[];
  accountNavItems: NavItem[];
  logoutNavItem: LogoutNavItem;
}

export function ParentSidebar(props: ParentSidebarProps) {
  const pathname = usePathname();

  const handleNavLinkClick = (href: string) => {
    if (pathname === href) {
        return;
    }
    if (props.isMobile && props.isMobileNavOpen) {
      props.toggleMobileNav();
    }
  };

  const handleLogout = () => {
    props.logoutNavItem.onClick();
    if (props.isMobile && props.isMobileNavOpen) {
      props.toggleMobileNav();
    }
  };

  return (
    <nav
      className={cn(
        "bg-card border-r border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out", // Base common classes
 props.isMobile
 ? cn( // Mobile specific positioning & sizing
 "fixed z-40 w-60 transform",
 `top-[var(--header-height)] h-[calc(100vh_-_var(--header-height,0px))]`,
 props.isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
 )
 : cn( // Desktop specific positioning & sizing
 "relative md:flex md:flex-col", // Removed h-full
 props.isNavbarCollapsed ? "w-20" : "w-60"
 )
      )}
      aria-label="Parent Navigation"
    >
      {/* Navigation Links */}
      <div className="flex-grow overflow-y-auto p-3 space-y-1">
        {props.navItems.map((item) => {
          const isActive = item.href ? pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== "/parent/dashboard") : false;
          return (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              onClick={() => handleNavLinkClick(item.href)}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.disabled && "opacity-50 cursor-not-allowed",
                !props.isMobile && props.isNavbarCollapsed && "justify-center"
              )}
              title={!props.isMobile && props.isNavbarCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", (!props.isMobile && props.isNavbarCollapsed) ? "mr-0" : "mr-3", isActive && "text-primary-foreground")} />
              {(!props.isMobile && !props.isNavbarCollapsed || props.isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* User/Account Section */}
 <div className="mt-auto p-3 border-t border-border shrink-0">
        {props.accountNavItems.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          return (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              onClick={() => handleNavLinkClick(item.href)}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out mb-1",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.disabled && "opacity-50 cursor-not-allowed",
                !props.isMobile && props.isNavbarCollapsed && "justify-center"
              )}
              title={!props.isMobile && props.isNavbarCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", (!props.isMobile && props.isNavbarCollapsed) ? "mr-0" : "mr-3")} />
              {(!props.isMobile && !props.isNavbarCollapsed || props.isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10",
            !props.isMobile && props.isNavbarCollapsed ? "justify-center" : "justify-start",
            "hover:text-destructive"
          )}
          title={!props.isMobile && props.isNavbarCollapsed ? props.logoutNavItem.label : undefined}
        >
          <props.logoutNavItem.icon className={cn("h-5 w-5 shrink-0", (!props.isMobile && props.isNavbarCollapsed) ? "mr-0" : "mr-3")} />
          {(!props.isMobile && !props.isNavbarCollapsed || props.isMobile) && <span>{props.logoutNavItem.label}</span>}
        </Button>
      </div>
    </nav>
  );
}
