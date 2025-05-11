"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; 
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Lightbulb, PlusCircle, Search, UserCheck, Users, BookOpen, Activity, Briefcase, ListChecks, Camera, Edit, Edit2, MailCheck, PhoneCall, CheckCircle, XCircle, UserCog, ClipboardEdit, DollarSign, ClipboardList, Coins, CalendarClock, Award, ShoppingBag, Eye, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { TutorProfile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, type ChangeEvent, useState, useEffect } from "react"; 
import { useToast } from "@/hooks/use-toast"; 
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { UpdateProfileActionsCard } from "@/components/dashboard/UpdateProfileActionsCard";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";


export default function DashboardPage() {
  const { user } = useAuthMock();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // OTP Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpVerificationType, setOtpVerificationType] = useState<"email" | "phone" | null>(null);
  const [otpVerificationIdentifier, setOtpVerificationIdentifier] = useState<string | null>(null);

  // Mock verification status using local state, could be fetched or part of user object
  const [isEmailVerified, setIsEmailVerified] = useState(user?.isEmailVerified || false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(user?.isPhoneVerified || false);

  useEffect(() => {
    if (user) {
      setIsEmailVerified(user.isEmailVerified || false);
      setIsPhoneVerified(user.isPhoneVerified || false);
    }
  }, [user]);


  if (!user) {
    return <div className="text-center p-8">Loading user data or please sign in.</div>;
  }

  const handleAvatarClick = () => {
    if (user?.role === 'tutor') {
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
    // For phone, you'd typically fetch/use a stored phone number. Using a placeholder for mock.
    setOtpVerificationIdentifier(type === "email" ? user.email : user.phone || "Your Phone Number"); 
    setIsOtpModalOpen(true);
  };

  const handleOtpSuccess = () => {
    if (otpVerificationType === "email") {
      setIsEmailVerified(true);
      // Toast is handled by the modal itself now
    } else if (otpVerificationType === "phone") {
      setIsPhoneVerified(true);
      // Toast is handled by the modal itself now
    }
    setIsOtpModalOpen(false); 
    setOtpVerificationType(null);
    setOtpVerificationIdentifier(null);
  };


  const actionCards = [];

  if (user.role === "parent") {
    actionCards.push(
      <ActionCard
        key="post-requirement"
        title="Post New Requirement"
        description="Need a tutor? Post your requirements and let tutors find you."
        href="/dashboard/post-requirement"
        Icon={PlusCircle}
        imageHint="writing list"
      />,
      <ActionCard
        key="my-requirements"
        title="My Requirements"
        description="View and manage your active tuition postings."
        href="/dashboard/my-requirements"
        Icon={ListChecks} 
        imageHint="task checklist"
      />,
       <ActionCard
        key="recent-activity-parent"
        title="Recent Activity"
        description="Updates on your postings and applications."
        href="#"
        Icon={Activity}
        imageHint="activity chart"
        showImage={true} 
        disabled
      />
    );
  } else if (user.role === "admin") {
    actionCards.push(
      <ActionCard
        key="manage-users"
        title="Manage Users"
        description="Oversee parent and tutor accounts."
        href="/dashboard/admin/manage-users"
        Icon={Users}
        imageHint="people community"
        disabled
      />,
      <ActionCard
        key="manage-tuitions"
        title="Manage Tuitions"
        description="Review and manage all tuition postings."
        href="/dashboard/admin/manage-tuitions"
        Icon={BookOpen}
        imageHint="library books"
        disabled
      />,
       <ActionCard
        key="recent-activity-admin"
        title="Recent Activity"
        description="Updates on platform activity and reports."
        href="#"
        Icon={Activity}
        imageHint="admin dashboard activity"
        showImage={true}
        disabled
      />
    );
  }


  return (
    <div className="space-y-8">
      <div className={cn("grid gap-6", user.role === 'tutor' ? "md:grid-cols-1" : "md:grid-cols-3")}>
         <Card className="border bg-card rounded-lg shadow-sm animate-in fade-in duration-700 ease-out overflow-hidden md:col-span-1">
          <CardHeader className={cn("pt-2 px-4 pb-4 md:pt-3 md:px-5 md:pb-5 relative")}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {user.role === 'tutor' && (
                <div className="relative group shrink-0">
                  <Avatar
                    className="h-16 w-16 border-2 border-primary/30 group-hover:opacity-80 transition-opacity"
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
              )}
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-foreground tracking-tight text-xl md:text-2xl font-semibold">Welcome back, {user.name}!</CardTitle>
                  {user.status && (
                    <Badge variant={user.status === "Active" ? "default" : "destructive"} className="text-xs py-0.5 px-2">
                      {user.status === "Active" ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                      {user.status}
                    </Badge>
                  )}
                </div>
                {(user.role === 'parent' || user.role === 'admin') && (
                  <CardDescription className="text-md md:text-lg text-foreground/80 mt-1">
                      You are logged in as a {user.role}. Here's your dashboard overview.
                  </CardDescription>
                )}
                {user.role === 'tutor' && (
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                     <Button
                        variant="secondary" // Base variant, overridden by conditional className
                        size="sm" // Base size, overridden by conditional className
                        className={cn(
                          "h-auto rounded-full", // Common base styles
                          isEmailVerified
                            ? "bg-green-600 text-primary-foreground border-transparent py-0.5 px-2 text-xs font-semibold cursor-default hover:bg-green-700 no-underline" // Verified state
                            : "text-xs font-normal px-3 py-1.5 text-primary underline hover:bg-secondary/80" // Unverified state
                        )}
                        onClick={() => !isEmailVerified && handleOpenOtpModal("email")}
                        disabled={isEmailVerified}
                      >
                        {isEmailVerified ? <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> : <MailCheck className="mr-1.5 h-3.5 w-3.5" />}
                        {isEmailVerified ? "Email Verified" : "Verify Email"}
                      </Button>
                      <Button
                        variant="secondary" // Base variant
                        size="sm" // Base size
                         className={cn(
                          "h-auto rounded-full", // Common base styles
                          isPhoneVerified
                            ? "bg-green-600 text-primary-foreground border-transparent py-0.5 px-2 text-xs font-semibold cursor-default hover:bg-green-700 no-underline" // Verified state
                            : "text-xs font-normal px-3 py-1.5 text-primary underline hover:bg-secondary/80" // Unverified state
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
          {(user.role === 'parent' || user.role === 'admin') && (
              <CardContent className="p-4 md:p-5 pt-0"> 
                  <p className="text-foreground/70 text-[15px]">Manage your tuition activities and settings from here.</p>
              </CardContent>
          )}
          {user.role === 'tutor' && (
            <CardContent className="p-4 md:p-5 pt-2 space-y-3 border-t"> 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 items-start"> 
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Coins className="w-3.5 h-3.5 mr-1.5 text-primary/80" />
                    <span>Lead Balance</span>
                  </div>
                  <p className="text-sm font-semibold text-primary">{50}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarClock className="w-3.5 h-3.5 mr-1.5 text-primary/80" />
                    <span>Plan Expiry</span>
                  </div>
                  <p className="text-sm font-medium">Dec 31, 2024</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2"> 
                 <Badge variant="outline" className="border-green-500 text-green-600 bg-green-500/10 py-1 px-2.5 text-xs font-medium">
                    <Award className="w-3.5 h-3.5 mr-1.5" /> Premium Plan
                 </Badge>
                <Button size="sm" className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95">
                  <ShoppingBag className="w-4 h-4 mr-2" /> Buy More Leads
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {user.role === 'tutor' && (
        <div className="grid gap-6 md:grid-cols-2"> 
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
              title="My Classes"
              cardDescriptionText="View and manage your scheduled classes." 
              description="5" 
              href="#" 
              Icon={ListChecks} 
              showImage={false}
              disabled={false} 
              actionButtonText="View Classes"
              ActionButtonIcon={ClipboardList}
              
              actionButtonText2="Create Class" 
              ActionButtonIcon2={PlusCircle} 
              href2="#" 
              disabled2={false} 

              actionButtonVariant="outline"
              actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
              buttonInContent={true} 
            />
          </div>
          <div 
            className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
            style={{ animationDelay: `0.4s` }} 
          >
            <ActionCard
              title="My Payments"
              description="₹12,500" 
              cardDescriptionText="View your earnings and manage payout details."
              Icon={DollarSign}
              showImage={false}
              buttonInContent={true} 
              actionButtonText="View All Payments"
              ActionButtonIcon={ClipboardList}
              href="#"
              disabled={false}
              actionButtonText2="Collect Payment"
              ActionButtonIcon2={DollarSign}
              href2="#"
              disabled2={false}
              actionButtonVariant="outline"
              actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
            />
          </div>
           <div 
            className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
            style={{ animationDelay: `0.5s` }}
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
            />
          </div>
        </div>
      )}


      {(user.role === 'parent' || user.role === 'admin') && actionCards.length > 0 && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {actionCards.map((card, index) => (
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
  description: string;
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
    <Card className="group transition-all duration-300 flex flex-col bg-card h-full rounded-lg border shadow-sm hover:shadow-lg overflow-hidden">
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
        {buttonInContent ? (
          <>
            {(title === "My Classes" || title === "My Payments" || title === "My Enquiries") && (
                 <div className="flex justify-between items-center text-sm mb-2">
                 <span className="font-medium text-foreground/80">
                   {title === "My Classes" ? "Active Classes" : title === "My Payments" ? "Pending Payments" : "Recommended Enquiries"}
                 </span>
                 <span className="font-semibold text-primary">{description}</span>
               </div>
            )}
             {!((title === "My Classes" || title === "My Payments" || title === "My Enquiries")) && (
                 <p className="text-sm text-muted-foreground line-clamp-3 flex-grow text-[15px]">{description}</p>
             )}

            <div className="mt-auto pt-4 space-y-3"> 
              {actionButtonText && renderSingleButton(actionButtonText, href, disabled, ActionButtonIcon)}
              {actionButtonText2 && ActionButtonIcon2 && renderSingleButton(actionButtonText2, href2, disabled2, ActionButtonIcon2)}
            </div>
          </>
        ) : (
           <p className="text-sm text-muted-foreground line-clamp-3 flex-grow text-[15px]">{description}</p>
        )}
      </CardContent>
      {!buttonInContent && href && ( 
         <CardFooter className="p-4 md:p-5 border-t bg-muted/20"> 
          {renderSingleButton(actionButtonText || title, href, disabled, ActionButtonIcon)}
        </CardFooter>
      )}
    </Card>
  );
}
    