
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
  SidebarTrigger,
  SheetTitle, // Keep if SidebarHeader uses it for mobile sheets
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { VerificationBanner } from "@/components/shared/VerificationBanner";
import {
  LayoutDashboard,
  Briefcase,
  DollarSign, // Added DollarSign
  CalendarDays,
  UserCircle,
  Settings as SettingsIcon, // Aliased
  LogOut,
  School,
  MessageSquareQuote,
  Menu as MenuIcon, // Aliased
} from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // No TutorDashboardHeader in this layout, so header height is 0
    document.documentElement.style.setProperty('--header-height', '0px');
    return () => {
      document.documentElement.style.setProperty('--header-height', '0px');
    };
  }, []); // Removed hasMounted dependency for this specific effect as it's simpler

  useEffect(() => {
    if (!isCheckingAuth && hasMounted) { // Ensure hasMounted before checking role
      if (!isAuthenticated || user?.role !== 'tutor') {
        router.replace("/");
      }
    }
  }, [isAuthenticated, isCheckingAuth, user, router, hasMounted]);

  const tutorNavItems = [
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: false },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase, disabled: false },
    { href: "/tutor/demo-sessions", label: "Demos", icon: MessageSquareQuote, disabled: false },
    { href: "/tutor/classes", label: "Classes", icon: School, disabled: false },
    { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: true },
  ];

  const accountSettingsNavItems = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];

  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

  if (isCheckingAuth || !hasMounted || !user) { // Combined check for loading/auth
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Area...</div>;
  }
  
  if (user.role !== 'tutor') { // This check should ideally happen after hasMounted and user is confirmed
    // router.replace("/") was already called in useEffect, this is a fallback render.
     return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Access Denied. Redirecting...</div>;
  }

  const paddingTopClass = "pt-[var(--verification-banner-height,0px)]";

  return (
    <div className="flex flex-col min-h-screen">
      <VerificationBanner />
      <SidebarProvider defaultOpen={!isMobile}>
        <div className={cn("flex flex-1 overflow-hidden", paddingTopClass)}>
          <Sidebar
            collapsible={isMobile ? "offcanvas" : "icon"}
            className="border-r bg-card shadow-md flex flex-col"
          >
            <SidebarHeader className={cn("p-4 border-b border-border/50", isMobile ? "pt-4 pb-2" : "pt-4 pb-2")}>
              <div className={cn("flex items-center w-full",
                  isMobile ? "justify-start" : 
                  "justify-end group-data-[collapsible=icon]:justify-center" 
              )}>
                <SidebarTrigger className="hover:bg-primary/10 hover:text-primary transition-colors">
                    <MenuIcon className="h-5 w-5"/>
                </SidebarTrigger>
              </div>
            </SidebarHeader>
            <SidebarContent className="flex-grow">
              <SidebarMenu>
                {tutorNavItems.map((item) => {
                  const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + '/') : false;
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

          <SidebarInset
            className={cn(
              "flex-1 bg-secondary overflow-y-auto",
              "pb-4 md:pb-6 px-4 md:px-6" // Standard padding for the content area itself
            )}
          >
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

