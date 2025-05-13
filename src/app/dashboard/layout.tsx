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
// AppFooter removed for a cleaner dashboard layout

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

  const dashboardHomeHref = `/dashboard/${user.role}`;

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
    { href: "/dashboard/settings", label: "Settings", icon: Settings, disabled: true },
  ];

  const tutorNavItems = [
    { href: "/dashboard/enquiries", label: "My Enquiries", icon: Briefcase },
    { href: "/dashboard/my-classes", label: "My Classes", icon: CalendarDays, disabled: false }, 
    { href: "/dashboard/payments", label: "My Payments", icon: DollarSign, disabled: false }, 
    { href: "/dashboard/demo-sessions", label: "Demo Sessions", icon: MessageSquareQuote, disabled: false }, 
    { href: "/dashboard/settings", label: "Settings", icon: Settings, disabled: true },
  ];

  const adminNavItems = [
    { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: Users, disabled: true },
    { href: "/dashboard/admin/manage-tuitions", label: "Manage Tuitions", icon: BookOpen, disabled: true },
    { href: "/dashboard/admin/analytics", label: "Site Analytics", icon: DollarSign, disabled: true }, // Changed icon for variety
    { href: "/dashboard/settings", label: "Settings", icon: Settings, disabled: true },
  ];
  
  // Adjust adminNavItems to avoid duplicate "Admin Panel" if commonNavItems already points there
  const finalAdminNavItems = user.role === "admin" && dashboardHomeHref === "/dashboard/admin" 
    ? adminNavItems 
    : [{ href: "/dashboard/admin", label: "Admin Panel", icon: ShieldCheck }, ...adminNavItems];


  let roleNavItems = [];
  if (user.role === "parent") roleNavItems = parentNavItems;
  else if (user.role === 'tutor') roleNavItems = tutorNavItems;
  else if (user.role === "admin") roleNavItems = finalAdminNavItems; 

  const navItems = [...commonNavItems, ...roleNavItems];


  return (
    <>
      <AppHeader /> 
      <SidebarProvider defaultOpen={!isMobile}>
        <Sidebar 
          collapsible={isMobile ? "offcanvas" : "icon"} 
          className="border-r pt-[var(--header-height)] bg-card shadow-md" 
        > 
          <SidebarHeader className="p-4 border-b border-border/50"> 
            <div className="flex items-center justify-between">
              <Link href="/" className="group-data-[collapsible=icon]:hidden">
                <Logo className="h-auto w-28" /> 
              </Link>
              <div className={cn("group-data-[collapsible=icon]:mx-auto", isMobile && "ml-auto")}>
                  <SidebarTrigger className="hover:bg-primary/10 hover:text-primary transition-colors"/>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
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
          <SidebarFooter className="p-2 border-t border-border/50"> 
            <div className="group-data-[collapsible=icon]:hidden flex flex-col gap-2 p-2">
                <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30"> 
                  <Avatar className="h-10 w-10 border-2 border-primary/50">
                      <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="justify-start gap-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" disabled>
                  <Settings className="h-4 w-4" /> Settings
                </Button>
                <Button variant="ghost" size="sm" onClick={logout} className="justify-start gap-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-4 w-4" /> Log Out
                </Button>
            </div>
            <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2 py-2">
               <Button variant="ghost" size="icon" disabled title="Settings" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-not-allowed">
                  <Settings className="h-5 w-5" />
                </Button>
              <Button variant="ghost" size="icon" onClick={logout} title="Log Out" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-5 w-5" />
                </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="px-6 sm:px-8 md:px-10 lg:px-12 py-4 md:py-6 bg-background pt-[calc(var(--header-height)_+_1.5rem)]"> 
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
          {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <style jsx global>{`
        :root {
          --header-height: 7rem; 
          --logo-height: 6rem;
        }
      `}</style>
    </>
  );
}
