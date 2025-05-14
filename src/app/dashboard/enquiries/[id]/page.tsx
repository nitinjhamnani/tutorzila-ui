
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { TuitionRequirement } from "@/types";
import { EnquiryDetails } from "@/components/tuitions/EnquiryDetails";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Mock data - replace with API call in a real app
const MOCK_REQUIREMENTS: TuitionRequirement[] = [
  { id: "1", parentId: "p1", parentName: "Alice Smith", subject: ["Mathematics"], gradeLevel: "Grade 9-10", scheduleDetails: "Mon, Wed, Fri 5-7 PM", preferredDays: ["Mon", "Wed", "Fri"], preferredTime: ["5-7 PM"], location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 2).toISOString(), additionalNotes: "Needs help with algebra and geometry. Student is preparing for competitive exams.", board: "CBSE", teachingMode: ["Online", "Offline (In-person)"], applicantsCount: 10 },
  { id: "2", parentId: "p2", parentName: "Bob Johnson", subject: ["Physics"], gradeLevel: "Grade 11-12", scheduleDetails: "Weekends, 4 hours total, preferably morning.", preferredDays: ["Weekends"], preferredTime: ["4 hours total, preferably morning."], location: "Student's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 5).toISOString(), board: "ICSE", teachingMode: ["Offline (In-person)"], applicantsCount: 5 },
  { id: "3", parentId: "p3", parentName: "Carol Williams", subject: ["English"], gradeLevel: "Grade 6-8", scheduleDetails: "Tues, Thurs 4-6 PM", preferredDays: ["Tues", "Thurs"], preferredTime: ["4-6 PM"], location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 1).toISOString(), additionalNotes: "Focus on grammar, creative writing, and public speaking skills.", board: "State Board", teachingMode: ["Online"], applicantsCount: 8 },
  { id: "4", parentId: "p4", parentName: "David Brown", subject: ["Computer Science"], gradeLevel: "College Level", scheduleDetails: "Flexible, project-based, around 6-8 hours a week.", preferredDays: ["Flexible"], preferredTime: ["Project-based, around 6-8 hours a week."], location: "Online", status: "open", postedAt: new Date().toISOString(), board: "IB", teachingMode: ["Online"], applicantsCount: 3 },
  { id: "5", parentId: "p5", parentName: "Eve Davis", subject: ["Mathematics"], gradeLevel: "Grade 1-5", scheduleDetails: "Sat 10 AM - 12 PM", preferredDays: ["Saturday"], preferredTime: ["10 AM - 12 PM"], location: "Tutor's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 3).toISOString(), additionalNotes: "Looking for a patient tutor for a young child. Focus on basics and making learning fun.", board: "IGCSE", teachingMode: ["Offline (In-person)"], applicantsCount: 12 },
  { id: "6", parentId: "p6", parentName: "Frank Green", subject: ["Chemistry"], gradeLevel: "Grade 9-10", scheduleDetails: "Mon 7-9 PM, potentially another day if needed.", preferredDays: ["Monday (potentially another day)"], preferredTime: ["7-9 PM"], location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 1).toISOString(), board: "CBSE", teachingMode: ["Online"], applicantsCount: 1 },
  { id: "7", parentId: "p7", parentName: "Grace Hall", subject: ["Biology"], gradeLevel: "Grade 11-12", scheduleDetails: "Flexible Evening Hours, 2 sessions per week.", preferredDays: ["Flexible Evenings (2 sessions/week)"], preferredTime: ["Evening Hours"], location: "Student's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 6).toISOString(), additionalNotes: "Looking for an experienced biology tutor for IB curriculum. Practical experiment guidance would be a plus.", board: "IB", teachingMode: ["Offline (In-person)"], applicantsCount: 6 },
];


export default function EnquiryDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [requirement, setRequirement] = useState<TuitionRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      // Simulate API call
      setTimeout(() => {
        const foundRequirement = MOCK_REQUIREMENTS.find(req => req.id === id);
        if (foundRequirement) {
          setRequirement(foundRequirement);
        } else {
          setError("Enquiry not found.");
        }
        setLoading(false);
      }, 500); // Simulate network delay
    }
  }, [id]);

  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";

  if (loading) {
    return (
      <div className={`${containerPadding} py-8`}>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerPadding} py-8 flex justify-center`}>
        <Alert variant="destructive" className="max-w-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!requirement) {
     return (
      <div className={`${containerPadding} py-8 text-center`}>
        <p>No enquiry data available.</p>
      </div>
    );
  }

  return (
    <div className={`${containerPadding} py-6 md:py-8`}> {/* Reduced py */}
      <EnquiryDetails requirement={requirement} />
    </div>
  );
}
