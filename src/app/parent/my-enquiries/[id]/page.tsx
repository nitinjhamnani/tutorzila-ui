
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { TuitionRequirement, TutorProfile, LocationDetails } from "@/types";
import { MOCK_ALL_PARENT_REQUIREMENTS, MOCK_TUTOR_PROFILES } from "@/lib/mock-data";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDesc, // Renamed to avoid conflict
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { FormControl, FormItem } from "@/components/ui/form"; // Correctly import form components
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ParentEnquiryModal } from "@/components/parent/modals/ParentEnquiryModal";
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
  Edit3,
  XCircle,
  Briefcase,
  ArrowLeft,
  MapPinned,
  Loader2,
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
      {displayText && <div className={cn("text-sm text-foreground/90", !label && "pl-0")}>{displayText}</div>}
      {children && <div className={cn("text-sm text-foreground/90", !label && "pl-0")}>{children}</div>}
    </div>
  );
};

const fetchParentEnquiryDetails = async (enquiryId: string, token: string | null): Promise<TuitionRequirement> => {
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

  // Transform the API response to match the TuitionRequirement type
  return {
    id: data.enquirySummary.enquiryId,
    parentId: "", // Not provided by API, but part of the type
    parentName: data.name || "A Parent", // Assuming 'name' exists at top-level
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
    scheduleDetails: data.notes, // 'initial' field from list is now 'notes' in detail
    additionalNotes: data.notes,
    preferredDays: typeof data.availabilityDays === 'string' ? data.availabilityDays.split(',').map((d:string) => d.trim()) : [],
    preferredTimeSlots: typeof data.availabilityTime === 'string' ? data.availabilityTime.split(',').map((t:string) => t.trim()) : [],
    status: data.status?.toLowerCase() || 'open',
    postedAt: data.enquirySummary.createdOn,
    applicantsCount: data.enquirySummary.assignedTutors,
  };
};

const closeReasons = [
    { id: 'found-tutorzila', label: "Found a tutor on Tutorzila" },
    { id: 'found-elsewhere', label: "Found a tutor elsewhere" },
    { id: 'no-longer-needed', label: "Don't need a tutor anymore" },
    { id: 'other', label: "Other" }
];

export default function ParentEnquiryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const { toast } = useToast();
  const id = params.id as string;

  const [isCloseEnquiryModalOpen, setIsCloseEnquiryModalOpen] = useState(false);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For the edit modal

  const { data: requirement, isLoading, error } = useQuery({
    queryKey: ['parentEnquiryDetails', id, token],
    queryFn: () => fetchParentEnquiryDetails(id, token),
    enabled: !!id && !!token && !isCheckingAuth,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.replace("/");
    }
  }, [isCheckingAuth, isAuthenticated, router]);

  const handleOpenCloseEnquiryModal = () => {
    if (!requirement) return;
    setCloseReason(null);
    setIsCloseEnquiryModalOpen(true);
  };

  const handleCloseEnquiryDialogAction = () => {
    if (!requirement) return;
    if (!closeReason) {
        toast({
            variant: "destructive",
            title: "Reason Required",
            description: "Please select a reason for closing the enquiry.",
        });
        return;
    }

    // Mocking update as there is no API for this yet
    const reqIndex = MOCK_ALL_PARENT_REQUIREMENTS.findIndex(r => r.id === requirement.id);
    if (reqIndex > -1) MOCK_ALL_PARENT_REQUIREMENTS[reqIndex].status = "closed";
    
    console.log(`Closing enquiry ${requirement.id}. Reason: ${closeReason}`);
    toast({
      title: "Enquiry Closed (Mock)",
      description: `Requirement for "${Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}" has been marked as closed.`,
    });
    setIsCloseEnquiryModalOpen(false);
    router.push("/parent/my-enquiries"); 
  };

  const handleUpdateEnquiry = (updatedData: Partial<TuitionRequirement>) => {
    if (!requirement) return;
    const reqIndex = MOCK_ALL_PARENT_REQUIREMENTS.findIndex(r => r.id === requirement.id);
    if (reqIndex > -1) {
      MOCK_ALL_PARENT_REQUIREMENTS[reqIndex] = {
        ...MOCK_ALL_PARENT_REQUIREMENTS[reqIndex],
        ...updatedData,
      };
    }
    toast({ title: "Enquiry Updated", description: "Your requirement details have been saved." });
    setIsEditModalOpen(false);
    // In a real app, you would refetch the query here: queryClient.invalidateQueries(...)
  };
  
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
              <Button onClick={() => router.push("/parent/my-enquiries")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Enquiries
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  if (!requirement) return null;

  const locationInfo = typeof requirement.location === 'object' && requirement.location ? requirement.location : null;

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
                   <Badge variant={requirement.status === 'open' ? 'default' : requirement.status === 'matched' ? 'secondary' : 'outline'}
                     className={cn(
                       requirement.status === 'open' && 'bg-green-600 hover:bg-green-700 text-white',
                       requirement.status === 'matched' && 'bg-blue-600 hover:bg-blue-700 text-white',
                       requirement.status === 'closed' && 'bg-gray-500 hover:bg-gray-600 text-white'
                     )}
                   >
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
                        <EnquiryInfoItem label="Teaching Mode(s)" icon={RadioTower}>
                            <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {requirement.teachingMode.map(mode => (
                                <Badge key={mode} variant="secondary" className="text-[11px] py-0.5 px-1.5">{mode}</Badge>
                            ))}
                            </div>
                        </EnquiryInfoItem>
                    )}
                  </div>
                </section>
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
                {requirement.additionalNotes && (
                   <>
                    <Separator />
                    <section className="space-y-3">
                        <h3 className="text-base font-semibold text-foreground flex items-center">
                            <Info className="w-4 h-4 mr-2 text-primary/80" />
                            Additional Notes
                        </h3>
                        <p className="text-sm text-foreground/80 pl-6">{requirement.additionalNotes}</p>
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
                    <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
                      <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
                    </Button>
                    {(requirement.applicantsCount ?? 0) > 0 && (
                      <Button asChild variant="default" size="sm">
                          <Link href={`/parent/my-tutors/${requirement.id}`}>
                          <UsersIcon className="mr-1.5 h-3.5 w-3.5" />
                          View Assigned Tutors ({requirement.applicantsCount})
                          </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={handleOpenCloseEnquiryModal}>
                      <XCircle className="mr-1.5 h-3.5 w-3.5" /> Close Enquiry
                    </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {requirement && (
        <Dialog open={isCloseEnquiryModalOpen} onOpenChange={setIsCloseEnquiryModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Close Enquiry: {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}</DialogTitle>
                <DialogDesc>
                  Please select a reason for closing this requirement. This helps us improve our service.
                </DialogDesc>
              </DialogHeader>
              <div className="py-4 space-y-4">
                  <RadioGroup
                    onValueChange={(value: string) => setCloseReason(value)}
                    value={closeReason || ""}
                    className="flex flex-col space-y-2"
                  >
                    {closeReasons.map((reason) => (
                      <div key={reason.id} className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value={reason.id} id={reason.id} />
                        <Label htmlFor={reason.id} className="font-normal text-sm">{reason.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button" onClick={handleCloseEnquiryDialogAction} disabled={!closeReason}>
                  Confirm & Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      )}
      
      {requirement && (
        <ParentEnquiryModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          enquiryData={requirement}
          onUpdateEnquiry={handleUpdateEnquiry}
        />
      )}
    </main>
  );
}
