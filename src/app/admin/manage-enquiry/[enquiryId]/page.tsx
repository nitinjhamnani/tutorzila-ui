
"use client";

import { useState, useMemo, useEffect, useCallback, Suspense, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import type { ApiTutor, TuitionRequirement, LocationDetails, BudgetDetails, EnquiryDemo } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";
import { EditEnquiryModal, type EditEnquiryFormValues } from "@/components/common/modals/EditEnquiryModal";
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
  DollarSign,
  Coins,
  VenetianMask,
  Calendar as CalendarIcon,
  MessageSquareQuote,
  Edit2,
  CalendarClock
} from "lucide-react";
import { TutorProfileModal } from "@/components/admin/modals/TutorProfileModal";
import { TutorContactModal } from "@/components/admin/modals/TutorContactModal";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScheduleDemoModal } from "@/components/admin/modals/ScheduleDemoModal";
import { AdminDemoCard } from "@/components/admin/AdminDemoCard";
import { useGlobalLoader } from "@/hooks/use-global-loader";

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

const acceptReasons = [
    { id: 'confirmed-call', label: "Enquiry was confirmed over a call" },
    { id: 'confirmed-whatsapp', label: "Enquiry was confirmed via WhatsApp" },
    { id: 'other', label: "Other" }
];

const closeReasons = [
    { id: 'found-tutorzila', label: "Found a tutor on Tutorzila" },
    { id: 'demo-not-liked', label: "Didn't like the tutor demo" },
    { id: 'not-interested', label: "Parent is not interested anymore" },
    { id: 'not-reachable', label: "Parent is not reachable" },
    { id: 'no-tutors-available', label: "No suitable tutors available" },
    { id: 'other', label: "Other" }
];

const reopenReasons = [
    { id: 'parent-request', label: "Parent requested to reopen" },
    { id: 'tutor-assignment-failed', label: "Tutor assignment failed" },
    { id: 'incorrectly-closed', label: "Incorrectly closed" },
    { id: 'other', label: "Other" }
];


const fetchAssignableTutors = async (token: string | null, params: URLSearchParams): Promise<ApiTutor[]> => {
  if (!token) throw new Error("Authentication token not found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  
  const fetchParams = new URLSearchParams(params.toString());

  const response = await fetch(`${apiBaseUrl}/api/search/tutors/recommended?${fetchParams.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
  });
  if (!response.ok) throw new Error("Failed to fetch tutors.");
  const data = await response.json();
    return data.map((tutor: any) => ({
    ...tutor,
    isVerified: tutor.isVerified || false,
  }));
};

const fetchEnquiryTutors = async (enquiryId: string, token: string | null): Promise<Record<string, ApiTutor[]>> => {
    if (!token) throw new Error("Authentication token not found.");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(`${apiBaseUrl}/api/manage/enquiry/tutors`, {
        headers: { 'Authorization': `Bearer ${token}`, 'TZ-ENQ-ID': enquiryId, 'accept': '*/*' }
    });
    if (!response.ok) throw new Error("Failed to fetch enquiry tutors.");
    return response.json();
}

const fetchEnquiryDemos = async (enquiryId: string, token: string | null): Promise<EnquiryDemo[]> => {
    if (!token) throw new Error("Authentication token not found.");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(`${apiBaseUrl}/api/demo/enquiry`, {
        headers: { 'Authorization': `Bearer ${token}`, 'TZ-ENQ-ID': enquiryId, 'accept': '*/*' }
    });
    if (!response.ok) throw new Error("Failed to fetch enquiry demos.");
    return response.json();
};

const fetchAdminEnquiryDetails = async (enquiryId: string, token: string | null): Promise<TuitionRequirement> => {
  if (!token) throw new Error("Authentication token is required.");
  if (!enquiryId) throw new Error("Enquiry ID is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/enquiry/${enquiryId}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Enquiry not found or you do not have permission to view it.");
    }
    throw new Error("Failed to fetch enquiry details.");
  }

  const data = await response.json();
  if (!data.enquiryResponse) {
    throw new Error("Invalid response structure from the server.");
  }
  const { enquirySummary, enquiryDetails } = data.enquiryResponse;
  
  return {
    id: enquirySummary.enquiryId,
    parentId: data.parentId,
    parentName: "A Parent", 
    studentName: enquiryDetails.studentName,
    subject: typeof enquirySummary.subjects === 'string' ? enquirySummary.subjects.split(',').map((s:string) => s.trim()) : [],
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
    additionalNotes: data.remarks || enquiryDetails.additionalNotes,
    preferredDays: typeof enquiryDetails.availabilityDays === 'string' ? enquiryDetails.availabilityDays.split(',').map((d:string) => d.trim()) : [],
    preferredTimeSlots: typeof enquiryDetails.availabilityTime === 'string' ? enquiryDetails.availabilityTime.split(',').map((t:string) => t.trim()) : [],
    status: enquirySummary.status?.toLowerCase() || 'open',
    postedAt: enquirySummary.createdOn,
    applicantsCount: enquirySummary.assignedTutors,
    createdBy: data.createdBy,
    budget: data.budget,
    tutorGenderPreference: enquiryDetails.tutorGenderPreference?.toUpperCase(),
    startDatePreference: enquiryDetails.startDatePreference,
  };
};

const updateEnquiry = async ({ enquiryId, token, formData }: { enquiryId: string, token: string | null, formData: EditEnquiryFormValues }) => {
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
    genderPreference: formData.tutorGenderPreference,
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

  if (!response.ok) { throw new Error("Failed to update enquiry."); }
  return response.json();
};

const addNoteToEnquiry = async ({ enquiryId, token, note }: { enquiryId: string, token: string | null, note: string }) => {
  if (!token) throw new Error("Authentication token is required.");
  if (!enquiryId) throw new Error("Enquiry ID is required.");
  if (!note) throw new Error("Note content cannot be empty.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/enquiry/notes`, {
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
  let apiUrl = `${apiBaseUrl}/api/admin/enquiry/status?status=${status.toUpperCase()}`;
  let requestBody = JSON.stringify({ message: remark });

  if (status === 'accepted') {
    apiUrl = `${apiBaseUrl}/api/manage/enquiry/accept`;
  } else if (status === 'closed') {
    apiUrl = `${apiBaseUrl}/api/enquiry/close`;
  } else if (status === 'reopened') {
    apiUrl = `${apiBaseUrl}/api/manage/enquiry/reopen`;
  }

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'TZ-ENQ-ID': enquiryId,
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: requestBody,
  });

  if (!response.ok) { throw new Error("Failed to update enquiry status."); }
  return response.json();
};

const closeEnquiry = async ({ enquiryId, token, reason }: { enquiryId: string, token: string | null, reason: string }) => {
  if (!token) throw new Error("Authentication token is required.");
  if (!reason) throw new Error("A reason for closing is required.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/enquiry/close`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'TZ-ENQ-ID': enquiryId,
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify({ message: reason }),
  });

  if (!response.ok) { throw new Error("Failed to close enquiry."); }
  return response.json();
};

const updateEnquiryBudget = async ({ enquiryId, token, budget }: { enquiryId: string, token: string | null, budget: BudgetDetails }) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!enquiryId) throw new Error("Enquiry ID is required.");
  if (!budget) throw new Error("Budget details are required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/enquiry/budget`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'TZ-ENQ-ID': enquiryId,
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify(budget),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update budget." }));
    throw new Error(errorData.message);
  }
  return response.json();
};


const fetchParentContact = async (parentId: string, token: string | null): Promise<ParentContact> => {
    if (!token) throw new Error("Authentication token not found.");
    if (!parentId) throw new Error("Parent ID is required.");

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(`${apiBaseUrl}/api/admin/user/contact/${parentId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch parent contact details." }));
        throw new Error(errorData.message);
    }
    
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
  const { hideLoader } = useGlobalLoader();

  const [selectedTutor, setSelectedTutor] = useState<ApiTutor | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddNotesModalOpen, setIsAddNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isParentInfoModalOpen, setIsParentInfoModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [closeReason, setCloseReason] = useState<string | null>(null);
  const [isTutorQueryEnabled, setIsTutorQueryEnabled] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [acceptReason, setAcceptReason] = useState<string | null>(null);
  const [isSessionDetailsModalOpen, setIsSessionDetailsModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState<string | null>(null);
  const [isScheduleDemoModalOpen, setIsScheduleDemoModalOpen] = useState(false);
  const [demoToReschedule, setDemoToReschedule] = useState<EnquiryDemo | null>(null);
  const [demoToCancel, setDemoToCancel] = useState<EnquiryDemo | null>(null);
  
  const [sessionsPerWeek, setSessionsPerWeek] = useState(0);
  const [hoursPerSession, setHoursPerSession] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [precisePerHourRate, setPrecisePerHourRate] = useState(0);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const totalFeesInputRef = useRef<HTMLInputElement>(null);
  const [sourceTab, setSourceTab] = useState("recommended");
  
  useEffect(() => {
      hideLoader();
  }, [hideLoader]);

  const { data: enquiry, isLoading: isLoadingEnquiry, error: enquiryError } = useQuery({
    queryKey: ['adminEnquiryDetails', enquiryId],
    queryFn: () => fetchAdminEnquiryDetails(enquiryId, token),
    enabled: !!enquiryId && !!token,
    refetchOnWindowFocus: false,
  });
  
  const { data: enquiryTutorsData, isLoading: isLoadingEnquiryTutors, error: enquiryTutorsError } = useQuery({
    queryKey: ['enquiryTutors', enquiryId],
    queryFn: () => fetchEnquiryTutors(enquiryId, token),
    enabled: !!enquiryId && !!token,
    refetchOnWindowFocus: false,
  });

  const { data: enquiryDemos, isLoading: isLoadingEnquiryDemos, error: enquiryDemosError } = useQuery({
    queryKey: ['enquiryDemos', enquiryId],
    queryFn: () => fetchEnquiryDemos(enquiryId, token),
    enabled: !!enquiryId && !!token,
    refetchOnWindowFocus: false,
  });

  const parentContactQuery = useQuery({
    queryKey: ['parentContact', enquiry?.parentId],
    queryFn: () => fetchParentContact(enquiry!.parentId!, token),
    enabled: isParentInfoModalOpen && !!enquiry?.parentId && !!token,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });


  useEffect(() => {
    if (enquiry?.budget) {
      const budget = enquiry.budget;
      setSessionsPerWeek(budget.daysPerWeek || 0);
      setHoursPerSession(budget.hoursPerDay || 0);
      setTotalFees(budget.totalFees || 0);
      
      const rate = budget.finalRate || budget.defaultRate || 0;
      setPrecisePerHourRate(rate);

      if (budget.totalFees === 0 && budget.daysPerWeek && budget.hoursPerDay && rate > 0) {
        const calculatedDays = Math.round((budget.daysPerWeek || 0) * (30 / 7));
        const calculatedHours = calculatedDays * (budget.hoursPerDay || 0);
        setTotalFees(Math.round(calculatedHours * rate));
      }
    }
  }, [enquiry?.budget]);


  const { totalDays, totalHours } = useMemo(() => {
    if (sessionsPerWeek <= 0 || hoursPerSession <= 0) return { totalDays: 0, totalHours: 0 };
    const days = Math.round(sessionsPerWeek * (30 / 7));
    const hours = days * hoursPerSession;
    return { totalDays: days, totalHours: hours };
  }, [sessionsPerWeek, hoursPerSession]);

  const handleSessionDetailChange = (type: 'sessions' | 'hours', value: number) => {
    const sanitizedValue = Math.max(0, value); 
    let newSessionsPerWeek = sessionsPerWeek;
    let newHoursPerSession = hoursPerSession;
    const defaultRate = enquiry?.budget?.defaultRate || 500;

    if (type === 'sessions') {
      newSessionsPerWeek = sanitizedValue;
      setSessionsPerWeek(newSessionsPerWeek);
    }
    if (type === 'hours') {
      newHoursPerSession = sanitizedValue;
      setHoursPerSession(newHoursPerSession);
    }
    
    const newTotalHours = Math.round(newSessionsPerWeek * (30 / 7)) * newHoursPerSession;
    const newTotalFees = Math.round(newTotalHours * defaultRate);
    setTotalFees(newTotalFees);
    setPrecisePerHourRate(defaultRate);
  };

  const handleEditBudget = () => {
    setIsEditingBudget(true);
    setTimeout(() => {
        totalFeesInputRef.current?.focus();
        totalFeesInputRef.current?.select();
    }, 100);
  };
  
  const handleTotalFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotal = Number(e.target.value);
    setTotalFees(newTotal);
    if (totalHours > 0) {
      setPrecisePerHourRate(newTotal / totalHours);
    } else {
        setPrecisePerHourRate(0);
    }
  };
  
  const handleStopEditingBudget = () => {
    setIsEditingBudget(false);
  };


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
    mutationFn: (formData: EditEnquiryFormValues) => updateEnquiry({ enquiryId, token, formData }),
    onSuccess: (updatedData) => {
        toast({ title: "Enquiry Updated!", description: "The requirement has been successfully updated." });
        const { enquirySummary, enquiryDetails } = updatedData.enquiryResponse;
        queryClient.setQueryData<TuitionRequirement>(['adminEnquiryDetails', enquiryId], (oldData) => {
            if (!oldData) return undefined;
            const transformStringToArray = (str: string | null | undefined): string[] => {
                if (typeof str === 'string' && str.trim() !== '') {
                    return str.split(',').map(s => s.trim());
                }
                return [];
            };
            return {
                ...oldData,
                id: enquirySummary.enquiryId,
                studentName: enquiryDetails.studentName,
                subject: transformStringToArray(enquirySummary.subjects),
                gradeLevel: enquirySummary.grade,
                board: enquirySummary.board,
                location: {
                    ...oldData.location,
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
                status: enquirySummary.status?.toLowerCase() || oldData.status,
                tutorGenderPreference: enquiryDetails.tutorGenderPreference?.toUpperCase(),
                startDatePreference: enquiryDetails.startDatePreference,
            };
        });
        setIsEditModalOpen(false);
    },
    onError: (error: any) => toast({ variant: "destructive", title: "Update Failed", description: error.message }),
});

const addNoteMutation = useMutation({
    mutationFn: (note: string) => addNoteToEnquiry({ enquiryId, token, note }),
    onSuccess: (updatedData) => {
        toast({ title: "Note Saved!", description: "The additional notes have been updated." });
        
        queryClient.setQueryData<TuitionRequirement>(['adminEnquiryDetails', enquiryId], (oldData) => {
            if (!oldData) return undefined;
            const { enquirySummary, enquiryDetails } = updatedData.enquiryResponse;
            const transformStringToArray = (str: string | null | undefined): string[] => {
                if (typeof str === 'string' && str.trim() !== '') {
                    return str.split(',').map(s => s.trim());
                }
                return [];
            };
            return {
                ...oldData,
                id: enquirySummary.enquiryId,
                studentName: enquiryDetails.studentName,
                subject: transformStringToArray(enquirySummary.subjects),
                gradeLevel: enquirySummary.grade,
                board: enquirySummary.board,
                location: {
                    ...oldData.location,
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
                additionalNotes: updatedData.remarks || enquiryDetails.additionalNotes,
                preferredDays: transformStringToArray(enquiryDetails.availabilityDays),
                preferredTimeSlots: transformStringToArray(enquiryDetails.availabilityTime),
                status: enquirySummary.status?.toLowerCase() || oldData.status,
                tutorGenderPreference: enquiryDetails.tutorGenderPreference?.toUpperCase(),
                startDatePreference: enquiryDetails.startDatePreference,
            };
        });
        setIsAddNotesModalOpen(false);
        setNotes("");
    },
    onError: (error: any) => toast({ variant: "destructive", title: "Failed to Save Note", description: error.message }),
});

const closeEnquiryMutation = useMutation({
    mutationFn: (reason: string) => closeEnquiry({ enquiryId, token, reason }),
    onSuccess: (updatedData) => {
        toast({ title: "Enquiry Closed", description: "The enquiry has been successfully closed." });
        const { enquirySummary, enquiryDetails } = updatedData;
        queryClient.setQueryData<TuitionRequirement>(['adminEnquiryDetails', enquiryId], (oldData) => {
            if (!oldData) return undefined;
            const transformStringToArray = (str: string | null | undefined): string[] => {
                if (typeof str === 'string' && str.trim() !== '') {
                    return str.split(',').map(s => s.trim());
                }
                return [];
            };
            return {
                ...oldData,
                id: enquirySummary.enquiryId,
                studentName: enquiryDetails.studentName,
                subject: transformStringToArray(enquirySummary.subjects),
                gradeLevel: enquirySummary.grade,
                board: enquirySummary.board,
                location: {
                    ...oldData.location,
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
                additionalNotes: updatedData.remarks || enquiryDetails.additionalNotes,
                preferredDays: transformStringToArray(enquiryDetails.availabilityDays),
                preferredTimeSlots: transformStringToArray(enquiryDetails.availabilityTime),
                status: enquirySummary.status?.toLowerCase() || oldData.status,
            };
        });
        setIsCloseModalOpen(false);
        setCloseReason(null);
    },
    onError: (error: any) => toast({ variant: "destructive", title: "Closure Failed", description: error.message }),
});


  const updateStatusMutation = useMutation({
    mutationFn: ({ status, remark }: { status: string, remark?: string }) => updateEnquiryStatus({ enquiryId, token, status, remark }),
    onSuccess: (updatedData, variables) => {
        const successMessage = `Status updated to ${variables.status}.`;
        toast({ title: "Status Updated", description: successMessage });
        
        const { enquirySummary, enquiryDetails } = updatedData;

        queryClient.setQueryData<TuitionRequirement>(['adminEnquiryDetails', enquiryId], oldData => {
            if (!oldData) return undefined;
            const transformStringToArray = (str: string | null | undefined): string[] => {
                if (typeof str === 'string' && str.trim() !== '') {
                    return str.split(',').map(s => s.trim());
                }
                return [];
            };
            return {
                ...oldData,
                id: enquirySummary.enquiryId,
                studentName: enquiryDetails.studentName,
                subject: transformStringToArray(enquirySummary.subjects),
                gradeLevel: enquirySummary.grade,
                board: enquirySummary.board,
                location: {
                    ...oldData.location,
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
                additionalNotes: updatedData.remarks || enquiryDetails.additionalNotes,
                preferredDays: transformStringToArray(enquiryDetails.availabilityDays),
                preferredTimeSlots: transformStringToArray(enquiryDetails.availabilityTime),
                status: enquirySummary.status?.toLowerCase() || oldData.status,
            };
        });

        setIsAcceptModalOpen(false);
        setAcceptReason(null);
        setIsReopenModalOpen(false);
        setReopenReason(null);
    },
    onError: (error: any) => toast({ variant: "destructive", title: "Status Update Failed", description: error.message }),
  });

  const updateBudgetMutation = useMutation({
    mutationFn: (budget: BudgetDetails) => updateEnquiryBudget({ enquiryId, token, budget }),
    onSuccess: (updatedEnquiryData) => {
        toast({ title: "Budget Saved", description: "The enquiry budget has been successfully updated." });
        
        const { enquiryResponse } = updatedEnquiryData;
        const oldData = queryClient.getQueryData<TuitionRequirement>(['adminEnquiryDetails', enquiryId]);
        if (!oldData) return;

        const transformedData: TuitionRequirement = {
          ...oldData,
          id: enquiryResponse.enquirySummary.enquiryId,
          parentId: oldData.parentId,
          parentName: "A Parent", 
          studentName: enquiryResponse.enquiryDetails.studentName,
          subject: typeof enquiryResponse.enquirySummary.subjects === 'string' ? enquiryResponse.enquirySummary.subjects.split(',').map((s:string) => s.trim()) : [],
          gradeLevel: enquiryResponse.enquirySummary.grade,
          board: enquiryResponse.enquirySummary.board,
          location: {
              name: enquiryResponse.enquiryDetails.addressName || enquiryResponse.enquiryDetails.address || "",
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
          additionalNotes: updatedEnquiryData.remarks || enquiryResponse.enquiryDetails.additionalNotes,
          preferredDays: typeof enquiryResponse.enquiryDetails.availabilityDays === 'string' ? enquiryResponse.enquiryDetails.availabilityDays.split(',').map((d:string) => d.trim()) : [],
          preferredTimeSlots: typeof enquiryResponse.enquiryDetails.availabilityTime === 'string' ? enquiryResponse.enquiryDetails.availabilityTime.split(',').map((t:string) => t.trim()) : [],
          status: enquiryResponse.enquirySummary.status?.toLowerCase() || 'open',
          postedAt: enquiryResponse.enquirySummary.createdOn,
          applicantsCount: enquiryResponse.enquirySummary.assignedTutors,
          createdBy: updatedEnquiryData.createdBy,
          budget: updatedEnquiryData.budget,
          tutorGenderPreference: enquiryResponse.enquiryDetails.tutorGenderPreference,
          startDatePreference: enquiryResponse.enquiryDetails.startDatePreference,
        };
        queryClient.setQueryData(['adminEnquiryDetails', enquiryId], transformedData);
        setIsSessionDetailsModalOpen(false);
    },
    onError: (error: any) => toast({ variant: "destructive", title: "Budget Update Failed", description: error.message }),
  });

  
  const handleViewProfile = (tutor: ApiTutor, currentTab: string) => {
    setSelectedTutor(tutor);
    setSourceTab(currentTab);
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

 const handleOpenCloseModal = () => {
    setCloseReason(null);
    setIsCloseModalOpen(true);
  };

  const handleConfirmClosure = () => {
    if (!closeReason) {
      toast({ variant: "destructive", title: "Reason Required", description: "Please select a reason for closing." });
      return;
    }
    closeEnquiryMutation.mutate(closeReason);
  };

  const handleOpenAcceptModal = () => {
    setAcceptReason(null);
    setIsAcceptModalOpen(true);
  }

  const handleConfirmAcceptance = () => {
    if (!acceptReason) {
      toast({ variant: "destructive", title: "Reason Required", description: "Please select a reason for acceptance." });
      return;
    }
    updateStatusMutation.mutate({ status: "accepted", remark: acceptReason });
  }

  const handleConfirmBudget = () => {
    const budgetPayload: BudgetDetails = {
      defaultRate: enquiry?.budget?.defaultRate || 0,
      finalRate: precisePerHourRate,
      daysPerWeek: sessionsPerWeek,
      hoursPerDay: hoursPerSession,
      totalFees: totalFees,
      totalHours: totalHours,
      totalDays: totalDays,
    };
    updateBudgetMutation.mutate(budgetPayload);
  }

  const handleCopyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied to Clipboard", description: `${fieldName} has been copied.` });
    }, (err) => {
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy text." });
    });
  };
  
  const handleOpenReopenModal = () => {
    setReopenReason(null);
    setIsReopenModalOpen(true);
  };

  const handleConfirmReopen = () => {
    if (!reopenReason) {
        toast({
            variant: "destructive",
            title: "Reason Required",
            description: "Please select a reason for reopening the enquiry.",
        });
        return;
    }
    updateStatusMutation.mutate({ status: "reopened", remark: reopenReason });
  };
  
  const handleScheduleDemo = (tutor: ApiTutor) => {
    setSelectedTutor(tutor);
    setIsScheduleDemoModalOpen(true);
  }
  
  const handleRescheduleDemo = (demo: EnquiryDemo) => {
    setDemoToReschedule(demo);
    const tutorForDemo = [...(enquiryTutorsData?.ASSIGNED || []), ...(allTutorsData || [])].find(t => t.displayName === demo.demoDetails.tutorName);
    if(tutorForDemo) {
        setSelectedTutor(tutorForDemo);
    }
    setIsScheduleDemoModalOpen(true);
  };

  const handleCancelDemo = (demo: EnquiryDemo) => {
    setDemoToCancel(demo);
  };

  const confirmCancelDemo = () => {
    if (!demoToCancel) return;
    console.log("Cancelling demo:", demoToCancel.demoId);
    toast({ title: "Demo Cancelled (Mock)", description: `Demo with ${demoToCancel.demoDetails.tutorName} has been cancelled.`});
    queryClient.invalidateQueries({ queryKey: ['enquiryDemos', enquiryId] });
    setDemoToCancel(null);
  };

  const genderDisplayMap: Record<string, string> = {
    "MALE": "Male",
    "FEMALE": "Female",
    "NO_PREFERENCE": "No Preference",
  };
  const genderValue = enquiry?.tutorGenderPreference ? genderDisplayMap[enquiry.tutorGenderPreference] : undefined;

  if (isLoadingEnquiry) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (enquiryError) {
      return <div className="text-center py-10 text-destructive">Error loading enquiry details: {(enquiryError as Error).message}</div>
  }
  
  if (!enquiry) {
      return <div className="text-center py-10 text-muted-foreground">Enquiry not found.</div>
  }

  const renderTutorTable = (tutors: ApiTutor[] | undefined, isLoading: boolean, error: Error | null, tabName: string) => (
    <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
            <TooltipProvider>
                <Table>
                    <TableHeader><TableRow><TableHead>Tutor</TableHead><TableHead>Subjects</TableHead><TableHead>Grade</TableHead><TableHead>Board</TableHead><TableHead>Mode</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {isLoading ? ([...Array(3)].map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-10 w-48" /></TableCell><TableCell><Skeleton className="h-6 w-32" /></TableCell><TableCell><Skeleton className="h-6 w-32" /></TableCell><TableCell><Skeleton className="h-6 w-32" /></TableCell><TableCell><Skeleton className="h-6 w-24" /></TableCell><TableCell><Skeleton className="h-6 w-20" /></TableCell><TableCell><Skeleton className="h-8 w-20 rounded-md" /></TableCell></TableRow>))) 
                        : error ? (<TableRow><TableCell colSpan={7} className="text-center text-destructive">Failed to load tutors.</TableCell></TableRow>) 
                        : !tutors || tutors.length === 0 ? (<TableRow><TableCell colSpan={7} className="text-center py-8">No tutors found.</TableCell></TableRow>) 
                        : (tutors.map(tutor => (
                            <TableRow key={tutor.id}>
                                <TableCell><div><div className="font-medium text-foreground">{tutor.displayName}</div><div className="text-xs text-muted-foreground">{tutor.area}, {tutor.city}</div></div></TableCell>
                                <TableCell className="text-xs">{Array.isArray(tutor.subjectsList) ? tutor.subjectsList.join(', ') : ''}</TableCell>
                                <TableCell className="text-xs">{Array.isArray(tutor.gradesList) ? tutor.gradesList.join(', ') : ''}</TableCell>
                                <TableCell className="text-xs">{Array.isArray(tutor.boardsList) ? tutor.boardsList.join(', ') : ''}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {(tutor.online || (tutor as any).isOnline) && (
                                      <Tooltip>
                                        <TooltipTrigger asChild><div className="p-1.5 bg-primary/10 rounded-full"><RadioTower className="w-4 h-4 text-primary" /></div></TooltipTrigger>
                                        <TooltipContent><p>Online</p></TooltipContent>
                                      </Tooltip>
                                    )}
                                    {(tutor.offline || (tutor as any).isOffline) && (
                                      <Tooltip>
                                        <TooltipTrigger asChild><div className="p-1.5 bg-primary/10 rounded-full"><Users className="w-4 h-4 text-primary" /></div></TooltipTrigger>
                                        <TooltipContent><p>Offline</p></TooltipContent>
                                      </Tooltip>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell><div className="flex items-center gap-2"><Tooltip><TooltipTrigger>{tutor.isActive ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}</TooltipTrigger><TooltipContent><p>{tutor.isActive ? "Active" : "Inactive"}</p></TooltipContent></Tooltip><Tooltip><TooltipTrigger>{tutor.isVerified ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldAlert className="h-4 w-4 text-yellow-500" />}</TooltipTrigger><TooltipContent><p>{tutor.isVerified ? "Verified" : "Not Verified"}</p></TooltipContent></Tooltip></div></TableCell>
                                <TableCell><div className="flex items-center gap-1.5">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleViewProfile(tutor, tabName)}><Eye className="w-4 h-4" /></Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleContactTutor(tutor)}><Phone className="w-4 h-4" /></Button>
                                    {tabName === "assigned" && <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleScheduleDemo(tutor)}><CalendarIcon className="w-4 h-4" /></Button>}
                                </div></TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </TooltipProvider>
        </CardContent>
    </Card>
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
        {renderTutorTable(allTutorsData, isLoadingAllTutors, allTutorsError, "recommended")}
      </div>
    );
  };

  const locationInfo = typeof enquiry.location === 'object' && enquiry.location ? enquiry.location : null;
  const budgetInfo = enquiry?.budget;

  const renderDemoTable = () => {
    return (
    <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Day &amp; Date</TableHead>
              <TableHead>Time &amp; Duration</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingEnquiryDemos ? (
              [...Array(2)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : enquiryDemosError ? (
              <TableRow><TableCell colSpan={7} className="text-center text-destructive">Failed to load demos.</TableCell></TableRow>
            ) : !enquiryDemos || enquiryDemos.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">No demos scheduled for this enquiry yet.</TableCell></TableRow>
            ) : (
              enquiryDemos.map(demo => {
                if (!demo || !demo.demoDetails) {
                    return null; 
                }
                const { demoDetails } = demo;
                const isCancelled = demo.demoStatus === "CANCELLED";
                return (
                    <TableRow key={demo.demoId}>
                    <TableCell>
                        <Badge variant="default" className="text-xs">
                          {demo.demoStatus.charAt(0).toUpperCase() + demo.demoStatus.slice(1).toLowerCase()}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="font-medium text-foreground">{demoDetails.tutorName}</div>
                    </TableCell>
                    <TableCell className="text-xs">{demoDetails.subjects}</TableCell>
                    <TableCell className="text-xs">{demoDetails.day}, {format(parseISO(demoDetails.date), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-xs">{demoDetails.startTime} ({demoDetails.duration} mins)</TableCell>
                    <TableCell>
                        <TooltipProvider>
                            <div className="flex items-center gap-2">
                                {demoDetails.online && (
                                <Tooltip>
                                    <TooltipTrigger asChild><div className="p-1.5 bg-primary/10 rounded-full"><RadioTower className="w-4 h-4 text-primary" /></div></TooltipTrigger>
                                    <TooltipContent><p>Online</p></TooltipContent>
                                </Tooltip>
                                )}
                                {demoDetails.offline && (
                                <Tooltip>
                                    <TooltipTrigger asChild><div className="p-1.5 bg-primary/10 rounded-full"><Users className="w-4 h-4 text-primary" /></div></TooltipTrigger>
                                    <TooltipContent><p>Offline</p></TooltipContent>
                                </Tooltip>
                                )}
                            </div>
                        </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      {!isCancelled && (
                        <div className="flex items-center gap-1.5">
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleRescheduleDemo(demo)}>
                            <CalendarClock className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleCancelDemo(demo)}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    )
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg border-0">
        <CardHeader className="p-4 sm:p-5 relative">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-4 flex-grow">
                  <div className="flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-xl font-semibold text-primary">
                        {Array.isArray(enquiry.subject) ? enquiry.subject.join(', ') : enquiry.subject}
                        </CardTitle>
                         {enquiry.status && (
                            <Badge variant="default" className="text-xs">
                                {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                            </Badge>
                         )}
                      </div>
                      <div className="space-y-2 pt-2">
                          <CardDescription className="text-sm text-foreground/80 flex items-center gap-1.5">
                              <UsersRound className="w-4 h-4"/> {enquiry.studentName}
                          </CardDescription>
                          {enquiry.postedAt && (
                            <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                                <Clock className="w-3.5 h-3.5" /> 
                                Posted on {format(parseISO(enquiry.postedAt), "MMM d, yyyy")}
                            </CardDescription>
                          )}
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
                                {budgetInfo && (budgetInfo.totalDays || 0) > 0 && (
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 border-t mt-2">
                                      {budgetInfo.totalDays && <span className="flex items-center gap-1.5 font-medium"><CalendarDays className="w-3.5 h-3.5 text-primary/80"/>{budgetInfo.totalDays} Days/Month</span>}
                                      {budgetInfo.totalHours && <span className="flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5 text-primary/80"/>{budgetInfo.totalHours} Hrs/Month</span>}
                                      {budgetInfo.totalFees && <span className="flex items-center gap-1.5 font-medium"><Coins className="w-3.5 h-3.5 text-primary/80"/>₹{budgetInfo.totalFees.toLocaleString()}/Month</span>}
                                      <span className="flex items-center gap-1.5 font-medium"><DollarSign className="w-3.5 h-3.5 text-primary/80"/>₹{Math.round(precisePerHourRate).toLocaleString()}/hr</span>
                                  </div>
                                )}
                          </div>
                      </div>
                  </div>
              </div>
               <div className="absolute top-4 right-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 shrink-0">
                    <AvatarFallback className="text-base bg-primary/10 text-primary font-bold">
                      {enquiry.createdBy === 'PARENT' ? 'P' : enquiry.createdBy === 'ADMIN' ? 'A' : '?'}
                    </AvatarFallback>
                  </Avatar>
                </div>
            </div>
            <div className="sm:hidden mt-4 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {(enquiry.status === "open" || enquiry.status === "reopened") && (
                  <Button variant="primary-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={handleOpenAcceptModal}>
                    <CheckSquare className="mr-1.5 h-3.5 w-3.5" /> Accept
                  </Button>
                )}
                {enquiry.status !== "closed" && (
                    <Button variant="destructive-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={handleOpenCloseModal}>
                        <XCircle className="mr-1.5 h-3.5 w-3.5" /> Close
                    </Button>
                )}
                {enquiry.status === "closed" && (
                    <Button variant="primary-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={handleOpenReopenModal}>
                        <Archive className="mr-1.5 h-3.5 w-3.5" /> Reopen
                    </Button>
                )}
            </div>
        </CardHeader>
        <CardFooter className="flex flex-wrap justify-between gap-2 p-4 sm:p-5 border-t">
           <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsParentInfoModalOpen(true)}><User className="mr-1.5 h-3.5 w-3.5"/>Parent</Button>
            <Button variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsSessionDetailsModalOpen(true)}><DollarSign className="mr-1.5 h-3.5 w-3.5"/>Session &amp; Budget</Button>
            <Button variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsDetailsModalOpen(true)}><CalendarDays className="mr-1.5 h-3.5 w-3.5" />Preferences</Button>
            <Button variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsEditModalOpen(true)}><Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
            <Button variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto" onClick={handleOpenNotesModal}><ClipboardEdit className="mr-1.5 h-3.5 w-3.5" /> Notes</Button>
           </div>
           <div className="hidden sm:flex sm:flex-row gap-2 w-full sm:w-auto justify-end">
                {(enquiry.status === "open" || enquiry.status === "reopened") && (
                  <Button variant="primary-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={handleOpenAcceptModal}>
                    <CheckSquare className="mr-1.5 h-3.5 w-3.5" /> Accept
                  </Button>
                )}
                {enquiry.status !== "closed" && (
                    <Button variant="destructive-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={handleOpenCloseModal}>
                        <XCircle className="mr-1.5 h-3.5 w-3.5" /> Close
                    </Button>
                )}
                {enquiry.status === "closed" && (
                    <Button variant="primary-outline" size="sm" className="w-full sm:w-auto text-xs h-8 px-3 rounded-md" onClick={handleOpenReopenModal}>
                        <Archive className="mr-1.5 h-3.5 w-3.5" /> Reopen
                    </Button>
                )}
              </div>
        </CardFooter>
      </Card>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-primary"/> Demos ({enquiryDemos?.length ?? 0})
        </h3>
        {renderDemoTable()}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Assigned Tutors ({enquiryTutorsData?.ASSIGNED?.length ?? 0})</h3>
        {renderTutorTable(enquiryTutorsData?.ASSIGNED, isLoadingEnquiryTutors, enquiryTutorsError, "assigned")}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Applied Tutors ({enquiryTutorsData?.APPLIED?.length ?? 0})</h3>
        {renderTutorTable(enquiryTutorsData?.APPLIED, isLoadingEnquiryTutors, enquiryTutorsError, "applied")}
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Shortlisted Tutors ({enquiryTutorsData?.SHORTLISTED?.length ?? 0})</h3>
        {renderTutorTable(enquiryTutorsData?.SHORTLISTED, isLoadingEnquiryTutors, enquiryTutorsError, "shortlisted")}
      </div>

      <div className="mt-6">
        {renderRecommendedTutorContent()}
      </div>
      
       {selectedTutor && <TutorProfileModal isOpen={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} tutor={selectedTutor} enquiryId={enquiryId} sourceTab={sourceTab} />}
       {selectedTutor && <TutorContactModal isOpen={isContactModalOpen} onOpenChange={setIsContactModalOpen} tutor={selectedTutor} />}
        
        {enquiry && (
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <EditEnquiryModal
                enquiryData={enquiry}
                onUpdateEnquiry={updateMutation.mutate}
                isUpdating={updateMutation.isPending}
              />
            </Dialog>
        )}

        {selectedTutor && <ScheduleDemoModal isOpen={isScheduleDemoModalOpen} onOpenChange={setIsScheduleDemoModalOpen} tutor={selectedTutor} enquiry={enquiry} />}
        <Dialog open={isAddNotesModalOpen} onOpenChange={setIsAddNotesModalOpen}>
            <DialogContent className="sm:max-w-md bg-card">
              <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-lg font-semibold text-primary">Add Additional Notes</DialogTitle>
                <DialogDescription>
                  These notes will be visible to tutors viewing the enquiry details.
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 pt-0 pb-6">
                <Textarea
                  placeholder="e.g., Student requires special attention for calculus, focus on exam preparation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                  disabled={addNoteMutation.isPending}
                />
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleSaveNotes} disabled={addNoteMutation.isPending || !notes.trim()}>
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
              <DialogHeader className="p-6 pb-4 border-b">
                  <DialogTitle className="text-xl font-semibold text-primary">Preferences &amp; Notes</DialogTitle>
                  <DialogDescription>
                      Scheduling preferences and additional notes for this enquiry.
                  </DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-6 pt-0 space-y-5">
                {(enquiry.preferredDays && enquiry.preferredDays.length > 0 || enquiry.preferredTimeSlots && enquiry.preferredTimeSlots.length > 0 || enquiry.tutorGenderPreference || enquiry.startDatePreference) && (
                  <section className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground flex items-center">
                          <CalendarDays className="w-4 h-4 mr-2 text-primary/80" />
                          Schedule &amp; Tutor Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                          {enquiry.preferredDays && enquiry.preferredDays.length > 0 && (
                            <EnquiryInfoItem label="Preferred Days" value={enquiry.preferredDays.join(', ')} icon={CalendarDays} />
                          )}
                          {enquiry.preferredTimeSlots && enquiry.preferredTimeSlots.length > 0 && (
                            <EnquiryInfoItem label="Preferred Time" value={enquiry.preferredTimeSlots.join(', ')} icon={Clock} />
                          )}
                           {enquiry.tutorGenderPreference && (
                                <EnquiryInfoItem label="Tutor Gender" value={genderValue} icon={VenetianMask} />
                           )}
                           {enquiry.startDatePreference && (
                                <EnquiryInfoItem label="Start Date" value={enquiry.startDatePreference.replace(/_/g, ' ')} icon={CalendarDays} />
                           )}
                      </div>
                  </section>
                )}

                {enquiry.additionalNotes && (
                   <>
                    {(enquiry.preferredDays && enquiry.preferredDays.length > 0 || enquiry.preferredTimeSlots && enquiry.preferredTimeSlots.length > 0 || enquiry.tutorGenderPreference || enquiry.startDatePreference) && <Separator />}
                    <section className="space-y-3">
                        <h3 className="text-base font-semibold text-foreground flex items-center">
                            <Info className="w-4 h-4 mr-2 text-primary/80" />
                            Additional Notes
                        </h3>
                        <p className="text-sm text-foreground/80 leading-relaxed pl-6">{enquiry.additionalNotes}</p>
                    </section>
                   </>
                )}
                {!(enquiry.preferredDays && enquiry.preferredDays.length > 0 || enquiry.preferredTimeSlots && enquiry.preferredTimeSlots.length > 0 || enquiry.tutorGenderPreference || enquiry.startDatePreference) && !enquiry.additionalNotes && (
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
                    <div className="text-center text-destructive px-6 pb-6">
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
        <Dialog open={isAcceptModalOpen} onOpenChange={setIsAcceptModalOpen}>
            <DialogContent className="sm:max-w-md bg-card">
              <DialogHeader className="p-6 pb-4">
                <DialogTitle>Accept Enquiry: {Array.isArray(enquiry.subject) ? enquiry.subject.join(', ') : enquiry.subject}</DialogTitle>
                <DialogDescription>
                  Please select a reason for accepting this requirement. This helps in tracking.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4 px-6">
                  <RadioGroup
                    onValueChange={(value: string) => setAcceptReason(value)}
                    value={acceptReason || ""}
                    className="flex flex-col space-y-2"
                  >
                    {acceptReasons.map((reason) => (
                      <div key={reason.id} className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value={reason.label} id={`admin-accept-${reason.id}`} />
                        <Label htmlFor={`admin-accept-${reason.id}`} className="font-normal text-sm">{reason.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
              </div>
              <DialogFooter className="p-4 border-t-0">
                <Button 
                  type="button" 
                  onClick={handleConfirmAcceptance} 
                  disabled={!acceptReason || updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? "Accepting..." : "Confirm Acceptance"}
                </Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isCloseModalOpen} onOpenChange={setIsCloseModalOpen}>
            <DialogContent className="sm:max-w-md bg-card">
              <DialogHeader className="p-6 pb-4">
                <DialogTitle>Close Enquiry: {Array.isArray(enquiry.subject) ? enquiry.subject.join(', ') : enquiry.subject}</DialogTitle>
                <DialogDescription>
                  Please select a reason for closing this requirement. This action cannot be undone immediately.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4 px-6">
                  <RadioGroup
                    onValueChange={(value: string) => setCloseReason(value)}
                    value={closeReason || ""}
                    className="flex flex-col space-y-2"
                  >
                    {closeReasons.map((reason) => (
                      <div key={reason.id} className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value={reason.label} id={`admin-close-${reason.id}`} />
                        <Label htmlFor={`admin-close-${reason.id}`} className="font-normal text-sm">{reason.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
              </div>
              <DialogFooter className="p-4 border-t-0">
                 <Button 
                  type="button" 
                  onClick={handleConfirmClosure} 
                  disabled={!closeReason || closeEnquiryMutation.isPending}
                  variant="destructive"
                >
                  {closeEnquiryMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Closing...</> : "Confirm Closure"}
                </Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
        
        <AlertDialog open={!!demoToCancel} onOpenChange={(open) => !open && setDemoToCancel(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will cancel the demo session scheduled with {demoToCancel?.demoDetails.tutorName}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Back</AlertDialogCancel>
              <AlertDialogAction onClick={confirmCancelDemo}>Confirm Cancellation</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isReopenModalOpen} onOpenChange={setIsReopenModalOpen}>
            <DialogContent className="sm:max-w-md bg-card">
              <DialogHeader className="p-6 pb-4">
                <DialogTitle>Reopen Enquiry: {Array.isArray(enquiry.subject) ? enquiry.subject.join(', ') : enquiry.subject}</DialogTitle>
                <DialogDescription>
                  Please select a reason for reopening this requirement. This will change the status back to 'Open'.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4 px-6">
                  <RadioGroup
                    onValueChange={(value: string) => setReopenReason(value)}
                    value={reopenReason || ""}
                    className="flex flex-col space-y-2"
                  >
                    {reopenReasons.map((reason) => (
                      <div key={reason.id} className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value={reason.label} id={`admin-reopen-${reason.id}`} />
                        <Label htmlFor={`admin-reopen-${reason.id}`} className="font-normal text-sm">{reason.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
              </div>
              <DialogFooter className="p-4 border-t-0">
                 <Button 
                  type="button" 
                  onClick={handleConfirmReopen} 
                  disabled={!reopenReason || updateStatusMutation.isPending}
                  variant="default"
                >
                  {updateStatusMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Reopening...</> : "Confirm Reopen"}
                </Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
        
        <Dialog open={isSessionDetailsModalOpen} onOpenChange={setIsSessionDetailsModalOpen}>
            <DialogContent className="sm:max-w-md bg-card">
              <DialogHeader className="p-6 pb-4">
                <DialogTitle>Capture Session &amp; Budget</DialogTitle>
                <DialogDescription>
                  Finalize the session details to calculate the monthly budget for this enquiry.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 px-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="sessions-week">Sessions/Week</Label>
                        <Input id="sessions-week" type="number" min="0" value={sessionsPerWeek} onChange={(e) => handleSessionDetailChange('sessions', Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hours-session">Hours/Session</Label>
                        <Input id="hours-session" type="number" min="0" value={hoursPerSession} onChange={(e) => handleSessionDetailChange('hours', Number(e.target.value))} />
                    </div>
                </div>
                
                <Separator />
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Label className="text-sm text-muted-foreground">Estimated Monthly Budget</Label>
                     {!isEditingBudget && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={handleEditBudget}>
                            <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                    )}
                  </div>
                   <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl font-bold">₹</span>
                    {isEditingBudget ? (
                      <Input
                        ref={totalFeesInputRef}
                        id="total-fees-editable"
                        type="number"
                        value={totalFees}
                        onChange={handleTotalFeesChange}
                        onBlur={handleStopEditingBudget}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleStopEditingBudget();
                        }}
                        className="pl-8 text-2xl font-bold text-primary bg-transparent border-0 text-center h-auto p-1 focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        <p className="pl-8 text-2xl font-bold text-primary text-center h-auto p-1">
                          {Math.round(totalFees).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                   <div className="text-xs text-muted-foreground mt-1">
                      Based on ~{totalDays} days &amp; {totalHours} hours. (≈₹{Math.round(precisePerHourRate).toLocaleString()}/hr)
                    </div>
                </div>
              </div>
              <DialogFooter className="p-4 border-t-0">
                <Button type="button" onClick={handleConfirmBudget} disabled={updateBudgetMutation.isPending}>
                    {updateBudgetMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Confirm Budget"}
                </Button>
              </DialogFooter>
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
