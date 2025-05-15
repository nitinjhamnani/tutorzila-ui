
// src/app/dashboard/tutor/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { TutorProfile, DemoSession } from "@/types";
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
  Calendar as CalendarIcon,
  UsersRound,
  MessageSquareQuote,
  LayoutDashboard,
  Edit,
  Trash2,
  Archive,
  PlusCircle,
  Briefcase,
  ShieldCheck,
  LogOut,
  LifeBuoy,
  Search,
  SquarePen,
  MapPin,
  ChevronDown,
  UserPlus,
  Camera,
  MailCheck,
  PhoneCall,
  Mail,
  Phone,
  FileText, // Added FileText import
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import logoAsset from '@/assets/images/logo.png';


interface InsightCardProps {
  title: string;
  value: string | number;
  Icon: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  trend?: string;
  trendDirection?: "up" | "down";
}


export default function TutorDashboardPage() {
  const { user, isAuthenticated } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  

  useEffect(() => {
    if (isClient && tutorUser) {
      let completedFields = 0;
      const totalFields = 5; 

      if (tutorUser.bio && tutorUser.bio.trim() !== "") completedFields++;
      if (tutorUser.subjects && tutorUser.subjects.length > 0) completedFields++;
      if (tutorUser.experience && tutorUser.experience.trim() !== "") completedFields++;
      if (tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== "") completedFields++;
      if (tutorUser.qualifications && tutorUser.qualifications.length > 0) completedFields++;
      
      setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
    }
  }, [isClient, tutorUser]);


  if (!isAuthenticated || !tutorUser || tutorUser.role !== 'tutor') {
    return <div className="flex items-center justify-center min-h-screen"><p>Access Denied. Please log in as a tutor.</p></div>;
  }
  
  const snippetPrimaryColor = '#4F46E5'; 
  const pagePrimaryColor = 'hsl(var(--primary))'; // Using app's primary color for text
  const pagePrimaryBg = 'bg-primary';
  const pagePrimaryText = 'text-primary';
  
  const setupSteps = [
    { title: "Create Account", description: "Your account is ready to use", IconEl: UserPlus, buttonText: "View Profile", href: "/dashboard/my-account", completed: true, iconColor: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-100", iconBg: "bg-green-100", statusIcon: CheckCircle2 },
    { title: "Upload Products", description: "12 products uploaded", IconEl: UploadCloud, buttonText: "Add More", href: "#", completed: true, iconColor: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-100", iconBg: "bg-green-100", statusIcon: CheckCircle2 },
    { title: "Create Design", description: "3 designs created", IconEl: Palette, buttonText: "Edit Designs", href: "#", completed: true, iconColor: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-100", iconBg: "bg-green-100", statusIcon: CheckCircle2 },
    { title: "Connect Website", description: "Link your website to publish", IconEl: LinkIcon, buttonText: "Start Now", href: "#", completed: false, iconColor: `text-gray-600`, bgColor: "bg-card", borderColor: "border-gray-200", iconBg: "bg-gray-100", statusIcon: Clock },
  ];

  const dashboardMetrics = [
    { title: "Total Sessions", value: "3,287", trend: "12.5%", IconEl: UserIconLucide, iconBg: "bg-blue-50", iconColor: "text-[#4F46E5]", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Product Inquiries", value: "144", trend: "8.2%", IconEl: MessageSquare, iconBg: "bg-orange-50", iconColor: "text-orange-500", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Conversion Rate", value: "3.6%", trend: "1.8%", IconEl: Percent, iconBg: "bg-green-50", iconColor: "text-green-600", trendColor: "text-red-500", TrendIconEl: ArrowDown },
    { title: "Average Session Time", value: "4m 32s", trend: "0:42", IconEl: Clock, iconBg: "bg-purple-50", iconColor: "text-purple-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Products", value: "78", trend: "12", IconEl: ShoppingBag, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Storage Used", value: "4.2 GB", trend: "of 10 GB (42%)", IconEl: HardDrive, iconBg: "bg-teal-50", iconColor: "text-teal-600" },
  ];

  const quickActions = [
     { title: "Image Save Settings", description: "Configure how images are saved", IconEl: Settings, iconBg: "bg-blue-50", iconTextColor: "text-[#4F46E5]", href:"#" },
     { title: "Personalize Catalog", description: "Customize your product catalog", IconEl: BookOpenIcon, iconBg: "bg-purple-50", iconTextColor: "text-purple-600", href:"#" },
     { title: "Add to Website", description: "Integrate your catalog", IconEl: GlobeIcon, iconBg: "bg-green-50", iconTextColor: "text-green-600", href: "#" },
     { title: "Custom Room Log", description: "View custom configurations", IconEl: FileText, iconBg: "bg-orange-50", iconTextColor: "text-orange-500", href: "#" },
     { title: "Raise Support Ticket", description: "Get help from our team", IconEl: LifeBuoy, iconBg: "bg-red-50", iconTextColor: "text-red-500", href: "#" },
     { title: "User Permissions", description: "Manage team access", IconEl: UserCog, iconBg: "bg-indigo-50", iconTextColor: "text-indigo-600", href: "#" },
     { title: "Advanced Analytics", description: "Dive deeper into data", IconEl: BarChart2, iconBg: "bg-teal-50", iconTextColor: "text-teal-600", href: "#" },
     { title: "API Integration", description: "Connect third-party services", IconEl: Settings2Icon, iconBg: "bg-yellow-50", iconTextColor: "text-yellow-600", href: "#" },
  ];


  return (
    <>
        {/* Header Section - From Snippet */}
        <header className="bg-card shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                       <Link href="/" className="flex items-center">
                         <Image src={logoAsset} alt="Tutorzila Logo" width={150} height={40} className="h-10 w-auto mr-2" priority />
                      </Link>
                      <span className="text-muted-foreground text-sm mx-2">|</span>
                      <span className="text-muted-foreground text-sm font-medium">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                             <Avatar className="h-8 w-8 border-2 border-primary/30">
                               <AvatarImage src={tutorUser.avatar || `https://avatar.vercel.sh/${tutorUser.email}.png`} alt={tutorUser.name} />
                              <AvatarFallback className={cn(pagePrimaryBg,"text-primary-foreground text-xs font-medium")}>
                                {tutorUser.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-foreground">{tutorUser.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="bg-card rounded-xl shadow-sm p-6 mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-foreground">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                            <p className="text-muted-foreground mt-1 text-sm">Welcome back to your dashboard</p>
                            
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Setup progress</span>
                                    <span className={cn("text-sm font-medium", pagePrimaryText)}>{completionPercentage}%</span>
                                </div>
                                <Progress 
                                  value={completionPercentage} 
                                  className="h-2 rounded-full bg-gray-100" 
                                  indicatorClassName={cn("rounded-full", completionPercentage === 100 ? "bg-green-500" : "bg-[#4F46E5]")}
                                />
                                <Link href="/dashboard/tutor/edit-personal-details" className={cn("mt-2 inline-block text-xs font-medium hover:underline", pagePrimaryText)}>
                                    Complete Your Profile <ArrowRight className="inline h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                            <div className="bg-gray-100 rounded-lg p-4 min-w-[180px] sm:min-w-[200px]">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Current Plan</p>
                                        <p className="font-semibold text-sm text-foreground">Business Pro</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Expires on April 28, 2025</p>
                                    </div>
                                    <div className={cn("w-8 h-8 flex items-center justify-center bg-blue-100 rounded-md text-sm", "text-[#4F46E5]")}>
                                        <Crown className="h-4 w-4"/>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                 <Button className={cn("text-xs px-3 py-1.5 h-auto whitespace-nowrap hover:bg-opacity-90 bg-[#4F46E5] text-primary-foreground")} style={{borderRadius: 'var(--radius-button)'}}>
                                    Upgrade Plan
                                </Button>
                                <Button variant="outline" className="text-xs px-3 py-1.5 h-auto border-gray-300 hover:bg-gray-100 whitespace-nowrap flex items-center gap-1.5 text-gray-700" style={{borderRadius: 'var(--radius-button)'}}>
                                    <Share2 className="h-3 w-3" />
                                    Share Link
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Quick Setup Section */}
                <div className="bg-card rounded-xl shadow-sm p-6 mb-6 md:mb-8">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-lg font-semibold text-foreground">Quick Setup Guide</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                                {setupSteps.filter(s => s.completed).length} of {setupSteps.length} completed
                            </span>
                            <div className={cn("w-5 h-5 flex items-center justify-center rounded-full", "bg-[#4F46E5]/10 text-[#4F46E5]")}>
                                <CheckCircle className="h-3.5 w-3.5" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {setupSteps.map((step, index) => (
                            <div key={index} className={cn("border rounded-lg p-4 relative transition-all duration-200 hover:shadow-md", step.bgColor, step.borderColor)}>
                                <div className="absolute top-2.5 right-2.5 w-4 h-4 flex items-center justify-center">
                                    <step.statusIcon className={cn("h-4 w-4", step.completed ? step.iconColor : "text-gray-400")} />
                                </div>
                                <div className={cn("w-8 h-8 flex items-center justify-center rounded-full mb-2.5", step.iconBg)}>
                                    <step.IconEl className={cn("h-4 w-4", step.iconColor)} />
                                </div>
                                <h3 className="font-medium text-sm text-foreground">{step.title}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5 h-8 line-clamp-2">{step.description}</p>
                                {step.completed ? (
                                    <Button asChild variant="link" size="sm" className={cn("mt-3 text-xs p-0 h-auto font-medium whitespace-nowrap", "text-[#4F46E5]")}>
                                      <Link href={step.href}>
                                        {step.buttonText} <ArrowRight className="inline h-3 w-3 ml-1" />
                                      </Link>
                                    </Button>
                                ) : (
                                    <Button size="sm" className={cn("mt-3 text-xs px-3 py-1.5 h-auto whitespace-nowrap bg-[#4F46E5] text-primary-foreground hover:bg-opacity-90")} style={{borderRadius: 'var(--radius-button)'}}>
                                      {step.buttonText}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Dashboard Metrics */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    {dashboardMetrics.map((metric, index) => (
                    <div key={index} className="bg-card rounded-xl shadow-sm p-5">
                        <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">{metric.title}</p>
                            <h3 className="text-xl font-semibold text-foreground mt-0.5">{metric.value}</h3>
                            {metric.trend && (
                                <div className={cn("flex items-center mt-1 text-[10px]", metric.trendColor)}>
                                    {metric.TrendIconEl && <metric.TrendIconEl className={cn("h-3 w-3")} />}
                                    <span className="font-medium ml-0.5">{metric.trend}</span>
                                    <span className="text-muted-foreground ml-1">from last month</span>
                                </div>
                            )}
                        </div>
                        <div className={cn("w-8 h-8 flex items-center justify-center rounded-md text-sm", metric.iconBg, metric.iconColor)}>
                            <metric.IconEl className="h-4 w-4" />
                        </div>
                        </div>
                        {metric.title === "Storage Used" && (
                             <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-500 rounded-full" style={{ width: "42%"}}></div>
                            </div>
                        )}
                    </div>
                    ))}
                </div>
                
                {/* Charts - Placeholders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
                    <div className="bg-card rounded-xl shadow-sm p-5 lg:col-span-2">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h2 className="text-base font-semibold text-foreground">Monthly User Sessions</h2>
                            <Button variant="outline" size="sm" className="text-xs h-7 px-2 border-gray-300 hover:bg-gray-100 text-gray-700" style={{borderRadius: 'var(--radius-button)'}}>
                                Last 6 Months <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                        </div>
                        <div id="monthly-sessions-chart" className="w-full h-[250px] bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Monthly Sessions</div>
                    </div>
                    <div className="bg-card rounded-xl shadow-sm p-5">
                        <h2 className="text-base font-semibold text-foreground mb-4 md:mb-6">Traffic Sources</h2>
                        <div id="traffic-sources-chart" className="w-full h-[250px] bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Traffic Sources</div>
                    </div>
                </div>
                <div className="bg-card rounded-xl shadow-sm p-5 mb-6 md:mb-8">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-base font-semibold text-foreground">Catalogue Usage Statistics</h2>
                        <div className="px-0.5 py-0.5 bg-gray-100 rounded-full flex items-center text-xs">
                            <Button variant="ghost" size="sm" className="px-2.5 py-1 h-auto bg-card text-foreground rounded-full shadow-sm whitespace-nowrap text-[10px]">Monthly</Button>
                            <Button variant="ghost" size="sm" className="px-2.5 py-1 h-auto text-muted-foreground rounded-full whitespace-nowrap text-[10px]">Weekly</Button>
                        </div>
                    </div>
                    <div id="catalogue-usage-chart" className="w-full h-[300px] bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Catalogue Usage</div>
                </div>
                
                {/* Quick Actions */}
                 <div className="mb-6 md:mb-8">
                    <h2 className="text-lg font-semibold text-foreground mb-4 md:mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {quickActions.map((action, index) => (
                        <Link key={index} href={action.href || "#"} className="block">
                        <div className="bg-card rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between transform hover:-translate-y-0.5">
                            <div>
                            <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg mb-3", action.iconBg)}>
                                <action.IconEl className={cn("h-5 w-5", action.iconTextColor)} />
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
        <footer className="bg-card border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-4">
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
    </>
  );
}

    