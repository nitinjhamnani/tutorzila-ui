
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

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

interface AdminSidebarProps {
  isMobile: boolean;
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  isNavbarCollapsed: boolean;
  user: User | null;
  navItems: NavItem[];
  logoutNavItem: LogoutNavItem;
}

export function AdminSidebar({
  isMobile,
  isMobileNavOpen,
  toggleMobileNav,
  isNavbarCollapsed,
  user,
  navItems,
  logoutNavItem,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "bg-card border-r border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out",
        isMobile
          ? cn(
              "fixed left-0 z-40 w-60 transform",
              "top-[var(--header-height)] bottom-0", // Applied the requested fix
              isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            )
          : cn(
              "relative md:flex md:flex-col",
              isNavbarCollapsed ? "w-20" : "w-60"
            ),
        isMobile ? "md:block" : "hidden md:flex"
      )}
      aria-label="Admin Navigation"
    >
      <div className="flex-grow overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href ? pathname.startsWith(item.href) : false;
          return (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              onClick={isMobile ? toggleMobileNav : undefined}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.disabled && "opacity-50 cursor-not-allowed",
                !isMobile && isNavbarCollapsed && "justify-center"
              )}
              title={!isMobile && isNavbarCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", (!isMobile && isNavbarCollapsed) ? "mr-0" : "mr-3", isActive && "text-primary-foreground")} />
              {(!isMobile && !isNavbarCollapsed || isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-3 border-t border-border shrink-0">
        <Button
          variant="ghost"
          onClick={() => {
            logoutNavItem.onClick();
            if (isMobile && isMobileNavOpen) toggleMobileNav();
          }}
          className={cn(
            "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10",
            !isMobile && isNavbarCollapsed ? "justify-center" : "justify-start",
            "hover:text-destructive"
          )}
          title={!isMobile && isNavbarCollapsed ? logoutNavItem.label : undefined}
        >
          <logoutNavItem.icon className={cn("h-5 w-5 shrink-0", (!isMobile && isNavbarCollapsed) ? "mr-0" : "mr-3")} />
          {(!isMobile && !isNavbarCollapsed || isMobile) && <span>{logoutNavItem.label}</span>}
        </Button>
      </div>
    </nav>
  );
}
