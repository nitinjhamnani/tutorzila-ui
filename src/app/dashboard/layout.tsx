
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
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SheetTitle, 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
// Keep Menu as MenuIcon alias if used elsewhere, or just use Menu
import { Menu as MenuIcon, MessageSquareQuote, DollarSign, CalendarDays, UserCog, LifeBuoy, Settings as SettingsIcon, LogOut, ShieldCheck, Briefcase, ListChecks, LayoutDashboard, School, SearchCheck, PlusCircle, UserCircle, Home as HomeIcon, Users as UsersIcon, BookOpen, BarChart2, MessageSquare } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TutorDashboardHeader } from "@/components/dashboard/tutor/TutorDashboardHeader";
import { VerificationBanner } from "@/components/shared/VerificationBanner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isCheckingAuth, router]);

  if (isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Dashboard...</div>;
  }

  const dashboardHomeHref = user.role === "admin" ? "/dashboard/admin" : user.role === 'tutor' ? '/dashboard/tutor' : `/dashboard/parent`;

  const commonNavItems = [
    { href: dashboardHomeHref, label: "Dashboard", icon: LayoutDashboard },
  ];

  const parentNavItems = [
    { href: "/dashboard/my-requirements", label: "My Enquiries", icon: ListChecks },
    { href: "/search-tuitions", label: "Find Tutors", icon: SearchCheck },
    { href: "/dashboard/my-classes", label: "My Classes", icon: CalendarDays, disabled: false },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, disabled: true },
    { href: "/dashboard/demo-sessions", label: "Demo Sessions", icon: MessageSquareQuote, disabled: false },
    { href: "/dashboard/manage-students", label: "Student Profiles", icon: School, disabled: false },
    { href: "/dashboard/payments", label: "My Payments", icon: DollarSign, disabled: false },
  ];

  const tutorNavItems = [
    { href: "/dashboard/enquiries", label: "Enquiries", icon: Briefcase },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, disabled: true },
    { href: "/dashboard/payments", label: "My Payments", icon: DollarSign, disabled: false },
  ];

  const adminNavItems = [
    { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: UsersIcon, disabled: true },
    { href: "/dashboard/admin/manage-tuitions", label: "Manage Tuitions", icon: BookOpen, disabled: true },
    { href: "/dashboard/admin/analytics", label: "Site Analytics", icon: BarChart2, disabled: true }, 
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, disabled: true },
  ];

  const finalAdminNavItems = user.role === "admin" && dashboardHomeHref === "/dashboard/admin"
    ? adminNavItems
    : [{ href: "/dashboard/admin", label: "Admin Panel", icon: ShieldCheck }, ...adminNavItems];

  let roleNavItems = [];
  if (user.role === "parent") roleNavItems = parentNavItems;
  else if (user.role === 'tutor') roleNavItems = tutorNavItems;
  else if (user.role === "admin") roleNavItems = finalAdminNavItems;

  const mainNavItems = [...commonNavItems, ...roleNavItems];

  const accountSettingsNavItems = [
    { href: "/dashboard/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon, disabled: true },
  ];
  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };


  const tutorHeaderPaths = [
    '/dashboard/tutor',
    '/dashboard/enquiries', // Main enquiries list for tutor
    // Ensure dynamic enquiry detail paths are covered
    '/dashboard/my-classes', // My Classes for Tutor (if any)
    '/dashboard/payments',   // My Payments for Tutor
    '/dashboard/demo-sessions', // Demo Sessions for Tutor
    '/dashboard/my-account',
    '/dashboard/tutor/edit-personal-details',
    '/dashboard/tutor/edit-tutoring-details'
  ];
  
  const showTutorHeader = isAuthenticated && user?.role === 'tutor' && 
    (
      tutorHeaderPaths.some(p => pathname === p || (p === '/dashboard/enquiries' && pathname.startsWith('/dashboard/enquiries/')))
    );


  return (
    <>
      <VerificationBanner />

      <SidebarProvider defaultOpen={!isMobile}>
        <Sidebar
          collapsible={isMobile ? "offcanvas" : "icon"}
          className={cn(
            "border-r bg-card shadow-md flex flex-col",
            showTutorHeader || user?.role === 'tutor' // For tutor, padding accounts for VerificationBanner only
              ? "pt-[var(--verification-banner-height,0px)]" 
              : "pt-[var(--verification-banner-height,0px)]" // For others, it's the same as no AppHeader is shown here
          )}
        >
          <SidebarHeader className={cn("p-4 border-b border-border/50", isMobile ? "pt-4 pb-2" : "pt-4 pb-2")}>
            {/* SheetTitle for mobile is now handled inside Sidebar component */}
            <div className={cn("flex items-center w-full", isMobile ? "justify-end" : "justify-end group-data-[collapsible=icon]:justify-center")}>
                {!isMobile && <SidebarTrigger className="hover:bg-primary/10 hover:text-primary transition-colors"><MenuIcon className="h-5 w-5"/></SidebarTrigger>}
            </div>
          </SidebarHeader>

          <SidebarContent className="flex-grow">
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = item.href ? pathname === item.href || (item.href === '/dashboard/enquiries' && pathname.startsWith('/dashboard/enquiries/')) || (item.href === '/dashboard/demo-sessions' && pathname.startsWith('/dashboard/demo-sessions')) : false;
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
                        isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-primary/10 hover:text-primary",
                        "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90",
                        "group-data-[collapsible=icon]:justify-center"
                      )}
                    >
                      <Link href={item.disabled || !item.href ? "#" : item.href!} className="flex items-center gap-2.5">
                        <item.icon className={cn(
                            "transition-transform duration-200 group-hover:scale-110",
                            isActive ? "text-primary-foreground" : "group-hover:text-primary"
                         )} />
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
                 const isActive = !item.onClick && item.href ? pathname === item.href : false;
                return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild={!item.onClick}
                    isActive={isActive}
                    tooltip={{ children: item.label, className: "ml-1.5 text-xs" }}
                    disabled={item.disabled}
                    onClick={item.onClick}
                    className={cn(
                      "transition-all duration-200 group h-10 text-sm font-medium",
                      item.disabled && "opacity-50 cursor-not-allowed",
                      isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-primary/10 hover:text-primary",
                       "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90",
                       "group-data-[collapsible=icon]:justify-center"
                    )}
                  >
                    {item.onClick ? (
                      <div className="flex items-center gap-2.5 w-full">
                        <item.icon className={cn("transition-transform duration-200 group-hover:scale-110", isActive ? "text-primary-foreground" : "group-hover:text-primary" )} />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </div>
                    ) : (
                      <Link href={item.disabled || !item.href ? "#" : item.href!} className="flex items-center gap-2.5">
                        <item.icon className={cn("transition-transform duration-200 group-hover:scale-110", isActive ? "text-primary-foreground" : "group-hover:text-primary")} />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    )}
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

        <div className="flex flex-col flex-1">
           {showTutorHeader && (
            <div className="sticky top-[var(--verification-banner-height,0px)] z-30">
              <TutorDashboardHeader />
            </div>
          )}
          <SidebarInset className={cn(
            "pb-4 md:pb-6 bg-background overflow-x-hidden",
             showTutorHeader 
              ? "pt-0" // TutorDashboardHeader already accounts for banner
              : "pt-[var(--verification-banner-height,0px)]" // Others just account for banner
          )}>
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
