
// src/app/tutor/enquiries/[id]/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { TuitionRequirement, LocationDetails, ApiTutor } from "@/types";
import { Button } from "@/components/ui/button";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Clock,
  MapPin,
  Building,
  RadioTower,
  Info,
  Users as UsersIcon,
  ArrowLeft,
  MapPinned,
  Loader2,
  UsersRound,
  VenetianMask,
  XCircle,
  Coins,
  DollarSign,
  Send,
  CheckCircle,
  Ban,
} from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ActivationStatusCard } from "@/components/tutor/ActivationStatusCard";
import { useAtom } from "jotai";
import { tutorProfileAtom } from "@/lib/state/tutor";

const fetchEnquiryDetails = async (
  enquiryId: string,
  token: string | null
): Promise<{ requirement: TuitionRequirement; assignedStatus: string | null }> => {
  if (!token) throw new Error("Authentication token is required.");
  if (!enquiryId) throw new Error("Enquiry ID is required.");

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(
    `${apiBaseUrl}/api/tutor/enquiry/${enquiryId}`,
    {
      headers: { Authorization: `Bearer ${token}`, accept: "*/*" },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Enquiry not found or you do not have permission to view it.");
    }
    throw new Error("Failed to fetch enquiry details.");
  }
  
  const data = await response.json();
  const { enquiryResponse, budget } = data;

  const transformStringToArray = (str: string | null | undefined): string[] => {
      if (typeof str === 'string' && str.trim() !== '') {
          return str.split(',').map(s => s.trim());
      }
      return [];
  };

  const requirement: TuitionRequirement = {
    id: enquiryResponse.enquirySummary.enquiryId,
    parentId: data.parentId,
    parentName: "A Parent", 
    studentName: enquiryResponse.enquiryDetails.studentName,
    subject: transformStringToArray(enquiryResponse.enquirySummary.subjects),
    gradeLevel: enquiryResponse.enquirySummary.grade,
    board: enquiryResponse.enquirySummary.board,
    location: {
        name: enquiryResponse.enquiryDetails.addressName || enquiryResponse.enquiryDetails.address,
        address: enquiryResponse.enquiryDetails.address,
        googleMapsUrl: enquiryResponse.enquiryDetails.googleMapsLink,
        city: enquiryResponse.enquirySummary.city,
        state: enquiryResponse.enquirySummary.state,
        country: enquiryResponse.enquirySummary.country,
        area: enquiryResponse.enquirySummary.area,
        pincode: enquiryResponse.enquiryDetails.pincode,
    },
    teachingMode: [
      ...(enquiryResponse.enquirySummary.online ? ["Online"] : []),
      ...(enquiryResponse.enquirySummary.offline ? ["Offline (In-person)"] : []),
    ],
    scheduleDetails: enquiryResponse.enquiryDetails.notes, 
    additionalNotes: enquiryResponse.enquiryDetails.additionalNotes,
    preferredDays: transformStringToArray(enquiryResponse.enquiryDetails.availabilityDays),
    preferredTimeSlots: transformStringToArray(enquiryResponse.enquiryDetails.availabilityTime),
    status: enquiryResponse.enquirySummary.status?.toLowerCase() || 'open',
    postedAt: enquiryResponse.enquirySummary.createdOn,
    tutorGenderPreference: enquiryResponse.enquiryDetails.tutorGenderPreference?.toUpperCase() as 'MALE' | 'FEMALE' | 'NO_PREFERENCE' | undefined,
    startDatePreference: enquiryResponse.enquiryDetails.startDatePreference,
    budget: budget, 
  };
  
  return { requirement, assignedStatus: data.assignedEnquiryStatus };
};

const applyToEnquiry = async (
  enquiryId: string,
  token: string | null
): Promise<{ requirement: TuitionRequirement; assignedStatus: string | null }> => {
  if (!token) throw new Error("Authentication failed.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(`${apiBaseUrl}/api/tutor/enquiry/apply/${enquiryId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to apply. Please try again.' }));
    throw new Error(errorData.message);
  }

  const data = await response.json();
  const { enquiryResponse, budget } = data;

  const transformStringToArray = (str: string | null | undefined): string[] => {
    if (typeof str === 'string' && str.trim() !== '') {
        return str.split(',').map(s => s.trim());
    }
    return [];
  };

  const requirement: TuitionRequirement = {
    id: enquiryResponse.enquirySummary.enquiryId,
    parentId: data.parentId,
    parentName: "A Parent",
    studentName: enquiryResponse.enquiryDetails.studentName,
    subject: transformStringToArray(enquiryResponse.enquirySummary.subjects),
    gradeLevel: enquiryResponse.enquirySummary.grade,
    board: enquiryResponse.enquirySummary.board,
    location: {
        name: enquiryResponse.enquiryDetails.addressName || enquiryResponse.enquiryDetails.address,
        address: enquiryResponse.enquiryDetails.address,
        googleMapsUrl: enquiryResponse.enquiryDetails.googleMapsLink,
        city: enquiryResponse.enquirySummary.city,
        state: enquiryResponse.enquirySummary.state,
        country: enquiryResponse.enquirySummary.country,
        area: enquiryResponse.enquirySummary.area,
        pincode: enquiryResponse.enquiryDetails.pincode,
    },
    teachingMode: [
      ...(enquiryResponse.enquirySummary.online ? ["Online"] : []),
      ...(enquiryResponse.enquirySummary.offline ? ["Offline (In-person)"] : []),
    ],
    scheduleDetails: enquiryResponse.enquiryDetails.notes,
    additionalNotes: enquiryResponse.enquiryDetails.additionalNotes,
    preferredDays: transformStringToArray(enquiryResponse.enquiryDetails.availabilityDays),
    preferredTimeSlots: transformStringToArray(enquiryResponse.enquiryDetails.availabilityTime),
    status: enquiryResponse.enquirySummary.status?.toLowerCase() || 'open',
    postedAt: enquiryResponse.enquirySummary.createdOn,
    tutorGenderPreference: enquiryResponse.enquiryDetails.tutorGenderPreference?.toUpperCase() as 'MALE' | 'FEMALE' | 'NO_PREFERENCE' | undefined,
    startDatePreference: enquiryResponse.enquiryDetails.startDatePreference,
    budget: budget,
  };
  
  return { requirement, assignedStatus: data.assignedEnquiryStatus };
};

const revokeApplication = async (
  enquiryId: string,
  token: string | null
): Promise<{ requirement: TuitionRequirement; assignedStatus: string | null }> => {
  if (!token) throw new Error("Authentication failed.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(`${apiBaseUrl}/api/tutor/enquiry/revoke/${enquiryId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to revoke application. Please try again.' }));
    throw new Error(errorData.message);
  }

  const data = await response.json();
  const { enquiryResponse, budget } = data;

  const transformStringToArray = (str: string | null | undefined): string[] => {
    if (typeof str === 'string' && str.trim() !== '') {
        return str.split(',').map(s => s.trim());
    }
    return [];
  };

  const requirement: TuitionRequirement = {
    id: enquiryResponse.enquirySummary.enquiryId,
    parentId: data.parentId,
    parentName: "A Parent",
    studentName: enquiryResponse.enquiryDetails.studentName,
    subject: transformStringToArray(enquiryResponse.enquirySummary.subjects),
    gradeLevel: enquiryResponse.enquirySummary.grade,
    board: enquiryResponse.enquirySummary.board,
    location: {
        name: enquiryResponse.enquiryDetails.addressName || enquiryResponse.enquiryDetails.address,
        address: enquiryResponse.enquiryDetails.address,
        googleMapsUrl: enquiryResponse.enquiryDetails.googleMapsLink,
        city: enquiryResponse.enquirySummary.city,
        state: enquiryResponse.enquirySummary.state,
        country: enquiryResponse.enquirySummary.country,
        area: enquiryResponse.enquirySummary.area,
        pincode: enquiryResponse.enquiryDetails.pincode,
    },
    teachingMode: [
      ...(enquiryResponse.enquirySummary.online ? ["Online"] : []),
      ...(enquiryResponse.enquirySummary.offline ? ["Offline (In-person)"] : []),
    ],
    scheduleDetails: enquiryResponse.enquiryDetails.notes,
    additionalNotes: enquiryResponse.enquiryDetails.additionalNotes,
    preferredDays: transformStringToArray(enquiryResponse.enquiryDetails.availabilityDays),
    preferredTimeSlots: transformStringToArray(enquiryResponse.enquiryDetails.availabilityTime),
    status: enquiryResponse.enquirySummary.status?.toLowerCase() || 'open',
    postedAt: enquiryResponse.enquirySummary.createdOn,
    tutorGenderPreference: enquiryResponse.enquiryDetails.tutorGenderPreference?.toUpperCase() as 'MALE' | 'FEMALE' | 'NO_PREFERENCE' | undefined,
    startDatePreference: enquiryResponse.enquiryDetails.startDatePreference,
    budget: budget,
  };
  
  return { requirement, assignedStatus: data.assignedEnquiryStatus };
};


const EnquiryInfoItem = ({
  icon: Icon,
  label,
  value,
  children,
  className,
}: {
  icon?: React.ElementType;
  label?: string;
  value?: string | string[] | LocationDetails | null;
  children?: React.ReactNode;
  className?: string;
}) => {
  if (!value && !children) return null;
  
  let displayText: React.ReactNode = null;

  if (typeof value === 'object' && value !== null && 'address' in value) {
    const location = value as LocationDetails;
    const hasDistinctName = location.name && location.name !== location.address;
    
    const renderLink = (text: string) => (
       <a href={location.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1.5">
           <MapPinned className="h-3 w-3" /> {text}
        </a>
    )

    displayText = (
        <div className="mt-1 p-2 bg-muted/30 border rounded-md">
          {location.googleMapsUrl ? renderLink(location.name || location.address) : <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {location.name || location.address}</p>}
          {hasDistinctName && <div className="text-xs text-muted-foreground pl-5">{location.address}</div>}
        </div>
      );
  } else if (Array.isArray(value)) {
    displayText = value.join(", ");
  } else {
    displayText = value as string;
  }

  return (
    <div className={cn("space-y-0.5", className)}>
      {label && (
         <span className="text-xs text-muted-foreground font-medium flex items-center">
            {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/80" />}
            {label}
        </span>
      )}
      {!label && Icon && <Icon className="w-3.5 h-3.5 text-primary/80" />}
      {displayText && <div className={cn("text-sm text-foreground/90", !label && "pl-0")}>{children ? null : displayText}</div>}
      {children && <div className={cn("text-sm text-foreground/90", !label && "pl-0")}>{children}</div>}
    </div>
  );
};

const DetailSectionCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
        <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-primary flex items-center">
                <Icon className="w-4 h-4 mr-2" />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
            {children}
        </CardContent>
    </Card>
);

export default function TutorEnquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthMock();
  const id = params.id as string;
  const { showLoader, hideLoader } = useGlobalLoader();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tutorProfile] = useAtom(tutorProfileAtom);

  const {
    data: enquiryData,
    isLoading: isLoadingEnquiry,
    error,
  } = useQuery({
    queryKey: ["enquiryDetails", id, token],
    queryFn: () => fetchEnquiryDetails(id, token),
    enabled: !!id && !!token,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = isLoadingEnquiry;

  const applyMutation = useMutation({
    mutationFn: () => applyToEnquiry(id, token),
    onMutate: () => {
      showLoader("Applying to enquiry...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["enquiryDetails", id, token], newData);
      toast({
        title: "Successfully Applied!",
        description: "The parent has been notified of your interest.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Application Failed",
        description: error.message || "An unexpected error occurred.",
      });
    },
    onSettled: () => {
      hideLoader();
    },
  });

  const revokeMutation = useMutation({
    mutationFn: () => revokeApplication(id, token),
    onMutate: () => {
      showLoader("Revoking application...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["enquiryDetails", id, token], newData);
      toast({
        title: "Application Revoked",
        description: "You have withdrawn your application for this enquiry.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Revoke Failed",
        description: error.message || "Could not revoke the application.",
      });
    },
    onSettled: () => {
      hideLoader();
    },
  });


  useEffect(() => {
    if (!isLoading) {
      hideLoader();
    }
  }, [isLoading, hideLoader]);
  
  const requirement = enquiryData?.requirement;
  const assignedStatus = enquiryData?.assignedStatus;
  
  const postedDate = requirement?.postedAt ? parseISO(requirement.postedAt) : new Date();
  const genderDisplayMap: Record<string, string> = {
    "MALE": "Male", "FEMALE": "Female", "NO_PREFERENCE": "No Preference",
  };
  const genderValue = requirement?.tutorGenderPreference ? genderDisplayMap[requirement.tutorGenderPreference] : undefined;
  
  const startDisplayMap: Record<string, string> = {
    "IMMEDIATELY": "Immediately", "WITHIN_A_MONTH": "Within a month", "JUST_EXPLORING": "Just exploring",
  };
  const startValue = requirement?.startDatePreference ? startDisplayMap[requirement.startDatePreference] : undefined;

  const containerPadding = "py-6 md:py-8 px-4 sm:px-6 md:px-8"; 

  if (isLoading) {
    return (
        <div className={containerPadding}>
          <Skeleton className="h-[400px] w-full rounded-lg mt-4" />
        </div>
      );
  }

  if (error) {
    return (
      <div className={`${containerPadding} flex justify-center items-center min-h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px)-5rem)]`}>
        <Alert variant="destructive" className="max-w-md text-center shadow-lg rounded-xl">
          <UserX className="h-10 w-10 mx-auto mb-3 text-destructive" />
          <AlertTitle className="text-xl font-semibold">Enquiry Not Found</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
          <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
        </Alert>
      </div>
    );
  }

  if (!requirement) {
     return (
      <div className={`${containerPadding} text-center`}>
        <p className="text-muted-foreground mt-4">No enquiry data available.</p>
      </div>
    );
  }

  const isTutorRegisteredAndActive = tutorProfile?.tutoringDetails?.registered && tutorProfile?.tutoringDetails?.active;

  const locationInfo = typeof requirement.location === 'object' && requirement.location ? requirement.location : null;
  const hasLocationInfo = !!(locationInfo?.address && locationInfo.address.trim() !== '');
  const hasScheduleInfo = (requirement.preferredDays && requirement.preferredDays.length > 0) || (requirement.preferredTimeSlots && requirement.preferredTimeSlots.length > 0);
  const hasPreferences = !!(genderValue || startValue);
  const budgetInfo = requirement.budget;


  return (
    <div className={containerPadding}>
        {!isTutorRegisteredAndActive && (
          <ActivationStatusCard 
            onActivate={() => queryClient.invalidateQueries({ queryKey: ["tutorDetails", token] })}
            className="mb-6"
            message="You must register and activate your account before you can apply for enquiries."
          />
        )}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
                <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
                    <CardHeader className="bg-card p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                            <CardTitle className="text-xl font-semibold text-primary">
                            {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
                            </CardTitle>
                            {(assignedStatus === 'APPLIED' || assignedStatus === 'SHORTLISTED' || assignedStatus === 'ASSIGNED') && (
                            <Badge variant="default" className="text-xs w-fit bg-primary text-primary-foreground">
                                <CheckCircle className="mr-1 h-3 w-3"/>
                                {assignedStatus === 'APPLIED' ? 'Applied' : assignedStatus === 'SHORTLISTED' ? 'Shortlisted' : 'Assigned'}
                            </Badge>
                            )}
                        </div>
                        <div className="space-y-2 pt-2">
                            <CardDescription className="text-sm text-foreground/80 flex items-center gap-1.5">
                                <UsersRound className="w-4 h-4"/> {requirement.studentName}
                            </CardDescription>
                            {requirement.postedAt && (
                                <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                                    <Clock className="w-3.5 h-3.5" /> 
                                    Posted on {format(postedDate, "MMM d, yyyy")}
                                </CardDescription>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-5 space-y-3 border-t">
                        <h3 className="text-base font-semibold text-foreground flex items-center">
                            <BookOpen className="w-4 h-4 mr-2 text-primary/80" />
                            Academic Details
                        </h3>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-3 pl-6">
                            <EnquiryInfoItem label="Grade Level" value={requirement.gradeLevel} icon={GraduationCap} />
                            {requirement.board && <EnquiryInfoItem label="Board" value={requirement.board} icon={Building} />}
                            {requirement.teachingMode && requirement.teachingMode.length > 0 && <EnquiryInfoItem label="Mode(s)" value={requirement.teachingMode.join(', ')} icon={RadioTower}/>}
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 md:p-5 border-t bg-card flex flex-col gap-2">
                      {assignedStatus !== "APPLIED" && assignedStatus !== "SHORTLISTED" && assignedStatus !== "ASSIGNED" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" className="w-full" disabled={!isTutorRegisteredAndActive}>
                                <Send className="mr-2 h-4 w-4" />
                                Apply Now
                              </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Application</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to apply for this tuition enquiry? The parent will be notified of your interest.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}>
                                {applyMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</> : "Confirm & Apply"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {(assignedStatus === "APPLIED" || assignedStatus === "SHORTLISTED" || assignedStatus === "ASSIGNED") && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive-outline" className="w-full">
                                  <Ban className="mr-2 h-4 w-4" />
                                  Not Interested
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revoke Application</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to withdraw your application for this enquiry? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => revokeMutation.mutate()} disabled={revokeMutation.isPending}>
                                  {revokeMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Revoking...</> : "Confirm Revoke"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <Button variant="link" asChild className="text-xs p-0 h-auto text-primary hover:text-primary/80 mt-2">
                        <Link href="/tutor/enquiries">
                          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                          Back to All Enquiries
                        </Link>
                      </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="lg:col-span-3 space-y-6">
                 {budgetInfo && (budgetInfo.totalFees || 0) > 0 && (
                    <DetailSectionCard icon={DollarSign} title="Budget">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <EnquiryInfoItem label="Estimated Monthly Fee" value={`₹${budgetInfo.totalFees?.toLocaleString()}`} icon={Coins} />
                            {budgetInfo.finalRate && budgetInfo.finalRate > 0 && <EnquiryInfoItem label="Estimated Hourly Rate" value={`≈ ₹${Math.round(budgetInfo.finalRate).toLocaleString()}/hr`} icon={DollarSign} />}
                        </div>
                    </DetailSectionCard>
                )}

                {(hasPreferences || hasScheduleInfo) && (
                    <DetailSectionCard icon={Info} title="Tuition Preferences">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {genderValue && <EnquiryInfoItem label="Tutor Gender" value={genderValue} icon={VenetianMask} />}
                            {startValue && <EnquiryInfoItem label="Start Date" value={startValue} icon={CalendarDays} />}
                            {requirement.preferredDays && requirement.preferredDays.length > 0 && (
                                <EnquiryInfoItem label="Preferred Days" value={requirement.preferredDays.join(', ')} icon={CalendarDays} />
                            )}
                            {requirement.preferredTimeSlots && requirement.preferredTimeSlots.length > 0 && (
                                <EnquiryInfoItem label="Preferred Time" value={requirement.preferredTimeSlots.join(', ')} icon={Clock} />
                            )}
                        </div>
                    </DetailSectionCard>
                )}
                
                {hasLocationInfo && (
                    <DetailSectionCard icon={MapPin} title="Location Details">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {locationInfo?.area && <EnquiryInfoItem label="Area" value={locationInfo.area} icon={MapPin} />}
                            {locationInfo && (locationInfo.city || locationInfo.state) && (
                                <EnquiryInfoItem label="City/State" value={[locationInfo.city, locationInfo.state].filter(Boolean).join(', ')} icon={MapPinned} />
                            )}
                             {locationInfo?.address && <EnquiryInfoItem value={locationInfo} className="md:col-span-2" />}
                        </div>
                    </DetailSectionCard>
                )}

                {requirement.additionalNotes && (
                    <DetailSectionCard icon={Info} title="Additional Notes from Parent">
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {requirement.additionalNotes}
                        </p>
                    </DetailSectionCard>
                )}
            </div>
        </div>
    </div>
  );
}
