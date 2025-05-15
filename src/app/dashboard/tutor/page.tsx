
"use client";

import {
  Bell,
  Settings as SettingsIcon,
  User,
  LayoutGrid,
  Info,
  CheckCircle2,
  Camera,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Eye,
  Star,
  Briefcase,
  CalendarDays,
  RadioTower,
  Presentation,
  LifeBuoy,
  UserCog,
  Settings2 as Settings2Icon,
  BarChart2,
  FileText,
  UploadCloud,
  Palette,
  Link as LinkIcon,
  BookOpen as BookOpenIcon,
  Globe as GlobeIcon,
  Percent,
  Clock,
  ShoppingBag,
  HardDrive,
  ChevronDown,
  Ruler,
  Filter,
  UsersRoundIcon,
  Share2, // Added from snippet
  CheckCircle as CheckCircleFill, // For ri-checkbox-circle-fill
  Users as UsersLucide, // For ri-user-line
  MessageSquare as Message3Line, // For ri-message-3-line
  HelpCircle as QuestionLine, // Placeholder for ri-time-line (pending)
  Image as ImageIconLucide, // For ri-image-line
  BookOpen, // For ri-book-open-line
  Globe, // For ri-global-line
  ClipboardList, // For ri-file-list-3-line
  Headphones, // For ri-customer-service-2-line
  UserCircle2, // For ri-user-settings-line (UserCog is already used)
  BarChartBig, // For ri-bar-chart-grouped-line
  Settings, // For ri-settings-5-line
  ArrowRight, // For ri-arrow-right-line
  ArrowDownSLine, // Placeholder for ri-arrow-down-s-line

} from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { TutorProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image"; // Next.js Image
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import logoAsset from '@/assets/images/logo.png'; // Assuming this is your app's logo

export default function TutorDashboardPage() {
  const { user, isAuthenticated } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isClient, setIsClient] = useState(false);
  const [mockDaysLeft, setMockDaysLeft] = useState(45);
  const [completionPercentage, setCompletionPercentage] = useState(75);

  useEffect(() => {
    setIsClient(true);
    // Mock data initialization
    // setMockDaysLeft(Math.floor(Math.random() * 60) + 10);

    if (tutorUser) {
      let completedFields = 0;
      const totalFields = 5; 
      if (tutorUser.avatar && !tutorUser.avatar.includes('pravatar.cc') && !tutorUser.avatar.includes('avatar.vercel.sh')) completedFields++;
      if (tutorUser.subjects && tutorUser.subjects.length > 0) completedFields++;
      if (tutorUser.bio && tutorUser.bio.trim() !== "") completedFields++;
      if (tutorUser.experience && tutorUser.experience.trim() !== "") completedFields++;
      if (tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== "") completedFields++;
      // setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
    }
  }, [tutorUser]);

  if (!isClient || !isAuthenticated || !tutorUser || tutorUser.role !== 'tutor') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-muted-foreground">Loading dashboard or not authorized...</p>
      </div>
    );
  }

  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("New avatar selected:", file.name);
      toast({
        title: "Avatar Update (Mock)",
        description: `${file.name} selected. In a real app, this would upload.`,
      });
    }
  };
  
  const quickSetupSteps = [
    { title: "Create Account", description: "Your account is ready to use", IconEl: UserPlus, buttonText: "View Profile", completed: true, href: "/dashboard/my-account" },
    { title: "Upload Products", description: "12 products uploaded", IconEl: UploadCloud, buttonText: "Add More", completed: true, href: "#" },
    { title: "Create Design", description: "3 designs created", IconEl: Palette, buttonText: "Edit Designs", completed: true, href: "#" },
    { title: "Connect Website", description: "Link your website to publish", IconEl: LinkIcon, buttonText: "Start Now", completed: false, href: "#" },
  ];

  const dashboardMetrics = [
    { title: "Total Enquiries", value: "3,287", trend: "12.5%", IconEl: Briefcase, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Active Classes", value: "144", trend: "8.2%", IconEl: CalendarDays, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Conversion Rate", value: "3.6%", trend: "1.8%", IconEl: Percent, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-red-500", TrendIconEl: ArrowDown },
    { title: "Avg. Rating", value: tutorUser.rating?.toFixed(1) || "N/A", trend: "+0.2", IconEl: Star, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Earnings", value: `₹${(Math.random() * 20000 + 5000).toFixed(0)}`, trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Profile Views", value: String(Math.floor(Math.random() * 300) + 50), trend: "5.1%", IconEl: Eye, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
  ];

  const quickActions = [
     { title: "My Enquiries", description: "View and respond to tuition requests.", IconEl: Briefcase, href:"/dashboard/enquiries" },
     { title: "My Classes", description: "Manage your scheduled classes.", IconEl: CalendarDays, href:"/dashboard/my-classes" },
     { title: "Edit Profile", description: "Update personal & tutoring details.", IconEl: UserCog, href: "/dashboard/tutor/edit-personal-details" },
     { title: "My Payments", description: "Track your earnings and payouts.", IconEl: DollarSign, href: "/dashboard/payments" },
     { title: "Demo Sessions", description: "Schedule and manage demo classes.", IconEl: RadioTower, href: "/dashboard/demo-sessions" },
     { title: "View Public Profile", description: "See how your profile looks to parents.", IconEl: Eye, href: `/tutors/${tutorUser.id}` },
     { title: "Support", description: "Get help from our support team.", IconEl: LifeBuoy, href: "#" },
     { title: "Settings", description: "Adjust your account preferences.", IconEl: Settings2Icon, href: "/dashboard/settings" },
  ];


  // Colors from the snippet, to be overridden by theme where appropriate or used directly for snippet-specific elements
  const pagePrimaryColor = "#4F46E5"; // Primary from snippet's tailwind.config
  const pageSecondaryTextColor = "#6B7280"; // Secondary from snippet's tailwind.config

  return (
    <div className="min-h-screen flex flex-col"> {/* Outer container from snippet body */}
      {/* Header Section from snippet */}
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                 <Image src={logoAsset} alt="Tutorzila Logo" width={120} height={32} className="h-8 w-auto mr-2" priority />
              </Link>
              <span className="text-muted-foreground text-sm mx-2">|</span>
              <span className="text-muted-foreground text-sm font-medium">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <SettingsIcon className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={tutorUser.avatar || `https://avatar.vercel.sh/${tutorUser.email}.png`} alt={tutorUser.name} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                    {tutorUser.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-foreground">{tutorUser.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Welcome Section */}
          <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8 border-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">Hello, {tutorUser.name} 👋</h1>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1">Welcome back to your dashboard</p>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-muted-foreground">Setup progress</span>
                    <span className="text-sm font-semibold" style={{color: pagePrimaryColor}}>{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2 rounded-full" indicatorClassName={`bg-[${pagePrimaryColor}] rounded-full`} />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mt-4 md:mt-0 shrink-0">
                <div className="bg-gray-100 rounded-lg p-3 md:p-4 min-w-[180px] sm:min-w-[200px] w-full sm:w-auto">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Current Plan</p>
                      <p className="font-semibold text-gray-800 text-sm">Business Pro</p> {/* Mock data */}
                      <p className="text-[10px] text-gray-500 mt-0.5">Expires on April 28, 2025</p> {/* Mock data */}
                    </div>
                    <div className={cn("w-7 h-7 flex items-center justify-center rounded-md", `bg-[${pagePrimaryColor}]/10 text-[${pagePrimaryColor}]`)}>
                        <Crown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                  <Button className={cn("text-white px-3 py-2 text-xs font-medium !rounded-button whitespace-nowrap w-full xs:w-auto", `bg-[${pagePrimaryColor}] hover:bg-[${pagePrimaryColor}]/90`)}>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {dashboardMetrics.map((metric, index) => (
              <div key={index} className="bg-card rounded-xl shadow-lg p-5 border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{metric.title}</p>
                    <h3 className={cn("text-xl md:text-2xl font-semibold mt-1", metric.iconColor)}>{metric.value}</h3>
                    {metric.trend && (
                    <div className={cn("flex items-center mt-0.5 text-xs font-medium", metric.trendColor)}>
                        {metric.TrendIconEl && <metric.TrendIconEl className="w-3.5 h-3.5" />}
                        <span className="ml-0.5">{metric.trend}</span>
                    </div>
                    )}
                  </div>
                  <div className={cn("w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-sm shrink-0", metric.iconBg, metric.iconColor)}>
                    <metric.IconEl className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Placeholder for Charts - as per previous implementation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
            <div className="bg-card rounded-xl shadow-lg p-5 lg:col-span-2 border-0">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base md:text-lg font-semibold text-foreground">Monthly User Sessions</h2>
                    {/* Placeholder for dropdown */}
                </div>
                <div id="monthly-sessions-chart" className="w-full h-[250px] md:h-[300px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded-md">Chart: Monthly Sessions</div>
            </div>
            <div className="bg-card rounded-xl shadow-lg p-5 border-0">
                <h2 className="text-base md:text-lg font-semibold text-foreground mb-6">Traffic Sources</h2>
                <div id="traffic-sources-chart" className="w-full h-[250px] md:h-[300px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded-md">Chart: Traffic Sources</div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-lg p-5 mb-6 md:mb-8 border-0">
              <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base md:text-lg font-semibold text-foreground">Catalogue Usage Statistics</h2>
                  {/* Placeholder for tabs */}
              </div>
              <div id="catalogue-usage-chart" className="w-full h-[300px] md:h-[350px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded-md">Chart: Catalogue Usage</div>
          </div>
          
          {/* Quick Actions */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-5 md:mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {quickActions.map((action, index) => (
                <Link key={index} href={action.href || "#"} className="block">
                  <div className={cn("bg-card rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col justify-between border-0")}>
                    <div>
                      <div className={cn("w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg mb-3 md:mb-4", "bg-primary/10 text-primary")}>
                          <action.IconEl className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h3 className="font-medium text-foreground text-sm">{action.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{action.description}</p>
                    </div>
                  </div>
                </Link>
            ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer from snippet */}
      <footer className="bg-card border-t border-border/20 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
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

