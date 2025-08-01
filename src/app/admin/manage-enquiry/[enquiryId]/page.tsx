
"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import type { ApiTutor, TuitionRequirement, LocationDetails } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_TUTOR_PROFILES } from "@/lib/mock-data";

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
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { AdminEnquiryModal, type AdminEnquiryEditFormValues } from "@/components/admin/modals/AdminEnquiryModal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  DollarSign,
  Building,
  CheckSquare,
  ShieldCheck,
  Mail,
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
} from "lucide-react";
import { TutorProfileModal } from "@/components/admin/modals/TutorProfileModal";
import { TutorContactModal } from "@/components/admin/modals/TutorContactModal";
import { Separator } from "@/components/ui/separator";

const allSubjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));
const boardsList = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"];
const gradeLevelsList = [
    "Nursery", "LKG", "UKG",
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
    "Grade 11", "Grade 12",
    "College Level", "Adult Learner", "Other"
];

const closeReasons = [
    { id: 'found-tutorzila', label: "Found a tutor on Tutorzila" },
    { id: 'found-elsewhere', label: "Found a tutor elsewhere" },
    { id: 'no-longer-needed', label: "Don't need a tutor anymore" },
    { id: 'other', label: "Other" }
];


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

const fetchAssignableTutors = async (token: string | null, params: URLSearchParams): Promise<ApiTutor[]> => {
  // Mock implementation, replace with actual API call if needed
  console.log("Mock fetching assignable tutors with params:", params.toString());
  return MOCK_TUTOR_PROFILES.map(t => ({
      ...t,
      id: t.id,
      displayName: t.name,
      subjects: Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects,
      hourlyRate: parseFloat(t.hourlyRate || '0'),
      bio: t.bio || "",
      qualification: t.qualifications ? t.qualifications.join(", ") : "",
      experienceYears: t.experience,
      availabilityDays: t.preferredDays ? t.preferredDays.join(", ") : "",
      availabilityTime: t.preferredTimeSlots ? t.preferredTimeSlots.join(", ") : "",
      addressName: "",
      address: t.location || "",
      city: t.location || "",
      state: "",
      area: "",
      pincode: "",
      country: "",
      googleMapsLink: "",
      languages: "",
      grades: Array.isArray(t.gradeLevelsTaught) ? t.gradeLevelsTaught.join(", ") : "",
      boards: Array.isArray(t.boardsTaught) ? t.boardsTaught.join(", ") : "",
      documentsUrl: "",
      profileCompletion: 80,
      isVerified: true,
      isActive: t.status === 'Active',
      isHybrid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBioReviewed: true,
      subjectsList: Array.isArray(t.subjects) ? t.subjects : [t.subjects],
      availabilityDaysList: t.preferredDays || [],
      availabilityTimeList: t.preferredTimeSlots || [],
      languagesList: [],
      gradesList: t.gradeLevelsTaught || [],
      boardsList: t.boardsTaught || [],
      qualificationList: t.qualifications || [],
      online: t.teachingMode?.includes("Online") || false,
      offline: t.teachingMode?.includes("Offline (In-person)") || false,
  }));
};

const fetchAssignedTutors = async (token: string | null, enquiryId: string): Promise<ApiTutor[]> => {
    // Mock implementation, replace with actual API call if needed
    console.log(`Mock fetching assigned tutors for enquiry: ${enquiryId}`);
    const allTutors = MOCK_TUTOR_PROFILES.slice(0, 2).map(t => ({ // Return first 2 as assigned
      ...t,
      id: t.id,
      displayName: t.name,
      subjects: Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects,
      hourlyRate: parseFloat(t.hourlyRate || '0'),
      bio: t.bio || "",
      qualification: t.qualifications ? t.qualifications.join(", ") : "",
      experienceYears: t.experience,
      availabilityDays: t.preferredDays ? t.preferredDays.join(", ") : "",
      availabilityTime: t.preferredTimeSlots ? t.preferredTimeSlots.join(", ") : "",
      addressName: "",
      address: t.location || "",
      city: t.location || "",
      state: "",
      area: "",
      pincode: "",
      country: "",
      googleMapsLink: "",
      languages: "",
      grades: Array.isArray(t.gradeLevelsTaught) ? t.gradeLevelsTaught.join(", ") : "",
      boards: Array.isArray(t.boardsTaught) ? t.boardsTaught.join(", ") : "",
      documentsUrl: "",
      profileCompletion: 80,
      isVerified: true,
      isActive: t.status === 'Active',
      isHybrid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBioReviewed: true,
      subjectsList: Array.isArray(t.subjects) ? t.subjects : [t.subjects],
      availabilityDaysList: t.preferredDays || [],
      availabilityTimeList: t.preferredTimeSlots || [],
      languagesList: [],
      gradesList: t.gradeLevelsTaught || [],
      boardsList: t.boardsTaught || [],
      qualificationList: t.qualifications || [],
      online: t.teachingMode?.includes("Online") || false,
      offline: t.teachingMode?.includes("Offline (In-person)") || false,
    }));
    return Promise.resolve(allTutors);
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

const closeEnquiry = async ({ enquiryId, token, reason }: { enquiryId: string, token: string | null, reason: string }) => {
  if (!token) throw new Error("Authentication token is required.");
  if (!enquiryId) throw new Error("Enquiry ID is required.");
  if (!reason) throw new Error("A reason for closing is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/enquiry/close`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'TZ-ENQ-ID': enquiryId, 'accept': '*/*' },
    body: JSON.stringify({ message: reason }),
  });

  if (!response.ok) { throw new Error("Failed to close enquiry."); }
  return true;
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

  // State for modals and UI
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<ApiTutor | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recommended");
  const [isCloseEnquiryModalOpen, setIsCloseEnquiryModalOpen] = useState(false);
  const [closeReason, setCloseReason] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddNotesModalOpen, setIsAddNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const { data: enquiry, isLoading: isLoadingEnquiry, error: enquiryError } = useQuery({
    queryKey: ['adminEnquiryDetails', enquiryId],
    queryFn: () => fetchAdminEnquiryDetails(enquiryId, token),
    enabled: !!enquiryId && !!token,
    refetchOnWindowFocus: false,
  });

  const getInitialFilters = useCallback(() => ({
    subjects: enquiry?.subject || [],
    grade: enquiry?.gradeLevel || '',
    board: enquiry?.board || '',
    isOnline: enquiry?.teachingMode?.includes("Online") || false,
    isOffline: enquiry?.teachingMode?.includes("Offline (In-person)") || false,
    city: enquiry?.location?.city || "",
    area: enquiry?.location?.area || "",
  }), [enquiry]);

  const [filters, setFilters] = useState(getInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState(getInitialFilters);
  
  useEffect(() => {
    if(enquiry){
      setFilters(getInitialFilters());
      setAppliedFilters(getInitialFilters());
    }
  }, [enquiry, getInitialFilters]);
  
  const updateMutation = useMutation({
    mutationFn: (formData: AdminEnquiryEditFormValues) => updateEnquiry({ enquiryId, token, formData }),
    onSuccess: () => {
      toast({ title: "Enquiry Updated!", description: "The requirement has been successfully updated." });
      queryClient.invalidateQueries({ queryKey: ['adminEnquiryDetails', enquiryId] });
      setIsEditModalOpen(false);
    },
    onError: (error) => toast({ variant: "destructive", title: "Update Failed", description: error.message }),
  });

  const closeEnquiryMutation = useMutation({
    mutationFn: (reason: string) => closeEnquiry({ enquiryId, token, reason }),
    onSuccess: () => {
      toast({ title: "Enquiry Closed", description: `The requirement has been successfully closed.` });
      queryClient.invalidateQueries({ queryKey: ['adminEnquiryDetails', enquiryId] });
      setIsCloseEnquiryModalOpen(false);
    },
    onError: (error) => toast({ variant: "destructive", title: "Failed to Close Enquiry", description: error.message }),
  });

  const addNoteMutation = useMutation({
    mutationFn: (note: string) => addNoteToEnquiry({ enquiryId, token, note }),
    onSuccess: () => {
      toast({ title: "Note Saved!", description: "The additional notes have been updated." });
      queryClient.invalidateQueries({ queryKey: ['adminEnquiryDetails', enquiryId] });
      setIsAddNotesModalOpen(false);
      setNotes("");
    },
    onError: (error) => toast({ variant: "destructive", title: "Failed to Save Note", description: error.message }),
  });
  
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
  
  const handleFilterChange = (key: keyof typeof filters, value: string | boolean | string[]) => setFilters(prev => ({ ...prev, [key]: value }));
  const handleCityChange = (city: string) => setFilters(prev => ({ ...prev, city: city === 'all-cities' ? '' : city, area: '' }));
  const handleAreaChange = (area: string) => setFilters(prev => ({ ...prev, area: area === 'all-areas' ? '' : area }));

  const handleViewProfile = (tutor: ApiTutor) => {
    setSelectedTutor(tutor);
    setIsProfileModalOpen(true);
  }
  
  const handleContactTutor = (tutor: ApiTutor) => {
    setSelectedTutor(tutor);
    setIsContactModalOpen(true);
  }

  const handleOpenCloseEnquiryModal = () => {
    setCloseReason(null);
    setIsCloseEnquiryModalOpen(true);
  };
  
  const handleOpenNotesModal = () => {
    setNotes(enquiry?.additionalNotes || "");
    setIsAddNotesModalOpen(true);
  };

  const handleCloseEnquiryDialogAction = () => {
    if (!closeReason) {
      toast({ variant: "destructive", title: "Reason Required", description: "Please select a reason for closing the enquiry." });
      return;
    }
    closeEnquiryMutation.mutate(closeReason);
  };

  const handleSaveNotes = () => {
    if (!notes.trim()) {
      toast({ variant: "destructive", title: "Note is empty", description: "Please enter a note to save." });
      return;
    }
    addNoteMutation.mutate(notes);
  };
  
  const tutorSearchParams = useMemo(() => {
    const params = new URLSearchParams();
    if(appliedFilters.subjects.length > 0) params.append('subjects', appliedFilters.subjects.join(','));
    if(appliedFilters.grade) params.append('grades', appliedFilters.grade);
    if(appliedFilters.board) params.append('boards', appliedFilters.board);
    if(appliedFilters.isOnline) params.append('isOnline', 'true');
    if(appliedFilters.isOffline) params.append('isOffline', 'true');
    if(appliedFilters.city) params.append('location', appliedFilters.city);
    if(appliedFilters.area) params.append('location', `${appliedFilters.area}, ${appliedFilters.city}`);
    return params;
  }, [appliedFilters]);

  const { data: allTutorsData, isLoading: isLoadingTutors, error: tutorsError } = useQuery<ApiTutor[]>({
      queryKey: ['allTutorsForFilter', enquiryId],
      queryFn: () => fetchAssignableTutors(token, tutorSearchParams),
      enabled: !!token,
      staleTime: Infinity,
  });

  const uniqueCities = useMemo(() => Array.from(new Set(allTutorsData?.map(tutor => tutor.city).filter(Boolean))).sort(), [allTutorsData]);
  const uniqueAreasInCity = useMemo(() => {
    if (!filters.city || !allTutorsData) return [];
    return Array.from(new Set(allTutorsData.filter(tutor => tutor.city === filters.city).map(tutor => tutor.area).filter(Boolean))).sort();
  }, [allTutorsData, filters.city]);
  
  const { data: assignedTutors, isLoading: isLoadingAssigned } = useQuery({
      queryKey: ["assignedTutors", enquiryId, token],
      queryFn: () => fetchAssignedTutors(token, enquiryId),
      enabled: !!token && activeTab === "assigned",
  });
  
  const { data: recommendedTutors, isLoading: isLoadingRecommended } = useQuery({
      queryKey: ["recommendedTutors", enquiryId, tutorSearchParams.toString()],
      queryFn: () => fetchAssignableTutors(token, tutorSearchParams),
      enabled: !!token && activeTab === "recommended",
  });

  const { data: appliedTutors, isLoading: isLoadingApplied } = useQuery({
      queryKey: ["appliedTutors", enquiryId, token],
      queryFn: () => fetchAssignableTutors(token, new URLSearchParams()), // Replace with actual applied tutors fetch logic
      enabled: !!token && activeTab === "applied",
  });

  const { data: shortlistedTutors, isLoading: isLoadingShortlisted } = useQuery({
      queryKey: ["shortlistedTutors", enquiryId, token],
      queryFn: () => fetchAssignableTutors(token, new URLSearchParams()), // Replace with actual shortlisted tutors fetch logic
      enabled: !!token && activeTab === "shortlisted",
  });
  
  if (isLoadingEnquiry) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (enquiryError) {
      return <div className="text-center py-10 text-destructive">Error loading enquiry details: {enquiryError.message}</div>
  }

  const renderTutorTable = (tutors: ApiTutor[] | undefined, isLoading: boolean, error: Error | null) => (
    <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
      <CardContent className="p-0">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tutor</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow><TableCell colSpan={5} className="text-center text-destructive">Failed to load tutors.</TableCell></TableRow>
              ) : !tutors || tutors.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center">No tutors found for this category.</TableCell></TableRow>
              ) : (
                tutors.map(tutor => (
                  <TableRow key={tutor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{tutor.displayName}</div>
                        <div className="text-xs text-muted-foreground">{tutor.area}, {tutor.city}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{tutor.subjectsList.join(', ')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tutor.online && <Tooltip><TooltipTrigger asChild><div className="p-1.5 bg-primary/10 rounded-full"><RadioTower className="w-4 h-4 text-primary" /></div></TooltipTrigger><TooltipContent><p>Online</p></TooltipContent></Tooltip>}
                        {tutor.offline && <Tooltip><TooltipTrigger asChild><div className="p-1.5 bg-primary/10 rounded-full"><Users className="w-4 h-4 text-primary" /></div></TooltipTrigger><TooltipContent><p>Offline</p></TooltipContent></Tooltip>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tooltip><TooltipTrigger>{tutor.isActive ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}</TooltipTrigger><TooltipContent><p>{tutor.isActive ? "Active" : "Inactive"}</p></TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger>{tutor.isVerified ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldAlert className="h-4 w-4 text-yellow-500" />}</TooltipTrigger><TooltipContent><p>{tutor.isVerified ? "Verified" : "Not Verified"}</p></TooltipContent></Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleViewProfile(tutor)}><Eye className="w-4 h-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleContactTutor(tutor)}><Phone className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TooltipProvider>
      </CardContent>
    </Card>
  );

  const locationInfo = enquiry ? (typeof enquiry.location === 'object' && enquiry.location ? enquiry.location : null) : null;
  const hasLocationInfo = !!(locationInfo?.address && locationInfo.address.trim() !== '');
  const hasScheduleInfo = enquiry ? ((enquiry.preferredDays && enquiry.preferredDays.length > 0) || (enquiry.preferredTimeSlots && enquiry.preferredTimeSlots.length > 0)) : false;

  return (
    <div className="space-y-6">
      {enquiry && (
        <Card className="bg-card rounded-xl shadow-lg border-0">
          <CardHeader className="p-4 sm:p-5">
            <CardTitle className="text-xl font-semibold text-primary flex items-center justify-between">
              <span>{Array.isArray(enquiry.subject) ? enquiry.subject.join(', ') : enquiry.subject}</span>
               <Badge variant="default" className="text-xs">
                    {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
              </Badge>
            </CardTitle>
            <div className="space-y-2 pt-2">
                <CardDescription className="text-sm text-foreground/80 flex items-center gap-1.5">
                    <UsersRound className="w-4 h-4"/> {enquiry.studentName}
                </CardDescription>
                <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                    <Clock className="w-3.5 h-3.5" /> 
                    Posted on {format(parseISO(enquiry.postedAt), "MMM d, yyyy")}
                </CardDescription>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-primary/80"/>{enquiry.gradeLevel}</span>
                  <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-primary/80"/>{enquiry.board}</span>
                  <span className="flex items-center gap-1.5"><RadioTower className="w-3.5 h-3.5 text-primary/80"/>{enquiry.teachingMode?.join(', ')}</span>
                  {enquiry.teachingMode?.includes("Offline (In-person)") && locationInfo?.address && (
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary/80"/>{locationInfo.address}</span>
                  )}
                </div>
            </div>
          </CardHeader>
          <CardFooter className="flex flex-wrap justify-end gap-2 p-4 sm:p-5 border-t">
             <Button variant="outline" size="sm" onClick={() => setIsDetailsModalOpen(true)}><Eye className="mr-1.5 h-3.5 w-3.5" />View Full Details</Button>
             <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}><Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
             <Button variant="outline" size="sm" onClick={handleOpenNotesModal}><ClipboardEdit className="mr-1.5 h-3.5 w-3.5" /> Notes</Button>
             <Button variant="outline" size="sm" onClick={handleOpenCloseEnquiryModal}><XCircle className="mr-1.5 h-3.5 w-3.5" /> Close</Button>
          </CardFooter>
        </Card>
      )}

      <Card className="bg-card rounded-xl shadow-lg border-0">
        <CardHeader className="p-4 sm:p-5">
          <CardTitle className="text-xl font-semibold text-primary">Tutor List</CardTitle>
          <CardDescription>Recommended, applied, and assigned tutors for this enquiry.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-0">
          <Tabs defaultValue="recommended" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <ScrollArea className="w-full sm:w-auto">
                    <TabsList className="bg-transparent p-0 gap-2">
                        <TabsTrigger value="recommended" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-bold data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-primary data-[state=inactive]:text-primary data-[state=inactive]:hover:bg-primary data-[state=inactive]:hover:text-primary-foreground">Recommended ({recommendedTutors?.length || 0})</TabsTrigger>
                        <TabsTrigger value="applied" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-bold data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-primary data-[state=inactive]:text-primary data-[state=inactive]:hover:bg-primary data-[state=inactive]:hover:text-primary-foreground">Applied ({appliedTutors?.length || 0})</TabsTrigger>
                        <TabsTrigger value="shortlisted" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-bold data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-primary data-[state=inactive]:text-primary data-[state=inactive]:hover:bg-primary data-[state=inactive]:hover:text-primary-foreground">Shortlisted ({shortlistedTutors?.length || 0})</TabsTrigger>
                        <TabsTrigger value="assigned" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-bold data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-primary data-[state=inactive]:text-primary data-[state=inactive]:hover:bg-primary data-[state=inactive]:hover:text-primary-foreground">Assigned ({assignedTutors?.length || 0})</TabsTrigger>
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                      <DialogTrigger asChild><Button variant="primary-outline" size="sm" className="w-full sm:w-auto flex-shrink-0"><ListFilter className="w-4 h-4 mr-2"/>Filter Tutors</Button></DialogTrigger>
                      <DialogContent className="bg-card sm:max-w-lg"><DialogHeader><DialogTitle>Filter Tutors</DialogTitle><DialogDescription>Refine the list of tutors based on specific criteria.</DialogDescription></DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                          <div className="space-y-2 md:col-span-2"><Label htmlFor="subjects-filter-modal">Subjects</Label><MultiSelectCommand options={allSubjectsList} selectedValues={filters.subjects} onValueChange={(value) => handleFilterChange('subjects', value)} placeholder="Select subjects..." className="w-full"/></div>
                          <div className="space-y-2"><Label htmlFor="grade-filter-modal">Grade</Label><Select onValueChange={(value) => handleFilterChange('grade', value)} value={filters.grade}><SelectTrigger id="grade-filter-modal"><SelectValue placeholder="Select Grade" /></SelectTrigger><SelectContent>{gradeLevelsList.map(grade => (<SelectItem key={grade} value={grade}>{grade}</SelectItem>))}</SelectContent></Select></div>
                          <div className="space-y-2"><Label htmlFor="board-filter-modal">Board</Label><Select onValueChange={(value) => handleFilterChange('board', value)} value={filters.board}><SelectTrigger id="board-filter-modal"><SelectValue placeholder="Select Board" /></SelectTrigger><SelectContent>{boardsList.map(board => (<SelectItem key={board} value={board}>{board}</SelectItem>))}</SelectContent></Select></div>
                          <div className="space-y-2"><Label htmlFor="city-filter-modal">City</Label><Select onValueChange={handleCityChange} value={filters.city}><SelectTrigger id="city-filter-modal"><SelectValue placeholder="Select City" /></SelectTrigger><SelectContent><SelectItem value="all-cities">All Cities</SelectItem>{uniqueCities.map(loc => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}</SelectContent></Select></div>
                          <div className="space-y-2"><Label htmlFor="area-filter-modal">Area</Label><Select onValueChange={handleAreaChange} value={filters.area} disabled={!filters.city}><SelectTrigger id="area-filter-modal"><SelectValue placeholder="Select Area" /></SelectTrigger><SelectContent><SelectItem value="all-areas">All Areas</SelectItem>{uniqueAreasInCity.map(loc => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}</SelectContent></Select></div>
                          <div className="flex items-center space-x-4 pt-5 md:col-span-2"><div className="flex items-center space-x-2"><Checkbox id="online-filter-modal" checked={filters.isOnline} onCheckedChange={(checked) => handleFilterChange('isOnline', !!checked)} /><Label htmlFor="online-filter-modal" className="font-medium">Online</Label></div><div className="flex items-center space-x-2"><Checkbox id="offline-filter-modal" checked={filters.isOffline} onCheckedChange={(checked) => handleFilterChange('isOffline', !!checked)} /><Label htmlFor="offline-filter-modal" className="font-medium">Offline</Label></div></div>
                        </div>
                        <DialogFooter className="gap-2 sm:justify-between"><Button type="button" variant="outline" onClick={handleClearFilters}>Clear Filters</Button><Button type="button" onClick={handleApplyFilters}>Apply Filters</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
            </div>

            <TabsContent value="recommended">{renderTutorTable(recommendedTutors, isLoadingRecommended, tutorsError)}</TabsContent>
            <TabsContent value="applied">{renderTutorTable(appliedTutors, isLoadingApplied, tutorsError)}</TabsContent>
            <TabsContent value="shortlisted">{renderTutorTable(shortlistedTutors, isLoadingShortlisted, tutorsError)}</TabsContent>
            <TabsContent value="assigned">{renderTutorTable(assignedTutors, isLoadingAssigned, tutorsError)}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>


       {selectedTutor && <TutorProfileModal isOpen={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} tutor={selectedTutor} sourceTab={activeTab} />}
       {selectedTutor && <TutorContactModal isOpen={isContactModalOpen} onOpenChange={setIsContactModalOpen} tutor={selectedTutor} />}
        {enquiry && (
            <AdminEnquiryModal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} enquiryData={enquiry} onUpdateEnquiry={updateMutation.mutate} isUpdating={updateMutation.isPending}/>
        )}
        <Dialog open={isAddNotesModalOpen} onOpenChange={setIsAddNotesModalOpen}>
            <DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Add Additional Notes</DialogTitle><DialogDescription>These notes will be visible to tutors viewing the enquiry details.</DialogDescription></DialogHeader>
            <div className="py-4"><Textarea placeholder="e.g., Student requires special attention..." value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[120px]" disabled={addNoteMutation.isPending}/></div>
            <DialogFooter><DialogClose asChild><Button type="button" variant="outline" disabled={addNoteMutation.isPending}>Cancel</Button></DialogClose><Button type="button" onClick={handleSaveNotes} disabled={!notes.trim() || addNoteMutation.isPending}>{addNoteMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Note</>}</Button></DialogFooter>
            </DialogContent>
        </Dialog>
        <AlertDialog open={isCloseEnquiryModalOpen} onOpenChange={setIsCloseEnquiryModalOpen}>
            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure you want to close this enquiry?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently close the enquiry and you will not be able to assign tutors.</AlertDialogDescription></AlertDialogHeader>
            <div className="py-4 space-y-4"><RadioGroup onValueChange={setCloseReason} value={closeReason || ""} className="flex flex-col space-y-2">{closeReasons.map((reason) => (<div key={reason.id} className="flex items-center space-x-3"><RadioGroupItem value={reason.id} id={`admin-close-${reason.id}`} /><Label htmlFor={`admin-close-${reason.id}`} className="font-normal text-sm">{reason.label}</Label></div>))}</RadioGroup></div>
            <AlertDialogFooter><AlertDialogCancel disabled={closeEnquiryMutation.isPending}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleCloseEnquiryDialogAction} disabled={!closeReason || closeEnquiryMutation.isPending}>{closeEnquiryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Confirm & Close</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        {enquiry && (
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
              <DialogContent className="sm:max-w-2xl bg-card">
                  <DialogHeader className="p-6 pb-4">
                      <DialogTitle className="text-xl font-semibold text-primary">Enquiry Details</DialogTitle>
                      <DialogDescription>
                          Full details for enquiry: {Array.isArray(enquiry.subject) ? enquiry.subject.join(', ') : enquiry.subject}
                      </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-y-auto pr-2">
                  <div className="p-6 pt-0 space-y-5">
                    <section className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-primary/80" />
                        Requirement Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                        <EnquiryInfoItem label="Grade Level" value={enquiry.gradeLevel} icon={GraduationCap} />
                        {enquiry.board && <EnquiryInfoItem label="Board" value={enquiry.board} icon={Building} />}
                        {enquiry.teachingMode && enquiry.teachingMode.length > 0 && (
                            <EnquiryInfoItem label="Teaching Mode(s)" value={enquiry.teachingMode} icon={RadioTower} />
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
                                {enquiry.preferredDays && enquiry.preferredDays.length > 0 && (
                                <EnquiryInfoItem label="Preferred Days" value={enquiry.preferredDays.join(', ')} icon={CalendarDays} />
                                )}
                                {enquiry.preferredTimeSlots && enquiry.preferredTimeSlots.length > 0 && (
                                <EnquiryInfoItem label="Preferred Time" value={enquiry.preferredTimeSlots.join(', ')} icon={Clock} />
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

                    {enquiry.additionalNotes && (
                       <>
                        <Separator />
                        <section className="space-y-3">
                            <h3 className="text-base font-semibold text-foreground flex items-center">
                                <Info className="w-4 h-4 mr-2 text-primary/80" />
                                Additional Notes
                            </h3>
                            <p className="text-sm text-foreground/80 leading-relaxed pl-6">{enquiry.additionalNotes}</p>
                        </section>
                       </>
                    )}
                  </div>
                  </div>
                  <DialogFooter className="p-6 border-t">
                      <Button type="button" onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
                  </DialogFooter>
              </DialogContent>
            </Dialog>
        )}
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





    