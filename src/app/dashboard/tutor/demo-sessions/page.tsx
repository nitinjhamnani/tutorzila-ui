
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, ListFilter, PlusCircle, FilterIcon as LucideFilterIcon, MessageSquareQuote, Users as UsersIcon, XIcon, BookOpen, ChevronDown, CheckCircle, Star, Clock, XCircle } from "lucide-react"; // Added Clock, XCircle
import { TutorDemoCard } from "@/components/dashboard/tutor/TutorDemoCard";
import type { DemoSession, TutorProfile } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle as DialogTitleComponent, DialogDescription as DialogDescriptionComponent } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const demoStatuses = ["All Demos", "Scheduled", "Requested", "Completed", "Cancelled"] as const;
type DemoStatusCategory = typeof demoStatuses[number];


export default function TutorDemoSessionsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const tutorUser = user as TutorProfile | null;

  const [allTutorDemos, setAllTutorDemos] = useState<DemoSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // For the main filter dialog
  const [dialogSubjectFilter, setDialogSubjectFilter] = useState("All");
  const [dialogStudentFilter, setDialogStudentFilter] = useState("All");
  
  // For the category dropdown
  const [activeDemoCategoryFilter, setActiveDemoCategoryFilter] = useState<DemoStatusCategory>("All Demos");

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempDialogSubjectFilter, setTempDialogSubjectFilter] = useState(dialogSubjectFilter);
  const [tempDialogStudentFilter, setTempDialogStudentFilter] = useState(dialogStudentFilter);

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

  useEffect(() => {
    if (isFilterDialogOpen) {
      setTempDialogSubjectFilter(dialogSubjectFilter);
      setTempDialogStudentFilter(dialogStudentFilter);
    }
  }, [isFilterDialogOpen, dialogSubjectFilter, dialogStudentFilter]);

  const uniqueDemoSubjects = useMemo(() => ["All", ...new Set(allTutorDemos.map(d => d.subject))], [allTutorDemos]);
  const uniqueDemoStudents = useMemo(() => ["All", ...new Set(allTutorDemos.map(d => d.studentName))], [allTutorDemos]);

  const categoryCounts = useMemo(() => {
    return {
      "All Demos": allTutorDemos.length,
      "Scheduled": allTutorDemos.filter(d => d.status === "Scheduled").length,
      "Requested": allTutorDemos.filter(d => d.status === "Requested").length,
      "Completed": allTutorDemos.filter(d => d.status === "Completed").length,
      "Cancelled": allTutorDemos.filter(d => d.status === "Cancelled").length,
    };
  }, [allTutorDemos]);

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


  const filtersAppliedDialog = useMemo(() => {
    return dialogSubjectFilter !== "All" || dialogStudentFilter !== "All";
  }, [dialogSubjectFilter, dialogStudentFilter]);

  const filteredDemos = useMemo(() => {
    return allTutorDemos.filter(demo => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" ||
        demo.subject.toLowerCase().includes(searchLower) ||
        demo.studentName.toLowerCase().includes(searchLower);
      
      const matchesCategory = activeDemoCategoryFilter === "All Demos" || demo.status === activeDemoCategoryFilter;
      
      const matchesDialogSubject = dialogSubjectFilter === "All" || demo.subject === dialogSubjectFilter;
      const matchesDialogStudent = dialogStudentFilter === "All" || demo.studentName === dialogStudentFilter;

      return matchesSearch && matchesCategory && matchesDialogSubject && matchesDialogStudent;
    });
  }, [searchTerm, activeDemoCategoryFilter, dialogSubjectFilter, dialogStudentFilter, allTutorDemos]);

  const handleUpdateSession = (updatedDemo: DemoSession) => {
    setAllTutorDemos(prevDemos => prevDemos.map(d => d.id === updatedDemo.id ? updatedDemo : d));
  };

  const handleCancelSession = (sessionId: string) => {
    setAllTutorDemos(prevDemos => prevDemos.map(d => d.id === sessionId ? { ...d, status: "Cancelled" } : d));
  };

  const handleApplyDialogFilters = () => {
    setDialogSubjectFilter(tempDialogSubjectFilter);
    setDialogStudentFilter(tempDialogStudentFilter);
    setIsFilterDialogOpen(false);
  };

  const resetDialogFilters = () => {
    setTempDialogSubjectFilter("All");
    setTempDialogStudentFilter("All");
    setDialogSubjectFilter("All");
    setDialogStudentFilter("All");
    setIsFilterDialogOpen(false);
  };
  
   const renderDemoList = (demos: DemoSession[]) => {
    if (demos.length === 0) {
      return (
        <div className="text-center py-16 bg-card border rounded-lg shadow-sm">
            <MessageSquareQuote className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <p className="text-md font-semibold text-foreground/70 mb-2">No demos found.</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
                There are no demos matching your current filters.
            </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-4 md:gap-5">
        {demos.map(demo => (
            <TutorDemoCard 
                key={demo.id} 
                demo={demo}
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-base sm:text-lg font-semibold text-primary flex items-center break-words">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2"/>
              Search & Filter Demos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 w-full sm:flex-1"> 
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by student, subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg w-full h-11"
                  />
                </div>
                <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <Button 
                            variant={filtersAppliedDialog ? "default" : "outline"} 
                            size="icon"
                            className={cn(
                              "h-11 w-11 shrink-0 shadow-sm hover:shadow-md rounded-lg flex items-center justify-center",
                              filtersAppliedDialog && "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                            onClick={() => setIsFilterDialogOpen(true)}
                          >
                            <LucideFilterIcon className="h-4 w-4" />
                            <span className="hidden sm:inline sm:ml-1.5">Filter</span>
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Detailed Filters</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DialogContent className="sm:max-w-md bg-card p-0 rounded-xl overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b">
                      <DialogTitleComponent className="text-lg font-semibold text-primary flex items-center">
                        <LucideFilterIcon className="mr-2 h-5 w-5" /> Filter Demo Sessions
                      </DialogTitleComponent>
                      <DialogDescriptionComponent>
                        Refine your demo list by subject or student.
                      </DialogDescriptionComponent>
                    </DialogHeader>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-1.5">
                        <Label htmlFor="filter-subject-demo" className="text-xs font-medium text-muted-foreground flex items-center"><BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Subject</Label>
                        <Select value={tempDialogSubjectFilter} onValueChange={setTempDialogSubjectFilter}>
                          <SelectTrigger id="filter-subject-demo" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {uniqueDemoSubjects.map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="filter-student-demo" className="text-xs font-medium text-muted-foreground flex items-center"><UsersIcon className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Student</Label>
                        <Select value={tempDialogStudentFilter} onValueChange={setTempDialogStudentFilter}>
                          <SelectTrigger id="filter-student-demo" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {uniqueDemoStudents.map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="p-6 pt-4 border-t gap-2 sm:justify-between">
                      <Button variant="ghost" onClick={resetDialogFilters} className="text-xs text-muted-foreground hover:text-destructive">
                        <XIcon className="mr-1.5 h-3.5 w-3.5" /> Clear All
                      </Button>
                      <Button onClick={handleApplyDialogFilters} className="text-xs">Apply Filters</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      className="w-full sm:w-auto text-xs sm:text-sm py-2 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-11"
                    >
                      <span className="text-primary-foreground">
                        {selectedCategoryLabel} ({categoryCounts[activeDemoCategoryFilter as DemoStatusCategory]})
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

        <div className="mt-6">
          {renderDemoList(filteredDemos)}
        </div>
      </div>
    </main>
  );
}
