"use client";

import { useState, useMemo, useEffect } from "react";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, ListFilter, PlusCircle, CalendarDays, Users, Star as StarIcon, XIcon, BookOpen, FilterIcon } from "lucide-react";
import { ClassCard } from "@/components/dashboard/ClassCard";
import type { MyClass } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

const MOCK_CLASSES: MyClass[] = [
  { id: "c1", subject: "Advanced Algebra", tutorName: "Dr. Emily Carter", tutorAvatarSeed: "emilycarter", studentName: "Rohan S.", mode: "Online", schedule: { days: ["Mon", "Wed"], time: "6:00 PM - 7:00 PM" }, status: "Ongoing", nextSession: new Date(Date.now() + 86400000 * 2).toISOString() },
  { id: "c2", subject: "Shakespearean Sonnets", tutorName: "John Adebayo", tutorAvatarSeed: "johnadebayo", studentName: "Priya M.", mode: "Offline (In-person)", schedule: { days: ["Sat"], time: "10:00 AM - 12:00 PM" }, status: "Ongoing", nextSession: new Date(Date.now() + 86400000 * 4).toISOString() },
  { id: "c3", subject: "Introduction to Python", tutorName: "Sophia Chen", tutorAvatarSeed: "sophiachen", studentName: "Rohan S.", mode: "Online", schedule: { days: ["Tues", "Thurs"], time: "7:00 PM - 8:00 PM" }, status: "Upcoming", startDate: new Date(Date.now() + 86400000 * 7).toISOString() },
  { id: "c4", subject: "Organic Chemistry Basics", tutorName: "Dr. Emily Carter", tutorAvatarSeed: "emilycarter", studentName: "Aisha K.", mode: "Online", schedule: { days: ["Fri"], time: "5:00 PM - 6:30 PM" }, status: "Upcoming", startDate: new Date(Date.now() + 86400000 * 10).toISOString() },
  { id: "c5", subject: "World History: Ancient Civilizations", tutorName: "John Adebayo", tutorAvatarSeed: "johnadebayo", studentName: "Rohan S.", mode: "Offline (In-person)", schedule: { days: ["Sun"], time: "2:00 PM - 4:00 PM" }, status: "Past", endDate: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: "c6", subject: "Web Development Fundamentals", tutorName: "Sophia Chen", tutorAvatarSeed: "sophiachen", studentName: "Priya M.", mode: "Online", schedule: { days: ["Wed"], time: "6:30 PM - 8:00 PM" }, status: "Past", endDate: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: "c7", subject: "Calculus I", tutorName: "Dr. Emily Carter", tutorAvatarSeed: "emilycarter", studentName: "Aisha K.", mode: "Online", schedule: { days: ["Mon"], time: "4:00 PM - 5:00 PM" }, status: "Cancelled" },
];

const uniqueSubjects = ["All", ...new Set(MOCK_CLASSES.map(c => c.subject))];
const uniqueTutors = ["All", ...new Set(MOCK_CLASSES.map(c => c.tutorName))];
const allStatuses = ["Ongoing", "Upcoming", "Past", "Cancelled"];


export default function MyClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // Main filter states
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [tutorFilter, setTutorFilter] = useState("All");
  const [statusFilters, setStatusFilters] = useState<string[]>([]); // For multi-select checkboxes

  // Temporary states for the dialog
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempSubjectFilter, setTempSubjectFilter] = useState(subjectFilter);
  const [tempTutorFilter, setTempTutorFilter] = useState(tutorFilter);
  const [tempStatusFilters, setTempStatusFilters] = useState<string[]>(statusFilters);

  useEffect(() => {
    // When dialog opens, sync temp filters with main filters
    if (isFilterDialogOpen) {
      setTempSubjectFilter(subjectFilter);
      setTempTutorFilter(tutorFilter);
      setTempStatusFilters([...statusFilters]);
    }
  }, [isFilterDialogOpen, subjectFilter, tutorFilter, statusFilters]);

  const filtersApplied = useMemo(() => {
    return searchTerm !== "" || subjectFilter !== "All" || tutorFilter !== "All" || statusFilters.length > 0;
  }, [searchTerm, subjectFilter, tutorFilter, statusFilters]);

  const filteredClasses = useMemo(() => {
    return MOCK_CLASSES.filter(c => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" ||
        c.subject.toLowerCase().includes(searchLower) ||
        c.tutorName.toLowerCase().includes(searchLower) ||
        c.studentName.toLowerCase().includes(searchLower);
      
      const matchesSubject = subjectFilter === "All" || c.subject === subjectFilter;
      const matchesTutor = tutorFilter === "All" || c.tutorName === tutorFilter;
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(c.status);

      return matchesSearch && matchesSubject && matchesTutor && matchesStatus;
    });
  }, [searchTerm, subjectFilter, tutorFilter, statusFilters]);

  const ongoingClasses = useMemo(() => filteredClasses.filter(c => c.status === "Ongoing"), [filteredClasses]);
  const upcomingClasses = useMemo(() => filteredClasses.filter(c => c.status === "Upcoming"), [filteredClasses]);
  const pastClasses = useMemo(() => filteredClasses.filter(c => c.status === "Past"), [filteredClasses]);
  const cancelledClasses = useMemo(() => filteredClasses.filter(c => c.status === "Cancelled"), [filteredClasses]);

  const handleApplyFilters = () => {
    setSubjectFilter(tempSubjectFilter);
    setTutorFilter(tempTutorFilter);
    setStatusFilters([...tempStatusFilters]);
    setIsFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
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

  const renderClassList = (classes: MyClass[], tabName: string) => {
    if (classes.length === 0) {
      return (
        <div className="text-center py-16 bg-card border rounded-lg shadow-sm">
          <CalendarDays className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <p className="text-md font-semibold text-foreground/70 mb-2">No {tabName.toLowerCase()} classes found.</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
            {tabName === "Upcoming" ? "You have no upcoming scheduled classes." : 
             tabName === "Ongoing" ? "You currently have no ongoing classes." :
             "There are no classes in this category."}
          </p>
          <Button asChild variant="default" size="sm">
            <Link href="/dashboard/post-requirement">
              <PlusCircle className="mr-2 h-4 w-4" /> Post a Tuition Requirement
            </Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {classes.map(classData => (
          <ClassCard key={classData.id} classData={classData} />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6 pb-8">
      <BreadcrumbHeader segments={[
        { label: "Dashboard", href: "/dashboard/parent" },
        { label: "My Classes" }
      ]} />
      
       <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-card border rounded-lg shadow-sm items-center justify-between">
        <div className="relative flex-grow w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by class, tutor, student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg w-full"
          />
        </div>
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 <DialogTrigger asChild>
                    <Button 
                      variant={filtersApplied ? "default" : "outline"} 
                      size="sm" 
                      className={cn(
                        "text-xs h-9 px-3 py-1.5 shadow-sm hover:shadow-md rounded-lg flex items-center gap-1.5",
                        filtersApplied && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      <FilterIcon className="mr-1.5 h-3.5 w-3.5" /> Filter Results
                    </Button>
                  </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter Classes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="sm:max-w-md bg-card p-0 rounded-xl overflow-hidden">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle className="text-lg font-semibold text-primary flex items-center">
                <FilterIcon className="mr-2 h-5 w-5" /> Filter Classes
              </DialogTitle>
              <DialogDescription>
                Refine your class list by subject, tutor, or status.
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-1.5">
                <Label htmlFor="filter-subject" className="text-xs font-medium text-muted-foreground flex items-center"><BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Subject</Label>
                <Select value={tempSubjectFilter} onValueChange={setTempSubjectFilter}>
                  <SelectTrigger id="filter-subject" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {uniqueSubjects.map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="filter-tutor" className="text-xs font-medium text-muted-foreground flex items-center"><Users className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Tutor</Label>
                <Select value={tempTutorFilter} onValueChange={setTempTutorFilter}>
                  <SelectTrigger id="filter-tutor" className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {uniqueTutors.map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground flex items-center"><ListFilter className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {allStatuses.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={tempStatusFilters.includes(status)}
                        onCheckedChange={(checked) => handleStatusCheckboxChange(status, !!checked)}
                      />
                      <Label htmlFor={`status-${status}`} className="text-xs font-normal text-foreground cursor-pointer">{status}</Label>
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
      </div>


      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 bg-muted/50 p-1 rounded-lg shadow-sm mb-6">
          <TabsTrigger value="ongoing">Ongoing ({ongoingClasses.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingClasses.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastClasses.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledClasses.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing">{renderClassList(ongoingClasses, "Ongoing")}</TabsContent>
        <TabsContent value="upcoming">{renderClassList(upcomingClasses, "Upcoming")}</TabsContent>
        <TabsContent value="past">{renderClassList(pastClasses, "Past")}</TabsContent>
        <TabsContent value="cancelled">{renderClassList(cancelledClasses, "Cancelled")}</TabsContent>
      </Tabs>
    </div>
  );
}
