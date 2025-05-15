
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { TutorProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell, Settings, Crown, Share2, CheckCircle2, UserPlus, UploadCloud, Palette,
  Link as LinkIcon, ArrowRight, User, MessageSquare, Percent, Clock, ShoppingBag,
  HardDrive, ArrowUp, ArrowDown, ChevronDown, LayoutGrid, Info, Ruler, Filter,
  Image as ImageIcon, BookOpen as BookOpenIcon, Globe as GlobeIcon,
  FileText, LifeBuoy, UserCog, BarChart2, Settings2 as Settings2Icon,
  Eye, Star, Camera, CheckCircle, DollarSign, InfoIcon // Added InfoIcon, CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoAsset from '@/assets/images/logo.png';

const snippetPrimaryColor = '#4F46E5'; // From snippet's Tailwind config
const snippetPrimaryBgClass = 'bg-[#4F46E5]';
const snippetPrimaryTextClass = 'text-[#4F46E5]';
const snippetRoundedButton = '!rounded-button'; // For 8px, maps to default rounded-lg or specific class

export default function TutorDashboardPage() {
  const { user, isAuthenticated } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [mockDaysLeft, setMockDaysLeft] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMockDaysLeft(Math.floor(Math.random() * 60) + 30);
  }, []);


  useEffect(() => {
    if (tutorUser && isClient) {
      let completedFields = 0;
      const totalFields = 5; // avatar, subjects, experience, hourlyRate, qualifications

      if (tutorUser.avatar && !tutorUser.avatar.includes('pravatar.cc') && !tutorUser.avatar.includes('avatar.vercel.sh')) completedFields++;
      if (tutorUser.subjects && tutorUser.subjects.length > 0) completedFields++;
      if (tutorUser.experience && tutorUser.experience.trim() !== "") completedFields++;
      if (tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== "") completedFields++;
      if (tutorUser.qualifications && tutorUser.qualifications.length > 0) completedFields++;

      setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
    }
  }, [tutorUser, isClient]);


  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      // Mock upload & update logic
    }
  };


  if (!isClient || !isAuthenticated || !tutorUser) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <p className="text-muted-foreground">Loading dashboard or not authorized...</p>
        </div>
    );
  }

  // Mock data for "Dashboard Metrics"
  const dashboardMetrics = [
    { title: "Total Sessions", value: "3,287", trend: "12.5%", IconEl: User, iconBg: "bg-blue-50", iconColor: snippetPrimaryTextClass, trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Product Inquiries", value: "144", trend: "8.2%", IconEl: MessageSquare, iconBg: "bg-orange-50", iconColor: "text-orange-500", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Conversion Rate", value: "3.6%", trend: "1.8%", IconEl: Percent, iconBg: "bg-green-50", iconColor: "text-green-600", trendColor: "text-red-500", TrendIconEl: ArrowDown },
    { title: "Avg. Rating", value: "4.7", trend: "+0.2", IconEl: Star, iconBg: "bg-yellow-50", iconColor: "text-yellow-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Earnings", value: "₹12.5k", trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Profile Views", value: "289", trend: "5.1%", IconEl: Eye, iconBg: "bg-teal-50", iconColor: "text-teal-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
  ];

  const quickActions = [
     { title: "Image Save Settings", description: "Configure how images are saved", IconEl: ImageIcon, iconBg: "bg-blue-50", iconTextColor: snippetPrimaryTextClass, href:"#" },
     { title: "Personalize Catalog", description: "Customize your product catalog", IconEl: BookOpenIcon, iconBg: "bg-purple-50", iconTextColor: "text-purple-600", href:"#" },
     { title: "Add to Website", description: "Integrate your catalog", IconEl: GlobeIcon, iconBg: "bg-green-50", iconTextColor: "text-green-600", href: "#" },
     { title: "Custom Room Log", description: "View custom configurations", IconEl: FileText, iconBg: "bg-orange-50", iconTextColor: "text-orange-500", href: "#" },
     { title: "Raise Support Ticket", description: "Get help from our team", IconEl: LifeBuoy, iconBg: "bg-red-50", iconTextColor: "text-red-500", href: "#" },
     { title: "User Permissions", description: "Manage team access", IconEl: UserCog, iconBg: "bg-indigo-50", iconTextColor: "text-indigo-600", href: "#" },
     { title: "Advanced Analytics", description: "Dive deeper into data", IconEl: BarChart2, iconBg: "bg-teal-50", iconTextColor: "text-teal-600", href: "#" },
     { title: "API Integration", description: "Connect with third-party services", IconEl: Settings2Icon, iconBg: "bg-yellow-50", iconTextColor: "text-yellow-600", href: "#" },
  ];


  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Welcome Section */}
      <div className="bg-card rounded-none shadow-lg p-6 md:p-8 mb-6 md:mb-8 border-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative group shrink-0">
              <Avatar
                className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/30 group-hover:opacity-80 transition-opacity cursor-pointer shadow-sm"
                onClick={handleAvatarUploadClick}
              >
                <AvatarImage src={tutorUser.avatar || `https://avatar.vercel.sh/${tutorUser.email}.png`} alt={tutorUser.name} />
                <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl md:text-2xl">
                  {tutorUser.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleAvatarUploadClick}
                className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 flex items-center justify-center bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                aria-label="Update profile picture"
              >
                <Camera className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="flex-grow">
              <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold text-foreground">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Welcome back to your dashboard</p>

              <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm text-muted-foreground">Profile Completion</span>
                      <span className="text-xs sm:text-sm font-medium text-primary">{completionPercentage}%</span>
                  </div>
                  <Progress
                      value={completionPercentage}
                      className="h-1.5 rounded-full bg-gray-100"
                      indicatorClassName={cn("rounded-full bg-[#4F46E5]")}
                  />
                  <Button asChild variant="link" className="mt-1 text-xs sm:text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] p-0 h-auto">
                    <Link href="/dashboard/tutor/edit-personal-details">
                        Complete Your Profile <ArrowRight className="inline h-3 w-3 ml-0.5" />
                    </Link>
                  </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-gray-50 rounded-lg p-4 w-full sm:min-w-[200px]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Current Plan</p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">Business Pro</p>
                  <p className="text-xs text-gray-500 mt-1">Expires on April 28, 2025</p>
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-blue-50 rounded text-[#4F46E5]">
                  <Crown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
              <Button className="bg-[#4F46E5] text-white px-3 py-2 text-xs sm:text-sm rounded-button whitespace-nowrap hover:bg-[#4338CA] transition-colors w-full xs:w-auto">
                Upgrade Plan
              </Button>
              <Button variant="outline" className="bg-card border border-gray-200 text-gray-700 px-3 py-2 text-xs sm:text-sm rounded-button whitespace-nowrap hover:bg-gray-50 transition-colors flex items-center gap-1.5 w-full xs:w-auto">
                <Share2 className="w-3.5 h-3.5" />
                Share Link
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {dashboardMetrics.map((metric, index) => (
          <div key={index} className="bg-card rounded-xl shadow-lg p-5 border-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">{metric.title}</p>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mt-1">{metric.value}</h3>
                {metric.trend && (
                  <div className={cn("flex items-center mt-1 text-xs", metric.trendColor)}>
                    {metric.TrendIconEl && <metric.TrendIconEl className="w-3.5 h-3.5" />}
                    <span className="font-medium ml-0.5">{metric.trend}</span>
                    <span className="text-muted-foreground ml-1 text-[10px]">from last month</span>
                  </div>
                )}
              </div>
              <div className={cn("w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md text-sm shrink-0", metric.iconBg, metric.iconColor)}>
                <metric.IconEl className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts - Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
        <div className="bg-card rounded-xl shadow-lg p-5 lg:col-span-2 border-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base md:text-lg font-semibold text-foreground">Monthly User Sessions</h2>
            <div className="flex items-center">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2 text-xs text-gray-600 border-gray-200 px-2.5 py-1 h-auto hover:bg-gray-50 !rounded-button">
                  <span>Last 6 Months</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
          <div id="monthly-sessions-chart" className="w-full h-[280px] md:h-[300px] bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Monthly Sessions</div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-5 border-0">
          <h2 className="text-base md:text-lg font-semibold text-foreground mb-6">Traffic Sources</h2>
          <div id="traffic-sources-chart" className="w-full h-[280px] md:h-[300px] bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Traffic Sources</div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-5 mb-6 md:mb-8 border-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base md:text-lg font-semibold text-foreground">Catalogue Usage Statistics</h2>
          <div className="flex items-center gap-2">
            <div className="px-1 py-1 bg-gray-100 rounded-full flex items-center">
              <Button variant="ghost" className="px-3 py-1 bg-card text-gray-800 rounded-full text-xs sm:text-sm shadow-sm whitespace-nowrap h-auto hover:bg-gray-200">Monthly</Button>
              <Button variant="ghost" className="px-3 py-1 text-gray-600 rounded-full text-xs sm:text-sm whitespace-nowrap h-auto hover:bg-gray-200">Weekly</Button>
            </div>
          </div>
        </div>
        <div id="catalogue-usage-chart" className="w-full h-[300px] md:h-[350px] bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Catalogue Usage</div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href || "#"} className="block">
              <div className="bg-card rounded-xl shadow-lg p-4 md:p-5 hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col justify-between transform hover:-translate-y-1 border-0">
                <div>
                  <div className={cn("w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg mb-3 md:mb-4", action.iconBg)}>
                    <action.IconEl className={cn("w-5 h-5 md:w-6 md:h-6", action.iconTextColor)} />
                  </div>
                  <h3 className="font-medium text-foreground text-sm md:text-base">{action.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{action.description}</p>
                </div>
                <Button variant="link" size="sm" className={cn("mt-3 text-xs p-0 h-auto font-medium self-start whitespace-nowrap flex items-center gap-1 text-[#4F46E5] hover:text-[#4338CA]", "!rounded-none")}>
                  Go to {action.title.split(" ")[0]} <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
