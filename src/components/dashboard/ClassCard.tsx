
"use client";

import type { MyClass } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, User, RadioTower, CalendarDays, Clock, Video, Edit2, MessageSquareText, XOctagon, Info, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ClassCardProps {
  classData: MyClass;
}

export function ClassCard({ classData }: ClassCardProps) {
  const { subject, tutorName, tutorAvatarSeed, studentName, mode, schedule, status, nextSession } = classData;

  const getStatusBadgeVariant = () => {
    switch (status) {
      case "Ongoing": return "bg-green-100 text-green-700 border-green-500/50";
      case "Upcoming": return "bg-blue-100 text-blue-700 border-blue-500/50";
      case "Past": return "bg-gray-100 text-gray-700 border-gray-400/50";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-500/50";
      default: return "outline";
    }
  };

  const StatusIcon = () => {
    switch (status) {
      case "Ongoing": return <Clock className="mr-1.5 h-3 w-3" />;
      case "Upcoming": return <CalendarDays className="mr-1.5 h-3 w-3" />;
      case "Past": return <CheckCircle className="mr-1.5 h-3 w-3" />; // Assuming CheckCircle is available
      case "Cancelled": return <XOctagon className="mr-1.5 h-3 w-3" />;
      default: return <Info className="mr-1.5 h-3 w-3" />;
    }
  };

  return (
    <Card className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-0.5">
      <CardHeader className="p-4 pb-3 bg-muted/20 border-b">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 shrink-0 rounded-full shadow-sm border">
              <AvatarImage src={`https://picsum.photos/seed/${tutorAvatarSeed}/128`} alt={tutorName} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {tutorName.split(" ").map(n => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <CardTitle className="text-sm font-semibold text-foreground truncate" title={subject}>
                {subject}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground mt-0.5 truncate">
                With {tutorName} for {studentName}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-[10px] py-0.5 px-2 border font-medium whitespace-nowrap rounded-full", getStatusBadgeVariant())}>
            <StatusIcon />
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-xs flex-grow">
        <InfoItem icon={RadioTower} label="Mode" value={mode} />
        <InfoItem icon={CalendarDays} label="Days" value={schedule.days.join(', ')} />
        <InfoItem icon={Clock} label="Time" value={schedule.time} />
        {nextSession && (status === "Ongoing" || status === "Upcoming") && (
          <InfoItem icon={CalendarClock} label="Next Session" value={format(new Date(nextSession), "MMM d, yyyy 'at' p")} />
        )}
         {status === "Past" && classData.endDate && (
            <InfoItem icon={CalendarClock} label="Completed On" value={format(new Date(classData.endDate), "MMM d, yyyy")} />
        )}
      </CardContent>
      <CardFooter className="p-3 border-t bg-card/50 flex justify-end items-center gap-2">
        {status === "Ongoing" && (
          <Button size="xs" variant="outline" className="text-[11px] py-1 px-2 h-auto">
            <Video className="w-3 h-3 mr-1" /> Join Class
          </Button>
        )}
        {status === "Upcoming" && (
          <Button size="xs" variant="outline" className="text-[11px] py-1 px-2 h-auto">
            <Edit2 className="w-3 h-3 mr-1" /> Reschedule
          </Button>
        )}
         {(status === "Ongoing" || status === "Upcoming") && (
          <Button size="xs" variant="destructiveOutline" className="text-[11px] py-1 px-2 h-auto">
            <XOctagon className="w-3 h-3 mr-1" /> Cancel
          </Button>
        )}
        {status === "Past" && (
          <Button size="xs" variant="outline" className="text-[11px] py-1 px-2 h-auto">
            <MessageSquareText className="w-3 h-3 mr-1" /> Give Feedback
          </Button>
        )}
        <Button size="xs" variant="ghost" className="text-[11px] py-1 px-2 h-auto text-primary hover:text-primary/80">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  className?: string;
}

function InfoItem({ icon: Icon, label, value, className }: InfoItemProps) {
  return (
    <div className={cn("flex items-center text-xs", className)}>
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0 mt-[1px]" />
      <strong className="text-foreground/80 font-medium">{label}:</strong>&nbsp;
      <span className="text-muted-foreground break-words">{value}</span>
    </div>
  );
}

// Helper component for CheckCircle if not available from lucide-react directly
const CheckCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// Helper for CalendarClock if not available
const CalendarClock: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/>
    <circle cx="18" cy="18" r="4"/><path d="M18 16.5v1.5l.5.5"/>
  </svg>
);
