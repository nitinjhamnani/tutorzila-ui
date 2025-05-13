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
        descriptionText="View and manage all tutoring requests you've posted."
        IconComponent={ListChecks} 
        ctaText="View My Enquiries"
        ctaHref="/dashboard/my-requirements" 
        illustrationHint="enquiry list"
      />,
      <ActionCard
        key="my-classes" 
        title="My Classes" 
        descriptionText="Track all your booked and ongoing classes."
        IconComponent={SearchCheck}
        ctaText="View All Classes" 
        ctaHref="/dashboard/my-classes" 
        illustrationHint="student profile"
      />,
       <ActionCard
        key="my-demos" 
        title="My Demos" 
        descriptionText="Check scheduled, past, and upcoming demo sessions."
        IconComponent={MessageSquareQuote} 
        ctaText="View All Demos" 
        ctaHref="/dashboard/demo-sessions" 
        disabled={false} 
        illustrationHint="calendar schedule"
      />,
        <ActionCard
        key="payments"
        title="My Payments"
        descriptionText="View your payment history and status."
        IconComponent={DollarSign} 
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
            Consolidated view of demo schedules, classes, and payment due dates.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          {/* Placeholder for Calendar Component */}
          <div className="mb-6 p-4 border border-dashed border-border/50 rounded-lg text-center bg-muted/20">
            <Construction className="w-12 h-12 text-primary/40 mx-auto mb-3" />
            <p className="text-md font-medium text-foreground/60">Interactive Calendar Coming Soon</p>
            <p className="text-xs text-muted-foreground">Hover/click on dates to see event summaries.</p>
          </div>

          {/* Placeholder for Upcoming Events List */}
          <div>
            <h4 className="text-md font-semibold text-foreground mb-3">Upcoming Events</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {/* Example Event Item - Replace with dynamic data */}
              <div className="flex items-center gap-3 p-2.5 border border-border/30 rounded-md bg-background hover:bg-muted/50 transition-colors text-xs">
                <div className="p-1.5 bg-blue-100/70 text-blue-600 rounded-md">
                  <CalendarDays className="w-3.5 h-3.5" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-foreground/90">Math Class with Dr. Carter</p>
                  <p className="text-muted-foreground">Tomorrow, 4:00 PM - 5:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 border border-border/30 rounded-md bg-background hover:bg-muted/50 transition-colors text-xs">
                <div className="p-1.5 bg-green-100/70 text-green-600 rounded-md">
                  <MessageSquareQuote className="w-3.5 h-3.5" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-foreground/90">Physics Demo with John A.</p>
                  <p className="text-muted-foreground">In 3 days, 11:00 AM - 11:30 AM</p>
                </div>
              </div>
               <div className="flex items-center gap-3 p-2.5 border border-border/30 rounded-md bg-background hover:bg-muted/50 transition-colors text-xs">
                <div className="p-1.5 bg-red-100/70 text-red-500 rounded-md">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-foreground/90">Payment Due for English Class</p>
                  <p className="text-muted-foreground">Next week</p>
                </div>
              </div>
              <div className="text-center text-muted-foreground py-4">
                <Construction className="w-10 h-10 text-primary/30 mx-auto mb-2" />
                <p className="text-xs">Full event list coming soon.</p>
              </div>
            </div>
          </div>
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
            {/* Removed quickInsightText rendering */}
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








