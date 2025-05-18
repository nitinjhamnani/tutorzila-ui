// src/app/tutor/enquiries/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { TuitionRequirement, TutorProfile } from "@/types";
import { EnquiryDetails } from "@/components/tuitions/EnquiryDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX } from "lucide-react";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { useAuthMock } from "@/hooks/use-auth-mock";

export default function TutorEnquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const id = params.id as string;

  const [requirement, setRequirement] = useState<TuitionRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isCheckingAuth) return;
    if (!isAuthenticated || user?.role !== 'tutor') {
      router.replace("/");
      return;
    }

    if (id) {
      setLoading(true);
      setError(null);
      setTimeout(() => {
        const foundRequirement = MOCK_ALL_PARENT_REQUIREMENTS.find(req => req.id === id);
        if (foundRequirement) {
          setRequirement(foundRequirement);
        } else {
          setError("Enquiry not found.");
        }
        setLoading(false);
      }, 500);
    }
  }, [id, isClient, isCheckingAuth, isAuthenticated, user, router]);

  const containerPadding = "py-6 md:py-8"; // Removed container and px-* as they are on the main layout

  if (!isClient || loading || isCheckingAuth) {
    return (
      <div className={containerPadding}>
        <BreadcrumbHeader segments={[{ label: "Dashboard", href: "/tutor/dashboard" }, { label: "Enquiries", href: "/tutor/enquiries" }, { label: "Loading..." }]} />
        <Skeleton className="h-[400px] w-full rounded-lg mt-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerPadding} flex justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height,0px)-5rem)]`}>
        <BreadcrumbHeader segments={[{ label: "Dashboard", href: "/tutor/dashboard" }, { label: "Enquiries", href: "/tutor/enquiries" }, { label: "Error" }]} />
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
      <div className={`${containerPadding} text-center`}>
        <BreadcrumbHeader segments={[{ label: "Dashboard", href: "/tutor/dashboard" }, { label: "Enquiries", href: "/tutor/enquiries" }, { label: "Not Found" }]} />
        <p className="text-muted-foreground mt-4">No enquiry data available.</p>
      </div>
    );
  }

  return (
    <div className={containerPadding}>
      <BreadcrumbHeader segments={[{ label: "Dashboard", href: "/tutor/dashboard" }, { label: "Enquiries", href: "/tutor/enquiries" }, { label: `Details for ${requirement.subject.join(', ')}` }]} />
      <div className="mt-4">
        <EnquiryDetails requirement={requirement} />
      </div>
    </div>
  );
}
