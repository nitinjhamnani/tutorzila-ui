
"use client";

import { useState, useMemo } from "react";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, ListFilter, PlusCircle, CalendarDays, Users, Star as StarIcon, XIcon, BookOpen } from "lucide-react";
import { ClassCard } from "@/components/dashboard/ClassCard";
import type { MyClass } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Label } from "@/components/ui/label";

const MOCK_CLASSES: MyClass[] = [
  { id: "c1", subject: "Advanced Algebra", tutorName: "Dr. Emily Carter", tutorAvatarSeed: "emilycarter", studentName: "Rohan S.", mode: "Online", schedule: { days: ["Mon", "Wed"], time: "6:00 PM - 7:00 PM" }, status: "Ongoing", nextSession: new Date(Date.now() + 86400000 * 2).toISOString() },
  { id: "c2", subject: "Shakespearean Sonnets", tutorName: "John Adebayo", tutorAvatarSeed: "johnadebayo", studentName: "Priya M.", mode: "Offline (In-person)", schedule: { days: ["Sat"], time: "10:00 AM - 12:00 PM" }, status: "Ongoing", nextSession: new Date(Date.now() + 86400000 * 4).toISOString() },
  { id: "c3", subject: "Introduction to Python", tutorName: "Sophia Chen", tutorAvatarSeed: "sophiachen", studentName: "Rohan S.", mode: "Online", schedule: { days: ["Tues", "Thurs"], time: "7:00 PM - 8:00 PM" }, status: "Upcoming", startDate: new Date(Date.now() + 86400000 * 7).toISOString() },
  { id: "c4", subject: "Organic Chemistry Basics", tutorName: "Dr. Emily Carter", tutorAvatarSeed: "emilycarter", studentName: "Aisha K.", mode: "Online", schedule: { days: ["Fri"], time: "5:00 PM - 6:30 PM" }, status: "Upcoming", startDate: new Date(Date.now() + 86400000 * 10).toISOString() },
  { id: "c5", subject: "World History: Ancient Civilizations", tutorName: "John Adebayo", tutorAvatarSeed: "johnadebayo", studentName: "Rohan S.", mode: "Offline (In-person)", schedule: { days: ["Sun"], time: "2:00 PM - 4:00 PM" }, status: "Past", endDate: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: "c6", subject: "Web Development Fundamentals", tutorName: "Sophia Chen", tutorAvatarSeed: "sophiachen", studentName: "Priya M.", mode: "Online", schedule: { days: ["Wed"], time: "6:30 PM - 8:00 PM" }, status: "Past", endDate: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: "c7", subject: "Calculus I", tutorName: "Dr. Emily Carter", tutorAvatarSeed: "emilycarter", studentName: "Aisha K.", mode: "Online", schedule: { days: ["Mon"], time: "4:00 PM - 5:00 PM" }, status: "Cancelled" },
];

export default function MyClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [tutorFilter, setTutorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredClasses = useMemo(() => {
    return MOCK_CLASSES.filter(c => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" ||
        c.subject.toLowerCase().includes(searchLower) ||
        c.tutorName.toLowerCase().includes(searchLower) ||
        c.studentName.toLowerCase().includes(searchLower);
      
      const matchesSubject = subjectFilter === "All" || c.subject === subjectFilter;
      const matchesTutor = tutorFilter === "All" || c.tutorName === tutorFilter;
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;

      return matchesSearch && matchesSubject && matchesTutor && matchesStatus;
    });
  }, [searchTerm, subjectFilter, tutorFilter, statusFilter]);

  const ongoingClasses = useMemo(() => filteredClasses.filter(c => c.status === "Ongoing"), [filteredClasses]);
  const upcomingClasses = useMemo(() => filteredClasses.filter(c => c.status === "Upcoming"), [filteredClasses]);
  const pastClasses = useMemo(() => filteredClasses.filter(c => c.status === "Past"), [filteredClasses]);
  const cancelledClasses = useMemo(() => filteredClasses.filter(c => c.status === "Cancelled"), [filteredClasses]);

  const uniqueSubjects = ["All", ...new Set(MOCK_CLASSES.map(c => c.subject))];
  const uniqueTutors = ["All", ...new Set(MOCK_CLASSES.map(c => c.tutorName))];
  const uniqueStatuses = ["All", "Ongoing", "Upcoming", "Past", "Cancelled"];

  const showClearFilters = searchTerm !== "" || subjectFilter !== "All" || tutorFilter !== "All" || statusFilter !== "All";

  const resetFilters = () => {
    setSearchTerm("");
    setSubjectFilter("All");
    setTutorFilter("All");
    setStatusFilter("All");
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
      
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-6 p-4 bg-card border rounded-lg shadow-sm items-center">
        <div className="relative flex-grow sm:flex-grow-0 sm:w-auto min-w-[200px] w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by class, tutor, student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg w-full"
          />
        </div>
        <FilterSelect label="Subject" value={subjectFilter} onValueChange={setSubjectFilter} options={uniqueSubjects} icon={BookOpen} />
        <FilterSelect label="Tutor" value={tutorFilter} onValueChange={setTutorFilter} options={uniqueTutors} icon={Users} />
        <FilterSelect label="Status" value={statusFilter} onValueChange={setStatusFilter} options={uniqueStatuses} icon={ListFilter} />
        {showClearFilters && (
          <Button onClick={resetFilters} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive sm:ml-auto">
            <XIcon className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
          </Button>
        )}
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

interface FilterSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  icon?: React.ElementType;
}

function FilterSelect({ label, value, onValueChange, options, icon: Icon }: FilterSelectProps) {
  return (
    <div className="space-y-1.5 flex-grow sm:flex-grow-0 sm:w-auto min-w-[150px] w-full">
      <Label className="text-xs font-medium text-muted-foreground flex items-center">
        {Icon && <Icon className="mr-1.5 h-3.5 w-3.5 text-primary/70"/>}
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full text-xs h-9 px-3 py-1.5 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
