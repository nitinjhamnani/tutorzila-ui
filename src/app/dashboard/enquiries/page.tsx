
"use client";

import { useState, useMemo, useEffect } from "react";
import type { TuitionRequirement } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TuitionRequirementCard } from "@/components/tuitions/TuitionRequirementCard";
import { SearchIcon, XIcon, ListChecks, CheckSquare, Star, Inbox, FilterIcon as LucideFilterIcon } from "lucide-react"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock data - replace with API call in a real app
const MOCK_REQUIREMENTS: TuitionRequirement[] = [
  { id: "1", parentId: "p1", parentName: "Alice Smith", subject: ["Mathematics"], gradeLevel: "Grade 9-10", scheduleDetails: "Mon, Wed, Fri 5-7 PM", preferredDays: ["Mon", "Wed", "Fri"], preferredTimeSlots: ["5-7 PM"], location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 2).toISOString(), additionalNotes: "Needs help with algebra and geometry.", board: "CBSE", teachingMode: ["Online"], applicantsCount: 5 },
  { id: "2", parentId: "p2", parentName: "Bob Johnson", subject: ["Physics"], gradeLevel: "Grade 11-12", scheduleDetails: "Weekends, 4 hours total", preferredDays: ["Weekends"], preferredTimeSlots: ["4 hours total"], location: "Student's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 5).toISOString(), board: "ICSE", teachingMode: ["Offline (In-person)"], applicantsCount: 3 },
  { id: "3", parentId: "p3", parentName: "Carol Williams", subject: ["English"], gradeLevel: "Grade 6-8", scheduleDetails: "Tues, Thurs 4-6 PM", preferredDays: ["Tues", "Thurs"], preferredTimeSlots: ["4-6 PM"], location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 1).toISOString(), additionalNotes: "Focus on grammar and essay writing.", board: "State Board", teachingMode: ["Online"], applicantsCount: 8 },
  { id: "4", parentId: "p4", parentName: "David Brown", subject: ["Computer Science"], gradeLevel: "College Level", scheduleDetails: "Flexible, project-based", preferredDays: ["Flexible"], preferredTimeSlots: ["Project-based"], location: "Online", status: "open", postedAt: new Date().toISOString(), board: "IB", teachingMode: ["Online", "Offline (In-person)"], applicantsCount: 2 },
  { id: "5", parentId: "p5", parentName: "Eve Davis", subject: ["Mathematics", "Science"], gradeLevel: "Grade 1-5", scheduleDetails: "Sat 10 AM - 12 PM", preferredDays: ["Saturday"], preferredTimeSlots: ["10 AM - 12 PM"], location: "Tutor's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 3).toISOString(), board: "IGCSE", teachingMode: ["Offline (In-person)"], applicantsCount: 12 },
  { id: "6", parentId: "p6", parentName: "Frank Green", subject: ["Chemistry"], gradeLevel: "Grade 9-10", scheduleDetails: "Mon 7-9 PM", preferredDays: ["Monday"], preferredTimeSlots: ["7-9 PM"], location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 1).toISOString(), board: "CBSE", teachingMode: ["Online"], applicantsCount: 0 },
  { id: "7", parentId: "p7", parentName: "Grace Hall", subject: ["Biology"], gradeLevel: "Grade 11-12", scheduleDetails: "Flexible Evening Hours", preferredDays: ["Flexible Evenings"], preferredTimeSlots: ["Evening Hours"], location: "Student's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 6).toISOString(), additionalNotes: "Looking for an experienced biology tutor for IB curriculum.", board: "IB", teachingMode: ["Offline (In-person)"], applicantsCount: 7 },
];

export default function AllEnquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [requirements, setRequirements] = useState<TuitionRequirement[]>([]);
  const [activeTab, setActiveTab] = useState("recommended");

  useEffect(() => {
    setRequirements(MOCK_REQUIREMENTS.filter(r => r.status === 'open'));
  }, []);

  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = searchTerm === "" || 
        (Array.isArray(req.subject) ? req.subject.some(s => s.toLowerCase().includes(searchTermLower)) : req.subject.toLowerCase().includes(searchTermLower)) ||
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
    applied: 0, 
    received: 0,
    shortlisted: 0,
  };

  const renderEnquiryList = (enquiries: TuitionRequirement[]) => {
    if (enquiries.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {enquiries.map((req, index) => (
            <div 
              key={req.id}
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
              style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
            >
              <TuitionRequirementCard requirement={req} isParentContext={false} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <Card className="text-center py-12 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out">
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
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8"> 
      <Card className="mb-6 animate-in fade-in duration-500 ease-out shadow-md rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <SearchIcon className="w-5 h-5 mr-2.5"/>
            Search & Filter Enquiries
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Find relevant tuition opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-grow w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by subject, grade, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 text-sm bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg"
              />
          </div>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto text-sm shadow-sm hover:shadow-md rounded-lg flex items-center gap-1.5"
            onClick={() => console.log("Filter button clicked")} // Placeholder action
          >
            <LucideFilterIcon className="w-4 h-4"/>
            Filter
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6 min-w-0"> 
           <Tabs defaultValue="recommended" className="w-full" onValueChange={setActiveTab}>
             <ScrollArea className="w-full whitespace-nowrap pb-2">
              <TabsList className="inline-flex gap-1.5 sm:gap-2 bg-card border rounded-lg p-1 shadow-sm">
                <TabsTrigger value="recommended" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                  <Star className="w-3.5 h-3.5"/> Recommended ({tabCounts.recommended})
                </TabsTrigger>
                <TabsTrigger value="applied" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80 transition-all text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5"/> Applied ({tabCounts.applied})
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

            <TabsContent value="recommended" className="mt-6">
              {renderEnquiryList(filteredRequirements)}
            </TabsContent>
            <TabsContent value="applied" className="mt-6">
              {renderEnquiryList([])} 
            </TabsContent>
            <TabsContent value="received" className="mt-6">
              {renderEnquiryList([])}
            </TabsContent>
            <TabsContent value="shortlisted" className="mt-6">
              {renderEnquiryList([])}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
