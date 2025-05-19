
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { useAuthMock } from "@/hooks/use-auth-mock";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  DollarSign,
  MessageSquareQuote,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  PanelLeft, // For collapse trigger
} from "lucide-react";
import React, { useState } from "react";

const tutorNavItems = [
  { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase },
  { href: "/tutor/demo-sessions", label: "Demos", icon: MessageSquareQuote },
  { href: "/tutor/classes", label: "Classes", icon: School },
  { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: true },
];

const accountSettingsNavItems = [
  { href: "/tutor/my-account", label: "My Account", icon: UserCircle },
  { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
];

export function TutorSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthMock();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <nav
      className={cn(
        "bg-card border-r border-border flex flex-col shadow-lg fixed md:relative inset-y-0 left-0 z-20 md:z-auto transition-all duration-300 ease-in-out h-screen md:h-auto",
        "top-[var(--header-height)] md:top-0", // Position below header on mobile, normal on desktop
        isCollapsed ? "w-20" : "w-60"
      )}
      style={{
        paddingTop: 'var(--header-height)', // Ensure content starts below main header
        height: 'calc(100vh - var(--header-height))' // Full height below main header
      }}
    >
      <div className={cn("p-4 border-b border-border flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <Link href="/tutor/dashboard">
            <Logo className="h-8 w-auto" />
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={toggleCollapse} className="text-muted-foreground hover:text-primary">
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-1">
        {tutorNavItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== "/tutor/dashboard");
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
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-4 border-t border-border">
        {user && (
          <div className={cn("flex items-center gap-2 mb-3", isCollapsed && "justify-center")}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                {user.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="text-xs min-w-0">
                <p className="font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
          </div>
        )}
        {accountSettingsNavItems.map((item) => {
           const isActive = pathname === item.href;
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
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
           );
        })}
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive-foreground",
            isCollapsed ? "justify-center" : "justify-start",
             "hover:text-destructive" // Ensure text color remains destructive on hover
          )}
           title={isCollapsed ? "Log Out" : undefined}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Log Out</span>}
        </Button>
      </div>
    </nav>
  );
}
