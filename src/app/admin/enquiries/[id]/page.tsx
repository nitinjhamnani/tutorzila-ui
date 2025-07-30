
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { TuitionRequirement, User, LocationDetails } from "@/types";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  Briefcase,
  ArrowLeft,
  MapPinned,
  Loader2,
  XCircle,
} from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

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

const fetchAdminEnquiryDetails = async (enquiryId: string, token: string | null): Promise<TuitionRequirement> => {
  if (!token) throw new Error("Authentication token is required.");
  if (!enquiryId) throw new Error("Enquiry ID is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/enquiry/details/${enquiryId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Enquiry not found or you do not have permission to view it.");
    }
    throw new Error("Failed to fetch enquiry details.");
  }

  const data = await response.json();

  return {
    id: data.enquirySummary.enquiryId,
    parentName: data.name || "A Parent", 
    studentName: data.studentName,
    subject: typeof data.enquirySummary.subjects === 'string' ? data.enquirySummary.subjects.split(',').map((s:string) => s.trim()) : [],
    gradeLevel: data.enquirySummary.grade,
    board: data.enquirySummary.board,
    location: {
        name: data.addressName || data.address || "",
        address: data.address,
        googleMapsUrl: data.googleMapsLink,
        city: data.enquirySummary.city,
        state: data.enquirySummary.state,
        country: data.enquirySummary.country,
        area: data.enquirySummary.area,
        pincode: data.pincode,
    },
    teachingMode: [
      ...(data.enquirySummary.online ? ["Online"] : []),
      ...(data.enquirySummary.offline ? ["Offline (In-person)"] : []),
    ],
    scheduleDetails: data.notes, 
    additionalNotes: data.notes,
    preferredDays: typeof data.availabilityDays === 'string' ? data.availabilityDays.split(',').map((d:string) => d.trim()) : [],
    preferredTimeSlots: typeof data.availabilityTime === 'string' ? data.availabilityTime.split(',').map((t:string) => t.trim()) : [],
    status: data.status?.toLowerCase() || 'open',
    postedAt: data.enquirySummary.createdOn,
    applicantsCount: data.enquirySummary.assignedTutors,
  };
};

export default function AdminEnquiryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const id = params.id as string;

  const { data: requirement, isLoading, error } = useQuery({
    queryKey: ['adminEnquiryDetails', id],
    queryFn: () => fetchAdminEnquiryDetails(id, token),
    enabled: !!id && !!token && !isCheckingAuth,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || user?.role !== 'admin')) {
      router.replace("/admin/login");
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  const postedDate = requirement?.postedAt ? parseISO(requirement.postedAt) : new Date();
  const formattedPostedDate = requirement?.postedAt ? format(postedDate, "MMMM d, yyyy 'at' h:mm a") : "";

  if (isLoading || isCheckingAuth) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-[calc(100vh_-_var(--header-height,0px)_-_100px)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col items-center justify-center min-h-[calc(100vh_-_var(--header-height,0px)_-_100px)]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <CardTitle className="text-xl mt-4">Enquiry Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{(error as Error)?.message || "An unexpected error occurred."}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/admin/enquiries")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Enquiries
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  if (!requirement) return null;

  const locationInfo = typeof requirement.location === 'object' && requirement.location ? requirement.location : null;
  const hasLocationInfo = !!(locationInfo?.address && locationInfo.address.trim() !== '');
  const hasScheduleInfo = (requirement.preferredDays && requirement.preferredDays.length > 0) || (requirement.preferredTimeSlots && requirement.preferredTimeSlots.length > 0);

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-muted/30 p-4 md:p-5 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg md:text-xl font-semibold text-primary tracking-tight">
                      {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
                    </CardTitle>
                    {requirement.studentName && (
                        <p className="text-sm font-medium text-foreground/80 mt-1 flex items-center">
                           <User className="w-4 h-4 mr-1.5 text-primary/80" /> {requirement.studentName}
                        </p>
                    )}
                  </div>
                   <Badge variant="default">
                    {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-5 space-y-5">
                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-foreground flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-primary/80" />
                    Requirement Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                    <EnquiryInfoItem label="Grade Level" value={requirement.gradeLevel} icon={GraduationCap} />
                    {requirement.board && <EnquiryInfoItem label="Board" value={requirement.board} icon={Building} />}
                    {requirement.teachingMode && requirement.teachingMode.length > 0 && (
                        <EnquiryInfoItem label="Teaching Mode(s)" value={requirement.teachingMode} icon={RadioTower} />
                    )}
                  </div>
                </section>
                
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
                        <p className="text-sm text-foreground/80 leading-relaxed pl-6">{requirement.additionalNotes}</p>
                    </section>
                   </>
                )}
              </CardContent>
              <CardFooter className="p-4 md:p-5 border-t flex-wrap justify-between items-center gap-2">
                <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    Posted on {formattedPostedDate}
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                    {(requirement.applicantsCount ?? 0) > 0 && (
                      <Button asChild variant="default" size="sm">
                          <Link href="#">
                          <UsersIcon className="mr-1.5 h-3.5 w-3.5" />
                          View Assigned Tutors ({requirement.applicantsCount})
                          </Link>
                      </Button>
                    )}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
