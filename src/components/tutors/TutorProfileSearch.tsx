"use client";

import { useState, useMemo, useEffect } from "react";
import type { TutorProfile } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TutorProfileCard } from "./TutorProfileCard";
import { SearchIcon, XIcon, BookOpen, Star, Users, GraduationCap, Filter } from "lucide-react"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock data for Tutor Profiles
const MOCK_TUTOR_PROFILES: TutorProfile[] = [
  { id: "t1", name: "Dr. Emily Carter", email: "emily.carter@example.com", role: "tutor", avatar: "https://picsum.photos/seed/emilycarter/128", subjects: ["Physics", "Mathematics", "Chemistry"], grade: "Doctorate Level", experience: "10+ years", hourlyRate: "5000", bio: "PhD in Physics with a passion for demystifying complex scientific concepts for students of all levels.", teachingMode: "Online", status: "Active" },
  { id: "t2", name: "John Adebayo", email: "john.adebayo@example.com", role: "tutor", avatar: "https://picsum.photos/seed/johnadebayo/128", subjects: ["English Literature", "History", "Creative Writing"], grade: "Master's Level", experience: "5-7 years", hourlyRate: "4000", bio: "MA in English Literature. Dedicated to fostering critical thinking and a love for the humanities.", teachingMode: "In-person", status: "Active" },
  { id: "t3", name: "Sophia Chen", email: "sophia.chen@example.com", role: "tutor", avatar: "https://picsum.photos/seed/sophiachen/128", subjects: ["Computer Science", "Mathematics", "Web Development"], grade: "University Level", experience: "3-5 years", hourlyRate: "4500", bio: "Software engineer and CS graduate, specializing in Python, Java, and web technologies.", teachingMode: "Hybrid", status: "Active" },
  { id: "t4", name: "David Miller", email: "david.miller@example.com", role: "tutor", avatar: "https://picsum.photos/seed/davidmiller/128", subjects: ["Biology", "Chemistry"], grade: "High School & College", experience: "7+ years", hourlyRate: "4800", bio: "Former research scientist with extensive experience in tutoring high school and college biology.", teachingMode: "Online", status: "Inactive" },
  { id: "t5", name: "Linda Garcia", email: "linda.garcia@example.com", role: "tutor", avatar: "https://picsum.photos/seed/lindagarcia/128", subjects: ["Spanish", "French"], grade: "All Levels", experience: "3-5 years", hourlyRate: "3500", bio: "Native Spanish speaker, fluent in French. Passionate about language learning and cultural exchange.", teachingMode: "In-person", status: "Active" },
];

const allSubjects = ["All", ...new Set(MOCK_TUTOR_PROFILES.flatMap(t => t.subjects))].filter((v, i, a) => a.indexOf(v) === i);
const experienceLevels = ["All", "1-3 years", "3-5 years", "5-7 years", "7+ years", "10+ years"];
const gradeLevels = ["All", ...new Set(MOCK_TUTOR_PROFILES.map(t => t.grade).filter(Boolean) as string[])].filter((v,i,a) => a.indexOf(v) === i);


export function TutorProfileSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All"); 
  const [tutorProfiles, setTutorProfiles] = useState<TutorProfile[]>([]);

  useEffect(() => {
    setTutorProfiles(MOCK_TUTOR_PROFILES);
  }, []);

  const filteredTutorProfiles = useMemo(() => {
    return tutorProfiles.filter((tutor) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = searchTerm === "" ||
        tutor.name.toLowerCase().includes(searchTermLower) ||
        tutor.subjects.some(s => s.toLowerCase().includes(searchTermLower)) ||
        (tutor.bio && tutor.bio.toLowerCase().includes(searchTermLower)) ||
        (tutor.grade && tutor.grade.toLowerCase().includes(searchTermLower));
      
      const matchesSubject = subjectFilter === "All" || tutor.subjects.includes(subjectFilter);
      const matchesExperience = experienceFilter === "All" || tutor.experience === experienceFilter;
      const matchesGrade = gradeFilter === "All" || tutor.grade === gradeFilter;

      return matchesSearchTerm && matchesSubject && matchesExperience && matchesGrade;
    });
  }, [searchTerm, subjectFilter, experienceFilter, gradeFilter, tutorProfiles]);

  const resetFilters = () => {
    setSearchTerm("");
    setSubjectFilter("All");
    setExperienceFilter("All");
    setGradeFilter("All");
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl bg-gradient-to-br from-primary/15 via-card to-card border-none animate-in fade-in duration-700 ease-out rounded-xl overflow-hidden">
        <CardHeader className="p-6 md:p-8">
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary tracking-tight flex items-center">
            <Users className="w-8 h-8 md:w-10 md:h-10 mr-3"/>Find Your Ideal Tutor
          </CardTitle>
           <CardDescription className="text-lg md:text-xl text-foreground/80 mt-1">
            Browse profiles, filter by expertise, and connect with qualified educators.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 md:p-8 pt-0">
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, subject, grade, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <FilterItem icon={BookOpen} label="Subject" value={subjectFilter} onValueChange={setSubjectFilter} options={allSubjects} />
            <FilterItem icon={GraduationCap} label="Grade Level" value={gradeFilter} onValueChange={setGradeFilter} options={gradeLevels} />
            <FilterItem icon={Star} label="Experience" value={experienceFilter} onValueChange={setExperienceFilter} options={experienceLevels} />
            
            <Button onClick={resetFilters} variant="outline" className="h-11 text-base border-border hover:border-destructive hover:bg-destructive/10 hover:text-destructive transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center gap-2">
              <XIcon className="w-5 h-5" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredTutorProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredTutorProfiles.map((tutor, index) => (
            <div 
              key={tutor.id}
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
              style={{ animationDelay: `${index * 0.05 + 0.3}s` }} // Stagger animation
            >
              <TutorProfileCard tutor={tutor} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 shadow-lg animate-in fade-in zoom-in-95 duration-500 ease-out rounded-xl bg-card border border-border/30">
          <CardContent className="flex flex-col items-center">
            <Filter className="w-20 h-20 text-primary/40 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-foreground/80 mb-2">No Tutors Found</p>
            <p className="text-md text-muted-foreground max-w-md mx-auto">
             Try adjusting your search filters or check back later as new tutors join.
            </p>
             <Button onClick={resetFilters} variant="outline" className="mt-8 text-base py-2.5 px-6">
              <XIcon className="w-4 h-4 mr-2" />
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
    <div className="space-y-1.5">
      <label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`} className="text-sm font-medium text-muted-foreground flex items-center">
        <Icon className="w-4 h-4 mr-2 text-primary/80"/>{label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          id={`${label.toLowerCase().replace(/\s+/g, '-')}-filter`} 
          className="bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg h-11 text-base"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => <SelectItem key={opt} value={opt} className="text-base">{opt}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}