
"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; 
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Lightbulb, PlusCircle, Search, UserCheck, Users, BookOpen, Activity, Briefcase, ListChecks, Camera, Edit, Edit2, MailCheck, PhoneCall, CheckCircle, XCircle, UserCog, ClipboardEdit, DollarSign, ClipboardList, Coins, CalendarClock, Award, ShoppingBag, Eye, Share2, UsersRound, CalendarDays, Edit3, Trash2, School, UserCircle as UserCircleIcon, ShieldCheck, BarChart3, FileText, VenetianMask, RadioTower, MapPin, GraduationCap, SearchCheck, MessageSquareQuote, Star, Send, QuoteIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { TutorProfile, DemoSession } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, type ChangeEvent, useState, useEffect } from "react"; 
import { useToast } from "@/hooks/use-toast"; 
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { UpdateProfileActionsCard } from "@/components/dashboard/UpdateProfileActionsCard";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data"; 
import { DemoSessionCard } from "@/components/dashboard/DemoSessionCard";


export default function DashboardPage() {
  const { user } = useAuthMock();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpVerificationType, setOtpVerificationType] = useState<"email" | "phone" | null>(null);
  const [otpVerificationIdentifier, setOtpVerificationIdentifier] = useState<string | null>(null);

  const [isEmailVerified, setIsEmailVerified] = useState(user?.isEmailVerified || false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(user?.isPhoneVerified || false);

  const [demoSessions, setDemoSessions] = useState<DemoSession[]>(MOCK_DEMO_SESSIONS);

  useEffect(() => {
    if (user) {
      setIsEmailVerified(user.isEmailVerified || false);
      setIsPhoneVerified(user.isPhoneVerified || false);
    }
  }, [user]);

  const handleUpdateDemoSession = (updatedDemo: DemoSession) => {
    setDemoSessions(prevSessions => 
      prevSessions.map(session => session.id === updatedDemo.id ? updatedDemo : session)
    );
  };

  const handleCancelDemoSession = (sessionId: string) => {
    setDemoSessions(prevSessions =>
      prevSessions.map(session => 
        session.id === sessionId ? { ...session, status: "Cancelled" } : session
      )
    );
  };


  if (!user) {
    return <div className="text-center p-8">Loading user data or please sign in.</div>;
  }

  const handleAvatarClick = () => {
    if (user?.role === 'tutor' || user?.role === 'parent') {
      fileInputRef.current?.click();
    }
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


  const parentActionCards = [
      <ActionCard
        key="my-enquiries" // Changed from my-requirements to my-enquiries
        title="My Enquiries" // Renamed
        cardDescriptionText="Manage your posted tuition needs and connect with suitable tutors."
        Icon={ListChecks} 
        showImage={false}
        buttonInContent={true}
        actionButtonText="View My Enquiries" // Renamed
        ActionButtonIcon={Eye} 
        href="/dashboard/my-requirements" 
        actionButtonVariant="outline"
        actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        className="shadow-none border border-border/30 hover:shadow-lg"
        actionButtonText2="Create Enquiry" // Renamed
        ActionButtonIcon2={PlusCircle}
        href2="/dashboard/post-requirement" 
        imageHint="list checkmark"
      />,
      <ActionCard
        key="my-tuition" // Changed from manage-students to my-tuition
        title="My Tuition" // Renamed
        cardDescriptionText="Explore profiles of qualified tutors and manage demo requests." // Updated description
        Icon={School} 
        showImage={false}
        buttonInContent={true}
        actionButtonText="View All Tutors" // Renamed
        ActionButtonIcon={SearchCheck}  // Changed icon
        href="/dashboard/tutors" // Updated href
        // disabled={true} // Placeholder - removed disabled state for now
        actionButtonVariant="outline"
        actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        className="shadow-none border border-border/30 hover:shadow-lg"
        actionButtonText2="Demo Requests" // New button
        ActionButtonIcon2={MessageSquareQuote} // New icon
        href2="/dashboard/demo-sessions" // New href
        // disabled2={true} // Placeholder - removed disabled state for now
        imageHint="student profile"
      />,
      <ActionCard
        key="manage-students"
        title="Student Profiles"
        cardDescriptionText="Add and manage profiles for your children to personalize tuition needs."
        Icon={UsersRound} 
        showImage={false}
        buttonInContent={true}
        actionButtonText="Manage Students"
        ActionButtonIcon={Edit3} 
        href="/dashboard/manage-students"
        disabled={true} 
        actionButtonVariant="outline"
        actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        className="shadow-none border border-border/30 hover:shadow-lg"
        imageHint="student profile"
      />,
      <ActionCard
        key="my-payments"
        title="My Payments"
        cardDescriptionText="Track all tuition payments, view history, and manage pending transactions."
        Icon={DollarSign} 
        showImage={false}
        buttonInContent={true}
        actionButtonText="View Payments"
        ActionButtonIcon={FileText} 
        href="/dashboard/payments"
        disabled={true} 
        actionButtonVariant="outline"
        actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        className="shadow-none border border-border/30 hover:shadow-lg"
        imageHint="payment history"
      />,
       <ActionCard
        key="my-classes"
        title="My Scheduled Classes"
        cardDescriptionText="View upcoming classes, manage schedules, and track attendance for each student."
        Icon={CalendarDays} 
        showImage={false}
        buttonInContent={true}
        actionButtonText="View My Classes"
        ActionButtonIcon={CalendarClock} 
        href="/dashboard/my-classes"
        disabled={true} 
        actionButtonVariant="outline"
        actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        className="shadow-none border border-border/30 hover:shadow-lg"
        imageHint="class schedule"
      />,
      <ActionCard
        key="demo-sessions"
        title="Demo Sessions"
        cardDescriptionText="Manage demo class requests, view upcoming demos, and book full classes."
        Icon={MessageSquareQuote} 
        showImage={false}
        buttonInContent={true}
        actionButtonText="View Demo Sessions"
        ActionButtonIcon={RadioTower} 
        href="/dashboard/demo-sessions"
        disabled={true}
        actionButtonVariant="outline"
        actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        className="shadow-none border border-border/30 hover:shadow-lg"
        imageHint="demo class"
      />
    ];


  const adminActionCards = [
      <ActionCard
        key="manage-users"
        title="Manage Users"
        description="Oversee parent and tutor accounts." 
        href="/dashboard/admin" 
        Icon={Users}
        imageHint="people community"
        className="hover:shadow-xl"
        actionButtonText="Go to Admin Panel" 
        ActionButtonIcon={ShieldCheck}
      />,
      <ActionCard
        key="manage-tuitions"
        title="Manage Tuitions"
        description="Review and manage all tuition postings." 
        href="/dashboard/admin" 
        Icon={BookOpen}
        imageHint="library books"
        className="hover:shadow-xl"
        actionButtonText="Go to Admin Panel"
        ActionButtonIcon={ShieldCheck}
      />,
       <ActionCard
        key="site-analytics"
        title="Site Analytics"
        description="View platform statistics and user activity." 
        href="/dashboard/admin" 
        Icon={BarChart3}
        imageHint="dashboard chart"
        className="hover:shadow-xl"
        actionButtonText="Go to Admin Panel"
        ActionButtonIcon={ShieldCheck}
      />
    ];


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1">
         <Card className="bg-card rounded-lg animate-in fade-in duration-700 ease-out overflow-hidden border-0 shadow-none w-full">
          <CardHeader className="pt-2 px-4 pb-4 md:pt-3 md:px-5 md:pb-5 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative group shrink-0">
                  <Avatar
                    className={cn(
                        "h-16 w-16 border-2 border-primary/30",
                        (user.role === 'tutor' || user.role === 'parent') && "group-hover:opacity-80 transition-opacity cursor-pointer"
                    )}
                    onClick={handleAvatarClick} 
                  >
                    <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                   {(user.role === 'tutor' || user.role === 'parent') && (
                     <button
                        onClick={handleAvatarClick}
                        className="absolute -bottom-2 -right-2 flex items-center justify-center bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                        aria-label="Update profile picture"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                   )}
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
                      variant={user.status === "Active" ? "default" : "destructive"} 
                      className={cn(
                        "text-xs py-0.5 px-2",
                        user.status === "Active" ? "bg-green-100 text-green-700 border-green-500" : "bg-red-100 text-red-700 border-red-500",
                        "hover:bg-opacity-80 border"
                      )}
                    >
                      {user.status === "Active" ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                      {user.status}
                    </Badge>
                  )}
                </div>
                { (user.role === 'tutor' || user.role === 'parent') && ( 
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
                )}
              </div>
            </div>
            {user.role === 'tutor' && (
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
            )}
          </CardHeader>
          {/* Removed Lead Balance, Plan Expiry, Badge, and Buy Leads Button for tutors */}
        </Card>
      </div>

      {user.role === 'tutor' && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"> 
          <div 
            className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
            style={{ animationDelay: `0.2s` }} 
          >
            <UpdateProfileActionsCard user={user as TutorProfile} />
          </div>
          <div 
            className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
            style={{ animationDelay: `0.3s` }} 
          >
            <ActionCard
              title="My Enquiries"
              cardDescriptionText="View and manage potential student enquiries."
              description="5 Recommended" 
              Icon={Briefcase} 
              showImage={false}
              buttonInContent={true}
              actionButtonText="View All Enquiries"
              ActionButtonIcon={ClipboardList}
              href="/dashboard/enquiries" 
              disabled={false} 
              actionButtonVariant="outline"
              actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
              className="shadow-none border border-border/30 hover:shadow-lg"
              imageHint="enquiry list"
            />
          </div>
        </div>
      )}


      {user.role === 'parent' && parentActionCards.length > 0 && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"> 
          {parentActionCards.map((card, index) => (
            <div 
              key={index} 
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }} 
            >
              {card}
            </div>
          ))}
        </div>
      )}

       {user.role === 'admin' && adminActionCards.length > 0 && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> 
          {adminActionCards.map((card, index) => (
            <div 
              key={index} 
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }} 
            >
              {card}
            </div>
          ))}
        </div>
      )}


      {user.role === 'tutor' && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
          <Card className="bg-card border border-border/30 rounded-xl shadow-lg overflow-hidden">
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
                  <Link href="#">View All Demos (Coming Soon)</Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      )}


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

interface ActionCardProps {
  title: string;
  description?: string; 
  href?: string; 
  Icon: React.ElementType;
  imageHint?: string;
  showImage?: boolean;
  disabled?: boolean;
  actionButtonText?: string;
  ActionButtonIcon?: React.ElementType;
  actionButtonVariant?: ButtonProps['variant'];
  actionButtonClassName?: string;
  buttonInContent?: boolean;
  cardDescriptionText?: string; 
  actionButtonText2?: string; 
  ActionButtonIcon2?: React.ElementType;
  href2?: string; 
  disabled2?: boolean; 
  className?: string;
}

function ActionCard({ 
  title, 
  description, 
  href, 
  Icon, 
  imageHint, 
  showImage = true, 
  disabled,
  actionButtonText,
  ActionButtonIcon, 
  actionButtonVariant,
  actionButtonClassName,
  buttonInContent = false,
  cardDescriptionText, 
  actionButtonText2,
  ActionButtonIcon2,
  href2,
  disabled2,
  className,
}: ActionCardProps) {

  const renderSingleButton = (text?: string, btnHref?: string, btnDisabled?: boolean, BtnIcon?: React.ElementType) => {
    const ButtonIconComponent = BtnIcon; 
    return (
      <Button 
        asChild 
        variant={actionButtonVariant || (btnDisabled ? "default" : "default")}
        className={cn(
          "w-full transform transition-transform hover:scale-105 active:scale-95 text-base py-2.5", 
          actionButtonClassName 
        )} 
        disabled={btnDisabled}
      >
        <Link href={btnDisabled || !btnHref ? "#" : btnHref}>
          {ButtonIconComponent && <ButtonIconComponent className="mr-2 h-4 w-4" />}
          {text || (btnDisabled ? "Coming Soon" : title)}
        </Link>
      </Button>
    );
  };
  

  return (
    <Card className={cn("group transition-all duration-300 flex flex-col bg-card h-full rounded-lg border shadow-none border-border/30 hover:shadow-lg overflow-hidden", className)}>
      {showImage && imageHint && (
        <div className="overflow-hidden rounded-t-lg relative">
          <Image
            src={`https://picsum.photos/seed/${title.replace(/\s+/g, '')}/400/200`}
            alt={title}
            width={400}
            height={200}
            className="object-cover w-full aspect-[16/9] transition-transform duration-300 group-hover:scale-110"
            data-ai-hint={imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 group-hover:from-black/40 transition-all duration-300"></div>
        </div>
      )}
      <CardHeader className={cn("p-4 md:p-5", !showImage && "pt-6", cardDescriptionText && "pb-2")}> 
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-all duration-300">
             <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
        </div>
        {cardDescriptionText && ( 
          <CardDescription className="text-sm mt-1 text-muted-foreground">
            {cardDescriptionText}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn("flex-grow p-4 md:p-5 flex flex-col", cardDescriptionText ? "pt-2" : "pt-0")}>
        {description && !buttonInContent && ( 
            <p className="text-sm text-muted-foreground line-clamp-3 flex-grow text-[15px]">{description}</p>
        )}
        {buttonInContent ? (
          <>
            {(title === "My Classes" || title === "My Payments") && ( 
                 <div className="flex justify-between items-center text-sm mb-2">
                 <span className="font-medium text-foreground/80">
                   {title === "My Classes" ? "Active Classes" : title === "My Payments" ? "Pending Payments" : description}
                 </span>
                 <span className="font-semibold text-primary">
                    {title === "My Classes" ? 5 : title === "My Payments" ? "₹2500" : description}
                </span>
               </div>
            )}
             {description && ( 
                 <p className="text-sm text-muted-foreground line-clamp-3 flex-grow text-[15px]">{description}</p>
             )}

            <div className="mt-auto pt-4 space-y-3"> 
              {actionButtonText && renderSingleButton(actionButtonText, href, disabled, ActionButtonIcon)}
              {actionButtonText2 && ActionButtonIcon2 && renderSingleButton(actionButtonText2, href2, disabled2, ActionButtonIcon2)}
            </div>
          </>
        ) : null}
      </CardContent>
      {!buttonInContent && href && ( 
         <CardFooter className="p-4 md:p-5 border-t bg-muted/20"> 
          {renderSingleButton(actionButtonText || title, href, disabled, ActionButtonIcon)}
        </CardFooter>
      )}
    </Card>
  );
}
    


