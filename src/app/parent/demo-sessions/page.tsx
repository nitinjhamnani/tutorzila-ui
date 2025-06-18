"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CalendarDays, PlusCircle, ChevronDown, Clock, CheckCircle, MessageSquareQuote, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DemoSession } from "@/types";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { ParentDemoCard } from "../components/ParentDemoCard";

const allStatuses = ["All Demos", "Scheduled", "Completed", "Cancelled"] as const;
type StatusType = (typeof allStatuses)[number];

// ✅ Inject dummy data directly
const generateMockParentDemos = (userId: string): DemoSession[] => [
  {
    id: "1",
    parentId: "userID",
    tutorName: "Alice Johnson",
    studentName: "Ria",
    subject: "Math",
    gradeLevel: "5",
    board: "CBSE",
    date: new Date().toISOString(),
    startTime: "5:00 PM",
    endTime: "6:00 PM",
    status: "Scheduled",
    mode: "Online",
    joinLink: "https://zoom.us/sample-link-1"
  },
  {
    id: "2",
    parentId: "userID",
    tutorName: "Bob Smith",
    studentName: "Ria",
    subject: "Science",
    gradeLevel: "5",
    board: "CBSE",
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    startTime: "4:00 PM",
    endTime: "5:00 PM",
    status: "Completed",
    mode: "Offline (In-person)",
    joinLink: ""
    
  }
];

export default function ParentDemoSessionsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();

  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  const [activeStatus, setActiveStatus] = useState<StatusType>("Scheduled");

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || user?.role !== "parent")) {
      router.replace("/");
    } else if (user) {
      // ✅ Use dummy mock data instead of MOCK_DEMO_SESSIONS
      const parentDemos = generateMockParentDemos(user.id);
      setDemoSessions(parentDemos);
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  const handleUpdateSession = (updatedDemo: DemoSession) => {
    setDemoSessions((prev) =>
      prev.map((demo) => (demo.id === updatedDemo.id ? updatedDemo : demo))
    );
  };

  const handleCancelSession = (sessionId: string) => {
    setDemoSessions((prev) =>
      prev.map((demo) =>
        demo.id === sessionId ? { ...demo, status: "Cancelled" } : demo
      )
    );
  };

  const filteredDemos = useMemo(() => {
    if (activeStatus === "All Demos") return demoSessions;
    return demoSessions.filter((d) => d.status === activeStatus);
  }, [demoSessions, activeStatus]);

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Summary Card */}
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-0 flex flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-grow">
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-2.5 text-primary" />
                <CardTitle className="text-xl font-semibold text-primary">
                  Manage Demo Sessions
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1 ml-[calc(1.25rem+0.625rem)] sm:ml-0 sm:mt-0.5">
                View, schedule, and update your demo class details.
              </CardDescription>
            </div>
            <Button
              variant="default"
              size="sm"
              className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-center gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => console.log("Schedule Demo Clicked - Placeholder")}
            >
              <PlusCircle className="w-4 h-4 opacity-90" />
              <span className="hidden md:inline">Schedule Demo</span>
            </Button>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg shadow-sm">
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Demos Scheduled</p>
                  <p className="text-xl font-semibold text-primary">
                    {demoSessions.filter((d) => d.status === "Scheduled").length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Dropdown */}
        <div className="flex justify-end mb-4 sm:mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-sm py-2 px-4 flex items-center gap-2">
                {activeStatus} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allStatuses.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={cn(
                    "text-sm",
                    activeStatus === status && "bg-primary text-primary-foreground"
                  )}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filteredDemos.map((demo) => (
            <ParentDemoCard
              key={demo.id}
              demo={demo}
              onUpdateSession={handleUpdateSession}
              onCancelSession={handleCancelSession}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
