
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { TuitionRequirement } from "@/types";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, UserX, ArrowLeft, Clock, User, CheckCircle, Edit, Briefcase, CalendarDays, Circle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";


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
  const id = params.id as string;

  const [requirement, setRequirement] = useState<TuitionRequirement | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
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
          setTimelineEvents(generateMockTimeline(foundRequirement));
        } else {
          setError("Enquiry not found or you do not have permission to view it.");
        }
        setLoading(false);
      }, 500);
    }
  }, [id]);

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
            Enquiry for: {requirement.subject}
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
      </Card>
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
