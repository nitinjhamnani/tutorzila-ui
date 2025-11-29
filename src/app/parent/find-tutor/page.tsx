
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User, TutorProfile } from "@/types";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger as FormSelectTrigger,
  SelectValue as FormSelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { TutorProfileCard } from "@/components/tutors/TutorProfileCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { ScheduleDemoRequestModal } from "@/components/modals/ScheduleDemoRequestModal";
import {
  Search,
  FilterIcon as LucideFilterIcon,
  XIcon,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  RadioTower,
  MapPin,
  DollarSign,
  ListFilter,
  CalendarDays,
  MessageSquareQuote,
  Star as StarIcon, 
  Bookmark as BookmarkIcon, 
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { boardsList as boardsConstant } from '@/lib/constants';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ApiTutorResponse {
  tutorId: string;
  tutorName: string;
  subjects: string;
  grades: string;
  boards: string;
  city: string;
  state: string;
  gender: string;
  online: boolean;
  offline: boolean;
}

const fetchTutors = async (token: string | null): Promise<TutorProfile[]> => {
  if (!token) throw new Error("Authentication is required.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/parent/tutors`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tutors.');
  }

  const data: ApiTutorResponse[] = await response.json();

  // Transform API data to TutorProfile[]
  return data.map((apiTutor) => ({
    id: apiTutor.tutorId,
    name: apiTutor.tutorName,
    email: "", 
    role: "tutor",
    subjects: apiTutor.subjects ? apiTutor.subjects.split(',').map(s => s.trim()) : [],
    gradeLevelsTaught: apiTutor.grades ? apiTutor.grades.split(',').map(g => g.trim()) : [],
    boardsTaught: apiTutor.boards ? apiTutor.boards.split(',').map(b => b.trim()) : [],
    location: [apiTutor.city, apiTutor.state].filter(Boolean).join(', '),
    gender: apiTutor.gender.toLowerCase() as "male" | "female" | "other",
    teachingMode: [
        ...(apiTutor.online ? ["Online"] : []),
        ...(apiTutor.offline ? ["Offline (In-person)"] : [])
    ],
    // The following fields are not in the API response and should not be relied upon.
    // They are set to default values to satisfy the TutorProfile type.
    experience: "",
    hourlyRate: "",
    bio: "",
    qualifications: [],
    rating: 0,
    status: "Active",
  }));
};


const modeOptionsList: { value: string; label: string }[] = [
  { value: "All", label: "All Modes" },
  { value: "Online", label: "Online" },
  { value: "Offline (In-person)", label: "Offline (In-person)" },
];

const boardsList: { value: string, label: string }[] = ["All", ...boardsConstant].map(b => ({value: b, label: b}));


export default function ParentFindTutorPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const { hideLoader } = useGlobalLoader();

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedTutorForDemo, setSelectedTutorForDemo] = useState<TutorProfile | null>(null);

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempSubjectFilter, setTempSubjectFilter] = useState<string[]>([]);
  const [tempGradeFilter, setTempGradeFilter] = useState("All");
  const [tempBoardFilter, setTempBoardFilter] = useState("All");
  const [tempTeachingModeFilter, setTempTeachingModeFilter] = useState<string[]>([]);

  const [appliedSubjectFilter, setAppliedSubjectFilter] = useState<string[]>([]);
  const [appliedGradeFilter, setAppliedGradeFilter] = useState("All");
  const [appliedBoardFilter, setAppliedBoardFilter] = useState("All");
  const [appliedTeachingModeFilter, setAppliedTeachingModeFilter] = useState<string[]>([]);
  
  const [locationSearchTerm, setLocationSearchTerm] = useState("");

  const { data: tutorProfiles = [], isLoading: isLoadingTutors, error: tutorsError } = useQuery({
    queryKey: ['parentTutors', token],
    queryFn: () => fetchTutors(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    hideLoader();
  }, [hideLoader, isLoadingTutors]);

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || user?.role !== 'parent')) {
      router.replace("/");
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  const uniqueSubjectsForFilter = useMemo(() => {
    const subjects = new Set(tutorProfiles.flatMap(t => t.subjects).filter(Boolean));
    return Array.from(subjects).map(s => ({ value: String(s), label: String(s) }));
  }, [tutorProfiles]);

  const uniqueGradeLevelsForFilter = useMemo(() => {
    const grades = new Set(tutorProfiles.flatMap(t => t.gradeLevelsTaught).filter(Boolean));
    return [{ value: "All", label: "All Grade Levels" }, ...Array.from(grades).map(g => ({ value: String(g), label: String(g) }))];
  }, [tutorProfiles]);

  const handleApplyDetailedFilters = () => {
    setAppliedSubjectFilter([...tempSubjectFilter]);
    setAppliedGradeFilter(tempGradeFilter);
    setAppliedBoardFilter(tempBoardFilter);
    setAppliedTeachingModeFilter([...tempTeachingModeFilter]);
    setIsFilterDialogOpen(false);
    toast({ title: "Filters Applied", description: "Tutor list has been updated." });
  };

  const handleClearDetailedFilters = () => {
    setTempSubjectFilter([]);
    setTempGradeFilter("All");
    setTempBoardFilter("All");
    setTempTeachingModeFilter([]);
    setAppliedSubjectFilter([]);
    setAppliedGradeFilter("All");
    setAppliedBoardFilter("All");
    setAppliedTeachingModeFilter([]);
    setLocationSearchTerm("");
    setIsFilterDialogOpen(false);
    toast({ title: "Filters Cleared", description: "Showing all available tutors." });
  };

  const detailedFiltersApplied = useMemo(() => {
    return (
      appliedSubjectFilter.length > 0 ||
      appliedGradeFilter !== "All" ||
      appliedBoardFilter !== "All" ||
      appliedTeachingModeFilter.length > 0 ||
      locationSearchTerm !== ""
    );
  }, [appliedSubjectFilter, appliedGradeFilter, appliedBoardFilter, appliedTeachingModeFilter, locationSearchTerm]);

  const filteredTutors = useMemo(() => {
    return tutorProfiles.filter((tutor) => {
      const locationSearchTermLower = locationSearchTerm.toLowerCase();
      const matchesLocationSearch = locationSearchTerm === "" || (tutor.location && tutor.location.toLowerCase().includes(locationSearchTermLower));

      const matchesSubject = appliedSubjectFilter.length === 0 || (Array.isArray(tutor.subjects) && tutor.subjects.some(sub => appliedSubjectFilter.includes(String(sub))));
      const matchesGrade = appliedGradeFilter === "All" || (Array.isArray(tutor.gradeLevelsTaught) && tutor.gradeLevelsTaught.includes(appliedGradeFilter)) || (tutor.grade === appliedGradeFilter);
      const matchesBoard = appliedBoardFilter === "All" || (Array.isArray(tutor.boardsTaught) && tutor.boardsTaught.includes(appliedBoardFilter));

      let matchesMode = true;
      if (appliedTeachingModeFilter.length > 0) {
        matchesMode = appliedTeachingModeFilter.some(mode => tutor.teachingMode?.includes(mode));
      }

      return matchesSubject && matchesGrade && matchesBoard && matchesMode && matchesLocationSearch;
    });
  }, [tutorProfiles, appliedSubjectFilter, appliedGradeFilter, appliedBoardFilter, appliedTeachingModeFilter, locationSearchTerm]);


  const handleScheduleDemoClick = (tutorToSchedule: TutorProfile) => {
    setSelectedTutorForDemo(tutorToSchedule);
    setIsDemoModalOpen(true);
  };

  const handleDemoRequestSuccess = () => {
    setIsDemoModalOpen(false);
    setSelectedTutorForDemo(null);
    if (selectedTutorForDemo) {
      // In a real app with API, you'd invalidate queries.
      // Here, we just give a toast.
    }
    toast({
      title: "Demo Request Sent!",
      description: "The tutor will be notified of your demo request.",
    });
  };
  
  if (isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  const parentContextBaseUrl: string | undefined = 
    isAuthenticated && user?.role === 'parent' ? "/parent/tutors" : undefined;

  const renderTutorList = () => {
    if (isLoadingTutors) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="w-full h-[280px] p-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-14 h-14 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (tutorsError) {
        return (
            <Card className="text-center py-12 bg-destructive/10 border-destructive/20 rounded-lg shadow-sm">
                <CardContent className="flex flex-col items-center">
                    <p className="text-xl font-semibold text-destructive mb-1.5">Error Fetching Tutors</p>
                    <p className="text-sm text-destructive/80 max-w-sm mx-auto">{(tutorsError as Error).message}</p>
                </CardContent>
            </Card>
        );
    }
    
    if (filteredTutors.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredTutors.map((tutor) => (
            <div key={tutor.id} className="relative group">
              <TutorProfileCard
                tutor={tutor}
                parentContextBaseUrl={parentContextBaseUrl}
                hideRating={false} 
                showFullName={true} 
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <Card className="text-center py-12 bg-card border rounded-lg shadow-sm">
        <CardContent className="flex flex-col items-center">
          <ListFilter className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Tutors Found</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search or filter criteria.
          </p>
          {(detailedFiltersApplied) && (
            <Button onClick={handleClearDetailedFilters} variant="outline" className="mt-6 text-sm py-2 px-5">
              <XIcon className="w-3.5 h-3.5 mr-1.5" /> Clear All Filters
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const filterPanelContent = (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="location-search-filter" className="text-xs font-medium text-muted-foreground flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>Location
        </Label>
        <Input
          type="search"
          id="location-search-filter"
          placeholder="Enter city, area..."
          value={locationSearchTerm}
          onChange={(e) => setLocationSearchTerm(e.target.value)}
          className="h-9 text-xs bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm rounded-lg"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subject-multi-filter" className="text-xs font-medium text-muted-foreground flex items-center">
          <BookOpen className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>Subjects
        </Label>
        <MultiSelectCommand
          options={uniqueSubjectsForFilter}
          selectedValues={tempSubjectFilter}
          onValueChange={setTempSubjectFilter}
          placeholder="Select subjects..."
          className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm rounded-lg h-auto min-h-9 text-xs" 
        />
      </div>
      <FilterItem icon={GraduationCap} label="Grade Level" value={tempGradeFilter} onValueChange={setTempGradeFilter} options={uniqueGradeLevelsForFilter} />
      <FilterItem icon={ShieldCheck} label="Board" value={tempBoardFilter} onValueChange={setTempBoardFilter} options={boardsList} />
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground flex items-center">
          <RadioTower className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>Teaching Mode
        </Label>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {modeOptionsList.slice(1).map(mode => ( // Exclude "All"
            <div key={mode.value} className="flex items-center space-x-2">
              <Checkbox
                id={`mode-filter-${mode.value}`}
                checked={tempTeachingModeFilter.includes(mode.value)}
                onCheckedChange={(checked) => {
                  setTempTeachingModeFilter(prev =>
                    checked ? [...prev, mode.value] : prev.filter(s => s !== mode.value)
                  );
                }}
              />
              <Label htmlFor={`mode-filter-${mode.value}`} className="text-xs font-normal text-foreground cursor-pointer">{mode.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 w-full">
        <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <Search className="w-5 h-5 mr-2.5" />
                Find Your Perfect Tutor
              </CardTitle>
              <CardDescription className="text-sm text-foreground/70 mt-1">
                Browse profiles and filter to find tutors matching your needs.
              </CardDescription>
            </div>
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className={cn(
                    "text-xs py-2.5 md:px-3 px-2 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto",
                    detailedFiltersApplied && "ring-2 ring-offset-2 ring-primary/70"
                  )}
                >
                  <LucideFilterIcon className="w-4 h-4 opacity-90 md:mr-1.5" />
                  <span className="hidden md:inline">Filter Tutors</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg bg-card p-0 rounded-xl overflow-hidden">
                <DialogHeader className="p-6 pb-4 border-b">
                  <DialogTitle className="text-lg font-semibold text-primary flex items-center">
                    <LucideFilterIcon className="mr-2 h-5 w-5" /> Filter Tutors
                  </DialogTitle>
                  <DialogDescription>
                    Refine your search for tutors based on your preferences.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                  <div className="p-6 space-y-4">
                    {filterPanelContent}
                  </div>
                </ScrollArea>
                <DialogFooter className="p-6 pt-4 border-t gap-2 sm:justify-between">
                  <Button variant="ghost" onClick={handleClearDetailedFilters} className="text-xs text-muted-foreground hover:text-destructive">
                    <XIcon className="mr-1.5 h-3.5 w-3.5" /> Clear All
                  </Button>
                  <Button onClick={handleApplyDetailedFilters} className="text-xs bg-primary text-primary-foreground hover:bg-primary/90">Apply Filters</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-0 mt-4">
          </CardContent>
        </Card>

        {renderTutorList()}
      </div>
      {selectedTutorForDemo && user && (
        <Dialog open={isDemoModalOpen} onOpenChange={setIsDemoModalOpen}>
          <DialogContent className="sm:max-w-xl bg-card p-0 rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
            <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <MessageSquareQuote className="w-5 h-5" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-semibold text-foreground">
                         Request a Demo with {selectedTutorForDemo.name}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                         Fill in your preferred details for the demo session.
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>
            <ScheduleDemoRequestModal
              tutor={selectedTutorForDemo}
              parentUser={user}
              enquiryContext={undefined} 
              onSuccess={handleDemoRequestSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}

interface FilterItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: {value: string, label: string}[];
}

function FilterItem({ icon: Icon, label, value, onValueChange, options }: FilterItemProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`} className="text-xs font-medium text-muted-foreground flex items-center">
        <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>{label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <FormSelectTrigger
          id={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`}
          className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm rounded-lg h-9 text-xs"
        >
          <FormSelectValue />
        </FormSelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[180px]">
            {options.map(opt => <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>)}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
}
