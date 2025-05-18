// src/app/tutor/demo-sessions/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadCNCardDescription } from "@/components/ui/card"; // Renamed CardDescription to avoid conflict
import { CalendarDays, CheckCircle, ChevronDown, ListFilter, MessageSquareQuote, PlusCircle, XCircle, Clock, FilterIcon as LucideFilterIcon, Star, Users as UsersIcon, BookOpen, Search } from "lucide-react"; // Added Search
import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard";
import type { DemoSession, TutorProfile } from "@/types";
import { cn } from "@/lib/utils";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogTitleComponent, DialogDescription as DialogDescriptionComponent, DialogFooter } from "@/components/ui/dialog"; // Renamed DialogTitle & DialogDescription
import { Select, SelectContent as FormSelectContent, SelectItem as FormSelectItem, SelectTrigger as FormSelectTrigger, SelectValue as FormSelectValue } from "@/components/ui/select"; // Aliased imports
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Ensure ScrollArea and ScrollBar are imported

const allDemoStatusesForPage = ["All Demos", "Scheduled", "Requested", "Completed", "Cancelled"] as const;
type DemoStatusCategory = typeof allDemoStatusesForPage[number];


export default function TutorDemoSessionsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const tutorUser = user as TutorProfile | null;

  const [allTutorDemos, setAllTutorDemos] = useState<DemoSession[]>([]);
  const [activeDemoCategoryFilter, setActiveDemoCategoryFilter] = useState<DemoStatusCategory>("All Demos");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempDemoSubjectFilter, setTempDemoSubjectFilter] = useState("All");
  const [tempDemoStudentFilter, setTempDemoStudentFilter] = useState("All");
  const [tempDemoStatusFilters, setTempDemoStatusFilters] = useState<string[]>([]);

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated || !tutorUser || tutorUser.role !== 'tutor') {
        router.replace("/");
      } else {
        const tutorDemos = MOCK_DEMO_SESSIONS.filter(demo => demo.tutorId === tutorUser.id || demo.tutorName === tutorUser.name);
        setAllTutorDemos(tutorDemos);
      }
    }
  }, [isCheckingAuth, isAuthenticated, tutorUser, router]);

  const uniqueDemoSubjects = useMemo(() => ["All", ...new Set(allTutorDemos.map(d => d.subject))], [allTutorDemos]);
  const uniqueDemoStudents = useMemo(() => ["All", ...new Set(allTutorDemos.map(d => d.studentName))], [allTutorDemos]);
  const availableDemoStatusesForFilterDialog = ["Scheduled", "Requested", "Completed", "Cancelled"];

  const categoryCounts = useMemo(() => {
    const countFiltered = (statusCategory?: DemoStatusCategory) => {
      return allTutorDemos.filter(demo => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === "" ||
            demo.subject.toLowerCase().includes(searchLower) ||
            demo.studentName.toLowerCase().includes(searchLower);

        const detailedSubjectFilterMatch = tempDemoSubjectFilter === "All" || demo.subject === tempDemoSubjectFilter;
        const detailedStudentFilterMatch = tempDemoStudentFilter === "All" || demo.studentName === tempDemoStudentFilter;
        const detailedStatusFiltersMatch = tempDemoStatusFilters.length === 0 || tempDemoStatusFilters.includes(demo.status);
        
        const matchesDetailedFilters = detailedSubjectFilterMatch && detailedStudentFilterMatch && detailedStatusFiltersMatch;
        const matchesCategoryTab = !statusCategory || statusCategory === "All Demos" || demo.status === statusCategory;

        return matchesSearch && matchesDetailedFilters && matchesCategoryTab;
      }).length;
    };
    return {
      "All Demos": countFiltered("All Demos"),
      "Scheduled": countFiltered("Scheduled"),
      "Requested": countFiltered("Requested"),
      "Completed": countFiltered("Completed"),
      "Cancelled": countFiltered("Cancelled"),
    };
  }, [allTutorDemos, searchTerm, tempDemoSubjectFilter, tempDemoStudentFilter, tempDemoStatusFilters]);

  const filterCategoriesForDropdown: { label: DemoStatusCategory; value: DemoStatusCategory; icon: React.ElementType; count: number }[] = [
    { label: "All Demos", value: "All Demos", icon: ListFilter, count: categoryCounts["All Demos"] },
    { label: "Scheduled", value: "Scheduled", icon: Clock, count: categoryCounts.Scheduled },
    { label: "Requested", value: "Requested", icon: MessageSquareQuote, count: categoryCounts.Requested },
    { label: "Completed", value: "Completed", icon: CheckCircle, count: categoryCounts.Completed },
    { label: "Cancelled", value: "Cancelled", icon: XCircle, count: categoryCounts.Cancelled },
  ];

  const selectedCategoryLabel = useMemo(() => {
    return filterCategoriesForDropdown.find(cat => cat.value === activeDemoCategoryFilter)?.label || "All Demos";
  }, [activeDemoCategoryFilter, filterCategoriesForDropdown]);

  const filteredDemos = useMemo(() => {
    return allTutorDemos.filter(demo => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === "" ||
            demo.subject.toLowerCase().includes(searchLower) ||
            demo.studentName.toLowerCase().includes(searchLower);

        const detailedSubjectFilterMatch = tempDemoSubjectFilter === "All" || demo.subject === tempDemoSubjectFilter;
        const detailedStudentFilterMatch = tempDemoStudentFilter === "All" || demo.studentName === tempDemoStudentFilter;
        const detailedStatusFiltersMatch = tempDemoStatusFilters.length === 0 || tempDemoStatusFilters.includes(demo.status);
        
        const matchesDetailedFilters = detailedSubjectFilterMatch && detailedStudentFilterMatch && detailedStatusFiltersMatch;
        const matchesCategory = activeDemoCategoryFilter === "All Demos" || demo.status === activeDemoCategoryFilter;
        
        return matchesSearch && matchesDetailedFilters && matchesCategory;
    });
  }, [searchTerm, tempDemoSubjectFilter, tempDemoStudentFilter, tempDemoStatusFilters, activeDemoCategoryFilter, allTutorDemos]);

  const handleUpdateSession = (updatedDemo: DemoSession) => {
    setAllTutorDemos(prevDemos => prevDemos.map(d => d.id === updatedDemo.id ? updatedDemo : d));
  };

  const handleCancelSession = (sessionId: string) => {
    setAllTutorDemos(prevDemos => prevDemos.map(d => d.id === sessionId ? { ...d, status: "Cancelled" } : d));
  };
  
  const handleApplyDetailedFilters = () => {
      setIsFilterDialogOpen(false);
  };

  const handleClearDetailedFilters = () => {
      setTempDemoSubjectFilter("All");
      setTempDemoStudentFilter("All");
      setTempDemoStatusFilters([]);
      setSearchTerm(""); // Also clear search term
      setActiveDemoCategoryFilter("All Demos"); // Reset category filter
      setIsFilterDialogOpen(false);
  };
  
  const handleStatusCheckboxChange = (statusValue: string, checked: boolean) => {
    setTempDemoStatusFilters(prev => 
      checked ? [...prev, statusValue] : prev.filter(s => s !== statusValue)
    );
  };

  const renderDemoList = (demos: DemoSession[]) => {
    if (demos.length === 0) {
      return (
        <Card className="text-center py-16 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out">
            <CardContent className="flex flex-col items-center">
                <MessageSquareQuote className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <p className="text-md font-semibold text-foreground/70 mb-2">No Demos Found</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
                    There are no demos matching your current selection.
                </p>
                 <Button onClick={handleClearDetailedFilters} variant="outline" className="mt-6 text-sm py-2 px-5">
                    <XIcon className="w-3.5 h-3.5 mr-1.5" />
                    Clear Filters
                </Button>
            </CardContent>
        </Card>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-4 md:gap-5">
        {demos.map(demo => (
            <UpcomingSessionCard
                key={demo.id}
                sessionDetails={{ type: 'demo', data: demo }}
                onUpdateSession={handleUpdateSession}
                onCancelSession={handleCancelSession}
            />
        ))}
      </div>
    );
  };

  if (isCheckingAuth || !tutorUser) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Demo Sessions...</div>;
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 w-full">
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-3 sm:mb-4">
            <CardTitle className="text-xl font-semibold text-primary flex items-center break-words">
              <CalendarDays className="w-5 h-5 mr-2.5"/>
              Manage Demo Sessions
            </CardTitle>
          </CardHeader>
           <CardContent className="p-0">
             <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1">
                    {/* Search Input - remains unchanged */}
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by subject, student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-3 text-sm bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg w-full h-11"
                        />
                    </div>
                    {/* Filter Icon Button */}
                    <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                        <DialogTrigger asChild>
                             <Button
                                variant="default"
                                size="icon"
                                className="h-11 w-11 shrink-0 sm:h-11 sm:w-auto sm:px-4 sm:py-3 border-border hover:border-primary bg-primary text-primary-foreground transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center gap-1.5"
                            >
                                <LucideFilterIcon className="h-4 w-4" />
                                <span className="hidden sm:inline text-sm">Filter</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-card p-0 rounded-xl overflow-hidden">
                             <DialogHeader className="p-6 pb-4 border-b">
                                <DialogTitleComponent className="text-lg font-semibold text-primary flex items-center">
                                    <LucideFilterIcon className="mr-2 h-5 w-5" /> Filter Demo Options
                                </DialogTitleComponent>
                                <DialogDescriptionComponent>
                                    Refine your demo list by subject, student, or status.
                                </DialogDescriptionComponent>
                            </DialogHeader>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-1.5">
                                    <Label htmlFor="filter-subject-demo" className="text-xs font-medium text-muted-foreground flex items-center"><BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Subject</Label>
                                    <Select value={tempDemoSubjectFilter} onValueChange={setTempDemoSubjectFilter}>
                                        <FormSelectTrigger id="filter-subject-demo" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg"><FormSelectValue /></FormSelectTrigger>
                                        <FormSelectContent>
                                            {uniqueDemoSubjects.map(opt => <FormSelectItem key={opt} value={opt} className="text-xs">{opt}</FormSelectItem>)}
                                        </FormSelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="filter-student-demo" className="text-xs font-medium text-muted-foreground flex items-center"><UsersIcon className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Student</Label>
                                    <Select value={tempDemoStudentFilter} onValueChange={setTempDemoStudentFilter}>
                                        <FormSelectTrigger id="filter-student-demo" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg"><FormSelectValue /></FormSelectTrigger>
                                        <FormSelectContent>
                                            {uniqueDemoStudents.map(opt => <FormSelectItem key={opt} value={opt} className="text-xs">{opt}</FormSelectItem>)}
                                        </FormSelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground flex items-center"><ListFilter className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Status</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                    {availableDemoStatusesForFilterDialog.map(status => (
                                        <div key={status} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`status-demo-${status}`}
                                            checked={tempDemoStatusFilters.includes(status)}
                                            onCheckedChange={(checked) => handleStatusCheckboxChange(status, !!checked)}
                                        />
                                        <Label htmlFor={`status-demo-${status}`} className="text-xs font-normal text-foreground cursor-pointer">{status}</Label>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="p-6 pt-4 border-t gap-2 sm:justify-between">
                                <Button variant="ghost" onClick={handleClearDetailedFilters} className="text-xs text-muted-foreground hover:text-destructive">
                                    <XIcon className="mr-1.5 h-3.5 w-3.5" /> Clear All
                                </Button>
                                <Button onClick={handleApplyDetailedFilters} className="text-xs">Apply Filters</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="w-full sm:w-auto mt-3 sm:mt-0 flex flex-col sm:flex-row items-center gap-3">
                     <Button
                        variant="default"
                        size="sm"
                        className="w-full sm:w-auto text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-center gap-1.5 h-11"
                        onClick={() => console.log("Schedule Demo Clicked - Placeholder")}
                    >
                        <PlusCircle className="w-4 h-4 opacity-90" />
                        Schedule Demo
                    </Button>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                        variant="default"
                        className="w-full sm:w-auto text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                        <span className="text-primary-foreground">
                            {selectedCategoryLabel} ({
                            filterCategoriesForDropdown.find(
                                (cat) => cat.value === activeDemoCategoryFilter
                            )?.count || 0
                            })
                        </span>
                        <ChevronDown className="w-4 h-4 opacity-70 text-primary-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[220px]">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {filterCategoriesForDropdown.map((category) => (
                        <DropdownMenuItem
                            key={category.value}
                            onClick={() => setActiveDemoCategoryFilter(category.value)}
                            className={cn(
                            "text-sm",
                            activeDemoCategoryFilter === category.value && "bg-primary text-primary-foreground"
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

        <div className="mt-4">
          {renderDemoList(filteredDemos)}
        </div>
      </div>
    </main>
  );
}
