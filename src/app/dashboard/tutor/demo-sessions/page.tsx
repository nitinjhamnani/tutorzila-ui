
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ListFilter, PlusCircle, FilterIcon as LucideFilterIcon, MessageSquareQuote, Users as UsersIcon, XIcon, BookOpen } from "lucide-react";
import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard";
import type { DemoSession, TutorProfile } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogFooter, DialogTitle as DialogTitleComponent, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

export default function TutorDemoSessionsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const tutorUser = user as TutorProfile | null;

  const [allTutorDemos, setAllTutorDemos] = useState<DemoSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [studentFilter, setStudentFilter] = useState("All");
  const [statusFilters, setStatusFilters] = useState<string[]>([]); 

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempSubjectFilter, setTempSubjectFilter] = useState(subjectFilter);
  const [tempStudentFilter, setTempStudentFilter] = useState(studentFilter);
  const [tempStatusFilters, setTempStatusFilters] = useState<string[]>(statusFilters);

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
      setTempSubjectFilter(subjectFilter);
      setTempStudentFilter(studentFilter);
      setTempStatusFilters([...statusFilters]);
    }
  }, [isFilterDialogOpen, subjectFilter, studentFilter, statusFilters]);

  const uniqueDemoSubjects = useMemo(() => ["All", ...new Set(allTutorDemos.map(d => d.subject))], [allTutorDemos]);
  const uniqueDemoStudents = useMemo(() => ["All", ...new Set(allTutorDemos.map(d => d.studentName))], [allTutorDemos]);
  const allDemoStatuses = ["Scheduled", "Requested", "Completed", "Cancelled"];

  const filtersApplied = useMemo(() => {
    return searchTerm !== "" || subjectFilter !== "All" || studentFilter !== "All" || statusFilters.length > 0;
  }, [searchTerm, subjectFilter, studentFilter, statusFilters]);

  const filteredDemos = useMemo(() => {
    return allTutorDemos.filter(demo => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" ||
        demo.subject.toLowerCase().includes(searchLower) ||
        demo.studentName.toLowerCase().includes(searchLower);
      
      const matchesSubject = subjectFilter === "All" || demo.subject === subjectFilter;
      const matchesStudent = studentFilter === "All" || demo.studentName === studentFilter;
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(demo.status);

      return matchesSearch && matchesSubject && matchesStudent && matchesStatus;
    });
  }, [searchTerm, subjectFilter, studentFilter, statusFilters, allTutorDemos]);

  const handleUpdateSession = (updatedDemo: DemoSession) => {
    setAllTutorDemos(prevDemos => prevDemos.map(d => d.id === updatedDemo.id ? updatedDemo : d));
    console.log("Demo session updated (mock):", updatedDemo);
  };

  const handleCancelSession = (sessionId: string) => {
    setAllTutorDemos(prevDemos => prevDemos.map(d => d.id === sessionId ? { ...d, status: "Cancelled" } : d));
    console.log("Demo session cancelled (mock):", sessionId);
  };

  const handleApplyFilters = () => {
    setSubjectFilter(tempSubjectFilter);
    setStudentFilter(tempStudentFilter);
    setStatusFilters([...tempStatusFilters]);
    setIsFilterDialogOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm(""); 
    setTempSubjectFilter("All");
    setTempStudentFilter("All");
    setTempStatusFilters([]);
    setSubjectFilter("All");
    setStudentFilter("All");
    setStatusFilters([]);
    setIsFilterDialogOpen(false);
  };
  
  const handleStatusCheckboxChange = (statusValue: string, checked: boolean) => {
    setTempStatusFilters(prev => 
      checked ? [...prev, statusValue] : prev.filter(s => s !== statusValue)
    );
  };

  const renderDemoList = (demos: DemoSession[]) => {
    if (!isAuthenticated || !tutorUser) return null;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <BreadcrumbHeader segments={[
          { label: "Dashboard", href: "/dashboard/tutor" },
          { label: "Demo Sessions" }
        ]} />
        
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-base sm:text-lg font-semibold text-primary flex items-center break-words">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2"/>
              Search & Filter Demos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <div className="relative w-full sm:flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by student, subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 text-xs sm:text-sm bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-md h-11"
                />
              </div>
              <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <DialogTrigger asChild>
                          <Button 
                            variant={filtersApplied ? "default" : "outline"} 
                            size="icon"
                            className={cn(
                              "h-11 w-11 shrink-0 shadow-sm hover:shadow-md rounded-md flex items-center justify-center",
                              filtersApplied && "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                          >
                            <LucideFilterIcon className="h-4 w-4" />
                            <span className="sr-only">Filter Results</span>
                          </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter Results</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DialogContent className="sm:max-w-md bg-card p-0 rounded-xl overflow-hidden">
                  <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitleComponent className="text-lg font-semibold text-primary flex items-center">
                      <LucideFilterIcon className="mr-2 h-5 w-5" /> Filter Demo Sessions
                    </DialogTitleComponent>
                    <DialogDescription>
                      Refine your demo list by subject, student, or status.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-1.5">
                      <Label htmlFor="filter-subject-demo" className="text-xs font-medium text-muted-foreground flex items-center"><BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Subject</Label>
                      <Select value={tempSubjectFilter} onValueChange={setTempSubjectFilter}>
                        <SelectTrigger id="filter-subject-demo" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {uniqueDemoSubjects.map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="filter-student-demo" className="text-xs font-medium text-muted-foreground flex items-center"><UsersIcon className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Student</Label>
                      <Select value={tempStudentFilter} onValueChange={setTempStudentFilter}>
                        <SelectTrigger id="filter-student-demo" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {uniqueDemoStudents.map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground flex items-center"><ListFilter className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Status</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {allDemoStatuses.map(status => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={`status-demo-${status}`}
                              checked={tempStatusFilters.includes(status)}
                              onCheckedChange={(checked) => handleStatusCheckboxChange(status, !!checked)}
                            />
                            <Label htmlFor={`status-demo-${status}`} className="text-xs font-normal text-foreground cursor-pointer">{status}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="p-6 pt-4 border-t gap-2 sm:justify-between">
                    <Button variant="ghost" onClick={resetFilters} className="text-xs text-muted-foreground hover:text-destructive">
                      <XIcon className="mr-1.5 h-3.5 w-3.5" /> Clear All
                    </Button>
                    <Button onClick={handleApplyFilters} className="text-xs">Apply Filters</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Removed Tabs Section */}
        <div className="mt-6">
          {renderDemoList(filteredDemos)}
        </div>

      </div>
    </main>
  );
}

