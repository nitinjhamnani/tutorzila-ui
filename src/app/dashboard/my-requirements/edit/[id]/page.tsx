
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { TuitionRequirement } from "@/types";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";
import { TuitionRequirementForm } from "@/components/tuitions/TuitionRequirementForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX } from "lucide-react";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { useToast } from "@/hooks/use-toast";

export default function EditRequirementPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
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
        const foundRequirement = MOCK_ALL_PARENT_REQUIREMENTS.find(req => req.id === id);
        if (foundRequirement) {
          setRequirement(foundRequirement);
        } else {
          setError("Enquiry not found or you do not have permission to edit it.");
        }
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const handleUpdateSuccess = () => {
    toast({
      title: "Requirement Updated!",
      description: "Your tuition requirement has been successfully updated.",
    });
    router.push("/dashboard/my-requirements");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6">
        <BreadcrumbHeader
          segments={[
            { label: "Dashboard", href: "/dashboard/parent" },
            { label: "My Enquiries", href: "/dashboard/my-requirements" },
            { label: "Loading..." },
          ]}
        />
        <Skeleton className="h-[400px] w-full rounded-lg mt-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height)-var(--sidebar-width,0px)-5rem)]">
        <Alert variant="destructive" className="max-w-md text-center shadow-lg rounded-xl">
          <UserX className="h-10 w-10 mx-auto mb-3 text-destructive" />
          <AlertTitle className="text-xl font-semibold">Access Denied</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 text-center text-muted-foreground">
        No requirement data available.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0 sm:px-0 md:px-0 py-6">
      <BreadcrumbHeader
        segments={[
          { label: "Dashboard", href: "/dashboard/parent" },
          { label: "My Enquiries", href: "/dashboard/my-requirements" },
          { label: "Edit Enquiry" },
        ]}
      />
      <div className="mt-0"> {/* Reduced margin-top */}
        <TuitionRequirementForm 
          initialData={requirement} 
          isEditing={true} 
          onSuccess={handleUpdateSuccess} 
        />
      </div>
    </div>
  );
}
