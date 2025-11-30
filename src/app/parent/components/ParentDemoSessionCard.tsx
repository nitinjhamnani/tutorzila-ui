
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DemoSession } from "@/types";
import { cn } from "@/lib/utils";
import { CalendarDays, Clock, User, Video, XCircle, CheckCircle, MessageSquareQuote, RadioTower, Users as UsersIcon, Settings, Edit3 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ManageDemoModal } from "@/components/modals/ManageDemoModal";
import Link from "next/link";

interface ParentDemoCardProps {
  demo: DemoSession;
  onUpdateSession: (updatedDemo: DemoSession) => void;
  onCancelSession: (sessionId: string, reason: string) => void;
}

const parentCancellationReasons = [
  { id: "tutor_unresponsive", label: "Tutor is not responsive" },
  { id: "found_another_tutor", label: "I have found another tutor" },
  { id: "not_liked_profile", label: "I am not interested in this profile anymore" },
  { id: "other_reason", label: "Other" },
];

export function ParentDemoCard({ demo, onUpdateSession, onCancelSession }: ParentDemoCardProps) {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const demoDate = new Date(demo.date);

  const StatusIcon = () => {
    const iconProps = "w-3 h-3 mr-1";
    switch (demo.status) {
      case "Scheduled": return <Clock className={iconProps} />;
      case "Requested": return <MessageSquareQuote className={iconProps} />;
      case "Completed": return <CheckCircle className={iconProps} />;
      case "Cancelled": return <XCircle className={iconProps} />;
      default: return null;
    }
  };

  const cardTitle = `${demo.mode === 'Online' ? 'Online' : 'Offline'} Demo: ${demo.subject}`;
  const AvatarIcon = demo.mode === 'Online' ? RadioTower : UsersIcon;

  const handleConfirmCancel = () => {
    if (cancelReason) {
      onCancelSession(demo.id, cancelReason);
      setIsCancelModalOpen(false);
    }
  };


  return (
    <>
      <Card className="shadow border p-4 sm:p-5">
        <CardHeader className="flex flex-row justify-between items-start space-x-4 p-0 mb-2">
          <div className="flex items-start space-x-3">
             <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm bg-primary text-primary-foreground flex items-center justify-center">
              <AvatarIcon className="h-5 w-5" />
            </Avatar>
            <div className="space-y-0.5">
              <CardTitle className="text-base font-semibold">{cardTitle}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                With {demo.tutorName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="text-xs space-y-2">
          <div className="flex items-center">
            <User className="w-3.5 h-3.5 mr-1 text-primary/70" />
            Student: {demo.studentName}
          </div>
          <div className="flex items-center">
            <CalendarDays className="w-3.5 h-3.5 mr-1 text-primary/70" />
            Date: {format(demoDate, "PPP")}
          </div>
           <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-primary/70" />
            Time: {demo.startTime} to {demo.endTime}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t pt-3 mt-2">
          <Badge variant="default" className={cn("text-[10px] px-2 py-0.5", demo.status === 'Scheduled' ? 'bg-primary' : 'bg-muted')}>
              <StatusIcon />
              {demo.status}
          </Badge>

          <div className="flex items-center gap-2">
            {demo.joinLink && demo.status === "Scheduled" && (
              <Button size="sm" asChild className="text-xs px-3 py-1.5">
                <Link href={demo.joinLink} target="_blank" rel="noopener noreferrer">
                  <Video className="w-3 h-3 mr-1" /> Join
                </Link>
              </Button>
            )}

            {demo.status === "Scheduled" && (
              <Button
                size="sm"
                variant="destructive"
                className="text-xs px-3 py-1.5"
                onClick={() => setIsCancelModalOpen(true)}
              >
                <XCircle className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the demo session with {demo.tutorName}. Please provide a reason for cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Label htmlFor="cancellation-reason" className="text-sm font-medium text-foreground mb-3 block">
              Reason for Cancellation
            </Label>
            <RadioGroup
              id="cancellation-reason"
              value={cancelReason}
              onValueChange={setCancelReason}
              className="flex flex-col space-y-2"
            >
              {parentCancellationReasons.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value={reason.label} id={`parent-cancel-${reason.id}`} />
                  <Label htmlFor={`parent-cancel-${reason.id}`} className="font-normal">{reason.label}</Label>
                </div>
              ))}
            </RadioGroup>
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
