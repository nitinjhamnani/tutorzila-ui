
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
  LayoutGrid,
  Info,
  Camera,
  Share2,
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
  Crown
} from "lucide-react";
import logoAsset from '@/assets/images/logo.png';

// Define a primary color variable based on the snippet for this page
const pagePrimaryColor = '#4F46E5'; // Blue from the snippet
const pageSecondaryTextColor = '#6B7280'; // Gray for secondary text

export default function TutorDashboardPage() {
  const { user, isAuthenticated } = useAuthMock();
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null;
  const [isClient, setIsClient] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [mockDaysLeft, setMockDaysLeft] = useState(0);

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

  const handleCopyKey = () => {
    toast({ title: "API Key Copied (Mock)", description: "The API key would be copied to your clipboard." });
  };

  if (!isClient) {
    return <div className="flex min-h-screen items-center justify-center p-4"><p className="text-muted-foreground">Loading dashboard...</p></div>;
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
     { title: "My Enquiries", description: "View and respond to tuition requests.", IconEl: Briefcase, href:"/dashboard/enquiries", iconBg: "bg-primary/10", iconTextColor: "text-primary" },
     { title: "My Classes", description: "Manage your scheduled classes.", IconEl: CalendarDays, href:"/dashboard/my-classes", iconBg: "bg-primary/10", iconTextColor: "text-primary" },
     { title: "Edit Profile", description: "Update personal & tutoring details.", IconEl: UserCog, href: "/dashboard/tutor/edit-personal-details", iconBg: "bg-primary/10", iconTextColor: "text-primary" },
     { title: "My Payments", description: "Track your earnings and payouts.", IconEl: DollarSign, href: "/dashboard/payments", iconBg: "bg-primary/10", iconTextColor: "text-primary" },
     { title: "Demo Sessions", description: "Schedule and manage demo classes.", IconEl: RadioTower, href: "/dashboard/demo-sessions", iconBg: "bg-primary/10", iconTextColor: "text-primary" },
     { title: "View Public Profile", description: "See how your profile looks to parents.", IconEl: Eye, href: `/tutors/${tutorUser.id}`, iconBg: "bg-primary/10", iconTextColor: "text-primary" },
     { title: "Support", description: "Get help from our support team.", IconEl: LifeBuoy, href: "#", disabled: true, iconBg: "bg-primary/10", iconTextColor: "text-primary" },
     { title: "Settings", description: "Adjust your account preferences.", IconEl: Settings2Icon, href: "/dashboard/settings", disabled: true, iconBg: "bg-primary/10", iconTextColor: "text-primary" },
  ];


  return (
    <div className="min-h-screen flex flex-col"> {/* Root div as per snippet */}
        {/* Main Content */}
        <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                {/* Welcome Section */}
                <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8">
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
                                    className={cn("absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 flex items-center justify-center text-white p-1.5 rounded-full cursor-pointer shadow-md transition-colors", `bg-primary hover:bg-primary/90`)}
                                    aria-label="Update profile picture"
                                >
                                    <Camera className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary-foreground" />
                                </button>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold text-foreground">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                                <p className={`text-xs sm:text-sm mt-1`} style={{color: pageSecondaryTextColor}}>Welcome back to your dashboard</p>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs sm:text-sm" style={{color: pageSecondaryTextColor}}>Profile progress</span>
                                        <span className="text-xs sm:text-sm font-medium text-primary">{completionPercentage}%</span>
                                    </div>
                                    <Progress value={completionPercentage} className="h-2 rounded-full bg-gray-100" indicatorClassName={`bg-primary rounded-full`} />
                                     <Link href="/dashboard/tutor/edit-personal-details" className="mt-2 text-xs text-primary hover:underline font-medium">
                                        Complete Your Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-0">
                            <div className="bg-gray-50 rounded-lg p-4 w-full sm:min-w-[220px] border border-border/30">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm" style={{color: pageSecondaryTextColor}}>Current Plan</p>
                                        <p className="font-semibold text-foreground text-base">Business Pro</p>
                                        <p className="text-xs mt-1" style={{color: pageSecondaryTextColor}}>Expires on April 28, 2025</p>
                                    </div>
                                    <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-sm", `bg-primary/10 text-primary`)}>
                                        <Crown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
                                <Button className={cn("text-white px-3 py-2 text-xs font-medium !rounded-button whitespace-nowrap w-full xs:w-auto", `bg-primary hover:bg-primary/90`)}>
                                    Upgrade Plan
                                </Button>
                                <Button variant="outline" className={cn("border-gray-300 text-gray-700 px-3 py-2 !rounded-button whitespace-nowrap hover:bg-gray-100 flex items-center gap-1.5 text-xs font-medium w-full xs:w-auto", "bg-card")}>
                                    <Share2 className="w-3.5 h-3.5" />
                                    Share Link
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Dashboard Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
                    {dashboardMetrics.map((metric, index) => (
                        <div key={index} className="bg-card rounded-xl shadow-lg p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{metric.title}</p>
                                    <h3 className={cn("text-xl sm:text-2xl font-semibold mt-1", metric.iconColor || `text-primary`)}>{metric.value}</h3>
                                    {metric.trend && (
                                    <div className={cn("flex items-center mt-0.5 text-xs font-medium", metric.trendColor || "text-green-600")}>
                                        {metric.TrendIconEl && <metric.TrendIconEl className="w-3.5 h-3.5" />}
                                        <span className="ml-0.5">{metric.trend}</span>
                                    </div>
                                    )}
                                </div>
                                <div className={cn("w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-sm shrink-0", metric.iconBg || `bg-primary/10`, metric.iconColor || `text-primary` )}>
                                    <metric.IconEl className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Placeholder for Charts - Keep if needed, or remove if not part of immediate scope */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-lg p-5 lg:col-span-2">
                        <h2 className="text-base md:text-lg font-semibold text-foreground mb-4 md:mb-6">Monthly User Sessions (Placeholder)</h2>
                        <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center text-muted-foreground">Chart Area</div>
                    </div>
                    <div className="bg-card rounded-xl shadow-lg p-5">
                        <h2 className="text-base md:text-lg font-semibold text-foreground mb-4 md:mb-6">Traffic Sources (Placeholder)</h2>
                        <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center text-muted-foreground">Chart Area</div>
                    </div>
                </div>
                <div className="bg-card rounded-xl shadow-lg p-5 mb-8">
                    <h2 className="text-base md:text-lg font-semibold text-foreground mb-4 md:mb-6">Catalogue Usage Statistics (Placeholder)</h2>
                    <div className="w-full h-[350px] bg-gray-100 rounded-lg flex items-center justify-center text-muted-foreground">Chart Area</div>
                </div>
                
                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-base md:text-lg font-semibold text-foreground mb-5 md:mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {quickActions.map((action, index) => (
                        <Link key={index} href={action.disabled ? "#" : action.href || "#"} passHref legacyBehavior>
                           <a className={cn("block", action.disabled && "opacity-60 cursor-not-allowed")}>
                            <div className={cn("bg-card rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between")}>
                                <div>
                                    <div className={cn("w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg mb-3 md:mb-4", action.iconBg || `bg-primary/10`, action.iconTextColor || `text-primary`)}>
                                        <action.IconEl className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h3 className="font-medium text-foreground text-sm">{action.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{action.description}</p>
                                </div>
                                 {action.disabled && <div className="mt-2 text-xs text-destructive font-medium">Coming Soon</div>}
                            </div>
                           </a>
                        </Link>
                    ))}
                    </div>
                </div>
            </div> {/* Closing max-w-7xl container */}
        </main>
        
        {/* Footer specific to this dashboard */}
        <footer className="bg-card border-t border-border/20 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} Tutorzila Dashboard. All rights reserved.
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

