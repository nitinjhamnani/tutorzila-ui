
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
import { Menu, MessageSquareQuote, DollarSign, CalendarDays, UserCog, LifeBuoy, Settings as SettingsIcon, LogOut, ShieldCheck, Briefcase, ListChecks, LayoutDashboard, School, SearchCheck, PlusCircle, UserCircle, HomeIcon as HomeIconLucide, Users as UsersIcon, BookOpen, BarChart2, MessageSquare } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
// import { TutorDashboardHeader } from "@/components/dashboard/tutor/TutorDashboardHeader"; // Removed, tutor header logic is separate

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated) {
        router.replace("/"); // Redirect to home if not authenticated and auth check is complete
      } else if (user?.role === 'tutor') {
        // This specific layout is not for tutors.
        // Tutors should be redirected to /tutor/dashboard by useAuthMock or their specific layout
        router.replace("/tutor/dashboard");
      } else if (user && user.role !== 'parent' && user.role !== 'admin') {
        // If role is somehow unknown or unhandled, redirect to home
        router.replace("/");
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, user, router]);


  // Header height management (simplified as AppHeader is only for public now)
  // VerificationBanner is also removed from this context.
  // We assume dashboard pages don't have the public AppHeader.
  useEffect(() => {
    if (hasMounted) {
      document.documentElement.style.setProperty('--header-height', '0px'); // No main app header in dashboard layouts
    }
    return () => {
      document.documentElement.style.setProperty('--header-height', '0px');
    };
  }, [hasMounted]);


  if (isCheckingAuth && !hasMounted) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Dashboard...</div>;
  }

  if (hasMounted && (!isAuthenticated || (user && user.role !== 'parent' && user.role !== 'admin'))) {
    // This return will be hit if the useEffect for redirection hasn't completed yet,
    // or if the role is tutor (before that specific redirect kicks in), or if role is invalid.
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }

   if (!user && hasMounted) { // Should be caught by !isAuthenticated, but as a safeguard
    return <div className="flex h-screen items-center justify-center">User data not available. Redirecting...</div>;
  }


  // This layout is now primarily for Parent and Admin
  let dashboardHomeHref = "/dashboard"; // Default fallback
  if (user?.role === "admin") {
    dashboardHomeHref = "/dashboard/admin";
  } else if (user?.role === 'parent') {
    dashboardHomeHref = "/dashboard/parent";
  }

  const commonNavItems = [
    { href: dashboardHomeHref, label: "Dashboard", icon: LayoutDashboard },
  ];

  const parentNavItems = [
    { href: "/dashboard/parent/my-requirements", label: "My Enquiries", icon: ListChecks },
    { href: "/search-tuitions", label: "Find Tutors", icon: SearchCheck }, // Link to public search
    { href: "/dashboard/parent/my-classes", label: "My Classes", icon: CalendarDays, disabled: false },
    { href: "/dashboard/parent/messages", label: "Messages", icon: MessageSquare, disabled: true },
    { href: "/dashboard/parent/demo-sessions", label: "Demo Sessions", icon: MessageSquareQuote, disabled: false },
    { href: "/dashboard/parent/manage-students", label: "Student Profiles", icon: School, disabled: false },
    { href: "/dashboard/parent/payments", label: "My Payments", icon: DollarSign, disabled: false },
  ];

  const adminNavItems = [
    { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: UsersIcon, disabled: true },
    { href: "/dashboard/admin/manage-tuitions", label: "Manage Tuitions", icon: BookOpen, disabled: true },
    { href: "/dashboard/admin/analytics", label: "Site Analytics", icon: BarChart2, disabled: true },
    { href: "/dashboard/admin/messages", label: "Messages", icon: MessageSquare, disabled: true },
  ];

  const finalAdminNavItems = user?.role === "admin" && dashboardHomeHref === "/dashboard/admin"
    ? adminNavItems
    : [{ href: "/dashboard/admin", label: "Admin Panel", icon: ShieldCheck }, ...adminNavItems];

  let roleNavItems: any[] = [];
  if (user?.role === "parent") roleNavItems = parentNavItems;
  else if (user?.role === "admin") roleNavItems = finalAdminNavItems;

  const mainNavItems = [...commonNavItems, ...roleNavItems];

  let myAccountHref = "/dashboard/my-account"; // Default for admin if not specifically overridden
  let settingsHref = "/dashboard/settings"; // Default for admin

  if (user?.role === 'parent') {
    myAccountHref = "/dashboard/parent/my-account";
    settingsHref = "/dashboard/parent/settings";
  } else if (user?.role === 'admin') {
    // Admin might have a different path or share the generic one
    myAccountHref = "/dashboard/admin/my-account"; // Or /dashboard/my-account if generic
    settingsHref = "/dashboard/admin/settings";  // Or /dashboard/settings
  }


  const accountSettingsNavItems = [
    { href: myAccountHref, label: "My Account", icon: UserCircle, disabled: false },
    { href: settingsHref, label: "Settings", icon: SettingsIcon, disabled: true },
  ];
  const logoutNavItem = { label: "Log Out", icon: LogOut, onClick: logout };

  // Padding is now only for verification banner if it were present
  const paddingTopClass = "pt-[var(--verification-banner-height,0px)]";


  return (
    <>
      {/* <VerificationBanner /> Removed */}
      <SidebarProvider defaultOpen={!isMobile}>
        <Sidebar
          collapsible={isMobile ? "offcanvas" : "icon"}
          className={cn(
            "border-r bg-card shadow-md flex flex-col",
            paddingTopClass 
          )}
        >
          <SidebarHeader className={cn("p-4 border-b border-border/50", isMobile ? "pt-4 pb-2" : "pt-4 pb-2")}>
            {/* No SheetTitle here; Sidebar component handles it for mobile */}
            <div className={cn("flex items-center w-full", isMobile ? "justify-end" : "justify-end group-data-[collapsible=icon]:justify-center")}>
                {!isMobile && <SidebarMenuButton className="hover:bg-primary/10 hover:text-primary transition-colors"><Menu className="h-5 w-5"/></SidebarMenuButton>}
            </div>
          </SidebarHeader>

          <SidebarContent className="flex-grow">
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = item.href ? pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== dashboardHomeHref && item.href !== "/dashboard") : false;
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
                        <item.icon className={cn("transition-transform duration-200", isActive && "text-primary-foreground")} />
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
                        <item.icon className={cn("transition-transform duration-200", isActive && "text-primary-foreground")} />
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
                        <logoutNavItem.icon className="transition-transform duration-200" />
                        <span className="group-data-[collapsible=icon]:hidden">{logoutNavItem.label}</span>
                      </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className={cn(
            "pb-4 md:pb-6 bg-secondary overflow-x-hidden",
             paddingTopClass 
          )}>
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full p-4 md:p-6"> {/* Added standard padding here */}
              {children}
            </div>
          </SidebarInset>
      </SidebarProvider>
    </>
  );
}

