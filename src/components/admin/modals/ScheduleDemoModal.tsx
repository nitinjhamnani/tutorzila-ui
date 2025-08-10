
"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Calendar as CalendarIcon, Clock, Loader2, Send, BookOpen, Link as LinkIcon, MapPin, RadioTower, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { ApiTutor, TuitionRequirement } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const scheduleDemoSchema = z.object({
  subject: z.array(z.string()).min(1, { message: "Please select at least one subject." }),
  date: z.date({ required_error: "A date for the demo is required." }),
  time: z.string().min(1, { message: "Please select a time." }),
  duration: z.number({ coerce: true }).min(30, "Duration must be at least 30 minutes.").max(120, "Duration cannot exceed 120 minutes."),
  demoMode: z.enum(["Online", "Offline (In-person)"], { required_error: "Please select a demo mode."}),
  demoLink: z.string().optional(),
  isPaidDemo: z.boolean().default(false),
  demoFee: z.number({ coerce: true }).optional(),
}).refine(data => {
  if (data.isPaidDemo && (data.demoFee === undefined || data.demoFee <= 0)) {
    return false;
  }
  return true;
}, {
  message: "A fee is required for a paid demo.",
  path: ["demoFee"],
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

const durationOptions = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
  { value: 75, label: "75 minutes" },
  { value: 90, label: "90 minutes" },
  { value: 120, label: "120 minutes" },
];

export function ScheduleDemoModal({ isOpen, onOpenChange, tutor, enquiry }: ScheduleDemoModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectOptions: MultiSelectOption[] = useMemo(() => {
    if (!enquiry?.subject) return [];
    return enquiry.subject.map(s => ({ value: s, label: s }));
  }, [enquiry]);
  
  const isOnlineOnly = enquiry.teachingMode?.includes("Online") && enquiry.teachingMode.length === 1;
  const isOfflineOnly = enquiry.teachingMode?.includes("Offline (In-person)") && enquiry.teachingMode.length === 1;

  const form = useForm<ScheduleDemoFormValues>({
    resolver: zodResolver(scheduleDemoSchema),
    defaultValues: {
      subject: enquiry?.subject || [],
      date: new Date(),
      time: "04:00 PM",
      duration: 30,
      demoMode: isOnlineOnly ? "Online" : isOfflineOnly ? "Offline (In-person)" : undefined,
      demoLink: "",
      isPaidDemo: false,
      demoFee: undefined,
    },
  });
  
  const selectedDemoMode = form.watch("demoMode");
  const isPaidDemo = form.watch("isPaidDemo");

  useEffect(() => {
    if (isOpen) {
      form.reset({
        subject: enquiry?.subject || [],
        date: new Date(),
        time: "04:00 PM",
        duration: 30,
        demoMode: isOnlineOnly ? "Online" : isOfflineOnly ? "Offline (In-person)" : undefined,
        demoLink: "",
        isPaidDemo: false,
        demoFee: undefined,
      });
    }
  }, [isOpen, enquiry, form, isOnlineOnly, isOfflineOnly]);


  const onSubmit: SubmitHandler<ScheduleDemoFormValues> = async (data) => {
    setIsSubmitting(true);
    const samplePayload = {
      enquiryId: enquiry.id,
      tutorId: tutor.id,
      subjects: data.subject,
      demoDate: format(data.date, 'yyyy-MM-dd'),
      demoTime: data.time,
      durationInMinutes: data.duration,
      demoMode: data.demoMode,
      demoLink: data.demoMode === 'Online' ? data.demoLink : undefined,
      demoLocation: data.demoMode === 'Offline (In-person)' ? enquiry.location?.address : undefined,
      isPaidDemo: data.isPaidDemo,
      demoFee: data.isPaidDemo ? data.demoFee : undefined,
    };
    console.log("Scheduling demo with JSON payload:", JSON.stringify(samplePayload, null, 2));
    
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
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-primary/80" />Select Subject(s)</FormLabel>
                    <MultiSelectCommand
                      options={subjectOptions}
                      selectedValues={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select subjects for demo..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center"><CalendarIcon className="mr-2 h-4 w-4 text-primary/80"/>Select Date</FormLabel>
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
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary/80"/>Select Time</FormLabel>
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
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary/80"/>Duration</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Duration" />
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
              name="demoMode"
              render={({ field }) => (
                  <FormItem className="space-y-2">
                      <FormLabel className="flex items-center"><RadioTower className="mr-2 h-4 w-4 text-primary/80"/>Demo Mode</FormLabel>
                      <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 gap-4"
                      >
                          <FormItem>
                              <FormControl>
                              <RadioGroupItem value="Online" id="demo-mode-online" className="sr-only"/>
                              </FormControl>
                              <FormLabel htmlFor="demo-mode-online" className={cn("flex items-center justify-center rounded-md border-2 p-3 font-normal cursor-pointer", field.value === 'Online' && 'border-primary')}>Online</FormLabel>
                          </FormItem>
                          <FormItem>
                              <FormControl>
                              <RadioGroupItem value="Offline (In-person)" id="demo-mode-offline" className="sr-only"/>
                              </FormControl>
                              <FormLabel htmlFor="demo-mode-offline" className={cn("flex items-center justify-center rounded-md border-2 p-3 font-normal cursor-pointer", field.value === 'Offline (In-person)' && 'border-primary')}>Offline</FormLabel>
                          </FormItem>
                      </RadioGroup>
                        <FormMessage />
                  </FormItem>
              )}
            />

            {selectedDemoMode === 'Online' && (
                 <FormField
                  control={form.control}
                  name="demoLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><LinkIcon className="mr-2 h-4 w-4 text-primary/80"/>Demo Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://zoom.us/j/12345..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            )}

             {selectedDemoMode === 'Offline (In-person)' && enquiry.location?.address && (
                <div className="space-y-1">
                  <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary/80"/>Demo Location</FormLabel>
                  <p className="text-sm p-3 bg-muted rounded-md">{enquiry.location.address}</p>
                </div>
            )}
            
            <FormField
              control={form.control}
              name="isPaidDemo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 rounded-lg border p-3 shadow-sm bg-input/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="is-paid-demo-checkbox"
                    />
                  </FormControl>
                  <Label htmlFor="is-paid-demo-checkbox" className="text-sm font-medium leading-none cursor-pointer">
                    This is a paid demo session.
                  </Label>
                </FormItem>
              )}
            />

            {isPaidDemo && (
              <FormField
                control={form.control}
                name="demoFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-primary/80"/>Demo Fee (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter amount" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
