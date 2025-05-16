
"use client";

import { useState, useMemo, useEffect } from "react";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, ListFilter, PlusCircle, CalendarDays, Users, Star as StarIcon, MessageSquareQuote, Edit3, XCircle, Video, MessageSquareText } from "lucide-react";
import type { DemoSession } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format }
from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface ParentDemoSessionCardProps {
  demo: DemoSession;
  // Add any necessary action handlers as props
  onReschedule: (demoId: string) => void;
  onCancel: (demoId: string) => void;
  onEditRequest: (demoId: string) => void;
  onWithdrawRequest: (demoId: string) => void;
  onGiveFeedback: (demoId: string) => void;
}

function ParentDemoSessionCard({ demo, onReschedule, onCancel, onEditRequest, onWithdrawRequest, onGiveFeedback }: ParentDemoSessionCardProps) {
  const demoDate = new Date(demo.date);

  const getStatusBadgeVariant = () => {
    switch (demo.status) {
      case "Scheduled": return "bg-blue-100 text-blue-700 border-blue-500/50";
      case "Requested": return "bg-yellow-100 text-yellow-700 border-yellow-500/50";
      case "Completed": return "bg-green-100 text-green-700 border-green-500/50";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-500/50";
      default: return "outline";
    }
  };

  const StatusIcon = () => {
    switch (demo.status) {
      case "Scheduled": return <Clock className="mr-1.5 h-3 w-3" />;
      case "Requested": return <MessageSquareQuote className="mr-1.5 h-3 w-3" />;
      case "Completed": return <CheckCircle className="mr-1.5 h-3 w-3" />;
      case "Cancelled": return <XCircle className="mr-1.5 h-3 w-3" />;
      default: return <Info className="mr-1.5 h-3 w-3" />;
    }
  };

  return (
    <Card className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-0.5">
      <CardHeader className="p-4 pb-3 bg-muted/20 border-b">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
             <Avatar className="h-10 w-10 shrink-0 rounded-full shadow-sm border">
              <AvatarImage src={`https://picsum.photos/seed/${demo.tutorAvatarSeed || demo.tutorName}/128`} alt={demo.tutorName} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {demo.tutorName?.split(" ").map(n => n[0]).join("").toUpperCase() || "T"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <CardTitle className="text-sm font-semibold text-foreground truncate" title={demo.subject}>
                Demo: {demo.subject}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground mt-0.5 truncate">
                With {demo.tutorName || "Tutor"} for {demo.studentName}
              </CardDescription>
            </div>
          </div>
           <Badge variant="outline" className={cn("text-[10px] py-0.5 px-2 border font-medium whitespace-nowrap rounded-full", getStatusBadgeVariant())}>
            <StatusIcon />
            {demo.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-xs flex-grow">
        <InfoItem icon={CalendarDays} label="Date" value={format(demoDate, "MMM d, yyyy")} />
        <InfoItem icon={Clock} label="Time" value={demo.time} />
        {demo.mode && <InfoItem icon={demo.mode === "Online" ? Video : Users} label="Mode" value={demo.mode} />}
        <InfoItem icon={ListFilter} label="Grade" value={demo.gradeLevel} />
        <InfoItem icon={ListFilter} label="Board" value={demo.board} />
      </CardContent>
      <CardFooter className="p-3 border-t bg-card/50 flex flex-wrap justify-end items-center gap-2">
        {demo.status === "Scheduled" && (
          <>
            {demo.joinLink && (
              <Button asChild size="xs" className="text-[11px] py-1 px-2 h-auto">
                <Link href={demo.joinLink} target="_blank" rel="noopener noreferrer">
                  <Video className="w-3 h-3 mr-1" /> Join Now
                </Link>
              </Button>
            )}
            <Button size="xs" variant="outline" className="text-[11px] py-1 px-2 h-auto" onClick={() => onReschedule(demo.id)}>
              <Edit3 className="w-3 h-3 mr-1" /> Reschedule
            </Button>
            <Button size="xs" variant="destructiveOutline" className="text-[11px] py-1 px-2 h-auto" onClick={() => onCancel(demo.id)}>
              <XCircle className="w-3 h-3 mr-1" /> Cancel
            </Button>
          </>
        )}
        {demo.status === "Requested" && (
          <>
            <Button size="xs" variant="outline" className="text-[11px] py-1 px-2 h-auto" onClick={() => onEditRequest(demo.id)}>
              <Edit3 className="w-3 h-3 mr-1" /> Edit Request
            </Button>
            <Button size="xs" variant="destructiveOutline" className="text-[11px] py-1 px-2 h-auto" onClick={() => onWithdrawRequest(demo.id)}>
              <XCircle className="w-3 h-3 mr-1" /> Withdraw
            </Button>
          </>
        )}
        {demo.status === "Completed" && !demo.feedbackSubmitted && (
          <Button size="xs" variant="outline" className="text-[11px] py-1 px-2 h-auto" onClick={() => onGiveFeedback(demo.id)}>
            <MessageSquareText className="w-3 h-3 mr-1" /> Give Feedback
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center text-xs">
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0" />
      <strong className="text-foreground/80 font-medium">{label}:</strong>&nbsp;
      <span className="text-muted-foreground truncate">{value}</span>
    </div>
  );
}

const CheckCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const Info: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);


export default function MyDemosPage() {
  const [allDemos, setAllDemos] = useState<DemoSession[]>(MOCK_DEMO_SESSIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const summaryStats = useMemo(() => {
    const upcoming = allDemos.filter(d => d.status === "Scheduled" && new Date(d.date) >= new Date()).length;
    const requested = allDemos.filter(d => d.status === "Requested").length;
    const completed = allDemos.filter(d => d.status === "Completed").length;
    return [
      { title: "Upcoming Demos", value: upcoming, icon: CalendarDays },
      { title: "Pending Requests", value: requested, icon: MessageSquareQuote },
      { title: "Completed Demos", value: completed, icon: CheckCircle },
    ];
  }, [allDemos]);

  const filteredDemos = useMemo(() => {
    return allDemos.filter(demo => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" ||
        demo.subject.toLowerCase().includes(searchLower) ||
        (demo.tutorName && demo.tutorName.toLowerCase().includes(searchLower)) ||
        demo.studentName.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === "All" || demo.status === statusFilter;
      // Add subject filter if needed

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, allDemos]);

  const scheduledDemos = useMemo(() => filteredDemos.filter(d => d.status === "Scheduled"), [filteredDemos]);
  const requestedDemos = useMemo(() => filteredDemos.filter(d => d.status === "Requested"), [filteredDemos]);
  const pastDemos = useMemo(() => filteredDemos.filter(d => d.status === "Completed" || d.status === "Cancelled"), [filteredDemos]);

  const mockActionHandler = (action: string, demoId: string) => {
    console.log(`${action} clicked for demo ID: ${demoId}`);
    // Add toast or further mock logic here
  };

  const renderDemoList = (demos: DemoSession[], tabName: string) => {
    if (demos.length === 0) {
      return (
        <div className="text-center py-16 bg-card border rounded-lg shadow-sm">
          <MessageSquareQuote className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <p className="text-md font-semibold text-foreground/70 mb-2">No {tabName.toLowerCase()} found.</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
            There are no demos in this category.
          </p>
          <Button asChild variant="default" size="sm">
            <Link href="/search-tuitions">
              <PlusCircle className="mr-2 h-4 w-4" /> Request a Demo Class
            </Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {demos.map(demo => (
          <ParentDemoSessionCard 
            key={demo.id} 
            demo={demo} 
            onReschedule={(id) => mockActionHandler("Reschedule", id)}
            onCancel={(id) => mockActionHandler("Cancel", id)}
            onEditRequest={(id) => mockActionHandler("Edit Request", id)}
            onWithdrawRequest={(id) => mockActionHandler("Withdraw Request", id)}
            onGiveFeedback={(id) => mockActionHandler("Give Feedback", id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-8">
      <BreadcrumbHeader segments={[
        { label: "Dashboard", href: "/dashboard/parent" },
        { label: "My Demos" }
      ]} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryStats.map(stat => (
            <Card key={stat.title} className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground uppercase">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-primary/70" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                </CardContent>
            </Card>
        ))}
      </div>
      
      <Card className="bg-card border rounded-lg shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-primary flex items-center">
            <ListFilter className="w-5 h-5 mr-2" /> Filter Demos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by subject, tutor, student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Placeholder for Subject Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Subject</Label>
              <Input disabled placeholder="Subject Filter (Coming Soon)" className="text-xs h-9" />
            </div>
            {/* Placeholder for Tutor Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Tutor</Label>
              <Input disabled placeholder="Tutor Filter (Coming Soon)" className="text-xs h-9" />
            </div>
            {/* Status Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-input border-border focus:border-primary text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["All", "Scheduled", "Requested", "Completed", "Cancelled"].map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-1 bg-muted/50 p-1 rounded-lg shadow-sm mb-6">
          <TabsTrigger value="scheduled">Scheduled ({scheduledDemos.length})</TabsTrigger>
          <TabsTrigger value="requested">Requested ({requestedDemos.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastDemos.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="scheduled">{renderDemoList(scheduledDemos, "Scheduled Demos")}</TabsContent>
        <TabsContent value="requested">{renderDemoList(requestedDemos, "Demo Requests")}</TabsContent>
        <TabsContent value="past">{renderDemoList(pastDemos, "Past Demos")}</TabsContent>
      </Tabs>

      <Card className="bg-card border rounded-lg shadow-sm mt-6">
        <CardHeader>
            <CardTitle className="text-sm font-semibold text-primary flex items-center">
                <Info className="w-4 h-4 mr-2" /> Important Notes
            </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>&bull; Demo session links are typically shared by tutors via direct communication closer to the scheduled time.</p>
            <p>&bull; Please ensure you confirm rescheduling or cancellations at least 2-4 hours in advance.</p>
            <p>&bull; Feedback for completed demos helps us and the tutors improve!</p>
        </CardContent>
      </Card>
    </div>
  );
}
