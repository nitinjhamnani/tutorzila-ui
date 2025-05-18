
"use client";

import { useState, useMemo, useEffect } from "react";
import type { TuitionRequirement } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TuitionRequirementCard } from "@/components/tuitions/TuitionRequirementCard";
import { SearchIcon, XIcon, Star, CheckCircle, FilterIcon as LucideFilterIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";

export default function AllEnquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [requirements, setRequirements] = useState<TuitionRequirement[]>([]);
  const [activeTab, setActiveTab] = useState("recommended");

  useEffect(() => {
    // Simulate fetching all open requirements for tutors
    setRequirements(MOCK_ALL_PARENT_REQUIREMENTS.filter(r => r.status === 'open'));
  }, []);

  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = searchTerm === "" || 
        (Array.isArray(req.subject) ? req.subject.some(s => s.toLowerCase().includes(searchTermLower)) : req.subject.toLowerCase().includes(searchTermLower)) ||
        req.gradeLevel.toLowerCase().includes(searchTermLower) ||
        (req.parentName && req.parentName.toLowerCase().includes(searchTermLower)) ||
        (req.location && req.location.toLowerCase().includes(searchTermLower)) ||
        (req.additionalNotes && req.additionalNotes.toLowerCase().includes(searchTermLower));
      
      // Add tab-specific filtering logic here if needed, for now, search applies to all tabs
      return matchesSearchTerm;
    });
  }, [searchTerm, requirements, activeTab]);

  // Mock counts for tabs - in a real app, these would come from backend or filtered data
  const tabCounts = useMemo(() => ({
    recommended: filteredRequirements.length, // Example: all open for now
    applied: 0, // Placeholder
    received: 0, // Placeholder
    shortlisted: 0, // Placeholder
  }), [filteredRequirements]);


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
            There are no tuition enquiries matching your current search and filters.
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-primary flex items-center break-words">
              <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2"/>
              Search & Filter Enquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:flex-1 min-w-0">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by subject, grade, keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg w-full"
                    />
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full sm:w-auto text-sm py-2.5 px-5 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center gap-1.5"
                  onClick={() => console.log("Filter button clicked")}
                >
                  <LucideFilterIcon className="w-4 h-4 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="recommended" className="w-full" onValueChange={setActiveTab}>
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <TabsList className="inline-flex gap-1.5 sm:gap-2 bg-card border rounded-lg p-1 shadow-sm">
                  <TabsTrigger value="recommended" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                    <Star className="w-3.5 h-3.5"/> Recommended ({tabCounts.recommended})
                  </TabsTrigger>
                  <TabsTrigger value="applied" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5"/> Applied ({tabCounts.applied})
                  </TabsTrigger>
                  <TabsTrigger value="received" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                    <LucideFilterIcon className="w-3.5 h-3.5"/> Received ({tabCounts.received})
                  </TabsTrigger>
                  <TabsTrigger value="shortlisted" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5"/> Shortlisted ({tabCounts.shortlisted})
                  </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" className="h-2 mt-1" />
            </ScrollArea>

            <TabsContent value="recommended" className="mt-6">
              {renderEnquiryList(filteredRequirements)}
            </TabsContent>
            <TabsContent value="applied" className="mt-6">
              {/* Replace with actual applied enquiries data */}
              {renderEnquiryList([])} 
            </TabsContent>
            <TabsContent value="received" className="mt-6">
              {/* Replace with actual received enquiries data */}
              {renderEnquiryList([])}
            </TabsContent>
            <TabsContent value="shortlisted" className="mt-6">
              {/* Replace with actual shortlisted enquiries data */}
              {renderEnquiryList([])}
            </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
