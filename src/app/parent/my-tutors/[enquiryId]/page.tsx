
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { TuitionRequirement, TutorProfile, User } from "@/types";
import { MOCK_ALL_PARENT_REQUIREMENTS, MOCK_TUTOR_PROFILES } from "@/lib/mock-data";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX, Users as UsersIcon, ArrowLeft, MessageSquareQuote } from "lucide-react"; // Added MessageSquareQuote
import { TutorProfileCard } from "@/components/tutors/TutorProfileCard";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader, // Keep DialogHeader for modal structure
  DialogTitle as ModalTitle, // Keep DialogTitle for modal structure
  DialogDescription as ModalDescription, // Keep DialogDescription for modal structure
} from "@/components/ui/dialog";
import { ScheduleDemoRequestModal } from "@/components/modals/ScheduleDemoRequestModal";

export default function AppliedTutorsPage() {
  const params = useParams();
  const router = useRouter();
  const { user: parentUser, isAuthenticated, isCheckingAuth } = useAuthMock(); // Renamed user to parentUser
  const { toast } = useToast();
  const enquiryId = params.enquiryId as string;

  const [enquiry, setEnquiry] = useState<TuitionRequirement | null>(null);
  const [appliedTutors, setAppliedTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedTutorForDemo, setSelectedTutorForDemo] = useState<TutorProfile | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || isCheckingAuth || !enquiryId) return;

    if (!isAuthenticated || parentUser?.role !== "parent") {
      router.replace("/");
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      const foundEnquiry = MOCK_ALL_PARENT_REQUIREMENTS.find(
        (req) => req.id === enquiryId && req.parentId === parentUser?.id
      );

      if (foundEnquiry) {
        setEnquiry(foundEnquiry);
        if (foundEnquiry.appliedTutorIds && foundEnquiry.appliedTutorIds.length > 0) {
          const tutors = MOCK_TUTOR_PROFILES.filter(tutor =>
            foundEnquiry.appliedTutorIds!.includes(tutor.id)
          );
          setAppliedTutors(tutors);
        } else {
          setAppliedTutors([]);
        }
      } else {
        setError("Enquiry not found or you do not have permission to view it.");
        setEnquiry(null);
        setAppliedTutors([]);
      }
      setLoading(false);
    }, 300);
  }, [enquiryId, hasMounted, isCheckingAuth, isAuthenticated, parentUser, router]);

  const pageTitle = useMemo(() => {
    if (enquiry) {
      const subjectText = Array.isArray(enquiry.subject) ? enquiry.subject.join(', ') : enquiry.subject;
      return `Applied Tutors for: "${subjectText}"`;
    }
    return "Applied Tutors";
  }, [enquiry]);

  const handleScheduleDemoSuccess = () => {
    setIsDemoModalOpen(false);
    setSelectedTutorForDemo(null);
    toast({
      title: "Demo Request Sent!",
      description: "The tutor will be notified of your demo request.",
    });
  };


  if (isCheckingAuth || loading || !hasMounted) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="mt-6 space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col items-center justify-center min-h-[calc(100vh_-_var(--header-height,0px)_-_100px)]">
          <Card className="w-full max-w-md text-center mt-6">
            <CardHeader>
              <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                <UserX className="h-10 w-10 text-destructive" />
              </div>
              <ModalTitle className="text-xl mt-4">Error Loading Tutors</ModalTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/parent/my-enquiries")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Enquiries
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  if (!enquiry) {
     return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col items-center justify-center min-h-[calc(100vh_-_var(--header-height,0px)_-_100px)]">
           <Card className="w-full max-w-md text-center mt-6">
            <CardHeader>
              <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                <UserX className="h-10 w-10 text-destructive" />
              </div>
              <ModalTitle className="text-xl mt-4">Enquiry Not Found</ModalTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">The requested enquiry could not be found.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/parent/my-enquiries")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Enquiries
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="mt-0 bg-card rounded-xl shadow-lg border-0">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold text-primary flex items-center">
              <UsersIcon className="w-5 h-5 mr-2.5" />
              {pageTitle}
            </CardTitle>
             <CardDescription>Review profiles of tutors who have shown interest in this requirement.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-5">
            {appliedTutors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {appliedTutors.map((tutor) => (
                  <div key={tutor.id} className="relative group h-full">
                    <TutorProfileCard
                      tutor={tutor}
                      parentContextBaseUrl="/parent/tutors" 
                      hideRating={true} 
                      showFullName={true} 
                      showShortlistButton={true}
                    />
                    {/* Schedule Demo Button Removed */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-md font-medium text-muted-foreground">No tutors have applied to this enquiry yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {selectedTutorForDemo && parentUser && (
        <Dialog open={isDemoModalOpen} onOpenChange={setIsDemoModalOpen}>
          <DialogContent className="sm:max-w-xl bg-card p-0 rounded-lg overflow-hidden">
             {/* Modal Header now part of DialogContent in this specific invocation pattern */}
             <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <MessageSquareQuote className="w-5 h-5" />
                    </div>
                    <div>
                        <ModalTitle className="text-lg font-semibold text-foreground">
                         Request a Demo with {selectedTutorForDemo.name}
                        </ModalTitle>
                        <ModalDescription className="text-sm text-muted-foreground mt-0.5">
                         Fill in your preferred details for the demo session.
                        </ModalDescription>
                    </div>
                </div>
            </DialogHeader>
            <ScheduleDemoRequestModal
              tutor={selectedTutorForDemo}
              parentUser={parentUser}
              enquiryContext={enquiry} 
              onSuccess={handleScheduleDemoSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}

