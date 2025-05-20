
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { LogOut, PanelLeft, Menu as MenuIcon } from "lucide-react";

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
  toggleNavbarCollapsed?: () => void; // For desktop collapse
  user: User | null;
  navItems: NavItem[];
  accountNavItems: NavItem[];
  logoutNavItem: LogoutNavItem;
}

export function ParentSidebar(props: ParentSidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "bg-card border-r border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out", // Base common classes
        props.isMobile
          ? cn( // Mobile specific positioning & sizing
              "fixed inset-y-0 left-0 z-40 w-60 transform",
              `top-[var(--header-height,0px)] h-[calc(100vh_-_var(--header-height,0px))]`, // Positioned below header
              props.isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            )
          : cn( // Desktop specific positioning & sizing
              "relative hidden md:flex md:flex-col h-full", // Ensure h-full for desktop
              props.isNavbarCollapsed ? "w-20" : "w-60"
            )
      )}
      aria-label="Parent Navigation"
    >
      {/* Navbar Header/Logo Section - Desktop specific collapse trigger removed from here */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-border shrink-0 px-3", // Reduced padding for collapsed view
          !props.isMobile && props.isNavbarCollapsed && "justify-center"
        )}
      >
        {!props.isMobile && !props.isNavbarCollapsed && (
          <Link href="/parent/dashboard" className="flex-shrink-0">
            <Logo className="h-8 w-auto" />
          </Link>
        )}
        {/* Desktop collapse trigger moved to header in layout */}
      </div>

      {/* Navigation Links */}
      <div className="flex-grow overflow-y-auto p-3 space-y-1">
        {props.navItems.map((item) => {
          const isActive = item.href ? pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== "/parent/dashboard") : false;
          return (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              onClick={props.isMobile && props.isMobileNavOpen ? props.toggleMobileNav : undefined}
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
              <item.icon className={cn("h-5 w-5 shrink-0", (!props.isMobile && props.isNavbarCollapsed) ? "mr-0" : "mr-3")} />
              {(!props.isMobile && !props.isNavbarCollapsed || props.isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* User/Account Section */}
      <div className="mt-auto p-3 border-t border-border shrink-0">
        {/* User Avatar and Name - Hidden when collapsed on desktop */}
        {!props.isMobile && !props.isNavbarCollapsed && props.user && (
          <div className="flex items-center gap-2 mb-3 px-2.5">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={props.user.avatar || `https://avatar.vercel.sh/${props.user.email}.png`} alt={props.user.name} />
              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                {props.user.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs min-w-0">
              <p className="font-semibold text-foreground truncate">{props.user.name}</p>
            </div>
          </div>
        )}

        {props.accountNavItems.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          return (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              onClick={props.isMobile && props.isMobileNavOpen ? props.toggleMobileNav : undefined}
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
          onClick={() => {
            props.logoutNavItem.onClick();
            if (props.isMobile && props.isMobileNavOpen) props.toggleMobileNav();
          }}
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
