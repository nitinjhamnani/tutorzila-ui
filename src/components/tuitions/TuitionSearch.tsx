
"use client";

import { useState, useMemo, useEffect } from "react";
import type { TuitionRequirement } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TuitionRequirementCard } from "./TuitionRequirementCard";
import { SearchIcon, XIcon, BookOpen, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - replace with API call in a real app
const MOCK_REQUIREMENTS: TuitionRequirement[] = [
  { id: "1", parentId: "p1", parentName: "Alice Smith", subject: "Mathematics", gradeLevel: "Grade 9-10", scheduleDetails: "Mon, Wed, Fri 5-7 PM", location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 2).toISOString(), additionalNotes: "Needs help with algebra and geometry." },
  { id: "2", parentId: "p2", parentName: "Bob Johnson", subject: "Physics", gradeLevel: "Grade 11-12", scheduleDetails: "Weekends, 4 hours total", location: "Student's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "3", parentId: "p3", parentName: "Carol Williams", subject: "English", gradeLevel: "Grade 6-8", scheduleDetails: "Tues, Thurs 4-6 PM", location: "Online", status: "matched", postedAt: new Date(Date.now() - 86400000 * 10).toISOString(), additionalNotes: "Focus on grammar and essay writing." },
  { id: "4", parentId: "p4", parentName: "David Brown", subject: "Computer Science", gradeLevel: "College Level", scheduleDetails: "Flexible, project-based", location: "Online", status: "open", postedAt: new Date().toISOString() },
  { id: "5", parentId: "p5", parentName: "Eve Davis", subject: "Mathematics", gradeLevel: "Grade 1-5", scheduleDetails: "Sat 10 AM - 12 PM", location: "Tutor's Home", status: "closed", postedAt: new Date(Date.now() - 86400000 * 30).toISOString() },
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
    setRequirements(MOCK_REQUIREMENTS.filter(r => r.status === 'open'));
  }, []);

  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      const matchesSearchTerm = searchTerm === "" || 
        req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.additionalNotes && req.additionalNotes.toLowerCase().includes(searchTerm.toLowerCase()));
      
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
    <div className="space-y-8">
      <Card className="shadow-lg animate-in fade-in duration-300 ease-out">
        <CardHeader>
          <CardTitle className="text-2xl">Find Tuition Opportunities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by subject, grade, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label htmlFor="subject-filter" className="text-sm font-medium text-muted-foreground flex items-center"><BookOpen className="w-4 h-4 mr-1.5"/>Subject</label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger id="subject-filter" className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label htmlFor="grade-filter" className="text-sm font-medium text-muted-foreground flex items-center"><Users className="w-4 h-4 mr-1.5"/>Grade Level</label>
              <Select value={gradeLevelFilter} onValueChange={setGradeLevelFilter}>
                <SelectTrigger id="grade-filter" className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {gradeLevels.map(gl => <SelectItem key={gl} value={gl}>{gl}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label htmlFor="location-filter" className="text-sm font-medium text-muted-foreground flex items-center"><MapPin className="w-4 h-4 mr-1.5"/>Location</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger id="location-filter" className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={resetFilters} variant="outline" className="self-end h-10 transform transition-transform hover:scale-105 active:scale-95">
              <XIcon className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredRequirements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequirements.map((req, index) => (
            <div 
              key={req.id}
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <TuitionRequirementCard requirement={req} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-md animate-in fade-in zoom-in-95 duration-500 ease-out">
          <CardContent>
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">No matching tuition requirements found.</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search filters or check back later.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
