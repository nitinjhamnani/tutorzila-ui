
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
  XCircle as CancelIcon, 
  Edit3,
} from "lucide-react";
import { ParentDemoSessionCard } from "@/components/dashboard/parent/ParentDemoSessionCard";
import type { DemoSession, User, EnquiryDemo } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, addMinutes, parse } from "date-fns";
import type { NextStepDecisionValue } from "@/components/modals/FeedbackModal";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";


const demoStatusCategories = [
  "All Demos",
  "Scheduled",
  "Requested",
  "Completed",
  "Cancelled",
] as const;
type DemoStatusCategory = (typeof demoStatusCategories)[number];

const statusIcons: Record<Exclude<DemoStatusCategory, "All Demos">, React.ElementType> = {
  Scheduled: ClockIcon,
  Requested: MessageSquareQuote,
  Completed: CheckCircle,
  Cancelled: CancelIcon,
};

const fetchParentDemos = async (token: string | null): Promise<DemoSession[]> => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(`${apiBaseUrl}/api/demo/parent`, {
    headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch demo sessions.");
  }
  
  const data: EnquiryDemo[] = await response.json();

  return data.map(item => {
    const startTime = item.demoDetails.startTime || "12:00 AM";
    const duration = parseInt(item.demoDetails.duration) || 30;
    
    let endTime = "12:30 AM";
    try {
      const startDateTime = parse(`${item.demoDetails.date} ${startTime}`, 'yyyy-MM-dd hh:mm a', new Date());
      if (!isNaN(startDateTime.getTime())) {
          const endDateTime = addMinutes(startDateTime, duration);
          endTime = format(endDateTime, "hh:mm a");
      }
    } catch(e) {
      console.error("Could not parse date/time for end time calculation", item.demoDetails.date, startTime);
    }
    
    const statusMap: Record<string, DemoSession["status"]> = {
      SCHEDULED: "Scheduled",
      REQUESTED: "Requested",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
    };

    return {
      id: item.demoId,
      enquiryId: item.demoDetails.enquiryId,
      tutorName: item.demoDetails.tutorName,
      studentName: item.demoDetails.studentName,
      subject: item.demoDetails.subjects,
      gradeLevel: item.demoDetails.grade,
      board: item.demoDetails.board,
      date: item.demoDetails.date,
      day: item.demoDetails.day,
      startTime: startTime,
      endTime: endTime,
      duration: item.demoDetails.duration,
      status: statusMap[item.demoStatus] || "Requested",
      demoLink: item.demoDetails.demoLink,
      isPaid: item.demoDetails.paid,
      demoFee: item.demoDetails.demoFees,
      mode: item.demoDetails.online ? "Online" : (item.demoDetails.offline ? "Offline (In-person)" : undefined),
    };
  });
};


export default function ParentDemoSessionsPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const { hideLoader, showLoader } = useGlobalLoader();
  const queryClient = useQueryClient();

  const [activeFilterCategory, setActiveFilterCategory] =
    useState<DemoStatusCategory>("Scheduled");
    
  const { data: allParentDemos = [], isLoading, error } = useQuery({
    queryKey: ['parentDemos', token],
    queryFn: () => fetchParentDemos(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (isLoading) {
        showLoader("Fetching your demos...");
    } else {
        hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);


  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || user?.role !== "parent")) {
      router.replace("/");
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
  
  const handleMutationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['parentDemos', token] });
  };

  const handleReschedule = useCallback((demoId: string, newDate: Date, newStartTime: string, newEndTime: string, reason: string) => {
    // This would be a mutation call
    console.log("Reschedule requested by parent for demo:", demoId, newDate, newStartTime, newEndTime, reason);
    handleMutationSuccess();
    toast({ title: "Reschedule Requested", description: "The tutor has been notified of your reschedule request." });
  }, [handleMutationSuccess, toast]);

  const handleCancel = useCallback((demoId: string) => {
    // This would be a mutation call
    console.log("Cancel requested for demo:", demoId);
    handleMutationSuccess();
    toast({ title: "Demo Cancelled", description: "The demo session has been cancelled." });
  }, [handleMutationSuccess, toast]);

  const handleEditRequest = useCallback((demoId: string, newDate: Date, newStartTime: string, newEndTime: string, meetingUrl?: string) => {
    // This would be a mutation call
    console.log("Edit request for demo:", demoId, newDate, newStartTime, newEndTime, meetingUrl);
    handleMutationSuccess();
    toast({ title: "Demo Request Updated", description: `Your demo request has been updated. The tutor will be notified.` });
  }, [handleMutationSuccess, toast]);

  const handleWithdrawRequest = useCallback((demoId: string) => {
    // This would be a mutation call
    console.log("Withdraw request for demo:", demoId);
    handleMutationSuccess();
    toast({ title: "Request Withdrawn", description: `Demo request has been withdrawn.` });
  }, [handleMutationSuccess, toast]);

  const handleGiveFeedback = useCallback((demoId: string, rating: number, comment?: string, nextStepDecision?: NextStepDecisionValue) => {
    // This would be a mutation call
    console.log("Feedback submitted for demo:", demoId, rating, comment, nextStepDecision);
    handleMutationSuccess();
    toast({
      title: "Feedback Submitted",
      description: "We have noted your feedback. Our team will connect with you shortly."
    });

    if (nextStepDecision === "start_classes") {
        handleStartClassesRequest(demoId);
    }
  }, [handleMutationSuccess, toast]); 

  const handleStartClassesRequest = useCallback((demoId: string) => {
    console.log("Start classes requested for demo:", demoId);
    toast({
      title: "Start Classes Requested",
      description: `A request to start regular classes has been initiated. Our team will connect with you.`,
    });
  }, [toast]);


  if (isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }
  
  const renderDemoList = () => {
    if (isLoading) return null; // Global loader is active

    if (error) {
        return (
            <Card className="text-center py-16 bg-destructive/10 border-destructive/20 rounded-lg shadow-sm">
                <CardContent className="flex flex-col items-center">
                    <CancelIcon className="w-16 h-16 text-destructive mx-auto mb-5" />
                    <p className="text-xl font-semibold text-destructive mb-1.5">Error Fetching Demos</p>
                    <p className="text-sm text-destructive/80 max-w-sm mx-auto">{(error as Error).message}</p>
                </CardContent>
            </Card>
        );
    }

    if (filteredDemos.length === 0) {
        return (
            <Card className="text-center py-16 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out">
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
        );
    }

    return (
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
    );
  };

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
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
                  {activeFilterCategory} ({categoryCounts[activeFilterCategory] || 0})
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
          {renderDemoList()}
        </div>
      </div>
    </main>
  );
}

