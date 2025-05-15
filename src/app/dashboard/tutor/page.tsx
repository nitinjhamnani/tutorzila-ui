
// src/app/dashboard/tutor/page.tsx
"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { TutorProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell, Settings, Crown, Share2, CheckCircle2, UserPlus, UploadCloud, Palette,
  Link as LinkIcon, ArrowRight, User, MessageSquare, Percent, Clock, ShoppingBag,
  HardDrive, ArrowUp, ArrowDown, ChevronDown, LayoutGrid, Info, Ruler, Filter,
  Image as ImageIcon, BookOpen as BookOpenIcon, Globe as GlobeIcon,
  FileText, LifeBuoy, UserCog, BarChart2, Settings2 as Settings2Icon,
  Eye, Camera, CheckCircle, DollarSign, Briefcase, CalendarDays, RadioTower, Presentation, NotebookPen, Star // Added Star
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import logoAsset from '@/assets/images/logo.png';


const snippetPrimaryColor = '#4F46E5';
const snippetPrimaryText = `text-[${snippetPrimaryColor}]`;
const snippetPrimaryBg = `bg-[${snippetPrimaryColor}]`;
const snippetPrimaryBgHover = `hover:bg-[${snippetPrimaryColor}]/90`; // Adjusted for hover

export default function TutorDashboardPage() {
  const { user, isAuthenticated } = useAuthMock();
  const tutorUser = user as TutorProfile | null; // Assuming 'user' is a TutorProfile
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [mockDaysLeft, setMockDaysLeft] = useState(0);


  useEffect(() => {
    setIsClient(true);
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

  const dashboardMetrics = [
    { title: "Total Enquiries", value: "15", trend: "2 new", IconEl: Briefcase, iconBg: "bg-blue-50", iconColor: snippetPrimaryText, trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Active Classes", value: "5", trend: "1 upcoming", IconEl: CalendarDays, iconBg: "bg-green-50", iconColor: "text-green-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Demos Completed", value: "12", trend: "85%", IconEl: CheckCircle2, iconBg: "bg-yellow-50", iconColor: "text-yellow-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Avg. Rating", value: tutorUser.rating?.toFixed(1) || "N/A", trend: "+0.1", IconEl: Star, iconBg: `bg-[${snippetPrimaryColor}]/10`, iconColor: snippetPrimaryText, trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Earnings", value: `₹${(Math.random() * 20000 + 5000).toFixed(0)}`, trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Profile Views", value: String(Math.floor(Math.random() * 300) + 50), trend: "5.1%", IconEl: Eye, iconBg: "bg-teal-50", iconColor: "text-teal-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
  ];

  const quickActions = [
     { title: "My Enquiries", description: "View and respond to tuition requests.", IconEl: Briefcase, iconBg: "bg-blue-50", iconTextColor: `text-[${snippetPrimaryColor}]`, href:"/dashboard/enquiries" },
     { title: "My Classes", description: "Manage your scheduled classes.", IconEl: CalendarDays, iconBg: "bg-purple-50", iconTextColor: "text-purple-600", href:"/dashboard/my-classes" },
     { title: "Edit Profile", description: "Update your personal & tutoring details.", IconEl: UserCog, iconBg: "bg-green-50", iconTextColor: "text-green-600", href: "/dashboard/tutor/edit-personal-details" },
     { title: "My Payments", description: "Track your earnings and payouts.", IconEl: DollarSign, iconBg: "bg-orange-50", iconTextColor: "text-orange-500", href: "/dashboard/payments" },
     { title: "Demo Sessions", description: "Schedule and manage demo classes.", IconEl: Presentation, iconBg: "bg-red-50", iconTextColor: "text-red-500", href: "/dashboard/demo-sessions" },
     { title: "View Public Profile", description: "See how your profile looks to parents.", IconEl: Eye, iconBg: "bg-indigo-50", iconTextColor: "text-indigo-600", href: `/tutors/${tutorUser.id}` },
     { title: "Support", description: "Get help from our support team.", IconEl: LifeBuoy, iconBg: "bg-teal-50", iconTextColor: "text-teal-600", href: "#" },
     { title: "Settings", description: "Adjust your account preferences.", IconEl: Settings2Icon, iconBg: "bg-yellow-50", iconTextColor: "text-yellow-600", href: "/dashboard/settings" },
  ];


  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate upload
      console.log("New avatar selected:", file.name);
      toast({
        title: "Avatar Update (Mock)",
        description: `${file.name} selected. In a real app, this would upload.`,
      });
      // Here you would typically handle the upload and update the user's avatar URL
      // For mock, we could update the user object in useAuthMock if it supported it
      // or just show a toast.
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Welcome Section */}
          <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-primary/20 shadow-sm">
                      <AvatarImage src={tutorUser.avatar || `https://avatar.vercel.sh/${tutorUser.email}.png`} alt={tutorUser.name} />
                      <AvatarFallback className="text-2xl md:text-3xl bg-primary/10 text-primary font-semibold">
                        {tutorUser.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                     <button
                        onClick={handleAvatarUploadClick}
                        className={cn(
                          "absolute -bottom-2 -right-2 flex items-center justify-center p-2 rounded-full cursor-pointer shadow-md transition-colors",
                          snippetPrimaryBg, // Use snippet's primary color
                          "text-white", // Assuming white icon for snippet's primary bg
                          `hover:${snippetPrimaryBgHover}`
                        )}
                        aria-label="Update profile picture"
                      >
                        <Camera className="w-4 h-4" />
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
                  <h1 className="text-xl md:text-2xl font-semibold text-foreground">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Welcome back to your dashboard</p>
                  
                  <div className="mt-4">
                      <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-muted-foreground">Setup progress</span>
                          <span className="text-sm font-bold" style={{ color: snippetPrimaryColor }}>{completionPercentage}%</span>
                      </div>
                      <Progress
                          value={completionPercentage}
                          className="h-2 rounded-full bg-gray-200" // snippet's bg-gray-100 equivalent
                          indicatorClassName={cn("rounded-full", snippetPrimaryBg)} // snippet's bg-primary
                      />
                       {completionPercentage < 100 && (
                        <Link href="/dashboard/tutor/edit-personal-details" className="mt-2.5 text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: snippetPrimaryColor }}>
                            Complete Your Profile <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0">
                <div className="bg-gray-100 rounded-lg p-4 w-full sm:min-w-[220px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Plan</p>
                      <p className="font-semibold text-foreground">Business Pro</p>
                      <p className="text-xs text-muted-foreground mt-1">Expires on April 28, 2025</p>
                    </div>
                    <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg", "bg-blue-100", snippetPrimaryText)}> {/* Matching snippet more closely */}
                        <Crown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
                    <Button className={cn("text-white px-4 py-2 rounded-button whitespace-nowrap transition-colors w-full xs:w-auto text-sm font-medium", snippetPrimaryBg, snippetPrimaryBgHover)}>
                        Upgrade Plan
                    </Button>
                    <Button variant="outline" className="bg-card border border-gray-300 text-gray-700 px-4 py-2 rounded-button whitespace-nowrap hover:bg-gray-100 transition-colors flex items-center gap-2 w-full xs:w-auto text-sm font-medium">
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
              <div key={index} className="bg-card rounded-xl shadow-lg p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{metric.title}</p>
                    <h3 className={cn("text-xl sm:text-2xl font-semibold text-foreground mt-1")}>{metric.value}</h3>
                    {metric.trend && (
                      <div className={cn("flex items-center mt-0.5 text-xs", metric.trendColor)}>
                        {metric.TrendIconEl && <metric.TrendIconEl className="w-3.5 h-3.5" />}
                        <span className="font-medium ml-0.5">{metric.trend}</span>
                        <span className="text-muted-foreground ml-1 text-[10px]">from last month</span>
                      </div>
                    )}
                  </div>
                  <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg text-sm shrink-0", metric.iconBg, metric.iconColor)}>
                    <metric.IconEl className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Chart Placeholders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 lg:col-span-2">
              <h2 className="text-md md:text-lg font-semibold text-foreground mb-4 md:mb-5">Monthly User Sessions (Placeholder)</h2>
              <div id="monthly-sessions-chart" className="w-full h-[250px] md:h-[300px] bg-gray-100 rounded-lg flex items-center justify-center text-muted-foreground">Chart Area</div>
            </div>
            <div className="bg-card rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-md md:text-lg font-semibold text-foreground mb-4 md:mb-5">Traffic Sources (Placeholder)</h2>
              <div id="traffic-sources-chart" className="w-full h-[250px] md:h-[300px] bg-gray-100 rounded-lg flex items-center justify-center text-muted-foreground">Chart Area</div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8">
            <h2 className="text-md md:text-lg font-semibold text-foreground mb-4 md:mb-5">Catalogue Usage Statistics (Placeholder)</h2>
            <div id="catalogue-usage-chart" className="w-full h-[300px] md:h-[350px] bg-gray-100 rounded-lg flex items-center justify-center text-muted-foreground">Chart Area</div>
          </div>
          
          {/* Feature Access / Quick Actions */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 md:mb-5">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href || "#"} className="block">
                  <div className={cn("bg-card rounded-xl shadow-lg p-5 hover:shadow-2xl transition-shadow cursor-pointer h-full flex flex-col justify-between transform hover:-translate-y-1")}>
                    <div>
                      <div className={cn("w-12 h-12 flex items-center justify-center rounded-lg mb-4", action.iconBg, action.iconTextColor)}>
                        <action.IconEl className="w-6 h-6" />
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
    </div>
  );
}

