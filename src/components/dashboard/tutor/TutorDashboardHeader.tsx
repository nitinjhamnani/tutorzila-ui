
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings as SettingsIcon, Menu } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/Logo"; // Ensure Logo is imported
import { cn } from "@/lib/utils";
import type { TutorProfile } from "@/types";

export function TutorDashboardHeader() {
  const { user } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const isMobile = useIsMobile(); 

  return (
    <header className="bg-card p-4 shadow-sm w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* SidebarTrigger will control the main sidebar from DashboardLayout */}
          <SidebarTrigger className="mr-2"> 
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
          <Link href={user?.role === 'tutor' ? "/dashboard/tutor" : "/"} className="flex items-center">
            <Logo className="h-24 w-auto" /> {/* Increased height */}
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
