
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, LinkIcon, ClockIcon, Save, Ban, Edit3 } from "lucide-react";
import { format, addMinutes, parse } from "date-fns";
import { cn } from "@/lib/utils";
import type { DemoSession } from "@/types";

const timeSlots = Array.from({ length: 2 * (21 - 7) + 1 }, (_, i) => { // 7 AM to 9 PM (21:00)
  const hour = Math.floor(i / 2) + 7;
  const minute = (i % 2) * 30;
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return { value: format(date, "hh:mm a"), label: format(date, "hh:mm a") };
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
  date: z.date({ required_error: "Please select a date." }),
  startTime: z.string().min(1, "Start time is required."),
  duration: z.number({ coerce: true }).min(30, "Duration must be at least 30 minutes.").max(120, "Duration cannot exceed 120 minutes."),
  meetingUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal(''))
});

type ManageDemoFormValues = z.infer<typeof manageDemoSchema>;

interface ManageDemoModalProps {
  onOpenChange?: (isOpen: boolean) => void;
  demoSession: DemoSession;
  onUpdateSession: (updatedDemo: DemoSession) => void;
  onCancelSession: (sessionId: string) => void;
}

export function ManageDemoModal({
  onOpenChange,
  demoSession,
  onUpdateSession,
  onCancelSession,
}: ManageDemoModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to calculate initial duration
  const calculateInitialDuration = (start: string, end: string, date: string): number => {
    try {
      const startDate = parse(`${format(new Date(date), 'yyyy-MM-dd')} ${start}`, 'yyyy-MM-dd hh:mm a', new Date());
      const endDate = parse(`${format(new Date(date), 'yyyy-MM-dd')} ${end}`, 'yyyy-MM-dd hh:mm a', new Date());
      const diffInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
      return durationOptions.some(opt => opt.value === diffInMinutes) ? diffInMinutes : 30;
    } catch {
      return 30; // Default duration
    }
  };

  const form = useForm<ManageDemoFormValues>({
    resolver: zodResolver(manageDemoSchema),
    defaultValues: {
      date: new Date(demoSession.date),
      startTime: demoSession.startTime || "04:00 PM",
      duration: calculateInitialDuration(demoSession.startTime, demoSession.endTime, demoSession.date),
      meetingUrl: demoSession.joinLink || "",
    },
  });

  useEffect(() => {
    if (demoSession) {
      form.reset({
        date: new Date(demoSession.date),
        startTime: demoSession.startTime || "04:00 PM",
        duration: calculateInitialDuration(demoSession.startTime, demoSession.endTime, demoSession.date),
        meetingUrl: demoSession.joinLink || "",
      });
    }
  }, [demoSession, form]);

  const onSubmit: SubmitHandler<ManageDemoFormValues> = async (data) => {
    setIsSubmitting(true);

    let calculatedEndTime = "";
    try {
      const startDateTimeStr = `${format(data.date, 'yyyy-MM-dd')} ${data.startTime}`;
      const startDateTime = parse(startDateTimeStr, 'yyyy-MM-dd hh:mm a', new Date());
      const endDateTime = addMinutes(startDateTime, data.duration);
      calculatedEndTime = format(endDateTime, "hh:mm a");
    } catch (error) {
      console.error("Error calculating end time:", error);
      toast({
        variant: "destructive",
        title: "Time Calculation Error",
        description: "Could not calculate the end time. Please check start time format.",
      });
      setIsSubmitting(false);
      return;
    }
    
    const updatedDemoData: DemoSession = {
      ...demoSession,
      date: data.date.toISOString(),
      startTime: data.startTime,
      endTime: calculatedEndTime, // Use calculated end time
      status: "Scheduled", 
      joinLink: data.meetingUrl || undefined,
    };
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onUpdateSession(updatedDemoData);
    toast({
      title: "Demo Session Updated!",
      description: `Details for the demo with ${demoSession.studentName} have been updated.`,
    });
    setIsSubmitting(false);
    if (onOpenChange) onOpenChange(false);
  };

  const handleCancelDemo = async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onCancelSession(demoSession.id);
    toast({
      variant: "destructive",
      title: "Demo Session Cancelled",
      description: `The demo with ${demoSession.studentName} has been cancelled.`,
    });
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <>
      <DialogHeader className="p-6 pb-4 border-b">
         <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Manage Demo Session
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-0.5">
              Update details for the demo with {demoSession.studentName} for {demoSession.subject}.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pt-5 pb-6 space-y-5">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal pl-3 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || isSubmitting}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={new Date().getFullYear()}
                      toYear={new Date().getFullYear() + 2}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                        <ClockIcon className="mr-2 h-4 w-4 opacity-50" />
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map(slot => (
                        <SelectItem key={`start-${slot.value}`} value={slot.value}>{slot.label}</SelectItem>
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
                   <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                        <ClockIcon className="mr-2 h-4 w-4 opacity-50" />
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {durationOptions.map(option => (
                        <SelectItem key={option.value} value={String(option.value)}>{option.label}</SelectItem>
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
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                          type="url" 
                          placeholder="https://zoom.us/j/yourmeetingid" 
                          {...field} 
                          className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"
                          disabled={isSubmitting}
                      />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter className="gap-2 flex-col sm:flex-row sm:justify-between pt-3">
             <Button
              type="button"
              variant="destructiveOutline" 
              onClick={handleCancelDemo}
              disabled={isSubmitting}
              className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95 text-xs py-2 px-3.5"
            >
              <Ban className="mr-1.5 h-3.5 w-3.5" />
              Cancel Session
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
              className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95 text-xs py-2 px-3.5"
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {isSubmitting ? "Updating..." : "Update Session"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}

    