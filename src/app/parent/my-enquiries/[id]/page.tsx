
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { TuitionRequirement, TutorProfile, User } from "@/types";
import { MOCK_ALL_PARENT_REQUIREMENTS, MOCK_TUTOR_PROFILES } from "@/lib/mock-data";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { TutorProfileCard } from "@/components/tutors/TutorProfileCard"; // For applied tutors
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDesc,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Clock,
  MapPin,
  Building,
  RadioTower,
  Info,
  Users as UsersIcon,
  Edit3,
  XCircle,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

// Helper for Enquiry Info Item
const EnquiryInfoItem = ({
  icon: Icon,
  label,
  value,
  children,
  className,
}: {
  icon?: React.ElementType;
  label: string;
  value?: string | string[];
  children?: React.ReactNode;
  className?: string;
}) => {
  if (!value && !children) return null;
  const displayText = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div className={cn("space-y-0.5", className)}>
      <span className="text-xs text-muted-foreground font-medium flex items-center">
        {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/80" />}
        {label}
      </span>
      {displayText && <p className="text-sm text-foreground/90">{displayText}</p>}
      {children && <div className="text-sm text-foreground/90">{children}</div>}
    </div>
  );
};


export default function ParentEnquiryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const { toast } = useToast();
  const id = params.id as string;

  const [requirement, setRequirement] = useState<TuitionRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // State for Close Enquiry Dialog
  const [isCloseEnquiryModalOpen, setIsCloseEnquiryModalOpen] = useState(false);
  const [closeEnquiryStep, setCloseEnquiryStep] = useState(1);
  const [foundTutorName, setFoundTutorName] = useState("");
  const [startClassesConfirmation, setStartClassesConfirmation] = useState<"yes" | "no" | "">("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isCheckingAuth) return;

    if (!isAuthenticated || user?.role !== "parent") {
      router.replace("/");
      return;
    }

    if (id) {
      setLoading(true);
      setError(null);
      setTimeout(() => {
        const foundRequirement = MOCK_ALL_PARENT_REQUIREMENTS.find(
          (req) => req.id === id && req.parentId === user?.id
        );
        if (foundRequirement) {
          setRequirement(foundRequirement);
        } else {
          setError("Enquiry not found or you do not have permission to view it.");
        }
        setLoading(false);
      }, 300);
    }
  }, [id, isClient, isCheckingAuth, isAuthenticated, user, router]);

  const handleOpenCloseEnquiryModal = () => {
    if (!requirement) return;
    setCloseEnquiryStep(1);
    setFoundTutorName("");
    setStartClassesConfirmation("");
    setIsCloseEnquiryModalOpen(true);
  };

  const handleCloseEnquiryDialogAction = () => {
    if (!requirement) return;

    if (closeEnquiryStep === 1) {
      setCloseEnquiryStep(2);
    } else if (closeEnquiryStep === 2) {
      // Mock update logic
      const updatedRequirement = {
        ...requirement,
        status: "closed" as const,
        additionalNotes: `${requirement.additionalNotes || ""}\nUpdate: Requirement closed on ${new Date().toLocaleDateString()}. ${
          foundTutorName ? `Tutor specified: ${foundTutorName}.` : "No specific tutor mentioned."
        } ${
          startClassesConfirmation === "yes"
            ? "Classes expected to start."
            : startClassesConfirmation === "no"
            ? "Decided not to start classes."
            : ""
        }`,
      };
      // In a real app, update this in your backend/state management
      const reqIndex = MOCK_ALL_PARENT_REQUIREMENTS.findIndex(r => r.id === requirement.id);
      if (reqIndex > -1) MOCK_ALL_PARENT_REQUIREMENTS[reqIndex] = updatedRequirement;
      
      setRequirement(updatedRequirement); // Update local state for immediate UI feedback

      toast({
        title: "Enquiry Closed",
        description: `Requirement for "${Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}" has been marked as closed.`,
      });
      setIsCloseEnquiryModalOpen(false);
      // router.push("/parent/my-enquiries"); // Optional: redirect after closing
    }
  };
  
  const postedDate = requirement?.postedAt ? parseISO(requirement.postedAt) : new Date();
  const timeAgo = requirement?.postedAt ? formatDistanceToNow(postedDate, { addSuffix: true }) : "";
  const formattedPostedDate = requirement?.postedAt ? format(postedDate, "MMMM d, yyyy 'at' h:mm a") : "";

  // Mock applied tutors - in a real app, this would come from backend
  const mockAppliedTutors = useMemo(() => {
    if (!requirement) return [];
    // Simulate some tutors applying
    return MOCK_TUTOR_PROFILES.slice(0, Math.floor(Math.random() * 3) + 1); 
  }, [requirement]);


  if (!isClient || loading || isCheckingAuth) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <BreadcrumbHeader segments={[{ label: "Dashboard", href: "/parent/dashboard" }, { label: "My Enquiries", href: "/parent/my-enquiries" }, { label: "Loading..." }]} />
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col items-center justify-center min-h-[calc(100vh_-_var(--header-height,0px)_-_100px)]">
          <BreadcrumbHeader segments={[{ label: "Dashboard", href: "/parent/dashboard" }, { label: "My Enquiries", href: "/parent/my-enquiries" }, { label: "Error" }]} />
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <CardTitle className="text-xl mt-4">Enquiry Not Found</CardTitle>
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

  if (!requirement) return null; // Should be caught by error state

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <BreadcrumbHeader segments={[{ label: "Dashboard", href: "/parent/dashboard" }, { label: "My Enquiries", href: "/parent/my-enquiries" }, { label: "Enquiry Details" }]} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Enquiry Details Card */}
            <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-muted/30 p-4 md:p-5 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg md:text-xl font-semibold text-primary tracking-tight">
                      {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      Posted {timeAgo} (on {formattedPostedDate})
                    </CardDescription>
                  </div>
                   <Badge variant={requirement.status === 'open' ? 'default' : requirement.status === 'matched' ? 'secondary' : 'outline'}
                     className={cn(
                       requirement.status === 'open' && 'bg-green-600 hover:bg-green-700 text-white',
                       requirement.status === 'matched' && 'bg-blue-600 hover:bg-blue-700 text-white',
                       requirement.status === 'closed' && 'bg-gray-500 hover:bg-gray-600 text-white'
                     )}
                   >
                    {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-5 space-y-5">
                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-foreground flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-primary/80" />
                    Requirement Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                    <EnquiryInfoItem label="Grade Level" value={requirement.gradeLevel} icon={GraduationCap} />
                    {requirement.board && <EnquiryInfoItem label="Board" value={requirement.board} icon={Building} />}
                  </div>
                </section>
                <Separator />
                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-foreground flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2 text-primary/80" />
                    Schedule & Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                    {requirement.preferredDays && requirement.preferredDays.length > 0 && (
                      <EnquiryInfoItem label="Preferred Days" value={requirement.preferredDays.join(', ')} icon={CalendarDays} />
                    )}
                    {requirement.preferredTimeSlots && requirement.preferredTimeSlots.length > 0 && (
                      <EnquiryInfoItem label="Preferred Time" value={requirement.preferredTimeSlots.join(', ')} icon={Clock} />
                    )}
                    {requirement.location && <EnquiryInfoItem label="Location Preference" value={requirement.location} icon={MapPin} />}
                    {requirement.teachingMode && requirement.teachingMode.length > 0 && (
                       <EnquiryInfoItem label="Teaching Mode(s)" icon={RadioTower}>
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          {requirement.teachingMode.map(mode => (
                            <Badge key={mode} variant="secondary" className="text-[11px] py-0.5 px-1.5">{mode}</Badge>
                          ))}
                        </div>
                      </EnquiryInfoItem>
                    )}
                  </div>
                   {requirement.scheduleDetails && <EnquiryInfoItem label="Schedule Notes" value={requirement.scheduleDetails} icon={Info} className="md:col-span-2"/>}
                </section>
                {requirement.additionalNotes && (
                  <>
                    <Separator />
                    <section className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground flex items-center">
                        <Info className="w-4 h-4 mr-2 text-primary/80" />
                        Additional Notes
                      </h3>
                      <p className="text-sm text-foreground/80 leading-relaxed pl-6 whitespace-pre-line">
                        {requirement.additionalNotes}
                      </p>
                    </section>
                  </>
                )}
              </CardContent>
               {(requirement.status === 'open' || requirement.status === 'matched') && (
                <CardFooter className="p-4 md:p-5 border-t flex-wrap justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/parent/my-enquiries/edit/${requirement.id}`}>
                            <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="border-orange-500 text-orange-600 hover:bg-orange-500/10" onClick={handleOpenCloseEnquiryModal}>
                      <XCircle className="mr-1.5 h-3.5 w-3.5" /> Close
                    </Button>
                </CardFooter>
               )}
            </Card>
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
              <CardHeader className="p-4 md:p-5 border-b">
                <CardTitle className="text-base font-semibold text-primary flex items-center">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Applied Tutors ({mockAppliedTutors.length})
                </CardTitle>
                 <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Review profiles of tutors interested in this enquiry.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-5 space-y-3">
                {mockAppliedTutors.length > 0 ? (
                  mockAppliedTutors.map(tutor => (
                    <TutorProfileCard key={tutor.id} tutor={tutor} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No tutors have applied yet.</p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Close Enquiry Dialog */}
      {requirement && (
        <Dialog open={isCloseEnquiryModalOpen} onOpenChange={setIsCloseEnquiryModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Close Enquiry: {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}</DialogTitle>
                <DialogDesc>
                  Please provide some details before closing this requirement.
                </DialogDesc>
              </DialogHeader>
              {closeEnquiryStep === 1 && (
                <div className="py-4 space-y-4">
                  <Label htmlFor="foundTutor">Did you find a tutor for this requirement?</Label>
                  <Input
                    id="foundTutor"
                    placeholder="Enter Tutor's Name (Optional)"
                    value={foundTutorName}
                    onChange={(e) => setFoundTutorName(e.target.value)}
                  />
                </div>
              )}
              {closeEnquiryStep === 2 && (
                <div className="py-4 space-y-4">
                  <Label>Would you like to start classes with {foundTutorName || "the selected tutor"}?</Label>
                  <RadioGroup
                    onValueChange={(value: "yes" | "no") => setStartClassesConfirmation(value)}
                    value={startClassesConfirmation}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="start-yes" />
                      <Label htmlFor="start-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="start-no" />
                      <Label htmlFor="start-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button" onClick={handleCloseEnquiryDialogAction}>
                  {closeEnquiryStep === 1 ? "Next" : "Confirm & Close Requirement"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      )}
    </main>
  );
}
