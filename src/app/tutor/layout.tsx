
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/shared/Logo";
import { cn } from "../../lib/utils";
import type { User, TutorProfile } from "@/types";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Script from "next/script";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  School,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  Menu as MenuIcon,
  Bell,
  PanelLeft,
  ShoppingBag,
  ListChecks,
  DollarSign,
  MessageSquareQuote,
  Eye,
  Loader2,
  LifeBuoy,
  ArrowDownCircle, // Added icon
} from "lucide-react";
import { TutorSidebar } from "@/components/tutor/TutorSidebar";
import { useToast } from "@/hooks/use-toast";
import { AddToHomeScreenModal } from "@/components/modals/AddToHomeScreenModal"; // Import the new modal


const fetchTutorId = async (token: string | null): Promise<string> => {
  if (!token) throw new Error("Authentication token not found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(`${apiBaseUrl}/api/tutor/get/id`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "accept": "text/plain",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tutor ID.");
  }
  return response.text();
};


export default function TutorSpecificLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isCheckingAuth, token } = useAuthMock();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const [hasMounted, setHasMounted] = useState(false);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isFetchingTutorId, setIsFetchingTutorId] = useState(false);
  const [isAddToHomeScreenModalOpen, setIsAddToHomeScreenModalOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleViewProfileClick = async () => {
    setIsFetchingTutorId(true);
    try {
      const id = await fetchTutorId(token);
      if (id) {
        window.open(`/tutors/${id}`, '_blank');
      } else {
        throw new Error("Received an empty ID for the tutor.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Could Not Fetch Profile",
        description: error.message || "Unable to retrieve the public profile link.",
      });
    } finally {
      setIsFetchingTutorId(false);
    }
  };

  const toggleNavbarCollapsed = () => setIsNavbarCollapsed(prev => !prev);
  const toggleMobileNav = () => setIsMobileNavOpen(prev => !prev);

  const tutorNavItems = [
    { href: "/tutor/dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: false },
    { href: "/tutor/enquiries", label: "Enquiries", icon: Briefcase, disabled: false },
    { href: "/tutor/demo-sessions", label: "Demos", icon: CalendarDays, disabled: false },
    { href: "/tutor/classes", label: "Classes", icon: School, disabled: false },
    { href: "/tutor/payments", label: "Payments", icon: DollarSign, disabled: false },
    { href: "/tutor/transactions", label: "Transactions", icon: ListChecks, disabled: false },
  ];

  const accountSettingsNavItems = [
    { href: "/tutor/my-account", label: "My Account", icon: UserCircle, disabled: false },
    { href: "/tutor/support", label: "Support", icon: LifeBuoy, disabled: false },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const headerHeight = "4rem"; // For h-16 or p-4 header

  useEffect(() => {
    if (hasMounted) {
      document.documentElement.style.setProperty('--header-height', headerHeight);
    } else {
      document.documentElement.style.setProperty('--header-height', '0px');
    }
    return () => {
      document.documentElement.style.setProperty('--header-height', '0px');
    };
  }, [hasMounted]);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated) {
        router.replace("/");
      } else if (user?.role !== 'tutor') {
        router.replace("/");
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, user, router]);

  if (isCheckingAuth || !hasMounted) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Area...</div>;
  }

  if (hasMounted && (!isAuthenticated || user?.role !== 'tutor')) {
    // This return handles the case where auth status changes after mount, leading to redirection.
    // The useEffect above handles the initial redirection.
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }

   if (!user && hasMounted) { // Should ideally be caught by !isAuthenticated, but as a safeguard
    return <div className="flex h-screen items-center justify-center">User data not available. Redirecting...</div>;
  }

  return (
    <>
      <Script
        src="https://mercury-stg.phonepe.com/web/bundle/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("✅ PhonePe SDK loaded", window.PhonePeCheckout);
        }}
      />
      <div className="flex flex-col h-screen bg-secondary">
        {/* Integrated Header - Sticky */}
        {hasMounted && (
          <header
            className={cn(
              "bg-card shadow-sm w-full px-2 flex items-center justify-between sticky top-0 z-40 shrink-0",
              "h-[var(--header-height)]"
            )}
          >
            <div className="flex items-center gap-2">
              {/* Combined Mobile Nav Open and Desktop Collapse Trigger */}
              <Button
                variant="ghost"
                size="icon"
                onClick={isMobile ? toggleMobileNav : toggleNavbarCollapsed}
                className="text-gray-600 hover:text-white hover:bg-primary/80"
                aria-label={isMobile ? (isMobileNavOpen ? "Close sidebar" : "Open sidebar") : (isNavbarCollapsed ? "Expand sidebar" : "Collapse sidebar")}
              >
                <MenuIcon className="h-6 w-6" />
              </Button>
              <Link href="/tutor/dashboard">
                <Logo className="h-16 w-auto p-0" />
              </Link>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
               <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-white hover:bg-primary/80 relative h-8 w-8" 
                onClick={() => setIsAddToHomeScreenModalOpen(true)}
                aria-label="Add to Home Screen"
              >
                <ArrowDownCircle className="w-4 h-4" />
                <span className="sr-only">Add to Home Screen</span>
              </Button>
               <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-white hover:bg-primary/80 relative h-8 w-8" 
                onClick={handleViewProfileClick}
                disabled={isFetchingTutorId}
                aria-label="View Public Profile"
              >
                {isFetchingTutorId ? (
                   <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span className="sr-only">View Public Profile</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-white hover:bg-destructive/80 h-8 w-8"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </header>
        )}

        {/* This div contains the sidebar and the main page content. */}
        <div className={cn("flex flex-1 overflow-hidden")}>
          <TutorSidebar
            isMobile={isMobile}
            isMobileNavOpen={isMobileNavOpen}
            toggleMobileNav={toggleMobileNav}
            isNavbarCollapsed={isNavbarCollapsed}
            toggleNavbarCollapsed={toggleNavbarCollapsed}
            user={user}
            tutorNavItems={tutorNavItems}
            accountSettingsNavItems={accountSettingsNavItems}
            logoutNavItem={{ label: "Log Out", icon: LogOut, onClick: handleLogout }}
          />
          <main
            className={cn(
              "flex-1 flex flex-col overflow-y-auto bg-secondary"
            )}
          >
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out w-full">
              {children}
            </div>
          </main>
        </div>
        {isMobile && isMobileNavOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={toggleMobileNav}
            aria-label="Close navigation menu"
          />
        )}
      </div>
      <AddToHomeScreenModal isOpen={isAddToHomeScreenModalOpen} onOpenChange={setIsAddToHomeScreenModalOpen} />
    </>
  );
}
