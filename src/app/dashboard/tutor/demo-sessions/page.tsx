
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ListFilter, PlusCircle, FilterIcon as LucideFilterIcon, MessageSquareQuote, Users as UsersIcon, XIcon, BookOpen, ChevronDown, CheckCircle, Clock, XCircle, Star } from "lucide-react";
import { TutorDemoCard } from "@/components/dashboard/tutor/TutorDemoCard";
import type { DemoSession, TutorProfile } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle as DialogTitleComponent, DialogDescription as DialogDescriptionComponent } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


const demoStatuses = ["All Demos", "Scheduled", "Requested", "Completed", "Cancelled"] as const;
type DemoStatusCategory = typeof demoStatuses[number];


export default function TutorDemoSessionsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const tutorUser = user as TutorProfile | null;

  const [allTutorDemos, setAllTutorDemos] = useState<DemoSession[]>([]);
  
  // For the category dropdown
  const [activeDemoCategoryFilter, setActiveDemoCategoryFilter] = useState<DemoStatusCategory>("All Demos");

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated || !tutorUser || tutorUser.role !== 'tutor') {
        router.replace("/"); 
      } else {
        const tutorDemos = MOCK_DEMO_SESSIONS.filter(demo => demo.tutorId === tutorUser.id || demo.tutorName === tutorUser.name);
        setAllTutorDemos(tutorDemos);
      }
    }
  }, [isCheckingAuth, isAuthenticated, tutorUser, router]);


  const categoryCounts = useMemo(() => {
    return {
      "All Demos": allTutorDemos.length,
      "Scheduled": allTutorDemos.filter(d => d.status === "Scheduled").length,
      "Requested": allTutorDemos.filter(d => d.status === "Requested").length,
      "Completed": allTutorDemos.filter(d => d.status === "Completed").length,
      "Cancelled": allTutorDemos.filter(d => d.status === "Cancelled").length,
    };
  }, [allTutorDemos]);

  const filterCategoriesForDropdown: { label: DemoStatusCategory; value: DemoStatusCategory; icon: React.ElementType; count: number }[] = [
    { label: "All Demos", value: "All Demos", icon: ListFilter, count: categoryCounts["All Demos"] },
    { label: "Scheduled", value: "Scheduled", icon: Clock, count: categoryCounts.Scheduled },
    { label: "Requested", value: "Requested", icon: MessageSquareQuote, count: categoryCounts.Requested },
    { label: "Completed", value: "Completed", icon: CheckCircle, count: categoryCounts.Completed },
    { label: "Cancelled", value: "Cancelled", icon: XCircle, count: categoryCounts.Cancelled },
  ];
  
  const selectedCategoryLabel = useMemo(() => {
    return filterCategoriesForDropdown.find(cat => cat.value === activeDemoCategoryFilter)?.label || "All Demos";
  }, [activeDemoCategoryFilter, filterCategoriesForDropdown]);


  const filteredDemos = useMemo(() => {
    return allTutorDemos.filter(demo => {
      const matchesCategory = activeDemoCategoryFilter === "All Demos" || demo.status === activeDemoCategoryFilter;
      return matchesCategory;
    });
  }, [activeDemoCategoryFilter, allTutorDemos]);

  const handleUpdateSession = (updatedDemo: DemoSession) => {
    setAllTutorDemos(prevDemos => prevDemos.map(d => d.id === updatedDemo.id ? updatedDemo : d));
  };

  const handleCancelSession = (sessionId: string) => {
    setAllTutorDemos(prevDemos => prevDemos.map(d => d.id === sessionId ? { ...d, status: "Cancelled" } : d));
  };
  
   const renderDemoList = (demos: DemoSession[]) => {
    if (demos.length === 0) {
      return (
        <div className="text-center py-16 bg-card border rounded-lg shadow-sm">
            <MessageSquareQuote className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <p className="text-md font-semibold text-foreground/70 mb-2">No demos found.</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
                There are no demos matching your current filters.
            </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-4 md:gap-5">
        {demos.map(demo => (
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
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Demo Sessions...</div>;
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-base sm:text-lg font-semibold text-primary flex items-center break-words">
              <ListFilter className="w-4 h-4 sm:w-5 sm:h-5 mr-2"/>
              Filter Demo Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end"> {/* Changed to justify-end for category filter */}
              <div className="w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      className="w-full sm:w-auto text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-11"
                    >
                      <span className="text-primary-foreground">
                        {selectedCategoryLabel} (
                        {filterCategoriesForDropdown.find(
                            (cat) => cat.value === activeDemoCategoryFilter
                        )?.count || 0}
                        )
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
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          {renderDemoList(filteredDemos)}
        </div>
      </div>
    </main>
  );
}
