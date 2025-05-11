"use client";

import { useState, useMemo, useEffect } from "react";
import type { TuitionRequirement } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TuitionRequirementCard } from "@/components/tuitions/TuitionRequirementCard";
import { SearchIcon, XIcon, BookOpen, Users, MapPin, FilterIcon as Filter, ListFilter, Building, Users2, GraduationCap, RadioTower, Clock, ListChecks, CheckSquare, Star, Inbox, ChevronDown } from "lucide-react"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Added ScrollBar
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Mock data - replace with API call in a real app
const MOCK_REQUIREMENTS: TuitionRequirement[] = [
  { id: "1", parentId: "p1", parentName: "Alice Smith", subject: "Mathematics", gradeLevel: "Grade 9-10", scheduleDetails: "Mon, Wed, Fri 5-7 PM", location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 2).toISOString(), additionalNotes: "Needs help with algebra and geometry.", board: "CBSE", teachingMode: ["Online"] },
  { id: "2", parentId: "p2", parentName: "Bob Johnson", subject: "Physics", gradeLevel: "Grade 11-12", scheduleDetails: "Weekends, 4 hours total", location: "Student's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 5).toISOString(), board: "ICSE", teachingMode: ["Offline (In-person)"] },
  { id: "3", parentId: "p3", parentName: "Carol Williams", subject: "English", gradeLevel: "Grade 6-8", scheduleDetails: "Tues, Thurs 4-6 PM", location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 1).toISOString(), additionalNotes: "Focus on grammar and essay writing.", board: "State Board", teachingMode: ["Online"] },
  { id: "4", parentId: "p4", parentName: "David Brown", subject: "Computer Science", gradeLevel: "College Level", scheduleDetails: "Flexible, project-based", location: "Online", status: "open", postedAt: new Date().toISOString(), board: "IB", teachingMode: ["Online", "Offline (In-person)"] },
  { id: "5", parentId: "p5", parentName: "Eve Davis", subject: "Mathematics", gradeLevel: "Grade 1-5", scheduleDetails: "Sat 10 AM - 12 PM", location: "Tutor's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 3).toISOString(), board: "IGCSE", teachingMode: ["Offline (In-person)"] },
  { id: "6", parentId: "p6", parentName: "Frank Green", subject: "Chemistry", gradeLevel: "Grade 9-10", scheduleDetails: "Mon 7-9 PM", location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 1).toISOString(), board: "CBSE", teachingMode: ["Online"] },
  { id: "7", parentId: "p7", parentName: "Grace Hall", subject: "Biology", gradeLevel: "Grade 11-12", scheduleDetails: "Flexible Evening Hours", location: "Student's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 6).toISOString(), additionalNotes: "Looking for an experienced biology tutor for IB curriculum.", board: "IB", teachingMode: ["Offline (In-person)"] },
];

const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"];
const gradeLevels = ["All", "Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner", "Other"];
const locations = ["All", "Online", "Student's Home", "Tutor's Home", "Public Place (e.g. Library)"];
const boards = ["All", "CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"];
const teachingModes = ["All", "Online", "Offline (In-person)"];


export default function AllEnquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [boardFilter, setBoardFilter] = useState("All");
  const [teachingModeFilter, setTeachingModeFilter] = useState("All");
  const [requirements, setRequirements] = useState<TuitionRequirement[]>([]);
  const [activeTab, setActiveTab] = useState("recommended");

  useEffect(() => {
    setRequirements(MOCK_REQUIREMENTS.filter(r => r.status === 'open'));
  }, []);

  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = searchTerm === "" || 
        req.subject.toLowerCase().includes(searchTermLower) ||
        req.gradeLevel.toLowerCase().includes(searchTermLower) ||
        (req.parentName && req.parentName.toLowerCase().includes(searchTermLower)) ||
        (req.location && req.location.toLowerCase().includes(searchTermLower)) ||
        (req.board && req.board.toLowerCase().includes(searchTermLower)) ||
        (req.teachingMode && req.teachingMode.some(tm => tm.toLowerCase().includes(searchTermLower))) ||
        (req.additionalNotes && req.additionalNotes.toLowerCase().includes(searchTermLower));
      
      const matchesSubject = subjectFilter === "All" || req.subject === subjectFilter;
      const matchesGradeLevel = gradeLevelFilter === "All" || req.gradeLevel === gradeLevelFilter;
      const matchesLocation = locationFilter === "All" || req.location === locationFilter;
      const matchesBoard = boardFilter === "All" || req.board === boardFilter;
      const matchesTeachingMode = teachingModeFilter === "All" || (req.teachingMode && req.teachingMode.includes(teachingModeFilter));

      return matchesSearchTerm && matchesSubject && matchesGradeLevel && matchesLocation && matchesBoard && matchesTeachingMode;
    });
  }, [searchTerm, subjectFilter, gradeLevelFilter, locationFilter, boardFilter, teachingModeFilter, requirements]);

  const resetFilters = () => {
    setSearchTerm("");
    setSubjectFilter("All");
    setGradeLevelFilter("All");
    setLocationFilter("All");
    setBoardFilter("All");
    setTeachingModeFilter("All");
  };
  
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";

  // Mock counts - replace with actual logic later
  const tabCounts = {
    recommended: filteredRequirements.length, 
    applied: 0, 
    received: 0,
    shortlisted: 0,
  };

  const renderEnquiryList = (enquiries: TuitionRequirement[]) => {
    if (enquiries.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {enquiries.map((req, index) => (
            <div 
              key={req.id}
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
              style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
            >
              <TuitionRequirementCard requirement={req} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <Card className="text-center py-12 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out">
        <CardContent className="flex flex-col items-center">
          <ListChecks className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Enquiries Here Yet</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            There are no enquiries in this category. Try other filters or check back later.
          </p>
           <Button onClick={resetFilters} variant="outline" className="mt-6 text-sm py-2 px-5">
            <XIcon className="w-3.5 h-3.5 mr-1.5" />
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    );
  };

  const filterPanelContent = (
    <>
      <FilterItem icon={BookOpen} label="Subject" value={subjectFilter} onValueChange={setSubjectFilter} options={subjects} />
      <FilterItem icon={GraduationCap} label="Grade Level" value={gradeLevelFilter} onValueChange={setGradeLevelFilter} options={gradeLevels} />
      <FilterItem icon={Building} label="Board" value={boardFilter} onValueChange={setBoardFilter} options={boards} />
      <FilterItem icon={MapPin} label="Location" value={locationFilter} onValueChange={setLocationFilter} options={locations} />
      <FilterItem icon={RadioTower} label="Teaching Mode" value={teachingModeFilter} onValueChange={setTeachingModeFilter} options={teachingModes} />
      <Button 
        onClick={resetFilters} 
        variant="outline" 
        size="sm"
        className="w-full bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground transform transition-transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-md flex items-center gap-2 text-sm py-2 px-3"
      >
        <XIcon className="w-4 h-4" />
        Reset All Filters
      </Button>
    </>
  );


  return (
    <div className={`${containerPadding} pb-8`}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Panel */}
        {/* Mobile Accordion Filter */}
        <div className="lg:hidden mb-6 animate-in fade-in slide-in-from-top-5 duration-500 ease-out">
          <Accordion type="single" collapsible className="w-full bg-card border rounded-lg shadow-sm overflow-hidden">
            <AccordionItem value="filters" className="border-b-0">
              <AccordionTrigger className="w-full hover:no-underline px-4 py-3 data-[state=open]:border-b data-[state=open]:border-border/30">
                <div className="flex flex-row justify-between items-center w-full">
                  <h3 className="text-lg font-semibold text-primary flex items-center">
                    <Filter className="w-5 h-5 mr-2.5"/>
                    Filter Enquiries
                  </h3>
                  {/* ChevronDown icon is part of AccordionTrigger by default */}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-0">
                <div className="p-4 space-y-5">
                  {filterPanelContent}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Desktop Static Filter Panel */}
        <aside className="lg:w-[300px] space-y-6 animate-in fade-in slide-in-from-left-5 duration-500 ease-out hidden lg:block">
          <Card className="bg-card border rounded-lg shadow-sm">
            <CardHeader className="pb-4 border-b border-border/30">
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <Filter className="w-5 h-5 mr-2.5"/>
                Filter Enquiries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              {filterPanelContent}
            </CardContent>
          </Card>
        </aside>

        {/* Enquiry List (Right) */}
        <main className="flex-1 space-y-6">
           <Tabs defaultValue="recommended" className="w-full" onValueChange={setActiveTab}>
             <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex gap-1.5 sm:gap-2 bg-card border rounded-lg p-1 shadow-sm">
                <TabsTrigger value="recommended" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                  <Star className="w-3.5 h-3.5"/> Recommended ({tabCounts.recommended})
                </TabsTrigger>
                <TabsTrigger value="applied" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5"/> Applied ({tabCounts.applied})
                </TabsTrigger>
                <TabsTrigger value="received" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                   <Inbox className="w-3.5 h-3.5"/> Received ({tabCounts.received})
                </TabsTrigger>
                <TabsTrigger value="shortlisted" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5"/> Shortlisted ({tabCounts.shortlisted})
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" className="h-2 mt-1" />
            </ScrollArea>

            <TabsContent value="recommended" className="mt-6">
              {renderEnquiryList(filteredRequirements)}
            </TabsContent>
            <TabsContent value="applied" className="mt-6">
              {renderEnquiryList([])} 
            </TabsContent>
            <TabsContent value="received" className="mt-6">
              {renderEnquiryList([])}
            </TabsContent>
            <TabsContent value="shortlisted" className="mt-6">
              {renderEnquiryList([])}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}


interface FilterItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
}

function FilterItem({ icon: Icon, label, value, onValueChange, options }: FilterItemProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`} className="text-xs font-medium text-muted-foreground flex items-center">
        <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>{label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          id={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`} 
          className="bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg h-9 text-xs"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[180px]">
            {options.map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
}
