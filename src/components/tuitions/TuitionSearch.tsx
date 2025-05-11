
"use client";

import { useState, useMemo, useEffect } from "react";
import type { TuitionRequirement } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TuitionRequirementCard } from "./TuitionRequirementCard";
import { SearchIcon, XIcon, BookOpen, Users, MapPin, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock data - replace with API call in a real app
const MOCK_REQUIREMENTS: TuitionRequirement[] = [
  { id: "1", parentId: "p1", parentName: "Alice Smith", subject: "Mathematics", gradeLevel: "Grade 9-10", scheduleDetails: "Mon, Wed, Fri 5-7 PM", location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 2).toISOString(), additionalNotes: "Needs help with algebra and geometry.", board: "CBSE", teachingMode: ["Online"] },
  { id: "2", parentId: "p2", parentName: "Bob Johnson", subject: "Physics", gradeLevel: "Grade 11-12", scheduleDetails: "Weekends, 4 hours total", location: "Student's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 5).toISOString(), board: "ICSE", teachingMode: ["Offline (In-person)"] },
  { id: "3", parentId: "p3", parentName: "Carol Williams", subject: "English", gradeLevel: "Grade 6-8", scheduleDetails: "Tues, Thurs 4-6 PM", location: "Online", status: "matched", postedAt: new Date(Date.now() - 86400000 * 10).toISOString(), additionalNotes: "Focus on grammar and essay writing.", board: "State Board", teachingMode: ["Online"] },
  { id: "4", parentId: "p4", parentName: "David Brown", subject: "Computer Science", gradeLevel: "College Level", scheduleDetails: "Flexible, project-based", location: "Online", status: "open", postedAt: new Date().toISOString(), board: "IB", teachingMode: ["Online", "Offline (In-person)"] },
  { id: "5", parentId: "p5", parentName: "Eve Davis", subject: "Mathematics", gradeLevel: "Grade 1-5", scheduleDetails: "Sat 10 AM - 12 PM", location: "Tutor's Home", status: "closed", postedAt: new Date(Date.now() - 86400000 * 30).toISOString(), board: "IGCSE", teachingMode: ["Offline (In-person)"] },
];

const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music"];
const gradeLevels = ["All", "Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner"];
const locations = ["All", "Online", "Student's Home", "Tutor's Home", "Public Place (e.g. Library)"];


export function TuitionSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [requirements, setRequirements] = useState<TuitionRequirement[]>([]);

  useEffect(() => {
    // Simulate API call
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
        (req.additionalNotes && req.additionalNotes.toLowerCase().includes(searchTermLower));
      
      const matchesSubject = subjectFilter === "All" || req.subject === subjectFilter;
      const matchesGradeLevel = gradeLevelFilter === "All" || req.gradeLevel === gradeLevelFilter;
      const matchesLocation = locationFilter === "All" || req.location === locationFilter;

      return matchesSearchTerm && matchesSubject && matchesGradeLevel && matchesLocation;
    });
  }, [searchTerm, subjectFilter, gradeLevelFilter, locationFilter, requirements]);

  const resetFilters = () => {
    setSearchTerm("");
    setSubjectFilter("All");
    setGradeLevelFilter("All");
    setLocationFilter("All");
  };

  return (
    <div className="space-y-6"> {/* Reduced space-y */}
      <Card className="shadow-lg bg-card border animate-in fade-in duration-700 ease-out rounded-xl overflow-hidden"> {/* Updated card styling */}
        <CardHeader className="p-5 md:p-6"> {/* Reduced padding */}
           <CardTitle className="text-2xl md:text-3xl font-semibold text-primary tracking-tight flex items-center"> {/* Reduced text size */}
            <SearchIcon className="w-6 h-6 md:w-7 md:h-7 mr-2.5"/>Find Tuition Opportunities {/* Reduced icon size and margin */}
          </CardTitle>
          <CardDescription className="text-sm md:text-base text-foreground/70 mt-1"> {/* Reduced text size */}
            Search and filter to find the perfect tuition job for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 p-5 md:p-6 pt-0"> {/* Reduced space-y, reduced padding */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> {/* Adjusted icon size */}
            <Input
              type="search"
              placeholder="Search by subject, grade, location, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-sm bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-xs hover:shadow-sm focus:shadow-md rounded-lg" // Adjusted padding, text size, shadow
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end"> {/* Reduced gap */}
            <FilterItem icon={BookOpen} label="Subject" value={subjectFilter} onValueChange={setSubjectFilter} options={subjects} />
            <FilterItem icon={Users} label="Grade Level" value={gradeLevelFilter} onValueChange={setGradeLevelFilter} options={gradeLevels} />
            <FilterItem icon={MapPin} label="Location" value={locationFilter} onValueChange={setLocationFilter} options={locations} />
            
            <Button onClick={resetFilters} variant="outline" className="h-10 text-sm border-border hover:border-destructive hover:bg-destructive/10 hover:text-destructive transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-xs hover:shadow-sm rounded-lg flex items-center gap-1.5"> {/* Adjusted height, text size, shadow, gap */}
              <XIcon className="w-4 h-4" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredRequirements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"> {/* Adjusted gap */}
          {filteredRequirements.map((req, index) => (
            <div 
              key={req.id}
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
              style={{ animationDelay: `${index * 0.05 + 0.3}s` }} // Stagger animation
            >
              <TuitionRequirementCard requirement={req} />
            </div>
          ))}
        </div>
      ) : (
         <Card className="text-center py-12 shadow-md animate-in fade-in zoom-in-95 duration-500 ease-out rounded-xl bg-card border border-border/30"> {/* Adjusted padding, shadow */}
          <CardContent className="flex flex-col items-center">
            <Filter className="w-16 h-16 text-primary/30 mx-auto mb-5" /> {/* Reduced icon size and margin */}
            <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Matching Tuitions Found</p> {/* Reduced text size and margin */}
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
             Try adjusting your search filters or check back later for new opportunities.
            </p>
             <Button onClick={resetFilters} variant="outline" className="mt-6 text-sm py-2 px-4"> {/* Reduced text size and padding */}
              <XIcon className="w-3.5 h-3.5 mr-1.5" /> {/* Adjusted icon size */}
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
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
    <div className="space-y-1"> {/* Reduced space-y */}
      <label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`} className="text-xs font-medium text-muted-foreground flex items-center"> {/* Adjusted text size */}
        <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>{label} {/* Adjusted icon size */}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          id={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`} 
          className="bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-xs hover:shadow-sm focus:shadow-md rounded-lg h-10 text-sm" // Adjusted height, text size, shadow
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>)} {/* Adjusted text size */}
        </SelectContent>
      </Select>
    </div>
  );
}
