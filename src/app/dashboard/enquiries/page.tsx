
"use client";

import { useState, useMemo, useEffect } from "react";
import type { TuitionRequirement } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TuitionRequirementCard } from "@/components/tuitions/TuitionRequirementCard";
import { SearchIcon, XIcon, Star, CheckCircle, FilterIcon as LucideFilterIcon, Bookmark, ListChecks, ChevronDown, Users as UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function AllEnquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [requirements, setRequirements] = useState<TuitionRequirement[]>([]);
  const [activeFilterCategory, setActiveFilterCategory] = useState<'all' | 'recommended' | 'applied' | 'shortlisted'>('recommended');

  useEffect(() => {
    setRequirements(MOCK_ALL_PARENT_REQUIREMENTS.filter(r => r.status === 'open'));
  }, []);

  const categoryCounts = useMemo(() => {
    const openRequirements = MOCK_ALL_PARENT_REQUIREMENTS.filter(r => r.status === 'open');
    return {
      all: openRequirements.length,
      recommended: openRequirements.filter(r => r.mockIsRecommended).length,
      applied: openRequirements.filter(r => r.mockIsAppliedByCurrentUser).length,
      shortlisted: openRequirements.filter(r => r.mockIsShortlistedByCurrentUser).length,
    };
  }, []);

  const filterCategoriesForDropdown = [
    { label: "All Enquiries", value: 'all' as const, icon: ListChecks, count: categoryCounts.all },
    { label: "Recommended", value: 'recommended' as const, icon: Star, count: categoryCounts.recommended },
    { label: "Applied", value: 'applied' as const, icon: CheckCircle, count: categoryCounts.applied },
    { label: "Shortlisted", value: 'shortlisted' as const, icon: Bookmark, count: categoryCounts.shortlisted },
  ];

  const selectedCategoryLabel = useMemo(() => {
    return filterCategoriesForDropdown.find(cat => cat.value === activeFilterCategory)?.label || "Recommended";
  }, [activeFilterCategory, filterCategoriesForDropdown]);


  const filteredRequirements = useMemo(() => {
    let filtered = requirements.filter((req) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = searchTerm === "" ||
        (Array.isArray(req.subject) ? req.subject.some(s => s.toLowerCase().includes(searchTermLower)) : req.subject.toLowerCase().includes(searchTermLower)) ||
        req.gradeLevel.toLowerCase().includes(searchTermLower) ||
        (req.parentName && req.parentName.toLowerCase().includes(searchTermLower)) ||
        (req.location && req.location.toLowerCase().includes(searchTermLower)) ||
        (req.additionalNotes && req.additionalNotes.toLowerCase().includes(searchTermLower));

      return matchesSearchTerm;
    });

    if (activeFilterCategory === 'recommended') {
      return filtered.filter(req => req.mockIsRecommended);
    }
    if (activeFilterCategory === 'applied') {
      return filtered.filter(req => req.mockIsAppliedByCurrentUser);
    }
    if (activeFilterCategory === 'shortlisted') {
      return filtered.filter(req => req.mockIsShortlistedByCurrentUser);
    }
    // 'all' category or default shows all search-matched open requirements
    return filtered;
  }, [searchTerm, requirements, activeFilterCategory]);


  const renderEnquiryList = (requirementsToRender: TuitionRequirement[]) => {
    if (requirementsToRender.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {requirementsToRender.map((req, index) => (
            <div
              key={req.id}
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out h-full"
              style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
            >
              <TuitionRequirementCard requirement={req} showActions={false} isParentContext={false} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <Card className="text-center py-12 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out">
        <CardContent className="flex flex-col items-center">
          <LucideFilterIcon className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Enquiries Found</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            There are no tuition enquiries matching your current filters.
          </p>
           <Button onClick={() => { setSearchTerm(""); setActiveFilterCategory('recommended'); }} variant="outline" className="mt-6 text-sm py-2 px-5">
            <XIcon className="w-3.5 h-3.5 mr-1.5" />
            Clear Search & Filters
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
     <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <Card className="bg-card rounded-none shadow-lg p-6 md:p-8 mb-6 md:mb-8 border-0">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-semibold text-primary flex items-center break-words">
                <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2"/>
                Search & Filter Enquiries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex items-center gap-3 w-full sm:flex-grow sm:max-w-lg"> 
                  <div className="relative flex-1 min-w-0">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by subject, grade, keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg w-full h-11"
                    />
                  </div>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-11 w-11 shrink-0 flex items-center justify-center sm:w-auto sm:px-4" 
                    onClick={() => console.log("Main Filter button clicked - placeholder for advanced filters")}
                  >
                    <LucideFilterIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline sm:ml-1.5">Filter</span>
                  </Button>
                </div>

                <div className="w-full sm:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="default" // Changed to default
                        className="w-full sm:w-auto text-xs sm:text-sm py-2 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-11"
                      >
                        <span className="text-primary-foreground"> {/* Ensure text is visible on primary background */}
                          {selectedCategoryLabel} (
                          {filterCategoriesForDropdown.find(
                              (cat) => cat.value === activeFilterCategory
                          )?.count || 0}
                          )
                        </span>
                        <ChevronDown className="w-4 h-4 opacity-70 text-primary-foreground" /> {/* Ensure icon is visible */}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[220px]">
                      <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {filterCategoriesForDropdown.map((category) => (
                        <DropdownMenuItem
                          key={category.value}
                          onClick={() => setActiveFilterCategory(category.value)}
                          className={cn(
                            "text-sm", 
                            activeFilterCategory === category.value && "bg-primary text-primary-foreground"
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

          {/* Enquiry List */}
          <div className="mt-6">
            {renderEnquiryList(filteredRequirements)}
          </div>
        </div>
      </main>
  );
}

