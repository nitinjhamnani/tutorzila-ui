
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { TuitionRequirement } from "@/types";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, UserX, ArrowLeft, Clock, User, CheckCircle, Edit, Briefcase, CalendarDays, Circle, Send, Trash2, AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle as DialogTitleComponent, DialogDescription as DialogDescriptionComponent, DialogFooter as DialogFooterComponent } from "@/components/ui/dialog"; // Renamed to avoid conflict
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";


interface TimelineEvent {
  id: string;
  title: string;
  date: string; // ISO string
  description?: string;
  status?: 'completed' | 'pending' | 'cancelled' | 'info';
  icon?: React.ElementType;
}

// Mock timeline data generator
const generateMockTimeline = (requirement: TuitionRequirement): TimelineEvent[] => {
  const events: TimelineEvent[] = [
    { id: "ev1", title: "Enquiry Posted", date: requirement.postedAt, status: "completed", icon: Edit, description: "You posted this tuition requirement." },
  ];

  if (requirement.applicantsCount && requirement.applicantsCount > 0) {
    for (let i = 0; i < Math.min(requirement.applicantsCount, 3); i++) { // Show max 3 mock applicants
      const appliedDate = new Date(parseISO(requirement.postedAt));
      appliedDate.setDate(appliedDate.getDate() + (i + 1) * 2); // Stagger application dates
      events.push({
        id: `ev_app_${i}`,
        title: `Application from Tutor ${String.fromCharCode(65 + i)}`,
        date: appliedDate.toISOString(),
        status: "info",
        icon: User,
        description: `Tutor ${String.fromCharCode(65 + i)} applied for this tuition.`
      });

      const demoScheduledDate = new Date(appliedDate);
      demoScheduledDate.setDate(demoScheduledDate.getDate() + 1);
      const demoStatusRand = Math.random();
      let demoStatus: TimelineEvent['status'] = 'pending';
      let demoTitle = `Demo Scheduled with Tutor ${String.fromCharCode(65 + i)}`;
      if (demoStatusRand < 0.3) {
        demoStatus = 'cancelled';
        demoTitle = `Demo Cancelled with Tutor ${String.fromCharCode(65 + i)}`;
      } else if (demoStatusRand < 0.7) {
        demoStatus = 'completed';
        demoTitle = `Demo Completed with Tutor ${String.fromCharCode(65 + i)}`;
         if (requirement.status === 'matched' && i === 0) { // Assume first applicant matched
            const classStartDate = new Date(demoScheduledDate);
            classStartDate.setDate(classStartDate.getDate() + 1);
            events.push({
                id: `ev_class_start_${i}`,
                title: `Classes Started with Tutor ${String.fromCharCode(65 + i)}`,
                date: classStartDate.toISOString(),
                status: 'completed',
                icon: Briefcase,
                description: `You started classes with Tutor ${String.fromCharCode(65 + i)}.`
            });
        }
      }
      events.push({
        id: `ev_demo_${i}`,
        title: demoTitle,
        date: demoScheduledDate.toISOString(),
        status: demoStatus,
        icon: CalendarDays,
        description: demoStatus === 'completed' ? `Demo successfully conducted.` : demoStatus === 'cancelled' ? 'Demo was cancelled.' : 'Upcoming demo session.'
      });
    }
  }
  
  if (requirement.status === 'closed') {
     const closedDate = new Date(parseISO(requirement.postedAt));
     closedDate.setDate(closedDate.getDate() + (requirement.applicantsCount || 0) * 2 + 5); // Mock close date
     events.push({
        id: 'ev_closed',
        title: 'Enquiry Closed',
        date: closedDate.toISOString(),
        status: 'completed',
        icon: CheckCircle,
        description: requirement.additionalNotes?.includes("Update:") ? requirement.additionalNotes.split("Update:")[1].trim() : "This enquiry has been closed."
     });
  }


  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};


export default function MyEnquiryTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const [requirement, setRequirement] = useState<TuitionRequirement | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Close/Delete dialogs, adapted from MyRequirementsPage
  const [selectedRequirementForAction, setSelectedRequirementForAction] = useState<TuitionRequirement | null>(null);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [foundTutor, setFoundTutor] = useState<boolean | null>(null);
  const [tutorName, setTutorName] = useState("");
  const [isTutorNameModalOpen, setIsTutorNameModalOpen] = useState(false);
  const [isStartClassesConfirmOpen, setIsStartClassesConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      // Simulate API call
      setTimeout(() => {
        const foundRequirement = MOCK_ALL_PARENT_REQUIREMENTS.find(req => req.id === id);
        if (foundRequirement) {
          setRequirement(foundRequirement);
          setSelectedRequirementForAction(foundRequirement); // Also set for actions
          setTimelineEvents(generateMockTimeline(foundRequirement));
        } else {
          setError("Enquiry not found or you do not have permission to view it.");
        }
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const handleEdit = () => {
    if (requirement) {
      router.push(`/dashboard/my-requirements/edit/${requirement.id}`);
    }
  };

  const handleCloseRequirementClick = () => {
    if (requirement) {
      setSelectedRequirementForAction(requirement); // Ensure current requirement is selected
      setIsCloseConfirmOpen(true);
    }
  };

  const handleCloseConfirm = (found: boolean) => {
    setIsCloseConfirmOpen(false);
    setFoundTutor(found);
    if (found) {
      setIsTutorNameModalOpen(true);
    } else {
      if (selectedRequirementForAction) {
        updateMockRequirementStatus(selectedRequirementForAction.id, "closed", "Tutor not found or not specified.");
        toast({ title: "Requirement Closed", description: `${selectedRequirementForAction.subject.join(', ')} requirement has been marked as closed.` });
        router.push("/dashboard/my-requirements");
      }
      resetCloseFlow();
    }
  };

  const handleTutorNameSubmit = () => {
    setIsTutorNameModalOpen(false);
    setIsStartClassesConfirmOpen(true);
  };

  const handleStartClassesConfirm = (start: boolean) => {
    setIsStartClassesConfirmOpen(false);
    if (selectedRequirementForAction) {
      const notes = start
        ? `Classes initiated with ${tutorName || 'selected tutor'}.`
        : `Tutor ${tutorName || 'selected tutor'} found, but classes not started at this time.`;
      updateMockRequirementStatus(selectedRequirementForAction.id, "closed", notes);
      toast({
          title: start ? "Classes Initiated (Mock)" : "Requirement Closed",
          description: start
            ? `Classes for ${selectedRequirementForAction.subject.join(', ')} with ${tutorName || 'selected tutor'} will start soon. The requirement is now closed.`
            : `${selectedRequirementForAction.subject.join(', ')} requirement has been marked as closed. You chose not to start classes now.`
      });
      router.push("/dashboard/my-requirements");
    }
    resetCloseFlow();
  };
  
  const openDeleteConfirmClick = () => {
    if (requirement) {
      setSelectedRequirementForAction(requirement);
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedRequirementForAction) {
      // Mock delete: find and remove from MOCK_ALL_PARENT_REQUIREMENTS
      const index = MOCK_ALL_PARENT_REQUIREMENTS.findIndex(req => req.id === selectedRequirementForAction.id);
      if (index > -1) {
        MOCK_ALL_PARENT_REQUIREMENTS.splice(index, 1);
      }
      toast({
        title: "Requirement Deleted",
        description: `Requirement for ${selectedRequirementForAction.subject.join(', ')} has been removed.`,
        variant: "destructive"
      });
      router.push("/dashboard/my-requirements");
    }
    setIsDeleteConfirmOpen(false);
    setSelectedRequirementForAction(null);
  };
  
  // Helper to mock update the global mock data array
  const updateMockRequirementStatus = (reqId: string, status: "open" | "matched" | "closed", notes?: string) => {
    const reqIndex = MOCK_ALL_PARENT_REQUIREMENTS.findIndex(r => r.id === reqId);
    if (reqIndex > -1) {
      MOCK_ALL_PARENT_REQUIREMENTS[reqIndex] = {
        ...MOCK_ALL_PARENT_REQUIREMENTS[reqIndex],
        status,
        additionalNotes: notes ? `${MOCK_ALL_PARENT_REQUIREMENTS[reqIndex].additionalNotes ? MOCK_ALL_PARENT_REQUIREMENTS[reqIndex].additionalNotes.split("Update:")[0].trim() + " " : ""}Update: ${notes}` : MOCK_ALL_PARENT_REQUIREMENTS[reqIndex].additionalNotes
      };
      setRequirement(MOCK_ALL_PARENT_REQUIREMENTS[reqIndex]); // Update local state for immediate UI feedback
    }
  };

  const resetCloseFlow = () => {
    setFoundTutor(null);
    setTutorName("");
    // setSelectedRequirementForAction(null); // Don't nullify, it's needed for the main page
  };


  const containerPadding = "container mx-auto px-0 sm:px-0 lg:px-0";

  if (loading) {
    return (
      <div className={`${containerPadding} py-6 md:py-8`}>
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-8 w-3/4 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerPadding} py-6 md:py-8 flex justify-center`}>
        <Alert variant="destructive" className="max-w-lg text-center shadow-lg rounded-xl">
          <UserX className="h-10 w-10 mx-auto mb-3 text-destructive" />
          <AlertTitle className="text-xl font-semibold">Access Denied</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
        </Alert>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className={`${containerPadding} py-6 md:py-8 text-center text-muted-foreground`}>
        No enquiry data available.
      </div>
    );
  }

  const canPerformActions = requirement.status === 'open' || requirement.status === 'matched';

  return (
    <div className={`${containerPadding} py-6 md:py-8`}>
      <Button variant="outline" onClick={() => router.back()} className="mb-6 text-sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to My Enquiries
      </Button>

      <Card className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <CardHeader className="p-5 border-b bg-muted/30">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <FileText className="w-5 h-5 mr-2.5" />
            Enquiry for: {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Grade {requirement.gradeLevel} &bull; Board: {requirement.board} &bull; Posted: {format(parseISO(requirement.postedAt), "PP")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 md:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-semibold text-foreground mb-3">Timeline of Events</h3>
              {timelineEvents.length > 0 ? (
                <div className="relative pl-6 after:absolute after:inset-y-0 after:w-0.5 after:bg-border after:left-2">
                  {timelineEvents.map((event, index) => (
                    <TimelineItem key={event.id} event={event} isLast={index === timelineEvents.length - 1} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No timeline events available for this enquiry yet.</p>
              )}
            </div>

            {requirement.additionalNotes && (
              <>
                <Separator/>
                <div>
                  <h3 className="text-md font-semibold text-foreground mb-2">Original Notes</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-background p-3 rounded-md border">
                    {requirement.additionalNotes.split("Update:")[0].trim()}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
        {canPerformActions && (
          <CardFooter className="p-4 border-t bg-muted/20 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={openDeleteConfirmClick}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
            </Button>
            <Button variant="outline" size="sm" className="border-orange-500 text-orange-600 hover:bg-orange-500/10" onClick={handleCloseRequirementClick}>
              <XCircle className="mr-1.5 h-3.5 w-3.5" /> Close
            </Button>
          </CardFooter>
        )}
      </Card>

       {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this enquiry for <strong>{selectedRequirementForAction?.subject.join(', ')}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for "Did you find a tutor?" */}
      <AlertDialog open={isCloseConfirmOpen} onOpenChange={setIsCloseConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-primary"/> Found a Tutor?</AlertDialogTitle>
            <AlertDialogDescription>
              Did you find a suitable tutor for your requirement: <strong>{selectedRequirementForAction?.subject.join(', ')}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsCloseConfirmOpen(false); handleCloseConfirm(false); }}>No, Close It</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setIsCloseConfirmOpen(false); handleCloseConfirm(true); }}>Yes, I Found One</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for entering tutor name */}
      <Dialog open={isTutorNameModalOpen} onOpenChange={setIsTutorNameModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitleComponent>Tutor Found!</DialogTitleComponent>
            <DialogDescriptionComponent>
              Great! Please enter the name of the tutor you found for <strong>{selectedRequirementForAction?.subject.join(', ')}</strong>.
            </DialogDescriptionComponent>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tutor-name" className="text-right text-sm">
                Tutor&apos;s Name
              </Label>
              <Input
                id="tutor-name"
                value={tutorName}
                onChange={(e) => setTutorName(e.target.value)}
                className="col-span-3"
                placeholder="Enter tutor's name"
              />
            </div>
          </div>
          <DialogFooterComponent>
            <Button type="button" variant="outline" onClick={() => { setIsTutorNameModalOpen(false); handleStartClassesConfirm(false); }}>Skip for Now</Button>
            <Button type="button" onClick={handleTutorNameSubmit} disabled={!tutorName.trim()}>Next</Button>
          </DialogFooterComponent>
        </DialogContent>
      </Dialog>

      {/* Dialog for "Would you like to start classes?" */}
      <AlertDialog open={isStartClassesConfirmOpen} onOpenChange={setIsStartClassesConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><Send className="mr-2 h-5 w-5 text-primary"/> Start Classes?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to start classes with <strong>{tutorName || "the selected tutor"}</strong> for your <strong>{selectedRequirementForAction?.subject.join(', ')}</strong> requirement?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsStartClassesConfirmOpen(false); handleStartClassesConfirm(false); }}>Not Yet</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setIsStartClassesConfirmOpen(false); handleStartClassesConfirm(true); }}>Yes, Start Classes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
}

const TimelineItem = ({ event, isLast }: TimelineItemProps) => {
  const EventIcon = event.icon || Circle;
  const iconColor =
    event.status === 'completed' ? 'text-green-500' :
    event.status === 'cancelled' ? 'text-red-500' :
    event.status === 'pending' ? 'text-yellow-500' :
    'text-primary';

  return (
    <div className={cn("relative pb-6", isLast && "pb-0")}>
      {!isLast && <div className="absolute left-[calc(0.5rem_-_1px)] top-4 -bottom-4 w-0.5 bg-border"></div>}
      <div className="relative flex items-start space-x-3">
        <div className="relative">
          <div className={cn("h-4 w-4 rounded-full bg-card border-2 flex items-center justify-center absolute left-[-0.5rem] top-1 z-10",
            event.status === 'completed' ? 'border-green-500' :
            event.status === 'cancelled' ? 'border-red-500' :
            event.status === 'pending' ? 'border-yellow-500' :
            'border-primary'
          )}>
            <EventIcon className={cn("h-2 w-2", iconColor)} />
          </div>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-xs font-semibold text-foreground">{event.title}</p>
          <p className="text-[10px] text-muted-foreground">
            {format(parseISO(event.date), "MMM d, yyyy 'at' h:mm a")}
          </p>
          {event.description && (
            <p className="mt-1 text-[11px] text-muted-foreground bg-background/50 p-2 rounded-md border border-border/50">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
