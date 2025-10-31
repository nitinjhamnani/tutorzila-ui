
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MailCheck, PhoneCall, UserCircle, ShieldCheck, Edit3, CheckCircle, XCircle, ClipboardEdit } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { useGlobalLoader } from "@/hooks/use-global-loader";

export default function TutorMyAccountPage() {
  const { user, isAuthenticated } = useAuthMock();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpVerificationType, setOtpVerificationType] = useState<"email" | "phone" | null>(null);
  const [otpVerificationIdentifier, setOtpVerificationIdentifier] = useState<string | null>(null);

  const [isEmailVerified, setIsEmailVerified] = useState(user?.isEmailVerified || false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(user?.isPhoneVerified || false);
  const { hideLoader } = useGlobalLoader();

  useEffect(() => {
    hideLoader();
  }, [hideLoader]);

  useEffect(() => {
    if (user) {
      setIsEmailVerified(user.isEmailVerified || false);
      setIsPhoneVerified(user.isPhoneVerified || false);
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading user data...</div>;
  }

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

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <BreadcrumbHeader
          segments={[
            { label: "Dashboard", href: "/tutor/dashboard" },
            { label: "My Account" },
          ]}
        />
        <div className="space-y-6">
          <Card className="bg-card border rounded-lg shadow-sm animate-in fade-in duration-500 ease-out">
            <CardHeader className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-full text-primary">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold text-primary tracking-tight">
                      My Account
                    </CardTitle>
                    <CardDescription className="text-sm text-foreground/70 mt-1">
                      Manage your profile information and account settings.
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                   <Button asChild variant="outline" size="sm" className="text-xs transform transition-transform hover:scale-105">
                    <Link href="/tutor/edit-personal-details">
                      <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit Personal Details
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="text-xs transform transition-transform hover:scale-105">
                    <Link href="/tutor/edit-tutoring-details">
                      <ClipboardEdit className="mr-1.5 h-3.5 w-3.5" /> Edit Tutoring Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md bg-background/50">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <VerificationItem
                  icon={MailCheck}
                  title="Email Verification"
                  description={isEmailVerified ? "Your email is verified." : "Verify your email address to enhance account security."}
                  isVerified={isEmailVerified}
                  onVerify={() => handleOpenOtpModal("email")}
                />
                <VerificationItem
                  icon={PhoneCall}
                  title="Phone Verification"
                  description={isPhoneVerified ? "Your phone number is verified." : "Verify your phone number for seamless communication."}
                  isVerified={isPhoneVerified}
                  onVerify={() => handleOpenOtpModal("phone")}
                  disabled={!user.phone}
                  disabledText="Add phone number in profile to verify."
                />
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
      </div>
    </main>
  );
}

interface VerificationItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  isVerified: boolean;
  onVerify: () => void;
  disabled?: boolean;
  disabledText?: string;
}

function VerificationItem({ icon: Icon, title, description, isVerified, onVerify, disabled, disabledText }: VerificationItemProps) {
  return (
    <Card className="bg-card/50 border rounded-lg p-4 flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow">
      <div>
        <div className="flex items-center mb-2">
          <Icon className={cn("w-5 h-5 mr-2", isVerified ? "text-green-600" : "text-primary")} />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
      </div>
      {isVerified ? (
        <Badge variant="default" className="w-fit bg-green-600 hover:bg-green-700 text-xs py-1">
          <CheckCircle className="mr-1 h-3 w-3" /> Verified
        </Badge>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-primary text-primary hover:bg-primary/10 hover:text-primary w-fit"
          onClick={onVerify}
          disabled={disabled}
        >
          {disabled ? disabledText : "Verify Now"}
        </Button>
      )}
    </Card>
  );
}
