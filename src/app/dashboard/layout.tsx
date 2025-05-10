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
  // SidebarMenuSub, // Not used currently
  // SidebarMenuSubItem, // Not used currently
  // SidebarMenuSubButton, // Not used currently
  SidebarInset,
  // SidebarGroup, // Not used currently
  // SidebarGroupLabel // Not used currently
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, Search, PlusCircle, BookOpen, Users, ShieldCheck, LogOut, Settings, Briefcase, ListChecks } from "lucide-react"; // Menu icon removed as trigger is part of sidebar
import { Logo } from "@/components/shared/Logo";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppHeader } from "@/components/shared/AppHeader"; // Added AppHeader

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthMock();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
    } else {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  if (isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const commonNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
  ];

  const parentNavItems = [
    { href: "/dashboard/post-requirement", label: "Post Requirement", icon: PlusCircle },
    { href: "/dashboard/my-requirements", label: "My Requirements", icon: ListChecks },
  ];

  const tutorNavItems = [
    { href: "/dashboard/search-tuitions", label: "Search Tuitions", icon: Search },
    { href: "/dashboard/my-applications", label: "My Applications", icon: Briefcase, disabled: true },
  ];

  const adminNavItems = [
    { href: "/dashboard/admin", label: "Admin Panel", icon: ShieldCheck },
    { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: Users, disabled: true },
    { href: "/dashboard/admin/manage-tuitions", label: "Manage Tuitions", icon: BookOpen, disabled: true },
  ];

  let roleNavItems = [];
  if (user.role === "parent") roleNavItems = parentNavItems;
  else if (user.role === "tutor") roleNavItems = tutorNavItems;
  else if (user.role === "admin") roleNavItems = [...parentNavItems, ...tutorNavItems, ...adminNavItems];

  const navItems = [...commonNavItems, ...roleNavItems];

  return (
    <>
      <AppHeader /> {/* AppHeader added here */}
      <SidebarProvider defaultOpen={!isMobile}>
        <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} className="border-r pt-[var(--header-height)]"> {/* Adjust pt for header height */}
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="group-data-[collapsible=icon]:hidden">
                <Logo className="text-xl" />
              </Link>
              <div className={cn("group-data-[collapsible=icon]:mx-auto", isMobile && "ml-auto")}>
                  <SidebarTrigger />
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
                    tooltip={{ children: item.label, className: "ml-1" }}
                    disabled={item.disabled}
                    className={cn("transition-transform duration-200 hover:translate-x-1", item.disabled && "opacity-50 cursor-not-allowed")}
                  >
                    <Link href={item.disabled ? "#" : item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user.role === "admin" && pathname.startsWith('/dashboard/admin') && !navItems.find(item => item.href === "/dashboard/admin") && (
                  <SidebarMenuItem>
                      <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/admin"}
                      tooltip={{ children: "Admin Panel", className: "ml-1"}}
                      className="transition-transform duration-200 hover:translate-x-1"
                      >
                          <Link href="/dashboard/admin">
                              <ShieldCheck />
                              <span>Admin Panel</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2">
            <div className="group-data-[collapsible=icon]:hidden flex flex-col gap-2 p-2 border-t">
                <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="justify-start gap-2" disabled>
                  <Settings className="h-4 w-4" /> Settings
                </Button>
                <Button variant="ghost" size="sm" onClick={logout} className="justify-start gap-2">
                  <LogOut className="h-4 w-4" /> Log Out
                </Button>
            </div>
            <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2 py-2 border-t">
              <Button variant="ghost" size="icon" onClick={logout} title="Log Out">
                  <LogOut className="h-5 w-5" />
                </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="p-4 md:p-6 bg-background pt-[calc(var(--header-height)_+_1rem)]"> {/* Adjust pt for header height */}
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
          {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <style jsx global>{`
        :root {
          --header-height: 7rem; /* Updated header height */
        }
        .pt-\\[var\\(--header-height\\)\\] {
          padding-top: var(--header-height);
        }
        .pt-\\[calc\\(var\\(--header-height\\)_\\+_1rem\\)\\] {
          padding-top: calc(var(--header-height) + 1rem);
        }
      `}</style>
    </>
  );
}
