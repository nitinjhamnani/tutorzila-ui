
"use client";

import type { DemoSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Avatar components are removed as per previous request to remove tutor avatar
import { 
    CalendarDays, Clock, User, Video, CheckCircle, XCircle, MessageSquareQuote, Edit3, 
    MessageSquareText, Info, Users as UsersIcon, CalendarIcon, RadioTower, Settings, Save, Ban, LinkIcon,
    GraduationCap, ShieldCheck, Star as StarIcon
} from "lucide-react";
import { format, parse, addMinutes, isPast } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle as ModalTitle, // Alias to avoid conflict with CardTitle
  DialogDescription as ModalDescription, // Alias to avoid conflict
  DialogFooter,
  // DialogClose, // Not always needed if form submission closes it
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label"; // Label might be used in modal, keep it
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectItem, SelectTrigger as FormSelectTrigger, SelectValue as FormSelectValue, SelectContent } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FeedbackModal, type NextStepDecisionValue } from "@/components/modals/FeedbackModal";

const timeSlotsOptions = Array.from({ length: 2 * (21 - 7) + 1 }, (_, i) => { 
  const hour = Math.floor(i / 2) + 7;
  const minute = (i % 2) * 30;
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  const formattedTime = format(date, "hh:mm a"); 
  return { value: formattedTime, label: formattedTime };
});

const durationOptions = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
  { value: 75, label: "75 minutes" },
  { value: 90, label: "90 minutes" },
  { value: 120, label: "120 minutes" },
];

const manageDemoSchema = z.object({
  newDate: z.date({ required_error: "Please select a new date."}),
  newStartTime: z.string().min(1, "Please select a start time."),
  duration: z.number({ coerce: true }).min(30, "Duration must be at least 30 minutes.").max(120, "Duration cannot exceed 120 minutes."),
  meetingUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type ManageDemoFormValues = z.infer<typeof manageDemoSchema>;

interface ParentDemoSessionCardProps {
  demo: DemoSession;
  onReschedule: (demoId: string, newDate: Date, newStartTime: string, newEndTime: string, reason: string) => void; // Reason is kept for now for scheduled demos
  onCancel: (demoId: string) => void;
  onEditRequest: (demoId: string, newDate: Date, newStartTime: string, newEndTime: string, meetingUrl?: string) => void;
  onWithdrawRequest: (demoId: string) => void;
  onGiveFeedback: (demoId: string, rating: number, comment?: string, nextStepDecision?: NextStepDecisionValue) => void;
  onStartClassesRequest: (demoId: string) => void;
}

export function ParentDemoSessionCard({ 
    demo, 
    onReschedule, 
    onCancel, 
    onEditRequest, 
    onWithdrawRequest, 
    onGiveFeedback,
    onStartClassesRequest 
}: ParentDemoSessionCardProps) {
  const { toast } = useToast();
  const demoDate = new Date(demo.date);

  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [localRescheduleStatus, setLocalRescheduleStatus] = useState<'idle' | 'pending' | 'confirmed'>(demo.rescheduleStatus || 'idle');

  const calculateInitialDuration = (start: string, end: string, date: string): number => {
    try {
      const startDate = parse(`${format(new Date(date), 'yyyy-MM-dd')} ${start}`, 'yyyy-MM-dd hh:mm a', new Date());
      const endDate = parse(`${format(new Date(date), 'yyyy-MM-dd')} ${end}`, 'yyyy-MM-dd hh:mm a', new Date());
      const diffInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
      return durationOptions.some(opt => opt.value === diffInMinutes) ? diffInMinutes : 30;
    } catch {
      return 30; 
    }
  };

  const form = useForm<ManageDemoFormValues>({
    resolver: zodResolver(manageDemoSchema),
    defaultValues: {
      newDate: new Date(demo.date),
      newStartTime: demo.startTime,
      duration: calculateInitialDuration(demo.startTime, demo.endTime, demo.date),
      meetingUrl: demo.joinLink || "",
    },
  });

   useEffect(() => {
    if (demo && isManageModalOpen) { 
      form.reset({
        newDate: new Date(demo.date),
        newStartTime: demo.startTime,
        duration: calculateInitialDuration(demo.startTime, demo.endTime, demo.date),
        meetingUrl: demo.joinLink || "",
      });
    }
    if(demo) { 
      setLocalRescheduleStatus(demo.rescheduleStatus || 'idle');
    }
  }, [demo, form, isManageModalOpen]);

  const isDemoTimePassed = () => {
    if (demo.status !== 'Scheduled') return false;
    try {
      const endDateTime = parse(`${format(new Date(demo.date), 'yyyy-MM-dd')} ${demo.endTime}`, 'yyyy-MM-dd hh:mm a', new Date());
      return isPast(endDateTime);
    } catch (e) {
      console.error("Error parsing demo end time:", e);
      return false; 
    }
  };

  const canMarkCompleted = isDemoTimePassed() && demo.status === 'Scheduled';

  const getStatusBadgeClasses = () => {
    if (localRescheduleStatus === 'pending') return "bg-orange-100 text-orange-700 border-orange-500/50 hover:bg-orange-200";
    switch (demo.status) {
      case "Scheduled": return "bg-blue-100 text-blue-700 border-blue-500/50 hover:bg-blue-200";
      case "Requested": return "bg-yellow-100 text-yellow-700 border-yellow-500/50 hover:bg-yellow-200";
      case "Completed": return "bg-green-100 text-green-700 border-green-500/50 hover:bg-green-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-500/50 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-500/50 hover:bg-gray-200";
    }
  };

  const StatusIcon = () => {
    const iconClasses = "w-2.5 h-2.5 mr-1 text-muted-foreground/80";
    if (localRescheduleStatus === 'pending') return <Clock className={iconClasses} />;
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
  
  const handleFormSubmit = (values: ManageDemoFormValues) => {
    let calculatedEndTime = "";
    try {
      const startDateTimeStr = `${format(values.newDate, 'yyyy-MM-dd')} ${values.newStartTime}`;
      const startDateTime = parse(startDateTimeStr, 'yyyy-MM-dd hh:mm a', new Date());
      const endDateTime = addMinutes(startDateTime, values.duration);
      calculatedEndTime = format(endDateTime, "hh:mm a");
    } catch (error) {
      console.error("Error calculating end time for update:", error);
      toast({
        variant: "destructive",
        title: "Time Calculation Error",
        description: "Could not calculate the end time. Please check start time and duration.",
      });
      return;
    }

    if (demo.status === 'Scheduled') {
        onReschedule(demo.id, values.newDate, values.newStartTime, calculatedEndTime, ""); // Empty reason for now
        setLocalRescheduleStatus('pending'); 
        toast({
            title: "Demo Reschedule Requested",
            description: "Your reschedule request has been sent to the tutor for confirmation.",
        });
    } else if (demo.status === 'Requested') {
        onEditRequest(demo.id, values.newDate, values.newStartTime, calculatedEndTime, values.meetingUrl);
    }
    setIsManageModalOpen(false);
    form.reset();
  };

  const handleModalCancelAction = () => {
    if (demo.status === 'Scheduled') {
        onCancel(demo.id);
    } else if (demo.status === 'Requested') {
        onWithdrawRequest(demo.id);
    }
    setIsManageModalOpen(false); 
  };

  const handleFeedbackSubmit = (rating: number, comment?: string, nextStepDecision?: NextStepDecisionValue) => {
    onGiveFeedback(demo.id, rating, comment, nextStepDecision);
    setIsFeedbackModalOpen(false);
  };

  return (
    <>
    <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
      <Card className="bg-card rounded-lg shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full">
        <CardHeader className="p-0 pb-3 sm:pb-4 relative">
          <div className="flex items-start space-x-3">
            <div className="flex-grow min-w-0">
              <CardTitle className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
                Demo: {demo.subject}
              </CardTitle>
              <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex items-center flex-wrap">
                <User className="w-3 h-3 mr-1 text-muted-foreground/80 shrink-0" />
                <span className="mr-1">With {demo.tutorName}</span> 
              </CardDescription>
            </div>
            { ( (demo.status === "Scheduled" && localRescheduleStatus !== 'pending' && !canMarkCompleted) || (demo.status === "Requested") ) ? (
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="absolute top-0 right-0 h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90"
                  title={demo.status === "Scheduled" ? "Manage Demo Session" : "Manage Demo Request"}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-2 sm:pt-3 space-y-1.5 text-xs flex-grow">
          <InfoItem icon={GraduationCap} label="Grade:" value={demo.gradeLevel} />
          {demo.board && <InfoItem icon={ShieldCheck} label="Board:" value={demo.board} />}
          <InfoItem icon={CalendarDays} label="Date:" value={format(demoDate, "MMM d, yyyy")} />
          <InfoItem icon={Clock} label="Time:" value={`${demo.startTime} - ${demo.endTime}`} />
        </CardContent>
        <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
          <div className="flex items-center space-x-2 self-start sm:self-center">
              <Badge
                  className={cn(
                      "py-0.5 px-1.5 border border-border/70 bg-background/50 font-normal text-muted-foreground text-[10px] flex items-center rounded-full"
                  )}
              >
                  <StatusIcon />
                  {localRescheduleStatus === 'pending' ? "Update Pending" : demo.status}
              </Badge>
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
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-end">
              {demo.mode === "Online" && demo.status === "Scheduled" && localRescheduleStatus !== 'pending' && demo.joinLink && !canMarkCompleted && (
                  <Button asChild size="sm" className="flex-grow sm:flex-grow-0 text-xs py-1.5 px-2.5 h-auto transform transition-transform hover:scale-105 active:scale-95">
                      <Link href={demo.joinLink} target="_blank" rel="noopener noreferrer">
                      <Video className="w-3 h-3 mr-1" /> Join Now
                      </Link>
                  </Button>
              )}
              {demo.mode === "Online" && demo.status === "Requested" && (
                 <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-grow sm:flex-grow-0 text-xs py-1.5 px-2.5 h-auto cursor-not-allowed" disabled>
                          <Video className="w-3 h-3 mr-1" /> Join Now
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Link available after tutor confirmation.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
              )}
              {demo.status === "Scheduled" && localRescheduleStatus === 'pending' && !canMarkCompleted && (
                  <Button size="sm" variant="outline" className="flex-grow sm:flex-grow-0 text-xs py-1.5 px-2.5 h-auto" disabled>
                  Update Pending Tutor Confirmation
                  </Button>
              )}
              {canMarkCompleted && (
                <Button size="sm" variant="outline" className="flex-grow sm:flex-grow-0 text-xs py-1.5 px-2.5 h-auto transform transition-transform hover:scale-105 active:scale-95" onClick={() => setIsFeedbackModalOpen(true)}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Mark Completed & Give Feedback
                </Button>
              )}
              {demo.status === "Completed" && (
                <Button size="sm" variant="outline" className="flex-grow sm:flex-grow-0 text-xs py-1.5 px-2.5 h-auto transform transition-transform hover:scale-105 active:scale-95" onClick={() => setIsFeedbackModalOpen(true)}>
                    <StarIcon className="w-3 h-3 mr-1" /> {demo.feedbackSubmitted ? "View/Edit Feedback" : "Give Feedback"}
                </Button>
              )}
          </div>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-md bg-card p-0 rounded-xl overflow-hidden"> 
          <>
            <DialogHeader className="p-6 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <ModalTitle className="text-lg font-semibold text-foreground">
                    {demo.status === 'Requested' ? "Manage Demo Request" : "Manage Demo Session"}
                  </ModalTitle>
                  <ModalDescription className="text-sm text-muted-foreground mt-0.5">
                    Update details for the demo with {demo.tutorName} for {demo.subject}.
                  </ModalDescription>
                </div>
              </div>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="px-6 pt-5 pb-6 space-y-5 max-h-[70vh] overflow-y-auto">
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
                                "w-full justify-start text-left font-normal pl-3 text-xs h-9 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm",
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
                            <FormSelectTrigger className="text-xs h-9 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                              <Clock className="mr-2 h-3.5 w-3.5 opacity-50" />
                              <FormSelectValue placeholder="Start time" />
                            </FormSelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {timeSlotsOptions.map(slot => (
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
                    name="duration"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                        <FormControl>
                            <FormSelectTrigger className="text-xs h-9 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                              <Clock className="mr-2 h-3.5 w-3.5 opacity-50" />
                              <FormSelectValue placeholder="Duration" />
                            </FormSelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {durationOptions.map(option => (
                            <SelectItem key={option.value} value={String(option.value)} className="text-xs">{option.label}</SelectItem>
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
                  name="meetingUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting URL (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input 
                                type="url" 
                                placeholder="https://zoom.us/j/yourmeetingid" 
                                {...field} 
                                className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm h-9 text-xs"
                            />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4 flex-col sm:flex-row gap-2">
                    <Button 
                        type="button" 
                        variant="destructiveOutline" 
                        size="sm" 
                        onClick={handleModalCancelAction}
                        className="w-full sm:w-auto text-xs py-2 px-3.5 transform transition-transform hover:scale-105 active:scale-95"
                    >
                        <Ban className="mr-1.5 h-3.5 w-3.5" />
                        {demo.status === 'Requested' ? 'Withdraw Request' : 'Cancel Session'}
                    </Button>
                    <div className="flex-grow sm:flex-grow-0" /> 
                    <Button type="submit" size="sm" disabled={form.formState.isSubmitting || !form.formState.isValid} className="w-full sm:w-auto text-xs py-2 px-3.5 transform transition-transform hover:scale-105 active:scale-95">
                    <Save className="mr-1.5 h-3.5 w-3.5" />
                    {form.formState.isSubmitting ? "Updating..." : "Update Session"}
                    </Button>
                </DialogFooter>
            </form>
            </Form>
          </>
      </DialogContent>
    </Dialog>
    {demo.tutorName && demo.subject && (
        <FeedbackModal
            isOpen={isFeedbackModalOpen}
            onOpenChange={setIsFeedbackModalOpen}
            tutorName={demo.tutorName}
            demoSubject={demo.subject}
            onSubmitFeedback={handleFeedbackSubmit}
        />
    )}
    </>
  );
}

interface InfoItemPropsLocal { 
  icon: React.ElementType;
  label: string;
  value?: string; 
}

function InfoItem({ icon: Icon, label, value }: InfoItemPropsLocal) {
  if (!value) return null; 
  return (
    <div className={cn("flex items-start text-xs w-full min-w-0")}>
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0 mt-[1px]" />
      <div className="min-w-0 flex-1">
        <strong className="text-muted-foreground font-medium">{label}</strong>&nbsp;
        <span className="text-foreground/90 break-words">{value}</span>
      </div>
    </div>
  );
}
