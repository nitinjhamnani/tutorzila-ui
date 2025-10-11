
// src/app/tutor/enquiries/[id]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { TuitionRequirement, LocationDetails } from "@/types";
import { Button } from "@/components/ui/button";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useQuery } from "@tanstack/react-query";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
} from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const fetchEnquiryDetails = async (
  enquiryId: string,
  token: string | null
): Promise<{ requirement: TuitionRequirement, assignedStatus: string | null }> => {
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
  const { enquirySummary, enquiryDetails } = data.enquiryResponse;

  const transformStringToArray = (str: string | null | undefined): string[] => {
    if (typeof str === 'string' && str.trim() !== '') {
        return str.split(',').map(s => s.trim());
    }
    return [];
  };

  const requirement: TuitionRequirement = {
    id: enquirySummary.enquiryId,
    parentName: "A Parent", 
    studentName: enquiryDetails.studentName,
    subject: transformStringToArray(enquirySummary.subjects),
    gradeLevel: enquirySummary.grade,
    board: enquirySummary.board,
    location: {
        name: enquiryDetails.addressName || enquiryDetails.address,
        address: enquiryDetails.address,
        googleMapsUrl: enquiryDetails.googleMapsLink,
        city: enquirySummary.city,
        state: enquirySummary.state,
        country: enquirySummary.country,
        area: enquirySummary.area,
        pincode: enquiryDetails.pincode,
    },
    teachingMode: [
      ...(enquirySummary.online ? ["Online"] : []),
      ...(enquirySummary.offline ? ["Offline (In-person)"] : []),
    ],
    scheduleDetails: enquiryDetails.notes, 
    additionalNotes: enquiryDetails.additionalNotes,
    preferredDays: transformStringToArray(enquiryDetails.availabilityDays),
    preferredTimeSlots: transformStringToArray(enquiryDetails.availabilityTime),
    status: enquirySummary.status?.toLowerCase() || 'open',
    postedAt: enquirySummary.createdOn,
    tutorGenderPreference: enquiryDetails.tutorGenderPreference?.toUpperCase() as 'MALE' | 'FEMALE' | 'NO_PREFERENCE' | undefined,
    startDatePreference: enquiryDetails.startDatePreference,
    budget: data.budget, 
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

export default function TutorEnquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const id = params.id as string;
  const { hideLoader } = useGlobalLoader();

  const {
    data: enquiryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["enquiryDetails", id, token],
    queryFn: () => fetchEnquiryDetails(id, token),
    enabled: !!id && !!token,
    staleTime: 5 * 60 * 1000,
  });

  const requirement = enquiryData?.requirement;
  const assignedStatus = enquiryData?.assignedStatus;


  useEffect(() => {
    if (!isLoading) {
      hideLoader();
    }
  }, [isLoading, hideLoader]);
  
  const postedDate = requirement?.postedAt ? parseISO(requirement.postedAt) : new Date();
  const genderDisplayMap: Record<string, string> = {
    "MALE": "Male", "FEMALE": "Female", "NO_PREFERENCE": "No Preference",
  };
  const genderValue = requirement?.tutorGenderPreference ? genderDisplayMap[requirement.tutorGenderPreference] : undefined;
  
  const startDisplayMap: Record<string, string> = {
    "IMMEDIATELY": "Immediately", "WITHIN_A_MONTH": "Within a month", "JUST_EXPLORING": "Just exploring",
  };
  const startValue = requirement?.startDatePreference ? startDisplayMap[requirement.startDatePreference] : undefined;

  const containerPadding = "py-6 md:py-8"; 

  if (isLoading || isCheckingAuth) {
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

  const locationInfo = typeof requirement.location === 'object' && requirement.location ? requirement.location : null;
  const hasLocationInfo = !!(locationInfo?.address && locationInfo.address.trim() !== '');
  const hasScheduleInfo = (requirement.preferredDays && requirement.preferredDays.length > 0) || (requirement.preferredTimeSlots && requirement.preferredTimeSlots.length > 0);
  const hasPreferences = !!(genderValue || startValue);
  const budgetInfo = requirement.budget;


  return (
    <div className={containerPadding}>
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-card p-4 sm:p-5 relative">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center gap-4 flex-grow">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-xl font-semibold text-primary">
                          {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
                          </CardTitle>
                          {assignedStatus && (
                            <Badge variant="default" className="text-xs">
                                {assignedStatus.charAt(0).toUpperCase() + assignedStatus.slice(1).toLowerCase()}
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
                            <div className="flex flex-col gap-2 pt-2 text-xs text-muted-foreground">
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                      <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-primary/80"/>{requirement.gradeLevel}</span>
                                      {requirement.board && <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-primary/80"/>{requirement.board}</span>}
                                      <span className="flex items-center gap-1.5"><RadioTower className="w-3.5 h-3.5 text-primary/80"/>{requirement.teachingMode?.join(', ')}</span>
                                  </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-5 space-y-5">
              {budgetInfo && (budgetInfo.totalFees || 0) > 0 && (
                <>
                  <Separator />
                  <section className="space-y-3">
                    <h3 className="text-base font-semibold text-foreground flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-primary/80" />
                      Budget
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                      <EnquiryInfoItem label="Estimated Monthly Fee" value={`₹${budgetInfo.totalFees?.toLocaleString()}`} icon={Coins} />
                      {budgetInfo.finalRate && budgetInfo.finalRate > 0 && <EnquiryInfoItem label="Estimated Hourly Rate" value={`≈ ₹${Math.round(budgetInfo.finalRate).toLocaleString()}/hr`} icon={DollarSign} />}
                    </div>
                  </section>
                </>
              )}
              {hasPreferences && (
                <>
                  <Separator />
                  <section className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground flex items-center">
                          <Info className="w-4 h-4 mr-2 text-primary/80" />
                          General Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                          {genderValue && (
                            <EnquiryInfoItem label="Tutor Gender" value={genderValue} icon={VenetianMask} />
                          )}
                          {startValue && (
                            <EnquiryInfoItem label="Start Date" value={startValue} icon={CalendarDays} />
                          )}
                      </div>
                  </section>
                </>
              )}
              {hasScheduleInfo && (
                <>
                  <Separator />
                  <section className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground flex items-center">
                          <CalendarDays className="w-4 h-4 mr-2 text-primary/80" />
                          Schedule Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                          {requirement.preferredDays && requirement.preferredDays.length > 0 && (
                          <EnquiryInfoItem label="Preferred Days" value={requirement.preferredDays.join(', ')} icon={CalendarDays} />
                          )}
                          {requirement.preferredTimeSlots && requirement.preferredTimeSlots.length > 0 && (
                          <EnquiryInfoItem label="Preferred Time" value={requirement.preferredTimeSlots.join(', ')} icon={Clock} />
                          )}
                      </div>
                  </section>
                </>
              )}
              {hasLocationInfo && (
                <>
                  <Separator />
                  <section className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-primary/80" />
                          Location
                      </h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                          {locationInfo?.area && <EnquiryInfoItem label="Area" value={locationInfo.area} icon={MapPin} />}
                          {locationInfo && (locationInfo.city || locationInfo.state || locationInfo.country) && (
                              <EnquiryInfoItem label="Location" value={[locationInfo.city, locationInfo.state, locationInfo.country].filter(Boolean).join(', ')} icon={MapPinned} />
                          )}
                           {locationInfo?.address && <EnquiryInfoItem value={locationInfo} className="md:col-span-2" />}
                      </div>
                  </section>
                </>
              )}
              {requirement.additionalNotes && (
                 <>
                  <Separator />
                  <section className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground flex items-center">
                          <Info className="w-4 h-4 mr-2 text-primary/80" />
                          Additional Notes
                      </h3>
                      <p className="text-sm text-foreground/80 leading-relaxed pl-6 whitespace-pre-wrap">
                          {requirement.additionalNotes}
                      </p>
                  </section>
                 </>
              )}
            </CardContent>
            <CardFooter className="p-4 md:p-5 border-t flex flex-wrap justify-between items-center gap-2">
               <Button variant="link" asChild className="text-xs p-0 h-auto text-primary hover:text-primary/80">
                <Link href="/tutor/enquiries">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Back to All Enquiries
                </Link>
              </Button>
              {assignedStatus !== "ASSIGNED" && assignedStatus !== "SHORTLISTED" && (
                <Button size="sm">
                  <Send className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
              )}
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
