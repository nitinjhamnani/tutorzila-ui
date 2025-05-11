
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { TutorProfile } from "@/types";
import { MOCK_TUTOR_PROFILES } from "@/lib/mock-data"; // Import mock data
import { TutorPublicProfile } from "@/components/tutors/TutorPublicProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX } from "lucide-react"; 

export default function TutorProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      // Simulate API call
      setTimeout(() => {
        const foundTutor = MOCK_TUTOR_PROFILES.find((t) => t.id === id);
        if (foundTutor) {
          setTutor(foundTutor);
        } else {
          setError("Tutor profile not found.");
        }
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const containerPadding = "container mx-auto px-4 sm:px-6 md:px-8"; // Adjusted padding

  if (loading) {
    return (
      <div className={`${containerPadding} py-8 md:py-12`}> {/* Added more padding */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-[350px] w-full rounded-xl" />
            <Skeleton className="h-[150px] w-full rounded-xl" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[180px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerPadding} py-12 flex justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height,0px))]`}>
        <Alert variant="destructive" className="max-w-md text-center shadow-lg rounded-xl">
          <UserX className="h-10 w-10 mx-auto mb-3 text-destructive" /> 
          <AlertTitle className="text-xl font-semibold">Profile Not Found</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className={`${containerPadding} py-12 text-center`}>
        No tutor data available.
      </div>
    );
  }

  return (
    <div className={`${containerPadding} py-6 md:py-10 animate-in fade-in duration-500 ease-out`}> {/* Reduced top/bottom padding slightly */}
      <TutorPublicProfile tutor={tutor} />
    </div>
  );
}
