
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ListFilter,
  PlusCircle,
  FilterIcon as LucideFilterIcon,
  MessageSquareQuote,
  Users as UsersIcon,
  XIcon,
  BookOpen,
  CheckCircle,
  Clock as ClockIcon,
  ChevronDown,
  CalendarDays,
  XCircle,
  Search,
} from "lucide-react";
import { TutorDemoCard } from "@/app/tutor/components/TutorDemoCard";
import type { DemoSession, TutorProfile } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle as DialogTitleComponent,
  DialogDescription as DialogDescriptionComponent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger as FormSelectTrigger,
  SelectValue as FormSelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const allDemoStatusesForPage = [
  "All Demos",
  "Scheduled",
  "Requested",
  "Completed",
  "Cancelled",
] as const;
type DemoStatusCategory = (typeof allDemoStatusesForPage)[number];

export default function TutorDemoSessionsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null;

  const [allTutorDemos, setAllTutorDemos] = useState<DemoSession[]>([]);
  const [activeDemoCategoryFilter, setActiveDemoCategoryFilter] =
    useState<DemoStatusCategory>("Scheduled");

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempDemoSubjectFilter, setTempDemoSubjectFilter] = useState("All");
  const [tempDemoStudentFilter, setTempDemoStudentFilter] = useState("All");

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || !tutorUser || tutorUser.role !== "tutor")) {
      router.replace("/");
    } else if (tutorUser) {
      const tutorDemos = MOCK_DEMO_SESSIONS.filter(
        (demo) =>
          demo.tutorId === tutorUser.id || demo.tutorName === tutorUser.name
      );
      setAllTutorDemos(tutorDemos);
    }
  }, [isCheckingAuth, isAuthenticated, tutorUser, router]);

  const uniqueDemoSubjectsForFilter = useMemo(
    () => ["All", ...new Set(allTutorDemos.map((d) => d.subject))],
    [allTutorDemos]
  );
  const uniqueDemoStudentsForFilter = useMemo(
    () => ["All", ...new Set(allTutorDemos.map((d) => d.studentName))],
    [allTutorDemos]
  );

  const categoryCounts = useMemo(() => {
    const filterByDetails = (demo: DemoSession) => {
      const subjectMatch = tempDemoSubjectFilter === "All" || demo.subject === tempDemoSubjectFilter;
      const studentMatch = tempDemoStudentFilter === "All" || demo.studentName === tempDemoStudentFilter;
      return subjectMatch && studentMatch;
    };

    return {
      "All Demos": allTutorDemos.filter(filterByDetails).length,
      Scheduled: allTutorDemos.filter(demo => demo.status === "Scheduled" && filterByDetails(demo)).length,
      Requested: allTutorDemos.filter(demo => demo.status === "Requested" && filterByDetails(demo)).length,
      Completed: allTutorDemos.filter(demo => demo.status === "Completed" && filterByDetails(demo)).length,
      Cancelled: allTutorDemos.filter(demo => demo.status === "Cancelled" && filterByDetails(demo)).length,
    };
  }, [allTutorDemos, tempDemoSubjectFilter, tempDemoStudentFilter]);

  const filterCategoriesForDropdown: {
    label: DemoStatusCategory;
    value: DemoStatusCategory;
    icon: React.ElementType;
    count: number;
  }[] = [
    { label: "All Demos", value: "All Demos", icon: CalendarDays, count: categoryCounts["All Demos"] },
    { label: "Scheduled", value: "Scheduled", icon: ClockIcon, count: categoryCounts.Scheduled },
    { label: "Requested", value: "Requested", icon: MessageSquareQuote, count: categoryCounts.Requested },
    { label: "Completed", value: "Completed", icon: CheckCircle, count: categoryCounts.Completed },
    { label: "Cancelled", value: "Cancelled", icon: XCircle, count: categoryCounts.Cancelled },
  ];

  const selectedCategoryLabel = useMemo(() => {
    return (
      filterCategoriesForDropdown.find(
        (cat) => cat.value === activeDemoCategoryFilter
      )?.label || "Scheduled"
    );
  }, [activeDemoCategoryFilter, filterCategoriesForDropdown]);

  const filteredDemos = useMemo(() => {
    return allTutorDemos.filter((demo) => {
      const detailedSubjectFilterMatch = tempDemoSubjectFilter === "All" || demo.subject === tempDemoSubjectFilter;
      const detailedStudentFilterMatch = tempDemoStudentFilter === "All" || demo.studentName === tempDemoStudentFilter;
      const matchesDetailedFilters = detailedSubjectFilterMatch && detailedStudentFilterMatch;

      const matchesCategory = activeDemoCategoryFilter === "All Demos" || demo.status === activeDemoCategoryFilter;

      return matchesDetailedFilters && matchesCategory;
    });
  }, [
    tempDemoSubjectFilter,
    tempDemoStudentFilter,
    activeDemoCategoryFilter,
    allTutorDemos,
  ]);

  const handleUpdateSession = (updatedDemo: DemoSession) => {
    setAllTutorDemos((prevDemos) =>
      prevDemos.map((d) => (d.id === updatedDemo.id ? updatedDemo : d))
    );
    toast({
      title: "Demo Updated",
      description: `Demo session with ${updatedDemo.studentName} has been updated.`,
    });
  };

  const handleCancelSession = (sessionId: string) => {
    setAllTutorDemos((prevDemos) =>
      prevDemos.map((d) =>
        d.id === sessionId ? { ...d, status: "Cancelled" } : d
      )
    );
    toast({
      title: "Demo Cancelled",
      description: "The demo session has been cancelled.",
      variant: "destructive",
    });
  };

  const handleApplyDetailedFilters = () => {
    setIsFilterDialogOpen(false);
  };

  const handleClearDetailedFilters = () => {
    setTempDemoSubjectFilter("All");
    setTempDemoStudentFilter("All");
    setIsFilterDialogOpen(false);
  };

  const renderDemoList = (demos: DemoSession[]) => {
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
            <Button
              onClick={() => {
                setActiveDemoCategoryFilter("All Demos");
                handleClearDetailedFilters();
              }}
              variant="outline"
              className="mt-6 text-sm py-2 px-5"
            >
              <XIcon className="w-3.5 h-3.5 mr-1.5" />
              Clear Filters & Search
            </Button>
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
        {/* Manage Demo Sessions Card */}
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <CalendarDays className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total Demos Scheduled
                      </p>
                      <p className="text-xl font-semibold text-primary">
                        {categoryCounts.Scheduled}
                      </p>
                    </div>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter by Category Dropdown */}
        <div className="flex justify-end mb-4 sm:mb-6">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                    variant="default"
                    className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <span className="text-primary-foreground">
                    {selectedCategoryLabel} ({filterCategoriesForDropdown.find(cat => cat.value === activeDemoCategoryFilter)?.count || 0})
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
                        activeDemoCategoryFilter === category.value && "bg-primary text-primary-foreground"
                    )}
                    >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.label} ({category.count})
                    </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div className="mt-4">{renderDemoList(filteredDemos)}</div>
      </div>
    </main>
  );
}
