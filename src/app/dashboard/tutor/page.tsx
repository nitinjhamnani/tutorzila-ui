
"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { TutorProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Bell,
  Settings,
  UserCircle,
  ChevronDown,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Eye,
  Ruler,
  Filter,
  UploadCloud,
  Palette,
  Link as LinkIcon,
  BookOpen as BookOpenIcon,
  Globe as GlobeIcon,
  FileText,
  LifeBuoy,
  UserCog,
  BarChart2,
  Settings2 as Settings2Icon,
  DollarSign,
  User,
  MessageSquare,
  Percent,
  Clock,
  ShoppingBag,
  HardDrive,
  Briefcase,
  CalendarDays,
  RadioTower,
  Presentation,
  UserPlus,
  Crown,
  Share2,
  LayoutGrid,
  Camera,
  Star,
} from "lucide-react";
import logoAsset from '@/assets/images/logo.png';

// Helper component for dashboard metric cards
interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  IconEl: React.ElementType;
  iconBg: string;
  iconColor: string;
  trendColor?: string;
  TrendIconEl?: React.ElementType;
  isProgress?: boolean;
  progressValue?: number;
}

function MetricCard({ title, value, trend, IconEl, iconBg, iconColor, trendColor, TrendIconEl, isProgress = false, progressValue = 0 }: MetricCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-lg p-4 md:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
          <h3 className={cn("text-xl md:text-2xl font-semibold mt-1", iconColor)}>{value}</h3>
          {trend && (
            <div className={cn("flex items-center mt-1 text-xs", trendColor || "text-green-600")}>
              {TrendIconEl && <TrendIconEl className="w-3.5 h-3.5" />}
              <span className={cn("font-medium ml-0.5", TrendIconEl && "ml-0.5")}>{trend}</span>
            </div>
          )}
        </div>
        <div className={cn("w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-sm shrink-0", iconBg, iconColor)}>
          <IconEl className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>
      {isProgress && (
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${progressValue}%` }}></div>
        </div>
      )}
    </div>
  );
}

// Quick Setup Step Card
interface SetupStepCardProps {
  title: string;
  description: string;
  IconEl: React.ElementType;
  buttonText: string;
  completed?: boolean;
  href?: string;
  isLast?: boolean;
}

function SetupStepCard({ title, description, IconEl, buttonText, completed = false, href = "#", isLast = false }: SetupStepCardProps) {
  return (
    <div className={cn(
      "border rounded-lg p-4 relative flex flex-col justify-between",
      completed ? "border-green-200 bg-green-50" : "border-gray-200 bg-card"
    )}>
      {completed ? (
        <div className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center text-green-600">
          <CheckCircle2 className="w-full h-full" />
        </div>
      ) : (
        <div className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center text-muted-foreground">
          <Clock className="w-full h-full" />
        </div>
      )}
      <div>
        <div className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full mb-3",
          completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
        )}>
          <IconEl className="w-5 h-5" />
        </div>
        <h3 className="font-medium text-foreground text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <Button 
        asChild={!!href && href !== "#"}
        variant={isLast && !completed ? "default" : "link"} 
        className={cn(
          "mt-4 text-sm font-medium flex items-center gap-1 whitespace-nowrap w-full sm:w-auto justify-start p-0 h-auto",
          isLast && !completed ? "bg-primary text-primary-foreground px-3 py-1.5 rounded-button" : "text-primary hover:text-primary/80",
          "hover:no-underline"
        )}
      >
        {href && href !== "#" ? (
          <Link href={href}>
            {buttonText}
            {!isLast || completed ? <ArrowRight className="w-3.5 h-3.5 ml-1" /> : null}
          </Link>
        ) : (
          <span>
            {buttonText}
            {!isLast || completed ? <ArrowRight className="w-3.5 h-3.5 ml-1" /> : null}
          </span>
        )}
      </Button>
    </div>
  );
}


export default function TutorDashboardPage() {
  const { user, isAuthenticated } = useAuthMock();
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null;
  const [isClient, setIsClient] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [mockDaysLeft, setMockDaysLeft] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const pagePrimaryColor = "#4F46E5"; // Primary color from the new snippet

  useEffect(() => {
    setIsClient(true);
    if (tutorUser) {
      let completedFields = 0;
      const totalFields = 5; 
      if (tutorUser.avatar && !tutorUser.avatar.includes('pravatar.cc') && !tutorUser.avatar.includes('avatar.vercel.sh')) completedFields++;
      if (tutorUser.subjects && tutorUser.subjects.length > 0) completedFields++;
      if (tutorUser.bio && tutorUser.bio.trim() !== "") completedFields++;
      if (tutorUser.experience && tutorUser.experience.trim() !== "") completedFields++;
      if (tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== "") completedFields++;
      setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
      setMockDaysLeft(Math.floor(Math.random() * 60) + 10);
    }
  }, [tutorUser]);

  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock upload: In a real app, upload file and update user.avatar
      toast({ title: "Profile Picture Selected", description: `Mock: ${file.name} would be uploaded.` });
    }
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated || !tutorUser || tutorUser.role !== 'tutor') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-muted-foreground">Not authorized or user data not available.</p>
      </div>
    );
  }

  const dashboardMetrics = [
    { title: "Total Enquiries", value: "37", trend: "2 new", IconEl: Briefcase, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Active Classes", value: "5", trend: "1 upcoming", IconEl: CalendarDays, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Demos Completed", value: "12", trend: "85%", IconEl: CheckCircle2, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Avg. Rating", value: tutorUser.rating?.toFixed(1) || "N/A", trend: "+0.1", IconEl: Star, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Earnings", value: `₹${(Math.random() * 20000 + 5000).toFixed(0)}`, trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Profile Views", value: String(Math.floor(Math.random() * 300) + 50), trend: "5.1%", IconEl: Eye, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
  ];
  
  const quickActions = [
     { title: "My Enquiries", description: "View and respond to tuition requests.", IconEl: Briefcase, iconBg: "bg-primary/10", iconTextColor: "text-primary", href:"/dashboard/enquiries" },
     { title: "My Classes", description: "Manage your scheduled classes.", IconEl: CalendarDays, iconBg: "bg-primary/10", iconTextColor: "text-primary", href:"/dashboard/my-classes" },
     { title: "Edit Profile", description: "Update personal & tutoring details.", IconEl: UserCog, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: "/dashboard/tutor/edit-personal-details" },
     { title: "My Payments", description: "Track your earnings and payouts.", IconEl: DollarSign, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: "/dashboard/payments" },
     { title: "Demo Sessions", description: "Schedule and manage demo classes.", IconEl: RadioTower, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: "/dashboard/demo-sessions" },
     { title: "View Public Profile", description: "See how your profile looks to parents.", IconEl: Eye, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: `/tutors/${tutorUser.id}` },
     { title: "Support", description: "Get help from our support team.", IconEl: LifeBuoy, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: "#", disabled: true },
     { title: "Settings", description: "Adjust your account preferences.", IconEl: Settings2Icon, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: "/dashboard/settings", disabled: true },
  ];


  return (
    <div className="flex flex-col min-h-screen"> {/* Removed bg-gray-50 as it's in layout */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Welcome Section */}
          <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8 border-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                    <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/30 shadow-sm">
                        <AvatarImage src={tutorUser.avatar || `https://avatar.vercel.sh/${tutorUser.email}.png`} alt={tutorUser.name} />
                        <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl md:text-2xl">
                            {tutorUser.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <button
                        onClick={handleAvatarUploadClick}
                        className={cn("absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 flex items-center justify-center text-primary-foreground p-1.5 rounded-full cursor-pointer shadow-md transition-colors", `bg-primary hover:bg-primary/90`)}
                        aria-label="Update profile picture"
                    >
                        <Camera className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary-foreground" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
                <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                    <p className="text-muted-foreground mt-1 text-xs sm:text-sm">Welcome back to your dashboard</p>
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs sm:text-sm text-muted-foreground">Setup progress</span>
                            <span className={cn("text-xs sm:text-sm font-medium", `text-primary`)}>{completionPercentage}%</span>
                        </div>
                        <Progress value={completionPercentage} className="h-2 rounded-full bg-gray-100" indicatorClassName={cn("bg-primary rounded-full")} />
                        <Link href="/dashboard/tutor/edit-personal-details" className="mt-1.5 text-xs text-primary hover:underline font-medium block">
                            Complete Your Profile
                        </Link>
                    </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start md:items-center">
                <div className="bg-gray-100 rounded-lg p-4 min-w-[180px] md:min-w-[200px] w-full sm:w-auto">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Plan</p>
                      <p className="font-semibold text-foreground text-sm md:text-base">Business Pro</p>
                      <p className="text-xs text-muted-foreground mt-1">Expires on April 28, 2025</p>
                    </div>
                    <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0", `bg-primary/10 text-primary`)}>
                      <Crown className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button className={cn("text-white px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-button whitespace-nowrap w-full sm:w-auto", `bg-primary hover:bg-primary/90`)}>
                    Upgrade Plan
                  </Button>
                  <Button variant="outline" className={cn("border-gray-300 text-gray-700 px-3 py-1.5 md:px-4 md:py-2 rounded-button whitespace-nowrap hover:bg-gray-100 flex items-center gap-1.5 text-xs md:text-sm font-medium w-full sm:w-auto", "bg-card")}>
                    <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                    Share Link
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
            {dashboardMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-4 md:mb-5">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.disabled ? "#" : action.href || "#"} passHref legacyBehavior>
                <a className={cn("block", action.disabled && "opacity-60 cursor-not-allowed")}>
                  <div className={cn(
                    "bg-card rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between border-0",
                    "transform hover:-translate-y-1"
                  )}>
                    <div>
                      <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg mb-3", action.iconBg, action.iconTextColor)}>
                        <action.IconEl className="w-5 h-5" />
                      </div>
                      <h3 className="font-medium text-foreground text-sm">{action.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{action.description}</p>
                    </div>
                    {action.disabled && <div className="mt-2 text-xs text-destructive font-medium">Coming Soon</div>}
                  </div>
                </a>
              </Link>
            ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer specific to this dashboard */}
      <footer className="bg-card border-t border-border/20 mt-auto">
          <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="text-xs text-muted-foreground text-center md:text-left">
                      © {new Date().getFullYear()} Tutorzila. All rights reserved.
                  </div>
                  <div className="flex items-center justify-center md:justify-end gap-4 md:gap-6">
                      <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</Link>
                      <Link href="/terms-and-conditions" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</Link>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
}

