
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings as SettingsIcon, Menu as MenuIcon } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import type { TutorProfile } from "@/types";

// Ensure the component is exported
export function TutorDashboardHeader() {
  const { user } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const isMobile = useIsMobile();

  return (
    <header className="bg-card p-4 shadow-sm w-full"> {/* Removed sticky, top, z-index here, managed by layout */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {isMobile && (
            <SidebarTrigger className="mr-2"> {/* SidebarTrigger handles its own button content by default */}
              <MenuIcon className="h-6 w-6" />
            </SidebarTrigger>
          )}
          {/* Logo placeholder for tutor-specific dashboard */}
          {/* <Link href="/tutor/dashboard" className="flex items-center">
            <Logo className="h-24 w-auto" />
          </Link> */}
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative h-8 w-8">
            <Bell className="w-4 h-4" />
            <span className="sr-only">Notifications</span>
            {/* Example notification dot */}
            <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
            </span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
            <SettingsIcon className="w-4 h-4" />
            <span className="sr-only">Settings</span>
          </Button>
          {tutorUser && (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-7 w-7">
                <AvatarImage src={tutorUser.avatar || `https://avatar.vercel.sh/${tutorUser.email}.png`} alt={tutorUser.name} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                  {tutorUser.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-muted-foreground hidden md:inline">{tutorUser.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
