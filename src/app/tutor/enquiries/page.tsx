
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { TuitionRequirement } from "@/types";
import { Button } from "@/components/ui/button";
import { TutorEnquiryCard } from "@/components/tutor/TutorEnquiryCard";
import {
  FilterIcon,
  Star,
  CheckCircle,
  Briefcase,
  XIcon,
  BookOpen,
  Users as UsersIcon,
  MapPin,
  RadioTower,
  XCircle as ErrorIcon,
  Loader2,
  ChevronDown,
  Building,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger as FormSelectTrigger,
  SelectValue as FormSelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  MultiSelectCommand,
  type Option as MultiSelectOption,
} from "@/components/ui/multi-select-command";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useQuery } from "@tanstack/react-query";
import {
  allSubjectsList as allSubjectsConstant,
  boardsList as boardsConstant,
  teachingModeOptions,
} from "@/lib/constants";
import { useGlobalLoader } from "@/hooks/use-global-loader";

const allEnquiryStatusesForPage = ["Recommended", "Applied", "Assigned"] as const;
type EnquiryStatusCategory = (typeof allEnquiryStatusesForPage)[number];

const fetchTutorEnquiries = async (
  token: string | null,
  category: EnquiryStatusCategory
): Promise<TuitionRequirement[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const apiCategory = category.toUpperCase();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(
    `${apiBaseUrl}/api/search/enquiries/${apiCategory}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch enquiries.");
  }

  const data = await response.json();

  return data.map((item: any) => ({
    id: item.enquiryId,
    parentId: `p-${item.enquiryId}`, // Mock parentId
    parentName: "A Parent",
    studentName: item.studentName,
    subject:
      typeof item.subjects === "string"
        ? item.subjects.split(",").map((s: string) => s.trim())
        : [],
    gradeLevel: item.grade,
    scheduleDetails: "Details not provided by API",
    location: [item.area, item.city, item.country].filter(Boolean).join(", "),
    status: item.status?.toLowerCase() || "open",
    postedAt: item.createdOn || new Date().toISOString(),
    board: item.board,
    teachingMode: [
      ...(item.online ? ["Online"] : []),
      ...(item.offline ? ["Offline (In-person)"] : []),
    ],
    applicantsCount: item.assignedTutors || 0,
  }));
};

export default function AllEnquiriesPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { showLoader, hideLoader } = useGlobalLoader();

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

  const [activeFilterCategory, setActiveFilterCategory] =
    useState<EnquiryStatusCategory>("Recommended");

  const {
    data: allOpenRequirements = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tutorEnquiries", token, activeFilterCategory],
    queryFn: () => fetchTutorEnquiries(token, activeFilterCategory),
    enabled: !!token && !!user && user.role === "tutor" && !!activeFilterCategory,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading) {
      showLoader("Fetching enquiries...");
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);


  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || user?.role !== "tutor")) {
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

  const filtersApplied = useMemo(() => {
    return (
      appliedSubjectFilter.length > 0 ||
      appliedGradeFilter !== "All" ||
      appliedBoardFilter !== "All" ||
      appliedLocationFilter !== "All" ||
      appliedTeachingModeFilter.length > 0
    );
  }, [
    appliedSubjectFilter,
    appliedGradeFilter,
    appliedBoardFilter,
    appliedLocationFilter,
    appliedTeachingModeFilter,
  ]);

    const categoryCounts = useMemo(() => {
    // Since API does the filtering, we assume the length of the fetched data is the count.
    // This is a simplification. For accurate counts for *all* categories, we'd need a separate summary API call.
    // For now, we'll just show the count for the active category.
    const counts = { Recommended: 0, Applied: 0, Assigned: 0 };
    if (activeFilterCategory === 'Recommended') counts.Recommended = allOpenRequirements.length;
    if (activeFilterCategory === 'Applied') counts.Applied = allOpenRequirements.length;
    if (activeFilterCategory === 'Assigned') counts.Assigned = allOpenRequirements.length;
    return counts;
  }, [allOpenRequirements, activeFilterCategory]);

  const filterCategoriesForDropdown: {
    label: EnquiryStatusCategory;
    value: EnquiryStatusCategory;
    icon: React.ElementType;
  }[] = [
    { label: "Recommended", value: "Recommended", icon: Star },
    { label: "Applied", value: "Applied", icon: CheckCircle },
    { label: "Assigned", value: "Assigned", icon: UsersIcon },
  ];

  const selectedCategoryLabel = useMemo(() => {
    return filterCategoriesForDropdown.find(cat => cat.value === activeFilterCategory)?.label || "Recommended";
  }, [activeFilterCategory, filterCategoriesForDropdown]);


  const filteredRequirements = useMemo(() => {
    return allOpenRequirements.filter((req) => {
        const subjectMatch = appliedSubjectFilter.length === 0 || (Array.isArray(req.subject) ? req.subject.some(s => appliedSubjectFilter.includes(s)) : appliedSubjectFilter.includes(req.subject));
        const gradeMatch = appliedGradeFilter === "All" || req.gradeLevel === appliedGradeFilter;
        const boardMatch = appliedBoardFilter === "All" || req.board === appliedBoardFilter;
        const locationMatch = appliedLocationFilter === "All" || req.location === appliedLocationFilter;
        const modeMatch = appliedTeachingModeFilter.length === 0 || (req.teachingMode && req.teachingMode.some(m => appliedTeachingModeFilter.includes(m)));
        return subjectMatch && gradeMatch && boardMatch && locationMatch && modeMatch;
    });
  }, [allOpenRequirements, appliedSubjectFilter, appliedGradeFilter, appliedBoardFilter, appliedLocationFilter, appliedTeachingModeFilter]);


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
      return null; // The global loader will be shown
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
      <Card className="text-center py-12 bg-card border-0 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-500 ease-out">
        <CardContent className="flex flex-col items-center">
          <FilterIcon className="w-16 h-16 text-primary/30 mx-auto mb-5" />
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
        <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
            <CardHeader className="p-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-grow min-w-0">
                    <CardTitle className="text-xl font-semibold text-primary flex items-center">
                        <Briefcase className="w-5 h-5 mr-2.5" />
                        Manage Enquiries
                    </CardTitle>
                     <CardDescription className="text-sm text-foreground/70 mt-1">
                        Review and apply to tuition requirements posted by parents.
                    </CardDescription>
                </div>
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
                            {selectedCategoryLabel} 
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
                        {category.label}
                        </DropdownMenuItem>
                    ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
        </Card>
        
        <div className="mt-0"> 
          {renderEnquiryList()}
        </div>
      </div>
    </main>
  );
}
