"use client";

import type { ReactNode, ElementType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  User as UserIconLucide, // Renamed to avoid conflict
  MessageSquare,
  Percent,
  Star,
  DollarSign,
  Eye,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Briefcase,
  CalendarDays,
  UserCog,
  LifeBuoy,
  Settings as SettingsIcon, // Keep alias to avoid conflict
  Presentation,
  RadioTower,
  Clock as ClockIcon,
  Image as LucideImage,
  BookOpen as BookOpenIcon,
  Globe as GlobeIcon,
  FileText,
  Palette,
  Link as LinkIconLucide, // Renamed to avoid conflict
  UploadCloud,
  Ruler,
  Filter as FilterIconLucide,
  ListChecks, // For My Enquiries
  SearchCheck, // For Find Tutors
  School, // For Student Profiles
  MessageSquareQuote, // For Demo Sessions
  ArrowRight,
  Camera,
  PanelLeft,
  Menu as MenuIcon,
  Info,
  Bell,
} from "lucide-react";
import React, { useEffect, useState } from "react";

// Define props for the QuickActionCard
interface QuickActionCardProps {
  title: string;
  description: string;
  IconEl: ElementType;
  href: string;
  disabled?: boolean;
  buttonText?: string;
  iconBg?: string;
  iconTextColor?: string;
}

// QuickActionCard component definition
function QuickActionCard({ title, description, IconEl, href, disabled, buttonText, iconBg = "bg-primary/10", iconTextColor = "text-primary" }: QuickActionCardProps) {
  const content = (
    <div className="bg-card rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between border-0 transform hover:-translate-y-1">
      <div>
        <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg mb-3", iconBg)}>
          <IconEl className={cn("w-5 h-5", iconTextColor)} />
        </div>
        <h3 className="font-medium text-foreground text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
      </div>
      <div className="mt-4 text-sm text-primary font-medium flex items-center gap-1 whitespace-nowrap">
        {buttonText || (disabled ? "Coming Soon" : "Go")}
        {!disabled && <ArrowRight className="ml-1 w-3 h-3" />}
      </div>
    </div>
  );

  if (disabled) {
    return <div className="block h-full opacity-60 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}


export default function ParentDashboardPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated) {
        router.replace("/"); // Redirect to home if not authenticated
      } else if (user?.role !== 'parent') {
        router.replace("/"); // Redirect if not a parent
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, user, router]);


  if (isCheckingAuth || !hasMounted) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Parent Dashboard...</div>;
  }

  if (!isAuthenticated || !user || user.role !== 'parent') {
    // This case should ideally be handled by the redirect in useEffect, but as a fallback
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }

  const parentActionCards: QuickActionCardProps[] = [
    { title: "My Enquiries", description: "View & manage posted requests.", IconEl: ListChecks, href: "/parent/my-requirements", buttonText: "Manage Enquiries" },
    { title: "Find Tutors", description: "Search for qualified tutors.", IconEl: SearchCheck, href: "/search-tuitions", buttonText: "Search Now" },
    { title: "My Classes", description: "Track your booked & ongoing classes.", IconEl: CalendarDays, href: "/parent/my-classes", buttonText: "View Classes", disabled: false },
    { title: "Demo Sessions", description: "Manage demo class requests & schedules.", IconEl: MessageSquareQuote, href: "/parent/demo-sessions", buttonText: "Manage Demos", disabled: false },
    { title: "Student Profiles", description: "Manage your children's profiles.", IconEl: School, href: "/parent/manage-students", buttonText: "View Profiles", disabled: false },
    { title: "My Payments", description: "View your payment history.", IconEl: DollarSign, href: "/parent/payments", buttonText: "View Payments", disabled: false },
    { title: "My Account", description: "Update your profile settings.", IconEl: UserCog, href: "/parent/my-account", buttonText: "Go to Account" },
    { title: "Support", description: "Get help or report issues.", IconEl: LifeBuoy, href: "#", buttonText: "Get Support", disabled: true },
  ];


  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8 border-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/30 shadow-sm">
                <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl md:text-2xl">
                  {user.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">Hello, {user.name} <span className="inline-block ml-1">👋</span></h1>
                <p className="text-xs text-muted-foreground mt-1">Welcome back to your Parent Dashboard!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {parentActionCards.map((action) => (
              <QuickActionCard
                key={action.title}
                title={action.title}
                description={action.description}
                IconEl={action.IconEl}
                href={action.href}
                disabled={action.disabled}
                buttonText={action.buttonText}
                iconBg={action.iconBg}
                iconTextColor={action.iconTextColor}
              />
            ))}
          </div>
        </div>

        {/* Placeholder for other parent-specific sections if needed */}
      </div>
    </main>
  );
}
