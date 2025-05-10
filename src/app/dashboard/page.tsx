"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; 
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Lightbulb, PlusCircle, Search, UserCheck, Users, BookOpen, Activity, Briefcase, ListChecks, Camera, Edit, Edit2, MailCheck, PhoneCall, CheckCircle, XCircle, UserCog, ClipboardEdit, DollarSign, ClipboardList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UpdateProfileActionsCard } from "@/components/dashboard/UpdateProfileActionsCard";
import type { TutorProfile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, type ChangeEvent } from "react"; 
import { useToast } from "@/hooks/use-toast"; 
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthMock();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      // Simulate file upload
      console.log("Selected file:", file.name);
      // In a real app, you would upload the file and update the user's avatar URL
      toast({
        title: "Profile Picture Updated (Mock)",
        description: `${file.name} selected. In a real app, this would be uploaded.`,
      });
      // To visually update (mock):
      // setUser({...user, avatar: URL.createObjectURL(file) }); // This would require setUser in useAuthMock
    }
  };

  const actionCards = [];

  if (user.role === "parent") {
    actionCards.push(
      <ActionCard
        key="post-requirement"
        title="Post New Requirement"
        description="Need a tutor? Post your requirements and let tutors find you."
        href="/dashboard/post-requirement"
        icon={PlusCircle}
        imageHint="writing list"
      />,
      <ActionCard
        key="my-requirements"
        title="My Requirements"
        description="View and manage your active tuition postings."
        href="/dashboard/my-requirements"
        icon={ListChecks} 
        imageHint="task checklist"
      />,
       <ActionCard
        key="recent-activity-parent"
        title="Recent Activity"
        description="Updates on your postings and applications."
        href="#"
        icon={Activity}
        imageHint="activity chart"
        showImage={true} // Explicitly show image for this card
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
        icon={Users}
        imageHint="people community"
        disabled
      />,
      <ActionCard
        key="manage-tuitions"
        title="Manage Tuitions"
        description="Review and manage all tuition postings."
        href="/dashboard/admin/manage-tuitions"
        icon={BookOpen}
        imageHint="library books"
        disabled
      />,
       <ActionCard
        key="recent-activity-admin"
        title="Recent Activity"
        description="Updates on platform activity and reports."
        href="#"
        icon={Activity}
        imageHint="admin dashboard activity"
        showImage={true}
        disabled
      />
    );
  }


  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="grid gap-6 md:grid-cols-1">
         <Card className="border animate-in fade-in duration-700 ease-out rounded-xl overflow-hidden shadow-none bg-card">
          <CardHeader className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {user.role === 'tutor' && (
                <div className="relative group shrink-0">
                  <Avatar
                    className="h-16 w-16 border-2 border-primary/30 group-hover:opacity-80 transition-opacity"
                    onClick={handleAvatarClick} // No cursor-pointer here, button below handles it
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
                    <Button variant="secondary" size="sm" asChild className="text-xs font-normal px-3 py-1.5 h-auto rounded-full text-primary underline hover:bg-secondary/90">
                      <Link href="#">
                        <MailCheck className="mr-1.5 h-3.5 w-3.5" /> Verify Email
                      </Link>
                    </Button>
                    <Button variant="secondary" size="sm" asChild className="text-xs font-normal px-3 py-1.5 h-auto rounded-full text-primary underline hover:bg-secondary/90">
                      <Link href="#">
                        <PhoneCall className="mr-1.5 h-3.5 w-3.5" /> Verify Phone
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          {(user.role === 'parent' || user.role === 'admin') && (
              <CardContent className="p-6 md:p-8 pt-0">
                  <p className="text-foreground/70">Manage your tuition activities and settings from here.</p>
              </CardContent>
          )}
        </Card>
      </div>

      {/* Profile Management Row for Tutors */}
      {user.role === 'tutor' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div 
            className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
            style={{ animationDelay: `0.1s` }}
          >
            <UpdateProfileActionsCard user={user as TutorProfile} />
          </div>
          <div 
            className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
            style={{ animationDelay: `0.2s` }}
          >
            <ActionCard
              title="My Classes"
              cardDescriptionText="View and manage your scheduled classes." 
              description="5" // Show only the count for number of classes
              href="#" // For "View Classes" button
              icon={ListChecks} 
              showImage={false}
              disabled={false} // For "View Classes" button
              actionButtonText="View Classes"
              actionButtonIcon={ClipboardList}
              
              actionButtonText2="Create Class" // New prop for second button
              actionButtonIcon2={PlusCircle} // New prop for second button icon
              href2="#" // New prop for second button href
              disabled2={false} // New prop for second button disabled state

              actionButtonVariant="outline"
              actionButtonClassName="bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
              buttonInContent={true} 
            />
          </div>
          <div 
            className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
            style={{ animationDelay: `0.3s` }}
          >
            <ActionCard
              title="My Payments"
              description="Track your earnings, view payment history, and manage payout settings."
              href="#"
              icon={DollarSign}
              showImage={false}
              disabled
            />
          </div>
        </div>
      )}


      {/* General Action Cards (only for parent and admin) */}
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
    </div>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  imageHint?: string;
  showImage?: boolean;
  disabled?: boolean;
  actionButtonText?: string;
  actionButtonIcon?: React.ElementType;
  actionButtonVariant?: ButtonProps['variant'];
  actionButtonClassName?: string;
  buttonInContent?: boolean;
  cardDescriptionText?: string; 
  actionButtonText2?: string; // New prop for second button text
  actionButtonIcon2?: React.ElementType; // New prop for second button icon
  href2?: string; // New prop for second button href
  disabled2?: boolean; // New prop for second button disabled state
}

function ActionCard({ 
  title, 
  description, 
  href, 
  icon: Icon, 
  imageHint, 
  showImage = true, 
  disabled,
  actionButtonText,
  actionButtonIcon: ActionButtonIcon,
  actionButtonVariant,
  actionButtonClassName,
  buttonInContent = false,
  cardDescriptionText, 
  actionButtonText2,
  actionButtonIcon2: ActionButtonIcon2,
  href2,
  disabled2,
}: ActionCardProps) {
  const buttonTextContent = actionButtonText || (disabled ? "Coming Soon" : title);

  const renderSingleButton = () => (
    <Button 
      asChild 
      variant={actionButtonVariant || (disabled ? "default" : "default")}
      className={cn(
        "w-full transform transition-transform hover:scale-105 active:scale-95 text-base py-2.5", 
        actionButtonClassName 
      )} 
      disabled={disabled}
    >
      <Link href={disabled ? "#" : href}>
        {ActionButtonIcon && <ActionButtonIcon className="mr-2 h-4 w-4" />}
        {buttonTextContent}
      </Link>
    </Button>
  );

  return (
    <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col bg-card h-full rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transform hover:-translate-y-1 hover:scale-[1.02]">
      {showImage && imageHint && (
        <div className="overflow-hidden rounded-t-xl relative">
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
        {title === "My Classes" && buttonInContent ? (
          <>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="font-medium text-foreground/80">Active Classes</span>
              <span className="font-semibold text-primary">{description}</span>
            </div>
            <div className="mt-auto pt-4 space-y-3"> 
              {/* Button 1: View Classes */}
              <Button 
                asChild 
                variant={actionButtonVariant || "outline"}
                className={cn(
                  "w-full transform transition-transform hover:scale-105 active:scale-95", 
                  actionButtonClassName,
                  "py-2.5" 
                )} 
                disabled={disabled}
              >
                <Link href={disabled || !href ? "#" : href}>
                  {ActionButtonIcon && <ActionButtonIcon className="mr-2 h-4 w-4" />}
                  {actionButtonText || "View Classes"}
                </Link>
              </Button>
              
              {/* Button 2: Create Class */}
              {actionButtonText2 && ActionButtonIcon2 && (
                 <Button 
                    asChild 
                    variant={actionButtonVariant || "outline"} 
                    className={cn(
                      "w-full transform transition-transform hover:scale-105 active:scale-95", 
                      actionButtonClassName, 
                      "py-2.5"
                    )} 
                    disabled={disabled2} 
                  >
                    <Link href={disabled2 || !href2 ? "#" : href2}>
                      <ActionButtonIcon2 className="mr-2 h-4 w-4" />
                      {actionButtonText2}
                    </Link>
                  </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{description}</p>
            {buttonInContent && (
              <div className="mt-4"> 
                {renderSingleButton()}
              </div>
            )}
          </>
        )}
      </CardContent>
      {!buttonInContent && (
         <CardFooter className="p-4 md:p-5 border-t bg-muted/20">
          {renderSingleButton()}
        </CardFooter>
      )}
    </Card>
  );
}
