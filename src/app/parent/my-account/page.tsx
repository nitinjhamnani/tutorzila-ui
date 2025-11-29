
"use client";

import { useState, useEffect } from "react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, UserCircle, VenetianMask, CheckCircle, Loader2, Edit3, KeyRound, MoreVertical, Lock, EyeOff, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResetPasswordModal } from "@/components/modals/ResetPasswordModal";
import { UpdateNameModal } from "@/components/modals/UpdateNameModal";
import { UserOtpVerificationModal } from "@/components/modals/UserOtpVerificationModal";
import { useToast } from "@/hooks/use-toast";
import { DeactivationModal } from "@/components/modals/DeactivationModal";
import { ParentActivationModal } from "@/components/admin/modals/ParentActivationModal";
import { useMutation } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.885-.002 2.024.63 3.965 1.739 5.618l-1.187 4.349 4.443-1.152z" />
        <path d="M15.246 14.148c-.281-.141-1.66-1.04-1.916-1.158-.256-.117-.44-.187-.625.117-.184.305-.724.938-.887 1.115-.164.177-.328.188-.609.047-.282-.14-1.188-.438-2.262-1.395-.837-.745-1.395-1.661-1.56-1.944-.163-.282-.01- .438.104-.576.104-.13.234-.336.351-.49.117-.154.156-.257.234-.422.078-.164.039-.305-.019-.445-.058-.141-.625-1.492-.859-2.04-.233-.547-.467-.469-.625-.469-.141 0-.305-.019-.469-.019-.164 0-.438.058-.672.305-.234.246-.887.867-.887 2.109s.906 2.441 1.023 2.617c.118.176 1.77 2.899 4.293 4.098 2.522 1.199 2.522.797 2.969.762.447-.039 1.66-.672 1.898-1.32.238-.648.238-1.199.16-1.319-.078-.121-.281-.188-.586-.328z" />
    </svg>
);


const sendVerificationOtpApi = async (token: string | null, verificationType: 'EMAIL' | 'PHONE') => {
  if (!token) throw new Error("Authentication token is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/verify/otp?verificationType=${verificationType}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to send OTP.' }));
    throw new Error(errorData.message);
  }

  return true;
};


const fetchParentAccountDetails = async (token: string | null): Promise<{ userDetails: User }> => {
  if (!token) throw new Error("No authentication token found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(`${apiBaseUrl}/api/parent/account`, {
    headers: { "Authorization": `Bearer ${token}`, "accept": "*/*" },
  });
  if (!response.ok) throw new Error("Failed to fetch parent account data.");
  return response.json();
};

const getInitials = (name?: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2);
};

const InfoItem = ({ icon: Icon, label, children, className }: { icon: React.ElementType; label: string; children?: React.ReactNode; className?:string }) => {
  if (!children && typeof children !== 'number') {
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

export default function ParentMyAccountPage() {
  const { user, token, isCheckingAuth } = useAuthMock();
  const { hideLoader, showLoader } = useGlobalLoader();
  const [isDeactivationModalOpen, setIsDeactivationModalOpen] = useState(false);
  const [isUpdateNameModalOpen, setIsUpdateNameModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isUserOtpModalOpen, setIsUserOtpModalOpen] = useState(false);
  const [otpVerificationType, setOtpVerificationType] = useState<"email" | "phone">("email");
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accountData, isLoading, error } = useQuery({
    queryKey: ["parentAccountDetails", token],
    queryFn: () => fetchParentAccountDetails(token),
    enabled: !!token && !isCheckingAuth,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const sendOtpMutation = useMutation({
    mutationFn: (type: 'EMAIL' | 'PHONE') => sendVerificationOtpApi(token, type),
    onSuccess: (_, type) => {
        const identifier = type === 'EMAIL' ? accountData!.userDetails.email : accountData!.userDetails.phone;
        setOtpVerificationType(type.toLowerCase() as 'email' | 'phone');
        setOtpIdentifier(identifier!);
        setIsUserOtpModalOpen(true);
        toast({ title: "OTP Sent", description: `An OTP has been sent to your ${type.toLowerCase()}.`});
    },
    onError: (error: Error) => {
        toast({ variant: "destructive", title: "Failed to Send OTP", description: error.message });
    }
  });

  useEffect(() => {
    if (!isLoading) hideLoader();
  }, [isLoading, hideLoader]);

  const handleOpenOtpModal = (type: "email" | "phone") => {
    sendOtpMutation.mutate(type.toUpperCase() as 'EMAIL' | 'PHONE');
  };

  const handleOtpSuccess = async () => {
    toast({ title: "Verification Successful!", description: `Your ${otpVerificationType} has been verified.` });
    await queryClient.invalidateQueries({ queryKey: ["parentAccountDetails", token] });
  };
  
  if (isLoading || isCheckingAuth) {
    return (
        <main className="flex-grow">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </main>
    );
  }

  if (error || !accountData) {
    return <div className="text-center py-10 text-destructive">Error: {(error as Error)?.message || "Could not load user data."}</div>;
  }

  const { userDetails } = accountData;

  return (
    <>
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <Card className="w-full shadow-lg border rounded-xl animate-in fade-in duration-500 ease-out">
            <CardHeader className="relative p-6">
                 <div className="absolute top-4 right-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsUpdateNameModalOpen(true)}>
                                <UserCircle className="mr-2 h-4 w-4" />
                                <span>Edit Personal Details</span>
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-24 w-24 border-4 border-primary/20 shrink-0">
                      <AvatarImage src={userDetails.profilePicUrl} alt={userDetails.name} />
                      <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                          {getInitials(userDetails.name)}
                      </AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-2xl font-bold text-foreground">{userDetails.name}</CardTitle>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                          {userDetails.email}
                      </div>
                  </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-4 border-t">
              <div className="space-y-4">
                <InfoItem icon={Mail} label="Email">
                  <div className="flex items-center gap-2">
                      <span>{userDetails.email}</span>
                      <TooltipProvider>
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <button onClick={() => { if(!userDetails.emailVerified) { handleOpenOtpModal('email');}}}>
                                  {userDetails.emailVerified ? <CheckCircle className="h-4 w-4 text-green-500" /> : (
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
                                  <button className={!userDetails.phoneVerified ? "cursor-pointer" : ""} onClick={() => { if(!userDetails.phoneVerified) { handleOpenOtpModal('phone');}}}>
                                      {userDetails.phoneVerified ? <CheckCircle className="h-4 w-4 text-green-500" /> : (
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
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modals */}
      <UpdateNameModal isOpen={isUpdateNameModalOpen} onOpenChange={setIsUpdateNameModalOpen} currentName={userDetails.name} />
      <ResetPasswordModal isOpen={isResetPasswordModalOpen} onOpenChange={setIsResetPasswordModalOpen} />
      <UserOtpVerificationModal
        isOpen={isUserOtpModalOpen}
        onOpenChange={setIsUserOtpModalOpen}
        verificationType={otpVerificationType}
        identifier={otpIdentifier}
        onSuccess={handleOtpSuccess}
      />
      <ParentActivationModal 
        isOpen={false} // This modal is for admin use, parent cannot activate self
        onOpenChange={()=>{}} 
        parentName={userDetails.name} 
        parentId={user!.id} 
      />
      <DeactivationModal 
        isOpen={isDeactivationModalOpen} 
        onOpenChange={setIsDeactivationModalOpen}
        userName={userDetails.name} 
        userId={user!.id} 
      />
    </>
  );
}

