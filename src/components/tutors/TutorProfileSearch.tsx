
"use client";

import { useState, useMemo, useEffect } from "react";
import type { TutorProfile } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TutorProfileCard } from "./TutorProfileCard";
import { SearchIcon, XIcon, BookOpen, Users, GraduationCap, Filter as LucideFilter, ListFilter, RadioTower, MapPin, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_TUTOR_PROFILES } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider"; // Added Slider import

const allSubjectsList: {value: string, label: string}[] = ["All", ...new Set(MOCK_TUTOR_PROFILES.flatMap(t => t.subjects))].filter((v, i, a) => a.indexOf(v) === i).map(s => ({value: s, label: s}));
const gradeLevelsList: {value: string, label: string}[] = ["All", ...new Set(MOCK_TUTOR_PROFILES.flatMap(t => Array.isArray(t.gradeLevelsTaught) ? t.gradeLevelsTaught : (t.grade ? [t.grade] : [])))].filter(Boolean).filter((v,i,a) => a.indexOf(v) === i).map(g => ({value: g, label:g}));

const modeOptionsList: { value: string; label: string }[] = [
  { value: "All", label: "All Modes" },
  { value: "Online", label: "Online" },
  { value: "StudentHome", label: "At Student's Home" },
  { value: "TutorHome", label: "At Tutor's Home" },
  { value: "Both", label: "Both (Online & In-person)" },
];


export function TutorProfileSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [feeRange, setFeeRange] = useState<[number, number]>([200, 2000]);
  const [tutorProfiles, setTutorProfiles] = useState<TutorProfile[]>([]);

  useEffect(() => {
    setTutorProfiles(MOCK_TUTOR_PROFILES);
  }, []);

  const filteredTutorProfiles = useMemo(() => {
    return tutorProfiles.filter((tutor) => {
      const searchTermLower = searchTerm.toLowerCase();
      const locationSearchTermLower = locationSearchTerm.toLowerCase();

      const matchesSearchTerm = searchTerm === "" ||
        tutor.name.toLowerCase().includes(searchTermLower) ||
        tutor.subjects.some(s => s.toLowerCase().includes(searchTermLower)) ||
        (tutor.bio && tutor.bio.toLowerCase().includes(searchTermLower)) ||
        (tutor.grade && tutor.grade.toLowerCase().includes(searchTermLower)) ||
        (Array.isArray(tutor.gradeLevelsTaught) && tutor.gradeLevelsTaught.some(gl => gl.toLowerCase().includes(searchTermLower)));
      
      const matchesSubject = subjectFilter === "All" || tutor.subjects.includes(subjectFilter);
      const matchesGrade = gradeFilter === "All" || tutor.grade === gradeFilter || (Array.isArray(tutor.gradeLevelsTaught) && tutor.gradeLevelsTaught.includes(gradeFilter));

      let matchesMode = true;
      if (modeFilter !== "All") {
        const tutorTeachingModes = Array.isArray(tutor.teachingMode) ? tutor.teachingMode : [];
        const offersOnline = tutorTeachingModes.includes("Online");
        const offersInPerson = tutorTeachingModes.includes("Offline (In-person)") || tutorTeachingModes.includes("In-person");

        if (modeFilter === "Online") {
          matchesMode = offersOnline;
        } else if (modeFilter === "StudentHome") {
          matchesMode = offersInPerson && tutor.location?.toLowerCase().includes("student's home");
        } else if (modeFilter === "TutorHome") {
          matchesMode = offersInPerson && tutor.location?.toLowerCase().includes("tutor's home");
        } else if (modeFilter === "Both") {
          matchesMode = offersOnline && offersInPerson;
        }
      }

      const matchesLocationSearch = locationSearchTerm === "" || (tutor.location && tutor.location.toLowerCase().includes(locationSearchTermLower));
      
      const tutorRate = parseFloat(tutor.hourlyRate || "");
      const matchesFee = isNaN(tutorRate) ? false : (tutorRate >= feeRange[0] && tutorRate <= feeRange[1]);


      return matchesSearchTerm && matchesSubject && matchesGrade && matchesMode && matchesLocationSearch && matchesFee;
    });
  }, [searchTerm, subjectFilter, gradeFilter, modeFilter, locationSearchTerm, feeRange, tutorProfiles]);

  const resetFilters = () => {
    setSearchTerm("");
    setSubjectFilter("All");
    setGradeFilter("All");
    setModeFilter("All");
    setLocationSearchTerm("");
    setFeeRange([200, 2000]);
  };

  const renderTutorList = (profiles: TutorProfile[]) => {
    if (profiles.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {profiles.map((tutor, index) => (
            <div
              key={tutor.id}
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out h-full"
              style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
            >
              <TutorProfileCard tutor={tutor} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <Card className="text-center py-12 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out">
        <CardContent className="flex flex-col items-center">
          <ListFilter className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Tutors Found</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            There are no tutors matching your current filters. Try adjusting your search or check back later.
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
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2.5 text-sm bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-xs hover:shadow-sm focus:shadow-md rounded-lg"
        />
      </div>
      <FilterItem icon={RadioTower} label="Mode" value={modeFilter} onValueChange={setModeFilter} options={modeOptionsList} />
      <div className="space-y-1.5">
        <Label htmlFor="location-search-filter" className="text-xs font-medium text-muted-foreground flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>Preferred Location
        </Label>
        <Input
          type="search"
          id="location-search-filter"
          placeholder="Enter city, area..."
          value={locationSearchTerm}
          onChange={(e) => setLocationSearchTerm(e.target.value)}
          className="h-9 text-xs bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg"
        />
      </div>
       <div className="space-y-2.5 pt-1">
        <Label htmlFor="fee-range-filter" className="text-xs font-medium text-muted-foreground flex items-center">
          <DollarSign className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
          Fee Range (per hour)
        </Label>
        <div className="text-xs text-foreground/80 font-medium text-center pb-1">
          ₹{feeRange[0]} – ₹{feeRange[1]}
        </div>
        <Slider
          id="fee-range-filter"
          min={200}
          max={2000}
          step={50}
          value={feeRange}
          onValueChange={(value: number[]) => setFeeRange(value as [number, number])}
          className="w-full"
        />
      </div>
      <FilterItem icon={BookOpen} label="Subject" value={subjectFilter} onValueChange={setSubjectFilter} options={allSubjectsList} />
      <FilterItem icon={GraduationCap} label="Grade Level" value={gradeFilter} onValueChange={setGradeFilter} options={gradeLevelsList} />
      <Button
        onClick={resetFilters}
        variant="outline"
        size="sm"
        className="w-full bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground transform transition-transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-md flex items-center gap-2 text-sm py-2 px-3 mt-4"
      >
        <XIcon className="w-4 h-4" />
        Reset All Filters
      </Button>
    </>
  );


  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 space-y-6 py-6 md:py-8"> 
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Panel */}
        <div className="lg:hidden mb-6 animate-in fade-in slide-in-from-top-5 duration-500 ease-out">
          <Accordion type="single" collapsible className="w-full bg-card border rounded-lg shadow-md overflow-hidden"> {/* Applied shadow-md */}
            <AccordionItem value="filters" className="border-b-0">
              <AccordionTrigger className="w-full hover:no-underline px-4 py-3 data-[state=open]:border-b data-[state=open]:border-border/30">
                <div className="flex flex-row justify-between items-center w-full">
                  <h3 className="text-lg font-semibold text-primary flex items-center">
                    <LucideFilter className="w-5 h-5 mr-2.5"/>
                    Filter Tutors
                  </h3>
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

        <aside className="lg:w-[300px] space-y-6 animate-in fade-in slide-in-from-left-5 duration-500 ease-out hidden lg:block">
          <Card className="bg-card border rounded-lg shadow-md"> {/* Applied shadow-md */}
            <CardHeader className="pb-4 border-b border-border/30">
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <LucideFilter className="w-5 h-5 mr-2.5"/>
                Filter Tutors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              {filterPanelContent}
            </CardContent>
          </Card>
        </aside>

        {/* Main Content (Right) */}
        <main className="flex-1 space-y-6">
           {renderTutorList(filteredTutorProfiles)}
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
  options: {value: string, label: string}[];
}

function FilterItem({ icon: Icon, label, value, onValueChange, options }: FilterItemProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`} className="text-xs font-medium text-muted-foreground flex items-center">
        <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>{label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`}
          className="bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg h-9 text-xs"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[180px]">
            {options.map(opt => <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>)}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
}
