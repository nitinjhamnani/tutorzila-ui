
"use client";

import { useState, useMemo, useEffect } from "react";
import type { TuitionRequirement } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// TuitionRequirementCard import removed as it's not rendered for now
import { SearchIcon, XIcon, ListChecks, FilterIcon as LucideFilterIcon, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// Tabs imports removed
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";

export default function AllEnquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [requirements, setRequirements] = useState<TuitionRequirement[]>([]);
  // activeTab state removed

  useEffect(() => {
    setRequirements(MOCK_ALL_PARENT_REQUIREMENTS.filter(r => r.status === 'open'));
  }, []);

  // filteredRequirements memo removed as it's not used for now
  // tabCounts object removed

  // renderEnquiryList function removed

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
           {/* Tabs and enquiry list removed for debugging */}
           <div className="text-center py-12 bg-card border rounded-lg shadow-sm">
             <ListChecks className="w-16 h-16 text-primary/30 mx-auto mb-5" />
             <p className="text-xl font-semibold text-foreground/70 mb-1.5">Enquiry list temporarily removed for debugging.</p>
           </div>
        </div>
      </div>
    </main>
  );
}
