
"use client";

import type { DemoSession, MyClass } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ClockIcon, User, Video, CheckCircle, XCircle, AlertTriangle, BookOpen, GraduationCap, ShieldCheck, Settings, MessageSquareQuote, Edit3, Info, ListFilter, Users as UsersIcon, CalendarDays, CalendarIcon, LinkIcon, Save, Ban } from "lucide-react";
import { format, isToday, addMinutes, parse } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ManageDemoModal } from "@/components/modals/ManageDemoModal";

export interface UpcomingSessionCardProps {
  sessionDetails: { type: 'demo', data: DemoSession } | { type: 'class', data: MyClass };
  onUpdateSession?: (updatedDemo: DemoSession) => void;
  onCancelSession?: (sessionId: string) => void;
}

const getInitials = (name?: string): string => {
  if (!name) return "N/A";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
};

export function UpcomingSessionCard({ sessionDetails, onUpdateSession, onCancelSession }: UpcomingSessionCardProps) {
  const { type, data } = sessionDetails;
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const sessionDate = new Date(type === 'demo' ? data.date : (data.status === 'Upcoming' && (data as MyClass).startDate ? (data as MyClass).startDate! : (data as MyClass).nextSession || (data as MyClass).startDate || Date.now()));
  
  let title = Array.isArray(data.subject) ? data.subject.join(', ') : data.subject;
  const studentName = type === 'demo' ? (data as DemoSession).studentName : (data as MyClass).studentName;
  const tutorName = type === 'demo' ? (data as DemoSession).tutorName : (data as MyClass).tutorName;
  const tutorAvatarSeed = type === 'demo' ? (data as DemoSession).tutorAvatarSeed : (data as MyClass).tutorAvatarSeed;
  const mode = data.mode;
  const status = data.status;

  const getStatusBadgeClasses = () => {
    switch (status) {
      case "Scheduled": 
      case "Ongoing":   
      case "Upcoming":  
        return "bg-blue-100 text-blue-700 border-blue-500/50";
      case "Completed": 
      case "Past":      
        return "bg-green-100 text-green-700 border-green-500/50";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-500/50";
      case "Requested": 
        return "bg-yellow-100 text-yellow-700 border-yellow-500/50";
      default:
        return "bg-gray-100 text-gray-700 border-gray-500/50";
    }
  };

  const StatusIcon = () => {
    switch (status) {
      case "Scheduled": case "Ongoing": case "Upcoming": return <ClockIcon className="mr-1.5 h-3 w-3" />;
      case "Completed": case "Past": return <CheckCircle className="mr-1.5 h-3 w-3" />;
      case "Cancelled": return <XCircle className="mr-1.5 h-3 w-3" />;
      case "Requested": return <MessageSquareQuote className="mr-1.5 h-3 w-3" />;
      default: return <Info className="mr-1.5 h-3 w-3" />;
    }
  };

  const isDemo = type === 'demo';

  return (
    <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
      <Card className={cn(
        "w-full flex flex-col overflow-hidden h-full",
        isDemo 
          ? "bg-card border border-border/50 rounded-lg shadow-md" 
          : "bg-card border-0 rounded-none shadow-lg p-4 transform hover:-translate-y-0.5" 
      )}>
        <CardHeader className={cn(
          "pb-3 border-b",
          isDemo ? "bg-muted/30 p-3 sm:p-4 border-border/50" : "p-0 bg-card border-border/30"
        )}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Badge variant="outline" className={cn(
                "text-[10px] py-0.5 px-2 border font-medium whitespace-nowrap rounded-full", 
                isDemo ? "bg-purple-100 text-purple-700 border-purple-500/50" : "bg-teal-100 text-teal-700 border-teal-500/50"
              )}>
                {isDemo ? "Demo" : "Class"}
              </Badge>
              <div className="flex-grow min-w-0">
                <CardTitle className={cn(
                  "font-semibold group-hover:text-primary/90 transition-colors line-clamp-1",
                  isDemo ? "text-base text-primary" : "text-xs sm:text-sm text-primary"
                  )} title={title}>
                  {title}
                </CardTitle>
                <CardDescription className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 flex items-center">
                  <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 text-muted-foreground/80" />
                  Student: {studentName}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn("text-[10px] py-0.5 px-2 border font-medium whitespace-nowrap rounded-full", getStatusBadgeClasses())}
            >
              <StatusIcon />
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className={cn(
          "text-xs flex-grow",
          isDemo ? "p-3 sm:p-4 space-y-2" : "p-0 pt-3 space-y-1.5"
          )}>
          {mode && <InfoItem icon={mode === "Online" ? Video : UsersIcon} label="Mode" value={mode} />}
          {isDemo && (
            <>
              <InfoItem icon={GraduationCap} label="Grade" value={(data as DemoSession).gradeLevel} />
              <InfoItem icon={ShieldCheck} label="Board" value={(data as DemoSession).board} />
              <InfoItem icon={CalendarDays} label="Date" value={format(sessionDate, "MMM d, yyyy")} />
              <InfoItem icon={ClockIcon} label="Time" value={`${(data as DemoSession).startTime} - ${(data as DemoSession).endTime}`} />
            </>
          )}
          {!isDemo && (
            <>
              <InfoItem icon={CalendarDays} label="Schedule" value={(data as MyClass).schedule.days.join(', ')} />
              <InfoItem icon={ClockIcon} label="Time" value={(data as MyClass).schedule.time} />
              {(data as MyClass).status === "Upcoming" && (data as MyClass).startDate && <InfoItem icon={CalendarIcon} label="Starts" value={format(new Date((data as MyClass).startDate!), "MMM d, yyyy")} />}
              {(data as MyClass).status === "Ongoing" && (data as MyClass).nextSession && <InfoItem icon={CalendarIcon} label="Next On" value={format(new Date((data as MyClass).nextSession!), "MMM d, yyyy 'at' p")} />}
            </>
          )}
        </CardContent>
        <CardFooter className={cn(
          "border-t flex justify-end items-center gap-2",
          isDemo ? "bg-muted/30 p-3 sm:p-4 border-border/50" : "p-0 pt-3 border-border/30 bg-card/50 group-hover:bg-muted/20 transition-colors duration-300"
          )}>
          {(isDemo && (data as DemoSession).joinLink && (data as DemoSession).status === "Scheduled") || (!isDemo && (data as MyClass).mode === "Online" && ((data as MyClass).status === "Ongoing" || (data as MyClass).status === "Upcoming")) ? (
            <Button asChild size="xs" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto">
              <Link href={isDemo ? (data as DemoSession).joinLink || "#" : "#"} target="_blank" rel="noopener noreferrer">
                <Video className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> {isDemo ? "Join Demo" : "Join Class"}
              </Link>
            </Button>
          ) : null }
          
          {(isDemo && (data as DemoSession).status === "Scheduled" && onUpdateSession && onCancelSession) && (
             <DialogTrigger asChild>
                <Button size="xs" variant="outline" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto bg-card border-primary/60 text-primary/80 hover:border-primary hover:bg-primary/5 hover:text-primary">
                  <Settings className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> Manage
                </Button>
              </DialogTrigger>
          )}
          {(!isDemo && ((data as MyClass).status === "Ongoing" || (data as MyClass).status === "Upcoming")) && (
            <Button size="xs" variant="outline" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto bg-card border-primary/60 text-primary/80 hover:border-primary hover:bg-primary/5 hover:text-primary" onClick={() => console.log("Manage class:", data.id)}>
              <Settings className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> Manage
            </Button>
          )}
        </CardFooter>
      </Card>
      {isDemo && onUpdateSession && onCancelSession && (
        <DialogContent className="sm:max-w-lg bg-card p-0 rounded-xl overflow-hidden">
            <ManageDemoModal
              demoSession={data as DemoSession}
              onUpdateSession={(updatedDemo) => {
                  if(onUpdateSession) onUpdateSession(updatedDemo);
                  setIsManageModalOpen(false);
              }}
              onCancelSession={(sessionId) => {
                  if(onCancelSession) onCancelSession(sessionId);
                  setIsManageModalOpen(false);
              }}
            />
        </DialogContent>
      )}
    </Dialog>
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
      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 text-primary/80 shrink-0" />
      <strong className="text-foreground/90 font-medium">{label}:</strong>&nbsp;
      <span className="text-muted-foreground truncate">{value}</span>
    </div>
  );
}


    