
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
import { cn } from "@/lib/utils";
import { MOCK_DEMO_SESSIONS, MOCK_CLASSES } from "@/lib/mock-data";
import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard";
import { ManageDemoModal } from "@/components/modals/ManageDemoModal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditTutoringDetailsForm } from "@/components/tutor/EditTutoringDetailsForm";
import {
  LayoutGrid,
  User as UserIconLucide,
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
  Image as LucideImage,
  BookOpen as BookOpenIcon,
  Globe as GlobeIcon,
  FileText,
  Palette,
  Link as LinkIconLucide,
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
  Send,
  Coins,
} from "lucide-react";
import React, { useEffect, useState, useMemo, useRef, ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { ActivationStatusCard } from "@/components/tutor/ActivationStatusCard";

interface QuickActionCardProps {
  title: string;
  description: string;
  IconEl: ElementType;
  href: string;
  disabled?: boolean;
  buttonText?: string;
}

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

const fetchTutorDashboardData = async (token: string | null) => {
  if (!token) throw new Error("No authentication token found.");
  // NOTE: This URL should be in an environment variable in a real application
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(`${apiBaseUrl}/api/tutor/dashboard`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "accept": "*/*",
    },
  });

  if (!response.ok) {
    // It's better to get a specific error message from the API if possible
    throw new Error("Failed to fetch tutor dashboard data.");
  }
  return response.json();
};

export default function TutorDashboardPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const tutorUser = user as TutorProfile | null;
  const { hideLoader } = useGlobalLoader();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [upcomingSessions, setUpcomingSessions] = useState<Array<{ type: 'demo' | 'class'; data: DemoSession | MyClass; sortDate: Date }>>([]);
  const [selectedDemoForModal, setSelectedDemoForModal] = useState<DemoSession | null>(null);
  const [isManageDemoModalOpen, setIsManageDemoModalOpen] = useState(false);
  const [isEditTutoringModalOpen, setIsEditTutoringModalOpen] = useState(false);

  const { data: dashboardData, isLoading: isLoadingDashboard, error: dashboardError } = useQuery({
    queryKey: ['tutorDashboard', token],
    queryFn: () => fetchTutorDashboardData(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, 
  });

  useEffect(() => {
    setHasMounted(true);
    hideLoader(); // Ensure loader is hidden when dashboard mounts
  }, [hideLoader]);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || (isAuthenticated && user?.role !== 'tutor')) {
        router.replace("/");
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, user, router]);

  useEffect(() => {
    if (tutorUser && hasMounted) {
      const tutorDemos = MOCK_DEMO_SESSIONS.filter(
        d => d.tutorId === tutorUser.id || d.tutorName === tutorUser.name
      );
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
    }
  }, [tutorUser, hasMounted]);

  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to your backend/storage
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
    const demoIndexInMock = MOCK_DEMO_SESSIONS.findIndex(d => d.id === updatedDemo.id);
    if (demoIndexInMock > -1) {
      MOCK_DEMO_SESSIONS[demoIndexInMock] = updatedDemo;
    }
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
    const demoIndexInMock = MOCK_DEMO_SESSIONS.findIndex(d => d.id === sessionId);
    if (demoIndexInMock > -1) {
      MOCK_DEMO_SESSIONS[demoIndexInMock].status = "Cancelled";
    }
    setIsManageDemoModalOpen(false);
  };

  if (isCheckingAuth || !hasMounted || !isAuthenticated || !tutorUser) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Dashboard...</div>;
  }
  if (tutorUser.role !== 'tutor') {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Access Denied.</div>;
  }

  const dashboardMetrics = [
    { title: "Coin Balance", value: String(dashboardData?.leadBalance ?? 0), IconEl: Coins, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { title: "Demo Scheduled", value: String(dashboardData?.demoScheduled ?? 0), IconEl: CalendarDays, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { title: "Profile Views", value: String(dashboardData?.profileViews ?? 0), IconEl: Eye, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { title: "Avg. Rating", value: dashboardData?.averageRating?.toFixed(1) || "N/A", IconEl: Star, iconBg: "bg-primary/10", iconColor: "text-primary" },
  ];

  const quickActions: QuickActionCardProps[] = [
    { title: "My Enquiries", description: "View & respond to tuition requests", IconEl: Briefcase, href: "/tutor/enquiries", buttonText: "View Enquiries" },
    { title: "Demo Sessions", description: "Manage all your demo class activities", IconEl: Presentation, href: "/tutor/demo-sessions", buttonText: "Manage Demos" },
    { title: "My Classes", description: "Organize your scheduled classes", IconEl: CalendarDays, href: "/tutor/classes", buttonText: "Manage Classes" },
    { title: "My Payments", description: "Track your earnings and payment status", IconEl: DollarSign, href: "/tutor/payments", buttonText: "View Payments" },
    { title: "Edit Personal Details", description: "Update your personal information", IconEl: UserCog, href: "/tutor/edit-personal-details", buttonText: "Update Details" },
    { title: "Edit Tutoring Profile", description: "Showcase your expertise", IconEl: BookOpenIcon, href: "/tutor/edit-tutoring-details", buttonText: "Update Profile" },
    { title: "View Public Profile", description: "See how your profile looks to parents", IconEl: Eye, href: `/tutors/${tutorUser.id}`, disabled: !tutorUser.id, buttonText: "View Profile" },
    { title: "Support", description: "Get help or report issues", IconEl: LifeBuoy, href: "#", disabled: true, buttonText: "Get Support" },
  ];

  const profileCompletion = dashboardData?.profileCompletion ?? 0;
  const isTutorActive = dashboardData?.tutorActive ?? true;

  return (
    <Dialog open={isEditTutoringModalOpen} onOpenChange={setIsEditTutoringModalOpen}>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          
          {!isTutorActive && !isLoadingDashboard && (
             <ActivationStatusCard 
                onActivate={() => console.log("Activate button clicked - mock action")} 
                className="mb-6"
             />
          )}

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
                      {isLoadingDashboard ? (
                          <Skeleton className="h-4 w-10 rounded-md" />
                      ) : (
                          <span className={cn("text-xs font-medium", "text-primary")}>{profileCompletion}%</span>
                      )}
                    </div>
                    {isLoadingDashboard ? (
                        <Skeleton className="h-2 w-full rounded-full" />
                    ) : (
                        <Progress value={profileCompletion} className="h-2 rounded-full bg-gray-100" indicatorClassName={cn("rounded-full", "bg-primary")} />
                    )}
                    {profileCompletion < 100 && (
                      <DialogTrigger asChild>
                        <button className={cn("mt-1 block hover:underline text-xs font-medium text-left", "text-primary")}>
                          Complete Your Profile
                        </button>
                      </DialogTrigger>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start w-full md:w-auto">
                  
              </div>
            </div>
          </div>
          <div className="mb-6 md:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">My Insights</h2>
            {isLoadingDashboard ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                  {[...Array(4)].map((_, index) => <Skeleton key={index} className="h-[96px] w-full rounded-xl" />)}
              </div>
            ) : dashboardError ? (
              <Card className="bg-destructive/10 border-destructive/20 text-destructive-foreground p-4">
                  <p className="text-sm font-semibold">Could not load insights</p>
                  <p className="text-xs">There was an error fetching your dashboard metrics. Please try again later.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {dashboardMetrics.map((metric, index) => (
                  <Card key={index} className="bg-card rounded-xl shadow-lg p-5 border-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{metric.title}</p>
                        <h3 className={cn("text-xl md:text-2xl font-semibold mt-0.5", metric.iconColor)}>{metric.value}</h3>
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
            )}
          </div>
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
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-3xl p-0 flex flex-col max-h-[90vh]"
      >
        <DialogTitle className="sr-only">Edit Tutoring Details</DialogTitle>
        <div className="overflow-y-auto flex-grow h-full">
            <EditTutoringDetailsForm 
              initialData={dashboardData}
              onSuccess={() => setIsEditTutoringModalOpen(false)} 
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
