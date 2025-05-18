
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { TuitionRequirement } from "@/types";
import { EnquiryDetails } from "@/components/tuitions/EnquiryDetails";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, UserX } from "lucide-react";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data"; // Changed to import the comprehensive list
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function EnquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
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
        const foundRequirement = MOCK_ALL_PARENT_REQUIREMENTS.find(req => req.id === id); // Use the comprehensive list
        if (foundRequirement) {
          setRequirement(foundRequirement);
        } else {
          setError("Enquiry not found.");
        }
        setLoading(false);
      }, 500); // Simulate network delay
    }
  }, [id]);

  const containerPadding = "container mx-auto px-4 sm:px-6 md:px-8"; // Adjusted padding for better consistency

  if (loading) {
    return (
      <div className={`${containerPadding} py-8 md:py-10`}>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerPadding} py-8 md:py-10 flex justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height,0px)-5rem)]`}>
        <Alert variant="destructive" className="max-w-md text-center shadow-lg rounded-xl">
          <UserX className="h-10 w-10 mx-auto mb-3 text-destructive" />
          <AlertTitle className="text-xl font-semibold">Enquiry Not Found</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
        </Alert>
      </div>
    );
  }

  if (!requirement) {
     return (
      <div className={`${containerPadding} py-8 md:py-10 text-center`}>
        <p className="text-muted-foreground">No enquiry data available.</p>
      </div>
    );
  }

  return (
    <div className={`${containerPadding} py-6 md:py-8`}> {/* Reduced py for better fit with card */}
      <EnquiryDetails requirement={requirement} />
    </div>
  );
}
