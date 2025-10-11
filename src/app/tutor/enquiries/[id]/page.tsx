
// src/app/tutor/enquiries/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { TuitionRequirement, User } from "@/types";
import { EnquiryDetails } from "@/components/tuitions/EnquiryDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX, Loader2 } from "lucide-react";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useQuery } from "@tanstack/react-query";
import { useGlobalLoader } from "@/hooks/use-global-loader";

const fetchEnquiryDetails = async (
  enquiryId: string,
  token: string | null
): Promise<TuitionRequirement> => {
  if (!token) throw new Error("Authentication token is required.");
  if (!enquiryId) throw new Error("Enquiry ID is required.");

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(
    `${apiBaseUrl}/api/enquiry/details/${enquiryId}`,
    {
      headers: { Authorization: `Bearer ${token}`, accept: "*/*" },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Enquiry not found or you do not have permission to view it.");
    }
    throw new Error("Failed to fetch enquiry details.");
  }
  
  const data = await response.json();
  const { enquirySummary, enquiryDetails } = data;

  const transformStringToArray = (str: string | null | undefined): string[] => {
    if (typeof str === 'string' && str.trim() !== '') {
        return str.split(',').map(s => s.trim());
    }
    return [];
  };

  return {
    id: enquirySummary.enquiryId,
    parentName: "A Parent", // This info is not in the API response, so mocking it.
    studentName: enquiryDetails.studentName,
    subject: transformStringToArray(enquirySummary.subjects),
    gradeLevel: enquirySummary.grade,
    board: enquirySummary.board,
    location: {
        name: enquiryDetails.addressName || enquiryDetails.address,
        address: enquiryDetails.address,
        googleMapsUrl: enquiryDetails.googleMapsLink,
        city: enquirySummary.city,
        state: enquirySummary.state,
        country: enquirySummary.country,
        area: enquirySummary.area,
        pincode: enquiryDetails.pincode,
    },
    teachingMode: [
      ...(enquirySummary.online ? ["Online"] : []),
      ...(enquirySummary.offline ? ["Offline (In-person)"] : []),
    ],
    scheduleDetails: enquiryDetails.notes, 
    additionalNotes: enquiryDetails.additionalNotes,
    preferredDays: transformStringToArray(enquiryDetails.availabilityDays),
    preferredTimeSlots: transformStringToArray(enquiryDetails.availabilityTime),
    status: enquirySummary.status?.toLowerCase() || 'open',
    postedAt: enquirySummary.createdOn,
    tutorGenderPreference: enquiryDetails.tutorGenderPreference?.toUpperCase() as 'MALE' | 'FEMALE' | 'NO_PREFERENCE' | undefined,
    startDatePreference: enquiryDetails.startDatePreference,
  };
};

export default function TutorEnquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const id = params.id as string;
  const { hideLoader } = useGlobalLoader();

  const {
    data: requirement,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["enquiryDetails", id, token],
    queryFn: () => fetchEnquiryDetails(id, token),
    enabled: !!id && !!token,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading) {
      hideLoader();
    }
  }, [isLoading, hideLoader]);


  const containerPadding = "py-6 md:py-8"; 

  if (isLoading || isCheckingAuth) {
    // Global loader is active, so we can show a minimal placeholder here or nothing.
    return (
        <div className={containerPadding}>
          <Skeleton className="h-[400px] w-full rounded-lg mt-4" />
        </div>
      );
  }

  if (error) {
    return (
      <div className={`${containerPadding} flex justify-center items-center min-h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px)-5rem)]`}>
        <Alert variant="destructive" className="max-w-md text-center shadow-lg rounded-xl">
          <UserX className="h-10 w-10 mx-auto mb-3 text-destructive" />
          <AlertTitle className="text-xl font-semibold">Enquiry Not Found</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
          <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
        </Alert>
      </div>
    );
  }

  if (!requirement) {
     return (
      <div className={`${containerPadding} text-center`}>
        <p className="text-muted-foreground mt-4">No enquiry data available.</p>
      </div>
    );
  }

  return (
    <div className={containerPadding}>
      <div className="mt-0"> 
        <EnquiryDetails requirement={requirement} />
      </div>
    </div>
  );
}
