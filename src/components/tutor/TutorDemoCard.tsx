
"use client";

import type { DemoSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Clock, User, Video, CheckCircle, XCircle, MessageSquareQuote, Settings, GraduationCap, ShieldCheck, RadioTower, Info, Edit3, Users as UsersIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ManageDemoModal } from "@/components/modals/ManageDemoModal";
import Link from "next/link";

interface TutorDemoCardProps {
  demo: DemoSession;
  onUpdateSession: (updatedDemo: DemoSession) => void;
  onCancelSession: (sessionId: string) => void;
}

const getStudentInitials = (name?: string): string => {
  if (!name || name.trim() === "") return "S";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export function TutorDemoCard({ demo, onUpdateSession, onCancelSession }: TutorDemoCardProps) {
  const demoDate = new Date(demo.date);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const studentInitials = getStudentInitials(demo.studentName);

  const getStatusBadgeClasses = () => {
    switch (demo.status) {
      case "Scheduled":
        return "bg-primary text-primary-foreground";
      case "Requested":
        return "bg-yellow-500 text-white";
      case "Completed":
        return "bg-green-600 text-white";
      case "Cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const StatusIcon = () => {
    const iconClasses = "w-2.5 h-2.5 mr-1";
    switch (demo.status) {
      case "Scheduled": return <Clock className={iconClasses} />;
      case "Requested": return <MessageSquareQuote className={iconClasses} />;
      case "Completed": return <CheckCircle className={iconClasses} />;
      case "Cancelled": return <XCircle className={iconClasses} />;
      default: return <Info className={iconClasses} />;
    }
  };
  
  const ModeIcon = () => {
    const iconClasses = "w-2.5 h-2.5 mr-1 text-muted-foreground/80";
    if (demo.mode === "Online") return <RadioTower className={iconClasses} />;
    if (demo.mode === "Offline (In-person)") return <UsersIcon className={iconClasses} />;
    return null;
  }

  return (
    <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
      <Card className="bg-card rounded-none shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full">
        <CardHeader className="p-0 pb-3 sm:pb-4 relative">
          <div className="flex items-start space-x-3">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm bg-primary text-primary-foreground">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-xs">
                {studentInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <CardTitle className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
                {demo.subject} ({demo.mode === "Offline (In-person)" ? "Offline" : demo.mode})
              </CardTitle>
              <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex items-center">
                <User className="w-3 h-3 mr-1 text-muted-foreground/80" />
                With {demo.studentName}
              </CardDescription>
            </div>
          </div>
          <div className="absolute top-0 right-0">
              <Badge
                className={cn("text-[10px] px-2 py-0.5 font-semibold", getStatusBadgeClasses())}
              >
                <StatusIcon />
                {demo.status}
              </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-2 sm:pt-3 space-y-1.5 text-xs flex-grow">
          <InfoItem icon={GraduationCap} label="Grade:" value={demo.gradeLevel} />
          {demo.board && <InfoItem icon={ShieldCheck} label="Board:" value={demo.board} />}
          <InfoItem icon={CalendarDays} label="Date:" value={format(demoDate, "MMM d, yyyy")} />
          <InfoItem icon={Clock} label="Time:" value={`${demo.startTime} - ${demo.endTime}`} />
        </CardContent>
        <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex justify-between items-center gap-2">
           <div className="flex items-center space-x-2">
            {demo.mode && (
              <Badge
                className={cn(
                    "py-0.5 px-1.5 border border-border/70 bg-background/50 font-normal text-muted-foreground text-[10px] flex items-center rounded-full"
                )}
              >
                <ModeIcon />
                {demo.mode === "Offline (In-person)" ? "Offline" : demo.mode}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {demo.joinLink && demo.status === "Scheduled" && (
              <Button
                asChild
                size="sm"
                className={cn(
                  "text-xs py-1.5 px-2.5 h-auto", 
                  "bg-primary border-primary text-primary-foreground hover:bg-primary/90 transform transition-transform hover:scale-105 active:scale-95"
                )}
              >
                <Link href={demo.joinLink} target="_blank" rel="noopener noreferrer">
                  <Video className="w-3 h-3 mr-1" /> Join Session
                </Link>
              </Button>
            )}
             {demo.status === "Requested" && (
                 <Button size="xs" variant="outline" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto bg-card border-primary/60 text-primary/80 hover:border-primary hover:bg-primary/5 hover:text-primary">
                    <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> Confirm/Modify
                </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      {demo.status === "Scheduled" && (
        <DialogContent className="sm:max-w-lg bg-card p-0 rounded-xl overflow-hidden">
          <ManageDemoModal
            demoSession={demo}
            onUpdateSession={(updatedDemo) => {
              onUpdateSession(updatedDemo);
              setIsManageModalOpen(false);
            }}
            onCancelSession={(sessionId) => {
              onCancelSession(sessionId);
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
  value?: string;
  className?: string;
}

function InfoItem({ icon: Icon, label, value, className }: InfoItemProps) {
  return (
    <div className={cn("flex items-start text-xs w-full min-w-0", className)}>
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0 mt-[1px]" />
      <div className="min-w-0 flex-1">
        <strong className="text-muted-foreground font-medium">{label}</strong>&nbsp;
        <span className="text-foreground/90 break-words">{value}</span>
      </div>
    </div>
  );
}
