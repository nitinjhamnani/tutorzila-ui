
"use client";

import { useState, useMemo, useEffect } from "react";
import type { TutorProfile } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TutorProfileCard } from "./TutorProfileCard";
import { SearchIcon, XIcon, BookOpen, Star, Users, GraduationCap } from "lucide-react"; // Added GraduationCap
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for Tutor Profiles
const MOCK_TUTOR_PROFILES: TutorProfile[] = [
  { id: "t1", name: "Dr. Emily Carter", email: "emily.carter@example.com", role: "tutor", avatar: "https://picsum.photos/seed/emilycarter/128", subjects: ["Physics", "Mathematics", "Chemistry"], grade: "Doctorate Level", experience: "10+ years", hourlyRate: "$70", bio: "PhD in Physics with a passion for demystifying complex scientific concepts for students of all levels.", availability: "Weekends, Mon/Wed Evenings" },
  { id: "t2", name: "John Adebayo", email: "john.adebayo@example.com", role: "tutor", avatar: "https://picsum.photos/seed/johnadebayo/128", subjects: ["English Literature", "History", "Creative Writing"], grade: "Master's Level", experience: "5-7 years", hourlyRate: "$55", bio: "MA in English Literature. Dedicated to fostering critical thinking and a love for the humanities.", availability: "Weekdays After 5 PM" },
  { id: "t3", name: "Sophia Chen", email: "sophia.chen@example.com", role: "tutor", avatar: "https://picsum.photos/seed/sophiachen/128", subjects: ["Computer Science", "Mathematics", "Web Development"], grade: "University Level", experience: "3-5 years", hourlyRate: "$60", bio: "Software engineer and CS graduate, specializing in Python, Java, and web technologies.", availability: "Flexible, Online Only" },
  { id: "t4", name: "David Miller", email: "david.miller@example.com", role: "tutor", avatar: "https://picsum.photos/seed/davidmiller/128", subjects: ["Biology", "Chemistry"], grade: "High School & College", experience: "7+ years", hourlyRate: "$65", bio: "Former research scientist with extensive experience in tutoring high school and college biology.", availability: "Tue/Thu Evenings" },
  { id: "t5", name: "Linda Garcia", email: "linda.garcia@example.com", role: "tutor", avatar: "https://picsum.photos/seed/lindagarcia/128", subjects: ["Spanish", "French"], grade: "All Levels", experience: "3-5 years", hourlyRate: "$50", bio: "Native Spanish speaker, fluent in French. Passionate about language learning and cultural exchange.", availability: "Weekends" },
];

const allSubjects = ["All", ...new Set(MOCK_TUTOR_PROFILES.flatMap(t => t.subjects))].filter((v, i, a) => a.indexOf(v) === i);
const experienceLevels = ["All", "1-3 years", "3-5 years", "5-7 years", "7+ years", "10+ years"];
const gradeLevels = ["All", ...new Set(MOCK_TUTOR_PROFILES.map(t => t.grade).filter(Boolean) as string[])].filter((v,i,a) => a.indexOf(v) === i);


export function TutorProfileSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All"); // New filter state
  const [tutorProfiles, setTutorProfiles] = useState<TutorProfile[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call.
    setTutorProfiles(MOCK_TUTOR_PROFILES);
  }, []);

  const filteredTutorProfiles = useMemo(() => {
    return tutorProfiles.filter((tutor) => {
      const matchesSearchTerm = searchTerm === "" ||
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tutor.bio && tutor.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tutor.grade && tutor.grade.toLowerCase().includes(searchTerm.toLowerCase()));
      
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
      <Card className="shadow-lg animate-in fade-in duration-300 ease-out bg-card">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl flex items-center">
            <Users className="w-7 h-7 md:w-8 md:h-8 mr-3 text-primary"/>
            Find Your Ideal Tutor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, subject, grade, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50 shadow-sm hover:shadow-md"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label htmlFor="subject-filter" className="text-sm font-medium text-muted-foreground flex items-center"><BookOpen className="w-4 h-4 mr-1.5"/>Subject</label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger id="subject-filter" className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 shadow-sm hover:shadow-md"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-1">
              <label htmlFor="grade-filter" className="text-sm font-medium text-muted-foreground flex items-center"><GraduationCap className="w-4 h-4 mr-1.5"/>Grade Level</label>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger id="grade-filter" className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 shadow-sm hover:shadow-md"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {gradeLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label htmlFor="experience-filter" className="text-sm font-medium text-muted-foreground flex items-center"><Star className="w-4 h-4 mr-1.5"/>Experience</label>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger id="experience-filter" className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 shadow-sm hover:shadow-md"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={resetFilters} variant="outline" className="self-end h-10 transform transition-transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
              <XIcon className="w-4 h-4 mr-2" />
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
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <TutorProfileCard tutor={tutor} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-md animate-in fade-in zoom-in-95 duration-500 ease-out bg-card">
          <CardContent>
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">No tutors found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
