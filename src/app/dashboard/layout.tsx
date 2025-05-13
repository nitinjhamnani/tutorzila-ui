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
import { Home, SearchCheck, PlusCircle, BookOpen, Users, ShieldCheck, LogOut, Settings, Briefcase, ListChecks, LayoutDashboard, School, DollarSign, CalendarDays, MessageSquareQuote, UserCircle, LifeBuoy, Edit } from "lucide-react"; 
import { Logo } from "@/components/shared/Logo";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppHeader } from "@/components/shared/AppHeader"; 

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

  const dashboardHomeHref = user.role === "admin" ? "/dashboard/admin" : user.role === 'tutor' ? '/dashboard/tutor' : `/dashboard/${user.role}`;


  const commonNavItems = [
    { href: dashboardHomeHref, label: "Dashboard", icon: LayoutDashboard }, 
  ];

  const parentNavItems = [
    { href: "/dashboard/post-requirement", label: "Post Requirement", icon: PlusCircle },
    { href: "/dashboard/my-requirements", label: "My Requirements", icon: ListChecks },
    { href: "/search-tuitions", label: "Find Tutors", icon: SearchCheck },
    { href: "/dashboard/demo-sessions", label: "Demo Sessions", icon: MessageSquareQuote, disabled: false }, 
    { href: "/dashboard/my-classes", label: "My Classes", icon: CalendarDays, disabled: false }, 
    { href: "/dashboard/my-calendar", label: "My Calendar", icon: CalendarDays, disabled: false },
    { href: "/dashboard/manage-students", label: "Student Profiles", icon: School, disabled: false }, 
    { href: "/dashboard/payments", label: "My Payments", icon: DollarSign, disabled: false }, 
    // { href: "/dashboard/settings", label: "Settings", icon: Settings, disabled: true }, // Moved to footer
  ];

  const tutorNavItems = [
    { href: "/dashboard/enquiries", label: "My Enquiries", icon: Briefcase },
    { href: "/dashboard/my-classes", label: "My Classes", icon: CalendarDays, disabled: false }, 
    { href: "/dashboard/payments", label: "My Payments", icon: DollarSign, disabled: false }, 
    { href: "/dashboard/demo-sessions", label: "Demo Sessions", icon: MessageSquareQuote, disabled: false }, 
    // { href: "/dashboard/settings", label: "Settings", icon: Settings, disabled: true }, // Moved to footer
  ];

  const adminNavItems = [
    { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: Users, disabled: true },
    { href: "/dashboard/admin/manage-tuitions", label: "Manage Tuitions", icon: BookOpen, disabled: true },
    { href: "/dashboard/admin/analytics", label: "Site Analytics", icon: DollarSign, disabled: true }, 
    // { href: "/dashboard/settings", label: "Settings", icon: Settings, disabled: true }, // Moved to footer
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
    { href: "/dashboard/settings", label: "Settings", icon: Settings, disabled: true },
    { label: "Log Out", icon: LogOut, onClick: logout },
  ];


  return (
    <>
      <AppHeader /> 
      <SidebarProvider defaultOpen={!isMobile}>
        <Sidebar 
          collapsible={isMobile ? "offcanvas" : "icon"} 
          className="border-r pt-[var(--header-height)] bg-card shadow-md flex flex-col" // Added flex flex-col
        > 
          <SidebarHeader className="p-4 border-b border-border/50">
            <div className={cn(
                "flex items-center w-full", 
                isMobile ? "justify-end" : "justify-end group-data-[collapsible=icon]:justify-center"
              )}
            >
              <SidebarTrigger className="hover:bg-primary/10 hover:text-primary transition-colors"/>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-grow"> {/* Added flex-grow */}
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, className: "ml-1.5 text-xs" }} 
                    disabled={item.disabled}
                    className={cn(
                      "transition-all duration-200 hover:bg-primary/10 hover:text-primary group", 
                      item.disabled && "opacity-50 cursor-not-allowed",
                      pathname === item.href && "bg-primary/10 text-primary font-semibold" 
                    )}
                  >
                    <Link href={item.disabled ? "#" : item.href} className="flex items-center gap-3">
                      <item.icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", pathname === item.href && "text-primary")} />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2 border-t border-border/50 mt-auto"> {/* Added mt-auto */}
            <SidebarMenu>
              {footerNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild={!item.onClick}
                    isActive={item.onClick ? false : pathname === item.href}
                    tooltip={{ children: item.label, className: "ml-1.5 text-xs" }}
                    disabled={item.disabled}
                    onClick={item.onClick}
                    className={cn(
                      "transition-all duration-200 hover:bg-primary/10 hover:text-primary group",
                      item.disabled && "opacity-50 cursor-not-allowed",
                      pathname === item.href && !item.onClick && "bg-primary/10 text-primary font-semibold",
                      item.label === "Log Out" && "text-destructive hover:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                    )}
                  >
                    {item.onClick ? (
                      <div className="flex items-center gap-3 w-full">
                        <item.icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110")} />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </div>
                    ) : (
                      <Link href={item.disabled ? "#" : item.href!} className="flex items-center gap-3">
                        <item.icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", pathname === item.href && "text-primary")} />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="px-6 sm:px-8 md:px-10 lg:px-12 py-4 md:py-6 bg-background pt-[calc(var(--header-height)_+_1rem)]">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
          {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <style jsx global>{`
        :root {
          --header-height: 6rem; 
          --logo-height: 4.5rem; 
        }
      `}</style>
    </>
  );
}