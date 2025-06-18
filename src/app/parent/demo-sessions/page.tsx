
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import React from 'react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  CalendarDays,
  MessageSquareQuote,
  PlusCircle,
  ListFilter,
  ChevronDown,
  Clock as ClockIcon,
  CheckCircle,
  XCircle as CancelIcon, // Using CancelIcon as XCircle
  Edit3,
} from "lucide-react";
import { ParentDemoSessionCard } from "@/components/dashboard/parent/ParentDemoSessionCard";
import type { DemoSession, User } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import type { NextStepDecisionValue } from "@/components/modals/FeedbackModal";


const demoStatusCategories = [
  "All Demos",
  "Scheduled",
  "Requested",
  "Completed",
  "Cancelled",
] as const;
type DemoStatusCategory = (typeof demoStatusCategories)[number];

const statusIcons: Record<Exclude<DemoStatusCategory, "All Demos">, React.ElementType> = { // Exclude "All Demos" for specific icons
  Scheduled: ClockIcon,
  Requested: MessageSquareQuote,
  Completed: CheckCircle,
  Cancelled: CancelIcon,
};

export default function ParentDemoSessionsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();

  const [allParentDemos, setAllParentDemos] = useState<DemoSession[]>([]);
  const [activeFilterCategory, setActiveFilterCategory] =
    useState<DemoStatusCategory>("Scheduled");

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated || user?.role !== "parent") {
        router.replace("/");
      } else if (user) {
        const parentAssociatedStudentNames = ["Rohan Sharma (Son)", "Priya Singh (Daughter)"];
        const parentDemos = MOCK_DEMO_SESSIONS.filter((demo) =>
          parentAssociatedStudentNames.includes(demo.studentName)
        );
        setAllParentDemos(parentDemos);
      }
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  const categoryCounts = useMemo(() => {
    const counts = {
      "All Demos": allParentDemos.length,
      Scheduled: allParentDemos.filter(d => d.status === "Scheduled").length,
      Requested: allParentDemos.filter(d => d.status === "Requested").length,
      Completed: allParentDemos.filter(d => d.status === "Completed").length,
      Cancelled: allParentDemos.filter(d => d.status === "Cancelled").length,
    };
    return counts;
  }, [allParentDemos]);

  const filteredDemos = useMemo(() => {
    if (activeFilterCategory === "All Demos") return allParentDemos;
    return allParentDemos.filter((d) => d.status === activeFilterCategory);
  }, [allParentDemos, activeFilterCategory]);

  const handleReschedule = useCallback((demoId: string, newDate: Date, newStartTime: string, newEndTime: string, reason: string) => {
    setAllParentDemos(prevDemos =>
      prevDemos.map(demo =>
        demo.id === demoId
          ? { ...demo, rescheduleStatus: 'pending' as const }
          : demo
      )
    );
    console.log("Reschedule requested by parent for demo:", demoId, newDate, newStartTime, newEndTime, reason);
    toast({ title: "Reschedule Requested", description: "The tutor has been notified of your reschedule request." });
  }, [toast]);

  const handleCancel = useCallback((demoId: string) => {
    setAllParentDemos(prevDemos =>
      prevDemos.map(demo =>
        demo.id === demoId
          ? { ...demo, status: "Cancelled" as const }
          : demo
      )
    );
    const demoIndexInMock = MOCK_DEMO_SESSIONS.findIndex(d => d.id === demoId);
    if (demoIndexInMock > -1) MOCK_DEMO_SESSIONS[demoIndexInMock].status = "Cancelled";
    toast({ title: "Demo Cancelled", description: "The demo session has been cancelled." });
  }, [toast]);

  const handleEditRequest = useCallback((demoId: string, newDate: Date, newStartTime: string, newEndTime: string, meetingUrl?: string) => {
     setAllParentDemos(prevDemos =>
      prevDemos.map(demo =>
        demo.id === demoId
          ? {
              ...demo,
              date: newDate.toISOString(),
              startTime: newStartTime,
              endTime: newEndTime,
              joinLink: meetingUrl || demo.joinLink,
              status: "Requested" as const, // Status remains requested until tutor confirms
              rescheduleStatus: 'idle' as const // Reset reschedule status on edit
            }
          : demo
      )
    );
    const demoIndexInMock = MOCK_DEMO_SESSIONS.findIndex(d => d.id === demoId);
    if (demoIndexInMock > -1) {
        MOCK_DEMO_SESSIONS[demoIndexInMock] = {
            ...MOCK_DEMO_SESSIONS[demoIndexInMock],
            date: newDate.toISOString(),
            startTime: newStartTime,
            endTime: newEndTime,
            joinLink: meetingUrl || MOCK_DEMO_SESSIONS[demoIndexInMock].joinLink,
            status: "Requested",
            rescheduleStatus: 'idle',
        };
    }
    toast({ title: "Demo Request Updated", description: `Your demo request for session ${demoId} has been updated. The tutor will be notified.` });
  }, [toast]);

  const handleWithdrawRequest = useCallback((demoId: string) => {
     setAllParentDemos(prevDemos =>
      prevDemos.map(demo =>
        demo.id === demoId
          ? { ...demo, status: "Cancelled" as const } // Mark as Cancelled
          : demo
      )
    );
    const demoIndexInMock = MOCK_DEMO_SESSIONS.findIndex(d => d.id === demoId);
    if (demoIndexInMock > -1) MOCK_DEMO_SESSIONS[demoIndexInMock].status = "Cancelled";
    toast({ title: "Request Withdrawn", description: `Demo request ${demoId} has been withdrawn.` });
  }, [toast]);

  const handleGiveFeedback = useCallback((demoId: string, rating: number, comment?: string, nextStepDecision?: NextStepDecisionValue) => {
    const demoToUpdate = allParentDemos.find(d => d.id === demoId);
    if (!demoToUpdate) return;

    setAllParentDemos(prevDemos =>
      prevDemos.map(demo =>
        demo.id === demoId ? {
            ...demo,
            status: "Completed" as const,
            feedbackSubmitted: true,
            rating,
            parentComment: comment,
        } : demo
      )
    );
     const demoIndexInMock = MOCK_DEMO_SESSIONS.findIndex(d => d.id === demoId);
    if (demoIndexInMock > -1) {
        MOCK_DEMO_SESSIONS[demoIndexInMock].status = "Completed";
        MOCK_DEMO_SESSIONS[demoIndexInMock].feedbackSubmitted = true;
        MOCK_DEMO_SESSIONS[demoIndexInMock].rating = rating;
        MOCK_DEMO_SESSIONS[demoIndexInMock].parentComment = comment;
    }

    toast({
      title: "Feedback Submitted",
      description: "We have noted your feedback. Our team will connect with you shortly."
    });

    if (nextStepDecision === "start_classes") {
        handleStartClassesRequest(demoId);
    }
    console.log("Parent's next step decision:", nextStepDecision);

  }, [allParentDemos, toast]); 

  const handleStartClassesRequest = useCallback((demoId: string) => {
    const demo = allParentDemos.find(d => d.id === demoId);
    toast({
      title: "Start Classes Requested (Mock)",
      description: `A request to start regular classes with ${demo?.tutorName} for ${demo?.subject} would be initiated. Our team will connect with you.`,
    });
  }, [allParentDemos, toast]);


  if (isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-0 flex flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-grow">
              <div className="flex items-center">
                <MessageSquareQuote className="w-5 h-5 mr-2.5 text-primary" />
                <CardTitle className="text-xl font-semibold text-primary">
                  My Demo Sessions
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1 ml-[calc(1.25rem+0.625rem)] sm:ml-0 sm:mt-0.5">
                View and manage your requested and scheduled demo classes.
              </CardDescription>
            </div>
             <Button
                asChild
                variant="default"
                size="sm"
                className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-center gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/parent/find-tutor">
                  <PlusCircle className="w-4 h-4 opacity-90" />
                  <span className="hidden md:inline">Request Demo</span>
                </Link>
              </Button>
          </CardHeader>
          {/* Removed CardContent with summary cards */}
        </Card>

        <div className="flex justify-end mb-4 sm:mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <span>
                  {activeFilterCategory} (
                  {categoryCounts[activeFilterCategory] || 0})
                </span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {demoStatusCategories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setActiveFilterCategory(category)}
                  className={cn(
                    "text-sm",
                    activeFilterCategory === category && "bg-primary text-primary-foreground"
                  )}
                >
                  { category !== "All Demos" ?
                    React.createElement(statusIcons[category as Exclude<DemoStatusCategory, "All Demos">], { className: "mr-2 h-4 w-4" }) :
                    <ListFilter className="mr-2 h-4 w-4" />
                  }
                  {category} ({categoryCounts[category] || 0})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          {filteredDemos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:gap-5">
              {filteredDemos.map((demo) => (
                <ParentDemoSessionCard
                  key={demo.id}
                  demo={demo}
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                  onEditRequest={handleEditRequest}
                  onWithdrawRequest={handleWithdrawRequest}
                  onGiveFeedback={handleGiveFeedback}
                  onStartClassesRequest={handleStartClassesRequest}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 bg-card border rounded-lg shadow-sm">
              <CardContent className="flex flex-col items-center">
                <MessageSquareQuote className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <p className="text-md font-semibold text-foreground/70 mb-2">
                  No Demos Found
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  There are no demos matching "{activeFilterCategory}".
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

