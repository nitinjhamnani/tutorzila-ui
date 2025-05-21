
"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { Label } from "@/components/ui/label";
import type { TuitionRequirement } from "@/types";
import { cn } from "@/lib/utils";
import { BookOpen, GraduationCap, Building, RadioTower, MapPin, CalendarDays, Clock, Info, Save } from "lucide-react";

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

const parentEnquiryEditSchema = z.object({
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

type ParentEnquiryEditFormValues = z.infer<typeof parentEnquiryEditSchema>;

interface ParentEnquiryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  enquiryData: TuitionRequirement | null;
  onUpdateEnquiry: (updatedData: Partial<TuitionRequirement>) => void;
}

export function ParentEnquiryModal({ isOpen, onOpenChange, enquiryData, onUpdateEnquiry }: ParentEnquiryModalProps) {
  const form = useForm<ParentEnquiryEditFormValues>({
    resolver: zodResolver(parentEnquiryEditSchema),
    defaultValues: {
      subject: [],
      gradeLevel: "",
      board: "",
      teachingMode: [],
      location: "",
      preferredDays: [],
      preferredTimeSlots: [],
      scheduleDetails: "",
      additionalNotes: "",
    },
  });

  useEffect(() => {
    if (enquiryData && isOpen) {
      form.reset({
        subject: Array.isArray(enquiryData.subject) ? enquiryData.subject : [enquiryData.subject],
        gradeLevel: enquiryData.gradeLevel || "",
        board: enquiryData.board || "",
        teachingMode: enquiryData.teachingMode || [],
        location: enquiryData.location || "",
        preferredDays: enquiryData.preferredDays || [],
        preferredTimeSlots: enquiryData.preferredTimeSlots || [],
        scheduleDetails: enquiryData.scheduleDetails || "",
        additionalNotes: enquiryData.additionalNotes || "",
      });
    }
  }, [enquiryData, isOpen, form]);

  const onSubmit: SubmitHandler<ParentEnquiryEditFormValues> = (data) => {
    if (!enquiryData) return;
    onUpdateEnquiry({ ...enquiryData, ...data });
    onOpenChange(false); // Close modal on successful update
  };

  if (!enquiryData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card p-0 rounded-lg overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold text-primary">Edit Tuition Requirement</DialogTitle>
          <DialogDescription>
            Update the details for your enquiry: {Array.isArray(enquiryData.subject) ? enquiryData.subject.join(', ') : enquiryData.subject}.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-6 max-h-[70vh] overflow-y-auto">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-primary/80"/>Subject(s)</FormLabel>
                   <MultiSelectCommand
                      options={subjectsList}
                      selectedValues={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select subjects..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                    />
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
                    <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Grade Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"><SelectValue placeholder="Select a grade level" /></SelectTrigger>
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
                    <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4 text-primary/80"/>Board</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"><SelectValue placeholder="Select a board" /></SelectTrigger>
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
              render={() => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center"><RadioTower className="mr-2 h-4 w-4 text-primary/80"/>Teaching Mode</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {teachingModeOptions.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="teachingMode"
                      render={({ field }) => {
                        return (
                           <FormItem key={item.id}>
                            <Label
                              htmlFor={`teaching-mode-edit-${item.id}`}
                              className={cn(
                                "flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md bg-input/30 hover:bg-accent/50 transition-colors cursor-pointer",
                                field.value?.includes(item.id) && "bg-primary/10 border-primary ring-1 ring-primary"
                              )}
                            >
                              <FormControl>
                                <Checkbox
                                  id={`teaching-mode-edit-${item.id}`}
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
            
            {form.watch("teachingMode")?.includes("Offline (In-person)") && (
               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary/80"/>Location (for In-person)</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Student's Home, City Center Library" {...field} className="bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"/>
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
                      options={daysOptions}
                      selectedValues={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select preferred days..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
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
                      options={timeSlotsOptions}
                      selectedValues={field.value || []}
                      onValueChange={(values) => field.onChange(values)}
                      placeholder="Select preferred time slots..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
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
                  <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-primary/80"/>Schedule Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Weekdays after 5 PM, 2-3 times a week. Student needs help with exam preparation..."
                      className="resize-none bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-primary/80"/>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any other specific requirements or notes for the tutor." {...field} rows={3} className="bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
