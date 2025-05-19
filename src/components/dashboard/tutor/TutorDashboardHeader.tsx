
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings as SettingsIcon, Menu as MenuIcon, LogOut } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import type { User, TutorProfile } from "@/types";

export function TutorDashboardHeader() {
  const { user, logout } = useAuthMock();
  const isMobile = useIsMobile();

  return (
    <header className="bg-card p-4 shadow-sm w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        <div className="flex items-center gap-2">
          <SidebarTrigger>
            <MenuIcon className="h-6 w-6 text-gray-600 hover:text-primary" />
          </SidebarTrigger>
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
          {/* User Avatar and Name Removed */}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-xs h-8 border-destructive text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" /> Log Out
          </Button>
        </div>
      </div>
    </header>
  );
}
