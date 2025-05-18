
"use client";

import { useState, useMemo, useEffect } from "react";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, ListFilter, PlusCircle, CalendarDays, Users, Star as StarIcon, MessageSquareQuote, Edit3, XCircle, Video, MessageSquareText, Clock as ClockIcon, XIcon, BookOpen, FilterIcon as LucideFilterIcon } from "lucide-react";
import type { DemoSession } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { ParentDemoSessionCard } from "@/components/dashboard/parent/ParentDemoSessionCard"; 
import { Label } from "@/components/ui/label"; 
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";


const Info: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

const allDemoSubjects = ["All", ...new Set(MOCK_DEMO_SESSIONS.map(d => d.subject))];
const allDemoTutors = ["All", ...new Set(MOCK_DEMO_SESSIONS.map(d => d.tutorName).filter(Boolean) as string[])];
const allDemoStatuses = ["Scheduled", "Requested", "Completed", "Cancelled"];


export default function MyDemosPage() {
  const [allDemos, setAllDemos] = useState<DemoSession[]>(MOCK_DEMO_SESSIONS); // Initialize with mock data
  const [searchTerm, setSearchTerm] = useState("");
  
  // Main filter states
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [tutorFilter, setTutorFilter] = useState("All");
  const [statusFilters, setStatusFilters] = useState<string[]>([]); 

  // Temporary states for the dialog
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempSubjectFilter, setTempSubjectFilter] = useState(subjectFilter);
  const [tempTutorFilter, setTempTutorFilter] = useState(tutorFilter);
  const [tempStatusFilters, setTempStatusFilters] = useState<string[]>(statusFilters);


  useEffect(() => {
    // setAllDemos(MOCK_DEMO_SESSIONS); // Already initialized
  }, []);

  useEffect(() => {
    if (isFilterDialogOpen) {
      setTempSubjectFilter(subjectFilter);
      setTempTutorFilter(tutorFilter);
      setTempStatusFilters([...statusFilters]);
    }
  }, [isFilterDialogOpen, subjectFilter, tutorFilter, statusFilters]);

  const filtersApplied = useMemo(() => {
    return searchTerm !== "" || subjectFilter !== "All" || tutorFilter !== "All" || statusFilters.length > 0;
  }, [searchTerm, subjectFilter, tutorFilter, statusFilters]);

  const filteredDemos = useMemo(() => {
    return allDemos.filter(demo => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" ||
        demo.subject.toLowerCase().includes(searchLower) ||
        (demo.tutorName && demo.tutorName.toLowerCase().includes(searchLower)) ||
        demo.studentName.toLowerCase().includes(searchLower);
      
      const matchesSubject = subjectFilter === "All" || demo.subject === subjectFilter;
      const matchesTutor = tutorFilter === "All" || demo.tutorName === tutorFilter;
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(demo.status);

      return matchesSearch && matchesSubject && matchesTutor && matchesStatus;
    });
  }, [searchTerm, subjectFilter, tutorFilter, statusFilters, allDemos]);

  const scheduledDemos = useMemo(() => filteredDemos.filter(d => d.status === "Scheduled"), [filteredDemos]);
  const requestedDemos = useMemo(() => filteredDemos.filter(d => d.status === "Requested"), [filteredDemos]);
  const pastDemos = useMemo(() => filteredDemos.filter(d => d.status === "Completed" || d.status === "Cancelled"), [filteredDemos]);

 const handleRescheduleDemo = (demoId: string, newDate: Date, newStartTime: string, newEndTime: string, reason: string) => {
    console.log(`Reschedule request for demo ID: ${demoId}`, { newDate, newStartTime, newEndTime, reason });
    // Mock update: find the demo and update its status/details
    setAllDemos(prevDemos =>
      prevDemos.map(d =>
        d.id === demoId
          ? { ...d, rescheduleStatus: 'pending' as const } // Set status to pending
          : d
      )
    );
    // In a real app, you'd make an API call here
  };

  const handleCancelDemo = (demoId: string) => {
    console.log(`Cancel request for demo ID: ${demoId}`);
    setAllDemos(prevDemos =>
      prevDemos.map(d =>
        d.id === demoId
          ? { ...d, status: 'Cancelled' as const, rescheduleStatus: 'idle' as const }
          : d
      )
    );
  };


  const handleApplyFilters = () => {
    setSubjectFilter(tempSubjectFilter);
    setTutorFilter(tempTutorFilter);
    setStatusFilters([...tempStatusFilters]);
    setIsFilterDialogOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm(""); 
    setTempSubjectFilter("All");
    setTempTutorFilter("All");
    setTempStatusFilters([]);
    // Apply immediately
    setSubjectFilter("All");
    setTutorFilter("All");
    setStatusFilters([]);
    setIsFilterDialogOpen(false);
  };
  
  const handleStatusCheckboxChange = (statusValue: string, checked: boolean) => {
    setTempStatusFilters(prev => 
      checked ? [...prev, statusValue] : prev.filter(s => s !== statusValue)
    );
  };

  const renderDemoList = (demos: DemoSession[], tabName: string) => {
    if (demos.length === 0) {
      return (
        <div className="text-center py-16 bg-card border rounded-lg shadow-sm">
          <MessageSquareQuote className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <p className="text-md font-semibold text-foreground/70 mb-2">No {tabName.toLowerCase()} found.</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
            There are no demos in this category.
          </p>
          <Button asChild variant="default" size="sm">
            <Link href="/search-tuitions">
              <PlusCircle className="mr-2 h-4 w-4" /> Request a Demo Class
            </Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {demos.map(demo => (
          <ParentDemoSessionCard 
            key={demo.id} 
            demo={demo} 
            onReschedule={handleRescheduleDemo}
            onCancel={handleCancelDemo}
            onEditRequest={(id) => console.log("Edit Request for", id)}
            onWithdrawRequest={(id) => console.log("Withdraw Request for", id)}
            onGiveFeedback={(id) => console.log("Give Feedback for", id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-8">
      <BreadcrumbHeader segments={[
        { label: "Dashboard", href: "/dashboard/parent" },
        { label: "My Demos" }
      ]} />
      
      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-card border rounded-lg shadow-sm items-center justify-between">
        <div className="relative flex-grow w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by demo, tutor, student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg w-full h-9"
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
                        "h-9 w-9 shadow-sm hover:shadow-md rounded-lg flex items-center justify-center",
                        filtersApplied && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      <LucideFilterIcon className="h-4 w-4" />
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
              <DialogTitle className="text-lg font-semibold text-primary flex items-center">
                <LucideFilterIcon className="mr-2 h-5 w-5" /> Filter Demos
              </DialogTitle>
              <DialogDescription>
                Refine your demo list by subject, tutor, or status.
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-1.5">
                <Label htmlFor="filter-subject-demo" className="text-xs font-medium text-muted-foreground flex items-center"><BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Subject</Label>
                <Select value={tempSubjectFilter} onValueChange={setTempSubjectFilter}>
                  <SelectTrigger id="filter-subject-demo" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {allDemoSubjects.map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="filter-tutor-demo" className="text-xs font-medium text-muted-foreground flex items-center"><Users className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Tutor</Label>
                <Select value={tempTutorFilter} onValueChange={setTempTutorFilter}>
                  <SelectTrigger id="filter-tutor-demo" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {allDemoTutors.map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
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


      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-1 bg-muted/50 p-1 rounded-lg shadow-sm mb-6">
          <TabsTrigger value="scheduled">Scheduled ({scheduledDemos.length})</TabsTrigger>
          <TabsTrigger value="requested">Requested ({requestedDemos.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastDemos.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="scheduled">{renderDemoList(scheduledDemos, "Scheduled Demos")}</TabsContent>
        <TabsContent value="requested">{renderDemoList(requestedDemos, "Demo Requests")}</TabsContent>
        <TabsContent value="past">{renderDemoList(pastDemos, "Past Demos")}</TabsContent>
      </Tabs>

      <Card className="bg-card border rounded-lg shadow-sm mt-6">
        <CardHeader>
            <CardTitle className="text-sm font-semibold text-primary flex items-center">
                <Info className="w-4 h-4 mr-2" /> Important Notes
            </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>&bull; Demo session links are typically shared by tutors via direct communication closer to the scheduled time.</p>
            <p>&bull; Please ensure you confirm rescheduling or cancellations at least 2-4 hours in advance.</p>
            <p>&bull; Feedback for completed demos helps us and the tutors improve!</p>
        </CardContent>
      </Card>
    </div>
  );
}
