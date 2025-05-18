
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
import { Home, SearchCheck, PlusCircle, BookOpen, Users, ShieldCheck, LogOut, Settings, Briefcase, ListChecks, LayoutDashboard, School, DollarSign, CalendarDays, MessageSquareQuote, UserCircle, LifeBuoy, Edit, MessageSquare } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
// AppHeader import removed as it's no longer used directly in this layout for all roles

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthMock();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  if (isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Dashboard...</div>;
  }

  const dashboardHomeHref = user.role === "admin" ? "/dashboard/admin" : user.role === 'tutor' ? '/dashboard/enquiries' : `/dashboard/parent`;

  const commonNavItems = [
    { href: dashboardHomeHref, label: "Dashboard", icon: LayoutDashboard },
  ];

  const parentNavItems = [
    { href: "/dashboard/post-requirement", label: "Post Requirement", icon: PlusCircle },
    { href: "/dashboard/my-requirements", label: "My Enquiries", icon: ListChecks },
    { href: "/search-tuitions", label: "Find Tutors", icon: SearchCheck },
    { href: "/dashboard/my-classes", label: "My Classes", icon: CalendarDays, disabled: false },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, disabled: true },
    { href: "/dashboard/demo-sessions", label: "Demo Sessions", icon: MessageSquareQuote, disabled: false },
    // { href: "/dashboard/my-calendar", label: "My Calendar", icon: CalendarDays, disabled: false }, // Calendar removed
    { href: "/dashboard/manage-students", label: "Student Profiles", icon: School, disabled: false },
    { href: "/dashboard/payments", label: "My Payments", icon: DollarSign, disabled: false },
  ];

  const tutorNavItems = [
    // "/dashboard/enquiries" is handled by dashboardHomeHref for tutors
    { href: "/dashboard/my-classes", label: "My Classes", icon: CalendarDays, disabled: false },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, disabled: true },
    { href: "/dashboard/payments", label: "My Payments", icon: DollarSign, disabled: false },
    { href: "/dashboard/demo-sessions", label: "Demo Sessions", icon: MessageSquareQuote, disabled: false },
  ];

  const adminNavItems = [
    { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: Users, disabled: true },
    { href: "/dashboard/admin/manage-tuitions", label: "Manage Tuitions", icon: BookOpen, disabled: true },
    { href: "/dashboard/admin/analytics", label: "Site Analytics", icon: DollarSign, disabled: true },
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

  const footerNavItems = [
    { href: "/dashboard/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, disabled: true },
    { label: "Log Out", icon: LogOut, onClick: logout },
  ];
  
  // The shared AppHeader is no longer rendered here for any dashboard user.
  // Specific dashboard layouts/pages (like tutor's) will implement their own headers if needed.

  return (
    <>
      {/* AppHeader is removed from here */}
      <SidebarProvider defaultOpen={!isMobile}>
        <Sidebar
          collapsible={isMobile ? "offcanvas" : "icon"}
          className="border-r pt-[var(--verification-banner-height,0px)] bg-card shadow-md flex flex-col" // Adjusted pt
        >
          <SidebarHeader className={cn(
            "p-4 border-b border-border/50",
            isMobile ? "pt-4 pb-2" : "pt-4 pb-2"
          )}>
            <div className={cn(
              "flex items-center w-full",
              isMobile ? "justify-end" : "justify-end group-data-[collapsible=icon]:justify-center"
            )}
            >
              <SidebarTrigger className="hover:bg-primary/10 hover:text-primary transition-colors" />
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-grow">
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href;
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
                      <Link href={item.disabled ? "#" : item.href!} className="flex items-center gap-2.5">
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
              {footerNavItems.map((item) => {
                 const isActive = !item.onClick && pathname === item.href;
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
                      item.label === "Log Out" && "text-destructive hover:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive",
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
                      <Link href={item.disabled ? "#" : item.href!} className="flex items-center gap-2.5">
                        <item.icon className={cn("transition-transform duration-200 group-hover:scale-110", isActive ? "text-primary-foreground" : "group-hover:text-primary")} />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="px-6 sm:px-8 md:px-10 lg:px-12 pb-4 md:pb-6 bg-background pt-[var(--verification-banner-height,0px)] overflow-x-hidden"> {/* Adjusted padding */}
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      {/* Removed local style tag for --header-height and --logo-height */}
    </>
  );
}
