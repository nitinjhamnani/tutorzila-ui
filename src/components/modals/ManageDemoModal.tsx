
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
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, LinkIcon, ClockIcon, Save, Ban, Edit3 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DemoSession } from "@/types";

const manageDemoSchema = z.object({
  date: z.date({ required_error: "Please select a date." }),
  time: z.string().min(1, "Time is required. e.g., 5:00 PM - 5:30 PM"),
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

  const form = useForm<ManageDemoFormValues>({
    resolver: zodResolver(manageDemoSchema),
    defaultValues: {
      date: new Date(demoSession.date),
      time: demoSession.time,
      meetingUrl: demoSession.joinLink || "",
    },
  });

  useEffect(() => {
    if (demoSession) {
      form.reset({
        date: new Date(demoSession.date),
        time: demoSession.time,
        meetingUrl: demoSession.joinLink || "",
      });
    }
  }, [demoSession, form]);

  const onSubmit: SubmitHandler<ManageDemoFormValues> = async (data) => {
    setIsSubmitting(true);
    const updatedDemoData: DemoSession = {
      ...demoSession,
      date: data.date.toISOString(),
      time: data.time,
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
              Update details for the demo with {demoSession.studentName}.
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

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="e.g., 4:00 PM - 4:30 PM" 
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
              variant="destructive"
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
