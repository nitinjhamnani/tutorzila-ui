// src/app/dashboard/tutor/page.tsx
"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { User, TutorProfile } from "@/types"; // Assuming TutorProfile extends User
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell, Settings, Crown, Share2, CheckCircle, UserPlus, UploadCloud, Palette,
  Link as LinkIcon, ArrowRight, User, MessageSquare, Percent, Clock, ShoppingBag,
  HardDrive, ArrowUp, ArrowDown, ChevronDown, LayoutGrid, Info, Ruler, Filter,
  Image as ImageIcon, BookOpen as BookOpenIcon, Globe as GlobeIcon,
  FileText, LifeBuoy, UserCog, BarChart2, Settings2 as Settings2Icon,
  Eye, Camera, MailCheck, PhoneCall, CheckCircle2, Briefcase, CalendarDays, RadioTower, Presentation, Star,
  Users as UsersIcon // Alias for clarity if Users is also a component name
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import logoAsset from '@/assets/images/logo.png'; // Ensure this path is correct


// This pagePrimaryColor was specific to the snippet, will be replaced by app's theme
// const pagePrimaryColor = '#4F46E5'; // Indigo color from the snippet
// const pageSecondaryColor = '#f59e0b'; // Amber color from the snippet

export default function TutorDashboardPage() {
  const { user, isAuthenticated } = useAuthMock();
  const tutorUser = user as TutorProfile | null; // Cast to TutorProfile if you have specific tutor fields
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [mockDaysLeft, setMockDaysLeft] = useState(0);

  useEffect(() => {
    setIsClient(true);
    // Generate mockDaysLeft only on client-side after mount
    setMockDaysLeft(Math.floor(Math.random() * 60) + 30);
  }, []);

  useEffect(() => {
    if (tutorUser && isClient) {
      let completedFields = 0;
      const totalFields = 5; // Example: avatar, subjects, experience, hourlyRate, qualifications
      if (tutorUser.avatar && !tutorUser.avatar.includes('pravatar.cc') && !tutorUser.avatar.includes('avatar.vercel.sh')) completedFields++;
      if (tutorUser.subjects && tutorUser.subjects.length > 0) completedFields++;
      if (tutorUser.experience && tutorUser.experience.trim() !== "") completedFields++;
      if (tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== "") completedFields++;
      if (tutorUser.qualifications && tutorUser.qualifications.length > 0) completedFields++;
      setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
    }
  }, [tutorUser, isClient]);


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
      // Here, you'd typically upload the file and update the user's avatar URL
    }
  };

  const dashboardMetrics = [
    { title: "Total Enquiries", value: "15", trend: "2 new", IconEl: Briefcase, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Active Classes", value: "5", trend: "1 upcoming", IconEl: CalendarDays, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Demos Completed", value: "12", trend: "85%", IconEl: CheckCircle2, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Avg. Rating", value: tutorUser.rating?.toFixed(1) || "N/A", trend: "+0.1", IconEl: Star, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Earnings", value: `₹${(Math.random() * 20000 + 5000).toFixed(0)}`, trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Profile Views", value: String(Math.floor(Math.random() * 300) + 50), trend: "5.1%", IconEl: Eye, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
  ];

  const quickActions = [
     { title: "My Enquiries", description: "View and respond to tuition requests.", IconEl: Briefcase, iconBg: "bg-primary/10", iconTextColor: "text-primary", href:"/dashboard/enquiries" },
     { title: "My Classes", description: "Manage your scheduled classes.", IconEl: CalendarDays, iconBg: "bg-primary/10", iconTextColor: "text-primary", href:"/dashboard/my-classes" },
     { title: "Edit Profile", description: "Update your personal & tutoring details.", IconEl: UserCog, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: "/dashboard/tutor/edit-personal-details" },
     { title: "My Payments", description: "Track your earnings and payouts.", IconEl: DollarSign, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: "/dashboard/payments" },
     { title: "Demo Sessions", description: "Schedule and manage demo classes.", IconEl: Presentation, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: "/dashboard/demo-sessions" },
     { title: "View Public Profile", description: "See how your profile looks to parents.", IconEl: Eye, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: `/tutors/${tutorUser.id}` },
     { title: "Support", description: "Get help from our support team.", IconEl: LifeBuoy, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: "#" },
     { title: "Settings", description: "Adjust your account preferences.", IconEl: Settings2Icon, iconBg: "bg-primary/10", iconTextColor: "text-primary", href: "/dashboard/settings" },
  ];


  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Welcome Section */}
          <div className="bg-card rounded-xl shadow-sm p-6 md:p-8 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/20 shadow-sm">
                    <AvatarImage src={tutorUser.avatar || `https://avatar.vercel.sh/${tutorUser.email}.png`} alt={tutorUser.name} />
                    <AvatarFallback className="text-xl md:text-2xl bg-primary/10 text-primary font-semibold">
                      {tutorUser.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handleAvatarUploadClick}
                    className={cn(
                      "absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 flex items-center justify-center p-1.5 rounded-full cursor-pointer shadow-md transition-colors",
                      "bg-primary/20 text-primary hover:bg-primary/30" // Using app's primary color
                    )}
                    aria-label="Update profile picture"
                  >
                    <Camera className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">Welcome back to your dashboard</p>
                  
                  <div className="mt-4">
                      <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-gray-600">Setup progress</span>
                          <span className="text-sm font-medium text-primary">{completionPercentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                      </div>
                      {completionPercentage < 100 && (
                      <Link href="/dashboard/tutor/edit-personal-details" className="mt-2.5 text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                          Complete Your Profile <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0">
                <div className="bg-gray-50 rounded-lg p-4 w-full sm:w-auto">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Current Plan</p>
                      <p className="font-semibold text-gray-800">Business Pro</p>
                      <p className="text-xs text-gray-500 mt-1">Expires on April 28, 2025</p>
                    </div>
                    <div className={cn("w-8 h-8 flex items-center justify-center rounded bg-primary/10 text-primary")}>
                        <Crown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button className={cn("text-white px-4 py-2 rounded-button whitespace-nowrap transition-colors w-full xs:w-auto text-sm font-medium", "bg-primary hover:bg-primary/90")}>
                        Upgrade Plan
                    </Button>
                    <Button variant="outline" className="bg-card border border-gray-200 text-gray-700 px-4 py-2 rounded-button whitespace-nowrap hover:bg-gray-50 transition-colors flex items-center gap-2 w-full xs:w-auto text-sm font-medium">
                        <Share2 className="w-4 h-4" />
                        Share Link
                    </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
            {dashboardMetrics.map((metric, index) => (
              <div key={index} className="bg-card rounded-xl shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{metric.title}</p>
                    <h3 className={cn("text-lg sm:text-xl font-semibold text-gray-800 mt-1")}>{metric.value}</h3>
                    {metric.trend && (
                      <div className={cn("flex items-center mt-0.5 text-xs", metric.trendColor)}>
                        {metric.TrendIconEl && <metric.TrendIconEl className="w-3.5 h-3.5" />}
                        <span className="font-medium ml-0.5">{metric.trend}</span>
                        <span className="text-muted-foreground ml-1 text-[10px]">from last month</span>
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
          
          {/* Chart Placeholders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
            <div className="bg-card rounded-xl shadow-sm p-5 lg:col-span-2">
              <h2 className="text-md md:text-lg font-semibold text-gray-800 mb-4">Monthly User Sessions (Placeholder)</h2>
              <div id="monthly-sessions-chart" className="w-full h-[250px] md:h-[300px] bg-gray-100 rounded flex items-center justify-center text-muted-foreground">Chart Area</div>
            </div>
            <div className="bg-card rounded-xl shadow-sm p-5">
              <h2 className="text-md md:text-lg font-semibold text-gray-800 mb-4">Traffic Sources (Placeholder)</h2>
              <div id="traffic-sources-chart" className="w-full h-[250px] md:h-[300px] bg-gray-100 rounded flex items-center justify-center text-muted-foreground">Chart Area</div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-sm p-5 mb-6 md:mb-8">
            <h2 className="text-md md:text-lg font-semibold text-gray-800 mb-4">Catalogue Usage Statistics (Placeholder)</h2>
            <div id="catalogue-usage-chart" className="w-full h-[300px] md:h-[350px] bg-gray-100 rounded flex items-center justify-center text-muted-foreground">Chart Area</div>
          </div>

          {/* Feature Access / Quick Actions */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 md:mb-5">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href || "#"} className="block">
                  <div className={cn("bg-card rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between")}>
                    <div>
                      <div className={cn("w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg mb-3 md:mb-4", action.iconBg, action.iconTextColor)}>
                        <action.IconEl className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h3 className="font-medium text-gray-800 text-sm">{action.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
