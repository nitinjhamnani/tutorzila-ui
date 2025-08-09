
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { ApiTutor, TuitionRequirement } from "@/types";
import { useToast } from "@/hooks/use-toast";

const scheduleDemoSchema = z.object({
  date: z.date({ required_error: "A date for the demo is required." }),
  time: z.string().min(1, { message: "Please select a time." }),
});

type ScheduleDemoFormValues = z.infer<typeof scheduleDemoSchema>;

interface ScheduleDemoModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutor: ApiTutor;
  enquiry: TuitionRequirement;
}

const timeSlots = Array.from({ length: 2 * (21 - 7) + 1 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7;
    const minute = (i % 2) * 30;
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return format(date, "hh:mm a");
});


export function ScheduleDemoModal({ isOpen, onOpenChange, tutor, enquiry }: ScheduleDemoModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScheduleDemoFormValues>({
    resolver: zodResolver(scheduleDemoSchema),
    defaultValues: {
      date: new Date(),
      time: "04:00 PM",
    },
  });

  const onSubmit: SubmitHandler<ScheduleDemoFormValues> = async (data) => {
    setIsSubmitting(true);
    console.log("Scheduling demo with data:", { ...data, tutorId: tutor.id, enquiryId: enquiry.id });
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Demo Scheduled!",
      description: `A demo has been scheduled with ${tutor.displayName} for ${enquiry.studentName}.`,
    });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Schedule Demo Session</DialogTitle>
          <DialogDescription>
            Schedule a demo for {enquiry.studentName} with tutor {tutor.displayName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Time</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {isSubmitting ? "Scheduling..." : "Schedule Demo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
