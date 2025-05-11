
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { TutorProfile } from "@/types";
import { MOCK_TUTOR_PROFILES } from "@/lib/mock-data"; // Import mock data
import { TutorPublicProfile } from "@/components/tutors/TutorPublicProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserSlash } from "lucide-react";

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

  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";

  if (loading) {
    return (
      <div className={`${containerPadding} py-12`}>
        <div className="grid md:grid-cols-3 gap-8">
          <Skeleton className="h-[300px] md:col-span-1 rounded-lg" />
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4 rounded-lg" />
            <Skeleton className="h-8 w-1/2 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-10 w-1/3 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerPadding} py-12 flex justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height,0px))]`}>
        <Alert variant="destructive" className="max-w-md text-center">
          <UserSlash className="h-10 w-10 mx-auto mb-3 text-destructive" />
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
    <div className={`${containerPadding} py-8 md:py-12 animate-in fade-in duration-500 ease-out`}>
      <TutorPublicProfile tutor={tutor} />
    </div>
  );
}
