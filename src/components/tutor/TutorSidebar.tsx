// src/components/tutor/TutorSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import type { User } from "@/types"; // Assuming User type includes name and email
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  PanelLeft, // For desktop collapse trigger
  Menu as MenuIcon, // For mobile menu trigger
} from "lucide-react";

interface TutorSidebarProps {
  isMobile: boolean;
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  isNavbarCollapsed: boolean;
  toggleNavbarCollapsed: () => void;
  user: User | null;
  tutorNavItems: Array<{ href: string; label: string; icon: React.ElementType; disabled?: boolean }>;
  accountSettingsNavItems: Array<{ href: string; label: string; icon: React.ElementType; disabled?: boolean }>;
  logoutNavItem: { label: string; icon: React.ElementType; onClick: () => void };
}

export function TutorSidebar(props: TutorSidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "bg-card border-r border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out", // Common base styles
        props.isMobile
          ? cn( // Mobile specific positioning & sizing (off-canvas)
              "fixed inset-y-0 left-0 z-40 w-60 transform",
              `top-[var(--header-height,0px)] h-[calc(100vh_-_var(--header-height,0px))]`, // Positioned below header
              props.isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            )
          : cn( // Desktop specific positioning & sizing
              "relative md:flex md:flex-col h-auto", // Changed h-full to h-auto
              props.isNavbarCollapsed ? "w-20" : "w-60"
            ),
        props.isMobile ? "md:hidden" : "hidden md:flex" // Visibility control
      )}
      aria-label="Tutor Navigation"
    >
      {/* Navbar Header/Logo Section - only shown if navbar is NOT for mobile sheet OR if mobile sheet is open */}
      {(!props.isMobile || props.isMobileNavOpen) && (
        <div
          className={cn(
            "h-16 flex items-center border-b border-border shrink-0", // Fixed height for header
            props.isNavbarCollapsed && !props.isMobile ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          {!props.isNavbarCollapsed && !props.isMobile && (
            <Link href="/tutor/dashboard">
              <Logo className="h-8 w-auto" />
            </Link>
          )}
          {/* Desktop Collapse / Mobile Close Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={props.isMobile ? props.toggleMobileNav : props.toggleNavbarCollapsed}
            className={cn(
              "text-muted-foreground hover:text-primary",
              props.isMobile ? (props.isNavbarCollapsed ? "hidden" : "flex") : "flex" // Desktop trigger always visible
            )}
            aria-label={props.isMobile ? "Close navigation" : (props.isNavbarCollapsed ? "Expand navigation" : "Collapse navigation")}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-grow overflow-y-auto p-3 space-y-1">
        {props.tutorNavItems.map((item) => {
          const isActive = item.href ? pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== "/tutor/dashboard") : false;
          return (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.disabled && "opacity-50 cursor-not-allowed",
                props.isNavbarCollapsed && !props.isMobile && "justify-center"
              )}
              title={props.isNavbarCollapsed && !props.isMobile ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", !props.isNavbarCollapsed || props.isMobile ? "mr-3" : "mr-0")} />
              {(!props.isNavbarCollapsed || props.isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* User/Account Section */}
      {(!props.isMobile || props.isMobileNavOpen) && (
        <div className="mt-auto p-3 border-t border-border shrink-0">
          {props.user && (
            <div
              className={cn(
                "flex items-center gap-2 mb-3",
                props.isNavbarCollapsed && !props.isMobile && "justify-center"
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={props.user.avatar || `https://avatar.vercel.sh/${props.user.email}.png`} alt={props.user.name} />
                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                  {props.user.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {(!props.isNavbarCollapsed || props.isMobile) && (
                <div className="text-xs min-w-0">
                  <p className="font-semibold text-foreground truncate">{props.user.name}</p>
                  <p className="text-muted-foreground truncate">{props.user.email}</p>
                </div>
              )}
            </div>
          )}
          {props.accountSettingsNavItems.map((item) => {
            const isActive = item.href ? pathname === item.href : false;
            return (
              <Link
                key={item.label}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out mb-1",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  item.disabled && "opacity-50 cursor-not-allowed",
                  props.isNavbarCollapsed && !props.isMobile && "justify-center"
                )}
                title={props.isNavbarCollapsed && !props.isMobile ? item.label : undefined}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", !props.isNavbarCollapsed || props.isMobile ? "mr-3" : "mr-0")} />
                {(!props.isNavbarCollapsed || props.isMobile) && <span>{item.label}</span>}
              </Link>
            );
          })}
          <Button
            variant="ghost"
            onClick={props.logoutNavItem.onClick}
            className={cn(
              "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10",
              props.isNavbarCollapsed && !props.isMobile ? "justify-center" : "justify-start",
              "hover:text-destructive"
            )}
            title={props.isNavbarCollapsed && !props.isMobile ? props.logoutNavItem.label : undefined}
          >
            <props.logoutNavItem.icon className={cn("h-5 w-5 shrink-0", !props.isNavbarCollapsed || props.isMobile ? "mr-3" : "mr-0")} />
            {(!props.isNavbarCollapsed || props.isMobile) && <span>{props.logoutNavItem.label}</span>}
          </Button>
        </div>
      )}
    </nav>
  );
}
