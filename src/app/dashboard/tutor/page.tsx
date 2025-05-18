
"use client";

import React, { useState, useEffect, useRef, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { TutorProfile, DemoSession, MyClass } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MOCK_DEMO_SESSIONS, MOCK_CLASSES } from "@/lib/mock-data";
import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  User, CalendarDays, CheckCircle2, Star, DollarSign, Eye, ArrowUp, ArrowDown, Percent,
  Briefcase, UserCog, LifeBuoy, Settings as SettingsIcon, Presentation, RadioTower,
  Clock as ClockIcon, BookOpen as BookOpenIcon, Globe as GlobeIcon, FileText, Palette,
  Link as LinkIcon, UploadCloud, Ruler, FilterIcon as LucideFilterIcon, ListFilter,
  Users as UsersIcon, BarChart2, MessageSquare, ShoppingBag, HardDrive,
  LayoutGrid, Crown, Share2, ArrowRight, PanelLeft, Camera, Menu, Info, Bell
} from "lucide-react";
import { isSameDay, parseISO, format } from 'date-fns';

// QuickActionCard definition (moved to top-level for clarity)
interface QuickActionCardProps {
  title: string;
  description: string;
  IconEl: React.ElementType;
  href: string;
  disabled?: boolean;
  buttonText?: string;
  iconBg?: string;
  iconTextColor?: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description, IconEl, href, disabled, buttonText = "Go", iconBg = "bg-primary/10", iconTextColor = "text-primary" }) => {
  if (disabled) {
    return (
      <div className={cn("block h-full", "opacity-60 cursor-not-allowed")}>
        <div className="bg-card rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between border-0 transform hover:-translate-y-1">
          <div>
            <div className={cn("w-12 h-12 flex items-center justify-center rounded-lg text-xl shrink-0 mb-4", iconBg, iconTextColor)}>
              <IconEl className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground text-base mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
          </div>
          <Button variant="link" className="mt-4 text-xs text-primary p-0 justify-start h-auto" disabled>
            Coming Soon
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Link href={href} passHref legacyBehavior>
      <a className={cn("block h-full")}>
        <div className="bg-card rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between border-0 transform hover:-translate-y-1">
          <div>
            <div className={cn("w-12 h-12 flex items-center justify-center rounded-lg text-xl shrink-0 mb-4", iconBg, iconTextColor)}>
              <IconEl className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground text-base mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
          </div>
          <Button variant="link" className="mt-4 text-xs text-primary p-0 justify-start h-auto">
            {buttonText} <ArrowRight className="ml-1 w-3 h-3" />
          </Button>
        </div>
      </a>
    </Link>
  );
};


export default function TutorDashboardPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
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

      // Simplified upcoming sessions logic
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let combined: Array<{ type: 'demo' | 'class'; data: DemoSession | MyClass; sortDate: Date }> = [];
      
      // Example: Add one mock demo if available for simplicity
      const mockDemo = MOCK_DEMO_SESSIONS.find(d => (d.tutorName === tutorUser.name || d.tutorId === tutorUser.id) && d.status === "Scheduled" && new Date(d.date) >= today);
      if (mockDemo) {
        combined.push({ type: 'demo', data: mockDemo, sortDate: new Date(mockDemo.date) });
      }
      setUpcomingSessions(combined.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime()));
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

  // Simplified data for metrics and actions to ensure parsing
  const dashboardMetrics = [
    { title: "Total Sessions", value: "0", trend: "N/A", IconEl: User, iconBg: "bg-primary/10", iconColor: "text-primary", TrendIconEl: ArrowUp },
  ];

  const quickActions = [
    { title: "My Enquiries", description: "View and respond to tuition requests.", IconEl: Briefcase, href: "/tutor/enquiries", buttonText: "View Enquiries" },
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
                                <h1 className="text-xl md:text-2xl font-semibold text-foreground">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                                <p className="tz-text-vsm text-gray-600 mt-1">Welcome back to your dashboard</p>
                                
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="tz-text-vsm text-gray-600">Setup progress</span>
                                        <span className={cn("tz-text-vsm font-medium", "text-primary")}>{completionPercentage}%</span>
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
                    </div>
                </div>
                
                {/* Dashboard Metrics Simplified */}
                {dashboardMetrics.length > 0 && (
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Dashboard Metrics</h2>
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
                )}

                {/* Upcoming Sessions Simplified */}
                 {upcomingSessions.length > 0 && (
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Upcoming Sessions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                            {upcomingSessions.map((session, index) => (
                                <UpcomingSessionCard
                                    key={`${session.type}-${session.data.id}-${index}`}
                                    sessionDetails={session}
                                    onUpdateSession={(updatedDemo) => console.log("Update Demo (mock):", updatedDemo)}
                                    onCancelSession={(sessionId) => console.log("Cancel Demo (mock):", sessionId)}
                                />
                            ))}
                        </div>
                    </div>
                )}
                 {upcomingSessions.length === 0 && (
                     <div className="mb-6 md:mb-8 p-6 bg-card rounded-xl shadow-lg text-center border-0">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3">Upcoming Sessions</h2>
                        <p className="text-sm text-muted-foreground">No upcoming sessions scheduled yet.</p>
                    </div>
                )}
                
                {/* Quick Actions Simplified */}
                {quickActions.length > 0 && (
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {quickActions.map((action) => (
                            <QuickActionCard key={action.title} {...action} />
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
  );
}

