
// src/app/tutor/enquiries/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { TuitionRequirement, TutorProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { TuitionRequirementCard } from "@/components/tuitions/TuitionRequirementCard";
import { FilterIcon as LucideFilterIcon, Star, CheckCircle, Bookmark, ListChecks, ChevronDown, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle as DialogTitleComponent, DialogDescription as DialogDescriptionComponent, DialogFooter as DialogFooterComponent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger as FormSelectTrigger, SelectValue as FormSelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Input } from "@/components/ui/input"; // Keep for potential future use in dialog

const allEnquiryStatuses = ["All Enquiries", "Recommended", "Applied", "Shortlisted"] as const;
type EnquiryStatusCategory = typeof allEnquiryStatuses[number];

// Mock data - replace with actual data fetching
const allSubjectsList = [...new Set(MOCK_ALL_PARENT_REQUIREMENTS.flatMap(t => Array.isArray(t.subject) ? t.subject : [t.subject]))].filter(Boolean);
const allGradeLevelsList = ["All", ...new Set(MOCK_ALL_PARENT_REQUIREMENTS.map(t => t.gradeLevel))].filter(Boolean);
const allBoardsList = ["All", ...new Set(MOCK_ALL_PARENT_REQUIREMENTS.map(t => t.board).filter(Boolean) as string[])];
const allLocationsList = ["All", ...new Set(MOCK_ALL_PARENT_REQUIREMENTS.map(t => t.location).filter(Boolean) as string[])];
const allTeachingModesList = ["All", "Online", "Offline (In-person)"];


export default function AllEnquiriesPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const [allOpenRequirements, setAllOpenRequirements] = useState<TuitionRequirement[]>([]);
  
  // Filters for the dialog
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempSubjectFilter, setTempSubjectFilter] = useState<string[]>([]);
  const [tempGradeFilter, setTempGradeFilter] = useState("All");
  const [tempBoardFilter, setTempBoardFilter] = useState("All");
  const [tempLocationFilter, setTempLocationFilter] = useState("All");
  const [tempTeachingModeFilter, setTempTeachingModeFilter] = useState<string[]>([]);

  // Applied filters
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

  useEffect(() => {
    setAllOpenRequirements(MOCK_ALL_PARENT_REQUIREMENTS.filter(r => r.status === 'open'));
  }, []);

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

  const renderEnquiryList = (requirementsToRender: TuitionRequirement[]) => {
    if (requirementsToRender.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {requirementsToRender.map((req, index) => (
            <div
              key={req.id}
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out h-full"
              style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
            >
              <TuitionRequirementCard requirement={req} showActions={false} isParentContext={false} />
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

  if (isCheckingAuth || !isAuthenticated || user?.role !== 'tutor') {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-primary flex items-center">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mr-2.5"/>Manage Enquiries
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-foreground/70 mt-1 ml-[calc(1.25rem+0.625rem)] sm:ml-0 sm:mt-1">
              Review and apply to tuition requirements posted by parents.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
              {/* Group for Filter Icon Button */}
              <div className="w-full sm:w-auto flex items-center gap-3">
                 <Dialog open={isFilterDialogOpen} onOpenChange={(isOpen) => {
                    if (!isOpen) { // Reset temp filters if dialog is closed without applying
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
                            variant={filtersApplied ? "default" : "outline"}
                            size="icon"
                            className={cn(
                                "h-11 w-11 shrink-0", 
                                "sm:h-11 sm:w-auto sm:px-4 sm:py-3 border-border hover:border-primary",
                                filtersApplied ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-card hover:bg-primary/10 hover:text-primary",
                                "transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center gap-1.5"
                            )}
                        >
                            <LucideFilterIcon className="h-4 w-4" />
                            <span className="hidden sm:inline text-sm">Filter</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-card p-0 rounded-xl overflow-hidden">
                      <DialogHeader className="p-6 pb-4 border-b">
                        <DialogTitleComponent className="text-lg font-semibold text-primary flex items-center">
                            <LucideFilterIcon className="mr-2 h-5 w-5" /> Filter Enquiries
                        </DialogTitleComponent>
                        <DialogDescriptionComponent>
                            Refine your search for tuition opportunities.
                        </DialogDescriptionComponent>
                      </DialogHeader>
                      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        {/* Form fields for filters */}
                        <div className="space-y-1.5">
                            <Label htmlFor="filter-subject-enq" className="text-xs font-medium text-muted-foreground flex items-center"><BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Subject(s)</Label>
                            <Input // Placeholder for multi-select for now
                                id="filter-subject-enq"
                                placeholder="Subject filter coming soon"
                                disabled
                                className="text-xs h-9"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="filter-grade-enq" className="text-xs font-medium text-muted-foreground flex items-center"><UsersIcon className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Grade Level</Label>
                             <FormSelectTrigger id="filter-grade-enq" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg">
                                <FormSelectValue placeholder="All Grades" />
                             </FormSelectTrigger>
                        </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="filter-board-enq" className="text-xs font-medium text-muted-foreground flex items-center"><Briefcase className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Board</Label>
                             <FormSelectTrigger id="filter-board-enq" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg">
                                <FormSelectValue placeholder="All Boards" />
                             </FormSelectTrigger>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground flex items-center"><LucideFilterIcon className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Teaching Mode</Label>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                {allTeachingModesList.filter(m => m !== "All").map(mode => (
                                    <div key={mode} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`mode-enq-${mode}`}
                                        />
                                        <Label htmlFor={`mode-enq-${mode}`} className="text-xs font-normal text-foreground cursor-pointer">{mode}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                      </div>
                      <DialogFooterComponent className="p-6 pt-4 border-t gap-2 sm:justify-between">
                        <Button variant="ghost" onClick={handleClearFilters} className="text-xs text-muted-foreground hover:text-destructive">
                            <XIcon className="mr-1.5 h-3.5 w-3.5" /> Clear All
                        </Button>
                        <Button onClick={handleApplyFilters} className="text-xs">Apply Filters</Button>
                      </DialogFooterComponent>
                    </DialogContent>
                </Dialog>
              </div>

              {/* Filter by Category Dropdown */}
              <div className="w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      className="w-full sm:w-auto text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-11 bg-primary text-primary-foreground hover:bg-primary/90"
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
                          activeFilterCategory === category.value && "bg-primary text-primary-foreground"
                        )}
                      >
                        <category.icon className="mr-2 h-4 w-4" />
                        {category.label} ({category.count})
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          {renderEnquiryList(filteredRequirements)}
        </div>
      </div>
    </main>
  );
}
