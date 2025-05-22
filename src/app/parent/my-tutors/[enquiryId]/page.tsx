
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
import { UserX, Users as UsersIcon, ArrowLeft, CalendarDays, Share2, MessageSquareQuote, Copy, Mail, Phone } from "lucide-react";
import { TutorProfileCard } from "@/components/tutors/TutorProfileCard";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle as ShadDialogTitle, // Renamed to avoid conflict
  DialogDescription as ShadDialogDescription, // Renamed to avoid conflict
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function AppliedTutorsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const { toast } = useToast();
  const enquiryId = params.enquiryId as string;

  const [enquiry, setEnquiry] = useState<TuitionRequirement | null>(null);
  const [appliedTutors, setAppliedTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedTutorForContact, setSelectedTutorForContact] = useState<TutorProfile | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || isCheckingAuth || !enquiryId) return;

    if (!isAuthenticated || user?.role !== "parent") {
      router.replace("/");
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      const foundEnquiry = MOCK_ALL_PARENT_REQUIREMENTS.find(
        (req) => req.id === enquiryId && req.parentId === user?.id
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
  }, [enquiryId, hasMounted, isCheckingAuth, isAuthenticated, user, router]);

  const pageTitle = useMemo(() => {
    if (enquiry) {
      const subjectText = Array.isArray(enquiry.subject) ? enquiry.subject.join(', ') : enquiry.subject;
      return `Applied Tutors for: "${subjectText}"`;
    }
    return "Applied Tutors";
  }, [enquiry]);

  const handleScheduleDemo = (tutor: TutorProfile) => {
    console.log("Schedule Demo with:", tutor.name, tutor.id);
    toast({ title: "Schedule Demo", description: `Placeholder action: Schedule demo with ${tutor.name}.` });
  };

  const handleShareProfile = async (tutor: TutorProfile) => {
    if (!tutor || typeof window === 'undefined') return;
    const profileUrl = `${window.location.origin}/tutors/${tutor.id}`; // Public profile link
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({ title: "Profile Link Copied!", description: "Tutor's public profile link copied to clipboard." });
    } catch (err) {
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy link. Please try again." });
    }
  };

  const handleContactTutor = (tutor: TutorProfile) => {
    setSelectedTutorForContact(tutor);
    setIsContactModalOpen(true);
  };

  const handleCopyDetail = (text: string | undefined, fieldName: string) => {
    if (!text) {
      toast({ variant: "destructive", title: "Not Available", description: `${fieldName} is not available for this tutor.` });
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${fieldName} Copied!`, description: `${text} copied to clipboard.` });
    }).catch(err => {
      toast({ variant: "destructive", title: "Copy Failed" });
    });
  };


  if (isCheckingAuth || loading || !hasMounted) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <BreadcrumbHeader segments={[
            { label: "Dashboard", href: "/parent/dashboard" },
            { label: "My Enquiries", href: `/parent/my-enquiries` },
            { label: "Loading Tutors..."}
          ]} />
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
          <BreadcrumbHeader segments={[
            { label: "Dashboard", href: "/parent/dashboard" },
            { label: "My Enquiries", href: `/parent/my-enquiries` },
            { label: "Error"}
          ]} />
          <Card className="w-full max-w-md text-center mt-6">
            <CardHeader>
              <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                <UserX className="h-10 w-10 text-destructive" />
              </div>
              <CardTitle className="text-xl mt-4">Error Loading Tutors</CardTitle>
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
           <BreadcrumbHeader segments={[
            { label: "Dashboard", href: "/parent/dashboard" },
            { label: "My Enquiries", href: `/parent/my-enquiries` },
            { label: "Not Found"}
          ]} />
           <Card className="w-full max-w-md text-center mt-6">
            <CardHeader>
              <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                <UserX className="h-10 w-10 text-destructive" />
              </div>
              <CardTitle className="text-xl mt-4">Enquiry Not Found</CardTitle>
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
        <BreadcrumbHeader segments={[
          { label: "Dashboard", href: "/parent/dashboard" },
          { label: "My Enquiries", href: `/parent/my-enquiries` },
          { label: `Tutors for: "${Array.isArray(enquiry.subject) ? enquiry.subject.join(', ') : enquiry.subject}"`}
        ]} />

        <Card className="mt-6 bg-card rounded-xl shadow-lg border-0">
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
                  <div key={tutor.id}>
                    <TutorProfileCard tutor={tutor} parentContextBaseUrl="/parent/tutors" />
                    <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Button
                        size="sm"
                        onClick={() => handleScheduleDemo(tutor)}
                        className="text-xs"
                      >
                        <CalendarDays className="mr-1.5 h-3.5 w-3.5" /> Schedule Demo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareProfile(tutor)}
                        className="text-xs"
                      >
                        <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactTutor(tutor)}
                        className="text-xs"
                      >
                        <MessageSquareQuote className="mr-1.5 h-3.5 w-3.5" /> Contact Tutor
                      </Button>
                    </div>
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
      {selectedTutorForContact && (
        <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
          <DialogContent className="sm:max-w-md bg-card">
            <DialogHeader>
              <ShadDialogTitle className="flex items-center text-lg text-primary">
                <MessageSquareQuote className="mr-2 h-5 w-5" /> Contact {selectedTutorForContact.name}
              </ShadDialogTitle>
              <ShadDialogDescription>
                You can reach out to {selectedTutorForContact.name} using the details below.
              </ShadDialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <div className="flex items-center justify-between p-3 border rounded-md bg-background/50">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-sm text-foreground">{selectedTutorForContact.email}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopyDetail(selectedTutorForContact.email, "Email")} className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {selectedTutorForContact.phone && (
                <div className="flex items-center justify-between p-3 border rounded-md bg-background/50">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="text-sm text-foreground">{selectedTutorForContact.phone}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyDetail(selectedTutorForContact.phone, "Phone Number")} className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {!selectedTutorForContact.phone && (
                   <div className="p-3 border rounded-md bg-background/50">
                       <p className="text-sm text-muted-foreground text-center">Phone number not provided by tutor.</p>
                   </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
