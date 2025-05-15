// src/app/dashboard/tutor/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { TutorProfile, DemoSession } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import logoAsset from '@/assets/images/logo.png';
import { 
  Bell, Settings, Crown, Share2, CheckCircle2, UserPlus, UploadCloud, Palette, 
  Link as LinkIcon, ArrowRight, User, MessageSquare, Percent, Clock, ShoppingBag, 
  HardDrive, ArrowUp, ArrowDown, ChevronDown, LayoutGrid, Info, Ruler, Filter, 
  Image as ImageIcon, BookOpen as BookOpenIcon, Globe as GlobeIcon, 
  FileText, LifeBuoy, UserCog, BarChart2, Settings2 as Settings2Icon,
  Eye, Star, DollarSign // Added DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { DemoSessionCard } from "@/components/dashboard/DemoSessionCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const snippetPrimaryColor = '#4F46E5'; // From your snippet's Tailwind config
const snippetPrimaryBgClass = 'bg-[#4F46E5]';
const snippetPrimaryTextClass = 'text-[#4F46E5]';
const snippetRoundedButton = '!rounded-button'; // For 8px, maps to default rounded-lg or specific class


export default function TutorDashboardPage() {
  const { user, isAuthenticated } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [mockDaysLeft, setMockDaysLeft] = useState(Math.floor(Math.random() * 60) + 30); // Initialize here
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);

  useEffect(() => {
    if (tutorUser) {
      let completedFields = 0;
      const totalFields = 5; // avatar, subjects, experience, hourlyRate, qualifications
      if (tutorUser.avatar && !tutorUser.avatar.includes('pravatar.cc') && !tutorUser.avatar.includes('avatar.vercel.sh')) completedFields++;
      if (tutorUser.subjects && tutorUser.subjects.length > 0) completedFields++;
      if (tutorUser.experience && tutorUser.experience.trim() !== "") completedFields++;
      if (tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== "") completedFields++;
      if (tutorUser.qualifications && tutorUser.qualifications.length > 0) completedFields++;
      setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
      
      // Filter demo sessions for the logged-in tutor
      const tutorDemos = MOCK_DEMO_SESSIONS.filter(
        (session) => session.tutorName === tutorUser.name
      );
      setDemoSessions(tutorDemos);
    }
    // No need to set mockDaysLeft here if initialized above and not dependent on user
  }, [tutorUser]);


  const handleUpdateDemoSession = (updatedDemo: DemoSession) => {
    setDemoSessions(prevSessions => 
      prevSessions.map(session => session.id === updatedDemo.id ? updatedDemo : session)
    );
  };

  const handleCancelDemoSession = (sessionId: string) => {
    setDemoSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === sessionId ? { ...session, status: 'Cancelled' } : session
      )
    );
  };

  const dashboardMetrics = [
    { title: "Total Sessions", value: "3,287", trend: "12.5%", IconEl: User, iconBg: "bg-blue-50", iconColor: snippetPrimaryTextClass, trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Product Inquiries", value: "144", trend: "8.2%", IconEl: MessageSquare, iconBg: "bg-orange-50", iconColor: "text-orange-500", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Conversion Rate", value: "3.6%", trend: "1.8%", IconEl: Percent, iconBg: "bg-green-50", iconColor: "text-green-600", trendColor: "text-red-500", TrendIconEl: ArrowDown },
    { title: "Avg. Rating", value: "4.7", trend: "+0.2", IconEl: Star, iconBg: "bg-yellow-50", iconColor: "text-yellow-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Earnings", value: "₹12.5k", trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Profile Views", value: "289", trend: "5.1%", IconEl: Eye, iconBg: "bg-teal-50", iconColor: "text-teal-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
  ];

  const setupSteps = [
    { title: "Create Account", description: "Your account is ready to use", IconEl: UserPlus, buttonText: "View Profile", href: "/dashboard/my-account", completed: true, iconColor: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", statusIcon: CheckCircle2 },
    { title: "Upload Products", description: "12 products uploaded", IconEl: UploadCloud, buttonText: "Add More", href: "#", completed: true, iconColor: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", statusIcon: CheckCircle2 },
    { title: "Create Design", description: "3 designs created", IconEl: Palette, buttonText: "Edit Designs", href: "#", completed: true, iconColor: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", statusIcon: CheckCircle2 },
    { title: "Connect Website", description: "Link your website to publish", IconEl: LinkIcon, buttonText: "Start Now", href: "#", completed: false, iconColor: "text-gray-600", bgColor: "bg-card", borderColor: "border-gray-200", statusIcon: Clock },
  ];
   const quickActions = [
     { title: "Edit Personal Details", description: "Update your personal info", IconEl: UserCog, iconBg: "bg-blue-50", iconTextColor: snippetPrimaryTextClass, href:"/dashboard/tutor/edit-personal-details" },
     { title: "Edit Tutoring Details", description: "Update your teaching profile", IconEl: BookOpenIcon, iconBg: "bg-purple-50", iconTextColor: "text-purple-600", href:"/dashboard/tutor/edit-tutoring-details" },
     { title: "My Enquiries", description: "View and manage enquiries", IconEl: FileText, iconBg: "bg-orange-50", iconTextColor: "text-orange-500", href: "/dashboard/enquiries" },
     { title: "My Classes", description: "Manage your classes", IconEl: LayoutGrid, iconBg: "bg-green-50", iconTextColor: "text-green-600", href: "/dashboard/my-classes" },
     { title: "Support", description: "Get help from our team", IconEl: LifeBuoy, iconBg: "bg-red-50", iconTextColor: "text-red-500", href: "#" },
     { title: "API Integration", description: "Connect services", IconEl: Settings2Icon, iconBg: "bg-yellow-50", iconTextColor: "text-yellow-600", href: "#" },
  ];


  if (!isAuthenticated || !tutorUser) {
    // router.push('/'); // Or a specific login page for tutors
    return <div className="flex min-h-screen items-center justify-center"><p>Loading or not authorized...</p></div>;
  }

  return (
    <div className="flex-grow"> {/* Removed bg-gray-50 and p-4/p-8 from here, handled by layout */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-card rounded-xl shadow-sm p-6 md:p-8 mb-6 md:mb-8 border-0">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/30 shadow-sm shrink-0">
                   <AvatarImage src={tutorUser.avatar || `https://avatar.vercel.sh/${tutorUser.email}.png`} alt={tutorUser.name} />
                   <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl md:text-2xl">
                     {tutorUser.name?.charAt(0).toUpperCase()}
                   </AvatarFallback>
                 </Avatar>
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-foreground">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                  <p className="text-muted-foreground text-sm mt-1">Welcome back to your dashboard</p>
                  
                  <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Profile Completion</span>
                          <span className={cn("text-xs font-medium", snippetPrimaryTextClass)}>{completionPercentage}%</span>
                      </div>
                      <Progress 
                          value={completionPercentage} 
                          className="h-1.5 rounded-full bg-gray-100" 
                          indicatorClassName={cn("rounded-full", snippetPrimaryBgClass, completionPercentage === 100 ? "bg-green-500" : snippetPrimaryBgClass)} // Ensure snippetPrimaryBgClass is applied
                      />
                      <Button asChild variant="link" className={cn("mt-1 text-xs font-medium hover:underline p-0 h-auto", snippetPrimaryTextClass)}>
                            <Link href="/dashboard/tutor/edit-personal-details">
                                Complete Your Profile <ArrowRight className="inline h-3 w-3 ml-0.5" />
                            </Link>
                        </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-0">
                <div className="bg-gray-100 rounded-lg p-3.5 min-w-[180px] w-full sm:w-auto">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Current Plan</p>
                      <p className="text-sm font-semibold text-gray-800">Business Pro</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Expires on April 28, 2025</p>
                    </div>
                    <div className={cn("w-7 h-7 flex items-center justify-center bg-blue-50 rounded-md text-sm", snippetPrimaryTextClass)}>
                      <Crown className="h-3.5 w-3.5"/>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button className={cn("text-xs px-3 py-1.5 h-auto whitespace-nowrap hover:bg-opacity-90 w-full sm:w-auto", snippetPrimaryBgClass, "text-primary-foreground", snippetRoundedButton)}>
                      Upgrade Plan
                    </Button>
                    <Button variant="outline" className={cn("text-xs px-3 py-1.5 h-auto border-gray-300 hover:bg-gray-100 whitespace-nowrap flex items-center gap-1.5 text-gray-700 w-full sm:w-auto", snippetRoundedButton)}>
                        <Share2 className="h-3 w-3" />
                        Share Link
                    </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Setup Section */}
          <div className="bg-card rounded-xl shadow-sm p-6 md:p-8 mb-6 md:mb-8 border-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Quick Setup Guide</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {setupSteps.filter(s => s.completed).length} of {setupSteps.length} completed
                </span>
                <div className={cn("w-6 h-6 flex items-center justify-center rounded-full bg-opacity-10", snippetPrimaryBgClass, snippetPrimaryTextClass)}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {setupSteps.map((step, index) => (
                <div key={index} className={cn("transition-all duration-200 hover:bg-gray-100 p-4 rounded-lg border", step.bgColor, step.borderColor, step.completed ? 'bg-green-50 border-green-200' : 'bg-card border-gray-200')}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                    <div className="flex items-center space-x-3">
                      <div className={cn("w-10 h-10 flex items-center justify-center rounded-full shrink-0", step.completed ? 'bg-green-100' : 'bg-gray-100')}>
                        <step.IconEl className={cn("h-5 w-5", step.completed ? 'text-green-600' : 'text-gray-600')} />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground text-sm">{step.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{step.description}</p>
                      </div>
                    </div>
                    <Button 
                        asChild={!!step.href} 
                        size="sm"
                        variant={step.completed ? "link" : "default"}
                        className={cn(
                            "text-xs px-3 py-1.5 h-auto whitespace-nowrap w-full sm:w-auto mt-2 sm:mt-0",
                            step.completed ? cn("font-medium p-0 h-auto", snippetPrimaryTextClass) : cn(snippetPrimaryBgClass, "text-primary-foreground", snippetRoundedButton, "hover:bg-opacity-90")
                        )}
                    >
                        {step.href ? (
                            <Link href={step.href} className="flex items-center gap-1">
                                {step.buttonText}
                                {step.completed && <ArrowRight className="h-3 w-3" />}
                            </Link>
                        ) : (
                            <span className="flex items-center gap-1">
                                {step.buttonText}
                                {step.completed && <ArrowRight className="h-3 w-3" />}
                            </span>
                        )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {dashboardMetrics.map((metric, index) => (
            <div key={index} className="bg-card rounded-xl shadow-sm p-4 md:p-5 border-0">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">{metric.title}</p>
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-1">{metric.value}</h3>
                        {metric.trend && (
                            <div className={cn("flex items-center mt-1 text-xs", metric.trendColor)}>
                                {metric.TrendIconEl && <metric.TrendIconEl className={cn("h-3.5 w-3.5")} />}
                                <span className="font-medium ml-0.5">{metric.trend}</span>
                                <span className="text-muted-foreground ml-1 text-[10px]">from last month</span>
                            </div>
                        )}
                    </div>
                    <div className={cn("w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md text-sm shrink-0", metric.iconBg, metric.iconColor)}>
                        <metric.IconEl className="h-4 w-4 md:h-5 md:h-5" />
                    </div>
                </div>
            </div>
            ))}
        </div>
        
        {/* Charts - Placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
            <div className="bg-card rounded-xl shadow-sm p-5 lg:col-span-2 border-0">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Monthly User Sessions</h2>
                    <div className="flex items-center">
                        <div className="relative">
                            <Button variant="outline" className={cn("flex items-center gap-2 text-xs text-gray-600 border-gray-200 px-2.5 py-1 h-auto hover:bg-gray-50", snippetRoundedButton)}>
                                <span>Last 6 Months</span>
                                <ChevronDown className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div id="monthly-sessions-chart" className="w-full h-[280px] md:h-[300px] bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Monthly Sessions</div>
            </div>
            
            <div className="bg-card rounded-xl shadow-sm p-5 border-0">
                <h2 className="text-lg font-semibold text-foreground mb-6">Traffic Sources</h2>
                <div id="traffic-sources-chart" className="w-full h-[280px] md:h-[300px] bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">Chart: Traffic Sources</div>
            </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-6 md:mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5">
            {quickActions.map((action, index) => (
                <Link key={index} href={action.href || "#"} className="block">
                    <div className="bg-card rounded-xl shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between transform hover:-translate-y-1 border-0">
                        <div>
                            <div className={cn("w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg mb-3 md:mb-4", action.iconBg)}>
                                <action.IconEl className={cn("h-5 w-5 md:h-6 md:h-6", action.iconTextColor)} />
                            </div>
                            <h3 className="font-medium text-foreground text-sm md:text-base">{action.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{action.description}</p>
                        </div>
                         <Button variant="link" size="sm" className={cn("mt-3 text-xs p-0 h-auto font-medium self-start whitespace-nowrap flex items-center gap-1", snippetPrimaryTextClass, "!rounded-none")}>
                            Go to {action.title.split(" ")[0]} <ArrowRight className="h-3 w-3"/>
                        </Button>
                    </div>
                </Link>
            ))}
            </div>
        </div>

          {/* Upcoming Tuition Demos Section */}
          {demoSessions.length > 0 && (
            <div className="bg-card rounded-xl shadow-sm p-6 md:p-8 mb-6 md:mb-8 border-0">
              <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Tuition Demos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demoSessions.slice(0, 3).map(demo => (
                  <DemoSessionCard 
                    key={demo.id} 
                    demo={demo} 
                    onUpdateSession={handleUpdateDemoSession}
                    onCancelSession={handleCancelDemoSession}
                  />
                ))}
              </div>
              {demoSessions.length > 3 && (
                <div className="mt-6 text-center">
                  <Button variant="outline" asChild className={cn("text-sm", snippetRoundedButton)}>
                    <Link href="/dashboard/demo-sessions">View All Demos</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
