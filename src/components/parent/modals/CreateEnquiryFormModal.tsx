
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  DialogContent, // Changed from Dialog
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // Added DialogClose
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
import { useToast } from "@/hooks/use-toast";
import { BookOpen, GraduationCap, Building, RadioTower, MapPin, CalendarDays, Clock, Info, Save, Send } from "lucide-react";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { TuitionRequirement } from "@/types";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";

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

const createEnquirySchema = z.object({
  subject: z.array(z.string()).min(1, { message: "Please select at least one subject." }),
  gradeLevel: z.string({ required_error: "Please select a grade level." }).min(1, "Please select a grade level."),
  board: z.string({ required_error: "Please select a board." }).min(1, "Please select a board."),
  teachingMode: z.array(z.string()).min(1, { message: "Please select at least one teaching mode." }),
  location: z.string().optional().or(z.literal("")),
  preferredDays: z.array(z.string()).min(1, "Please select at least one preferred day."),
  preferredTimeSlots: z.array(z.string()).min(1, "Please select at least one preferred time slot."),
  scheduleDetails: z.string().min(10, { message: "Please provide schedule details (at least 10 characters)." }),
  additionalNotes: z.string().optional(),
}).refine(data => {
    if (data.teachingMode?.includes("Offline (In-person)") && (!data.location || data.location.trim() === "")) {
      return false;
    }
    return true;
  }, {
    message: "Location is required for Offline (In-person) teaching mode.",
    path: ["location"],
  });

type CreateEnquiryFormValues = z.infer<typeof createEnquirySchema>;

interface CreateEnquiryFormModalProps {
  onSuccess: () => void; 
}

export function CreateEnquiryFormModal({ onSuccess }: CreateEnquiryFormModalProps) {
  const { toast } = useToast();
  const { user } = useAuthMock();

  const form = useForm<CreateEnquiryFormValues>({
    resolver: zodResolver(createEnquirySchema),
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

  const onSubmit: SubmitHandler<CreateEnquiryFormValues> = (data) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to post a requirement.", variant: "destructive" });
        return;
    }
    const newRequirement: TuitionRequirement = {
        id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        parentId: user.id,
        parentName: user.name,
        ...data,
        status: "open",
        postedAt: new Date().toISOString(),
        applicantsCount: 0,
    };

    MOCK_ALL_PARENT_REQUIREMENTS.unshift(newRequirement);
    
    console.log("New Tuition Requirement Submitted:", newRequirement);
    toast({
      title: "Requirement Submitted!",
      description: "Your tuition requirement has been successfully posted.",
      duration: 5000,
    });
    form.reset();
    onSuccess(); 
  };
  
  const isOfflineModeSelected = form.watch("teachingMode")?.includes("Offline (In-person)");

  return (
    <DialogContent className="sm:max-w-xl bg-card p-0 rounded-lg overflow-hidden">
      <DialogHeader className="text-left pt-6 px-6 pb-4 border-b">
        <DialogTitle className="text-2xl font-semibold">Post New Tuition Requirement</DialogTitle>
        <DialogDescription>
          Please fill in the details below to find the perfect tutor.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-6 pb-6 pt-4 max-h-[70vh] overflow-y-auto">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-primary/80"/>Subjects</FormLabel>
                <MultiSelectCommand
                  options={subjectsList}
                  selectedValues={field.value || []}
                  onValueChange={field.onChange}
                  placeholder="Select subjects..."
                  className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                />
                <FormDescription className="text-xs">You can select multiple subjects.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="gradeLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Grade Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm">
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
                  <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4 text-primary/80"/>Board</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm">
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
                <FormLabel className="flex items-center"><RadioTower className="mr-2 h-4 w-4 text-primary/80"/>Preferred Teaching Mode</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {teachingModeOptions.map((option) => (
                    <FormItem key={option.id}>
                      <Label
                        htmlFor={`create-mode-${option.id}`}
                        className={cn(
                          "flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md bg-input/30 hover:bg-accent/50 transition-colors cursor-pointer",
                          field.value?.includes(option.id) && "bg-primary/10 border-primary ring-1 ring-primary"
                        )}
                      >
                        <FormControl>
                          <Checkbox
                            id={`create-mode-${option.id}`}
                            checked={field.value?.includes(option.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              return checked
                                ? field.onChange([...currentValues, option.id])
                                : field.onChange(currentValues.filter(v => v !== option.id));
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
          
          {isOfflineModeSelected && (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="preferredDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary/80"/>Preferred Days</FormLabel>
                  <MultiSelectCommand
                    options={daysOptions}
                    selectedValues={field.value || []}
                    onValueChange={(values) => field.onChange(values)}
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
                <FormDescription className="text-xs">Provide specific timings, frequency, and goals.</FormDescription>
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
              <Send className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? "Submitting..." : "Submit Requirement"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

