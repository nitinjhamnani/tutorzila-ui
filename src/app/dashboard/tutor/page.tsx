// src/app/dashboard/tutor/page.tsx
"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; 
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Briefcase, Eye, Share2, UsersRound, CalendarDays, UserCircle as UserCircleIcon, Edit, Camera, CheckCircle, XCircle, MailCheck, PhoneCall, Coins, ShoppingBag, DollarSign, Activity, Presentation, Users as UsersIcon, Star as StarIcon, ClipboardList, Inbox, LayoutDashboard, CalendarClock, Send } from "lucide-react"; // Added Send, Inbox, Presentation, CalendarClock
import Link from "next/link";
import type { TutorProfile, DemoSession } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, type ChangeEvent, useState, useEffect } from "react"; 
import { useToast } from "@/hooks/use-toast"; 
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UpdateProfileActionsCard } from "@/components/dashboard/UpdateProfileActionsCard";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";
import { MOCK_DEMO_SESSIONS, MOCK_TUTOR_PROFILES } from "@/lib/mock-data"; 
import { DemoSessionCard } from "@/components/dashboard/DemoSessionCard";
import { Progress } from "@/components/ui/progress";


export default function TutorDashboardPage() {
  const { user } = useAuthMock();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null; 

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpVerificationType, setOtpVerificationType] = useState<"email" | "phone" | null>(null);
  const [otpVerificationIdentifier, setOtpVerificationIdentifier] = useState<string | null>(null);

  const [isEmailVerified, setIsEmailVerified] = useState(tutorUser?.isEmailVerified || false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(tutorUser?.isPhoneVerified || false);

  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  const [mockInsights, setMockInsights] = useState({
    leadBalance: 0,
    activeLeads: 0,
    demosCompleted: 0,
    profileViews: 0,
    applicationsSent: 0,
    upcomingDemos: 0,
  });
  
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    if (tutorUser) {
      setIsEmailVerified(tutorUser.isEmailVerified || false);
      setIsPhoneVerified(tutorUser.isPhoneVerified || false);
      
      const tutorSpecificDemos = MOCK_DEMO_SESSIONS.filter(
        demo => MOCK_TUTOR_PROFILES.find(t => t.id === tutorUser.id && t.name === demo.tutorName)
      );
      setDemoSessions(tutorSpecificDemos);

      setMockInsights({
        leadBalance: Math.floor(Math.random() * 50) + 10,
        activeLeads: Math.floor(Math.random() * 10) + 2,
        demosCompleted: tutorSpecificDemos.filter(d => d.status === "Completed").length,
        profileViews: Math.floor(Math.random() * 200) + 50,
        applicationsSent: Math.floor(Math.random() * 30) + 5,
        upcomingDemos: tutorSpecificDemos.filter(d => d.status === "Scheduled").length,
      });

      // Calculate profile completion
      let completed = 0;
      const totalSteps = 5; 
      const fieldsToComplete = [
        tutorUser.avatar && !tutorUser.avatar.includes('pravatar.cc') && !tutorUser.avatar.includes('avatar.vercel.sh'),
        tutorUser.subjects && tutorUser.subjects.length > 0,
        tutorUser.bio && tutorUser.bio.trim() !== '',
        tutorUser.experience && tutorUser.experience.trim() !== '',
        tutorUser.hourlyRate && tutorUser.hourlyRate.trim() !== '',
      ];
      fieldsToComplete.forEach(isComplete => {
        if (isComplete) completed++;
      });
      setCompletionPercentage(Math.round((completed / totalSteps) * 100));
    }
  }, [tutorUser]);


  if (!tutorUser || tutorUser.role !== 'tutor') {
    return <div className="text-center p-8">Access Denied. This dashboard is for tutors only.</div>;
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      toast({
        title: "Profile Picture Updated (Mock)",
        description: `${file.name} selected. In a real app, this would be uploaded.`,
      });
    }
  };

  const handleOpenOtpModal = (type: "email" | "phone") => {
    if (!user) return;
    setOtpVerificationType(type);
    setOtpVerificationIdentifier(type === "email" ? user.email : user.phone || "Your Phone Number"); 
    setIsOtpModalOpen(true);
  };

  const handleOtpSuccess = () => {
    if (otpVerificationType === "email") {
      setIsEmailVerified(true);
    } else if (otpVerificationType === "phone") {
      setIsPhoneVerified(true);
    }
    setIsOtpModalOpen(false); 
    setOtpVerificationType(null);
    setOtpVerificationIdentifier(null);
  };

  const handleUpdateDemoSession = (updatedDemo: DemoSession) => {
    setDemoSessions(prevSessions => 
      prevSessions.map(session => session.id === updatedDemo.id ? updatedDemo : session)
    );
     setMockInsights(prev => ({
      ...prev,
      upcomingDemos: demoSessions.filter(d => d.id !== updatedDemo.id && d.status === "Scheduled").length + (updatedDemo.status === "Scheduled" ? 1 : 0),
      demosCompleted: demoSessions.filter(d => d.id !== updatedDemo.id && d.status === "Completed").length + (updatedDemo.status === "Completed" ? 1 : 0),
    }));
  };

  const handleCancelDemoSession = (sessionId: string) => {
    const updatedSessions = demoSessions.map(session => 
      session.id === sessionId ? { ...session, status: "Cancelled" as const } : session
    );
    setDemoSessions(updatedSessions);
    setMockInsights(prev => ({
      ...prev,
      upcomingDemos: updatedSessions.filter(d => d.status === "Scheduled").length,
    }));
  };
  
  const insightCards = [
    { title: "Lead Balance", value: mockInsights.leadBalance, icon: Coins, imageHint: "coin stack" },
    { title: "Active Leads", value: mockInsights.activeLeads, icon: Inbox, imageHint: "inbox mail" },
    { title: "Demos Completed", value: mockInsights.demosCompleted, icon: Presentation, imageHint: "presentation chart" },
    { title: "Profile Views", value: mockInsights.profileViews, icon: Eye, imageHint: "eye chart" },
    { title: "Applications Sent", value: mockInsights.applicationsSent, icon: Send, imageHint: "paper airplane" },
    { title: "Upcoming Demos", value: mockInsights.upcomingDemos, icon: CalendarClock, imageHint: "calendar clock" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-lg animate-in fade-in duration-700 ease-out overflow-hidden border-0 shadow-none w-full">
        <CardHeader className="pt-2 px-4 pb-4 md:pt-3 md:px-5 md:pb-5 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative group shrink-0">
                <Avatar
                  className="h-16 w-16 border-2 border-primary/30 group-hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={handleAvatarClick} 
                >
                  <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  className="absolute -bottom-2 -right-2 flex items-center justify-center bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                  aria-label="Update profile picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-foreground tracking-tight text-xl md:text-2xl font-semibold">Welcome back, {user.name}!</CardTitle>
                {user.status && (
                   <Badge 
                    className={cn(
                      "text-xs py-0.5 px-2 border",
                      user.status === "Active" ? "bg-primary text-primary-foreground border-primary" : "bg-red-100 text-red-700 border-red-500 hover:bg-opacity-80",
                    )}
                  >
                    {user.status === "Active" ? <CheckCircle className="mr-1 h-3 w-3 text-primary-foreground" /> : <XCircle className="mr-1 h-3 w-3" />}
                    {user.status}
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <Button
                    variant="secondary" 
                    size="sm" 
                      className={cn(
                      "h-auto rounded-full text-primary hover:bg-secondary/80", 
                      isEmailVerified
                        ? "bg-green-100 text-green-700 border-green-500 py-0.5 px-2 text-xs font-semibold cursor-default hover:bg-green-200 no-underline border" 
                        : "text-xs font-normal px-3 py-1.5 underline bg-card hover:text-primary/80" 
                    )}
                    onClick={() => !isEmailVerified && handleOpenOtpModal("email")}
                    disabled={isEmailVerified}
                  >
                    {isEmailVerified ? <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> : <MailCheck className="mr-1.5 h-3.5 w-3.5" />}
                    {isEmailVerified ? "Email Verified" : "Verify Email"}
                  </Button>
                  <Button
                    variant="secondary" 
                    size="sm" 
                      className={cn(
                      "h-auto rounded-full text-primary hover:bg-secondary/80", 
                      isPhoneVerified
                        ? "bg-green-100 text-green-700 border-green-500 py-0.5 px-2 text-xs font-semibold cursor-default hover:bg-green-200 no-underline border" 
                        : "text-xs font-normal px-3 py-1.5 underline bg-card hover:text-primary/80"
                    )}
                    onClick={() => !isPhoneVerified && handleOpenOtpModal("phone")}
                    disabled={isPhoneVerified}
                  >
                    {isPhoneVerified ? <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> : <PhoneCall className="mr-1.5 h-3.5 w-3.5" />}
                    {isPhoneVerified ? "Phone Verified" : "Verify Phone"}
                  </Button>
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button asChild variant="default" size="icon" className="h-8 w-8 p-1.5 rounded-full shadow-md hover:bg-primary/90" title="View Public Profile">
              <Link href={`/tutors/${user.id}`}>
                <Eye className="h-4 w-4 text-primary-foreground" />
              </Link>
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8 p-1.5 rounded-full shadow-md hover:bg-primary/90" title="Share Profile">
              <Share2 className="h-4 w-4 text-primary-foreground" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-card border border-border/30 rounded-xl shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out" style={{ animationDelay: `0.2s` }}>
        <CardHeader className="pb-3 border-b border-border/20">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <LayoutDashboard className="w-5 h-5 mr-2.5"/>
            My Insights
          </CardTitle>
           <CardDescription className="text-sm text-muted-foreground mt-1">
            Overview of your tutoring activity and performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {insightCards.map((insight, index) => (
            <Card 
              key={insight.title} 
              className="group bg-background/50 border border-border/20 rounded-lg shadow-xs hover:shadow-md transition-all duration-300 p-4 text-center transform hover:scale-105"
              style={{ animationDelay: `${index * 0.05 + 0.3}s` }}
            >
              <div className={cn("p-2.5 bg-primary/10 rounded-full text-primary inline-block mb-2.5 group-hover:bg-primary/20 transition-all shadow-sm")}>
                <insight.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              </div>
              <p className="text-2xl font-bold text-primary group-hover:text-primary/90 transition-colors">{insight.value}</p>
              <p className="text-xs text-muted-foreground group-hover:text-foreground/90 transition-colors mt-0.5">{insight.title}</p>
            </Card>
          ))}
        </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1"> 
        <div 
          className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
          style={{ animationDelay: `0.3s` }} 
        >
          <UpdateProfileActionsCard user={tutorUser} />
        </div>
      </div>

      <div className="mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
        <Card className="bg-card border border-border/30 rounded-xl shadow-none overflow-hidden">
          <CardHeader className="pb-4 border-b border-border/30">
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <CalendarDays className="w-6 h-6 mr-2.5" />
              Upcoming Tuition Demos
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Manage your scheduled demo sessions with students.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-5">
            {demoSessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {demoSessions.slice(0,3).map((demo, index) => ( 
                    <div 
                      key={demo.id}
                      className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
                      style={{ animationDelay: `${index * 0.1 + 0.4}s` }} 
                    >
                      <DemoSessionCard 
                        demo={demo} 
                        onUpdateSession={handleUpdateDemoSession}
                        onCancelSession={handleCancelDemoSession}
                      />
                    </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="w-12 h-12 mx-auto mb-3 text-primary/30" />
                <p className="font-medium">No upcoming demos scheduled.</p>
                <p className="text-xs mt-1">Check back later or contact students to schedule new demos.</p>
              </div>
            )}
          </CardContent>
          {demoSessions.length > 3 && (
            <CardFooter className="p-4 border-t border-border/30 bg-muted/20">
              <Button variant="outline" asChild className="w-full sm:w-auto mx-auto text-sm">
                <Link href="/dashboard/demo-sessions">View All Demos</Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {otpVerificationType && otpVerificationIdentifier && (
        <OtpVerificationModal
          isOpen={isOtpModalOpen}
          onOpenChange={setIsOtpModalOpen}
          verificationType={otpVerificationType}
          identifier={otpVerificationIdentifier}
          onSuccess={handleOtpSuccess}
        />
      )}
    </div>
  );
}
