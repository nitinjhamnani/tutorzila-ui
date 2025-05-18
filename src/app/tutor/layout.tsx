
"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SheetTitle,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, LayoutDashboard, Briefcase, CalendarDays, School, DollarSign, UserCircle, LogOut, Settings as SettingsIcon, MessageSquare, MessageSquareQuote } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TutorDashboardHeader } from "@/components/dashboard/tutor/TutorDashboardHeader";
import { VerificationBanner } from "@/components/shared/VerificationBanner";

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated || user?.role !== 'tutor') {
        router.replace("/"); 
      }
    }
  }, [isAuthenticated, isCheckingAuth, router, user]);

  useEffect(() => {
    document.documentElement.style.setProperty('--header-height', '4rem'); 
    return () => {
      document.documentElement.style.setProperty('--header-height', '0px');
    };
  }, []);

  if (isCheckingAuth || !user || user.role !== 'tutor') {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Area...</div>;
  }

  const tutorNavItems = [
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase },
    { href: "/tutor/demo-sessions", label: "Demos", icon: MessageSquareQuote }, // Changed from CalendarDays
    { href: "/tutor/classes", label: "Classes", icon: School, disabled: false },
    { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: false },
  ];

  const accountSettingsNavItems = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];
  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col"> {/* Ensure overall page background is gray-50 */}
      <VerificationBanner />
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="sticky top-[var(--verification-banner-height,0px)] z-30">
          <TutorDashboardHeader />
        </div>
        <Sidebar
          collapsible={isMobile ? "offcanvas" : "icon"}
          className={cn(
            "border-r bg-card shadow-md flex flex-col",
            "pt-[calc(var(--verification-banner-height,0px)_+_var(--header-height,0px))]"
          )}
        >
          <SidebarHeader className={cn("p-4 border-b border-border/50", isMobile ? "pt-4 pb-2" : "pt-4 pb-2")}>
            {isMobile && <SheetTitle className="sr-only">Main Navigation Menu</SheetTitle>}
            <div className={cn("flex items-center w-full", isMobile ? "justify-end" : "justify-end group-data-[collapsible=icon]:justify-center")}>
                {!isMobile && <SidebarMenuButton className="hover:bg-primary/10 hover:text-primary transition-colors"><MenuIcon className="h-5 w-5"/></SidebarMenuButton>}
            </div>
          </SidebarHeader>

          <SidebarContent className="flex-grow">
            <SidebarMenu>
              {tutorNavItems.map((item) => {
                const isActive = item.href ? pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== "/tutor/dashboard") : false;
                return (
                  <SidebarMenuItem key={item.href || item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={{ children: item.label, className: "ml-1.5 text-xs" }}
                      disabled={item.disabled}
                      className={cn(
                        "transition-all duration-200 group h-10 text-sm font-medium",
                        item.disabled && "opacity-50 cursor-not-allowed",
                        isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-primary hover:text-primary-foreground",
                        "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90",
                        "group-data-[collapsible=icon]:justify-center"
                      )}
                    >
                      <Link href={item.disabled || !item.href ? "#" : item.href!} className="flex items-center gap-2.5">
                        <item.icon className={cn("transition-transform duration-200 group-hover:scale-110", isActive && "text-primary-foreground")} />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2 border-t border-border/50 mt-auto">
            <SidebarMenu>
              {accountSettingsNavItems.map((item) => {
                 const isActive = item.href ? pathname === item.href : false;
                return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{ children: item.label, className: "ml-1.5 text-xs" }}
                    disabled={item.disabled}
                    className={cn(
                      "transition-all duration-200 group h-10 text-sm font-medium",
                      item.disabled && "opacity-50 cursor-not-allowed",
                      isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-primary hover:text-primary-foreground",
                       "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90",
                       "group-data-[collapsible=icon]:justify-center"
                    )}
                  >
                      <Link href={item.disabled || !item.href ? "#" : item.href!} className="flex items-center gap-2.5">
                        <item.icon className={cn("transition-transform duration-200 group-hover:scale-110", isActive && "text-primary-foreground")} />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                );
              })}
                <SidebarMenuItem key={logoutNavItem.label}>
                  <SidebarMenuButton
                    onClick={logoutNavItem.onClick}
                    tooltip={{ children: logoutNavItem.label, className: "ml-1.5 text-xs" }}
                    className={cn(
                        "transition-all duration-200 group h-10 text-sm font-medium",
                        "text-destructive hover:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive",
                        "group-data-[collapsible=icon]:justify-center"
                    )}
                    >
                     <div className="flex items-center gap-2.5 w-full">
                        <logoutNavItem.icon className="transition-transform duration-200 group-hover:scale-110" />
                        <span className="group-data-[collapsible=icon]:hidden">{logoutNavItem.label}</span>
                      </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className={cn(
            "pb-4 md:pb-6 overflow-x-hidden", // Removed bg-gray-50, inherited from parent
            "pt-[calc(var(--verification-banner-height,0px)_+_var(--header-height,0px))]"
        )}>
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
                {children}
            </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
