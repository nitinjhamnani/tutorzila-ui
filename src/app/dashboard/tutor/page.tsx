
"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { TutorProfile, DemoSession } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { DemoSessionCard } from "@/components/dashboard/DemoSessionCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  LayoutGrid,
  Info,
  DollarSign,
  User,
  Eye,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Ruler,
  FilterIcon,
  UploadCloud,
  Palette,
  Link as LinkIcon,
  UserPlus,
  BookOpen as BookOpenIcon,
  Globe as GlobeIcon,
  FileText,
  LifeBuoy,
  UserCog,
  BarChart2,
  Settings as SettingsIcon,
  Briefcase,
  CalendarDays,
  RadioTower,
  Presentation,
  Camera,
  Star,
  Percent,
  Clock,
  ShoppingBag,
  HardDrive,
  Crown,
  Share2,
  Bell,
  Menu,
  MailCheck,
  PhoneCall,
  MessageSquare,
  CheckCircle, 
  AlertTriangle,
  Mail,
  Phone,
  ShieldCheck,
  Edit3,
  Users as UsersIcon,
  MapPin,
  ListChecks,
  Search,
  XCircle,
  Bookmark,
  Archive,
  Send
} from "lucide-react";
import logoAsset from '@/assets/images/logo.png';


interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  IconEl: React.ElementType;
  iconBg: string;
  iconColor: string;
  trendColor?: string;
  TrendIconEl?: React.ElementType;
}

function MetricCard({ title, value, trend, IconEl, iconBg, iconColor, trendColor, TrendIconEl }: MetricCardProps) {
  return (
    <div className="bg-card rounded-none shadow-lg p-3 md:p-4 border-0">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <h3 className={cn("text-xl md:text-2xl font-semibold mt-0.5", iconColor)}>{value}</h3>
          {trend && TrendIconEl && (
            <div className={cn("flex items-center mt-0.5 text-xs", trendColor || "text-green-600")}>
              <TrendIconEl className="w-3 h-3" />
              <span className={cn("font-medium ml-0.5")}>{trend}</span>
            </div>
          )}
          {trend && !TrendIconEl && (
             <span className={cn("text-xs font-medium mt-0.5 block", trendColor || "text-green-600")}>{trend}</span>
          )}
        </div>
        <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0", iconBg, iconColor)}>
          <IconEl className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  IconEl: React.ElementType;
  href: string;
  disabled?: boolean;
  iconBg?: string;
  iconTextColor?: string;
}

function QuickActionCard({ title, description, IconEl, href, disabled, iconBg = "bg-primary/10", iconTextColor = "text-primary" }: QuickActionCardProps) {
  if (disabled) {
    return (
      <div className={cn("bg-card rounded-none shadow-lg p-5 h-full flex flex-col justify-between border-0 opacity-60 cursor-not-allowed")}>
        <div>
          <div className={cn("w-12 h-12 flex items-center justify-center rounded-lg mb-4", iconBg, iconTextColor)}>
            <IconEl className="w-6 h-6" />
          </div>
          <h3 className="font-medium text-foreground text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>
        <div className="mt-2 text-xs text-destructive font-medium">Coming Soon</div>
      </div>
    );
  }

  return (
    <Link href={href} passHref legacyBehavior={!disabled}>
      <a className={cn("block", disabled && "opacity-60 cursor-not-allowed")}>
        <div className="bg-card rounded-none shadow-lg p-5 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between border-0 transform hover:-translate-y-1">
          <div>
            <div className={cn("w-12 h-12 flex items-center justify-center rounded-lg mb-4", iconBg, iconTextColor)}>
              <IconEl className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-foreground text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
          </div>
          {/* Removed button for quick actions, the card itself is the link */}
        </div>
      </a>
    </Link>
  );
}

export default function TutorDashboardPage() {
  const { user, isAuthenticated, isCheckingAuth, logout } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null;
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mockDaysLeft, setMockDaysLeft] = useState(23); 
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  
  const [mockInsights, setMockInsights] = useState({
    leadBalance: 0,
    activeLeads: 0,
    demosCompleted: 0,
    profileViews: 0,
    applicationsSent: 0,
    upcomingDemos: 0,
  });

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated || !tutorUser || tutorUser.role !== 'tutor') {
        router.replace("/");
      }
    }
  }, [isAuthenticated, tutorUser, isCheckingAuth, router]);

  useEffect(() => {
    if (tutorUser) {
      let completedFields = 0;
      const totalFields = 5;
      if (tutorUser.avatar && !tutorUser.avatar.includes('pravatar.cc') && !tutorUser.avatar.includes('avatar.vercel.sh')) completedFields++;
      if (tutorUser.subjects && tutorUser.subjects.length > 0) completedFields++;
      if (tutorUser.bio && tutorUser.bio.trim() !== "") completedFields++;
      if (tutorUser.experience && tutorUser.experience.trim() !== "") completedFields++;
      if (tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== "") completedFields++;
      setCompletionPercentage(Math.round((completedFields / totalFields) * 100));

      const userDemos = MOCK_DEMO_SESSIONS.filter(
        (demo) => (demo.tutorName === tutorUser.name || demo.tutorId === tutorUser.id) && demo.status === "Scheduled"
      );
      setDemoSessions(userDemos);
      
      // Initialize random insight values once
      setMockInsights(prevInsights => ({
        ...prevInsights, // Keep existing non-random values or previous random if needed
        leadBalance: prevInsights.leadBalance || Math.floor(Math.random() * 50) + 10,
        activeLeads: prevInsights.activeLeads || Math.floor(Math.random() * 10) + 2,
        profileViews: prevInsights.profileViews || Math.floor(Math.random() * 200) + 50,
        applicationsSent: prevInsights.applicationsSent || Math.floor(Math.random() * 30) + 5,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorUser]); // Only re-initialize random parts if tutorUser changes

  useEffect(() => {
    // Update demo-dependent insights when demoSessions change
    setMockInsights(prevInsights => ({
      ...prevInsights,
      demosCompleted: demoSessions.filter(d => d.status === "Completed").length,
      upcomingDemos: demoSessions.filter(d => d.status === "Scheduled").length,
    }));
  }, [demoSessions]);


  if (isCheckingAuth || !isAuthenticated || !tutorUser) {
    return <div className="flex min-h-screen items-center justify-center p-4 text-muted-foreground">Loading Tutor Dashboard...</div>;
  }

  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: "Profile Picture Selected", description: `Mock: ${file.name} would be uploaded.` });
    }
  };
  
  const dashboardMetrics = [
    { title: "Total Sessions", value: "3,287", trend: "12.5% from last month", IconEl: User, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Product Inquiries", value: "144", trend: "8.2% from last week", IconEl: MessageSquare, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Conversion Rate", value: "3.6%", trend: "1.8% from last month", IconEl: Percent, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-red-500", TrendIconEl: ArrowDown },
    { title: "Avg. Rating", value: tutorUser.rating?.toFixed(1) || "N/A", trend: "+0.1", IconEl: Star, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Earnings", value: `₹${(Math.random() * 20000 + 5000).toFixed(0)}`, trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Profile Views", value: String(Math.floor(Math.random() * 300) + 50), trend: "5.1%", IconEl: Eye, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
  ];

  
  const quickActions = [
     { title: "My Enquiries", description: "View and respond to tuition requests.", IconEl: Briefcase, href:"/dashboard/enquiries", iconBg:"bg-primary/10", iconTextColor: "text-primary"},
     { title: "My Classes", description: "Manage scheduled classes.", IconEl: CalendarDays, href:"/dashboard/my-classes", iconBg:"bg-primary/10", iconTextColor: "text-primary" },
     { title: "Edit Profile", description: "Update personal & tutoring details.", IconEl: UserCog, href: "/dashboard/tutor/edit-personal-details", iconBg:"bg-primary/10", iconTextColor: "text-primary" },
     { title: "My Payments", description: "Track your earnings.", IconEl: DollarSign, href: "/dashboard/payments", iconBg:"bg-primary/10", iconTextColor: "text-primary" },
     { title: "Demo Sessions", description: "Manage demo classes.", IconEl: RadioTower, href: "/dashboard/demo-sessions", iconBg:"bg-primary/10", iconTextColor: "text-primary"},
     { title: "View Public Profile", description: "See your public profile.", IconEl: Eye, href: `/tutors/${tutorUser.id}`, iconBg:"bg-primary/10", iconTextColor: "text-primary" },
     { title: "Support", description: "Get help or report issues.", IconEl: LifeBuoy, href: "#", disabled: true, iconBg:"bg-muted/50", iconTextColor: "text-muted-foreground" },
     { title: "Settings", description: "Adjust account preferences.", IconEl: SettingsIcon, href: "/dashboard/settings", disabled: true, iconBg:"bg-muted/50", iconTextColor: "text-muted-foreground" },
   ];


  return (
    <div className="flex-grow"> 
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="bg-card rounded-none shadow-lg p-6 md:p-8 mb-6 md:mb-8 border-0">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/30 shadow-sm">
                  <AvatarImage src={tutorUser.avatar || `https://avatar.vercel.sh/${tutorUser.email}.png`} alt={tutorUser.name} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl md:text-2xl">
                    {tutorUser.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarUploadClick}
                  className={cn(
                    "absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 flex items-center justify-center p-1.5 rounded-full cursor-pointer shadow-md transition-colors",
                    "bg-primary/20 hover:bg-primary/30"
                  )}
                  aria-label="Update profile picture"
                >
                  <Camera className={cn("w-3 h-3 md:w-3.5 md:h-3.5", "text-primary")} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                <p className="text-xs text-gray-600 mt-1 tz-text-vsm">Welcome back to your dashboard</p>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 tz-text-vsm">Setup progress</span>
                    <span className={cn("text-xs font-medium tz-text-vsm", "text-primary")}>{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2 rounded-full bg-gray-100" indicatorClassName={cn("rounded-full", "bg-primary")} />
                   {completionPercentage < 100 && (
                      <Link href="/dashboard/tutor/edit-personal-details" className={cn("mt-1 block hover:underline tz-text-vsm font-medium", "text-primary")}>
                          Complete Your Profile
                      </Link>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="bg-secondary rounded p-4 w-full sm:w-auto sm:min-w-[200px]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 tz-text-vsm">Current Plan</p>
                    <p className="font-semibold text-gray-800">Business Pro</p>
                    <p className="text-xs text-gray-500 mt-1 tz-text-vsm">Expires on April 28, 2025</p>
                  </div>
                  <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0", "bg-primary/10 text-primary")}>
                      <Crown className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap xs:flex-nowrap gap-3 w-full sm:w-auto">
                <Button className={cn("bg-primary text-white px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-button whitespace-nowrap w-full xs:w-auto hover:bg-primary/90")}>
                    Upgrade Plan
                </Button>
                <Button variant="outline" className={cn("border-gray-200 text-gray-700 px-3 py-1.5 md:px-4 md:py-2 rounded-button whitespace-nowrap hover:bg-gray-50 flex items-center gap-1.5 text-xs md:text-sm font-medium w-full xs:w-auto", "bg-card")}>
                  <div className="w-4 h-4 flex items-center justify-center">
                      <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                  Share Link
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
          {dashboardMetrics.map((metric, index) => (
             <MetricCard key={index} {...metric} />
          ))}
        </div>
                          
        {/* Upcoming Tuition Demos - Only if there are sessions */}
        {demoSessions.length > 0 && (
          <div className="mb-6 md:mb-8">
              <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 md:mb-5">Upcoming Classes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {demoSessions.slice(0, 3).map((demo) => (
                  <DemoSessionCard
                  key={demo.id}
                  demo={demo}
                  onUpdateSession={(updatedDemo) => {
                      setDemoSessions(prev => prev.map(d => d.id === updatedDemo.id ? updatedDemo : d));
                      console.log("Demo updated (mock):", updatedDemo);
                  }}
                  onCancelSession={(sessionId) => {
                      setDemoSessions(prev => prev.map(d => d.id === sessionId ? {...d, status: "Cancelled"} : d));
                      console.log("Demo cancelled (mock):", sessionId);
                  }}
                  />
              ))}
              </div>
              {demoSessions.length > 3 && (
                  <div className="text-center mt-4">
                  <Button variant="link" asChild className="text-primary hover:text-primary/90 text-sm">
                      <Link href="/dashboard/demo-sessions">View All Demos <ArrowRight className="ml-1.5 h-3.5 w-3.5"/></Link>
                  </Button>
                  </div>
              )}
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 md:mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
