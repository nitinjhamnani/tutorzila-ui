
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import React from 'react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ListFilter,
  PlusCircle,
  MessageSquareQuote,
  XIcon,
  CheckCircle,
  Clock as ClockIcon,
  ChevronDown,
  CalendarDays,
  XCircle as CancelIcon, // Using CancelIcon as XCircle
  Loader2,
} from "lucide-react";
import { TutorDemoCard } from "@/components/tutor/TutorDemoCard";
import type { DemoSession, TutorProfile, EnquiryDemo } from "@/types";
import { cn } from "@/lib/utils";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, addMinutes, parse } from 'date-fns';
import { useGlobalLoader } from "@/hooks/use-global-loader";

const allDemoStatusesForPage = [
  "All Demos",
  "Scheduled",
  "Requested",
  "Completed",
  "Cancelled",
] as const;
type DemoStatusCategory = (typeof allDemoStatusesForPage)[number];

const statusIcons: Record<Exclude<DemoStatusCategory, "All Demos">, React.ElementType> = { // Exclude "All Demos" for specific icons
  Scheduled: ClockIcon,
  Requested: MessageSquareQuote,
  Completed: CheckCircle,
  Cancelled: CancelIcon,
};

const fetchTutorDemos = async (token: string | null, status: DemoStatusCategory): Promise<DemoSession[]> => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  
  let statusesToFetch: string[] = [];
  if (status === "All Demos") {
    statusesToFetch = ["SCHEDULED", "REQUESTED", "COMPLETED", "CANCELLED"];
  } else {
    statusesToFetch = [status.toUpperCase()];
  }

  const fetchPromises = statusesToFetch.map(async (s) => {
    const response = await fetch(`${apiBaseUrl}/api/tutor/demos/${s}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
    });
    if (!response.ok) {
        // Silently fail for individual fetches in "All" mode to not break the whole page
        if (status === 'All Demos') {
            console.error(`Failed to fetch demos for status: ${s}`);
            return [];
        }
        throw new Error(`Failed to fetch demos for status: ${s}`);
    }
    return response.json();
  });

  const results = await Promise.all(fetchPromises);
  const combinedData: EnquiryDemo[] = results.flat();

  return combinedData.map(item => {
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
      date: item.demoDetails.date, // Already a string
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

const cancelDemoApi = async ({ demoId, reason, token }: { demoId: string; reason: string; token: string | null }) => {
    if (!token) throw new Error("Authentication token not found.");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    const response = await fetch(`${apiBaseUrl}/api/demo/cancel`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'TZ-DMO-ID': demoId,
            'accept': '*/*',
        },
        body: JSON.stringify({ message: reason }),
    });

    if (!response.ok) {
        throw new Error("Failed to cancel the demo session.");
    }
    
    return true; // Assuming success on 2xx status
};


export default function TutorDemoSessionsPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null;
  const { showLoader, hideLoader } = useGlobalLoader();
  const queryClient = useQueryClient();

  const [activeDemoCategoryFilter, setActiveDemoCategoryFilter] =
    useState<DemoStatusCategory>("Scheduled");
    
  const { data: allTutorDemos = [], isLoading, error } = useQuery({
    queryKey: ['tutorDemos', token, activeDemoCategoryFilter],
    queryFn: () => fetchTutorDemos(token, activeDemoCategoryFilter),
    enabled: !!token && !!tutorUser,
  });
  
  useEffect(() => {
    if (isLoading) {
      showLoader("Fetching demos...");
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);
  
  const cancelMutation = useMutation({
    mutationFn: cancelDemoApi,
    onMutate: () => {
      showLoader("Cancelling demo...");
    },
    onSuccess: () => {
        toast({
            title: "Demo Cancelled",
            description: "The demo session has been successfully cancelled.",
        });
        queryClient.invalidateQueries({ queryKey: ['tutorDemos', token, activeDemoCategoryFilter] });
    },
    onError: (error: Error) => {
        toast({
            variant: "destructive",
            title: "Cancellation Failed",
            description: error.message,
        });
    },
    onSettled: () => {
        hideLoader();
    },
  });

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || !tutorUser || tutorUser.role !== "tutor")) {
      router.replace("/");
    }
  }, [isCheckingAuth, isAuthenticated, tutorUser, router]);

  const categoryCounts = useMemo(() => {
    // This is a simplification since we don't have all data at once.
    // A better approach would be an API endpoint that provides counts for all categories.
    const counts = {
      "All Demos": 0,
      Scheduled: 0,
      Requested: 0,
      Completed: 0,
      Cancelled: 0,
    };
    if (activeDemoCategoryFilter !== "All Demos") {
      counts[activeDemoCategoryFilter] = allTutorDemos.length;
    }
    return counts;
  }, [allTutorDemos, activeDemoCategoryFilter]);

  const filterCategoriesForDropdown: {
    label: DemoStatusCategory;
    value: DemoStatusCategory;
    icon: React.ElementType;
    // count: number; // Count is dynamic and will be shown in the trigger
  }[] = [
    { label: "All Demos", value: "All Demos", icon: CalendarDays },
    { label: "Scheduled", value: "Scheduled", icon: ClockIcon },
    { label: "Requested", value: "Requested", icon: MessageSquareQuote },
    { label: "Completed", value: "Completed", icon: CheckCircle },
    { label: "Cancelled", value: "Cancelled", icon: CancelIcon },
  ];

  const selectedCategoryLabel = useMemo(() => {
    return (
      filterCategoriesForDropdown.find(
        (cat) => cat.value === activeDemoCategoryFilter
      )?.label || "Scheduled"
    );
  }, [activeDemoCategoryFilter, filterCategoriesForDropdown]);


  const handleUpdateSession = (updatedDemo: DemoSession) => {
    // This part would be replaced by a mutation to the backend API
    toast({
      title: "Demo Updated (Mock)",
      description: `Demo session with ${updatedDemo.studentName} has been updated.`,
    });
  };

  const handleCancelSession = useCallback((sessionId: string, reason: string) => {
    cancelMutation.mutate({ demoId: sessionId, reason, token });
  }, [cancelMutation, token]);

  const renderDemoList = (demos: DemoSession[]) => {
    if (isLoading) {
      return null; // Global loader is shown
    }
    
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

    if (demos.length === 0) {
      return (
        <Card className="text-center py-16 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out">
          <CardContent className="flex flex-col items-center">
            <MessageSquareQuote className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <p className="text-md font-semibold text-foreground/70 mb-2">
              No Demos Found
            </p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
              There are no demos matching your current selection.
            </p>
          </CardContent>
        </Card>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-4 md:gap-5">
        {demos.map((demo) => (
          <TutorDemoCard
            key={demo.id}
            demo={demo}
            onUpdateSession={handleUpdateSession}
            onCancelSession={handleCancelSession}
          />
        ))}
      </div>
    );
  };

  if (isCheckingAuth || !tutorUser) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">
        Loading Demo Sessions...
      </div>
    );
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-0 flex flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-grow">
                <div className="flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2.5 text-primary"/>
                    <CardTitle className="text-xl font-semibold text-primary">
                        Manage Demo Sessions
                    </CardTitle>
                </div>
                 <CardDescription className="text-xs text-muted-foreground mt-1 ml-[calc(1.25rem+0.625rem)] sm:ml-0 sm:mt-0.5">
                    View, schedule, and update your demo class details.
                </CardDescription>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                    variant="default"
                    className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <span className="text-primary-foreground">
                        {selectedCategoryLabel} 
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-70 text-primary-foreground" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterCategoriesForDropdown.map((category) => (
                    <DropdownMenuItem
                    key={category.value}
                    onClick={() => setActiveDemoCategoryFilter(category.value)}
                    className={cn(
                        "text-sm",
                        activeDemoCategoryFilter === category.value && "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary hover:text-primary-foreground focus:text-primary-foreground"
                    )}
                    >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.label}
                    </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
        </Card>

        <div className="mt-4">{renderDemoList(allTutorDemos)}</div>
      </div>
    </main>
  );
}
