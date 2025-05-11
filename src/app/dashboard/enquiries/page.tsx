
"use client";

import { useState, useMemo, useEffect } from "react";
import type { TuitionRequirement } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TuitionRequirementCard } from "@/components/tuitions/TuitionRequirementCard";
import { SearchIcon, XIcon, BookOpen, Users, MapPin, FilterIcon as Filter, ListFilter, Building, Users2, GraduationCap, RadioTower } from "lucide-react"; // Added GraduationCap, RadioTower, changed Filter to FilterIcon
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  return (
    <div className={`${containerPadding} py-8`}>
      <Card className="shadow-xl bg-gradient-to-br from-primary/15 via-card to-card border-none animate-in fade-in duration-700 ease-out rounded-xl overflow-hidden mb-8">
        <CardHeader className="p-6 md:p-8">
           <CardTitle className="text-3xl md:text-4xl font-bold text-primary tracking-tight flex items-center">
            <ListFilter className="w-8 h-8 md:w-10 md:h-10 mr-3"/>All Tuition Enquiries
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-foreground/80 mt-1">
            Browse and apply for available tuition requirements posted by parents.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Panel (Left) */}
        <aside className="lg:w-1/4 xl:w-1/5 space-y-6 animate-in fade-in slide-in-from-left-5 duration-500 ease-out">
          <Card className="shadow-lg rounded-xl bg-card border border-border/30">
            <CardHeader className="pb-4 border-b border-border/30">
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <Filter className="w-5 h-5 mr-2.5"/>
                Filter Enquiries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <FilterItem icon={BookOpen} label="Subject" value={subjectFilter} onValueChange={setSubjectFilter} options={subjects} />
              <FilterItem icon={GraduationCap} label="Grade Level" value={gradeLevelFilter} onValueChange={setGradeLevelFilter} options={gradeLevels} />
              <FilterItem icon={Building} label="Board" value={boardFilter} onValueChange={setBoardFilter} options={boards} />
              <FilterItem icon={MapPin} label="Location" value={locationFilter} onValueChange={setLocationFilter} options={locations} />
              <FilterItem icon={RadioTower} label="Teaching Mode" value={teachingModeFilter} onValueChange={setTeachingModeFilter} options={teachingModes} />
              <Button onClick={resetFilters} variant="outline" className="w-full h-11 text-base border-border hover:border-destructive hover:bg-destructive/10 hover:text-destructive transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center gap-2">
                <XIcon className="w-5 h-5" />
                Reset All Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Enquiry List (Right) */}
        <main className="flex-1 space-y-6">
          <div className="relative animate-in fade-in duration-500 ease-out">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by subject, grade, location, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-base bg-card border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg"
            />
          </div>

          {filteredRequirements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRequirements.map((req, index) => (
                <div 
                  key={req.id}
                  className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
                  style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
                >
                  <TuitionRequirementCard requirement={req} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 shadow-lg animate-in fade-in zoom-in-95 duration-500 ease-out rounded-xl bg-card border border-border/30">
              <CardContent className="flex flex-col items-center">
                <Filter className="w-20 h-20 text-primary/40 mx-auto mb-6" />
                <p className="text-2xl font-semibold text-foreground/80 mb-2">No Matching Enquiries Found</p>
                <p className="text-md text-muted-foreground max-w-md mx-auto text-[15px]">
                 Try adjusting your search filters or check back later for new opportunities.
                </p>
                 <Button onClick={resetFilters} variant="outline" className="mt-8 text-base py-2.5 px-6">
                  <XIcon className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
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
      <label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`} className="text-sm font-medium text-muted-foreground flex items-center">
        <Icon className="w-4 h-4 mr-2 text-primary/80"/>{label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          id={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`} 
          className="bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg h-10 text-[15px]" // Adjusted height and text size
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[200px]"> {/* Added ScrollArea for long lists */}
            {options.map(opt => <SelectItem key={opt} value={opt} className="text-[15px]">{opt}</SelectItem>)}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
}

