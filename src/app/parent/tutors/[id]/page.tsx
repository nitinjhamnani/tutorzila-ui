
"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import type { TutorProfile, Testimonial, TuitionRequirement, Message as MessageType } from "@/types";
import { MOCK_TUTOR_PROFILES, MOCK_TESTIMONIALS, MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle as ShadDialogTitle, DialogDescription as ShadDialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageModal } from "@/components/modals/MessageModal";
import { ScheduleDemoRequestModal } from "@/components/modals/ScheduleDemoRequestModal";

import {
  Briefcase,
  BookOpen,
  GraduationCap,
  Star,
  MessageSquare,
  Award,
  CheckCircle,
  Brain,
  Palette,
  Users,
  Atom,
  Code,
  Globe,
  Music,
  Calculator,
  Lightbulb,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Laptop,
  UserCheck,
  Sparkles,
  Quote,
  UserX,
  CalendarClock,
  Clock as ClockIcon, 
  CalendarDays,
  Share2,
  Copy,
  MessageSquareQuote,
  User as UserProfileIcon, 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

const subjectIcons: { [key: string]: React.ElementType } = {
  Mathematics: Calculator,
  Science: Atom,
  English: BookOpen,
  Coding: Code,
  History: Globe,
  Art: Palette,
  Music: Music,
  Physics: Lightbulb,
  Chemistry: Atom,
  Biology: Brain,
  "Computer Science": Code,
  Spanish: Globe,
  French: Globe,
  "English Literature": BookOpen,
  "Creative Writing": BookOpen,
  "Web Development": Code,
  Default: BookOpen,
};

interface InfoSectionProps {
    icon: React.ElementType;
    title: string;
    content?: string | string[];
    children?: React.ReactNode;
    className?: string;
}

function InfoSection({ icon: Icon, title, content, children, className }: InfoSectionProps) {
    const displayText = Array.isArray(content) ? content.join(', ') : content;
    return (
        <div className="space-y-0.5">
            <div className="flex items-center text-xs font-medium text-foreground/90">
                <Icon className="w-3 h-3 mr-1.5 text-primary/80"/>
                {title}
            </div>
            {displayText && <p className={cn("text-xs text-foreground/70 pl-[18px]", className)}>{displayText}</p>}
            {children && <div className={cn("text-xs pl-[18px]", className)}>{children}</div>}
        </div>
    )
}


export default function ParentTutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: parentUser, isAuthenticated, isCheckingAuth } = useAuthMock();
  const { toast } = useToast();

  const idFromParams = params.id as string;

  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const [showContactCard, setShowContactCard] = useState(false);
  const [currentEnquiryContext, setCurrentEnquiryContext] = useState<TuitionRequirement | undefined>(undefined);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageHistory, setMessageHistory] = useState<MessageType[]>([]);
  
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedTutorForDemo, setSelectedTutorForDemo] = useState<TutorProfile | null>(null);


  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || isCheckingAuth || !idFromParams) return;

    if (!isAuthenticated || parentUser?.role !== 'parent') {
      router.replace("/"); 
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      const foundTutor = MOCK_TUTOR_PROFILES.find((t) => t.id === idFromParams);
      if (foundTutor) {
        setTutor(foundTutor);
        setSelectedTutorForDemo(foundTutor); // Pre-select for demo modal

        const parentEnquiries = MOCK_ALL_PARENT_REQUIREMENTS.filter(
          (req) => req.parentId === parentUser.id
        );
        const relevantEnquiry = parentEnquiries.find(
          (enq) => enq.appliedTutorIds?.includes(foundTutor.id)
        );

        if (relevantEnquiry) {
          setShowContactCard(true);
          setCurrentEnquiryContext(relevantEnquiry);
          setMessageHistory([
            { id: "msg1_tutor", sender: foundTutor.name, text: `Hello ${parentUser.name}, I saw your enquiry for ${ Array.isArray(relevantEnquiry.subject) ? relevantEnquiry.subject.join(', ') : relevantEnquiry.subject} and I'm interested.`, timestamp: new Date(Date.now() - 3600000 * 3), type: 'chat' },
            { id: "msg2_parent", sender: "You", text: `Hi ${foundTutor.name}, thanks for your interest! Could you tell me more about your experience?`, timestamp: new Date(Date.now() - 3600000 * 2), type: 'chat' }
          ]);
        } else {
          setShowContactCard(false);
          setCurrentEnquiryContext(undefined);
        }

      } else {
        setError("Tutor profile not found.");
      }
      setLoading(false);
    }, 300);
  }, [idFromParams, hasMounted, isAuthenticated, isCheckingAuth, parentUser, router]);


  const handleScheduleDemoClick = (tutorToSchedule: TutorProfile) => {
    setSelectedTutorForDemo(tutorToSchedule);
    setIsDemoModalOpen(true);
  };

  const handleDemoRequestSuccess = () => {
    setIsDemoModalOpen(false);
    setSelectedTutorForDemo(null); // Clear selection after modal closes
    toast({
      title: "Demo Request Sent!",
      description: "The tutor will be notified of your demo request.",
    });
  };

  const handleShareProfile = async () => {
    if (!tutor || typeof window === 'undefined') return;
    const profileUrl = `${window.location.origin}/tutors/${tutor.id}`; 
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({ title: "Profile Link Copied!", description: "Tutor's public profile link copied to clipboard." });
    } catch (err) {
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy link. Please try again." });
    }
  };
  
  const handleCopyDetail = async (textToCopy: string, fieldName: string) => {
    if (!textToCopy) {
        toast({ variant: "destructive", title: "Nothing to Copy", description: `${fieldName} is not available.` });
        return;
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({ title: `${fieldName} Copied!`, description: `${textToCopy} has been copied to clipboard.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Copy Failed", description: `Could not copy ${fieldName.toLowerCase()}.` });
    }
  };

  const handleSendMessage = (messageText: string) => {
    if (!tutor || !parentUser) return;
    const myMessage: MessageType = {
      id: `msg${messageHistory.length + 1}`,
      sender: "You", 
      text: messageText,
      timestamp: new Date(),
      type: 'chat',
    };
    const updatedHistory = [...messageHistory, myMessage];
    setMessageHistory(updatedHistory);

    setTimeout(() => {
      const tutorReply: MessageType = {
        id: `msg${updatedHistory.length + 1}`,
        sender: tutor.name,
        text: "Thanks for your message! I'll get back to you shortly.",
        timestamp: new Date(),
        type: 'chat',
      };
      setMessageHistory(prev => [...prev, tutorReply]);
    }, 1500);
  };


  if (isCheckingAuth || !hasMounted || loading) {
    return (
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto py-6 md:py-10 px-4 sm:px-6 md:px-8">
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mt-4">
            <div className="lg:col-span-1 space-y-6">
                <Skeleton className="h-[350px] w-full rounded-xl" />
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <Skeleton className="h-[250px] w-full rounded-xl" />
            </div>
            </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || parentUser?.role !== 'parent') {
    return <main className="flex-grow"><div className="flex h-screen items-center justify-center text-muted-foreground">Access Denied or Redirecting...</div></main>;
  }


  if (error) {
    return (
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto py-6 md:py-10 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center min-h-[calc(100vh_-_var(--header-height,0px)_-_var(--footer-height,0px)_-_5rem)]">
            <Alert variant="destructive" className="max-w-md text-center shadow-lg rounded-xl mt-4">
            <UserX className="h-10 w-10 mx-auto mb-3 text-destructive" />
            <AlertTitle className="text-xl font-semibold">Profile Not Found</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </Alert>
        </div>
      </main>
    );
  }

  if (!tutor) {
     return (
       <main className="flex-grow">
        <div className="max-w-6xl mx-auto py-6 md:py-10 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center min-h-[calc(100vh_-_var(--header-height,0px)_-_var(--footer-height,0px)_-_5rem)]">
            <Alert variant="destructive" className="max-w-md text-center shadow-lg rounded-xl mt-4">
            <UserX className="h-10 w-10 mx-auto mb-3 text-destructive" />
            <AlertTitle className="text-xl font-semibold">Tutor Not Found</AlertTitle>
            <AlertDescription>The requested tutor profile could not be found.</AlertDescription>
            <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </Alert>
        </div>
       </main>
    );
  }

  const rating = tutor.rating || 0;
  const teachingModeText = Array.isArray(tutor.teachingMode) ? tutor.teachingMode.join(' & ') : tutor.teachingMode;
  const TeachingModeIcon =
    Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("Online") && (tutor.teachingMode.includes("In-person") || tutor.teachingMode.includes("Offline (In-person)"))
      ? Laptop
      : Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("Online")
      ? Laptop
      : Array.isArray(tutor.teachingMode) && (tutor.teachingMode.includes("In-person") || tutor.teachingMode.includes("Offline (In-person)"))
      ? Users
      : Laptop;


  return (
    <main className="flex-grow">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500 ease-out py-6 md:py-10 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left Sidebar/Column */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-[calc(var(--header-height,0px)+1.5rem)] lg:self-start lg:max-h-[calc(100vh-var(--header-height,0px)-3rem)] lg:overflow-y-auto lg:pr-4 lg:scrollbar-thin">
            <Card className="overflow-hidden shadow-lg border border-border/30 rounded-xl bg-card">
              <CardContent className="pt-6 text-center">
                <Avatar className="w-28 h-28 border-4 border-card shadow-md ring-2 ring-primary/40 mx-auto">
                  <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/200`} alt={tutor.name} />
                  <AvatarFallback className="text-3xl bg-primary/20 text-primary font-semibold">
                    {tutor.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-lg font-semibold text-foreground tracking-tight mt-4">{tutor.name}</h1>
                <p className="text-xs text-muted-foreground mt-1">{tutor.role === "tutor" ? "Professional Tutor" : tutor.role}</p>

                <div className="flex items-center justify-center mt-2.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-3 h-3 ${index < Math.floor(rating) ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
                    />
                  ))}
                  <span className="ml-1.5 text-[10px] text-muted-foreground">({rating.toFixed(1)} stars)</span>
                </div>

                {(tutor.minHourlyRate || tutor.maxHourlyRate) && (
                  <Badge variant="secondary" className="mt-3 text-[13px] py-1 px-3 border-primary/30 bg-primary/10 text-primary font-semibold">
                    {tutor.minHourlyRate && tutor.maxHourlyRate && tutor.minHourlyRate !== tutor.maxHourlyRate
                      ? `₹${tutor.minHourlyRate} - ₹${tutor.maxHourlyRate} / hr`
                      : tutor.minHourlyRate && tutor.maxHourlyRate && tutor.minHourlyRate === tutor.maxHourlyRate
                      ? `₹${tutor.minHourlyRate} / hr`
                      : tutor.minHourlyRate
                      ? `From ₹${tutor.minHourlyRate} / hr`
                      : `Up to ₹${tutor.maxHourlyRate} / hr`}
                  </Badge>
                )}
              </CardContent>
              <div className="p-4 border-t flex flex-col gap-2">
                 <Button
                    variant="default"
                    className="w-full text-sm py-2.5"
                    onClick={() => handleScheduleDemoClick(tutor)}
                 >
                    <CalendarDays className="mr-2 h-4 w-4" /> Schedule Demo
                 </Button>
                 <Button
                    variant="outline"
                    className="w-full text-sm py-2.5"
                    onClick={handleShareProfile}
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share Profile
                  </Button>
              </div>
            </Card>
            
            {showContactCard && (
              <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-primary flex items-center">
                    <MessageSquareQuote className="w-3.5 h-3.5 mr-2" /> Contact Information
                  </CardTitle>
                   {currentEnquiryContext && (
                    <CardDescription className="text-xs text-muted-foreground">
                        This tutor has shown interest in your requirement for "{Array.isArray(currentEnquiryContext.subject) ? currentEnquiryContext.subject.join(', ') : currentEnquiryContext.subject}".
                    </CardDescription>
                   )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 border rounded-md bg-background/50">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-foreground">{tutor.email}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleCopyDetail(tutor.email, "Email")} className="h-7 w-7 text-muted-foreground hover:text-primary">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {tutor.phone && (
                    <div className="flex items-center justify-between p-2.5 border rounded-md bg-background/50">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-foreground">{tutor.phone}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleCopyDetail(tutor.phone!, "Phone Number")} className="h-7 w-7 text-muted-foreground hover:text-primary">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                  <Button className="w-full text-xs py-2" onClick={() => setIsMessageModalOpen(true)}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Message Tutor
                  </Button>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Right Column (Main content) */}
          <section className="lg:col-span-2 space-y-6">
             <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-primary flex items-center">
                  <UserProfileIcon className="w-3.5 h-3.5 mr-2"/> About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{tutor.bio || "No biography provided."}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-primary flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-2"/> Expertise & Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                <InfoSection icon={BookOpen} title="Subjects Taught">
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {(Array.isArray(tutor.subjects) ? tutor.subjects : [tutor.subjects]).map((subject) => {
                      const IconComponent = subjectIcons[subject] || subjectIcons.Default;
                      return (
                        <Badge key={subject} variant="outline" className="py-0.5 px-2 text-[11px] border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                          <IconComponent className="w-2.5 h-2.5 mr-1"/>
                          {subject}
                        </Badge>
                      );
                    })}
                  </div>
                </InfoSection>
                {tutor.gradeLevelsTaught && tutor.gradeLevelsTaught.length > 0 && <InfoSection icon={GraduationCap} title="Grade Levels" content={tutor.gradeLevelsTaught.join(', ')} className="text-xs" />}
                {tutor.experience && <InfoSection icon={Award} title="Experience" content={tutor.experience} className="text-xs" />}
                {tutor.qualifications && <InfoSection icon={Briefcase} title="Qualifications" content={Array.isArray(tutor.qualifications) ? tutor.qualifications.join(', ') : tutor.qualifications} className="text-xs" />}
                {tutor.teachingMode && (
                  <InfoSection icon={TeachingModeIcon} title="Teaching Mode" content={teachingModeText} className="text-xs" />
                )}
                 {tutor.location && <InfoSection icon={MapPin} title="Primary Location" content={tutor.location} className="text-xs" />}
                 {tutor.preferredDays && tutor.preferredDays.length > 0 && <InfoSection icon={CalendarClock} title="Availability (Days)" content={tutor.preferredDays.join(', ')} className="text-xs" />}
                 {tutor.preferredTimeSlots && tutor.preferredTimeSlots.length > 0 && <InfoSection icon={ClockIcon} title="Availability (Time)" content={tutor.preferredTimeSlots.join(', ')} className="text-xs" />}
              </CardContent>
            </Card>

             <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
               <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-primary flex items-center">
                    <Quote className="w-3.5 h-3.5 mr-2"/> Student Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {MOCK_TESTIMONIALS.filter(rev => rev.role === "Parent").slice(0,2).map((review, index) => (
                      <React.Fragment key={review.id}>
                          <div className="p-0 bg-transparent">
                              <div className="flex items-start justify-between mb-1">
                                 <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-2.5 border-primary/20 border">
                                          <AvatarImage src={`https://avatar.vercel.sh/${review.name.replace(/\s+/g, '')}.png?s=32`} alt={review.name} />
                                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                              {review.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                          </AvatarFallback>
                                      </Avatar>
                                      <div>
                                          <p className="text-xs font-semibold text-foreground">{review.name}</p>
                                          <p className="text-[10px] text-muted-foreground flex items-center"><CalendarClock size={10} className="mr-1"/>{format(new Date(review.date), "PP")}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center space-x-0.5 mt-0.5">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}/>
                                      ))}
                                  </div>
                              </div>
                              <p className={cn("text-xs text-foreground/80 leading-normal pl-10", "text-xs")}>{review.comment}</p>
                          </div>
                          {index < MOCK_TESTIMONIALS.filter(rev => rev.role === "Parent").slice(0,2).length - 1 && <Separator className="my-3" />}
                      </React.Fragment>
                  )) }
                  {MOCK_TESTIMONIALS.filter(rev => rev.role === "Parent").length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-3">No reviews yet for {tutor.name}.</p>
                  )}
                </CardContent>
            </Card>
          </section>
        </div>
      </div>
      {tutor && parentUser && (
        <MessageModal
            isOpen={isMessageModalOpen}
            onOpenChange={setIsMessageModalOpen}
            leadName={tutor.name}
            enquirySubject={currentEnquiryContext ? (Array.isArray(currentEnquiryContext.subject) ? currentEnquiryContext.subject.join(', ') : currentEnquiryContext.subject) : undefined}
            initialMessages={messageHistory}
            onSendMessage={handleSendMessage}
        />
      )}
       {selectedTutorForDemo && parentUser && (
        <Dialog open={isDemoModalOpen} onOpenChange={setIsDemoModalOpen}>
          <DialogContent className="sm:max-w-xl bg-card p-0 rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
            <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <MessageSquareQuote className="w-5 h-5" />
                    </div>
                    <div>
                        <ShadDialogTitle className="text-lg font-semibold text-foreground">
                         Request a Demo with {selectedTutorForDemo.name}
                        </ShadDialogTitle>
                        <ShadDialogDescription className="text-sm text-muted-foreground mt-0.5">
                         Fill in your preferred details for the demo session.
                        </ShadDialogDescription>
                    </div>
                </div>
            </DialogHeader>
            <ScheduleDemoRequestModal
              tutor={selectedTutorForDemo}
              parentUser={parentUser}
              enquiryContext={currentEnquiryContext}
              onSuccess={handleDemoRequestSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
