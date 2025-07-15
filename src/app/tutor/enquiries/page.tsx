
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { TuitionRequirement, User } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { TutorEnquiryCard } from "@/components/tutor/TutorEnquiryCard"; 
import { FilterIcon as LucideFilterIcon, Star, CheckCircle, Bookmark, ListChecks, ChevronDown, Briefcase, XIcon, BookOpen, Users as UsersIcon, MapPin, RadioTower, XCircle as ErrorIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger as FormSelectTrigger, SelectValue as FormSelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";


const allEnquiryStatusesForPage = ["All Enquiries", "Recommended", "Applied", "Shortlisted"] as const;
type EnquiryStatusCategory = (typeof allEnquiryStatusesForPage)[number];

const fetchTutorEnquiries = async (token: string | null): Promise<TuitionRequirement[]> => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/tutor/enquiries`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch enquiries.");
  }
  
  const data = await response.json();
  
  return data.map((item: any, index: number) => ({
    id: item.enquiryId || `enq-${index}-${Date.now()}`,
    parentId: `p-${index}`, 
    parentName: "A Parent", 
    subject: typeof item.subjects === 'string' ? item.subjects.split(',').map((s: string) => s.trim()) : [],
    gradeLevel: item.grade,
    scheduleDetails: item.initial || "No detailed schedule provided.",
    location: item.location,
    status: "open", 
    postedAt: new Date().toISOString(), 
    board: item.board,
    teachingMode: [
      ...(item.online ? ["Online"] : []),
      ...(item.offline ? ["Offline (In-person)"] : []),
    ],
    applicantsCount: item.appliedTutors,
    // Add mock properties for frontend display logic
    mockIsRecommended: index % 3 === 0,
    mockIsAppliedByCurrentUser: index % 4 === 0,
    mockIsShortlistedByCurrentUser: index % 5 === 0,
  }));
};


export default function AllEnquiriesPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();

  const { data: allOpenRequirements = [], isLoading, error } = useQuery({
    queryKey: ['tutorEnquiries', token],
    queryFn: () => fetchTutorEnquiries(token),
    enabled: !!token && !!user && user.role === 'tutor',
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempSubjectFilter, setTempSubjectFilter] = useState<string[]>([]);
  const [tempGradeFilter, setTempGradeFilter] = useState("All");
  const [tempBoardFilter, setTempBoardFilter] = useState("All");
  const [tempTeachingModeFilter, setTempTeachingModeFilter] = useState<string[]>([]);
  const [tempLocationFilter, setTempLocationFilter] = useState("All");

  const [appliedSubjectFilter, setAppliedSubjectFilter] = useState<string[]>([]);
  const [appliedGradeFilter, setAppliedGradeFilter] = useState("All");
  const [appliedBoardFilter, setAppliedBoardFilter] = useState("All");
  const [appliedLocationFilter, setAppliedLocationFilter] = useState("All");
  const [appliedTeachingModeFilter, setAppliedTeachingModeFilter] = useState<string[]>([]);

  const [activeFilterCategory, setActiveFilterCategory] = useState<EnquiryStatusCategory>('Recommended');

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || user?.role !== 'tutor')) {
      router.replace("/");
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  const uniqueSubjectsForFilter = useMemo(() => {
    const subjects = new Set(allOpenRequirements.flatMap(t => Array.isArray(t.subject) ? t.subject : [t.subject]).filter(Boolean));
    return Array.from(subjects).map(s => ({ value: String(s), label: String(s) }));
  }, [allOpenRequirements]);
  
  const uniqueGradeLevelsForFilter = useMemo(() => {
    const rawGrades = allOpenRequirements.map(t => t.gradeLevel).filter(Boolean);
    const uniqueGradeStrings = Array.from(new Set(rawGrades.map(g => String(g).trim())));
    return [{ value: "All", label: "All Grade Levels" }, ...uniqueGradeStrings.map(g => ({ value: g, label: g }))];
  }, [allOpenRequirements]);
  
  const uniqueBoardsForFilter = useMemo(() => {
    const rawBoards = allOpenRequirements.map(t => t.board).filter(Boolean) as string[];
    const uniqueBoardStrings = Array.from(new Set(rawBoards.map(b => String(b).trim())));
    return [{ value: "All", label: "All Boards" }, ...uniqueBoardStrings.map(b => ({ value: b, label: b }))];
  }, [allOpenRequirements]);
  
  const uniqueLocationsForFilter = useMemo(() => {
    const rawLocations = allOpenRequirements.map(t => t.location).filter(Boolean) as string[];
    const uniqueLocationStrings = Array.from(new Set(rawLocations.map(l => String(l).trim())));
    return [{ value: "All", label: "All Locations" }, ...uniqueLocationStrings.map(l => ({ value: l, label: l }))];
  }, [allOpenRequirements]);

  const teachingModeOptions = [
    { id: "Online", label: "Online" },
    { id: "Offline (In-person)", label: "Offline (In-person)" },
  ];

  const filtersApplied = useMemo(() => {
    return appliedSubjectFilter.length > 0 ||
           appliedGradeFilter !== "All" ||
           appliedBoardFilter !== "All" ||
           appliedLocationFilter !== "All" ||
           appliedTeachingModeFilter.length > 0;
  }, [appliedSubjectFilter, appliedGradeFilter, appliedBoardFilter, appliedLocationFilter, appliedTeachingModeFilter]);

  const categoryCounts = useMemo(() => {
    let baseFiltered = allOpenRequirements.filter(req => {
        const subjectMatch = appliedSubjectFilter.length === 0 || (Array.isArray(req.subject) ? req.subject.some(s => appliedSubjectFilter.includes(s)) : appliedSubjectFilter.includes(req.subject));
        const gradeMatch = appliedGradeFilter === "All" || req.gradeLevel === appliedGradeFilter;
        const boardMatch = appliedBoardFilter === "All" || req.board === appliedBoardFilter;
        const locationMatch = appliedLocationFilter === "All" || req.location === appliedLocationFilter;
        const modeMatch = appliedTeachingModeFilter.length === 0 || (req.teachingMode && req.teachingMode.some(m => appliedTeachingModeFilter.includes(m)));
        return subjectMatch && gradeMatch && boardMatch && locationMatch && modeMatch;
    });
    return {
      "All Enquiries": baseFiltered.length,
      "Recommended": baseFiltered.filter(r => r.mockIsRecommended).length,
      "Applied": baseFiltered.filter(r => r.mockIsAppliedByCurrentUser).length,
      "Shortlisted": baseFiltered.filter(r => r.mockIsShortlistedByCurrentUser).length,
    };
  }, [allOpenRequirements, appliedSubjectFilter, appliedGradeFilter, appliedBoardFilter, appliedLocationFilter, appliedTeachingModeFilter]);

  const filterCategoriesForDropdown: { label: EnquiryStatusCategory; value: EnquiryStatusCategory; icon: React.ElementType; count: number }[] = [
    { label: "All Enquiries", value: "All Enquiries", icon: ListChecks, count: categoryCounts["All Enquiries"] },
    { label: "Recommended", value: "Recommended", icon: Star, count: categoryCounts.Recommended },
    { label: "Applied", value: "Applied", icon: CheckCircle, count: categoryCounts.Applied },
    { label: "Shortlisted", value: "Shortlisted", icon: Bookmark, count: categoryCounts.Shortlisted },
  ];

  const selectedCategoryLabel = useMemo(() => {
    return filterCategoriesForDropdown.find(cat => cat.value === activeFilterCategory)?.label || "Recommended";
  }, [activeFilterCategory, filterCategoriesForDropdown]);

  const filteredRequirements = useMemo(() => {
    let filtered = allOpenRequirements.filter((req) => {
        const subjectMatch = appliedSubjectFilter.length === 0 || (Array.isArray(req.subject) ? req.subject.some(s => appliedSubjectFilter.includes(s)) : appliedSubjectFilter.includes(req.subject));
        const gradeMatch = appliedGradeFilter === "All" || req.gradeLevel === appliedGradeFilter;
        const boardMatch = appliedBoardFilter === "All" || req.board === appliedBoardFilter;
        const locationMatch = appliedLocationFilter === "All" || req.location === appliedLocationFilter;
        const modeMatch = appliedTeachingModeFilter.length === 0 || (req.teachingMode && req.teachingMode.some(m => appliedTeachingModeFilter.includes(m)));
        return subjectMatch && gradeMatch && boardMatch && locationMatch && modeMatch;
    });

    if (activeFilterCategory === 'Recommended') {
      return filtered.filter(req => req.mockIsRecommended);
    }
    if (activeFilterCategory === 'Applied') {
      return filtered.filter(req => req.mockIsAppliedByCurrentUser);
    }
    if (activeFilterCategory === 'Shortlisted') {
      return filtered.filter(req => req.mockIsShortlistedByCurrentUser);
    }
    return filtered; // For "All Enquiries"
  }, [allOpenRequirements, activeFilterCategory, appliedSubjectFilter, appliedGradeFilter, appliedBoardFilter, appliedLocationFilter, appliedTeachingModeFilter]);

  const handleApplyFilters = () => {
    setAppliedSubjectFilter([...tempSubjectFilter]);
    setAppliedGradeFilter(tempGradeFilter);
    setAppliedBoardFilter(tempBoardFilter);
    setAppliedLocationFilter(tempLocationFilter);
    setAppliedTeachingModeFilter([...tempTeachingModeFilter]);
    setIsFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setTempSubjectFilter([]);
    setTempGradeFilter("All");
    setTempBoardFilter("All");
    setTempLocationFilter("All");
    setTempTeachingModeFilter([]);
    setAppliedSubjectFilter([]);
    setAppliedGradeFilter("All");
    setAppliedBoardFilter("All");
    setAppliedLocationFilter("All");
    setAppliedTeachingModeFilter([]);
    setIsFilterDialogOpen(false);
  };
  
  const handleTeachingModeCheckboxChange = (modeValue: string, checked: boolean) => {
    setTempTeachingModeFilter(prev => 
      checked ? [...prev, modeValue] : prev.filter(s => s !== modeValue)
    );
  };

  const renderEnquiryList = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[150px] w-full rounded-lg" />)}
        </div>
      );
    }

    if (error) {
      return (
        <Card className="text-center py-12 bg-destructive/10 border-destructive/20 rounded-lg shadow-sm">
            <CardContent className="flex flex-col items-center">
                <ErrorIcon className="w-16 h-16 text-destructive mx-auto mb-5" />
                <p className="text-xl font-semibold text-destructive mb-1.5">Error Fetching Enquiries</p>
                <p className="text-sm text-destructive/80 max-w-sm mx-auto">Could not load tuition opportunities. Please try again later.</p>
            </CardContent>
        </Card>
      );
    }

    if (filteredRequirements.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {filteredRequirements.map((req, index) => (
            <div
              key={req.id}
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out h-full"
              style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
            >
              <TutorEnquiryCard requirement={req} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <Card className="text-center py-12 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out">
        <CardContent className="flex flex-col items-center">
          <LucideFilterIcon className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Enquiries Found</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            There are no tuition enquiries matching your current filters.
          </p>
           <Button onClick={() => { handleClearFilters(); setActiveFilterCategory('Recommended');}} variant="outline" className="mt-6 text-sm py-2 px-5">
            <XIcon className="w-3.5 h-3.5 mr-1.5" />
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (isCheckingAuth || !user || user.role !== 'tutor') {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 w-full">
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
            <CardHeader className="p-0 mb-4 flex flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-grow min-w-0">
                    <CardTitle className="text-xl font-semibold text-primary flex items-center">
                        <Briefcase className="w-5 h-5 mr-2.5" />
                        Manage Enquiries
                    </CardTitle>
                     <CardDescription className="text-sm text-foreground/70 mt-1">
                        Review and apply to tuition requirements posted by parents.
                    </CardDescription>
                </div>
                <Dialog open={isFilterDialogOpen} onOpenChange={(isOpen) => {
                    if (!isOpen) { 
                      setTempSubjectFilter([...appliedSubjectFilter]);
                      setTempGradeFilter(appliedGradeFilter);
                      setTempBoardFilter(appliedBoardFilter);
                      setTempLocationFilter(appliedLocationFilter);
                      setTempTeachingModeFilter([...appliedTeachingModeFilter]);
                    }
                    setIsFilterDialogOpen(isOpen);
                  }}>
                    <DialogTrigger asChild>
                         <Button
                            variant="default"
                            size="sm"
                            className={cn(
                                "py-2.5 md:px-3 px-2 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90",
                                "text-xs", 
                                filtersApplied && "ring-2 ring-offset-2 ring-primary/70"
                              )}
                            title="Filter Enquiries"
                        >
                            <LucideFilterIcon className="w-4 h-4 opacity-90 md:mr-1.5" />
                            <span className="hidden md:inline">Filter</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-card p-0 rounded-xl overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b">
                        <DialogTitle className="text-lg font-semibold text-primary flex items-center">
                        <LucideFilterIcon className="mr-2 h-5 w-5" /> Filter Enquiries
                        </DialogTitle>
                        <DialogDescription>
                        Refine your search for tuition opportunities.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-1.5">
                            <Label htmlFor="filter-subject-enq" className="text-xs font-medium text-muted-foreground flex items-center"><BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Subject(s)</Label>
                            <MultiSelectCommand
                                options={uniqueSubjectsForFilter}
                                selectedValues={tempSubjectFilter}
                                onValueChange={setTempSubjectFilter}
                                placeholder="Select subjects..."
                                className="bg-input border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg h-auto min-h-9 text-xs"
                            />
                        </div>
                        <div className="space-y-1.5">
                        <Label htmlFor="filter-grade-enq" className="text-xs font-medium text-muted-foreground flex items-center"><UsersIcon className="mr-1.5 h-3.5 w-3.5 text-primary/70" />Grade Level</Label>
                        <Select value={tempGradeFilter} onValueChange={setTempGradeFilter}>
                            <FormSelectTrigger id="filter-grade-enq" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg">
                            <FormSelectValue placeholder="All Grades" />
                            </FormSelectTrigger>
                            <SelectContent>
                            {uniqueGradeLevelsForFilter.map(opt => <SelectItem key={opt.value} value={String(opt.value)} className="text-xs">{String(opt.label)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="space-y-1.5">
                        <Label htmlFor="filter-board-enq" className="text-xs font-medium text-muted-foreground flex items-center"><Briefcase className="mr-1.5 h-3.5 w-3.5 text-primary/70" />Board</Label>
                        <Select value={tempBoardFilter} onValueChange={setTempBoardFilter}>
                            <FormSelectTrigger id="filter-board-enq" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg">
                            <FormSelectValue placeholder="All Boards" />
                            </FormSelectTrigger>
                            <SelectContent>
                            {uniqueBoardsForFilter.map(opt => <SelectItem key={opt.value} value={String(opt.value)} className="text-xs">{String(opt.label)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="filter-location-enq" className="text-xs font-medium text-muted-foreground flex items-center"><MapPin className="mr-1.5 h-3.5 w-3.5 text-primary/70" />Location</Label>
                            <Select value={tempLocationFilter} onValueChange={setTempLocationFilter}>
                                <FormSelectTrigger id="filter-location-enq" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg">
                                    <FormSelectValue placeholder="All Locations" />
                                </FormSelectTrigger>
                                <SelectContent>
                                    {uniqueLocationsForFilter.map(opt => <SelectItem key={opt.value} value={String(opt.value)} className="text-xs">{String(opt.label)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground flex items-center"><RadioTower className="mr-1.5 h-3.5 w-3.5 text-primary/70" />Teaching Mode</Label>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            {teachingModeOptions.map(mode => (
                            <div key={mode.id} className="flex items-center space-x-2">
                                <Checkbox
                                id={`mode-enq-${mode.id}`}
                                checked={tempTeachingModeFilter.includes(mode.id)}
                                onCheckedChange={(checked) => handleTeachingModeCheckboxChange(mode.id, !!checked)}
                                />
                                <Label htmlFor={`mode-enq-${mode.id}`} className="text-xs font-normal text-foreground cursor-pointer">{mode.label}</Label>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    <DialogFooter className="p-6 pt-4 border-t gap-2 sm:justify-between">
                        <Button variant="ghost" onClick={handleClearFilters} className="text-xs text-muted-foreground hover:text-destructive">
                        <XIcon className="mr-1.5 h-3.5 w-3.5" /> Clear All
                        </Button>
                        <Button onClick={handleApplyFilters} className="text-xs">Apply Filters</Button>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
        </Card>
        
        <div className="flex flex-col sm:flex-row items-center justify-end mb-4 sm:mb-6 gap-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                    variant="default"
                    size="sm" 
                    className={cn(
                        "py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto",
                        "text-xs sm:text-sm rounded-[5px]"
                    )}
                >
                    <span className="text-primary-foreground">
                        {selectedCategoryLabel} ({filterCategoriesForDropdown.find(cat => cat.value === activeFilterCategory)?.count || 0})
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-70 text-primary-foreground" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterCategoriesForDropdown.map((category) => (
                    <DropdownMenuItem
                    key={category.value}
                    onClick={() => setActiveFilterCategory(category.value)}
                    className={cn(
                        "text-sm",
                        activeFilterCategory === category.value && "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary hover:text-primary-foreground focus:text-primary-foreground"
                    )}
                    >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.label} ({category.count})
                    </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div className="mt-0"> 
          {renderEnquiryList()}
        </div>
      </div>
    </main>
  );
}
