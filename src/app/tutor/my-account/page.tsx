
"use client";

import { useState, useEffect } from "react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, UserCircle, VenetianMask, CheckCircle, Loader2, Edit3, Landmark, KeyRound, Briefcase, BookOpen, GraduationCap, DollarSign, Languages, Clock, CalendarDays, MapPin, ShieldCheck, ShieldAlert, Building, RadioTower, MailCheck, PhoneCall, MoreVertical, Lock, Eye, EyeOff } from "lucide-react";
import { DeactivationModal } from "@/components/modals/DeactivationModal";
import { EditPersonalDetailsModal } from "@/components/modals/EditPersonalDetailsModal";
import { UpdateBankDetailsModal } from "@/components/modals/UpdateBankDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ApiTutor, User } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResetPasswordModal } from "@/components/modals/ResetPasswordModal";
import { UpdateEmailModal } from "@/components/modals/UpdateEmailModal";
import { UpdatePhoneModal } from "@/components/modals/UpdatePhoneModal";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EditTutoringDetailsForm } from "@/components/tutor/EditTutoringDetailsForm";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.885-.002 2.024.63 3.965 1.739 5.618l-1.187 4.349 4.443-1.152z" />
        <path d="M15.246 14.148c-.281-.141-1.66-1.04-1.916-1.158-.256-.117-.44-.187-.625.117-.184.305-.724.938-.887 1.115-.164.177-.328.188-.609.047-.282-.14-1.188-.438-2.262-1.395-.837-.745-1.395-1.661-1.56-1.944-.163-.282-.01- .438.104-.576.104-.13.234-.336.351-.49.117-.154.156-.257.234-.422.078-.164.039-.305-.019-.445-.058-.141-.625-1.492-.859-2.04-.233-.547-.467-.469-.625-.469-.141 0-.305-.019-.469-.019-.164 0-.438.058-.672.305-.234.246-.887.867-.887 2.109s.906 2.441 1.023 2.617c.118.176 1.77 2.899 4.293 4.098 2.522 1.199 2.522.797 2.969.762.447-.039 1.66-.672 1.898-1.32.238-.648.238-1.199.16-1.319-.078-.121-.281-.188-.586-.328z" />
    </svg>
);

const fetchTutorAccountDetails = async (token: string | null) => {
  if (!token) throw new Error("No authentication token found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(`${apiBaseUrl}/api/tutor/account`, {
    headers: { "Authorization": `Bearer ${token}`, "accept": "*/*" },
  });
  if (!response.ok) throw new Error("Failed to fetch tutor account data.");
  return response.json();
};

const fetchTutorDetails = async (token: string | null) => {
    if (!token) throw new Error("No authentication token found.");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/api/tutor/details`, {
        headers: {
        "Authorization": `Bearer ${token}`,
        "accept": "*/*",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tutor details.");
    }
    return response.json();
};


const getInitials = (name?: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2);
};

const InfoItem = ({ icon: Icon, label, children, className }: { icon: React.ElementType; label: string; children?: React.ReactNode; className?:string }) => {
  const hasContent = children || typeof children === 'number';
  if (!hasContent) {
    return (
      <div className={cn("flex items-start", className)}>
        <Icon className="w-4 h-4 mr-2.5 mt-0.5 text-muted-foreground shrink-0" />
        <div className="flex flex-col flex-grow text-xs">
          <span className="font-medium text-foreground">{label}</span>
          <div className="text-muted-foreground italic">Not Provided</div>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("flex items-start", className)}>
      <Icon className="w-4 h-4 mr-2.5 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex flex-col flex-grow text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
};

const InfoBadgeList = ({ icon: Icon, label, items }: { icon: React.ElementType; label: string; items?: string[] }) => {
  const hasItems = items && items.length > 0;
  return (
    <div className="flex items-start">
       <Icon className="w-4 h-4 mr-2.5 mt-1 text-muted-foreground shrink-0" />
      <div className="flex flex-col">
        <span className="font-medium text-foreground mb-1 text-xs">{label}</span>
        <div className="flex flex-wrap gap-1">
          {hasItems ? items.map(item => <Badge key={item} variant="secondary" className="font-normal">{item}</Badge>) : <span className="text-xs text-muted-foreground italic">Not Provided</span>}
        </div>
      </div>
    </div>
  );
};

export default function TutorMyAccountPage() {
  const { user, token, isCheckingAuth } = useAuthMock();
  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);
  const [isUpdatePhoneModalOpen, setIsUpdatePhoneModalOpen] = useState(false);
  const [isDeactivationModalOpen, setIsDeactivationModalOpen] = useState(false);
  const [isEditPersonalModalOpen, setIsEditPersonalModalOpen] = useState(false);
  const [isUpdateBankDetailsModalOpen, setIsUpdateBankDetailsModalOpen] = useState(false);
  const { hideLoader } = useGlobalLoader();
  const queryClient = useQueryClient();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpVerificationType, setOtpVerificationType] = useState<"email" | "phone">("email");
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const { toast } = useToast();
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isEditTutoringModalOpen, setIsEditTutoringModalOpen] = useState(false);
  const [isAccountNumberVisible, setIsAccountNumberVisible] = useState(false);

  const { data: tutorAccountData, isLoading: isLoadingAccount, error: accountError } = useQuery({
    queryKey: ["tutorAccountDetails", token],
    queryFn: () => fetchTutorAccountDetails(token),
    enabled: !!token && !isCheckingAuth,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: tutoringDetailsData, isLoading: isLoadingTutoring, error: tutoringError } = useQuery({
    queryKey: ['tutorDetails', token],
    queryFn: () => fetchTutorDetails(token),
    enabled: !!token && !isCheckingAuth,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const isLoading = isLoadingAccount || isLoadingTutoring;
  const error = accountError || tutoringError;

  useEffect(() => {
    if (!isLoading) {
      hideLoader();
    }
  }, [isLoading, hideLoader]);

  const handleOpenOtpModal = (type: "email" | "phone") => {
    if (!tutorAccountData?.userDetails) return;
    setOtpVerificationType(type);
    setOtpIdentifier(type === "email" ? tutorAccountData.userDetails.email! : tutorAccountData.userDetails.phone!);
    setIsOtpModalOpen(true);
  };
  
  const handleOtpSuccess = async () => {
    toast({ title: "Verification Successful!", description: `Your ${otpVerificationType} has been verified.` });
    queryClient.invalidateQueries({ queryKey: ["tutorAccountDetails", token] });
  };


  if (isCheckingAuth || isLoading) {
    return (
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6"><Skeleton className="h-[350px] w-full rounded-xl" /></div>
                <div className="md:col-span-2 space-y-6"><Skeleton className="h-[200px] w-full rounded-xl" /> <Skeleton className="h-[250px] w-full rounded-xl" /></div>
             </div>
          </div>
        </main>
    );
  }
  
  if (error || !tutorAccountData || !tutoringDetailsData) {
    return <div className="text-center py-10 text-destructive">Error: {(error as Error)?.message || "Could not load user data."}</div>
  }

  const { userDetails, bankDetails } = tutorAccountData;
  const tutoringDetails = tutoringDetailsData;
  
  const maskAccountNumber = (number?: string) => {
    if (!number) return "Not Provided";
    return `**** **** **** ${number.slice(-4)}`;
  }
  
  const legacyTutorObject: User = {
    id: userDetails.id || "",
    name: userDetails.name,
    email: userDetails.email,
    countryCode: userDetails.countryCode,
    phone: userDetails.phone,
    profilePicUrl: userDetails.profilePicUrl,
    role: "tutor",
  };


  return (
    <>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500 ease-out">
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden relative">
                 <div className="absolute top-4 right-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsEditPersonalModalOpen(true)}>
                                <UserCircle className="mr-2 h-4 w-4" />
                                <span>Edit Personal Details</span>
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setIsEditTutoringModalOpen(true)}>
                                <Briefcase className="mr-2 h-4 w-4" />
                                <span>Edit Tutoring Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsUpdateBankDetailsModalOpen(true)}>
                                <Landmark className="mr-2 h-4 w-4" />
                                <span>Update Bank Details</span>
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setIsResetPasswordModalOpen(true)}>
                                <KeyRound className="mr-2 h-4 w-4" />
                                <span>Reset Password</span>
                            </DropdownMenuItem>
                             <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setIsDeactivationModalOpen(true)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <Lock className="mr-2 h-4 w-4" />
                                <span>Deactivate Account</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardContent className="p-5 md:p-6 text-center">
                  <Avatar className="h-24 w-24 border-4 border-primary/20 mx-auto shadow-md">
                    <AvatarImage src={userDetails.profilePicUrl} alt={userDetails.name} />
                    <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                        {getInitials(userDetails.name)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl font-bold text-foreground mt-4">{userDetails.name}</CardTitle>
                  <div className="flex items-center justify-center text-sm text-muted-foreground mt-1">
                    <VenetianMask className="w-4 h-4 mr-1.5 text-muted-foreground shrink-0"/>
                    <span className="capitalize">{userDetails.gender || 'Not Provided'}</span>
                  </div>
                  <div className="mt-2.5 flex justify-center items-center gap-2 flex-wrap">
                      <Badge variant={tutoringDetails.active ? "default" : "destructive"}>{tutoringDetails.active ? 'Active' : 'Inactive'}</Badge>
                      <Badge variant={tutoringDetails.verified ? "default" : "destructive"}>{tutoringDetails.verified ? 'Verified' : 'Not Verified'}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem icon={Mail} label="Email">
                    <div className="flex items-center gap-2">
                        <span>{userDetails.email}</span>
                        <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => { if(!userDetails.emailVerified) { handleOpenOtpModal('email');}}}>
                                    {userDetails.emailVerified ? <MailCheck className="h-4 w-4 text-primary" /> : (
                                        <span className="text-primary hover:underline text-xs cursor-pointer">(Verify Now)</span>
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Email {userDetails.emailVerified ? 'Verified' : 'Not Verified'}</p>
                            </TooltipContent>
                        </Tooltip>
                        </TooltipProvider>
                    </div>
                  </InfoItem>
                  <InfoItem icon={Phone} label="Phone">
                      <div className="flex flex-col items-start gap-1.5">
                        <div className="flex items-center gap-2">
                          <span>{userDetails.countryCode} {userDetails.phone}</span>
                          <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        className={!userDetails.phoneVerified ? "cursor-pointer" : ""}
                                        onClick={() => { if(!userDetails.phoneVerified) { handleOpenOtpModal('phone');}}}
                                    >
                                        {userDetails.phoneVerified ? <PhoneCall className="h-4 w-4 text-primary" /> : (
                                            <span className="text-primary hover:underline text-xs">(Verify Now)</span>
                                        )}
                                    </button>
                                </TooltipTrigger>
                              <TooltipContent>
                                <p>Phone {userDetails.phoneVerified ? 'Verified' : 'Not Verified'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                          {userDetails.whatsappEnabled && <Badge variant="secondary" className="mt-1 w-fit"><WhatsAppIcon className="h-3 w-3 mr-1"/>WhatsApp</Badge>}
                      </div>
                  </InfoItem>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoItem icon={Landmark} label="Payment Mode">
                        {bankDetails?.paymentType || "Not Provided"}
                    </InfoItem>
                    <div className="flex items-start">
                        <KeyRound className="w-4 h-4 mr-2.5 mt-0.5 text-muted-foreground shrink-0" />
                        <div className="flex flex-col flex-grow text-xs">
                            <span className="font-medium text-foreground">Account / UPI ID</span>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    {isAccountNumberVisible ? bankDetails?.accountNumber || 'Not Provided' : maskAccountNumber(bankDetails?.accountNumber)}
                                </span>
                                {bankDetails?.accountNumber && (
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsAccountNumberVisible(prev => !prev)}>
                                    {isAccountNumberVisible ? <EyeOff className="h-4 w-4 text-muted-foreground"/> : <Eye className="h-4 w-4 text-muted-foreground"/>}
                                </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <CardTitle>About Me</CardTitle>
                   {tutoringDetails.bioReviewed ? (
                     <Badge variant="secondary" className="text-xs py-1 px-2.5 bg-primary/10 text-primary border-primary/20">
                       <CheckCircle className="mr-1 h-3 w-3"/>
                       Approved
                     </Badge>
                   ) : (
                     <Badge variant="destructive" className="text-xs py-1 px-2.5">
                       <ShieldAlert className="mr-1 h-3 w-3"/>
                       Pending Approval
                     </Badge>
                   )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{tutoringDetails.tutorBio || "Not Provided"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <CardTitle>Tutoring Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <InfoBadgeList icon={BookOpen} label="Subjects" items={tutoringDetails.subjects}/>
                    <InfoBadgeList icon={GraduationCap} label="Grades" items={tutoringDetails.grades}/>
                    <InfoBadgeList icon={Building} label="Boards" items={tutoringDetails.boards}/>
                    <InfoItem icon={RadioTower} label="Teaching Mode">
                      <div className="flex items-center gap-2">
                          {tutoringDetails.online && <Badge variant="secondary" className="font-normal">Online</Badge>}
                          {tutoringDetails.offline && <Badge variant="secondary" className="font-normal">Offline</Badge>}
                          {tutoringDetails.hybrid && <Badge variant="secondary" className="font-normal">Hybrid</Badge>}
                          {!tutoringDetails.online && !tutoringDetails.offline && !tutoringDetails.hybrid && <span className="text-xs text-muted-foreground italic">Not Provided</span>}
                      </div>
                    </InfoItem>
                    <InfoItem icon={MapPin} label="Address">{tutoringDetails.addressName || tutoringDetails.address || "Not Provided"}</InfoItem>
                </CardContent>
              </Card>
               <Card>
                  <CardHeader>
                      <CardTitle>Other Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <InfoBadgeList icon={GraduationCap} label="Qualifications" items={tutoringDetails.qualifications} />
                      <InfoBadgeList icon={Languages} label="Languages" items={tutoringDetails.languages || []} />
                      <InfoBadgeList icon={CalendarDays} label="Available Days" items={tutoringDetails.availabilityDays}/>
                      <InfoBadgeList icon={Clock} label="Available Times" items={tutoringDetails.availabilityTime}/>
                  </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <UpdateEmailModal isOpen={isUpdateEmailModalOpen} onOpenChange={setIsUpdateEmailModalOpen} currentEmail={userDetails.email || ""} />
      <UpdatePhoneModal isOpen={isUpdatePhoneModalOpen} onOpenChange={setIsUpdatePhoneModalOpen} currentPhone={userDetails.phone} currentCountryCode={userDetails.countryCode} />
      <DeactivationModal isOpen={isDeactivationModalOpen} onOpenChange={setIsDeactivationModalOpen} userName={userDetails.name} userId={userDetails.id} />
      <EditPersonalDetailsModal isOpen={isEditPersonalModalOpen} onOpenChange={setIsEditPersonalModalOpen} user={legacyTutorObject as any} />
      <UpdateBankDetailsModal isOpen={isUpdateBankDetailsModalOpen} onOpenChange={setIsUpdateBankDetailsModalOpen} initialAccountName={userDetails.name} />
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onOpenChange={setIsOtpModalOpen}
        verificationType={otpVerificationType}
        identifier={otpIdentifier}
        onSuccess={handleOtpSuccess}
        onResend={async () => {
          console.log("Mock resend OTP");
        }}
      />
      <ResetPasswordModal isOpen={isResetPasswordModalOpen} onOpenChange={setIsResetPasswordModalOpen} />
      <Dialog open={isEditTutoringModalOpen} onOpenChange={setIsEditTutoringModalOpen}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-3xl p-0 flex flex-col max-h-[90vh]"
        >
          <DialogTitle className="sr-only">Edit Tutoring Details</DialogTitle>
          <div className="overflow-y-auto flex-grow h-full">
              <EditTutoringDetailsForm 
                initialData={tutoringDetails}
                onSuccess={() => setIsEditTutoringModalOpen(false)} 
              />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
