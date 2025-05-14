
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation"; // Added for navigation after edit

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import type { TuitionRequirement } from "@/types";
import { cn } from "@/lib/utils";
import React from "react"; // Ensure React is imported for useEffect

const subjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));
const gradeLevelsList = ["Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner", "Other"];
const boardsList = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"];
const teachingModeOptions = [
  { id: "Online", label: "Online" },
  { id: "Offline (In-person)", label: "Offline (In-person)" },
];
const daysOptions: MultiSelectOption[] = [
  { value: "Monday", label: "Monday" }, { value: "Tuesday", label: "Tuesday" }, { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" }, { value: "Friday", label: "Friday" }, { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" }, { value: "Weekdays", label: "Weekdays" }, { value: "Weekends", label: "Weekends" },
  { value: "Flexible", label: "Flexible"},
];
const timeSlotsOptions: MultiSelectOption[] = [
  { value: "0800-1000", label: "8:00 AM - 10:00 AM" }, { value: "1000-1200", label: "10:00 AM - 12:00 PM" },
  { value: "1200-1400", label: "12:00 PM - 2:00 PM" }, { value: "1400-1600", label: "2:00 PM - 4:00 PM" },
  { value: "1600-1800", label: "4:00 PM - 6:00 PM" }, { value: "1800-2000", label: "6:00 PM - 8:00 PM" },
  { value: "2000-2200", label: "8:00 PM - 10:00 PM" }, { value: "Flexible", label: "Flexible"},
];

const tuitionRequirementSchema = z.object({
  subject: z.array(z.string()).min(1, { message: "Please select at least one subject." }),
  gradeLevel: z.string().min(1, { message: "Grade level is required." }),
  board: z.string().min(1, { message: "Board is required."}),
  teachingMode: z.array(z.string()).min(1, { message: "Please select at least one teaching mode." }),
  location: z.string().optional().or(z.literal("")),
  preferredDays: z.array(z.string()).min(1, "Please select at least one preferred day."),
  preferredTimeSlots: z.array(z.string()).min(1, "Please select at least one preferred time slot."),
  scheduleDetails: z.string().min(10, { message: "Please provide schedule details (at least 10 characters)." }),
  additionalNotes: z.string().optional(),
}).refine(data => {
  if (data.teachingMode.includes("Offline (In-person)") && (!data.location || data.location.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Location is required for Offline (In-person) teaching mode.",
  path: ["location"],
});

type TuitionRequirementFormValues = z.infer<typeof tuitionRequirementSchema>;

interface TuitionRequirementFormProps {
  initialData?: TuitionRequirement;
  isEditing?: boolean;
  onSuccess?: () => void; // Callback for successful submission
}

export function TuitionRequirementForm({ initialData, isEditing = false, onSuccess }: TuitionRequirementFormProps) {
  const { toast } = useToast();
  const router = useRouter(); 
  const form = useForm<TuitionRequirementFormValues>({
    resolver: zodResolver(tuitionRequirementSchema),
    defaultValues: initialData ? {
      ...initialData,
      teachingMode: initialData.teachingMode || [],
      preferredDays: initialData.preferredDays || [],
      preferredTimeSlots: initialData.preferredTimeSlots || [],
    } : {
      subject: [],
      gradeLevel: "",
      board: "",
      teachingMode: [],
      location: "Online",
      preferredDays: [],
      preferredTimeSlots: [],
      scheduleDetails: "",
      additionalNotes: "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        teachingMode: initialData.teachingMode || [],
        preferredDays: initialData.preferredDays || [],
        preferredTimeSlots: initialData.preferredTimeSlots || [],
      });
    }
  }, [initialData, form]);

  function onSubmit(values: TuitionRequirementFormValues) {
    console.log(isEditing ? "Updating Requirement:" : "Posting Requirement:", values);
    toast({
      title: isEditing ? "Requirement Updated!" : "Requirement Posted!",
      description: `Your tuition requirement for ${values.subject.join(', ')} has been ${isEditing ? 'updated' : 'posted'}.`,
    });
    if (onSuccess) {
      onSuccess();
    } else if (isEditing) {
      router.push("/dashboard/my-requirements");
    } else {
      form.reset(); 
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Tuition Requirement" : "Post a New Tuition Requirement"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update the details of your existing requirement." : "Fill in the details below to find the perfect tutor for your needs."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Subject(s)</FormLabel>
                   <MultiSelectCommand
                      options={subjectsList}
                      selectedValues={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select subjects..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
                    />
                  <FormDescription>
                    Which subject(s) do you need a tutor for? You can select multiple.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/50">
                          <SelectValue placeholder="Select a grade level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gradeLevelsList.map(gl => <SelectItem key={gl} value={gl}>{gl}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="board"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/50">
                          <SelectValue placeholder="Select a board" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {boardsList.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="teachingMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Preferred Teaching Mode</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {teachingModeOptions.map((option) => (
                      <FormItem key={option.id}>
                         <Label
                            htmlFor={`teaching-mode-form-${option.id}`}
                            className={cn(
                              "flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md bg-input/30 hover:bg-accent/50 transition-colors cursor-pointer",
                              field.value?.includes(option.id) && "bg-primary/10 border-primary ring-1 ring-primary"
                            )}
                          >
                          <FormControl>
                            <Checkbox
                              id={`teaching-mode-form-${option.id}`}
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || [];
                                return checked
                                  ? field.onChange([...currentValues, option.id])
                                  : field.onChange(currentValues.filter(value => value !== option.id));
                              }}
                            />
                          </FormControl>
                          <span className="font-normal text-sm">{option.label}</span>
                        </Label>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("teachingMode")?.includes("Offline (In-person)") && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Location (for In-person)</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Student's Home, City Center Library" {...field} className="transition-all duration-300 focus:ring-2 focus:ring-primary/50" />
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
                    <FormLabel>Preferred Days</FormLabel>
                    <MultiSelectCommand
                      options={daysOptions}
                      selectedValues={field.value || []}
                      onValueChange={(values) => field.onChange(values)}
                      placeholder="Select preferred days..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
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
                    <FormLabel>Preferred Time Slots</FormLabel>
                    <MultiSelectCommand
                      options={timeSlotsOptions}
                      selectedValues={field.value || []}
                      onValueChange={(values) => field.onChange(values)}
                      placeholder="Select preferred time slots..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="scheduleDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Details & Other Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Weekdays after 5 PM, 2-3 times a week. Student needs help with exam preparation..."
                      className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your preferred days, times, frequency, and any specific goals.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto transform transition-transform hover:scale-105 active:scale-95" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (isEditing ? "Updating..." : "Posting...") : (isEditing ? "Update Requirement" : "Post Requirement")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
