
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
  // SidebarMenuButton, // No longer directly used here for the trigger
  SidebarMenuButton, // Still needed for actual menu items
  SidebarInset,
  SidebarTrigger, // Import SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { VerificationBanner } from "@/components/shared/VerificationBanner";
import {
  LayoutDashboard,
  Briefcase,
  DollarSign,
  UserCircle,
  LogOut,
  Settings as SettingsIcon,
  School,
  CalendarDays,
  Menu as MenuIcon, // Renamed to avoid conflict with SidebarMenu
  MessageSquare,
  MessageSquareQuote, // Keep for Demos icon
} from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
// TutorDashboardHeader is not used in this layout as it's part of the page content if needed
// or this layout provides its own header structure if any.
// For now, we assume the sidebar is the primary navigation and no separate TutorDashboardHeader is rendered by this layout.

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
    // For tutor layout, header height is 0 unless a specific header is added back.
    // If TutorDashboardHeader were to be used here, we'd set its height.
    document.documentElement.style.setProperty('--header-height', '0px');
    return () => {
      document.documentElement.style.setProperty('--header-height', '0px');
    };
  }, []);


  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || user?.role !== 'tutor')) {
      router.replace("/");
    }
  }, [isAuthenticated, isCheckingAuth, user, router]);


  if (isCheckingAuth || !isAuthenticated || user?.role !== 'tutor') {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Area...</div>;
  }

  const tutorNavItems = [
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase },
    { href: "/tutor/demo-sessions", label: "Demos", icon: MessageSquareQuote },
    { href: "/tutor/classes", label: "Classes", icon: School, disabled: false },
    // { href: "/tutor/messages", label: "Messages", icon: MessageSquare, disabled: true }, // Assuming Messages are coming soon
    { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: true },
  ];

  const accountSettingsNavItems = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/tutor/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];
  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

  const paddingTopClass = "pt-[var(--verification-banner-height,0px)]";


  return (
    <div className="flex flex-col min-h-screen">
      <VerificationBanner />
      {/* No separate sticky header div here, sidebar and content start below banner */}
      <div className={cn("flex flex-1 overflow-hidden", paddingTopClass)}>
        <SidebarProvider defaultOpen={!isMobile}>
          <Sidebar
            collapsible={isMobile ? "offcanvas" : "icon"}
            className="border-r bg-card shadow-md flex flex-col"
            // No top padding needed for Sidebar itself, its content will be pushed by its header
          >
            <SidebarHeader className={cn("p-4 border-b border-border/50", isMobile ? "pt-4 pb-2" : "pt-4 pb-2")}>
              {/* SheetTitle is handled by Sidebar component itself for mobile */}
              <div className={cn("flex items-center w-full", isMobile ? "justify-end" : "justify-end group-data-[collapsible=icon]:justify-center")}>
                {!isMobile && (
                  <SidebarTrigger className="hover:bg-primary/10 hover:text-primary transition-colors">
                    {/* SidebarTrigger defaults to MenuIcon if no children provided, or we can be explicit */}
                    <MenuIcon className="h-5 w-5" />
                  </SidebarTrigger>
                )}
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
              "pb-4 md:pb-6 px-4 md:px-6" // No top padding needed here, as parent is offset
            )}
          >
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
