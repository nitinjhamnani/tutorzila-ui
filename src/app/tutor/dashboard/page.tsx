
"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuthMock } from "@/hooks/use-auth-mock";
import type { TutorProfile, DemoSession, MyClass } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MOCK_DEMO_SESSIONS, MOCK_CLASSES } from "@/lib/mock-data";
import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  User,
  CalendarDays,
  CheckCircle2,
  Star,
  DollarSign,
  Eye,
  ArrowUp,
  ArrowDown,
  Percent,
  Briefcase,
  UserCog,
  LifeBuoy,
  Settings as SettingsIcon,
  Presentation,
  RadioTower,
  Clock as ClockIcon,
  BookOpen as BookOpenIcon,
  Globe as GlobeIcon,
  FileText,
  Palette,
  Link as LinkIcon,
  UploadCloud,
  Ruler,
  FilterIcon as LucideFilterIcon,
  ListFilter,
  Users as UsersIcon,
  BarChart2,
  MessageSquare,
  ShoppingBag,
  HardDrive,
  LayoutGrid,
  Crown,
  Share2,
  ArrowRight,
  Camera,
  Menu,
  Info,
  Bell
} from "lucide-react";
import logoAsset from '@/assets/images/logo.png';

interface QuickActionCardProps {
  title: string;
  description: string;
  IconEl: React.ElementType;
  href: string;
  disabled?: boolean;
  buttonText?: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description, IconEl, href, disabled, buttonText = "Go" }) => {
  return (
    <div className={cn("bg-card rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between border-0 transform hover:-translate-y-1", disabled && "opacity-60 cursor-not-allowed")}>
      <div>
        <div className={cn("w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg text-primary mb-4")}>
          <IconEl className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-foreground text-base">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
      </div>
      <Button asChild variant="link" className="mt-4 text-xs text-primary p-0 justify-start" disabled={disabled}>
        <Link href={disabled ? "#" : href}>
          {disabled ? "Coming Soon" : buttonText} <ArrowRight className="ml-1 w-3 h-3" />
        </Link>
      </Button>
    </div>
  );
};

export default function TutorDashboardPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null;
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mockDaysLeft, setMockDaysLeft] = useState(23);
  const [upcomingSessions, setUpcomingSessions] = useState<Array<{ type: 'demo' | 'class'; data: DemoSession | MyClass; sortDate: Date }>>([]);

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

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const demos = MOCK_DEMO_SESSIONS.filter(
        (demo) => (demo.tutorName === tutorUser.name || demo.tutorId === tutorUser.id) &&
                   demo.status === "Scheduled" &&
                   new Date(demo.date) >= today
      ).map(d => ({ type: 'demo' as const, data: d, sortDate: new Date(d.date) }));

      const classes = MOCK_CLASSES.filter(
        (c) => (c.tutorName === tutorUser.name || c.tutorId === tutorUser.id) &&
               ((c.status === "Upcoming" && c.startDate && new Date(c.startDate) >= today) ||
                (c.status === "Ongoing" && c.nextSession && new Date(c.nextSession) >= today))
      ).map(c => ({ type: 'class' as const, data: c, sortDate: new Date(c.nextSession || c.startDate || Date.now()) }));
      
      const combinedSessions = [...demos, ...classes].sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
      setUpcomingSessions(combinedSessions);
    }
  }, [tutorUser]);

  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: "Profile Picture Selected", description: `Mock: ${file.name} would be uploaded.` });
    }
  };

  if (isCheckingAuth || !isAuthenticated || !tutorUser) {
    return <div className="flex min-h-screen items-center justify-center p-4 text-muted-foreground">Loading Tutor Dashboard...</div>;
  }

  const dashboardMetrics = [
    { title: "Total Sessions", value: "32", trend: "5 new", IconEl: CalendarDays, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Enquiries Responded", value: "18", trend: "90%", IconEl: MessageSquare, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Conversion Rate", value: "25%", trend: "2%", IconEl: Percent, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-red-500", TrendIconEl: ArrowDown },
    { title: "Avg. Rating", value: tutorUser.rating?.toFixed(1) || "N/A", trend: "+0.1", IconEl: Star, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Earnings", value: `₹12,500`, trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Profile Views", value: "289", trend: "5.1%", IconEl: Eye, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
  ];

  const quickActions = [
     { title: "My Enquiries", description: "View and respond to tuition requests.", IconEl: Briefcase, href:"/tutor/enquiries", buttonText: "View Enquiries"},
     { title: "My Classes", description: "Manage scheduled classes & content.", IconEl: CalendarDays, href:"/tutor/classes", buttonText: "Manage Classes" },
     { title: "Edit Profile", description: "Update personal & tutoring details.", IconEl: UserCog, href: "/tutor/my-account", buttonText: "Update Profile" },
     { title: "My Payments", description: "Track your earnings and payouts.", IconEl: DollarSign, href: "/tutor/payments", buttonText: "View Payments" },
     { title: "Demo Sessions", description: "Manage demo class requests and schedules.", IconEl: Presentation, href: "/tutor/demo-sessions", buttonText: "Manage Demos"},
     { title: "View Public Profile", description: "See how your profile appears.", IconEl: Eye, href: `/tutors/${tutorUser.id}`, buttonText: "View Profile" },
     { title: "Support", description: "Get help or report issues.", IconEl: LifeBuoy, href: "#", disabled: true, buttonText: "Get Support" },
     { title: "Settings", description: "Adjust account preferences.", IconEl: SettingsIcon, href: "#", disabled: true, buttonText: "Go to Settings" },
   ];

  return (
        <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                {/* Welcome Section */}
                <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8 border-0">
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
                                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                                <p className="text-xs text-muted-foreground mt-1 tz-text-vsm">Welcome back to your dashboard</p>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-muted-foreground tz-text-vsm">Setup progress</span>
                                        <span className={cn("text-xs font-medium tz-text-vsm", "text-primary")}>{completionPercentage}%</span>
                                    </div>
                                    <Progress value={completionPercentage} className="h-2 rounded-full bg-gray-100" indicatorClassName={cn("rounded-full", "bg-primary")} />
                                    {completionPercentage < 100 && (
                                        <Link href="/tutor/my-account" className={cn("mt-1 block hover:underline tz-text-vsm font-medium", "text-primary")}>
                                            Complete Your Profile
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 items-start w-full md:w-auto">
                            <div className="bg-secondary rounded-lg p-4 w-full sm:w-auto sm:min-w-[220px]">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground tz-text-vsm">Current Plan</p>
                                        <p className="font-semibold text-foreground text-sm">Business Pro</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 tz-text-vsm">Expires on April 28, 2025</p>
                                    </div>
                                    <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0", "bg-primary/10 text-primary")}>
                                        <Crown className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
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
                <div className="mb-6 md:mb-8">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Key Metrics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                        {dashboardMetrics.map((metric, index) => (
                            <div key={index} className="bg-card rounded-xl shadow-lg p-5 border-0">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm text-muted-foreground">{metric.title}</p>
                                        <h3 className={cn("text-xl sm:text-2xl font-semibold mt-0.5", metric.iconColor)}>{metric.value}</h3>
                                        {metric.trend && (
                                            <div className={cn("flex items-center mt-1 text-xs", metric.trendColor || "text-green-600")}>
                                                {metric.TrendIconEl && <metric.TrendIconEl className="w-3 h-3" />}
                                                <span className="font-medium ml-0.5">{metric.trend}</span>
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
                </div>

                {/* Upcoming Sessions Section */}
                {upcomingSessions.length > 0 && (
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Upcoming Sessions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                            {upcomingSessions.slice(0, 3).map((session, index) => (
                                <UpcomingSessionCard 
                                    key={`${session.type}-${session.data.id}-${index}`} 
                                    sessionDetails={session} 
                                    onUpdateSession={(updatedDemo) => console.log("Update Demo (mock):", updatedDemo)}
                                    onCancelSession={(sessionId) => console.log("Cancel Demo (mock):", sessionId)}
                                />
                            ))}
                        </div>
                        {upcomingSessions.length > 3 && (
                            <div className="text-center mt-4">
                                <Button variant="link" asChild className="text-primary hover:text-primary/90 text-sm">
                                    <Link href="/tutor/demo-sessions">View All Sessions <ArrowRight className="ml-1.5 h-3.5 w-3.5"/></Link>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Quick Actions Section */}
                <div className="mb-6 md:mb-8">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {quickActions.map((action) => (
                            <QuickActionCard key={action.title} {...action} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
  );
}

    