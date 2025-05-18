
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
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectItem, SelectTrigger as FormSelectTrigger, SelectValue as FormSelectValue, SelectContent } from "@/components/ui/select"; // Corrected import

const rescheduleSchema = z.object({
  newDate: z.date({ required_error: "Please select a new date."}),
  newStartTime: z.string().min(1, "Please select a start time."),
  newEndTime: z.string().min(1, "Please select an end time."),
  reason: z.string().max(200, "Reason must be 200 characters or less.").optional(),
}).refine(data => {
   if (data.newStartTime && data.newEndTime) {
    const [startHourString, startMinuteString] = data.newStartTime.split(':');
    const startPeriod = data.newStartTime.includes('PM') ? 'PM' : 'AM';
    let startH = parseInt(startHourString);
    if (startPeriod === 'PM' && startH !== 12) startH += 12;
    if (startPeriod === 'AM' && startH === 12) startH = 0; 
    
    const [endHourString, endMinuteString] = data.newEndTime.split(':');
    const endPeriod = data.newEndTime.includes('PM') ? 'PM' : 'AM';
    let endH = parseInt(endHourString);
    if (endPeriod === 'PM' && endH !== 12) endH += 12;
    if (endPeriod === 'AM' && endH === 12) endH = 0; 

    const startDate = new Date(data.newDate); 
    startDate.setHours(startH, parseInt(startMinuteString.split(' ')[0]), 0, 0);
    const endDate = new Date(data.newDate); 
    endDate.setHours(endH, parseInt(endMinuteString.split(' ')[0]), 0, 0);
    return endDate > startDate;
  }
  return true;
}, {
  message: "End time must be after start time.",
  path: ["newEndTime"],
});

type RescheduleFormValues = z.infer<typeof rescheduleSchema>;

const timeSlotsForReschedule = Array.from({ length: 2 * 14 }, (_, i) => { // 7 AM to 9 PM (14 hours)
  const hour = Math.floor(i / 2) + 7;
  const minute = (i % 2) * 30;
  const date = new Date();
  date.setHours(hour, minute);
  const formattedTime = format(date, "hh:mm a"); 
  return { value: formattedTime, label: formattedTime };
});


interface ParentDemoSessionCardProps {
  demo: DemoSession;
  onReschedule: (demoId: string, newDate: Date, newStartTime: string, newEndTime: string, reason: string) => void;
  onCancel: (demoId: string) => void;
  onEditRequest: (demoId: string) => void;
  onWithdrawRequest: (demoId: string) => void;
  onGiveFeedback: (demoId: string) => void;
}

export function ParentDemoSessionCard({ demo, onReschedule, onCancel, onEditRequest, onWithdrawRequest, onGiveFeedback }: ParentDemoSessionCardProps) {
  const { toast } = useToast();
  const demoDate = new Date(demo.date);

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [localRescheduleStatus, setLocalRescheduleStatus] = useState<'idle' | 'pending' | 'confirmed'>(demo.rescheduleStatus || 'idle');

  const form = useForm<RescheduleFormValues>({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: {
      newDate: new Date(demo.date),
      newStartTime: demo.startTime,
      newEndTime: demo.endTime,
      reason: "",
    },
  });
   useEffect(() => {
    if (demo) {
      form.reset({
        newDate: new Date(demo.date),
        newStartTime: demo.startTime,
        newEndTime: demo.endTime,
        reason: "",
      });
      setLocalRescheduleStatus(demo.rescheduleStatus || 'idle');
    }
  }, [demo, form]);


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
  
  const handleRescheduleSubmit = (values: RescheduleFormValues) => {
    onReschedule(demo.id, values.newDate, values.newStartTime, values.newEndTime, values.reason || "");
    setLocalRescheduleStatus('pending'); 
    setIsRescheduleModalOpen(false);
    form.reset();
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
        <InfoItem icon={Clock} label="Time" value={`${demo.startTime} - ${demo.endTime}`} />
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
              <DialogContent className="sm:max-w-md bg-card p-0 rounded-xl overflow-hidden"> 
                <DialogHeader className="p-6 pb-4 border-b">
                  <DialogTitle>Reschedule Demo Session</DialogTitle>
                  <DialogDescription>
                    Request a new date and time for your demo with {demo.tutorName} for {demo.subject}.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleRescheduleSubmit)} className="grid gap-4 py-4 px-6 max-h-[70vh] overflow-y-auto">
                    <FormField
                      control={form.control}
                      name="newDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>New Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal pl-3 text-xs h-9",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-50" />
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                captionLayout="dropdown-buttons"
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear() + 1}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <FormField
                        control={form.control}
                        name="newStartTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Start Time</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <FormSelectTrigger className="text-xs h-9">
                                  <FormSelectValue placeholder="Start time" />
                                </FormSelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlotsForReschedule.map(slot => (
                                  <SelectItem key={`start-${slot.value}`} value={slot.value} className="text-xs">{slot.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="newEndTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New End Time</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <FormSelectTrigger className="text-xs h-9">
                                  <FormSelectValue placeholder="End time" />
                                </FormSelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlotsForReschedule.map(slot => (
                                  <SelectItem key={`end-${slot.value}`} value={slot.value} className="text-xs">{slot.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Reschedule (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder="Briefly explain why you need to reschedule (max 200 chars)."
                              className="text-xs min-h-[60px]"
                            />
                          </FormControl>
                           <FormDescription className="text-xs text-muted-foreground text-right">
                            {field.value?.length || 0}/200
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <DialogFooter className="pt-4">
                        <DialogClose asChild>
                          <Button type="button" variant="outline" size="sm">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting ? "Submitting..." : "Submit Request"}
                        </Button>
                      </DialogFooter>
                  </form>
                </Form>
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

    