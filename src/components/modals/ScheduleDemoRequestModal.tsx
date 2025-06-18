
"use client";

import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription as FormDesc, 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, LinkIcon, ClockIcon, User, BookOpen, GraduationCap, Info, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMinutes, parse } from "date-fns";
import { cn } from "@/lib/utils";
import type { TutorProfile, User as ParentUserType, TuitionRequirement } from "@/types";
import { MOCK_DEMO_SESSIONS } from "@/lib/mock-data";
import { DialogFooter } from "@/components/ui/dialog";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";

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

const comprehensiveGradeLevels = [
  { value: "Nursery", label: "Nursery" },
  { value: "LKG", label: "LKG (Lower Kindergarten)" },
  { value: "UKG", label: "UKG (Upper Kindergarten)" },
  { value: "Grade 1", label: "Grade 1" },
  { value: "Grade 2", label: "Grade 2" },
  { value: "Grade 3", label: "Grade 3" },
  { value: "Grade 4", label: "Grade 4" },
  { value: "Grade 5", label: "Grade 5" },
  { value: "Grade 6", label: "Grade 6" },
  { value: "Grade 7", label: "Grade 7" },
  { value: "Grade 8", label: "Grade 8" },
  { value: "Grade 9", label: "Grade 9" },
  { value: "Grade 10", label: "Grade 10" },
  { value: "Grade 11", label: "Grade 11" },
  { value: "Grade 12", label: "Grade 12" },
  { value: "College Level", label: "College Level" },
  { value: "Adult Learner", label: "Adult Learner" },
  { value: "Other", label: "Other" },
];

// Define a comprehensive list of subjects
const allSubjectsList: MultiSelectOption[] = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English", "History", 
  "Geography", "Computer Science", "Art", "Music", "Economics", 
  "Business Studies", "Accountancy", "Social Studies", "Environmental Science",
  "French", "Spanish", "German", "Hindi", "Coding", "Robotics", "Other"
].map(s => ({ value: s, label: s }));


const scheduleDemoSchema = z.object({
  studentName: z.string().min(2, "Student name is required.").optional().or(z.literal("")),
  subject: z.array(z.string()).min(1, "At least one subject is required."),
  gradeLevel: z.string().min(1, "Grade level is required."),
  preferredDate: z.date({ required_error: "Please select a date."}),
  preferredTime: z.string().min(1, "Please select a preferred time."),
  duration: z.number({ coerce: true }).min(30).max(120),
  meetingUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  additionalNotes: z.string().max(300, "Notes cannot exceed 300 characters.").optional().or(z.literal("")),
});

type ScheduleDemoFormValues = z.infer<typeof scheduleDemoSchema>;

interface ScheduleDemoRequestModalProps {
  tutor: TutorProfile | null;
  parentUser: ParentUserType | null;
  enquiryContext?: TuitionRequirement;
  onSuccess: () => void;
}

export function ScheduleDemoRequestModal({
  tutor,
  parentUser,
  enquiryContext,
  onSuccess,
}: ScheduleDemoRequestModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  const prevTutorIdRef = useRef(tutor?.id);
  const prevEnquiryIdRef = useRef(enquiryContext?.id);

  const form = useForm<ScheduleDemoFormValues>({
    resolver: zodResolver(scheduleDemoSchema),
    defaultValues: { // Initial defaults, refined by useEffect
      studentName: "",
      subject: [],
      gradeLevel: "",
      preferredDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      preferredTime: "04:00 PM",
      duration: 30,
      meetingUrl: "",
      additionalNotes: "",
    },
  });
  
  useEffect(() => {
    const tutorIdChanged = tutor?.id !== prevTutorIdRef.current;
    const enquiryIdChanged = enquiryContext?.id !== prevEnquiryIdRef.current;
    const initialContextLoad = (!prevTutorIdRef.current && tutor?.id) || (!prevEnquiryIdRef.current && enquiryContext?.id);

    if (tutorIdChanged || enquiryIdChanged || initialContextLoad) {
      form.reset({
        studentName: "", // Always reset student name for new context
        subject: (
          enquiryContext?.subject && enquiryContext.subject.length > 0
          ? enquiryContext.subject
          : (tutor?.subjects && tutor.subjects.length > 0 ? [tutor.subjects[0]] : [])
        ),
        gradeLevel: enquiryContext?.gradeLevel || tutor?.gradeLevelsTaught?.[0] || tutor?.grade || "",
        preferredDate: form.getValues("preferredDate") || new Date(new Date().setDate(new Date().getDate() + 1)), // Preserve user selected date if context hasn't changed
        preferredTime: "04:00 PM",
        duration: 30,
        meetingUrl: "",
        additionalNotes: enquiryContext?.scheduleDetails ? `Regarding enquiry: ${enquiryContext.scheduleDetails.substring(0,100)}...` : "",
      });
      prevTutorIdRef.current = tutor?.id;
      prevEnquiryIdRef.current = enquiryContext?.id;
    }
  }, [tutor, enquiryContext, form, form.getValues]);


  const onSubmit: SubmitHandler<ScheduleDemoFormValues> = async (data) => {
    if (!tutor || !parentUser) {
        toast({ title: "Error", description: "Tutor or parent information is missing.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);

    let calculatedEndTime = "";
    try {
      const startDateTimeStr = `${format(data.preferredDate, 'yyyy-MM-dd')} ${data.preferredTime}`;
      const startDateTime = parse(startDateTimeStr, 'yyyy-MM-dd hh:mm a', new Date());
      const endDateTime = addMinutes(startDateTime, data.duration);
      calculatedEndTime = format(endDateTime, "hh:mm a");
    } catch (error) {
      console.error("Error calculating end time for demo request:", error);
      toast({
        variant: "destructive",
        title: "Time Calculation Error",
        description: "Could not calculate the end time. Please check start time and duration.",
      });
      setIsSubmitting(false);
      return;
    }

    const newDemoRequest: DemoSession = {
        id: `demo-${Date.now()}`,
        tutorId: tutor.id,
        tutorName: tutor.name,
        tutorAvatarSeed: tutor.id,
        studentName: data.studentName || parentUser.name + "'s Child",
        subject: data.subject.join(', '),
        gradeLevel: data.gradeLevel,
        board: enquiryContext?.board || (Array.isArray(tutor.boardsTaught) && tutor.boardsTaught.length > 0 ? tutor.boardsTaught[0] : "Any"),
        date: data.preferredDate.toISOString(),
        startTime: data.preferredTime,
        endTime: calculatedEndTime,
        status: "Requested",
        mode: tutor.teachingMode?.includes("Online") ? "Online" : tutor.teachingMode?.includes("Offline (In-person)") ? "Offline (In-person)" : "Online",
        joinLink: data.meetingUrl || undefined,
    };

    MOCK_DEMO_SESSIONS.push(newDemoRequest);
    console.log("Demo Request Submitted:", { ...data, parentId: parentUser.id, tutorId: tutor.id, endTime: calculatedEndTime });
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Demo Request Sent!",
      description: `Your request for a demo with ${tutor.name} for ${data.subject.join(', ')} has been sent.`,
    });
    setIsSubmitting(false);
    onSuccess();
  };
  
  if (!tutor || !parentUser) {
    return <div className="p-6 text-center text-muted-foreground">Missing required data to schedule a demo.</div>;
  }
  
  return (
    <div className="flex flex-col h-full">
      <Form {...form}>
        <form id="schedule-demo-form" onSubmit={form.handleSubmit(onSubmit)} className="px-6 pt-5 pb-6 space-y-6 flex-grow overflow-y-auto">
          <FormField
            control={form.control}
            name="studentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-sm"><User className="mr-2 h-4 w-4 text-primary/80"/>Student's Name</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Rohan, Priya (or leave blank if for yourself)" {...field} className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"/>
                </FormControl>
                <FormDesc className="text-xs">Optional. If scheduling for a child or if different from your account name.</FormDesc>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm"><BookOpen className="mr-2 h-4 w-4 text-primary/80"/>Subject(s) for Demo</FormLabel>
                   <MultiSelectCommand
                    options={allSubjectsList}
                    selectedValues={field.value || []} 
                    onValueChange={field.onChange}
                    placeholder="Select subject(s)..."
                    className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                  />
                  <FormDesc className="text-xs">Choose one or more subjects for this demo.</FormDesc>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gradeLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Student's Grade Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                        <SelectValue placeholder="Select a grade level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {comprehensiveGradeLevels.map(gl => (
                        <SelectItem key={gl.value} value={gl.value} className="text-sm">{gl.label}</SelectItem>
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
            name="preferredDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center text-sm"><CalendarIcon className="mr-2 h-4 w-4 text-primary/80"/>Preferred Demo Date</FormLabel>
                <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
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
                    <DayPicker
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                            field.onChange(date);
                            if (date) {
                                setIsDatePopoverOpen(false);
                            }
                        }}
                        disabled={[{ before: new Date(new Date().setHours(0, 0, 0, 0)) }]}
                        initialFocus
                        className="p-3 bg-popover text-popover-foreground rounded-md border"
                        classNames={{
                            caption_label: "text-sm font-medium",
                            nav_button: cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground",
                            day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                            day_disabled: "text-muted-foreground opacity-50",
                            day_hidden: "invisible",
                        }}
                        components={{ IconLeft: () => <ChevronLeft className="h-4 w-4" />, IconRight: () => <ChevronRight className="h-4 w-4" /> }}
                        />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm"><ClockIcon className="mr-2 h-4 w-4 text-primary/80"/>Preferred Demo Start Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlotsOptions.map(slot => (
                        <SelectItem key={`start-${slot.value}`} value={slot.value} className="text-sm">{slot.label}</SelectItem>
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
                  <FormLabel className="flex items-center text-sm"><ClockIcon className="mr-2 h-4 w-4 text-primary/80"/>Demo Duration</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {durationOptions.map(option => (
                        <SelectItem key={option.value} value={String(option.value)} className="text-sm">{option.label}</SelectItem>
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
                <FormLabel className="flex items-center text-sm"><LinkIcon className="mr-2 h-4 w-4 text-primary/80"/>Meeting URL (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="E.g., https://zoom.us/j/yourmeetingid"
                    {...field}
                    className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDesc className="text-xs">If you have a preferred platform (Zoom, Google Meet, etc.), provide the link. Otherwise, the tutor may provide one.</FormDesc>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-sm"><Info className="mr-2 h-4 w-4 text-primary/80"/>Specific Topics or Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="E.g., Focus on algebra concepts, prepare for upcoming test..."
                    className="resize-none bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"
                    rows={3}
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDesc className="text-xs">Let the tutor know if you have specific areas you'd like the demo to cover.</FormDesc>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter className="p-4 border-t bg-card flex-shrink-0">
        <Button type="button" variant="outline" onClick={() => { form.reset(); onSuccess();}} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" form="schedule-demo-form" disabled={isSubmitting || !form.formState.isValid} className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95">
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? "Sending Request..." : "Send Demo Request"}
        </Button>
      </DialogFooter>
    </div>
  );
}

