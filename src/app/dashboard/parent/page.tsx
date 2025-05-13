// src/app/dashboard/parent/page.tsx
"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; 
import { useAuthMock } from "@/hooks/use-auth-mock";
import { PlusCircle, Eye, ListChecks, School, DollarSign, CalendarDays, MessageSquareQuote, UserCircle as UserCircleIcon, Edit3, SearchCheck, UsersRound, Star, Camera, MailCheck, PhoneCall, CheckCircle, XCircle, Briefcase, Construction, CalendarIcon } from "lucide-react";
import Link from "next/link";
import type { User, TutorProfile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, type ChangeEvent, useState, useEffect } from "react"; 
import { useToast } from "@/hooks/use-toast"; 
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";
import Image from "next/image";
import { MOCK_TUTOR_PROFILES } from "@/lib/mock-data";


interface SummaryStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass?: string;
  bgColorClass?: string; 
  imageHint: string; 
}

function SummaryStatCard({ title, value, icon: Icon, colorClass = "text-primary", bgColorClass = "bg-primary/10", imageHint }: SummaryStatCardProps) {
  return (
    <Card className="bg-card border border-border/30 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 animate-in fade-in zoom-in-95 ease-out aspect-square flex flex-col justify-center items-center text-center p-2">
        <div className={cn("p-3 mb-2 rounded-full shadow-sm", bgColorClass, "bg-primary/10")}> {/* Ensured bg-primary/10 for icon background */}
          <Icon className={cn("w-6 h-6", colorClass)} /> {/* Increased icon size */}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full w-7 h-7 flex items-center justify-center mx-auto mb-1 leading-tight"> {/* Encapsulated number */}
             {value}
          </div>
          <p className="text-[10px] text-muted-foreground whitespace-nowrap truncate font-medium leading-tight">{title}</p>
        </div>
    </Card>
  );
}


export default function ParentDashboardPage() {
  const { user } = useAuthMock();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpVerificationType, setOtpVerificationType] = useState<"email" | "phone" | null>(null);
  const [otpVerificationIdentifier, setOtpVerificationIdentifier] = useState<string | null>(null);

  const [isEmailVerified, setIsEmailVerified] = useState(user?.isEmailVerified || false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(user?.isPhoneVerified || false);
  
  useEffect(() => {
    if (user) {
      setIsEmailVerified(user.isEmailVerified || false);
      setIsPhoneVerified(user.isPhoneVerified || false);
    }
  }, [user]);

  if (!user || user.role !== 'parent') {
    return <div className="text-center p-8">Access Denied. This dashboard is for parents only.</div>;
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

  const summaryStats = [
    { title: "Total Enquiries", value: 5, icon: ListChecks, colorClass: "text-blue-600", bgColorClass:"bg-blue-100/70", imageHint: "document list" },
    { title: "Active Classes", value: 2, icon: CalendarDays, colorClass: "text-green-600", bgColorClass:"bg-green-100/70", imageHint: "active calendar" },
    { title: "Upcoming Demos", value: 1, icon: MessageSquareQuote, colorClass: "text-purple-600", bgColorClass:"bg-purple-100/70", imageHint: "chat bubble" },
    { title: "Payments Made", value: "₹12k", icon: DollarSign, colorClass: "text-red-500", bgColorClass:"bg-red-100/70", imageHint: "money stack" }, 
  ];

  const parentActionCards = [
      <ActionCard
        key="my-enquiries"
        title="My Enquiries"
        descriptionText="Manage your posted tuition needs and track tutor applications."
        IconComponent={ListChecks} 
        quickInsightText="2 Active Enquiries"
        ctaText="View My Enquiries"
        ctaHref="/dashboard/my-requirements" 
        actionButtonText2="Create Enquiry"
        ActionButtonIcon2={PlusCircle}
        href2="/dashboard/post-requirement"
        illustrationHint="enquiry list"
      />,
      <ActionCard
        key="my-classes" // Changed from my-tuitions
        title="My Classes" // Changed from My Tuitions
        descriptionText="Browse tutor profiles or manage booked classes." // Updated description
        IconComponent={SearchCheck}
        quickInsightText="Find your next tutor"
        ctaText="View All Classes" // Changed from View All Tutors
        ctaHref="/dashboard/my-classes" // Changed href
        illustrationHint="student profile"
      />,
       <ActionCard
        key="my-demos" // Changed from my-classes
        title="My Demos" // Changed from My Scheduled Classes
        descriptionText="View upcoming demos, manage schedules, and track progress."
        IconComponent={MessageSquareQuote} // Changed icon to MessageSquareQuote for demos
        quickInsightText="1 Upcoming Demo" // Updated quick insight
        ctaText="View All Demos" // Changed from View My Classes
        ctaHref="/dashboard/demo-sessions" // Changed href
        disabled={false} 
        illustrationHint="calendar schedule"
      />,
        <ActionCard
        key="payments"
        title="My Payments"
        descriptionText="Track your tuition payment history and manage outstanding payments."
        IconComponent={DollarSign} 
        quickInsightText="View Payment History"
        ctaText="Manage Payments"
        ctaHref="/dashboard/payments"
        disabled={false} 
        illustrationHint="financial transactions"
      />,
    ];

  return (
    <div className="space-y-6 md:space-y-8">
      <Card className="bg-card rounded-xl animate-in fade-in duration-700 ease-out overflow-hidden border border-border/30 shadow-sm w-full">
        <CardHeader className="pt-4 px-4 pb-3 md:pt-5 md:px-6 md:pb-4 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative group shrink-0">
                <Avatar
                  className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/30 group-hover:opacity-80 transition-opacity cursor-pointer shadow-sm"
                  onClick={handleAvatarClick} 
                >
                  <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl md:text-2xl">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 flex items-center justify-center bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                  aria-label="Update profile picture"
                >
                  <Camera className="w-3 h-3 md:w-3.5 md:h-3.5" />
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
                    variant={user.status === "Active" ? "default" : "destructive"} 
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
                        "h-auto rounded-full", 
                        isEmailVerified
                          ? "bg-primary text-primary-foreground border border-primary hover:bg-primary/90 py-0.5 px-2 text-xs font-semibold cursor-default no-underline" 
                          : "text-xs font-normal px-3 py-1.5 underline bg-card text-primary hover:text-primary/80 hover:bg-secondary/80 border border-border" 
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
                        "h-auto rounded-full", 
                        isPhoneVerified
                          ? "bg-primary text-primary-foreground border border-primary hover:bg-primary/90 py-0.5 px-2 text-xs font-semibold cursor-default no-underline" 
                          : "text-xs font-normal px-3 py-1.5 underline bg-card text-primary hover:text-primary/80 hover:bg-secondary/80 border border-border"
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
        </CardHeader>
      </Card>

       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-2.5">
        {summaryStats.map((stat, index) => (
          <SummaryStatCard 
            key={stat.title} 
            {...stat}
          />
        ))}
      </div>

      {parentActionCards.length > 0 && (
          <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-2"> 
          {parentActionCards.map((card, index) => (
            <div 
              key={index} 
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
              style={{ animationDelay: `${index * 0.08 + 0.4}s` }} 
            >
              {card}
            </div>
          ))}
        </div>
      )}
      
      <Card className="bg-card border border-border/30 rounded-xl shadow-sm animate-in fade-in duration-500 ease-out" style={{ animationDelay: `0.8s` }}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2.5" /> My Calendar
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            View scheduled demos, classes, and payment due dates.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 text-center">
          <Construction className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">Interactive Calendar Coming Soon!</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            This section will display all your tutoring-related events in one place.
          </p>
        </CardContent>
      </Card>


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
  IconComponent: React.ElementType;
  illustrationHint?: string;
  descriptionText: string;
  quickInsightText: string;
  ctaText: string;
  ctaHref: string;
  disabled?: boolean;
  actionButtonText2?: string;
  ActionButtonIcon2?: React.ElementType;
  href2?: string;
  disabled2?: boolean;
}

function ActionCard({ 
  title, 
  IconComponent,
  illustrationHint,
  descriptionText,
  quickInsightText,
  ctaText,
  ctaHref,
  disabled,
  actionButtonText2,
  ActionButtonIcon2,
  href2,
  disabled2,
}: ActionCardProps) {
  
  return (
    <Card className={cn(
        "group transition-all duration-300 ease-out flex flex-col h-full rounded-xl shadow-sm hover:shadow-lg overflow-hidden border border-border/30 transform hover:-translate-y-1 hover:scale-[1.015]",
        "bg-card hover:bg-muted/50" // Uniform card color
    )}>
      <CardHeader className="p-4 md:p-5 text-center items-center"> 
          <div className={cn("p-3 rounded-full mb-2 shadow-sm transition-all duration-300 ease-out group-hover:scale-110", "bg-primary/10")}>
              <IconComponent className={cn("w-7 h-7 md:w-8 md:h-8", "text-primary")} />
          </div>
        <CardTitle className={cn("text-md md:text-lg font-semibold transition-colors duration-300", "text-primary")}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-5 pt-0 text-center flex-grow flex flex-col justify-between">
        <div>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{descriptionText}</p>
            <p className={cn("text-xl font-semibold mb-3 transition-colors duration-300", "text-primary")}>{quickInsightText}</p>
        </div>
      </CardContent>
      <CardFooter className={cn(
        "p-3 md:p-4 border-t transition-colors duration-300 flex flex-col sm:flex-row gap-2 items-stretch w-full", 
        "bg-card group-hover:bg-muted/30"
        )}>
        <Button 
            asChild 
            variant="default" 
            size="sm"
            className={cn(
                "w-full sm:flex-1 sm:min-w-0 transform transition-all duration-300 ease-out hover:scale-105 active:scale-95 text-xs md:text-sm py-2 px-2 shadow-sm hover:shadow-md", 
                "bg-primary text-primary-foreground hover:bg-primary/90 border-primary" 
            )} 
            disabled={disabled}
        >
          <Link href={disabled ? "#" : ctaHref}>{disabled ? "Coming Soon" : ctaText}</Link>
        </Button>
        {actionButtonText2 && href2 && ActionButtonIcon2 && (
           <Button 
            asChild 
            variant="outline"
            size="sm"
            className={cn(
                "w-full sm:flex-1 sm:min-w-0 transform transition-all duration-300 ease-out hover:scale-105 active:scale-95 text-xs md:text-sm py-2 px-2 shadow-sm hover:shadow-md", 
                "bg-card border-primary text-primary hover:bg-primary/5"
            )} 
            disabled={disabled2}
          >
            <Link href={disabled2 ? "#" : href2} className="flex items-center justify-center">
              <ActionButtonIcon2 className="mr-1.5 h-3.5 w-3.5"/>
              {disabled2 ? "Coming Soon" : actionButtonText2}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}



