
"use client";

import type { DemoSession, MyClass } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ClockIcon, User, Video, CheckCircle, XCircle, AlertTriangle, BookOpen, GraduationCap, ShieldCheck, Settings, MessageSquareQuote, Edit3, Info, ListFilter, Users as UsersIcon, CalendarDays, CalendarIcon, LinkIcon, Save, Ban, XOctagon } from "lucide-react";
import { format, isToday, addMinutes, parse } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ManageDemoModal } from "@/components/modals/ManageDemoModal";

export interface UpcomingSessionCardProps {
  sessionDetails: { type: 'demo', data: DemoSession } | { type: 'class', data: MyClass };
  onUpdateSession?: (updatedDemo: DemoSession) => void; // Only for demos
  onCancelSession?: (sessionId: string) => void; // Only for demos
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
  
  const title = Array.isArray(data.subject) ? data.subject.join(', ') : data.subject;
  const studentName = type === 'demo' ? (data as DemoSession).studentName : (data as MyClass).studentName;
  const tutorName = type === 'demo' ? (data as DemoSession).tutorName : (data as MyClass).tutorName; // This is the current user (tutor)
  const tutorAvatarSeed = type === 'demo' ? (data as DemoSession).tutorAvatarSeed : (data as MyClass).tutorAvatarSeed;
  const mode = data.mode;
  const status = data.status;

  const getStatusBadgeClasses = () => {
    return "bg-primary text-primary-foreground";
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

  if (isDemo) {
    const demoData = data as DemoSession;
    return (
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <Card className="bg-card border border-border/40 rounded-lg shadow-sm w-full overflow-hidden">
          <CardHeader className={cn(
            "p-3 sm:p-4 border-b border-border/30",
          )}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex-grow min-w-0">
                  <CardTitle className="text-sm sm:text-base font-semibold text-primary line-clamp-1" title={title}>
                    {title}
                  </CardTitle>
                  <CardDescription className="text-[11px] sm:text-[11px] text-muted-foreground mt-0.5 flex items-center">
                    <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 text-muted-foreground/80" />
                    {studentName}
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn("text-[10px] py-0.5 px-2 border font-semibold whitespace-nowrap rounded-full", getStatusBadgeClasses())}
              >
                <StatusIcon />
                {status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 space-y-1.5 text-xs flex-grow">
            <InfoItem icon={GraduationCap} label="Grade" value={demoData.gradeLevel} />
            <InfoItem icon={ShieldCheck} label="Board" value={demoData.board} />
            <InfoItem icon={CalendarDays} label="Date" value={format(sessionDate, "MMM d, yyyy")} />
            <InfoItem icon={ClockIcon} label="Time" value={`${demoData.startTime} - ${demoData.endTime}`} />
            {mode && <InfoItem icon={mode === "Online" ? Video : UsersIcon} label="Mode" value={mode} />}
          </CardContent>
          <CardFooter className={cn(
            "border-t border-border/30 flex justify-end items-center gap-2",
            "p-3 sm:p-4"
            )}>
            {demoData.joinLink && demoData.status === "Scheduled" && (
              <Button asChild size="xs" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto">
                <Link href={demoData.joinLink || "#"} target="_blank" rel="noopener noreferrer">
                  <Video className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> Join Demo
                </Link>
              </Button>
            )}
             {demoData.status === "Scheduled" && onUpdateSession && onCancelSession && (
              <DialogTrigger asChild>
                <Button size="xs" variant="outline" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto">
                  <Settings className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> Manage
                </Button>
              </DialogTrigger>
            )}
             {demoData.status === "Requested" && (
                 <DialogTrigger asChild>
                    <Button size="xs" variant="outline" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto">
                        <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> Confirm/Modify
                    </Button>
                 </DialogTrigger>
            )}
          </CardFooter>
        </Card>
        {onUpdateSession && onCancelSession && (
            <DialogContent className="sm:max-w-lg bg-card p-0 rounded-xl overflow-hidden">
                <ManageDemoModal
                demoSession={demoData}
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
  } else { // Regular Class
    const classData = data as MyClass;
    return (
      <Card className="bg-card border-0 rounded-lg shadow-lg p-4 w-full overflow-hidden h-full flex flex-col">
        <CardHeader className="p-0 pb-3 border-b border-border/30">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex-grow min-w-0">
                <CardTitle className="text-xs sm:text-sm font-semibold text-primary line-clamp-1" title={title}>
                  {title}
                </CardTitle>
                <CardDescription className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 flex items-center">
                  <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 text-muted-foreground/80" />
                  {studentName}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn("text-[10px] py-0.5 px-2 border font-semibold whitespace-nowrap rounded-full", getStatusBadgeClasses())}
            >
              <StatusIcon />
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-3 space-y-1.5 text-xs flex-grow">
            {mode && <InfoItem icon={mode === "Online" ? Video : UsersIcon} label="Mode" value={mode} />}
            <InfoItem icon={CalendarDays} label="Schedule" value={classData.schedule.days.join(', ')} />
            <InfoItem icon={ClockIcon} label="Time" value={classData.schedule.time} />
            {classData.status === "Upcoming" && classData.startDate && <InfoItem icon={CalendarIcon} label="Starts" value={format(new Date(classData.startDate!), "MMM d, yyyy")} />}
            {classData.status === "Ongoing" && classData.nextSession && <InfoItem icon={CalendarIcon} label="Next On" value={format(new Date(classData.nextSession!), "MMM d, yyyy 'at' p")} />}
        </CardContent>
        <CardFooter className="p-0 pt-3 border-t border-border/30 transition-colors duration-300 flex justify-end items-center gap-2">
            {(classData.mode === "Online" && (classData.status === "Ongoing" || classData.status === "Upcoming")) && (
              <Button asChild size="xs" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto">
                <Link href={"#"} target="_blank" rel="noopener noreferrer">
                  <Video className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> Join Class
                </Link>
              </Button>
            )}
            { (classData.status === "Ongoing" || classData.status === "Upcoming") && (
              <Button size="xs" variant="outline" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto bg-card border-primary/60 text-primary/80 hover:border-primary hover:bg-primary/5 hover:text-primary" onClick={() => console.log("Manage class:", classData.id)}>
                <Settings className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> Manage
              </Button>
            )}
        </CardFooter>
      </Card>
    );
  }
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
