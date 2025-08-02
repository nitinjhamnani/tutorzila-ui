
"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import type { ApiTutor, TuitionRequirement, LocationDetails } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AdminEnquiryModal, type AdminEnquiryEditFormValues } from "@/components/admin/modals/AdminEnquiryModal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Users,
  Eye,
  CheckCircle,
  XCircle,
  ShieldAlert,
  ListFilter,
  UsersRound,
  Briefcase,
  Search,
  GraduationCap,
  BookOpen,
  MapPin,
  RadioTower,
  ShieldCheck,
  Phone,
  Star,
  Bookmark,
  Clock,
  Edit3,
  Save,
  ClipboardEdit,
  Loader2,
  Info,
  MapPinned,
  CalendarDays,
  User,
  Building,
  CheckSquare,
  Archive,
  Mail,
  Copy,
} from "lucide-react";
import { TutorProfileModal } from "@/components/admin/modals/TutorProfileModal";
import { TutorContactModal } from "@/components/admin/modals/TutorContactModal";
import { Separator } from "@/components/ui/separator";

interface ParentContact {
    name: string;
    email: string;
    countryCode: string;
    phone: string;
}

const allSubjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));
const boardsList = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"];
const gradeLevelsList = [
    "Nursery", "LKG", "UKG",
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
    "Grade 11", "Grade 12",
    "College Level", "Adult Learner", "Other"
];

const fetchAssignableTutors = async (token: string | null, params: URLSearchParams): Promise<ApiTutor[]> => {
  if (!token) throw new Error("Authentication token not found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  
  // Create a new URLSearchParams object to avoid modifying the original
  const fetchParams = new URLSearchParams(params.toString());

  // If no specific filters are applied, don't pass any to the API
  if (fetchParams.toString() === "") {
    // This logic ensures that if we call with no filters, we don't send empty params
  }

  const response = await fetch(`${apiBaseUrl}/api/search/tutors?${fetchParams.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
  });
  if (!response.ok) throw new Error("Failed to fetch tutors.");
  const data = await response.json();
    return data.map((tutor: any) => ({
    ...tutor,
    isVerified: tutor.isVerified || false,
  }));
};

const fetchAdminEnquiryDetails = async (enquiryId: string, token: string | null): Promise<TuitionRequirement> => {
  if (!token) throw new Error("Authentication token is required.");
  if (!enquiryId) throw new Error("Enquiry ID is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/enquiry/details/${enquiryId}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
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
    parentEmail: data.email,
    parentPhone: data.phone,
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
    status: data.enquirySummary.status?.toLowerCase() || 'open',
    postedAt: data.enquirySummary.createdOn,
    applicantsCount: data.enquirySummary.assignedTutors,
    createdBy: data.createdBy,
  };
};

const updateEnquiry = async ({ enquiryId, token, formData }: { enquiryId: string, token: string | null, formData: AdminEnquiryEditFormValues }) => {
  if (!token) throw new Error("Authentication token is required.");
  
  const locationDetails = formData.location;
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

  if (!response.ok) { throw new Error("Failed to update enquiry."); }
  return response.json();
};

const addNoteToEnquiry = async ({ enquiryId, token, note }: { enquiryId: string, token: string | null, note: string }) => {
  if (!token) throw new Error("Authentication token is required.");
  if (!enquiryId) throw new Error("Enquiry ID is required.");
  if (!note) throw new Error("Note content cannot be empty.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/enquiry/notes`, {
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'TZ-ENQ-ID': enquiryId, 'accept': '*/*' },
    body: JSON.stringify({ message: note }),
  });

  if (!response.ok) { throw new Error("Failed to add note to the enquiry."); }
  return response.json();
};

const updateEnquiryStatus = async ({ enquiryId, token, status, remark }: { enquiryId: string, token: string | null, status: string, remark?: string }) => {
  if (!token) throw new Error("Authentication token is required.");
  if (!status) throw new Error("Status is required.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/admin/enquiry/status?status=${status.toUpperCase()}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'TZ-ENQ-ID': enquiryId,
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify({ message: remark }),
  });

  if (!response.ok) { throw new Error("Failed to update enquiry status."); }
  return response.json();
};

const fetchParentContact = async (enquiryId: string, token: string | null): Promise<ParentContact> => {
    if (!token) throw new Error("Authentication token not found.");
    if (!enquiryId) throw new Error("Enquiry ID is required.");

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(`${apiBaseUrl}/api/enquiry/contact/${enquiryId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
    });

    if (!response.ok) throw new Error("Failed to fetch parent contact details.");
    
    return response.json();
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


function ManageEnquiryContent() {
  const params = useParams();
  const router = useRouter();
  const enquiryId = params.enquiryId as string;
  const { token } = useAuthMock();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedTutor, setSelectedTutor] = useState<ApiTutor | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddNotesModalOpen, setIsAddNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isParentInfoModalOpen, setIsParentInfoModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statusRemark, setStatusRemark] = useState("");
  const [isTutorQueryEnabled, setIsTutorQueryEnabled] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { data: enquiry, isLoading: isLoadingEnquiry, error: enquiryError } = useQuery({
    queryKey: ['adminEnquiryDetails', enquiryId],
    queryFn: () => fetchAdminEnquiryDetails(enquiryId, token),
    enabled: !!enquiryId && !!token,
    refetchOnWindowFocus: false,
  });

  const parentContactQuery = useQuery({
    queryKey: ['parentContact', enquiryId],
    queryFn: () => fetchParentContact(enquiryId, token),
    enabled: isParentInfoModalOpen, // Only fetch when the modal is open
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });


  const getInitialFilters = useCallback(() => {
    if (!enquiry) return { subjects: [], grade: '', board: '', isOnline: false, isOffline: false, city: "", area: "" };
    const location = (typeof enquiry.location === 'object' && enquiry.location) ? enquiry.location : { city: "", area: "" };
    return {
      subjects: enquiry.subject || [],
      grade: enquiry.gradeLevel || '',
      board: enquiry.board || '',
      isOnline: enquiry.teachingMode?.includes("Online") || false,
      isOffline: enquiry.teachingMode?.includes("Offline (In-person)") || false,
      city: location.city || "",
      area: location.area || "",
    };
  }, [enquiry]);

  const [filters, setFilters] = useState(getInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState(getInitialFilters);

  useEffect(() => {
      const initial = getInitialFilters();
      setFilters(initial);
      setAppliedFilters(initial);
  }, [getInitialFilters]);
  
  const stringifiedFilters = useMemo(() => JSON.stringify(appliedFilters), [appliedFilters]);

  const allTutorsQuery = useQuery<ApiTutor[]>({
    queryKey: ['assignableTutors', enquiryId, stringifiedFilters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (appliedFilters.subjects?.length > 0) params.append('subjects', appliedFilters.subjects.join(','));
      if (appliedFilters.grade) params.append('grades', appliedFilters.grade);
      if (appliedFilters.board) params.append('boards', appliedFilters.board);
      if (appliedFilters.isOnline) params.append('isOnline', 'true');
      if (appliedFilters.isOffline) params.append('isOffline', 'true');
      if (appliedFilters.city) params.append('location', appliedFilters.city);
      if (appliedFilters.area) params.append('location', `${appliedFilters.area}, ${appliedFilters.city}`);
      return fetchAssignableTutors(token, params);
    },
    enabled: isTutorQueryEnabled, 
    refetchOnWindowFocus: false,
  });

  const { data: allTutorsData = [], isLoading: isLoadingAllTutors, error: allTutorsError } = allTutorsQuery;

  const uniqueCities = useMemo(() => {
    if (!allTutorsData) return [];
    return Array.from(new Set(allTutorsData.map(tutor => tutor.city).filter(Boolean))).sort();
  }, [allTutorsData]);

  const uniqueAreasInCity = useMemo(() => {
    if (!filters.city || !allTutorsData) return [];
    return Array.from(new Set(allTutorsData.filter(tutor => tutor.city === filters.city).map(tutor => tutor.area).filter(Boolean))).sort();
  }, [allTutorsData, filters.city]);
  
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setIsFilterModalOpen(false);
  };
  
  const handleClearFilters = () => {
    const clearedFilters = { subjects: [], grade: '', board: '', isOnline: false, isOffline: false, city: "", area: "" };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    setIsFilterModalOpen(false);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string | boolean | string[]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleCityChange = (city: string) => {
    setFilters(prev => ({ ...prev, city: city === 'all-cities' ? '' : city, area: '' }));
  };

  const handleAreaChange = (area: string) => {
      setFilters(prev => ({ ...prev, area: area === 'all-areas' ? '' : area }));
  };
  
  const updateMutation = useMutation({
    mutationFn: (formData: AdminEnquiryEditFormValues) => updateEnquiry({ enquiryId, token, formData }),
    onSuccess: () => {
      toast({ title: "Enquiry Updated!", description: "The requirement has been successfully updated." });
      queryClient.invalidateQueries({ queryKey: ['adminEnquiryDetails', enquiryId] });
      setIsEditModalOpen(false);
    },
    onError: (error: any) => toast({ variant: "destructive", title: "Update Failed", description: error.message }),
  });

  const addNoteMutation = useMutation({
    mutationFn: (note: string) => addNoteToEnquiry({ enquiryId, token, note }),
    onSuccess: () => {
      toast({ title: "Note Saved!", description: "The additional notes have been updated." });
      queryClient.invalidateQueries({ queryKey: ['adminEnquiryDetails', enquiryId] });
      setIsAddNotesModalOpen(false);
      setNotes("");
    },
    onError: (error: any) => toast({ variant: "destructive", title: "Failed to Save Note", description: error.message }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, remark }: { status: string, remark?: string }) => updateEnquiryStatus({ enquiryId, token, status, remark }),
    onSuccess: () => {
      toast({ title: "Status Updated", description: "The enquiry status has been updated." });
      queryClient.invalidateQueries({ queryKey: ['adminEnquiryDetails', enquiryId] });
      setIsStatusModalOpen(false);
      setStatusRemark("");
    },
    onError: (error: any) => toast({ variant: "destructive", title: "Status Update Failed", description: error.message }),
  });
  
  const handleViewProfile = (tutor: ApiTutor) => {
    setSelectedTutor(tutor);
    setIsProfileModalOpen(true);
  }
  
  const handleContactTutor = (tutor: ApiTutor) => {
    setSelectedTutor(tutor);
    setIsContactModalOpen(true);
  }
  
  const handleOpenNotesModal = () => {
    setNotes(enquiry?.additionalNotes || "");
    setIsAddNotesModalOpen(true);
  };

  const handleSaveNotes = () => {
    if (!notes.trim()) {
      toast({ variant: "destructive", title: "Note is empty", description: "Please enter a note to save." });
      return;
    }
    addNoteMutation.mutate(notes);
  };

  const handleOpenStatusModal = () => {
    setSelectedStatus(enquiry?.status || null);
    setStatusRemark("");
    setIsStatusModalOpen(true);
  }

  const handleConfirmStatusChange = () => {
    if (!selectedStatus) {
      toast({ variant: "destructive", title: "No Status Selected", description: "Please choose a new status." });
      return;
    }
    updateStatusMutation.mutate({ status: selectedStatus, remark: statusRemark });
  }

  const handleCopyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied to Clipboard", description: `${fieldName} has been copied.` });
    }, (err) => {
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy text." });
    });
  };
  
  if (isLoadingEnquiry) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (enquiryError) {
      return <div className="text-center py-10 text-destructive">Error loading enquiry details: {(enquiryError as Error).message}</div>
  }
  
  if (!enquiry) {
      return <div className="text-center py-10 text-muted-foreground">Enquiry not found.</div>
  }

  const renderTutorTable = (tutors: ApiTutor[], isLoading: boolean, error: Error | null) => (
    <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
            <TooltipProvider>
                <Table>
                    <TableHeader><TableRow><TableHead>Tutor</TableHead><TableHead>Subjects</TableHead><TableHead>Mode</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {isLoading ? ([...Array(5)].map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-10 w-48" /></TableCell><TableCell><Skeleton className="h-6 w-32" /></TableCell><TableCell><Skeleton className="h-6 w-24" /></TableCell><TableCell><Skeleton className="h-6 w-20" /></TableCell><TableCell><Skeleton className="h-8 w-20 rounded-md" /></TableCell></TableRow>))) 
                        : error ? (<TableRow><TableCell colSpan={5} className="text-center text-destructive">Failed to load tutors.</TableCell></TableRow>) 
                        : !tutors || tutors.length === 0 ? (<TableRow><TableCell colSpan={5} className="text-center py-8">No tutors found.</TableCell></TableRow>) 
                        : (tutors.map(tutor => (
                            <TableRow key={tutor.id}>
                                <TableCell><div><div className="font-medium text-foreground">{tutor.displayName}</div><div className="text-xs text-muted-foreground">{tutor.area}, {tutor.city}</div></div></TableCell>
                                <TableCell className="text-xs">{tutor.subjectsList.join(', ')}</TableCell>
                                <TableCell><div className="flex items-center gap-2">{tutor.online && <Tooltip><TooltipTrigger asChild><div className="p-1.5 bg-primary/10 rounded-full"><RadioTower className="w-4 h-4 text-primary" /></div></TooltipTrigger><TooltipContent><p>Online</p></TooltipContent></Tooltip>}{tutor.offline && <Tooltip><TooltipTrigger asChild><div className="p-1.5 bg-primary/10 rounded-full"><Users className="w-4 h-4 text-primary" /></div></TooltipTrigger><TooltipContent><p>Offline</p></TooltipContent></Tooltip>}</div></TableCell>
                                <TableCell><div className="flex items-center gap-2"><Tooltip><TooltipTrigger>{tutor.isActive ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}</TooltipTrigger><TooltipContent><p>{tutor.isActive ? "Active" : "Inactive"}</p></TooltipContent></Tooltip><Tooltip><TooltipTrigger>{tutor.isVerified ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldAlert className="h-4 w-4 text-yellow-500" />}</TooltipTrigger><TooltipContent><p>{tutor.isVerified ? "Verified" : "Not Verified"}</p></TooltipContent></Tooltip></div></TableCell>
                                <TableCell><div className="flex items-center gap-1.5"><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleViewProfile(tutor)}><Eye className="w-4 h-4" /></Button><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleContactTutor(tutor)}><Phone className="w-4 h-4" /></Button></div></TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </TooltipProvider>
        </CardContent>
    </Card>
  );

  const renderPlaceholderTable = (title: string, count: number) => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {title} ({count})
      </h3>
      <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Tutor</TableHead><TableHead>Subjects</TableHead><TableHead>Mode</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No {title.toLowerCase()} found for this enquiry yet.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderRecommendedTutorContent = () => {
    if (!isTutorQueryEnabled) {
      return (
        <div className="text-center p-8">
          <Button onClick={() => setIsTutorQueryEnabled(true)}>
            <Search className="mr-2 h-4 w-4" />
            Find Recommended Tutors
          </Button>
        </div>
      );
    }
  
    if (isLoadingAllTutors) {
      return (
        <div className="text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-2">Searching for tutors...</p>
        </div>
      );
    }
  
    if (allTutorsError) {
      return (
        <div className="text-center p-8 text-destructive">
          <p>Failed to load tutors: {(allTutorsError as Error).message}</p>
        </div>
      );
    }
  
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Recommended Tutors ({allTutorsData.length})
          </h3>
          <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Filter Tutors</DialogTitle>
                <DialogDescription>
                  Refine the list of tutors based on specific criteria.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="subjects-filter-modal">Subjects</Label>
                  <MultiSelectCommand
                    options={allSubjectsList}
                    selectedValues={filters.subjects || []}
                    onValueChange={(value) => handleFilterChange('subjects', value)}
                    placeholder="Select subjects..."
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade-filter-modal">Grade</Label>
                  <Select onValueChange={(value) => handleFilterChange('grade', value)} value={filters.grade}>
                    <SelectTrigger id="grade-filter-modal">
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeLevelsList.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="board-filter-modal">Board</Label>
                  <Select onValueChange={(value) => handleFilterChange('board', value)} value={filters.board}>
                    <SelectTrigger id="board-filter-modal">
                      <SelectValue placeholder="Select Board" />
                    </SelectTrigger>
                    <SelectContent>
                      {boardsList.map(board => (
                        <SelectItem key={board} value={board}>{board}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city-filter-modal">City</Label>
                  <Select onValueChange={handleCityChange} value={filters.city}>
                    <SelectTrigger id="city-filter-modal">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-cities">All Cities</SelectItem>
                      {uniqueCities.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area-filter-modal">Area</Label>
                  <Select onValueChange={handleAreaChange} value={filters.area} disabled={!filters.city}>
                    <SelectTrigger id="area-filter-modal">
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-areas">All Areas</SelectItem>
                      {uniqueAreasInCity.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-4 pt-5 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="online-filter-modal" checked={filters.isOnline} onCheckedChange={(checked) => handleFilterChange('isOnline', !!checked)} />
                    <Label htmlFor="online-filter-modal" className="font-medium">Online</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="offline-filter-modal" checked={filters.isOffline} onCheckedChange={(checked) => handleFilterChange('isOffline', !!checked)} />
                    <Label htmlFor="offline-filter-modal" className="font-medium">Offline</Label>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:justify-between">
                <Button type="button" variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
                <Button type="button" onClick={handleApplyFilters}>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {renderTutorTable(allTutorsData, isLoadingAllTutors, allTutorsError)}
      </div>
    );
  };

  const locationInfo = typeof enquiry.location === 'object' && enquiry.location ? enquiry.location : null;
  const hasScheduleInfo = enquiry ? ((enquiry.preferredDays && enquiry.preferredDays.length > 0) || (enquiry.preferredTimeSlots && enquiry.preferredTimeSlots.length > 0)) : false;

  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg border-0">
        <CardHeader className="p-4 sm:p-5 relative">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-4 flex-grow pr-12">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 shrink-0 hidden sm:flex">
                    <AvatarFallback className="text-base bg-primary/10 text-primary font-bold">
                      {enquiry.createdBy === 'PARENT' ? 'P' : enquiry.createdBy === 'ADMIN' ? 'A' : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-xl font-semibold text-primary">
                        {Array.isArray(enquiry.subject) ? enquiry.subject.join(', ') : enquiry.subject}
                        </CardTitle>
                        <Badge variant="default" className="text-xs">
                            {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-2 pt-2">
                          <CardDescription className="text-sm text-foreground/80 flex items-center gap-1.5">
                              <UsersRound className="w-4 h-4"/> {enquiry.studentName}
                          </CardDescription>
                          <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                              <Clock className="w-3.5 h-3.5" /> 
                              Posted on {format(parseISO(enquiry.postedAt), "MMM d, yyyy")}
                          </CardDescription>
                          <div className="flex flex-col gap-2 pt-2 text-xs text-muted-foreground">
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                    <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-primary/80"/>{enquiry.gradeLevel}</span>
                                    {enquiry.board && <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-primary/80"/>{enquiry.board}</span>}
                                    <span className="flex items-center gap-1.5"><RadioTower className="w-3.5 h-3.5 text-primary/80"/>{enquiry.teachingMode?.join(', ')}</span>
                                </div>
                                {enquiry.teachingMode?.includes("Offline (In-person)") && locationInfo?.address && (
                                    <div className="flex items-center gap-1.5 pt-1">
                                        <MapPin className="w-3.5 h-3.5 text-primary/80 shrink-0"/>
                                        {locationInfo.googleMapsUrl ? (
                                            <a href={locationInfo.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline line-clamp-1">
                                                {locationInfo.address}
                                            </a>
                                        ) : (
                                            <span className="line-clamp-1">{locationInfo.address}</span>
                                        )}
                                    </div>
                                )}
                          </div>
                      </div>
                  </div>
              </div>
               <div className="absolute top-4 right-4 hidden sm:block">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 shrink-0">
                    <AvatarFallback className="text-base bg-primary/10 text-primary font-bold">
                      {enquiry.createdBy === 'PARENT' ? 'P' : enquiry.createdBy === 'ADMIN' ? 'A' : '?'}
                    </AvatarFallback>
                  </Avatar>
                </div>
            </div>
            <div className="sm:hidden mt-4 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {enquiry.status === "open" && (
                  <Button variant="primary-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={() => updateStatusMutation.mutate({ status: "accepted" })}>
                    <CheckSquare className="mr-1.5 h-3.5 w-3.5" /> Accept
                  </Button>
                )}
                {enquiry.status !== "closed" && (
                    <Button variant="destructive-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={handleOpenStatusModal}>
                        <XCircle className="mr-1.5 h-3.5 w-3.5" /> Close
                    </Button>
                )}
                {enquiry.status === "closed" && (
                    <Button variant="primary-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={() => updateStatusMutation.mutate({ status: "reopened" })}>
                        <Archive className="mr-1.5 h-3.5 w-3.5" /> Reopen
                    </Button>
                )}
            </div>
        </CardHeader>
        <CardFooter className="flex flex-wrap justify-between gap-2 p-4 sm:p-5 border-t">
           <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsParentInfoModalOpen(true)}><User className="mr-1.5 h-3.5 w-3.5"/>Parent</Button>
            <Button variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsDetailsModalOpen(true)}><CalendarDays className="mr-1.5 h-3.5 w-3.5" />Preferences</Button>
            <Button variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsEditModalOpen(true)}><Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
            <Button variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto" onClick={handleOpenNotesModal}><ClipboardEdit className="mr-1.5 h-3.5 w-3.5" /> Notes</Button>
           </div>
           <div className="hidden sm:flex sm:flex-row gap-2 w-full sm:w-auto justify-end">
                {enquiry.status === "open" && (
                  <Button variant="primary-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={() => updateStatusMutation.mutate({ status: "accepted" })}>
                    <CheckSquare className="mr-1.5 h-3.5 w-3.5" /> Accept
                  </Button>
                )}
                {enquiry.status !== "closed" && (
                    <Button variant="destructive-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={handleOpenStatusModal}>
                        <XCircle className="mr-1.5 h-3.5 w-3.5" /> Close
                    </Button>
                )}
                {enquiry.status === "closed" && (
                    <Button variant="primary-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={() => updateStatusMutation.mutate({ status: "reopened" })}>
                        <Archive className="mr-1.5 h-3.5 w-3.5" /> Reopen
                    </Button>
                )}
              </div>
        </CardFooter>
      </Card>
      
      {renderPlaceholderTable("Assigned Tutors", 0)}
      {renderPlaceholderTable("Applied Tutors", 0)}
      {renderPlaceholderTable("Shortlisted Tutors", 0)}

      <div className="mt-6">
        {renderRecommendedTutorContent()}
      </div>
      
       {selectedTutor && <TutorProfileModal isOpen={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} tutor={selectedTutor} />}
       {selectedTutor && <TutorContactModal isOpen={isContactModalOpen} onOpenChange={setIsContactModalOpen} tutor={selectedTutor} />}
        {enquiry && (
            <AdminEnquiryModal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} enquiryData={enquiry} onUpdateEnquiry={updateMutation.mutate} isUpdating={updateMutation.isPending}/>
        )}
        <Dialog open={isAddNotesModalOpen} onOpenChange={setIsAddNotesModalOpen}>
            <DialogContent className="sm:max-w-md bg-card">
              <DialogHeader>
                <DialogTitle>Add Additional Notes</DialogTitle>
                <DialogDescription>
                  These notes will be visible to tutors viewing the enquiry details. Add any special instructions or requirements.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="e.g., Student requires special attention for calculus, focus on exam preparation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                  disabled={addNoteMutation.isPending}
                />
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleSaveNotes} disabled={!notes.trim() || addNoteMutation.isPending}>
                  {addNoteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Note
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-xl bg-card">
              <DialogHeader className="p-6 pb-4">
                  <DialogTitle className="text-xl font-semibold text-primary">Preferences & Notes</DialogTitle>
                  <DialogDescription>
                      Scheduling preferences and additional notes for this enquiry.
                  </DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-6 pt-0 space-y-5">
                {hasScheduleInfo && (
                  <section className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground flex items-center">
                          <CalendarDays className="w-4 h-4 mr-2 text-primary/80" />
                          Schedule Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                          {enquiry.preferredDays && enquiry.preferredDays.length > 0 && (
                          <EnquiryInfoItem label="Preferred Days" value={enquiry.preferredDays.join(', ')} icon={CalendarDays} />
                          )}
                          {enquiry.preferredTimeSlots && enquiry.preferredTimeSlots.length > 0 && (
                          <EnquiryInfoItem label="Preferred Time" value={enquiry.preferredTimeSlots.join(', ')} icon={Clock} />
                          )}
                      </div>
                  </section>
                )}

                {enquiry.additionalNotes && (
                   <>
                    {hasScheduleInfo && <Separator />}
                    <section className="space-y-3">
                        <h3 className="text-base font-semibold text-foreground flex items-center">
                            <Info className="w-4 h-4 mr-2 text-primary/80" />
                            Additional Notes
                        </h3>
                        <p className="text-sm text-foreground/80 leading-relaxed pl-6">{enquiry.additionalNotes}</p>
                    </section>
                   </>
                )}
                {!hasScheduleInfo && !enquiry.additionalNotes && (
                    <p className="text-center text-sm text-muted-foreground py-8">No specific preferences or notes were provided for this enquiry.</p>
                )}
              </div>
              </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isParentInfoModalOpen} onOpenChange={setIsParentInfoModalOpen}>
            <DialogContent className="sm:max-w-md bg-card">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle>Parent Information</DialogTitle>
                    <DialogDescription>
                        Contact details for the parent who posted this enquiry.
                    </DialogDescription>
                </DialogHeader>
                {parentContactQuery.isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : parentContactQuery.error ? (
                    <div className="text-center text-destructive">
                        <p>Failed to load contact details.</p>
                        <p className="text-xs">{(parentContactQuery.error as Error).message}</p>
                    </div>
                ) : parentContactQuery.data ? (
                    <div className="space-y-4 py-4 px-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-secondary rounded-full">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Name</Label>
                                    <p className="font-medium text-foreground">{parentContactQuery.data.name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-secondary rounded-full">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Email</Label>
                                    <p className="font-medium text-foreground">{parentContactQuery.data.email}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyToClipboard(parentContactQuery.data!.email, 'Email')}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="p-2 bg-secondary rounded-full">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Phone</Label>
                                    <p className="font-medium text-foreground">{parentContactQuery.data.countryCode} {parentContactQuery.data.phone}</p>
                                </div>
                            </div>
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyToClipboard(`${parentContactQuery.data!.countryCode} ${parentContactQuery.data!.phone}`, 'Phone number')}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    </div>
  );
}

export default function ManageEnquiryPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <ManageEnquiryContent />
        </Suspense>
    )
}
