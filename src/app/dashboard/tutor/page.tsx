// src/app/dashboard/tutor/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { TutorProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import logoAsset from '@/assets/images/logo.png'; // Import the logo
import { 
  Bell, Settings, Crown, Share2, CheckCircle2, UserPlus, UploadCloud, Palette, 
  Link as LinkIcon, ArrowRight, User, MessageSquare, Percent, Clock, ShoppingBag, 
  HardDrive, ArrowUp, ArrowDown, ChevronDown, LayoutGrid, Info, Ruler, Filter, 
  Image as ImageIcon, BookOpen as BookOpenIcon, Globe as GlobeIcon, 
  FileText, LifeBuoy, UserCog, BarChart2, Settings2 as Settings2Icon,
  Eye, Star
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define colors based on the snippet's Tailwind config for this page
const pagePrimaryColor = '#4F46E5';
const pageSecondaryTextColor = '#6B7280';
const pagePrimaryBgClass = 'bg-[#4F46E5]';
const pagePrimaryTextClass = 'text-[#4F46E5]';
const pageRoundedButton = 'rounded-button'; // Corresponds to '8px'


export default function TutorDashboardPage() {
  const { user } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [mockDaysLeft, setMockDaysLeft] = useState(0);

  useEffect(() => {
    if (tutorUser) {
      let completedFields = 0;
      const totalFields = 5; // Example: avatar, subjects, experience, hourlyRate, qualifications
      if (tutorUser.avatar && !tutorUser.avatar.includes('pravatar.cc') && !tutorUser.avatar.includes('avatar.vercel.sh')) completedFields++;
      if (tutorUser.subjects && tutorUser.subjects.length > 0) completedFields++;
      if (tutorUser.experience && tutorUser.experience.trim() !== "") completedFields++;
      if (tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== "") completedFields++;
      if (tutorUser.qualifications && tutorUser.qualifications.length > 0) completedFields++;
      setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
    }
    setMockDaysLeft(Math.floor(Math.random() * 60) + 30); // Random days left 30-90
  }, [tutorUser]);

  const setupSteps = [
    { title: "Create Account", description: "Your account is ready to use", IconEl: UserPlus, buttonText: "View Profile", href: "/dashboard/my-account", completed: true, iconColor: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", statusIcon: CheckCircle2 },
    { title: "Upload Products", description: "12 products uploaded (mock)", IconEl: UploadCloud, buttonText: "Add More", href: "#", completed: true, iconColor: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", statusIcon: CheckCircle2 },
    { title: "Create Design", description: "3 designs created (mock)", IconEl: Palette, buttonText: "Edit Designs", href: "#", completed: true, iconColor: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", statusIcon: CheckCircle2 },
    { title: "Connect Website", description: "Link your website to publish", IconEl: LinkIcon, buttonText: "Start Now", href: "#", completed: false, iconColor: "text-gray-600", bgColor: "bg-white", borderColor: "border-gray-200", statusIcon: Clock },
  ];

  const dashboardMetrics = [
    { title: "Total Sessions", value: "3,287", trend: "12.5%", IconEl: User, iconBg: "bg-blue-50", iconColor: pagePrimaryTextClass, trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Product Inquiries", value: "144", trend: "8.2%", IconEl: MessageSquare, iconBg: "bg-orange-50", iconColor: "text-orange-500", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Conversion Rate", value: "3.6%", trend: "1.8%", IconEl: Percent, iconBg: "bg-green-50", iconColor: "text-green-600", trendColor: "text-red-500", TrendIconEl: ArrowDown },
    { title: "Avg. Rating", value: "4.7", trend: "+0.2", IconEl: Star, iconBg: "bg-yellow-50", iconColor: "text-yellow-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Earnings", value: "₹12.5k", trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Profile Views", value: "289", trend: "5.1%", IconEl: Eye, iconBg: "bg-teal-50", iconColor: "text-teal-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
  ];

   const quickActions = [
     { title: "Edit Personal Details", description: "Update your personal info", IconEl: UserCog, iconBg: "bg-blue-50", iconTextColor: pagePrimaryTextClass, href:"/dashboard/tutor/edit-personal-details" },
     { title: "Edit Tutoring Details", description: "Update your teaching profile", IconEl: BookOpenIcon, iconBg: "bg-purple-50", iconTextColor: "text-purple-600", href:"/dashboard/tutor/edit-tutoring-details" },
     { title: "My Enquiries", description: "View and manage enquiries", IconEl: FileText, iconBg: "bg-orange-50", iconTextColor: "text-orange-500", href: "/dashboard/enquiries" },
     { title: "My Classes", description: "Manage your classes", IconEl: LayoutGrid, iconBg: "bg-green-50", iconTextColor: "text-green-600", href: "/dashboard/my-classes" },
  ];


  if (!tutorUser) {
    return <div className="flex h-screen items-center justify-center"><p>Loading tutor data...</p></div>;
  }

  return (
    <div className="flex-grow"> {/* Removed bg-foreground here */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-card rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
              <p className="text-muted-foreground mt-1 text-sm">Welcome back to your dashboard</p>
              
              <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Setup progress</span>
                      <span className={cn("text-sm font-medium", pagePrimaryTextClass)}>{completionPercentage}%</span>
                  </div>
                  <Progress 
                      value={completionPercentage} 
                      className="h-2 rounded-full bg-gray-100" 
                      indicatorClassName={cn("rounded-full", completionPercentage === 100 ? "bg-green-500" : pagePrimaryBgClass)}
                  />
                   <Button asChild variant="link" className={cn("mt-2 text-xs font-medium hover:underline p-0 h-auto", pagePrimaryTextClass)}>
                        <Link href="/dashboard/tutor/edit-personal-details">
                            Complete Your Profile <ArrowRight className="inline h-3 w-3 ml-1" />
                        </Link>
                    </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-gray-100 rounded-lg p-4 min-w-[200px]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Current Plan</p>
                    <p className="font-semibold text-gray-800">Business Pro</p>
                    <p className="text-xs text-gray-500 mt-1">Expires on April 28, 2025</p>
                  </div>
                  <div className={cn("w-8 h-8 flex items-center justify-center bg-blue-50 rounded-md", pagePrimaryTextClass)}>
                    <Crown className="h-4 w-4"/>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                  <Button className={cn("text-xs px-4 py-2 h-auto whitespace-nowrap hover:bg-opacity-90", pagePrimaryBgClass, "text-primary-foreground", pageRoundedButton)}>
                    Upgrade Plan
                  </Button>
                  <Button variant="outline" className={cn("text-xs px-4 py-2 h-auto border-gray-300 hover:bg-gray-100 whitespace-nowrap flex items-center gap-2 text-gray-700", pageRoundedButton)}>
                      <div className="w-4 h-4 flex items-center justify-center">
                          <Share2 className="h-3 w-3" />
                      </div>
                      Share Link
                  </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Setup Section */}
        <div className="bg-card rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Quick Setup Guide</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {setupSteps.filter(s => s.completed).length} of {setupSteps.length} completed
              </span>
              <div className={cn("w-6 h-6 flex items-center justify-center rounded-full", `${pagePrimaryBgClass}/10`, pagePrimaryTextClass)}>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {setupSteps.map((step, index) => (
              <div key={index} className={cn("border rounded-lg p-4 relative transition-all duration-200 hover:shadow-md", step.bgColor, step.borderColor)}>
                <div className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center">
                  <step.statusIcon className={cn("h-4 w-4", step.completed ? step.iconColor : "text-gray-400")} />
                </div>
                <div className={cn("w-10 h-10 flex items-center justify-center rounded-full mb-3", step.iconBg)}>
                  <step.IconEl className={cn("h-4 w-4", step.iconColor)} />
                </div>
                <h3 className="font-medium text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 h-10 line-clamp-2">{step.description}</p>
                <Button asChild variant="link" size="sm" className={cn("mt-4 text-sm p-0 h-auto font-medium whitespace-nowrap flex items-center gap-1", pagePrimaryTextClass, "!rounded-none")}>
                  <Link href={step.href || "#"}>
                    {step.buttonText}
                    <div className="w-4 h-4 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {dashboardMetrics.map((metric, index) => (
            <div key={index} className="bg-card rounded-xl shadow-sm p-5">
                <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <h3 className="text-2xl font-semibold text-foreground mt-1">{metric.value}</h3>
                    {metric.trend && (
                        <div className={cn("flex items-center mt-1 text-sm", metric.trendColor)}>
                            {metric.TrendIconEl && <metric.TrendIconEl className={cn("h-4 w-4")} />}
                            <span className="font-medium ml-0.5">{metric.trend}</span>
                            <span className="text-muted-foreground ml-1 text-xs">from last month</span>
                        </div>
                    )}
                </div>
                <div className={cn("w-10 h-10 flex items-center justify-center rounded-md text-sm", metric.iconBg, metric.iconColor)}>
                    <metric.IconEl className="h-5 w-5" />
                </div>
                </div>
                {metric.title === "Storage Used" && (
                      <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", "bg-teal-500")} style={{ width: "42%"}}></div>
                    </div>
                )}
            </div>
            ))}
        </div>
        
        {/* Charts - Placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-xl shadow-sm p-5 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Monthly User Sessions</h2>
                    <div className="flex items-center">
                        <div className="relative">
                            <Button variant="outline" className={cn("flex items-center gap-2 text-sm text-gray-600 border-gray-200 px-3 py-1.5 hover:bg-gray-50", pageRoundedButton)}>
                                <span>Last 6 Months</span>
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
                <div id="monthly-sessions-chart" className="w-full h-[300px] bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Monthly Sessions</div>
            </div>
            
            <div className="bg-card rounded-xl shadow-sm p-5">
                <h2 className="text-lg font-semibold text-foreground mb-6">Traffic Sources</h2>
                <div id="traffic-sources-chart" className="w-full h-[300px] bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Traffic Sources</div>
            </div>
        </div>
        
        {/* Visual Statistics */}
        <div className="bg-card rounded-xl shadow-sm p-5 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Catalogue Usage Statistics</h2>
                <div className="flex items-center gap-2">
                    <div className="px-1 py-1 bg-gray-100 rounded-full flex items-center">
                        <Button variant="ghost" size="sm" className="px-3 py-1 h-auto bg-card text-foreground rounded-full shadow-sm whitespace-nowrap text-sm">Monthly</Button>
                        <Button variant="ghost" size="sm" className="px-3 py-1 h-auto text-muted-foreground rounded-full whitespace-nowrap text-sm">Weekly</Button>
                    </div>
                </div>
            </div>
            <div id="catalogue-usage-chart" className="w-full h-[350px] bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Catalogue Usage</div>
        </div>
        
        {/* Feature Access */}
        <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {quickActions.map((action, index) => (
                <Link key={index} href={action.href || "#"} className="block">
                <div className="bg-card rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between transform hover:-translate-y-1">
                    <div>
                    <div className={cn("w-12 h-12 flex items-center justify-center rounded-lg mb-4", action.iconBg)}>
                        <action.IconEl className={cn("h-6 w-6", action.iconTextColor)} />
                    </div>
                    <h3 className="font-medium text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}
