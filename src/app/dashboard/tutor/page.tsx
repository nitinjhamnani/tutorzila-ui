
// src/app/dashboard/tutor/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { TutorProfile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Bell,
  Settings,
  UserCircle,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  DollarSign,
  Eye,
  LayoutGrid,
  Info,
  Ruler,
  Filter,
  UploadCloud,
  Crown,
  Share2,
  CheckCircle,
  Link as LinkIcon,
  Palette,
  BookOpen as BookOpenIcon,
  Globe as GlobeIcon,
  MessageSquare,
  Percent,
  Clock,
  ShoppingBag,
  HardDrive,
  User as UserIconLucide,
  ArrowRight,
  BarChart2,
  Settings2 as Settings2Icon,
  Star,
  UserCog,
  ClipboardEdit,
  Users,
  CalendarDays,
  Home,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useToast } from "@/hooks/use-toast";


// Define a consistent primary color from the snippet for this dashboard
const pagePrimaryColor = "#4f46e5"; // Primary color from the snippet
const snippetSecondaryTextColor = "#6B7280"; // Secondary text color from the snippet

export default function TutorDashboardPage() {
  const { user } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    if (tutorUser) {
      let completedFields = 0;
      const totalFields = 5; // Example: bio, subjects, experience, hourlyRate, qualifications

      if (tutorUser.bio && tutorUser.bio.trim() !== "") completedFields++;
      if (tutorUser.subjects && tutorUser.subjects.length > 0) completedFields++;
      if (tutorUser.experience && tutorUser.experience.trim() !== "") completedFields++;
      if (tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== "") completedFields++;
      if (tutorUser.qualifications && tutorUser.qualifications.length > 0) completedFields++;
      
      setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
    }
  }, [tutorUser]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      toast({
        title: "Profile Picture Updated (Mock)",
        description: `${file.name} selected. In a real app, this would be uploaded.`,
      });
      // Here, you'd typically upload the file and update the user's avatar URL
    }
  };

  if (!tutorUser) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading tutor data or not authorized...</p></div>;
  }
  
  const dashboardMetrics = [
      { title: "Total Enquiries", value: "150", trend: "10.2%", IconEl: MessageSquare, iconBg: "bg-blue-50", iconColor: pagePrimaryColor, trendColor: "text-green-600", TrendIconEl: ArrowUp },
      { title: "Active Classes", value: "3", trend: "1 new", IconEl: Users, iconBg: "bg-blue-50", iconColor: pagePrimaryColor, trendColor: "text-green-600", TrendIconEl: ArrowUp },
      { title: "Demos Completed", value: "7", trend: "1.0%", IconEl: CheckCircle2, iconBg: "bg-green-50", iconColor: "text-green-600", trendColor: "text-red-500", TrendIconEl: ArrowDown },
      { title: "Avg. Rating", value: "4.7", trend: "+0.2", IconEl: Star, iconBg: "bg-yellow-50", iconColor: "text-yellow-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
      { title: "Total Earnings", value: "₹12.5k", trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
      { title: "Profile Views", value: "289", trend: "5.1%", IconEl: Eye, iconBg: "bg-teal-50", iconColor: "text-teal-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    ];

  const quickSetupSteps = [
    { title: "Verify Account", description: "Confirm email & phone", IconEl: UserCog, buttonText: "Verify Now", href: "/dashboard/my-account", completed: !!(tutorUser.isEmailVerified && tutorUser.isPhoneVerified) },
    { title: "Update Profile", description: "Add personal & tutoring details", IconEl: ClipboardEdit, buttonText: "Edit Profile", href: "/dashboard/tutor/edit-personal-details", completed: completionPercentage > 50 },
    { title: "Set Availability", description: "Define your schedule", IconEl: CalendarDays, buttonText: "Set Schedule", href: "/dashboard/tutor/edit-tutoring-details", completed: !!(tutorUser.preferredDays && tutorUser.preferredDays.length > 0) },
    { title: "View Enquiries", description: "Find student requests", IconEl: Eye, buttonText: "Browse Enquiries", href: "/dashboard/enquiries", completed: false }, // Example 'not completed'
  ];

  const quickActions = [
     { title: "My Enquiries", description: "View and respond to tuition requests.", IconEl: MessageSquare, iconBg: "bg-blue-50", iconTextColor: pagePrimaryColor, href:"/dashboard/enquiries" },
     { title: "Scheduled Classes", description: "Manage your upcoming and past classes.", IconEl: CalendarDays, iconBg: "bg-purple-50", iconTextColor: "text-purple-600", href:"/dashboard/my-classes" },
     { title: "Demo Sessions", description: "Organize and conduct demo sessions.", IconEl: CheckCircle2, iconBg: "bg-green-50", iconTextColor: "text-green-600", href: "/dashboard/demo-sessions" },
     { title: "Profile Settings", description: "Update your personal and tutoring details.", IconEl: UserCog, iconBg: "bg-orange-50", iconTextColor: "text-orange-500", href: "/dashboard/my-account" },
     { title: "Payment History", description: "Track your earnings and payment status.", IconEl: DollarSign, iconBg: "bg-red-50", iconTextColor: "text-red-500", href: "/dashboard/payments" },
     { title: "Help & Support", description: "Get assistance or report an issue.", IconEl: Info, iconBg: "bg-indigo-50", iconTextColor: "text-indigo-600", href: "/faq" },
     { title: "Platform Analytics", description: "View your performance metrics (coming soon).", IconEl: BarChart2, iconBg: "bg-teal-50", iconTextColor: "text-teal-600", href: "#" },
     { title: "Account Settings", description: "Manage your account preferences.", IconEl: Settings2Icon, iconBg: "bg-yellow-50", iconTextColor: "text-yellow-600", href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section - Snippet Style */}
      <header className="bg-card shadow-sm border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                 <Image src={logoAsset} alt="Tutorzila Logo" width={150} height={40} className="h-10 w-auto mr-2" priority />
              </Link>
              <span className="text-muted-foreground text-sm mx-2">|</span>
              <span className="text-muted-foreground text-sm font-medium">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-primary/30">
                   <AvatarImage src={tutorUser.avatar || `https://avatar.vercel.sh/${tutorUser.email}.png`} alt={tutorUser.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {tutorUser.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-foreground hidden sm:inline">{tutorUser.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Adapted from Snippet */}
      <main className="flex-grow bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Welcome Section */}
          <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8 border-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-foreground">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                <p style={{ color: snippetSecondaryTextColor }} className="text-sm mt-1">Welcome back to your dashboard</p>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Profile Completion</span>
                    <span className="text-xs font-medium" style={{ color: pagePrimaryColor }}>{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2 rounded-full" 
                   indicatorClassName={cn("rounded-full", completionPercentage === 100 ? "bg-green-500" : "bg-[#4F46E5]")}  
                  />
                   <Link href="/dashboard/tutor/edit-personal-details" className="mt-2 inline-block text-xs font-medium hover:underline" style={{ color: pagePrimaryColor }}>
                        Complete Your Profile <ArrowRight className="inline h-3 w-3" />
                    </Link>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <div className="bg-gray-100 rounded-lg p-4 min-w-[180px] text-center sm:text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs" style={{ color: snippetSecondaryTextColor }}>Current Plan</p>
                      <p className="font-semibold text-sm text-foreground">Business Pro</p>
                      <p className="text-[10px]" style={{ color: snippetSecondaryTextColor }}>Expires on April 28, 2025</p>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-md text-sm" style={{ color: pagePrimaryColor }}>
                      <Crown className="h-4 w-4"/>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button className="text-xs px-3 py-1.5 h-auto whitespace-nowrap" style={{ backgroundColor: pagePrimaryColor, color: 'white', borderRadius: 'var(--radius-button)' }}>
                    Upgrade Plan
                  </Button>
                  <Button variant="outline" className="text-xs px-3 py-1.5 h-auto border-gray-300 hover:bg-gray-100 whitespace-nowrap flex items-center gap-1.5" style={{ borderRadius: 'var(--radius-button)' }}>
                    <Share2 className="h-3 w-3" />
                    Share Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Setup Guide */}
          <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg font-semibold text-foreground">Quick Setup Guide</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {quickSetupSteps.filter(s => s.completed).length} of {quickSetupSteps.length} completed
                </span>
                <div className="w-5 h-5 flex items-center justify-center rounded-full text-sm" style={{ backgroundColor: `${pagePrimaryColor}1A`, color: pagePrimaryColor }}> {/* primary/10 */}
                  <CheckCircle className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickSetupSteps.map((step, index) => (
                <div key={index} className={cn("border rounded-lg p-4 relative transition-all duration-200 hover:shadow-md", step.completed ? "border-green-200 bg-green-50" : "border-gray-200 bg-card hover:bg-gray-50")}>
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 flex items-center justify-center">
                    {step.completed ? <CheckCircle2 className="text-green-600 h-4 w-4" /> : <Clock className="text-gray-400 h-4 w-4" />}
                  </div>
                  <div className={cn("w-8 h-8 flex items-center justify-center rounded-full mb-2.5", step.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600")}>
                    <step.IconEl className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium text-sm text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 h-8 line-clamp-2">{step.description}</p>
                  <Button asChild variant="link" size="sm" className="mt-3 text-xs p-0 h-auto font-medium whitespace-nowrap" style={{ color: pagePrimaryColor }}>
                    <Link href={step.href}>
                      {step.buttonText} <ArrowRight className="inline h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {dashboardMetrics.map((metric, index) => (
              <div key={index} className="bg-card rounded-xl shadow-lg p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs" style={{ color: snippetSecondaryTextColor }}>{metric.title}</p>
                    <h3 className="text-xl font-semibold text-foreground mt-0.5">{metric.value}</h3>
                    <div className="flex items-center mt-1 text-[10px]">
                      <metric.TrendIconEl className={cn("h-3 w-3", metric.trendColor)} />
                      <span className={cn("font-medium ml-0.5", metric.trendColor)}>{metric.trend}</span>
                      <span className="text-muted-foreground ml-1">from last month</span>
                    </div>
                  </div>
                  <div className={cn("w-8 h-8 flex items-center justify-center rounded-md text-sm", metric.iconBg)} style={{ color: metric.iconColor }}>
                    <metric.IconEl className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Charts - Placeholders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="bg-card rounded-xl shadow-lg p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Monthly User Sessions</h2>
                <Button variant="outline" size="sm" className="text-xs h-7 px-2 border-gray-300 hover:bg-gray-100">
                  Last 6 Months <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <div id="monthly-sessions-chart" className="w-full h-[250px] bg-gray-50 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Monthly Sessions</div>
            </div>
            <div className="bg-card rounded-xl shadow-lg p-5">
              <h2 className="text-base font-semibold text-foreground mb-4">Traffic Sources</h2>
              <div id="traffic-sources-chart" className="w-full h-[250px] bg-gray-50 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Traffic Sources</div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-lg p-5 mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">Catalogue Usage Statistics</h2>
               <div className="px-0.5 py-0.5 bg-gray-100 rounded-full flex items-center text-xs">
                <Button variant="ghost" size="sm" className="px-2.5 py-1 h-auto bg-card text-foreground rounded-full shadow-sm whitespace-nowrap text-[10px]">Monthly</Button>
                <Button variant="ghost" size="sm" className="px-2.5 py-1 h-auto text-muted-foreground rounded-full whitespace-nowrap text-[10px]">Weekly</Button>
              </div>
            </div>
            <div id="catalogue-usage-chart" className="w-full h-[300px] bg-gray-50 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Catalogue Usage</div>
          </div>
          
          {/* Quick Actions */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 md:mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href || "#"} className="block">
                  <div className="bg-card rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col justify-between transform hover:-translate-y-1">
                    <div>
                      <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg mb-3", action.iconBg)}>
                        <action.IconEl className="h-5 w-5" style={{ color: action.iconTextColor }} />
                      </div>
                      <h3 className="font-medium text-sm text-foreground">{action.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer - Snippet Style */}
      <footer className="bg-card border-t border-border/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-center md:text-left">
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Tutorzila. All rights reserved. v1.0.0
            </div>
            <div className="flex items-center justify-center md:justify-end gap-4">
              <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</Link>
              <Link href="/faq" className="text-xs text-muted-foreground hover:text-primary">Help Center</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

