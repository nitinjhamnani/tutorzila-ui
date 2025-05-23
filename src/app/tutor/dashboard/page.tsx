
"use client";

import type { ReactNode, ElementType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { User, TutorProfile, DemoSession, MyClass } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MOCK_DEMO_SESSIONS, MOCK_CLASSES } from "@/lib/mock-data";
import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard";
import { ManageDemoModal } from "@/components/modals/ManageDemoModal";
import {
  LayoutGrid,
  User,
  MessageSquare,
  Percent,
  Star,
  DollarSign,
  Eye,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Briefcase,
  CalendarDays,
  UserCog,
  LifeBuoy,
  Settings as SettingsIcon,
  Presentation,
  RadioTower,
  Clock as ClockIcon,
  Image as LucideImage, // Alias Image from lucide-react
  BookOpen as BookOpenIcon,
  Globe as GlobeIcon,
  FileText,
  Palette,
  Link as LinkIcon,
  UploadCloud,
  Ruler,
  Filter as FilterIconLucide,
  ListFilter,
  Users as UsersIcon,
  BarChart2,
  ShoppingBag,
  HardDrive,
  Crown,
  Share2,
  ArrowRight,
  PanelLeft,
  Camera,
  Menu as MenuIcon,
  Info,
  Bell,
  PlusCircle,
  Send, // Added Send icon import
} from "lucide-react";
import React, { useEffect, useState, useMemo, useRef, ChangeEvent } from "react";

// Define props for the QuickActionCard
interface QuickActionCardProps {
  title: string;
  description: string;
  IconEl: ElementType;
  href: string;
  disabled?: boolean;
  buttonText?: string;
}

// QuickActionCard component definition (remains at top level)
function QuickActionCard({ title, description, IconEl, href, disabled, buttonText }: QuickActionCardProps) {
  const content = (
    <div className="bg-card rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between border-0 transform hover:-translate-y-1">
      <div>
        <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg text-primary mb-3">
          <IconEl className="w-5 h-5" />
        </div>
        <h3 className="font-medium text-foreground text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
      </div>
      <div className="mt-4 text-sm text-primary font-medium flex items-center gap-1 whitespace-nowrap">
        {buttonText || (disabled ? "Coming Soon" : "Go")}
        {!disabled && <ArrowRight className="ml-1 w-3 h-3" />}
      </div>
    </div>
  );

  if (disabled) {
    return <div className="block h-full opacity-60 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}


export default function TutorDashboardPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null;

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [upcomingSessions, setUpcomingSessions] = useState<Array<{ type: 'demo' | 'class'; data: DemoSession | MyClass; sortDate: Date }>>([]);
  const [selectedDemoForModal, setSelectedDemoForModal] = useState<DemoSession | null>(null);
  const [isManageDemoModalOpen, setIsManageDemoModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || (isAuthenticated && user?.role !== 'tutor')) {
        router.replace("/");
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, user, router]);
  
  useEffect(() => {
    if (tutorUser) {
      let completedFields = 0;
      const totalFields = 5; // Number of fields contributing to profile completion
      if (tutorUser.avatar && !tutorUser.avatar.includes('pravatar.cc') && !tutorUser.avatar.includes('avatar.vercel.sh')) completedFields++;
      if (tutorUser.subjects && tutorUser.subjects.length > 0) completedFields++;
      if (tutorUser.bio && tutorUser.bio.trim() !== "") completedFields++;
      if (tutorUser.experience && tutorUser.experience.trim() !== "") completedFields++;
      if (tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== "") completedFields++;
      setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
    }
  }, [tutorUser]);

  const [mockInsights, setMockInsights] = useState({
    leadBalance: 0,
    activeLeads: 0,
    demosCompleted: 0,
    profileViews: 0,
    applicationsSent: 0,
    upcomingDemosCount: 0,
  });

  useEffect(() => {
    if (tutorUser) {
      // Filter demos relevant to the current tutor
      const tutorDemos = MOCK_DEMO_SESSIONS.filter(
        d => d.tutorId === tutorUser.id || d.tutorName === tutorUser.name
      );
      // Filter classes relevant to the current tutor
      const tutorClasses = MOCK_CLASSES.filter(
        c => c.tutorId === tutorUser.id || c.tutorName === tutorUser.name
      );

      const upcomingDemosFiltered = tutorDemos
        .filter(d => d.status === "Scheduled" && new Date(d.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .map(d => ({ type: 'demo' as const, data: d, sortDate: new Date(d.date) }));

      const upcomingRegClassesFiltered = tutorClasses
        .filter(c => (c.status === "Upcoming" && c.startDate && new Date(c.startDate) >= new Date(new Date().setHours(0, 0, 0, 0))) || (c.status === "Ongoing" && c.nextSession && new Date(c.nextSession) >= new Date(new Date().setHours(0, 0, 0, 0))))
        .map(c => ({ type: 'class' as const, data: c, sortDate: new Date(c.nextSession || c.startDate!) }));

      const combined = [...upcomingDemosFiltered, ...upcomingRegClassesFiltered].sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
      setUpcomingSessions(combined);

      // Update insights (random parts only on initial relevant user load)
      setMockInsights(prev => ({
        ...prev,
        leadBalance: prev.leadBalance || (Math.floor(Math.random() * 50) + 10),
        activeLeads: prev.activeLeads || (Math.floor(Math.random() * 10) + 2),
        profileViews: prev.profileViews || (Math.floor(Math.random() * 200) + 50),
        applicationsSent: prev.applicationsSent || (Math.floor(Math.random() * 30) + 5),
        demosCompleted: tutorDemos.filter(d => d.status === "Completed").length,
        // upcomingDemosCount: upcomingDemosFiltered.length, // Renamed to upcomingDemosCount
      }));
    }
  }, [tutorUser, hasMounted]);


  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: "Profile Picture Selected", description: `Mock: ${file.name} would be uploaded.` });
      // In a real app, you would upload the file and update user.avatar
    }
  };

  const handleUpdateDemoSession = (updatedDemo: DemoSession) => {
    setUpcomingSessions(prevSessions =>
      prevSessions.map(session =>
        session.type === 'demo' && session.data.id === updatedDemo.id
          ? { ...session, data: updatedDemo, sortDate: new Date(updatedDemo.date) }
          : session
      ).sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
    );
    // Also update the MOCK_DEMO_SESSIONS array if needed for global consistency
    const demoIndexInMock = MOCK_DEMO_SESSIONS.findIndex(d => d.id === updatedDemo.id);
    if (demoIndexInMock > -1) {
      MOCK_DEMO_SESSIONS[demoIndexInMock] = updatedDemo;
    }
    toast({ title: "Demo Updated", description: `Demo with ${updatedDemo.studentName} updated.` });
    setIsManageDemoModalOpen(false);
  };

  const handleCancelDemoSession = (sessionId: string) => {
    setUpcomingSessions(prevSessions =>
      prevSessions.map(session =>
        session.type === 'demo' && session.data.id === sessionId
          ? { ...session, data: { ...session.data, status: "Cancelled" as const } }
          : session
      )
    );
     // Also update the MOCK_DEMO_SESSIONS array
    const demoIndexInMock = MOCK_DEMO_SESSIONS.findIndex(d => d.id === sessionId);
    if (demoIndexInMock > -1) {
      MOCK_DEMO_SESSIONS[demoIndexInMock].status = "Cancelled";
    }
    toast({ title: "Demo Cancelled", variant: "destructive" });
    setIsManageDemoModalOpen(false);
  };

  if (isCheckingAuth || !hasMounted || !isAuthenticated || !tutorUser) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Dashboard...</div>;
  }
  if (tutorUser.role !== 'tutor') {
     // This case should ideally be handled by the redirect in useEffect, but as a fallback
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Access Denied.</div>;
  }

  const dashboardMetrics = [
    { title: "Lead Balance", value: String(mockInsights.leadBalance), IconEl: DollarSign, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { title: "Active Leads", value: String(mockInsights.activeLeads), IconEl: UsersIcon, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { title: "Demos Completed", value: String(mockInsights.demosCompleted), IconEl: CheckCircle2, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { title: "Profile Views", value: String(mockInsights.profileViews), IconEl: Eye, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { title: "Applications Sent", value: String(mockInsights.applicationsSent), IconEl: Send, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { title: "Avg. Rating", value: tutorUser.rating?.toFixed(1) || "N/A", IconEl: Star, iconBg: "bg-primary/10", iconColor: "text-primary" },
  ];

  const quickActions: QuickActionCardProps[] = [
    { title: "My Enquiries", description: "View & respond to tuition requests", IconEl: Briefcase, href: "/tutor/enquiries", buttonText: "View Enquiries" },
    { title: "Demo Sessions", description: "Manage all your demo class activities", IconEl: Presentation, href: "/tutor/demo-sessions", buttonText: "Manage Demos"},
    { title: "My Classes", description: "Organize your scheduled classes", IconEl: CalendarDays, href: "/tutor/classes", buttonText: "Manage Classes" },
    { title: "My Payments", description: "Track your earnings and payment status", IconEl: DollarSign, href: "/tutor/payments", buttonText: "View Payments" },
    { title: "Edit Personal Details", description: "Update your personal information", IconEl: UserCog, href: "/tutor/edit-personal-details", buttonText: "Update Details" },
    { title: "Edit Tutoring Profile", description: "Showcase your expertise", IconEl: BookOpenIcon, href: "/tutor/edit-tutoring-details", buttonText: "Update Profile" },
    { title: "View Public Profile", description: "See how your profile looks to parents", IconEl: Eye, href: `/tutors/${tutorUser.id}`, disabled: !tutorUser.id, buttonText: "View Profile" },
    { title: "Support", description: "Get help or report issues", IconEl: LifeBuoy, href: "#", disabled: true, buttonText: "Get Support" },
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
                                <p className="text-xs text-muted-foreground mt-1">Welcome back to your dashboard</p>
                                
                                <div className="mt-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-muted-foreground">Setup progress</span>
                                        <span className={cn("text-xs font-medium", "text-primary")}>{completionPercentage}%</span>
                                    </div>
                                    <Progress value={completionPercentage} className="h-2 rounded-full bg-gray-100" indicatorClassName={cn("rounded-full", "bg-primary")} />
                                    {completionPercentage < 100 && (
                                        <Link href="/tutor/edit-personal-details" className={cn("mt-1 block hover:underline text-xs font-medium", "text-primary")}>
                                            Complete Your Profile
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                         <div className="flex flex-col sm:flex-row gap-4 items-start w-full md:w-auto md:items-start">
                            <div className={cn("rounded p-4 w-full sm:w-auto", "bg-secondary")}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Current Plan</p>
                                        <p className="font-semibold text-foreground">Business Pro</p>
                                        <p className="text-xs text-muted-foreground mt-1">Expires on April 28, 2025</p>
                                    </div>
                                    <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0", "bg-primary/10 text-primary")}>
                                        <Crown className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap xs:flex-nowrap gap-3 w-full sm:w-auto">
                                <Button variant="default" className={cn("bg-primary text-primary-foreground px-3 py-1.5 md:px-4 md:py-2 rounded-button whitespace-nowrap hover:bg-primary/90 transition-colors text-xs md:text-sm font-medium w-full xs:w-auto")}>
                                    Upgrade Plan
                                </Button>
                                <Button variant="outline" className={cn("border-border text-foreground px-3 py-1.5 md:px-4 md:py-2 rounded-button whitespace-nowrap hover:bg-muted flex items-center gap-1.5 text-xs md:text-sm font-medium w-full xs:w-auto", "bg-card")}>
                                  <div className="w-4 h-4 flex items-center justify-center">
                                    <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                                  </div>
                                  Share Link
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Dashboard Metrics Section */}
                <div className="mb-6 md:mb-8">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">My Insights</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                        {dashboardMetrics.map((metric, index) => (
                            <Card key={index} className="bg-card rounded-xl shadow-lg p-5 border-0">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">{metric.title}</p>
                                        <h3 className={cn("text-xl md:text-2xl font-semibold mt-0.5", metric.iconColor)}>{metric.value}</h3>
                                        {metric.trend && (
                                          <div className="flex items-center mt-1 text-xs">
                                              {metric.TrendIconEl && <metric.TrendIconEl className={cn("w-3 h-3", metric.trendColor)} />}
                                              <span className={cn("font-medium", metric.trendColor, metric.TrendIconEl && "ml-1")}>{metric.trend}</span>
                                          </div>
                                        )}
                                    </div>
                                    {metric.IconEl && (
                                      <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg text-sm shrink-0", metric.iconBg, metric.iconColor)}>
                                          <metric.IconEl className="w-5 h-5" />
                                      </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
                
                {/* Upcoming Sessions Section */}
                <div className="mb-6 md:mb-8">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground">Upcoming Sessions</h2>
                         <Button variant="link" size="sm" className="text-xs text-primary p-0 h-auto" asChild>
                           <Link href="/tutor/demo-sessions">View All Demos</Link>
                        </Button>
                    </div>
                    {upcomingSessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                            {upcomingSessions.slice(0, 3).map((session) => (
                                <UpcomingSessionCard 
                                    key={`${session.type}-${session.data.id}`} 
                                    sessionDetails={session}
                                    onUpdateSession={session.type === 'demo' ? handleUpdateDemoSession : undefined}
                                    onCancelSession={session.type === 'demo' ? handleCancelDemoSession : undefined}
                                />
                            ))}
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
                
                {/* Quick Actions Section */}
                <div className="mb-6 md:mb-8">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                        {quickActions.map((action) => (
                          <QuickActionCard
                            key={action.title}
                            title={action.title}
                            description={action.description}
                            IconEl={action.IconEl}
                            href={action.href}
                            disabled={action.disabled}
                            buttonText={action.buttonText}
                          />
                        ))}
                    </div>
                </div>
                 {selectedDemoForModal && (
                <ManageDemoModal
                    isOpen={isManageDemoModalOpen}
                    onOpenChange={setIsManageDemoModalOpen}
                    demoSession={selectedDemoForModal}
                    onUpdateSession={handleUpdateDemoSession}
                    onCancelSession={handleCancelDemoSession}
                />
                )}
            </div>
        </main>
    );
}

