
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
  Eye, Camera, CheckCircle, DollarSign, InfoIcon, Edit3, UserCircle, ClipboardList, UsersRound,
  Briefcase, CalendarDays, RadioTower, MapPin, ShieldCheck, Construction,
  CalendarIcon as LucideCalendarIcon, XCircle, Star,
  BellDot, Cog, Users as UsersIconLucide, Activity, NotebookPen,
  GraduationCap, Wallet, CalendarCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import logoAsset from '@/assets/images/logo.png'; // Assuming logo.png is in public/assets/images
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { DemoSessionCard } from "@/components/dashboard/DemoSessionCard";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger as ShadDialogTrigger } from "@/components/ui/dialog";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";


const snippetPrimaryText = "text-[#4F46E5]"; // From snippet
const snippetRoundedButton = "!rounded-button"; // Custom class for 8px from snippet


export default function TutorDashboardPage() {
  const { user, isAuthenticated, logout } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const { toast } = useToast();

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const [demoSessions, setDemoSessions] = useState(MOCK_DEMO_SESSIONS);
  const [mockDaysLeft, setMockDaysLeft] = useState(Math.floor(Math.random() * 60) + 30);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (tutorUser && isClient) {
      let completedFields = 0;
      const totalFields = 5;

      if (tutorUser.avatar && !tutorUser.avatar.includes('pravatar.cc') && !tutorUser.avatar.includes('avatar.vercel.sh')) completedFields++;
      if (tutorUser.subjects && tutorUser.subjects.length > 0) completedFields++;
      if (tutorUser.experience && tutorUser.experience.trim() !== "") completedFields++;
      if (tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== "") completedFields++;
      if (tutorUser.qualifications && tutorUser.qualifications.length > 0) completedFields++;

      setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
    }
  }, [tutorUser, isClient]);

  const handleUpdateDemo = (updatedDemo: (typeof demoSessions)[0]) => {
    setDemoSessions(prev => prev.map(d => d.id === updatedDemo.id ? updatedDemo : d));
    toast({ title: "Demo Session Updated", description: `Demo with ${updatedDemo.studentName} has been updated.` });
  };

  const handleCancelDemo = (sessionId: string) => {
    setDemoSessions(prev => prev.map(d => d.id === sessionId ? { ...d, status: "Cancelled" } : d));
    toast({ variant: "destructive", title: "Demo Session Cancelled" });
  };


  if (!isClient || !isAuthenticated || !tutorUser || tutorUser.role !== 'tutor') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-muted-foreground">Loading dashboard or not authorized...</p>
      </div>
    );
  }

  const dashboardMetrics = [
    { title: "Active Classes", value: "3", trend: "1 new", IconEl: User, iconBg: "bg-blue-50", iconColor: snippetPrimaryText, trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Demos Completed", value: "7", trend: "1.0%", IconEl: CheckCircle2, iconBg: "bg-green-50", iconColor: "text-green-600", trendColor: "text-red-500", TrendIconEl: ArrowDown },
    { title: "Avg. Rating", value: "4.7", trend: "+0.2", IconEl: Star, iconBg: "bg-yellow-50", iconColor: "text-yellow-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Earnings", value: "₹12.5k", trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Profile Views", value: "289", trend: "5.1%", IconEl: Eye, iconBg: "bg-teal-50", iconColor: "text-teal-600", trendColor: "text-green-600", TrendIconEl: ArrowUp },
  ];

  const quickActions = [
     { title: "Image Save Settings", description: "Configure how images are saved", IconEl: ImageIcon, href:"#" },
     { title: "Personalize Catalog", description: "Customize your product catalog", IconEl: BookOpenIcon, href:"#" },
     { title: "Add to Website", description: "Integrate your catalog", IconEl: GlobeIcon, href: "#" },
     { title: "Custom Room Log", description: "View custom configurations", IconEl: FileText, href: "#" },
     { title: "Raise Support Ticket", description: "Get help from our team", IconEl: LifeBuoy, href: "#" },
     { title: "User Permissions", description: "Manage team access", IconEl: UserCog, href: "#" },
     { title: "Advanced Analytics", description: "Dive deeper into data", IconEl: BarChart2, href: "#" },
     { title: "API Integration", description: "Connect with third-party services", IconEl: Settings2Icon, href: "#" },
  ];
  
  const snippetPrimaryColor = '#4F46E5';
  const snippetSecondaryColor = '#f59e0b';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Welcome Section */}
           <div className="bg-card rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                 <div className="relative group shrink-0">
                  <Avatar
                    className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/20 group-hover:opacity-80 transition-opacity cursor-pointer shadow-sm"
                  >
                    <AvatarImage src={tutorUser.avatar || `https://avatar.vercel.sh/${tutorUser.email}.png`} alt={tutorUser.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl md:text-2xl">
                      {tutorUser.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    className="absolute -bottom-1 -right-1 md:-bottom-1.5 md:-right-1.5 flex items-center justify-center bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                    aria-label="Update profile picture"
                    onClick={() => document.getElementById('avatar-upload-input')?.click()}
                  >
                    <Camera className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </button>
                  <input type="file" id="avatar-upload-input" accept="image/*" className="hidden" />
                </div>
                <div className="flex-grow">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Welcome back to your dashboard</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm text-muted-foreground">Setup progress</span>
                      <span className="text-xs sm:text-sm font-medium" style={{ color: snippetPrimaryColor }}>{completionPercentage}%</span>
                    </div>
                    <Progress
                      value={completionPercentage}
                      className="h-1.5 rounded-full bg-gray-100"
                      indicatorClassName={cn("rounded-full")}
                      style={{ backgroundColor: snippetPrimaryColor }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="bg-gray-50 rounded-lg p-3 w-full sm:min-w-[180px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Current Plan</p>
                      <p className="font-semibold text-gray-800 text-sm">Business Pro</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Expires on April 28, 2025</p>
                    </div>
                    <div className="w-7 h-7 flex items-center justify-center bg-blue-50 rounded text-sm" style={{ color: snippetPrimaryColor }}>
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                  <Button className="text-white px-3 py-1.5 text-xs rounded-button whitespace-nowrap hover:bg-opacity-90 transition-colors w-full xs:w-auto" style={{ backgroundColor: snippetPrimaryColor }}>
                    Upgrade Plan
                  </Button>
                  <Button variant="outline" className="bg-card border border-gray-200 text-gray-700 px-3 py-1.5 text-xs rounded-button whitespace-nowrap hover:bg-gray-50 transition-colors flex items-center gap-1.5 w-full xs:w-auto">
                    <Share2 className="w-3 h-3" />
                    Share Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
            {dashboardMetrics.map((metric, index) => (
              <div key={index} className="bg-card rounded-xl shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{metric.title}</p>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mt-1">{metric.value}</h3>
                    {metric.trend && (
                      <div className={cn("flex items-center mt-0.5 text-[10px]", metric.trendColor)}>
                        {metric.TrendIconEl && <metric.TrendIconEl className="w-3 h-3" />}
                        <span className="font-medium ml-0.5">{metric.trend}</span>
                        <span className="text-muted-foreground ml-1 text-[9px]">from last month</span>
                      </div>
                    )}
                  </div>
                  <div className={cn("w-8 h-8 flex items-center justify-center rounded-md text-sm shrink-0", metric.iconBg, metric.iconColor)}>
                    <metric.IconEl className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Feature Access / Quick Actions */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-4 md:mb-5">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href || "#"} className="block">
                  <div className="bg-card rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between transform hover:-translate-y-0.5">
                    <div>
                      <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg mb-3", 
                        index % 4 === 0 ? 'bg-blue-50 text-[#4F46E5]' : 
                        index % 4 === 1 ? 'bg-purple-50 text-purple-600' :
                        index % 4 === 2 ? 'bg-green-50 text-green-600' :
                        'bg-orange-50 text-orange-500'
                      )}>
                        <action.IconEl className="w-5 h-5" />
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
