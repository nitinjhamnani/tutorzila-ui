
"use client";

import type { ReactNode, ElementType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
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
  Link as LinkIcon,
  UploadCloud,
  Ruler,
  Filter as FilterIconLucide,
  ListChecks, 
  SearchCheck,
  School,
  MessageSquareQuote,
  ArrowRight,
  Camera,
  PanelLeft,
  Menu as MenuIcon,
  Info,
  Bell,
  PlusCircle,
  Send,
  MailCheck,
  PhoneCall,
  CheckCircle,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState, useMemo, useRef, ChangeEvent } from "react";
import { FloatingPostRequirementButton } from "@/components/shared/FloatingPostRequirementButton";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";
import { Badge } from "@/components/ui/badge";

interface QuickActionCardProps {
  title: string;
  description: string;
  IconEl: ElementType;
  href: string;
  disabled?: boolean;
  buttonText?: string;
  iconBg?: string;
  iconTextColor?: string;
}

function QuickActionCard({ title, description, IconEl, href, disabled, buttonText, iconBg = "bg-primary/10", iconTextColor = "text-primary" }: QuickActionCardProps) {
  const content = (
    <div className="bg-card rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between border-0 transform hover:-translate-y-1">
      <div>
        <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg mb-3", iconBg)}>
          <IconEl className={cn("w-5 h-5", iconTextColor)} />
        </div>
        <h3 className="font-medium text-foreground text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
      </div>
      <div className="mt-4 text-sm text-primary font-medium flex items-center gap-1 whitespace-nowrap">
        {buttonText || (disabled ? "Coming Soon" : "View")}
        {!disabled && <ArrowRight className="ml-1 w-3 h-3" />}
      </div>
    </div>
  );

  if (disabled) {
    return <div className="block h-full opacity-60 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}

export default function ParentDashboardPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasMounted, setHasMounted] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpVerificationType, setOtpVerificationType] = useState<"email" | "phone" | null>(null);
  const [otpVerificationIdentifier, setOtpVerificationIdentifier] = useState<string | null>(null);

  const [isEmailVerified, setIsEmailVerified] = useState(user?.isEmailVerified || false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(user?.isPhoneVerified || false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || user?.role !== 'parent') {
        router.replace("/");
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, user, router]);

  useEffect(() => {
    if (user) {
      setIsEmailVerified(user.isEmailVerified || false);
      setIsPhoneVerified(user.isPhoneVerified || false);
    }
  }, [user]);

  if (isCheckingAuth || !hasMounted || !isAuthenticated || !user || user.role !== 'parent') {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Parent Dashboard...</div>;
  }

  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: "Profile Picture Selected", description: `Mock: ${file.name} would be uploaded.` });
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
      if (user) user.isEmailVerified = true; 
    } else if (otpVerificationType === "phone") {
      setIsPhoneVerified(true);
      if (user) user.isPhoneVerified = true;
    }
    setIsOtpModalOpen(false);
    setOtpVerificationType(null);
    setOtpVerificationIdentifier(null);
  };

  const isUserVerified = isEmailVerified && isPhoneVerified;

  const parentQuickActions: QuickActionCardProps[] = [
    { title: "My Enquiries", description: "View & manage posted requests.", IconEl: ListChecks, href: "/parent/my-enquiries", buttonText: "Manage Enquiries" },
    { title: "Find Tutors", description: "Search for qualified tutors.", IconEl: SearchCheck, href: "/parent/find-tutor", buttonText: "Search Now" },
    { title: "Messages", description: "Chat with tutors and support.", IconEl: MessageSquare, href: "/parent/messages", buttonText: "View Messages", disabled: false },
    { title: "Demo Sessions", description: "Manage demo class requests & schedules.", IconEl: MessageSquareQuote, href: "/parent/demo-sessions", buttonText: "Manage Demos", disabled: false },
    { title: "My Payments", description: "View your payment history.", IconEl: DollarSign, href: "/parent/payments", buttonText: "View Payments", disabled: false },
    { title: "My Account", description: "Update your profile settings.", IconEl: UserCog, href: "/parent/my-account", buttonText: "Go to Account" },
    { title: "Support", description: "Get help or report issues.", IconEl: LifeBuoy, href: "#", buttonText: "Get Support", disabled: true },
  ];

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8 border-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/30 shadow-sm">
                  <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl md:text-2xl">
                    {user.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarUploadClick}
                  className={cn(
                    "absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 flex items-center justify-center p-1.5 rounded-full cursor-pointer shadow-md transition-colors",
                    "bg-primary/20 hover:bg-primary/30 text-primary"
                  )}
                  aria-label="Update profile picture"
                >
                  <Camera className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">Hello, {user.name} <span className="inline-block ml-1">👋</span></h1>
                <p className="text-xs text-muted-foreground mt-1">Welcome back to your dashboard</p>
                
                <div className="mt-3 flex items-center space-x-2 flex-wrap">
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
                  <Badge
                    className={cn(
                      "text-xs py-0.5 px-2 border",
                      isUserVerified ? "bg-green-600 text-white border-green-700" : "bg-destructive/10 text-destructive border-destructive/50"
                    )}
                  >
                    {isUserVerified ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                    {isUserVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {parentQuickActions.map((action) => (
              <QuickActionCard
                key={action.title}
                title={action.title}
                description={action.description}
                IconEl={action.IconEl}
                href={action.href}
                disabled={action.disabled}
                buttonText={action.buttonText}
                iconBg={action.iconBg}
                iconTextColor={action.iconTextColor}
              />
            ))}
          </div>
        </div>
        
        {/* Floating Action Button */}
        <FloatingPostRequirementButton />

        {/* OTP Modal */}
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
    </main>
  );
}
