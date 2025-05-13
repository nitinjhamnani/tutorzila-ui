
"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; 
import { useAuthMock } from "@/hooks/use-auth-mock";
import { PlusCircle, Eye, ListChecks, School, DollarSign, CalendarDays, MessageSquareQuote, UserCircle as UserCircleIcon, Edit3, SearchCheck } from "lucide-react";
import Link from "next/link";
import type { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, type ChangeEvent, useState, useEffect } from "react"; 
import { useToast } from "@/hooks/use-toast"; 
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MailCheck, PhoneCall, CheckCircle, XCircle, Camera } from "lucide-react";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";

interface SummaryStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass?: string;
  imageHint: string;
}

function SummaryStatCard({ title, value, icon: Icon, colorClass = "text-primary", imageHint }: SummaryStatCardProps) {
  return (
    <Card className="bg-card border border-border/30 rounded-xl shadow-none hover:shadow-lg transition-shadow duration-300 animate-in fade-in zoom-in-95 ease-out">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn("p-3 rounded-lg bg-opacity-10", colorClass === "text-primary" ? "bg-primary/10" : "bg-green-500/10")}>
          <Icon className={cn("w-6 h-6", colorClass)} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
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
    { title: "Total Requirements Posted", value: 5, icon: ListChecks, colorClass: "text-primary", imageHint: "document list" },
    { title: "Active Tuitions", value: 2, icon: CalendarDays, colorClass: "text-green-500", imageHint: "active calendar" },
    { title: "Upcoming Demos", value: 1, icon: MessageSquareQuote, colorClass: "text-blue-500", imageHint: "chat bubble" },
    { title: "Payments Made", value: "₹12,500", icon: DollarSign, colorClass: "text-yellow-500", imageHint: "money stack" },
  ];

  const parentActionCards = [
      <ActionCard
        key="my-enquiries"
        title="My Enquiries"
        cardDescriptionText="Manage your posted tuition needs and connect with suitable tutors."
        Icon={ListChecks} 
        buttonInContent={true}
        actionButtonText="View My Enquiries"
        ActionButtonIcon={Eye} 
        href="/dashboard/my-requirements" 
        actionButtonVariant="outline"
        actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        className="shadow-none border border-border/30 hover:shadow-lg"
        actionButtonText2="Create Enquiry"
        ActionButtonIcon2={PlusCircle}
        href2="/dashboard/post-requirement" 
        imageHint="list checkmark"
      />,
      <ActionCard
        key="find-tutors" // Renamed from my-tuition
        title="Find Tutors"
        cardDescriptionText="Explore profiles of qualified tutors and find the perfect match for your child."
        Icon={SearchCheck} // Changed Icon
        buttonInContent={true}
        actionButtonText="View All Tutors"
        ActionButtonIcon={Eye}
        href="/search-tuitions" 
        actionButtonVariant="outline"
        actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        className="shadow-none border border-border/30 hover:shadow-lg"
        imageHint="magnifying glass" // Updated image hint
      />,
      <ActionCard
        key="demo-sessions"
        title="Demo Sessions"
        cardDescriptionText="Manage demo class requests, view upcoming demos, and book full classes."
        Icon={MessageSquareQuote} 
        buttonInContent={true}
        actionButtonText="View Demo Sessions"
        ActionButtonIcon={Eye} 
        href="/dashboard/demo-sessions"
        disabled={true} 
        actionButtonVariant="outline"
        actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        className="shadow-none border border-border/30 hover:shadow-lg"
        imageHint="demo class"
      />,
      <ActionCard
        key="manage-students"
        title="Student Profiles"
        cardDescriptionText="Add and manage profiles for your children to personalize tuition needs."
        Icon={UserCircleIcon} 
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
        key="my-classes"
        title="My Scheduled Classes"
        cardDescriptionText="View upcoming classes, manage schedules, and track attendance for each student."
        Icon={CalendarDays} 
        buttonInContent={true}
        actionButtonText="View My Classes"
        ActionButtonIcon={CalendarDays} 
        href="/dashboard/my-classes"
        disabled={true} 
        actionButtonVariant="outline"
        actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        className="shadow-none border border-border/30 hover:shadow-lg"
        imageHint="class schedule"
      />,
      <ActionCard
        key="my-payments"
        title="My Payments"
        cardDescriptionText="Track all tuition payments, view history, and manage pending transactions."
        Icon={DollarSign} 
        buttonInContent={true}
        actionButtonText="View Payments"
        ActionButtonIcon={DollarSign} 
        href="/dashboard/payments"
        disabled={true} 
        actionButtonVariant="outline"
        actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        className="shadow-none border border-border/30 hover:shadow-lg"
        imageHint="payment history"
      />
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
                        "h-auto rounded-full text-primary", 
                        isEmailVerified
                          ? "bg-primary text-primary-foreground border border-primary hover:bg-primary/90 py-0.5 px-2 text-xs font-semibold cursor-default no-underline" 
                          : "text-xs font-normal px-3 py-1.5 underline bg-card hover:text-primary/80 hover:bg-secondary/80" 
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
                        "h-auto rounded-full text-primary", 
                        isPhoneVerified
                          ? "bg-primary text-primary-foreground border border-primary hover:bg-primary/90 py-0.5 px-2 text-xs font-semibold cursor-default no-underline" 
                          : "text-xs font-normal px-3 py-1.5 underline bg-card hover:text-primary/80 hover:bg-secondary/80"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {summaryStats.map((stat, index) => (
          <SummaryStatCard 
            key={stat.title} 
            {...stat}
            // imageHint={stat.imageHint} // Ensure imageHint is passed
          />
        ))}
      </div>


      {/* Action Cards Section */}
      {parentActionCards.length > 0 && (
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
      <CardHeader className={cn("p-4 md:p-5 pt-6", cardDescriptionText && "pb-2")}> 
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
    </Card>
  );
}


