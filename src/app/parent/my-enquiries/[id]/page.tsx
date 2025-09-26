
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { TuitionRequirement, User, LocationDetails } from "@/types";
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
  DialogDescription, // Renamed to avoid conflict
  DialogFooter,
  DialogClose,
  DialogTrigger
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
import { EditEnquiryModal, type EditEnquiryFormValues } from "@/components/common/modals/EditEnquiryModal";
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
  UsersRound,
  VenetianMask,
} from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

const fetchParentEnquiryDetails = async (enquiryId: string, token: string | null): Promise<TuitionRequirement> => {
  if (!token) throw new Error("Authentication token is required.");
  if (!enquiryId) throw new Error("Enquiry ID is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/enquiry/details/${enquiryId}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("Enquiry not found or you do not have permission to view it.");
    throw new Error("Failed to fetch enquiry details.");
  }

  const data = await response.json();
  const { enquirySummary, enquiryDetails } = data;
  
  const transformStringToArray = (str: string | null | undefined): string[] => {
      if (typeof str === 'string' && str.trim() !== '') {
          return str.split(',').map(s => s.trim());
      }
      return [];
  };

  return {
    id: enquirySummary.enquiryId,
    parentName: "A Parent", // This info doesn't seem to be in the response, placeholder for now
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
    applicantsCount: enquirySummary.assignedTutors || 0,
    tutorGenderPreference: enquiryDetails.tutorGenderPreference,
    startDatePreference: enquiryDetails.startDatePreference,
  };
};

const updateEnquiry = async ({ enquiryId, token, formData }: { enquiryId: string, token: string | null, formData: EditEnquiryFormValues }) => {
  if (!token) throw new Error("Authentication token is required.");
  
  const locationDetails = formData.location;
  
  let genderPreferenceApiValue: 'MALE' | 'FEMALE' | 'NO_PREFERENCE' | undefined;
  switch(formData.tutorGenderPreference) {
      case 'MALE':
      case 'FEMALE':
      case 'NO_PREFERENCE':
          genderPreferenceApiValue = formData.tutorGenderPreference;
          break;
      default:
          genderPreferenceApiValue = undefined;
  }
  
  const requestBody = {
    studentName: formData.studentName,
    subjects: formData.subject,
    grade: formData.gradeLevel,
    board: formData.board,
    addressName: locationDetails?.name || locationDetails?.address || "",
    address: locationDetails?.address || "",
    city: locationDetails?.city || "",
    state: locationDetails?.state || "",
    country: locationDetails?.country || "",
    area: locationDetails?.area || "",
    pincode: locationDetails?.pincode || "",
    googleMapsLink: locationDetails?.googleMapsUrl || "",
    availabilityDays: formData.preferredDays,
    availabilityTime: formData.preferredTimeSlots,
    online: formData.teachingMode.includes("Online"),
    offline: formData.teachingMode.includes("Offline (In-person)"),
    genderPreference: genderPreferenceApiValue,
    startPreference: formData.startDatePreference,
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/enquiry/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'TZ-ENQ-ID': enquiryId,
      'accept': '*/*',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Failed to update enquiry.");
  }
  return response.json();
};

const closeEnquiry = async ({ enquiryId, token, reason }: { enquiryId: string, token: string | null, reason: string }) => {
  if (!token) throw new Error("Authentication token is required.");
  if (!enquiryId) throw new Error("Enquiry ID is required.");
  if (!reason) throw new Error("A reason for closing is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/enquiry/close`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'TZ-ENQ-ID': enquiryId,
      'accept': '*/*',
    },
    body: JSON.stringify({ message: reason }),
  });

  if (!response.ok) {
    throw new Error("Failed to close enquiry.");
  }
  return true;
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
  const queryClient = useQueryClient();

  const [isCloseEnquiryModalOpen, setIsCloseEnquiryModalOpen] = useState(false);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 

  const { data: requirement, isLoading, error } = useQuery({
    queryKey: ['parentEnquiryDetails', id],
    queryFn: () => fetchParentEnquiryDetails(id, token),
    enabled: !!id && !!token && !isCheckingAuth,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: (formData: EditEnquiryFormValues) => updateEnquiry({ enquiryId: id, token, formData }),
    onSuccess: (updatedData) => {
      toast({ title: "Enquiry Updated!", description: "Your requirement has been successfully updated." });
      
      const { enquirySummary, enquiryDetails } = updatedData;
      const transformStringToArray = (str: string | null | undefined): string[] => {
          if (typeof str === 'string' && str.trim() !== '') return str.split(',').map(s => s.trim());
          return [];
      };

      const transformedData: TuitionRequirement = {
        id: enquirySummary.enquiryId,
        parentName: requirement?.parentName || "A Parent", 
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
        applicantsCount: enquirySummary.assignedTutors || 0,
        tutorGenderPreference: enquiryDetails.tutorGenderPreference,
        startDatePreference: enquiryDetails.startDatePreference,
      };

      queryClient.setQueryData(['parentEnquiryDetails', id], transformedData);
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    },
  });

  const closeEnquiryMutation = useMutation({
    mutationFn: (reason: string) => closeEnquiry({ enquiryId: id, token, reason }),
    onSuccess: () => {
      toast({
        title: "Enquiry Closed",
        description: `Your requirement has been successfully closed.`,
      });
      queryClient.invalidateQueries({ queryKey: ['parentEnquiries'] });
      router.push("/parent/my-enquiries");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to Close Enquiry",
        description: error.message,
      });
    },
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
    if (!closeReason) {
        toast({
            variant: "destructive",
            title: "Reason Required",
            description: "Please select a reason for closing the enquiry.",
        });
        return;
    }
    closeEnquiryMutation.mutate(closeReason);
    setIsCloseEnquiryModalOpen(false);
  };

  const handleUpdateEnquiry = (updatedData: EditEnquiryFormValues) => {
    updateMutation.mutate(updatedData);
  };
  
  const postedDate = requirement?.postedAt ? parseISO(requirement.postedAt) : new Date();
  
  const genderDisplayMap: Record<string, string> = {
    "MALE": "Male",
    "FEMALE": "Female",
    "NO_PREFERENCE": "No Preference",
  };
  const genderValue = requirement?.tutorGenderPreference ? genderDisplayMap[requirement.tutorGenderPreference] : undefined;
  
  const startDisplayMap: Record<string, string> = {
    "immediately": "Immediately",
    "within_month": "Within a month",
    "exploring": "Just exploring",
  }
  const startValue = requirement?.startDatePreference ? startDisplayMap[requirement.startDatePreference] : undefined;


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
  const hasLocationInfo = !!(locationInfo?.address && locationInfo.address.trim() !== '');
  const hasScheduleInfo = (requirement.preferredDays && requirement.preferredDays.length > 0) || (requirement.preferredTimeSlots && requirement.preferredTimeSlots.length > 0);
  const hasPreferences = !!(genderValue || startValue);


  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
               <CardHeader className="bg-card p-4 sm:p-5 relative">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-xl font-semibold text-primary">
                        {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
                        </CardTitle>
                        <Badge variant="default" className="text-xs">
                            {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
                        </Badge>
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
              </CardHeader>
              <CardContent className="p-4 md:p-5 space-y-5">
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
                        <p className="text-sm text-foreground/80 leading-relaxed pl-6">{requirement.additionalNotes}</p>
                    </section>
                   </>
                )}
              </CardContent>
              <CardFooter className="p-4 md:p-5 border-t flex flex-wrap justify-end items-center gap-2">
                <div className="flex flex-wrap justify-end gap-2">
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="sm:max-w-xl bg-card p-0 rounded-lg overflow-hidden"
                        onPointerDownOutside={(e) => e.preventDefault()}
                      >
                        <EditEnquiryModal
                            isOpen={isEditModalOpen}
                            onOpenChange={setIsEditModalOpen}
                            enquiryData={requirement}
                            onUpdateEnquiry={handleUpdateEnquiry}
                            isUpdating={updateMutation.isPending}
                        />
                      </DialogContent>
                    </Dialog>
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
                <DialogDescription>
                  Please select a reason for closing this requirement. This helps us improve our service.
                </DialogDescription>
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
                <Button 
                  type="button" 
                  onClick={handleCloseEnquiryDialogAction} 
                  disabled={!closeReason || closeEnquiryMutation.isPending}
                >
                  {closeEnquiryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {closeEnquiryMutation.isPending ? "Closing..." : "Confirm & Close"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      )}
    </main>
  );
}
