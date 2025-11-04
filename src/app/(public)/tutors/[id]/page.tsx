"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TutorProfile, PublicTutorProfileResponse } from "@/types";
import { TutorPublicProfile } from "@/components/tutors/TutorPublicProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX } from "lucide-react";

const transformApiResponseToTutorProfile = (
  id: string,
  data: PublicTutorProfileResponse
): TutorProfile => {
  const transformStringToArray = (str: string | null | undefined): string[] => {
    if (typeof str === 'string' && str.trim() !== '') {
        return str.split(',').map(s => s.trim());
    }
    return [];
  };

  const teachingModes: ("Online" | "Offline (In-person)")[] = [];
  if (data.online) teachingModes.push("Online");
  if (data.offline) teachingModes.push("Offline (In-person)");


  return {
    id: id,
    name: data.tutorName,
    role: "tutor", // Assumed role
    email: "", // Not provided in this public API
    subjects: transformStringToArray(data.subjects),
    gradeLevelsTaught: transformStringToArray(data.grades),
    boardsTaught: transformStringToArray(data.boards),
    location: [data.area, data.city, data.state, data.country].filter(Boolean).join(', '),
    gender: data.gender,
    qualifications: transformStringToArray(data.qualifications),
    preferredDays: transformStringToArray(data.availabilityDays),
    preferredTimeSlots: transformStringToArray(data.availabilityTime),
    bio: data.bio,
    languages: transformStringToArray(data.languages),
    teachingMode: teachingModes,
    experience: data.experience,
    hourlyRate: String(data.hourlyRate),
    isRateNegotiable: data.rateNegotiable,
    rating: 0, 
    avatar: undefined, 
    status: "Active", // Assumed
  };
};


const fetchTutorPublicProfile = async (id: string): Promise<TutorProfile> => {
  if (!id) throw new Error("Tutor ID is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/auth/tutor/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Tutor not found.");
    }
    throw new Error("Failed to fetch tutor details.");
  }
  const data: PublicTutorProfileResponse = await response.json();
  return transformApiResponseToTutorProfile(id, data);
};

export default function TutorProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: tutor, isLoading, error } = useQuery({
    queryKey: ['tutorPublicProfile', id],
    queryFn: () => fetchTutorPublicProfile(id),
    enabled: !!id, // Only run the query if the id exists
    refetchOnWindowFocus: false,
  });

  const containerPadding = "container mx-auto px-4 sm:px-6 md:px-8";

  if (isLoading) {
    return (
      <div className={`${containerPadding} py-8 md:py-12`}>
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
          <AlertDescription>{(error as Error).message}</AlertDescription>
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
    <div className={`${containerPadding} py-6 md:py-10 animate-in fade-in duration-500 ease-out pb-20 md:pb-24`}>
      <TutorPublicProfile tutor={tutor} />
    </div>
  );
}
