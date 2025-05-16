
"use client";

import { useState, useMemo, useEffect } from "react";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, ListFilter, PlusCircle, CalendarDays, Users, Star as StarIcon, MessageSquareQuote, Edit3, XCircle, Video, MessageSquareText, Clock as ClockIcon, XIcon, BookOpen } from "lucide-react";
import type { DemoSession } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { ParentDemoSessionCard } from "@/components/dashboard/parent/ParentDemoSessionCard"; 
import { Label } from "@/components/ui/label"; 

const Info: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

export default function MyDemosPage() {
  const [allDemos, setAllDemos] = useState<DemoSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [tutorFilter, setTutorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setAllDemos(MOCK_DEMO_SESSIONS);
  }, []);

  const filteredDemos = useMemo(() => {
    return allDemos.filter(demo => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" ||
        demo.subject.toLowerCase().includes(searchLower) ||
        (demo.tutorName && demo.tutorName.toLowerCase().includes(searchLower)) ||
        demo.studentName.toLowerCase().includes(searchLower);
      
      const matchesSubject = subjectFilter === "All" || demo.subject === subjectFilter;
      const matchesTutor = tutorFilter === "All" || demo.tutorName === tutorFilter;
      const matchesStatus = statusFilter === "All" || demo.status === statusFilter;

      return matchesSearch && matchesSubject && matchesTutor && matchesStatus;
    });
  }, [searchTerm, subjectFilter, tutorFilter, statusFilter, allDemos]);

  const scheduledDemos = useMemo(() => filteredDemos.filter(d => d.status === "Scheduled"), [filteredDemos]);
  const requestedDemos = useMemo(() => filteredDemos.filter(d => d.status === "Requested"), [filteredDemos]);
  const pastDemos = useMemo(() => filteredDemos.filter(d => d.status === "Completed" || d.status === "Cancelled"), [filteredDemos]);

  const mockActionHandler = (action: string, demoId: string) => {
    console.log(`${action} clicked for demo ID: ${demoId}`);
  };

  const uniqueSubjects = ["All", ...new Set(MOCK_DEMO_SESSIONS.map(d => d.subject))];
  const uniqueTutorNames = ["All", ...new Set(MOCK_DEMO_SESSIONS.map(d => d.tutorName).filter(Boolean) as string[])];
  const demoStatuses = ["All", "Scheduled", "Requested", "Completed", "Cancelled"];
  
  const showClearFilters = searchTerm !== "" || subjectFilter !== "All" || tutorFilter !== "All" || statusFilter !== "All";

  const resetFilters = () => {
    setSearchTerm("");
    setSubjectFilter("All");
    setTutorFilter("All");
    setStatusFilter("All");
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
            onReschedule={(id) => mockActionHandler("Reschedule", id)}
            onCancel={(id) => mockActionHandler("Cancel", id)}
            onEditRequest={(id) => mockActionHandler("Edit Request", id)}
            onWithdrawRequest={(id) => mockActionHandler("Withdraw Request", id)}
            onGiveFeedback={(id) => mockActionHandler("Give Feedback", id)}
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
      
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-6 p-4 bg-card border rounded-lg shadow-sm items-center">
        <div className="relative flex-grow sm:flex-grow-0 sm:w-auto min-w-[200px] w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by subject, tutor, student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm hover:shadow-md rounded-lg w-full"
          />
        </div>
        <FilterSelect label="Subject" value={subjectFilter} onValueChange={setSubjectFilter} options={uniqueSubjects} icon={BookOpen} />
        <FilterSelect label="Tutor" value={tutorFilter} onValueChange={setTutorFilter} options={uniqueTutorNames} icon={Users} />
        <FilterSelect label="Status" value={statusFilter} onValueChange={setStatusFilter} options={demoStatuses} icon={ListFilter} />
        {showClearFilters && (
          <Button onClick={resetFilters} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive sm:ml-auto">
            <XIcon className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
          </Button>
        )}
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
