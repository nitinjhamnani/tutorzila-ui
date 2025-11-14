
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { ApiTutor } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Briefcase,
  BookOpen,
  GraduationCap,
  DollarSign,
  Languages,
  Clock,
  CalendarDays,
  MapPin,
  CheckCircle,
  XCircle,
  RadioTower,
  Users as UsersIcon,
  ShieldCheck,
  ShieldAlert,
  Building,
  Mail,
  Phone,
  User,
  ArrowLeft,
  Loader2,
  FileText,
  Edit3,
  Star,
  Eye,
  Percent,
  Share2,
  MailCheck,
  PhoneCall,
  Unlock,
  VenetianMask,
  CheckSquare,
  MoreVertical,
  Lock,
  Ban,
  Landmark,
  KeyRound,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ActivationModal } from "@/components/admin/modals/ActivationModal";
import { DeactivationModal } from "@/components/modals/DeactivationModal";
import { AdminUpdateTutorModal } from "@/components/admin/modals/AdminUpdateTutorModal";
import { ApproveBioModal } from "@/components/admin/modals/ApproveBioModal";
import { AdminUpdateBioModal } from "@/components/admin/modals/AdminUpdateBioModal";
import { DisapproveBioModal } from "@/components/admin/modals/DisapproveBioModal";
import { useGlobalLoader } from "@/hooks/use-global-loader";

const fetchTutorProfile = async (tutorId: string, token: string | null): Promise<ApiTutor> => {
    if (!token) throw new Error("Authentication token not found.");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/api/manage/tutor/${tutorId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch tutor profile.");
    }
    const data = await response.json();
    
    const { userDetails, tutoringDetails, bankDetails } = data;

    return {
      id: tutorId,
      // From userDetails
      displayName: userDetails.name,
      name: userDetails.name,
      email: userDetails.email,
      countryCode: userDetails.countryCode,
      phone: userDetails.phone,
      profilePicUrl: userDetails.profilePicUrl,
      emailVerified: userDetails.emailVerified,
      phoneVerified: userDetails.phoneVerified,
      whatsappEnabled: userDetails.whatsappEnabled,
      registeredDate: userDetails.registeredDate,
      createdBy: userDetails.createdBy,
      isLive: userDetails.live,

      // From tutoringDetails
      subjectsList: tutoringDetails.subjects,
      gradesList: tutoringDetails.grades,
      boardsList: tutoringDetails.boards,
      qualificationList: tutoringDetails.qualifications,
      availabilityDaysList: tutoringDetails.availabilityDays,
      availabilityTimeList: tutoringDetails.availabilityTime,
      yearOfExperience: tutoringDetails.yearOfExperience,
      bio: tutoringDetails.tutorBio,
      addressName: tutoringDetails.addressName,
      address: tutoringDetails.address,
      city: tutoringDetails.city,
      state: tutoringDetails.state,
      area: tutoringDetails.area,
      pincode: tutoringDetails.pincode,
      country: tutoringDetails.country,
      googleMapsLink: tutoringDetails.googleMapsLink,
      hourlyRate: tutoringDetails.hourlyRate,
      languagesList: tutoringDetails.languages,
      profileCompletion: tutoringDetails.profileCompletion,
      isActive: tutoringDetails.active,
      isRateNegotiable: tutoringDetails.rateNegotiable,
      isBioReviewed: tutoringDetails.bioReviewed,
      online: tutoringDetails.online,
      offline: tutoringDetails.offline,
      isHybrid: tutoringDetails.hybrid,
      
      gender: userDetails.gender,
      isVerified: tutoringDetails.verified,
      bankDetails: bankDetails || undefined,
    } as ApiTutor;
};

const verifyTutorEmailApi = async ({ tutorId, token }: { tutorId: string; token: string | null }) => {
    if (!token) throw new Error("Authentication token not found.");
    if (!tutorId) throw new Error("Tutor ID is required for verification.");
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/api/admin/user/verify/email/${tutorId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to verify email." }));
        throw new Error(errorData.message);
    }
    return response.json();
};

const verifyTutorPhoneApi = async ({ tutorId, token }: { tutorId: string; token: string | null }) => {
    if (!token) throw new Error("Authentication token not found.");
    if (!tutorId) throw new Error("Tutor ID is required for verification.");
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/api/admin/user/verify/phone/${tutorId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to verify phone." }));
        throw new Error(errorData.message);
    }
    return response.json();
};

const updateTutorLiveStatus = async ({ tutorId, token, isLive }: { tutorId: string; token: string | null; isLive: boolean; }) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!tutorId) throw new Error("Tutor ID is missing.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/tutor/live/${tutorId}?isLive=${isLive}`, {
      method: 'PUT',
      headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
      },
  });

  if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to update live status." }));
      throw new Error(errorData.message);
  }

  return response.json();
};


const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.885-.002 2.024.63 3.965 1.739 5.618l-1.187 4.349 4.443-1.152z" />
        <path d="M15.246 14.148c-.281-.141-1.66-1.04-1.916-1.158-.256-.117-.44-.187-.625.117-.184.305-.724.938-.887 1.115-.164.177-.328.188-.609.047-.282-.14-1.188-.438-2.262-1.395-.837-.745-1.395-1.661-1.56-1.944-.163-.282-.01- .438.104-.576.104-.13.234-.336.351-.49.117-.154.156-.257.234-.422.078-.164.039-.305-.019-.445-.058-.141-.625-1.492-.859-2.04-.233-.547-.467-.469-.625-.469-.141 0-.305-.019-.469-.019-.164 0-.438.058-.672.305-.234.246-.887.867-.887 2.109s.906 2.441 1.023 2.617c.118.176 1.77 2.899 4.293 4.098 2.522 1.199 2.522.797 2.969.762.447-.039 1.66-.672 1.898-1.32.238-.648.238-1.199.16-1.319-.078-.121-.281-.188-.586-.328z" />
    </svg>
);


const getInitials = (name?: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const InfoSection = ({ icon: Icon, title, children, className }: { icon: React.ElementType; title: string; children: React.ReactNode; className?:string }) => (
  <div className={className}>
    <h4 className="text-sm font-semibold text-primary mb-2 flex items-center">
      <Icon className="w-4 h-4 mr-2"/>
      {title}
    </h4>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
);

const InfoItem = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children?: React.ReactNode }) => {
  if (!children && typeof children !== 'number') return null;
  return (
    <div className="flex items-start">
      <Icon className="w-4 h-4 mr-2.5 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">{label}</span>
        </div>
        <div className="text-muted-foreground text-xs">{children}</div>
      </div>
    </div>
  );
};

const InfoTextItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) => {
    if (!value) return null;
    return (
        <div className="flex items-start">
        <Icon className="w-4 h-4 mr-2.5 mt-0.5 text-muted-foreground shrink-0" />
        <div className="flex flex-col">
            <span className="font-medium text-foreground">{label}</span>
            <p className="text-muted-foreground text-xs">{value}</p>
        </div>
        </div>
    );
};


export default function AdminTutorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { token } = useAuthMock();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const tutorId = params.id as string;
    const { hideLoader } = useGlobalLoader();
    
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
    const [isDeactivationModalOpen, setIsDeactivationModalOpen] = useState(false);
    const [isApproveBioModalOpen, setIsApproveBioModalOpen] = useState(false);
    const [isDisapproveBioModalOpen, setIsDisapproveBioModalOpen] = useState(false);
    const [isUpdateBioModalOpen, setIsUpdateBioModalOpen] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [verificationType, setVerificationType] = useState<'email' | 'phone' | null>(null);
    const [isLiveStatusModalOpen, setIsLiveStatusModalOpen] = useState(false);

    const { data: tutor, isLoading, error } = useQuery<ApiTutor>({
        queryKey: ['tutorProfile', tutorId],
        queryFn: () => fetchTutorProfile(tutorId, token),
        enabled: !!tutorId && !!token,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!isLoading) {
            hideLoader();
        }
    }, [isLoading, hideLoader]);
    
    const updateTutorState = (newUserDetails: any) => {
        queryClient.setQueryData(['tutorProfile', tutorId], (oldData: ApiTutor | undefined) => {
            if (!oldData) return undefined;
            return { 
                ...oldData, 
                emailVerified: newUserDetails.emailVerified,
                phoneVerified: newUserDetails.phoneVerified,
            };
        });
    };

    const emailVerificationMutation = useMutation({
        mutationFn: () => verifyTutorEmailApi({ tutorId, token }),
        onSuccess: (data) => {
            updateTutorState(data);
            toast({
                title: "Email Verified!",
                description: `The email for ${tutor?.displayName} has been successfully verified.`,
            });
            setIsVerificationModalOpen(false);
        },
        onError: (error: Error) => {
            toast({ variant: "destructive", title: "Verification Failed", description: error.message });
        },
    });

    const phoneVerificationMutation = useMutation({
        mutationFn: () => verifyTutorPhoneApi({ tutorId, token }),
        onSuccess: (data) => {
            updateTutorState(data);
            toast({
                title: "Phone Verified!",
                description: `The phone number for ${tutor?.displayName} has been successfully verified.`,
            });
            setIsVerificationModalOpen(false);
        },
        onError: (error: Error) => {
            toast({ variant: "destructive", title: "Verification Failed", description: error.message });
        },
    });

    const liveStatusMutation = useMutation({
      mutationFn: (isLive: boolean) => updateTutorLiveStatus({ tutorId, token, isLive }),
      onSuccess: (updatedUserDetails) => {
        queryClient.setQueryData(['tutorProfile', tutorId], (oldData: ApiTutor | undefined) => {
          if (!oldData) return undefined;
          return { ...oldData, isLive: updatedUserDetails.live };
        });
        toast({
          title: "Status Updated!",
          description: `${tutor?.displayName} is now ${updatedUserDetails.live ? 'Live' : 'Offline'}.`,
        });
      },
      onError: (error: Error) => {
        toast({ variant: "destructive", title: "Status Update Failed", description: error.message });
      },
      onSettled: () => {
        setIsLiveStatusModalOpen(false);
      }
    });

    const handleConfirmVerification = () => {
        if (verificationType === 'email') {
            emailVerificationMutation.mutate();
        } else if (verificationType === 'phone') {
            phoneVerificationMutation.mutate();
        }
    };
    
    const handleToggleLiveStatus = () => {
        if (tutor) {
            liveStatusMutation.mutate(!tutor.isLive);
        }
    };
    
    const maskAccountNumber = (number?: string) => {
      if (!number) return 'Not Provided';
      return `**** **** **** ${number.slice(-4)}`;
    }

    if (isLoading) {
      return (
         <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 text-destructive">
          <p>Error loading tutor details: {(error as Error).message}</p>
           <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/admin/tutors"><ArrowLeft className="mr-2 h-4 w-4"/> Go Back</Link>
           </Button>
        </div>
      )
    }

    if (!tutor) {
      return (
        <div className="text-center py-10">
            <p className="text-destructive">Tutor data not available. Please go back to the list and select a tutor.</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/admin/tutors"><ArrowLeft className="mr-2 h-4 w-4"/> Go Back</Link>
           </Button>
        </div>
      )
    }


    return (
      <AlertDialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-1 space-y-6">
                <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden relative">
                    <div className="absolute top-4 left-4">
                      <Badge variant={tutor.isLive ? "default" : "destructive"} className="text-xs py-1 px-2.5">
                          {tutor.isLive ? <Radio className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                          {tutor.isLive ? 'Live' : 'Offline'}
                      </Badge>
                    </div>
                    <CardContent className="p-5 md:p-6 text-center pt-14">
                        <Avatar className="h-24 w-24 border-4 border-primary/20 mx-auto shadow-md">
                            <AvatarImage src={tutor.profilePicUrl} alt={tutor.displayName} />
                            <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                                {getInitials(tutor.displayName)}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-xl font-bold text-foreground mt-4">{tutor.displayName}</CardTitle>
                        <div className="mt-2.5 flex justify-center items-center gap-2 flex-wrap">
                            
                            <Badge variant={tutor.isActive ? "default" : "destructive"} className="text-xs py-1 px-2.5">
                                {tutor.isActive ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                                {tutor.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                             <Badge variant={tutor.isVerified ? "default" : "destructive"} className="text-xs py-1 px-2.5">
                                {tutor.isVerified ? <ShieldCheck className="mr-1 h-3 w-3"/> : <ShieldAlert className="mr-1 h-3 w-3"/>}
                                {tutor.isVerified ? 'Verified' : 'Not Verified'}
                            </Badge>
                        </div>
                        <Separator className="my-4" />
                        <div className="text-left space-y-3">
                          <InfoItem icon={Briefcase} label="Experience">{tutor.yearOfExperience}</InfoItem>
                          <InfoItem icon={DollarSign} label="Hourly Rate">{`₹${tutor.hourlyRate} ${tutor.isRateNegotiable ? '(Negotiable)' : ''}`}</InfoItem>
                        </div>
                    </CardContent>
                     <div className="absolute top-4 right-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsLiveStatusModalOpen(true)}>
                                  {tutor.isLive ? <Radio className="mr-2 h-4 w-4 text-destructive" /> : <Radio className="mr-2 h-4 w-4 text-green-500" />}
                                  <span>{tutor.isLive ? 'Take Offline' : 'Make Live'}</span>
                                </DropdownMenuItem>
                                {tutor.isActive ? (
                                    <DropdownMenuItem onClick={() => setIsDeactivationModalOpen(true)}>
                                        <Lock className="mr-2 h-4 w-4" />
                                        <span>Deactivate</span>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onClick={() => setIsActivationModalOpen(true)}>
                                        <Unlock className="mr-2 h-4 w-4" />
                                        <span>Activate</span>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)}>
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    <span>Update</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Personal & Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoItem icon={VenetianMask} label="Gender">{tutor.gender || 'Not Specified'}</InfoItem>
                         <InfoItem icon={Mail} label="Email">
                            <div className="flex items-center gap-2">
                                <span>{tutor.email}</span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button onClick={() => { if(!tutor.emailVerified) { setVerificationType('email'); setIsVerificationModalOpen(true);}}}>
                                            <Badge variant={tutor.emailVerified ? "secondary" : "destructive"} className={cn("py-1 px-2.5", tutor.emailVerified ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20", !tutor.emailVerified && "cursor-pointer hover:bg-destructive/20")}>
                                                <MailCheck className="h-3 w-3"/>
                                            </Badge>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Email {tutor.emailVerified ? 'Verified' : 'Not Verified'}</p></TooltipContent>
                                </Tooltip>
                            </div>
                        </InfoItem>
                        <InfoItem icon={Phone} label="Phone">
                           <div className="flex flex-col items-start gap-1.5">
                                <div className="flex items-center gap-2">
                                  <span>{tutor.countryCode} {tutor.phone}</span>
                                  <Tooltip>
                                      <TooltipTrigger asChild>
                                           <button onClick={() => { if(!tutor.phoneVerified) { setVerificationType('phone'); setIsVerificationModalOpen(true);}}}>
                                                <Badge variant={tutor.phoneVerified ? "secondary" : "destructive"} className={cn("py-1 px-2.5", tutor.phoneVerified ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20", !tutor.phoneVerified && "cursor-pointer hover:bg-destructive/20")}>
                                                    <PhoneCall className="h-3 w-3"/>
                                                </Badge>
                                           </button>
                                      </TooltipTrigger>
                                      <TooltipContent><p>Phone {tutor.phoneVerified ? 'Verified' : 'Not Verified'}</p></TooltipContent>
                                  </Tooltip>
                                </div>
                                {tutor.whatsappEnabled && (
                                    <Badge variant="default" className={cn("mt-1 w-fit bg-primary/10 text-primary border-primary/20 text-xs flex items-center gap-1.5")}>
                                        <WhatsAppIcon className="h-3 w-3"/>
                                        WhatsApp
                                    </Badge>
                                )}
                            </div>
                        </InfoItem>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoItem icon={Landmark} label="Payment Mode">{tutor.bankDetails?.paymentType || "Not Set"}</InfoItem>
                        <InfoItem icon={KeyRound} label="Account / UPI ID">{maskAccountNumber(tutor.bankDetails?.accountNumber)}</InfoItem>
                    </CardContent>
                </Card>
            </div>
             {/* Main Content Column */}
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between gap-2">
                        <CardTitle>About</CardTitle>
                         {tutor.isBioReviewed ? (
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
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{tutor?.bio || "No biography provided."}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end p-3 border-t gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsUpdateBioModalOpen(true)}>
                            <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                            Change Bio
                        </Button>
                        {tutor.isBioReviewed ? (
                             <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsDisapproveBioModalOpen(true)}>
                                <Ban className="mr-1.5 h-3.5 w-3.5" />
                                Disapprove
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsApproveBioModalOpen(true)}>
                                <CheckSquare className="mr-1.5 h-3.5 w-3.5" />
                                Approve
                            </Button>
                        )}
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Tutoring Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <InfoTextItem icon={BookOpen} label="Subjects" value={tutor.subjectsList.join(', ')} />
                        <InfoTextItem icon={GraduationCap} label="Grades" value={tutor.gradesList.join(', ')} />
                        <InfoTextItem icon={Building} label="Boards" value={tutor.boardsList.join(', ')} />
                        <InfoTextItem icon={RadioTower} label="Teaching Mode" value={[tutor.online && 'Online', tutor.offline && 'Offline', tutor.isHybrid && 'Hybrid'].filter(Boolean).join(' & ')} />
                        {tutor.offline && (
                        <InfoItem icon={MapPin} label="Address">
                            {tutor.googleMapsLink ? (
                                <a href={tutor.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {tutor.addressName || tutor.address}
                                </a>
                            ) : (
                                <span>{tutor.addressName || tutor.address || "Not specified"}</span>
                            )}
                            {(tutor.addressName && tutor.address && tutor.addressName !== tutor.address) && (
                                <div className="text-xs text-muted-foreground mt-1">{tutor.address}</div>
                            )}
                        </InfoItem>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Other Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InfoTextItem icon={GraduationCap} label="Qualifications" value={tutor?.qualificationList?.join(', ')} />
                        <InfoTextItem icon={Languages} label="Languages" value={tutor?.languagesList?.join(', ')} />
                        <InfoTextItem icon={CalendarDays} label="Available Days" value={tutor?.availabilityDaysList?.join(', ')} />
                        <InfoTextItem icon={Clock} label="Available Times" value={tutor?.availabilityTimeList?.join(', ')} />
                    </CardContent>
                </Card>
            </div>
        </div>
        
        <ActivationModal
            isOpen={isActivationModalOpen}
            onOpenChange={setIsActivationModalOpen}
            tutorName={tutor?.name || ""}
            tutorId={tutorId}
        />
        
        <DeactivationModal
            isOpen={isDeactivationModalOpen}
            onOpenChange={setIsDeactivationModalOpen}
            userName={tutor?.name || ""}
            userId={tutorId}
        />

        <AdminUpdateTutorModal
            isOpen={isUpdateModalOpen}
            onOpenChange={setIsUpdateModalOpen}
            tutor={tutor}
        />

        <ApproveBioModal
            isOpen={isApproveBioModalOpen}
            onOpenChange={setIsApproveBioModalOpen}
            tutorId={tutorId}
            tutorName={tutor?.name || ""}
        />

        <DisapproveBioModal
            isOpen={isDisapproveBioModalOpen}
            onOpenChange={setIsDisapproveBioModalOpen}
            tutorId={tutorId}
            tutorName={tutor?.name || ""}
        />

        <AdminUpdateBioModal
            isOpen={isUpdateBioModalOpen}
            onOpenChange={setIsUpdateBioModalOpen}
            tutorId={tutorId}
            tutorName={tutor?.name || ""}
            initialBio={tutor?.bio || ""}
        />
      </TooltipProvider>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Verification</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to manually mark this {verificationType} as verified? This action should only be taken if you have externally confirmed its validity.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setVerificationType(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmVerification} disabled={emailVerificationMutation.isPending || phoneVerificationMutation.isPending}>
            {(emailVerificationMutation.isPending || phoneVerificationMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {(emailVerificationMutation.isPending || phoneVerificationMutation.isPending) ? 'Verifying...' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      <AlertDialog open={isLiveStatusModalOpen} onOpenChange={setIsLiveStatusModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change {tutor.displayName}'s status to <span className="font-semibold">{tutor.isLive ? 'Offline' : 'Live'}</span>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggleLiveStatus} disabled={liveStatusMutation.isPending}>
                {liveStatusMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AlertDialog>
    );
}
