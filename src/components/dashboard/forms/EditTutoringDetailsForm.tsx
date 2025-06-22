
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { useToast } from "@/hooks/use-toast";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { TutorProfile } from "@/types";
import { BookOpen, GraduationCap, Briefcase, DollarSign, Info, RadioTower, MapPin, Edit, CalendarDays, Clock, ShieldCheck } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

const subjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));
const gradeLevelsList: MultiSelectOption[] = ["Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner", "Other"].map(gl => ({ value: gl, label: gl }));
const experienceLevels = ["Less than 1 year", "1-3 years", "3-5 years", "5-7 years", "7+ years", "10+ years"];
const boardsList: MultiSelectOption[] = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"].map(b => ({ value: b, label: b }));
const qualificationsList: MultiSelectOption[] = ["Bachelor's Degree", "Master's Degree", "PhD", "Teaching Certification", "Subject Matter Expert", "Other"].map(q => ({ value: q, label: q }));

const teachingModeItems = [
  { id: "Online", label: "Online" },
  { id: "In-person", label: "In-person" },
];

const daysOptionsList: MultiSelectOption[] = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
  { value: "Weekdays", label: "Weekdays" },
  { value: "Weekends", label: "Weekends" },
  { value: "Flexible", label: "Flexible" },
];

const timeSlotsOptionsList: MultiSelectOption[] = [
  { value: "0700-0900", label: "7:00 AM - 9:00 AM" },
  { value: "0900-1100", label: "9:00 AM - 11:00 AM" },
  { value: "1100-1300", label: "11:00 AM - 1:00 PM" },
  { value: "1300-1500", label: "1:00 PM - 3:00 PM" },
  { value: "1500-1700", label: "3:00 PM - 5:00 PM" },
  { value: "1700-1900", label: "5:00 PM - 7:00 PM" },
  { value: "1900-2100", label: "7:00 PM - 9:00 PM" },
  { value: "Flexible", label: "Flexible" },
];


const tutoringDetailsSchema = z.object({
  subjects: z.array(z.string()).min(1, "Please select at least one subject."),
  gradeLevelsTaught: z.array(z.string()).min(1, "Please select at least one grade level you teach."),
  boardsTaught: z.array(z.string()).min(1, "Please select at least one board."),
  preferredDays: z.array(z.string()).min(1, "Please select at least one preferred day."),
  preferredTimeSlots: z.array(z.string()).min(1, "Please select at least one preferred time slot."),
  teachingMode: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one teaching mode.",
  }),
  qualifications: z.array(z.string()).min(1, "Please select at least one qualification."),
  experience: z.string().min(1, "Experience level is required."),
  hourlyRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid rate. e.g., 500 or 500.50").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio should not exceed 500 characters.").optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
}).refine(data => {
  if (data.teachingMode.includes("In-person") && (!data.location || data.location.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Location is required for In-person teaching mode.",
  path: ["location"],
});

type TutoringDetailsFormValues = z.infer<typeof tutoringDetailsSchema>;

const ensureArray = (value: any): string[] => Array.isArray(value) ? value : [];

interface EditTutoringDetailsFormProps {
  onSuccess?: () => void;
}

export function EditTutoringDetailsForm({ onSuccess }: EditTutoringDetailsFormProps) {
  const { user, isAuthenticated } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const { toast } = useToast();

  const form = useForm<TutoringDetailsFormValues>({
    resolver: zodResolver(tutoringDetailsSchema),
    defaultValues: {
      subjects: ensureArray(tutorUser?.subjects),
      gradeLevelsTaught: ensureArray(tutorUser?.gradeLevelsTaught),
      boardsTaught: ensureArray(tutorUser?.boardsTaught),
      preferredDays: ensureArray(tutorUser?.preferredDays),
      preferredTimeSlots: ensureArray(tutorUser?.preferredTimeSlots),
      teachingMode: ensureArray(tutorUser?.teachingMode),
      qualifications: ensureArray(tutorUser?.qualifications),
      experience: tutorUser?.experience || "",
      hourlyRate: tutorUser?.hourlyRate || "",
      bio: tutorUser?.bio || "",
      location: tutorUser?.location || "",
    },
  });

  React.useEffect(() => {
    if (tutorUser) {
      form.reset({
        subjects: ensureArray(tutorUser.subjects),
        gradeLevelsTaught: ensureArray(tutorUser.gradeLevelsTaught),
        boardsTaught: ensureArray(tutorUser.boardsTaught),
        preferredDays: ensureArray(tutorUser.preferredDays),
        preferredTimeSlots: ensureArray(tutorUser.preferredTimeSlots),
        teachingMode: ensureArray(tutorUser.teachingMode),
        qualifications: ensureArray(tutorUser.qualifications),
        experience: tutorUser.experience || "",
        hourlyRate: tutorUser.hourlyRate || "",
        bio: tutorUser.bio || "",
        location: tutorUser.location || "",
      });
    }
  }, [tutorUser, form]);

  function onSubmit(data: TutoringDetailsFormValues) {
    console.log("Tutoring Details Submitted:", data);
    // Mock API call
    toast({
      title: "Tutoring Details Updated!",
      description: "Your tutoring information has been saved.",
    });
    if (onSuccess) {
      onSuccess();
    }
  }

  if (!isAuthenticated || user?.role !== 'tutor') {
    return <p className="text-center py-10">Access Denied. Only tutors can edit tutoring details.</p>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg rounded-xl border bg-card">
      <CardHeader className="p-6 border-b">
        <CardTitle className="text-xl font-semibold text-primary flex items-center">
          <Edit className="mr-2.5 h-6 w-6" />
          Edit Tutoring Details
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">Showcase your expertise and preferences to students.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-primary/80"/>Subjects You Teach</FormLabel>
                  <MultiSelectCommand
                    options={subjectsList}
                    selectedValues={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="Select subjects..."
                    className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                  />
                   <FormDescription className="text-xs">Select all subjects you are proficient in teaching.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="gradeLevelsTaught"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Grade Levels You Teach</FormLabel>
                  <MultiSelectCommand
                    options={gradeLevelsList}
                    selectedValues={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="Select grade levels..."
                    className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                  />
                  <FormDescription className="text-xs">Select all grade levels you are comfortable teaching.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boardsTaught"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-primary/80"/>Boards You're Familiar With</FormLabel>
                  <MultiSelectCommand
                    options={boardsList}
                    selectedValues={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="Select boards..."
                    className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Qualifications & Certifications</FormLabel>
                  <MultiSelectCommand
                    options={qualificationsList}
                    selectedValues={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="Select qualifications..."
                    className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-primary/80"/>Years of Experience</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"><SelectValue placeholder="Select experience" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {experienceLevels.map(exp => <SelectItem key={exp} value={exp}>{exp}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-primary/80"/>Hourly Rate (INR)</FormLabel>
                    <FormControl>
                      <Input type="text" inputMode="decimal" placeholder="e.g., 750" {...field} className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="teachingMode"
              render={() => (
                <FormItem>
                  <FormLabel className="flex items-center text-base font-medium"><RadioTower className="mr-2 h-4 w-4 text-primary/80"/>Teaching Mode</FormLabel>
                   <FormDescription className="text-xs">Select all applicable teaching modes.</FormDescription>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {teachingModeItems.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="teachingMode"
                      render={({ field }) => {
                        return (
                           <FormItem key={item.id}>
                            <Label
                              htmlFor={`teaching-mode-${item.id}`}
                              className={cn(
                                "flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md bg-input/30 hover:bg-accent/50 transition-colors cursor-pointer",
                                field.value?.includes(item.id) && "bg-primary/10 border-primary ring-1 ring-primary"
                              )}
                            >
                              <FormControl>
                                <Checkbox
                                  id={`teaching-mode-${item.id}`}
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValues, item.id])
                                      : field.onChange(currentValues.filter(value => value !== item.id));
                                  }}
                                />
                              </FormControl>
                              <span className="font-normal text-sm">{item.label}</span>
                            </Label>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("teachingMode")?.includes("In-person") && (
               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary/80"/>Primary Tutoring Location (for In-person)</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Cityville Center, or 'Student's Home'" {...field} className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="preferredDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary/80"/>Preferred Teaching Days</FormLabel>
                    <MultiSelectCommand
                      options={daysOptionsList}
                      selectedValues={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select preferred days..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredTimeSlots"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary/80"/>Preferred Time Slots</FormLabel>
                    <MultiSelectCommand
                      options={timeSlotsOptionsList}
                      selectedValues={field.value || []}
                      onValueChange={(values) => field.onChange(values)}
                      placeholder="Select preferred time slots..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-primary/80"/>Your Bio / Teaching Philosophy</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Max 500 characters..." {...field} rows={4} className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            

            <Button type="submit" className="w-full mt-8 py-2.5 text-base" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Tutoring Details"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
