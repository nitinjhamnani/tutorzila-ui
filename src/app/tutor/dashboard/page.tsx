
"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { User, TutorProfile, DemoSession, MyClass } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MOCK_DEMO_SESSIONS, MOCK_CLASSES } from "@/lib/mock-data";
// import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard"; // Temporarily removed
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  User, CalendarDays, CheckCircle2, Star, DollarSign, Eye, ArrowUp, ArrowDown, Percent,
  Briefcase, UserCog, LifeBuoy, Settings as SettingsIcon, Presentation, RadioTower, Clock as ClockIcon,
  BookOpen as BookOpenIcon, Globe as GlobeIcon, FileText, Palette, Link as LinkIcon, UploadCloud, Ruler,
  FilterIcon as LucideFilterIcon, ListFilter, Users as UsersIcon, BarChart2, MessageSquare, ShoppingBag,
  HardDrive, LayoutGrid, Crown, Share2, ArrowRight, Camera, Menu as MenuIcon, Info, Bell
} from "lucide-react";
import logoAsset from '@/assets/images/logo.png';


// QuickActionCard and its props (simplified for now)
interface QuickActionCardProps {
  title: string;
  description: string;
  IconEl: React.ElementType;
  href: string;
  disabled?: boolean;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description, IconEl, href, disabled }) => {
  const LinkOrDiv = disabled ? 'div' : Link;
  return (
    <LinkOrDiv href={disabled ? "#" : href} passHref={!disabled} legacyBehavior={!disabled}>
      <a className={cn("block", disabled && "opacity-60 cursor-not-allowed")}>
        <div className="bg-card rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between border-0 transform hover:-translate-y-1">
          <div>
            <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg text-sm shrink-0 mb-3", "bg-primary/10 text-primary")}>
              <IconEl className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-foreground text-sm mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
          </div>
          <Button variant="link" className="mt-3 text-xs text-primary p-0 justify-start h-auto whitespace-nowrap" disabled={disabled}>
            {disabled ? "Coming Soon" : "Go"}
            {!disabled && <ArrowRight className="ml-1 w-3 h-3" />}
          </Button>
        </div>
      </a>
    </LinkOrDiv>
  );
};

export default function TutorDashboardPage() {
  const { user, isAuthenticated, isCheckingAuth, logout } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null;
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<Array<{ type: 'demo' | 'class'; data: DemoSession | MyClass; sortDate: Date }>>([]);
  const isMobile = useIsMobile();

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

      // Temporarily simplify upcoming sessions
      setUpcomingSessions([]);

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

  if (isCheckingAuth || !user) {
    return <div className="flex min-h-screen items-center justify-center p-4 text-muted-foreground">Loading Tutor Dashboard...</div>;
  }
  if (!tutorUser || tutorUser.role !== 'tutor') {
    return <div className="flex min-h-screen items-center justify-center p-4 text-muted-foreground">Access Denied.</div>;
  }

  const dashboardMetrics = [
    { title: "Total Sessions", value: "3,287", trend: "12.5% from last month", IconEl: User, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Product Inquiries", value: "144", trend: "8.2% from last week", IconEl: MessageSquare, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Conversion Rate", value: "3.6%", trend: "1.8% from last month", IconEl: Percent, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-red-500", TrendIconEl: ArrowDown },
    { title: "Avg. Rating", value: tutorUser.rating?.toFixed(1) || "N/A", trend: "+0.1", IconEl: Star, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Total Earnings", value: `₹${(12500).toFixed(0)}`, trend: "+₹1.2k", IconEl: DollarSign, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
    { title: "Profile Views", value: String(289), trend: "5.1%", IconEl: Eye, iconBg: "bg-primary/10", iconColor: "text-primary", trendColor: "text-green-600", TrendIconEl: ArrowUp },
  ];

  const quickActions = [
    { title: "My Enquiries", description: "View & respond to requests", IconEl: Briefcase, href: "/tutor/enquiries" },
    { title: "My Classes", description: "Manage scheduled classes", IconEl: CalendarDays, href: "/tutor/classes" },
    { title: "Edit Profile", description: "Update personal & tutoring details", IconEl: UserCog, href: "/tutor/edit-personal-details" },
    { title: "My Payments", description: "View earnings & history", IconEl: DollarSign, href: "/tutor/payments" },
    { title: "Demo Sessions", description: "Manage demo requests", IconEl: RadioTower, href: "/tutor/demo-sessions" },
    { title: "View Public Profile", description: "See your profile", IconEl: Eye, href: `/tutors/${tutorUser.id}`, disabled: !tutorUser.id },
    { title: "Support", description: "Get help or report issues", IconEl: LifeBuoy, href: "#", disabled: true },
    { title: "Account Settings", description: "Adjust account settings", IconEl: SettingsIcon, href: "/tutor/my-account" },
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
                                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">Hello, {tutorUser.name} 👋</h1>
                                <p className="text-xs text-gray-600 mt-1 tz-text-vsm">Welcome back to your dashboard</p>
                                
                                <div className="mt-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-600 tz-text-vsm">Setup progress</span>
                                        <span className={cn("text-sm font-medium tz-text-vsm", `text-primary`)}>{completionPercentage}%</span>
                                    </div>
                                    <Progress value={completionPercentage} className="h-2 rounded-full bg-gray-100" indicatorClassName={cn("rounded-full", `bg-primary`)} />
                                    {completionPercentage < 100 && (
                                        <Link href="/tutor/edit-personal-details" className={cn("mt-1 block hover:underline tz-text-vsm font-medium", `text-primary`)}>
                                            Complete Your Profile
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-start w-full md:w-auto">
                            <div className="bg-secondary rounded-lg p-4 w-full sm:w-auto sm:min-w-[200px]">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-gray-600 tz-text-vsm">Current Plan</p>
                                        <p className="font-semibold text-gray-800">Business Pro</p>
                                        <p className="text-xs text-gray-500 mt-1 tz-text-vsm">Expires on April 28, 2025</p>
                                    </div>
                                    <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0", "bg-primary/10 text-primary")}>
                                        <Crown className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
                                <Button variant="default" className={cn("bg-primary text-primary-foreground px-3 py-1.5 md:px-4 md:py-2 rounded-button whitespace-nowrap hover:bg-primary/90 transition-colors text-xs md:text-sm font-medium w-full xs:w-auto")}>
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
                
                {/* Dashboard Metrics -- Temporarily simplified rendering */}
                <div className="mb-6 md:mb-8">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Dashboard Metrics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                        {dashboardMetrics.slice(0,3).map((metric, index) => ( // Display only first 3 for testing
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

                 {/* Upcoming Sessions -- Temporarily simplified rendering */}
                <div className="mb-6 md:mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground">Upcoming Sessions</h2>
                        <Button variant="link" size="sm" className="text-xs text-primary p-0 h-auto" asChild>
                            <Link href="/tutor/demo-sessions">View All Demos</Link>
                        </Button>
                    </div>
                    {upcomingSessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                            {/* Placeholder: {upcomingSessions.map((session) => <div key={session.data.id}>Upcoming Session</div>)} */}
                            <div>Upcoming sessions will appear here.</div>
                        </div>
                    ) : (
                        <Card className="bg-card rounded-xl shadow-lg p-5 border-0 text-center">
                            <CardContent className="pt-6">
                                <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground">No upcoming sessions scheduled.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Quick Actions -- Temporarily simplified rendering */}
                <div className="mb-6 md:mb-8">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {quickActions.slice(0,4).map((action) => ( // Display only first 4 for testing
                            <QuickActionCard key={action.title} {...action} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

