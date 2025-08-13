
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BookOpen, GraduationCap, Briefcase, DollarSign, Info, RadioTower, MapPin, Edit, CalendarDays, Clock, ShieldCheck, X, Languages, CheckSquare, ChevronDown } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { LocationAutocompleteInput, type LocationDetails } from "@/components/shared/LocationAutocompleteInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiTutor } from "@/types";

const subjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));
const gradeLevelsList: MultiSelectOption[] = ["Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner", "Other"].map(gl => ({ value: gl, label: gl }));
const experienceLevels = ["Less than 1 year", "1-3 years", "3-5 years", "5-7 years", "7+ years", "10+ years"];
const boardsList: MultiSelectOption[] = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"].map(b => ({ value: b, label: b }));
const qualificationsList: MultiSelectOption[] = ["Bachelor's Degree", "Master's Degree", "PhD", "Teaching Certification", "Subject Matter Expert", "Other"].map(q => ({ value: q, label: q }));
const languagesList: MultiSelectOption[] = ["English", "Hindi", "Spanish", "French", "German", "Mandarin", "Japanese", "Other"].map(l => ({ value: l, label: l }));

const teachingModeItems = [
  { id: "online", label: "Online" },
  { id: "offline", label: "Offline (In-person)" },
];

const daysOptionsList: MultiSelectOption[] = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
  { value: "Weekdays", label: "Weekends" },
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

const adminTutorUpdateSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  gender: z.string().min(1, "Gender is required."),
  bio: z.string().max(500, "Bio should not exceed 500 characters.").optional().or(z.literal("")),
  hourlyRate: z.number({ coerce: true }).min(0, "Rate must be a positive number.").optional(),
  isRateNegotiable: z.boolean().default(false).optional(),
  experienceYears: z.string().min(1, "Experience level is required."),
  qualifications: z.array(z.string()).min(1, "Please select at least one qualification."),
  languages: z.array(z.string()).min(1, "Please select at least one language you speak."),
  subjects: z.array(z.string()).min(1, "Please select at least one subject."),
  grades: z.array(z.string()).min(1, "Please select at least one grade level."),
  boards: z.array(z.string()).min(1, "Please select at least one board."),
  availabilityDays: z.array(z.string()).min(1, "Please select at least one available day."),
  availabilityTime: z.array(z.string()).min(1, "Please select at least one available time slot."),
  online: z.boolean().default(false),
  offline: z.boolean().default(false),
  isHybrid: z.boolean().default(false),
});

type AdminTutorUpdateFormValues = z.infer<typeof adminTutorUpdateSchema>;

interface AdminUpdateTutorModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutor: ApiTutor | null;
}

export function AdminUpdateTutorModal({ isOpen, onOpenChange, tutor }: AdminUpdateTutorModalProps) {
  const { toast } = useToast();
  const form = useForm<AdminTutorUpdateFormValues>({
    resolver: zodResolver(adminTutorUpdateSchema),
    defaultValues: {},
  });

  React.useEffect(() => {
    if (tutor && isOpen) {
      form.reset({
        displayName: tutor.displayName,
        gender: tutor.gender,
        bio: tutor.bio,
        hourlyRate: tutor.hourlyRate,
        isRateNegotiable: tutor.isRateNegotiable,
        experienceYears: tutor.experienceYears,
        qualifications: tutor.qualificationList,
        languages: tutor.languagesList,
        subjects: tutor.subjectsList,
        grades: tutor.gradesList,
        boards: tutor.boardsList,
        availabilityDays: tutor.availabilityDaysList,
        availabilityTime: tutor.availabilityTimeList,
        online: tutor.online,
        offline: tutor.offline,
        isHybrid: tutor.isHybrid,
      });
    }
  }, [tutor, isOpen, form]);

  const onSubmit = (data: AdminTutorUpdateFormValues) => {
    console.log("Submitting admin tutor update:", data);
    toast({
      title: "Tutor Updated (Mock)",
      description: "The tutor's details have been updated successfully.",
    });
    onOpenChange(false);
  };

  if (!tutor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle>Update Tutor: {tutor.displayName}</DialogTitle>
            </DialogHeader>
            <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-primary/80"/>Bio / Teaching Philosophy</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Max 500 characters..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="subjects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-primary/80"/>Subjects Taught</FormLabel>
                      <MultiSelectCommand
                        options={subjectsList}
                        selectedValues={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select subjects..."
                        className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="grades"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Grade Levels Taught</FormLabel>
                      <MultiSelectCommand
                        options={gradeLevelsList}
                        selectedValues={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select grade levels..."
                        className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="boards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-primary/80"/>Boards</FormLabel>
                      <MultiSelectCommand
                        options={boardsList}
                        selectedValues={field.value}
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
                      <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Qualifications</FormLabel>
                      <MultiSelectCommand
                        options={qualificationsList}
                        selectedValues={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select qualifications..."
                        className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Languages className="mr-2 h-4 w-4 text-primary/80"/>Languages Spoken</FormLabel>
                      <MultiSelectCommand
                        options={languagesList}
                        selectedValues={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select languages..."
                        className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-primary/80" />Experience</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"><SelectValue placeholder="Select experience" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {experienceLevels.map(exp => <SelectItem key={exp} value={exp}>{exp}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormItem>
                        <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-primary/80"/>Hourly Rate (₹)</FormLabel>
                        <FormField
                        control={form.control}
                        name="hourlyRate"
                        render={({ field }) => (
                            <FormItem className="flex-grow">
                            <FormControl>
                                <Input type="number" placeholder="e.g., 800" {...field} className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </FormItem>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="availabilityDays"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary/80"/>Available Days</FormLabel>
                        <MultiSelectCommand
                            options={daysOptionsList}
                            selectedValues={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select days..."
                            className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                        />
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="availabilityTime"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary/80"/>Available Time Slots</FormLabel>
                        <MultiSelectCommand
                            options={timeSlotsOptionsList}
                            selectedValues={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select time slots..."
                            className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                        />
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

              </div>
            </CardContent>
            <DialogFooter className="p-6 border-t">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

