
"use client";

import type { ReactNode, ElementType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { User, TutorProfile, DemoSession, MyClass, EnquiryDemo, TutorDashboardMetrics } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MOCK_CLASSES } from "@/lib/mock-data";
import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard";
import { ManageDemoModal } from "@/components/modals/ManageDemoModal";
import { Badge } from "@/components/ui/badge";
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
  ListChecks,
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
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import React, { useEffect, useState, useMemo, useRef, ChangeEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { ActivationStatusCard } from "@/components/tutor/ActivationStatusCard";
import { format, addMinutes, parse } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import { tutorProfileAtom } from "@/lib/state/tutor";

interface QuickActionCardProps {
  title: string;
  description: string;
  IconEl: ElementType;
  href?: string;
  disabled?: boolean;
  buttonText?: string;
  onClick?: () => void;
}

function QuickActionCard({ title, description, IconEl, href, disabled, buttonText, onClick }: QuickActionCardProps) {
  const content = (
    <div className="bg-card rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between border-0 transform hover:-translate-y-1">
      <div>
        <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg text-primary mb-3", "bg-primary/10")}>
          <IconEl className={cn("w-5 h-5", "text-primary")} />
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
  
  if (onClick) {
    return <button onClick={onClick} className="block text-left h-full w-full">{content}</button>;
  }


  return (
    <Link href={href || "#"} className="block h-full">
      {content}
    </Link>
  );
}

const fetchTutorMetrics = async (token: string | null): Promise<TutorDashboardMetrics> => {
  if (!token) throw new Error("No authentication token found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/tutor/metrics`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "accept": "*/*",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tutor dashboard metrics.");
  }
  return response.json();
};

const fetchTutorDetails = async (token: string | null) => {
    if (!token) throw new Error("No authentication token found.");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/api/tutor/details`, {
        headers: {
        "Authorization": `Bearer ${token}`,
        "accept": "*/*",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tutor details.");
    }
    return response.json();
};


const fetchTutorId = async (token: string | null): Promise<string> => {
  if (!token) throw new Error("Authentication token not found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/tutor/get/id`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "accept": "text/plain",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tutor ID.");
  }
  return response.text();
};

const fetchTutorScheduledDemos = async (token: string | null): Promise<DemoSession[]> => {
  if (!token) throw new Error("Authentication token not found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/tutor/demos/SCHEDULED`, {
    headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
  });
  if (!response.ok) throw new Error("Failed to fetch demos.");
  
  const data: EnquiryDemo[] = await response.json();

  return data.map(item => {
    const startTime = item.demoDetails.startTime || "12:00 AM";
    const duration = parseInt(item.demoDetails.duration) || 30;
    
    let endTime = "12:30 AM";
    try {
      const startDateTime = parse(`${item.demoDetails.date} ${startTime}`, 'yyyy-MM-dd hh:mm a', new Date());
      if (!isNaN(startDateTime.getTime())) {
          const endDateTime = addMinutes(startDateTime, duration);
          endTime = format(endDateTime, "hh:mm a");
      }
    } catch(e) {
      console.error("Could not parse date/time for end time calculation", item.demoDetails.date, startTime);
    }
    
    const statusMap: Record<string, DemoSession["status"]> = {
      SCHEDULED: "Scheduled",
      REQUESTED: "Requested",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
    };

    return {
      id: item.demoId,
      enquiryId: item.demoDetails.enquiryId,
      tutorName: item.demoDetails.tutorName,
      studentName: item.demoDetails.studentName,
      subject: item.demoDetails.subjects,
      gradeLevel: item.demoDetails.grade,
      board: item.demoDetails.board,
      date: item.demoDetails.date, // Already a string
      day: item.demoDetails.day,
      startTime: startTime,
      endTime: endTime,
      duration: item.demoDetails.duration,
      status: statusMap[item.demoStatus] || "Requested",
      demoLink: item.demoDetails.demoLink,
      isPaid: item.demoDetails.paid,
      demoFee: item.demoDetails.demoFees,
      mode: item.demoDetails.online ? "Online" : (item.demoDetails.offline ? "Offline (In-person)" : undefined),
    };
  });
};

export default function TutorDashboardPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const tutorUser = user as TutorProfile | null;
  const { hideLoader } = useGlobalLoader();
  const { toast } = useToast();
  const [isFetchingTutorId, setIsFetchingTutorId] = useState(false);
  const [, setTutorProfile] = useAtom(tutorProfileAtom);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [upcomingSessions, setUpcomingSessions] = useState<Array<{ type: 'demo' | 'class'; data: DemoSession | MyClass; sortDate: Date }>>([]);
  const [selectedDemoForModal, setSelectedDemoForModal] = useState<DemoSession | null>(null);
  const [isManageDemoModalOpen, setIsManageDemoModalOpen] = useState(false);
  const [isEditTutoringModalOpen, setIsEditTutoringModalOpen] = useState(false);

  const { data: metricsData, isLoading: isLoadingMetrics, error: metricsError } = useQuery({
    queryKey: ['tutorMetrics', token],
    queryFn: () => fetchTutorMetrics(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false, 
  });
  
  const { data: tutoringDetails, isLoading: isLoadingDetails, error: detailsError } = useQuery({
    queryKey: ['tutorDetails', token],
    queryFn: () => fetchTutorDetails(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      // Store the fetched details in the global state, wrapped in the expected nested structure.
      setTutorProfile({ tutoringDetails: data });
    },
  });


  const { data: demosData, isLoading: isLoadingDemos } = useQuery({
    queryKey: ['tutorScheduledDemos', token],
    queryFn: () => fetchTutorScheduledDemos(token),
    enabled: !!tutorUser,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setHasMounted(true);
    hideLoader(); 
  }, [hideLoader]);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || (isAuthenticated && user?.role !== 'tutor')) {
        router.replace("/");
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, user, router]);

  useEffect(() => {
    if (tutorUser && hasMounted && demosData) {
      const tutorClasses = MOCK_CLASSES.filter(
        c => c.tutorId === tutorUser.id || c.tutorName === tutorUser.name
      );

      const upcomingDemosFiltered = demosData
        .filter(d => new Date(d.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .map(d => ({ type: 'demo' as const, data: d, sortDate: new Date(d.date) }));

      const upcomingRegClassesFiltered = tutorClasses
        .filter(c => (c.status === "Upcoming" && c.startDate && new Date(c.startDate) >= new Date(new Date().setHours(0, 0, 0, 0))) || (c.status === "Ongoing" && c.nextSession && new Date(c.nextSession) >= new Date(new Date().setHours(0, 0, 0, 0))))
        .map(c => ({ type: 'class' as const, data: c, sortDate: new Date(c.nextSession || c.startDate!) }));

      const combined = [...upcomingDemosFiltered, ...upcomingRegClassesFiltered].sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
      setUpcomingSessions(combined);
    }
  }, [tutorUser, hasMounted, demosData]);

  const handleUpdateDemoSession = (updatedDemo: DemoSession) => {
    setUpcomingSessions(prevSessions =>
      prevSessions.map(session =>
        session.type === 'demo' && session.data.id === updatedDemo.id
          ? { ...session, data: updatedDemo, sortDate: new Date(updatedDemo.date) }
          : session
      ).sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
    );
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
    setIsManageDemoModalOpen(false);
  };

  const handleViewProfileClick = async () => {
    setIsFetchingTutorId(true);
    try {
      const id = await fetchTutorId(token);
      if (id) {
        window.open(`/tutors/${id}`, '_blank');
      } else {
        throw new Error("Received an empty ID for the tutor.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Could Not Fetch Profile",
        description: error.message || "Unable to retrieve the public profile link.",
      });
    } finally {
      setIsFetchingTutorId(false);
    }
  };

  const queryClient = useQueryClient();

  if (isCheckingAuth || !hasMounted || !isAuthenticated || !tutorUser) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Tutor Dashboard...</div>;
  }
  if (tutorUser.role !== 'tutor') {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Access Denied.</div>;
  }

  const dashboardMetrics = [
    { title: "Enquiries Assigned", value: String(metricsData?.enquiriesAssigned ?? 0), IconEl: Briefcase, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { title: "Demos Scheduled", value: String(metricsData?.demoScheduled ?? 0), IconEl: CalendarDays, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { title: "Profile Views", value: String(metricsData?.profileViews ?? 0), IconEl: UsersIcon, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { title: "Average Rating", value: String(metricsData?.averageRating?.toFixed(1) ?? 'N/A'), IconEl: Star, iconBg: "bg-primary/10", iconColor: "text-primary" },
  ];

  const quickActions: QuickActionCardProps[] = [
    { title: "My Enquiries", description: "View & respond to tuition requests", IconEl: Briefcase, href: "/tutor/enquiries", buttonText: "View Enquiries" },
    { title: "Demo Sessions", description: "Manage all your demo class activities", IconEl: Presentation, href: "/tutor/demo-sessions", buttonText: "Manage Demos" },
    { title: "My Classes", description: "Organize your scheduled classes", IconEl: CalendarDays, href: "/tutor/classes", buttonText: "Manage Classes" },
    { title: "My Payments", description: "Track your earnings and payment status", IconEl: DollarSign, href: "/tutor/payments", buttonText: "View Payments" },
    { title: "Edit Tutoring Profile", description: "Showcase your expertise", IconEl: BookOpenIcon, onClick: () => setIsEditTutoringModalOpen(true), buttonText: "Update Profile" },
    { title: "View Public Profile", description: "See how your profile looks to parents", IconEl: Eye, onClick: handleViewProfileClick, buttonText: "View Profile" },
    { title: "Support", description: "Get help or report issues", IconEl: LifeBuoy, href: "/tutor/support", buttonText: "Get Support" },
  ];

  const profileCompletion = tutoringDetails?.profileCompletion ?? 0;
  const isTutorRegistered = tutoringDetails?.registered ?? false;
  const isVerified = tutoringDetails?.verified ?? false;

  return (
    <Dialog open={isEditTutoringModalOpen} onOpenChange={setIsEditTutoringModalOpen}>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          
          {!isTutorRegistered && !isLoadingDetails && (
             <ActivationStatusCard 
                onActivate={() => queryClient.invalidateQueries({ queryKey: ['tutorDetails', token] })}
                className="mb-6"
             />
          )}

          <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8 border-0">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative group shrink-0">
                  <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/30 shadow-sm">
                    <AvatarImage src={tutorUser.avatar} alt={tutorUser.name} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl md:text-2xl">
                      {tutorUser.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-foreground">Hello, {tutorUser.name} <span className="inline-block ml-1">👋</span></h1>
                  <p className="text-xs text-muted-foreground mt-1">Welcome back to your dashboard</p>
                  <div className="mt-3 flex items-center space-x-2 flex-wrap">
                      <Badge className={cn("text-xs py-0.5 px-2 border", isTutorRegistered ? "bg-primary text-primary-foreground border-primary" : "bg-red-100 text-red-700 border-red-500")}>
                        {isTutorRegistered ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                        {isTutorRegistered ? "Registered" : "Not Registered"}
                      </Badge>
                      <Badge className={cn("text-xs py-0.5 px-2 border", isVerified ? "bg-green-600 text-white border-green-700" : "bg-destructive/10 text-destructive border-destructive/50")}>
                        {isVerified ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                        {isVerified ? "Verified" : "Not Verified"}
                      </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full md:w-auto md:min-w-[240px]">
                <div className={cn("rounded-xl p-4 w-full", "bg-secondary")}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Profile Completion</p>
                      {isLoadingDetails ? (
                          <Skeleton className="h-8 w-16 mt-1 rounded-md" />
                      ) : (
                          <p className={cn("text-2xl font-bold", "text-primary")}>{profileCompletion}%</p>
                      )}
                    </div>
                    <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg shrink-0", "bg-primary/10 text-primary")}>
                      <Percent className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto mt-1.5 text-xs text-primary font-medium">
                    {profileCompletion < 100 ? "Complete Your Profile" : "Edit Your Profile"}
                    <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </DialogTrigger>
              </div>
            </div>
          </div>
          <div className="mb-6 md:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">My Insights</h2>
            {isLoadingMetrics ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                  {[...Array(4)].map((_, index) => <Skeleton key={index} className="h-[96px] w-full rounded-xl" />)}
              </div>
            ) : metricsError ? (
              <Card className="bg-destructive/10 border-destructive/20 text-destructive-foreground p-4">
                  <p className="text-sm font-semibold">Could not load insights</p>
                  <p className="text-xs">There was an error fetching your dashboard metrics. Please try again later.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
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
            {isLoadingDemos ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {[...Array(3)].map((_, index) => <Skeleton key={index} className="h-48 w-full rounded-xl" />)}
                </div>
            ) : upcomingSessions.length > 0 ? (
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
                  onClick={action.onClick}
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
              initialData={tutoringDetails ? { tutoringDetails } : null}
              onSuccess={() => setIsEditTutoringModalOpen(false)} 
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
