
"use client";

import type { DemoSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Clock, User, Video, CheckCircle, XCircle, MessageSquareQuote, Settings, GraduationCap, ShieldCheck, RadioTower, Info, Edit3, Users as UsersIcon, XOctagon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ManageDemoModal } from "@/components/modals/ManageDemoModal";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TutorDemoCardProps {
  demo: DemoSession;
  onUpdateSession: (updatedDemo: DemoSession) => void;
  onCancelSession: (sessionId: string, reason: string) => void; // Updated to accept a reason
}

const getSubjectInitials = (subject?: string): string => {
  if (!subject || subject.trim() === "") return "?";
  const firstSubject = subject.split(',')[0].trim();
  return firstSubject[0].toUpperCase();
};

export function TutorDemoCard({ demo, onUpdateSession, onCancelSession }: TutorDemoCardProps) {
  const demoDate = new Date(demo.date);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const subjectInitials = getSubjectInitials(demo.subject);

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
  
  const handleConfirmCancel = () => {
      onCancelSession(demo.id, cancelReason);
      setIsCancelModalOpen(false);
  };

  return (
    <>
      <Card className="bg-card rounded-lg shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full">
        <CardHeader className="p-0 pb-3 sm:pb-4 relative">
          <div className="flex items-start space-x-3">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm bg-primary text-primary-foreground">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-base">
                {subjectInitials}
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
        <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex justify-end items-center gap-2">
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
                 <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-xs py-1.5 px-2.5 h-auto">
                        <Edit3 className="w-3 h-3 mr-1.5" /> Confirm/Modify
                    </Button>
                 </DialogTrigger>
            )}
            {demo.status === "Scheduled" && (
              <>
                <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-xs py-1.5 px-2.5 h-auto">
                            <Settings className="w-3 h-3 mr-1.5" /> Manage
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg bg-card p-0 rounded-xl overflow-hidden">
                      <ManageDemoModal
                        demoSession={demo}
                        onUpdateSession={(updatedDemo) => {
                          onUpdateSession(updatedDemo);
                          setIsManageModalOpen(false);
                        }}
                        onCancelSession={(sessionId) => {
                          onCancelSession(sessionId, "Cancelled by tutor."); // Default reason
                          setIsManageModalOpen(false);
                        }}
                      />
                    </DialogContent>
                </Dialog>
                <Button size="sm" variant="destructive-outline" className="text-xs py-1.5 px-2.5 h-auto" onClick={() => setIsCancelModalOpen(true)}>
                    <XOctagon className="w-3 h-3 mr-1.5" /> Cancel
                </Button>
              </>
            )}
        </CardFooter>
      </Card>
      
      <AlertDialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the demo session with {demo.studentName}. Please provide a reason for cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Label htmlFor="cancellation-reason" className="text-sm font-medium text-foreground">
              Reason for Cancellation
            </Label>
            <Textarea
              id="cancellation-reason"
              placeholder="e.g., Unforeseen personal circumstances."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="mt-2 min-h-[80px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} disabled={!cancelReason.trim()}>
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
