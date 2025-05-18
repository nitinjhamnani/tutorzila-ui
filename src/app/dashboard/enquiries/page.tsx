
"use client";

import { useState, useMemo, useEffect } from "react";
import type { TuitionRequirement } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TuitionRequirementCard } from "@/components/tuitions/TuitionRequirementCard";
import { SearchIcon, XIcon, ListChecks, FilterIcon as LucideFilterIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";

export default function AllEnquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [requirements, setRequirements] = useState<TuitionRequirement[]>([]);
  const [activeTab, setActiveTab] = useState("recommended");

  useEffect(() => {
    setRequirements(MOCK_ALL_PARENT_REQUIREMENTS.filter(r => r.status === 'open'));
  }, []);

  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = searchTerm === "" ||
        (Array.isArray(req.subject) ? req.subject.some(s => s.toLowerCase().includes(searchTermLower)) : String(req.subject).toLowerCase().includes(searchTermLower)) ||
        req.gradeLevel.toLowerCase().includes(searchTermLower) ||
        (req.parentName && req.parentName.toLowerCase().includes(searchTermLower)) ||
        (req.location && req.location.toLowerCase().includes(searchTermLower)) ||
        (req.board && req.board.toLowerCase().includes(searchTermLower)) ||
        (req.teachingMode && req.teachingMode.some(tm => tm.toLowerCase().includes(searchTermLower))) ||
        (req.additionalNotes && req.additionalNotes.toLowerCase().includes(searchTermLower));

      return matchesSearchTerm;
    });
  }, [searchTerm, requirements]);

  const tabCounts = {
    recommended: filteredRequirements.length,
    applied: 0, // Placeholder
    received: 0, // Placeholder
    shortlisted: 0, // Placeholder
  };

  const renderEnquiryList = (enquiriesToRender: TuitionRequirement[]) => {
    if (enquiriesToRender.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {enquiriesToRender.map((req, index) => (
            <div
              key={req.id}
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out h-full w-full"
              style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
            >
              <TuitionRequirementCard requirement={req} isParentContext={false} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <Card className="text-center py-12 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out overflow-hidden">
        <CardContent className="flex flex-col items-center">
          <ListChecks className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Enquiries Here Yet</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            There are no enquiries in this category. Try other filters or check back later.
          </p>
           <Button onClick={() => setSearchTerm("")} variant="outline" className="mt-6 text-sm py-2 px-5">
            <XIcon className="w-3.5 h-3.5 mr-1.5" />
            Clear Search
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 w-full">
        <Card className="bg-card border rounded-lg shadow-sm mb-4 p-3 sm:p-4">
          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-base sm:text-lg font-semibold text-primary flex items-center break-words">
              <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2"/>
              Search & Filter Enquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <div className="relative w-full sm:flex-1 min-w-0">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Search by subject, grade, keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-xs sm:text-sm bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-md w-full"
                    />
                </div>
                <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto border-border hover:border-primary hover:bg-primary/10 hover:text-primary transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-md flex items-center gap-1.5 text-xs sm:text-sm py-2 px-3 sm:px-4"
                onClick={() => console.log("Filter button clicked")}
                >
                <LucideFilterIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Filter
                </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 sm:space-y-6 min-w-0">
             <Tabs defaultValue="recommended" className="w-full" onValueChange={setActiveTab}>
               <ScrollArea className="w-full whitespace-nowrap pb-2">
                <TabsList className="inline-flex gap-1.5 sm:gap-2 bg-card border rounded-lg p-1 shadow-sm">
                  <TabsTrigger value="recommended" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                    <StarIcon className="w-3.5 h-3.5"/> Recommended ({tabCounts.recommended})
                  </TabsTrigger>
                  <TabsTrigger value="applied" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5"/> Applied ({tabCounts.applied})
                  </TabsTrigger>
                  <TabsTrigger value="received" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                     <Inbox className="w-3.5 h-3.5"/> Received ({tabCounts.received})
                  </TabsTrigger>
                  <TabsTrigger value="shortlisted" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5"/> Shortlisted ({tabCounts.shortlisted})
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" className="h-2 mt-1" />
              </ScrollArea>

              <TabsContent value="recommended" className="mt-4 sm:mt-6">
                {renderEnquiryList(filteredRequirements)}
              </TabsContent>
              <TabsContent value="applied" className="mt-4 sm:mt-6">
                {renderEnquiryList([])}
              </TabsContent>
              <TabsContent value="received" className="mt-4 sm:mt-6">
                {renderEnquiryList([])}
              </TabsContent>
              <TabsContent value="shortlisted" className="mt-4 sm:mt-6">
                {renderEnquiryList([])}
              </TabsContent>
            </Tabs>
          </div>
        </div>
    </main>
  );
}
