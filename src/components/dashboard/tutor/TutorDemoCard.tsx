
"use client";

import type { DemoSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Clock, User, Video, CheckCircle, XCircle, MessageSquareQuote, Settings, GraduationCap, ShieldCheck, RadioTower, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ManageDemoModal } from "@/components/modals/ManageDemoModal";

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

  const statusBadgeClasses = () => {
    switch (demo.status) {
      case "Scheduled": return "bg-blue-100 text-blue-700 border-blue-500/50";
      case "Requested": return "bg-yellow-100 text-yellow-700 border-yellow-500/50";
      case "Completed": return "bg-green-100 text-green-700 border-green-500/50";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-500/50";
      default: return "bg-gray-100 text-gray-700 border-gray-500/50";
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
    <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
      <Card className="bg-card rounded-none shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full">
        <CardHeader className="p-0 pb-3 sm:pb-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm border border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-xs">
                {studentInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <CardTitle className="text-sm sm:text-base font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
                Demo: {demo.subject}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Student: {demo.studentName}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={cn("text-[10px] py-0.5 px-2 border font-medium whitespace-nowrap rounded-full", statusBadgeClasses())}
            >
              <StatusIcon />
              {demo.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-2 sm:pt-3 space-y-1 sm:space-y-1.5 text-xs flex-grow">
          <InfoItem icon={GraduationCap} label="Grade:" value={demo.gradeLevel} />
          {demo.board && <InfoItem icon={ShieldCheck} label="Board:" value={demo.board} />}
          <InfoItem icon={CalendarDays} label="Date:" value={format(demoDate, "MMM d, yyyy")} />
          <InfoItem icon={Clock} label="Time:" value={`${demo.startTime} - ${demo.endTime}`} />
          {demo.mode && <InfoItem icon={RadioTower} label="Mode:" value={demo.mode} />}
        </CardContent>
        <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex justify-end items-center gap-2">
          {demo.joinLink && demo.status === "Scheduled" && (
            <Button asChild size="xs" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto">
              <a href={demo.joinLink} target="_blank" rel="noopener noreferrer">
                <Video className="w-3 h-3 mr-1" /> Join Session
              </a>
            </Button>
          )}
          {demo.status === "Scheduled" && (
            <DialogTrigger asChild>
              <Button size="xs" variant="outline" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto bg-card border-primary/60 text-primary/80 hover:border-primary hover:bg-primary/5 hover:text-primary">
                <Settings className="w-3 h-3 mr-1" /> Manage
              </Button>
            </DialogTrigger>
          )}
          {(demo.status === "Completed" || demo.status === "Cancelled" || demo.status === "Requested") && (
             <Button size="xs" variant="ghost" className="text-[10px] sm:text-[11px] py-1 px-2 h-auto text-muted-foreground cursor-default">
              {demo.status}
            </Button>
          )}
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
