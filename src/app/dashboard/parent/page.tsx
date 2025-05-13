"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; 
import { useAuthMock } from "@/hooks/use-auth-mock";
import { PlusCircle, Eye, ListChecks, School, DollarSign, CalendarDays, MessageSquareQuote, UserCircle as UserCircleIcon, Edit3, SearchCheck, UsersRound, Star, Camera, MailCheck, PhoneCall, CheckCircle, XCircle, Briefcase, Construction } from "lucide-react";
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
    <Card className="bg-card border border-border/30 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 animate-in fade-in zoom-in-95 ease-out">
      <CardContent className="p-4 md:p-5 flex items-center gap-3 md:gap-4">
        <div className={cn("p-3 rounded-lg shadow-inner", bgColorClass, colorClass === "text-primary" ? "bg-primary/10" : "")}>
          <Icon className={cn("w-5 h-5 md:w-6 md:h-6", colorClass)} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-lg md:text-xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
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
    { title: "Favorite Tutors", value: 3, icon: Star, colorClass: "text-yellow-500", bgColorClass:"bg-yellow-100/70", imageHint: "star rating" },
    { title: "Payments Made", value: "₹12,500", icon: DollarSign, colorClass: "text-red-500", bgColorClass:"bg-red-100/70", imageHint: "money stack" },
  ];

  const parentActionCards = [
      <ActionCard
        key="my-enquiries"
        title="My Enquiries"
        descriptionText="Manage your posted tuition needs and connect with suitable tutors."
        IconComponent={ListChecks} 
        quickInsightText="2 Active Enquiries"
        ctaText="Manage Enquiries"
        ctaHref="/dashboard/my-requirements" 
        cardBgClass="bg-blue-50 hover:bg-blue-100/80"
        accentTextClass="text-blue-700"
        accentBgClass="bg-blue-100 group-hover:bg-blue-200/80"
        illustrationHint="enquiry list"
      />,
      <ActionCard
        key="demo-sessions"
        title="Demo Sessions"
        descriptionText="Manage demo class requests, view upcoming demos, and book full classes."
        IconComponent={MessageSquareQuote} 
        quickInsightText="1 Upcoming Demo"
        ctaText="View Demos"
        ctaHref="/dashboard/demo-sessions"
        disabled={false} 
        cardBgClass="bg-purple-50 hover:bg-purple-100/80"
        accentTextClass="text-purple-700"
        accentBgClass="bg-purple-100 group-hover:bg-purple-200/80"
        illustrationHint="online class"
      />,
       <ActionCard
        key="my-classes"
        title="My Scheduled Classes"
        descriptionText="View upcoming classes, manage schedules, and track attendance."
        IconComponent={CalendarDays} 
        quickInsightText="2 Active Classes"
        ctaText="View My Classes"
        ctaHref="/dashboard/my-classes"
        disabled={false} 
        cardBgClass="bg-pink-50 hover:bg-pink-100/80"
        accentTextClass="text-pink-700"
        accentBgClass="bg-pink-100 group-hover:bg-pink-200/80"
        illustrationHint="calendar schedule"
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

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
        {summaryStats.map((stat, index) => (
          <SummaryStatCard 
            key={stat.title} 
            {...stat}
          />
        ))}
      </div>

      {/* Action Cards Section */}
      {parentActionCards.length > 0 && (
          <div className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3"> 
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
      
      {/* Calendar Widget Placeholder */}
      <Card className="bg-card border border-border/30 rounded-xl shadow-sm animate-in fade-in duration-500 ease-out" style={{ animationDelay: `0.8s` }}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <CalendarDays className="w-6 h-6 mr-2.5" /> My Calendar
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
  cardBgClass: string;
  accentTextClass: string;
  accentBgClass: string;
  disabled?: boolean;
}

function ActionCard({ 
  title, 
  IconComponent,
  illustrationHint,
  descriptionText,
  quickInsightText,
  ctaText,
  ctaHref,
  cardBgClass,
  accentTextClass,
  accentBgClass,
  disabled,
}: ActionCardProps) {
  
  return (
    <Card className={cn(
        "group transition-all duration-300 ease-out flex flex-col h-full rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-border/20 transform hover:-translate-y-1.5 hover:scale-[1.02]",
        cardBgClass
    )}>
      <CardHeader className="p-5 md:p-6 text-center items-center"> 
        {illustrationHint ? (
            <Image 
                src={`https://picsum.photos/seed/${illustrationHint.replace(/\s+/g, '')}/300/180`}
                alt={`${title} illustration`}
                width={300}
                height={180}
                className="w-full h-32 md:h-36 object-cover rounded-lg mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300 ease-out"
                data-ai-hint={illustrationHint}
            />
        ) : (
            <div className={cn("p-3.5 rounded-full mb-3 shadow-md transition-all duration-300 ease-out group-hover:scale-110", accentBgClass)}>
                <IconComponent className={cn("w-8 h-8 md:w-9 md:h-9", accentTextClass)} />
            </div>
        )}
        <CardTitle className={cn("text-lg md:text-xl font-semibold transition-colors duration-300", accentTextClass)}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 md:p-6 pt-0 text-center flex-grow flex flex-col justify-between">
        <div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{descriptionText}</p>
            <p className={cn("text-2xl font-bold mb-5 transition-colors duration-300", accentTextClass)}>{quickInsightText}</p>
        </div>
      </CardContent>
      <CardFooter className={cn("p-4 md:p-5 border-t transition-colors duration-300", cardBgClass, "group-hover:bg-opacity-80")}>
        <Button 
            asChild 
            variant="default" 
            className={cn(
                "w-full transform transition-all duration-300 ease-out hover:scale-105 active:scale-95 text-sm md:text-base py-2.5 shadow-md hover:shadow-lg",
                "bg-primary text-primary-foreground hover:bg-primary/90 border-primary" 
            )} 
            disabled={disabled}
        >
          <Link href={disabled ? "#" : ctaHref}>{disabled ? "Coming Soon" : ctaText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Placeholder component for favorite tutors, can be expanded later
function FavoriteTutorsCard() {
    return (
      <Card className="bg-card border border-border/30 rounded-xl shadow-sm animate-in fade-in duration-500 ease-out" style={{ animationDelay: `0.9s` }}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <Star className="w-6 h-6 mr-2.5 text-yellow-500 fill-yellow-400" /> Favorite Tutors
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Quick access to your preferred tutors.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {MOCK_TUTOR_PROFILES.slice(0, 4).map(tutor => (
            <Link href={`/tutors/${tutor.id}`} key={tutor.id} className="group text-center">
              <Avatar className="w-16 h-16 mx-auto border-2 border-border group-hover:border-primary transition-colors">
                <AvatarImage src={tutor.avatar} alt={tutor.name} />
                <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="text-xs font-medium text-foreground mt-1.5 truncate group-hover:text-primary transition-colors">{tutor.name}</p>
            </Link>
          ))}
           {MOCK_TUTOR_PROFILES.length === 0 && (
            <p className="col-span-full text-center text-xs text-muted-foreground py-4">You haven't favorited any tutors yet.</p>
          )}
        </CardContent>
      </Card>
    );
}
