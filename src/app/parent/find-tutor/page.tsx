
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User, TutorProfile } from "@/types";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { MOCK_TUTOR_PROFILES } from "@/lib/mock-data";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const allSubjectsList: MultiSelectOption[] = [...new Set(MOCK_TUTOR_PROFILES.flatMap(t => Array.isArray(t.subjects) ? t.subjects : [t.subjects]).filter(Boolean))].map(s => ({ value: String(s), label: String(s) }));
const allGradeLevelsList: { value: string; label: string }[] = ["All", ...new Set(MOCK_TUTOR_PROFILES.flatMap(t => Array.isArray(t.gradeLevelsTaught) ? t.gradeLevelsTaught : (t.grade ? [t.grade] : [])).filter(Boolean))].map(g => ({ value: String(g), label: String(g) }));
const allBoardsList: { value: string; label: string }[] = ["All", ...new Set(MOCK_TUTOR_PROFILES.flatMap(t => t.boardsTaught).filter(Boolean))].map(b => ({ value: String(b), label: String(b) }));
const teachingModeOptions: { id: string; label: string }[] = [
  { id: "Online", label: "Online" },
  { id: "Offline (In-person)", label: "Offline (In-person)" },
];

const tutorStatusCategories = [
  { label: "All Tutors", value: "All Tutors", icon: ListFilter },
  { label: "Recommended", value: "Recommended", icon: StarIcon },
  { label: "Demo Requested", value: "Demo Requested", icon: MessageSquareQuote },
  { label: "Shortlisted", value: "Shortlisted", icon: BookmarkIcon },
] as const;
type TutorStatusCategory = typeof tutorStatusCategories[number]['value'];


export default function ParentFindTutorPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();

  const [allTutors, setAllTutors] = useState<TutorProfile[]>([]);

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedTutorForDemo, setSelectedTutorForDemo] = useState<TutorProfile | null>(null);

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempSubjectFilter, setTempSubjectFilter] = useState<string[]>([]);
  const [tempGradeFilter, setTempGradeFilter] = useState("All");
  const [tempBoardFilter, setTempBoardFilter] = useState("All");
  const [tempTeachingModeFilter, setTempTeachingModeFilter] = useState<string[]>([]);
  const [tempFeeRange, setTempFeeRange] = useState<[number, number]>([200, 2000]);

  const [appliedSubjectFilter, setAppliedSubjectFilter] = useState<string[]>([]);
  const [appliedGradeFilter, setAppliedGradeFilter] = useState("All");
  const [appliedBoardFilter, setAppliedBoardFilter] = useState("All");
  const [appliedTeachingModeFilter, setAppliedTeachingModeFilter] = useState<string[]>([]);
  const [appliedFeeRange, setAppliedFeeRange] = useState<[number, number]>([200, 2000]);

  const [activeStatusFilter, setActiveStatusFilter] = useState<TutorStatusCategory>("All Tutors");

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || user?.role !== 'parent')) {
      // router.replace("/"); // Intentionally keeping this commented as per existing file state
    } else if (isAuthenticated && user?.role === 'parent') {
      const tutorsWithMockStatus = MOCK_TUTOR_PROFILES.map((tutor, index) => ({
        ...tutor,
        mockIsRecommendedBySystem: index % 3 === 0, 
        mockIsDemoRequestedByCurrentUser: index % 4 === 0, 
        mockIsShortlistedByCurrentUser: index % 5 === 0, 
      }));
      setAllTutors(tutorsWithMockStatus);
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  const handleApplyDetailedFilters = () => {
    setAppliedSubjectFilter([...tempSubjectFilter]);
    setAppliedGradeFilter(tempGradeFilter);
    setAppliedBoardFilter(tempBoardFilter);
    setAppliedTeachingModeFilter([...tempTeachingModeFilter]);
    setAppliedFeeRange([...tempFeeRange]);
    setIsFilterDialogOpen(false);
    toast({ title: "Filters Applied", description: "Tutor list has been updated." });
  };

  const handleClearDetailedFilters = () => {
    setTempSubjectFilter([]);
    setTempGradeFilter("All");
    setTempBoardFilter("All");
    setTempTeachingModeFilter([]);
    setTempFeeRange([200, 2000]);
    setAppliedSubjectFilter([]);
    setAppliedGradeFilter("All");
    setAppliedBoardFilter("All");
    setAppliedTeachingModeFilter([]);
    setAppliedFeeRange([200, 2000]);
    setIsFilterDialogOpen(false);
    toast({ title: "Filters Cleared", description: "Showing all available tutors." });
  };

  const detailedFiltersApplied = useMemo(() => {
    return (
      appliedSubjectFilter.length > 0 ||
      appliedGradeFilter !== "All" ||
      appliedBoardFilter !== "All" ||
      appliedTeachingModeFilter.length > 0 ||
      appliedFeeRange[0] !== 200 ||
      appliedFeeRange[1] !== 2000
    );
  }, [appliedSubjectFilter, appliedGradeFilter, appliedBoardFilter, appliedTeachingModeFilter, appliedFeeRange]);

  const tutorsFilteredByDialog = useMemo(() => {
    return allTutors.filter((tutor) => {
      const matchesSubject = appliedSubjectFilter.length === 0 || (Array.isArray(tutor.subjects) && tutor.subjects.some(sub => appliedSubjectFilter.includes(String(sub))));
      const matchesGrade = appliedGradeFilter === "All" || (Array.isArray(tutor.gradeLevelsTaught) && tutor.gradeLevelsTaught.includes(appliedGradeFilter)) || (tutor.grade === appliedGradeFilter);
      const matchesBoard = appliedBoardFilter === "All" || (Array.isArray(tutor.boardsTaught) && tutor.boardsTaught.includes(appliedBoardFilter));

      let matchesMode = true;
      if (appliedTeachingModeFilter.length > 0) {
        matchesMode = appliedTeachingModeFilter.some(mode => tutor.teachingMode?.includes(mode));
      }

      const minTutorRate = parseFloat(tutor.minHourlyRate || "0");
      const maxTutorRate = parseFloat(tutor.maxHourlyRate || "999999");
      const matchesFee = appliedFeeRange[0] <= maxTutorRate && appliedFeeRange[1] >= minTutorRate;

      return matchesSubject && matchesGrade && matchesBoard && matchesMode && matchesFee;
    });
  }, [allTutors, appliedSubjectFilter, appliedGradeFilter, appliedBoardFilter, appliedTeachingModeFilter, appliedFeeRange]);

  const statusCategoryCounts = useMemo(() => {
    return {
      "All Tutors": tutorsFilteredByDialog.length,
      "Recommended": tutorsFilteredByDialog.filter(t => t.mockIsRecommendedBySystem).length,
      "Demo Requested": tutorsFilteredByDialog.filter(t => t.mockIsDemoRequestedByCurrentUser).length,
      "Shortlisted": tutorsFilteredByDialog.filter(t => t.mockIsShortlistedByCurrentUser).length,
    };
  }, [tutorsFilteredByDialog]);

  const filteredTutors = useMemo(() => {
    if (activeStatusFilter === "All Tutors") return tutorsFilteredByDialog;
    return tutorsFilteredByDialog.filter(tutor => {
      if (activeStatusFilter === "Recommended") return tutor.mockIsRecommendedBySystem;
      if (activeStatusFilter === "Demo Requested") return tutor.mockIsDemoRequestedByCurrentUser;
      if (activeStatusFilter === "Shortlisted") return tutor.mockIsShortlistedByCurrentUser;
      return true;
    });
  }, [tutorsFilteredByDialog, activeStatusFilter]);


  const handleScheduleDemoClick = (tutorToSchedule: TutorProfile) => {
    setSelectedTutorForDemo(tutorToSchedule);
    setIsDemoModalOpen(true);
  };

  const handleDemoRequestSuccess = () => {
    setIsDemoModalOpen(false);
    setSelectedTutorForDemo(null);
    if (selectedTutorForDemo) {
      setAllTutors(prevTutors => prevTutors.map(t => 
        t.id === selectedTutorForDemo.id ? { ...t, mockIsDemoRequestedByCurrentUser: true } : t
      ));
    }
    toast({
      title: "Demo Request Sent!",
      description: "The tutor will be notified of your demo request.",
    });
  };

  if (isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }
  
  const parentContextBaseUrl: string | undefined = 
    isAuthenticated && user?.role === 'parent' ? "/parent/tutors" : undefined;

  const selectedCategoryData = tutorStatusCategories.find(cat => cat.value === activeStatusFilter);

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 w-full">
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
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
                    <div className="space-y-1.5">
                      <Label htmlFor="filter-subject" className="text-xs font-medium text-muted-foreground flex items-center">
                        <BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary/70" />Subject(s)
                      </Label>
                      <MultiSelectCommand
                        options={allSubjectsList}
                        selectedValues={tempSubjectFilter}
                        onValueChange={setTempSubjectFilter}
                        placeholder="Select subjects..."
                        className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="filter-grade" className="text-xs font-medium text-muted-foreground flex items-center">
                          <GraduationCap className="mr-1.5 h-3.5 w-3.5 text-primary/70" />Grade Level
                        </Label>
                        <Select value={tempGradeFilter} onValueChange={setTempGradeFilter}>
                          <FormSelectTrigger id="filter-grade" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm rounded-lg">
                            <FormSelectValue placeholder="All Grade Levels" />
                          </FormSelectTrigger>
                          <SelectContent>
                            {allGradeLevelsList.map(opt => <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="filter-board" className="text-xs font-medium text-muted-foreground flex items-center">
                          <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-primary/70" />Board
                        </Label>
                        <Select value={tempBoardFilter} onValueChange={setTempBoardFilter}>
                          <FormSelectTrigger id="filter-board" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm rounded-lg">
                            <FormSelectValue placeholder="All Boards" />
                          </FormSelectTrigger>
                          <SelectContent>
                            {allBoardsList.map(opt => <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground flex items-center">
                        <RadioTower className="mr-1.5 h-3.5 w-3.5 text-primary/70" />Teaching Mode
                      </Label>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {teachingModeOptions.map(mode => (
                          <div key={mode.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mode-filter-${mode.id}`}
                              checked={tempTeachingModeFilter.includes(mode.id)}
                              onCheckedChange={(checked) => {
                                setTempTeachingModeFilter(prev =>
                                  checked ? [...prev, mode.id] : prev.filter(s => s !== mode.id)
                                );
                              }}
                            />
                            <Label htmlFor={`mode-filter-${mode.id}`} className="text-xs font-normal text-foreground cursor-pointer">{mode.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2.5 pt-1">
                      <Label className="text-xs font-medium text-muted-foreground flex items-center">
                        <DollarSign className="mr-1.5 h-3.5 w-3.5 text-primary/70" />Hourly Fee Range (₹)
                      </Label>
                      <div className="text-xs text-foreground/80 font-medium text-center pb-1">
                        ₹{tempFeeRange[0]} – ₹{tempFeeRange[1]}
                      </div>
                      <Slider
                        min={200}
                        max={2000}
                        step={50}
                        value={tempFeeRange}
                        onValueChange={(value: number[]) => setTempFeeRange(value as [number, number])}
                        className="w-full"
                      />
                    </div>
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

        <div className="flex justify-end mb-4 sm:mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <span>
                  {selectedCategoryData?.label || "Filter"} ({selectedCategoryData ? statusCategoryCounts[selectedCategoryData.value] : 'N/A'})
                </span>
                <ChevronDown className="w-4 h-4 opacity-70 text-primary-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tutorStatusCategories.map((category) => (
                <DropdownMenuItem
                  key={category.value}
                  onClick={() => setActiveStatusFilter(category.value)}
                  className={cn(
                    "text-sm",
                    activeStatusFilter === category.value && "bg-primary text-primary-foreground"
                  )}
                >
                  <category.icon className="mr-2 h-4 w-4" />
                  {category.label} ({statusCategoryCounts[category.value]})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredTutors.map((tutor) => (
              <div key={tutor.id} className="relative group">
                <TutorProfileCard
                  tutor={tutor}
                  parentContextBaseUrl={parentContextBaseUrl}
                  hideRating={false} 
                  showFullName={true} 
                  showShortlistButton={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 bg-card border rounded-lg shadow-sm">
            <CardContent className="flex flex-col items-center">
              <ListFilter className="w-16 h-16 text-primary/30 mx-auto mb-5" />
              <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Tutors Found</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Try adjusting your search or filter criteria.
              </p>
              {(detailedFiltersApplied || activeStatusFilter !== "All Tutors") && (
                <Button onClick={() => { handleClearDetailedFilters(); setActiveStatusFilter("All Tutors"); }} variant="outline" className="mt-6 text-sm py-2 px-5">
                  <XIcon className="w-3.5 h-3.5 mr-1.5" /> Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
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
              onSuccess={handleDemoRequestSuccess}
              enquiryContext={undefined} 
            />
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
    
