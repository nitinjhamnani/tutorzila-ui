
"use client";

import type { DemoSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, User, Video, CheckCircle, XCircle, MessageSquareQuote, Edit3, MessageSquareText, Info, ListFilter, Users as UsersIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input }
from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ParentDemoSessionCardProps {
  demo: DemoSession;
  onReschedule: (demoId: string, newDate: Date, newTime: string, reason: string) => void; // Updated to include details
  onCancel: (demoId: string) => void;
  onEditRequest: (demoId: string) => void;
  onWithdrawRequest: (demoId: string) => void;
  onGiveFeedback: (demoId: string) => void;
}

export function ParentDemoSessionCard({ demo, onReschedule, onCancel, onEditRequest, onWithdrawRequest, onGiveFeedback }: ParentDemoSessionCardProps) {
  const { toast } = useToast();
  const demoDate = new Date(demo.date);

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [newSelectedDate, setNewSelectedDate] = useState<Date | undefined>(new Date(demo.date));
  const [newTimeInput, setNewTimeInput] = useState(demo.time);
  const [rescheduleReasonInput, setRescheduleReasonInput] = useState("");
  // Local state to track if a reschedule request has been initiated for this card
  const [localRescheduleStatus, setLocalRescheduleStatus] = useState<'idle' | 'pending' | 'confirmed'>(demo.rescheduleStatus || 'idle');


  const getStatusBadgeVariant = () => {
    if (localRescheduleStatus === 'pending') return "bg-orange-100 text-orange-700 border-orange-500/50";
    switch (demo.status) {
      case "Scheduled": return "bg-blue-100 text-blue-700 border-blue-500/50";
      case "Requested": return "bg-yellow-100 text-yellow-700 border-yellow-500/50";
      case "Completed": return "bg-green-100 text-green-700 border-green-500/50";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-500/50";
      default: return "outline";
    }
  };

  const StatusIcon = () => {
    if (localRescheduleStatus === 'pending') return <Clock className="mr-1.5 h-3 w-3" />;
    switch (demo.status) {
      case "Scheduled": return <Clock className="mr-1.5 h-3 w-3" />;
      case "Requested": return <MessageSquareQuote className="mr-1.5 h-3 w-3" />;
      case "Completed": return <CheckCircle className="mr-1.5 h-3 w-3" />;
      case "Cancelled": return <XCircle className="mr-1.5 h-3 w-3" />;
      default: return <Info className="mr-1.5 h-3 w-3" />;
    }
  };
  
  const handleRescheduleSubmit = () => {
    if (!newSelectedDate || !newTimeInput.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a new date and time for the reschedule request.",
      });
      return;
    }
    // Call the prop function to handle actual reschedule logic (e.g., API call)
    // For now, we'll just update local status for UI feedback
    onReschedule(demo.id, newSelectedDate, newTimeInput, rescheduleReasonInput);
    setLocalRescheduleStatus('pending'); 
    setIsRescheduleModalOpen(false);
    toast({
      title: "Reschedule Request Sent",
      description: "Your request has been sent to the tutor for confirmation.",
    });
  };


  return (
    <Card className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-0.5">
      <CardHeader className="p-4 pb-3 bg-muted/20 border-b">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
             <Avatar className="h-10 w-10 shrink-0 rounded-full shadow-sm border">
              <AvatarImage src={demo.tutorAvatarSeed ? `https://picsum.photos/seed/${demo.tutorAvatarSeed}/128` : `https://avatar.vercel.sh/${demo.tutorName}.png`} alt={demo.tutorName || "Tutor"} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {demo.tutorName?.split(" ").map(n => n[0]).join("").toUpperCase() || "T"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <CardTitle className="text-sm font-semibold text-foreground truncate" title={demo.subject}>
                Demo: {demo.subject}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground mt-0.5 truncate">
                Tutor: {demo.tutorName || "N/A"} | For: {demo.studentName}
              </CardDescription>
            </div>
          </div>
           <Badge variant="outline" className={cn("text-[10px] py-0.5 px-2 border font-medium whitespace-nowrap rounded-full", getStatusBadgeVariant())}>
            <StatusIcon />
            {localRescheduleStatus === 'pending' ? "Reschedule Pending" : demo.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-xs flex-grow">
        <InfoItem icon={CalendarDays} label="Date" value={format(demoDate, "MMM d, yyyy")} />
        <InfoItem icon={Clock} label="Time" value={demo.time} />
        {demo.mode && <InfoItem icon={demo.mode === "Online" ? Video : UsersIcon} label="Mode" value={demo.mode} />}
        <InfoItem icon={ListFilter} label="Grade" value={demo.gradeLevel} />
        <InfoItem icon={ListFilter} label="Board" value={demo.board} />
         {localRescheduleStatus === 'pending' && (
          <p className="text-[10px] text-orange-600 font-medium mt-1.5">Reschedule request sent – Pending confirmation from tutor.</p>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t bg-card/50 flex flex-wrap justify-end items-center gap-2">
        {demo.status === "Scheduled" && localRescheduleStatus !== 'pending' && (
          <>
            {demo.joinLink && (
              <Button asChild size="xs" className="text-[11px] py-1 px-2 h-auto">
                <Link href={demo.joinLink} target="_blank" rel="noopener noreferrer">
                  <Video className="w-3 h-3 mr-1" /> Join Now
                </Link>
              </Button>
            )}
            <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
              <DialogTrigger asChild>
                <Button size="xs" variant="outline" className="text-[11px] py-1 px-2 h-auto">
                  <Edit3 className="w-3 h-3 mr-1" /> Reschedule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card">
                <DialogHeader>
                  <DialogTitle>Reschedule Demo Session</DialogTitle>
                  <DialogDescription>
                    Request a new date and time for your demo with {demo.tutorName} for {demo.subject}.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-date">New Date</Label>
                    <Calendar
                      mode="single"
                      selected={newSelectedDate}
                      onSelect={setNewSelectedDate}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-time">New Time</Label>
                    <Input 
                      id="new-time" 
                      value={newTimeInput} 
                      onChange={(e) => setNewTimeInput(e.target.value)} 
                      placeholder="e.g., 5:00 PM - 5:30 PM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reschedule-reason">Reason for Reschedule (Optional)</Label>
                    <Textarea 
                      id="reschedule-reason"
                      value={rescheduleReasonInput}
                      onChange={(e) => setRescheduleReasonInput(e.target.value)}
                      placeholder="Briefly explain why you need to reschedule."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="button" onClick={handleRescheduleSubmit}>Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button size="xs" variant="destructiveOutline" className="text-[11px] py-1 px-2 h-auto" onClick={() => onCancel(demo.id)}>
              <XCircle className="w-3 h-3 mr-1" /> Cancel
            </Button>
          </>
        )}
        {demo.status === "Scheduled" && localRescheduleStatus === 'pending' && (
            <Button size="xs" variant="outline" className="text-[11px] py-1 px-2 h-auto" disabled>
              Reschedule Pending
            </Button>
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

interface InfoItemPropsLocal { 
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemPropsLocal) {
  return (
    <div className="flex items-center text-xs">
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0" />
      <strong className="text-foreground/80 font-medium">{label}:</strong>&nbsp;
      <span className="text-muted-foreground truncate">{value}</span>
    </div>
  );
}

    