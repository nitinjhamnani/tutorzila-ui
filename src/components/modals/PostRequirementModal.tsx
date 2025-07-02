
"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { User, BookOpen, Settings2, ArrowLeft, ArrowRight, Send, CalendarDays, Clock, MapPin, Info, Phone } from "lucide-react";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const subjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));
const gradeLevelsList = ["Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner", "Other"];
const boardsList = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"];

const teachingModeOptions = [
  { id: "Online", label: "Online" },
  { id: "Offline (In-person)", label: "Offline (In-person)" },
];

const daysOptions: MultiSelectOption[] = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
  { value: "Weekdays", label: "Weekdays" },
  { value: "Weekends", label: "Weekends" },
  { value: "Flexible", label: "Flexible"},
];

const timeSlotsOptions: MultiSelectOption[] = [
  { value: "0800-1000", label: "8:00 AM - 10:00 AM" },
  { value: "1000-1200", label: "10:00 AM - 12:00 PM" },
  { value: "1200-1400", label: "12:00 PM - 2:00 PM" },
  { value: "1400-1600", label: "2:00 PM - 4:00 PM" },
  { value: "1600-1800", label: "4:00 PM - 6:00 PM" },
  { value: "1800-2000", label: "6:00 PM - 8:00 PM" },
  { value: "2000-2200", label: "8:00 PM - 10:00 PM" },
  { value: "Flexible", label: "Flexible"},
];

const MOCK_COUNTRIES = [
  { country: "IN", countryCode: "+91", label: "India (+91)" },
  { country: "US", countryCode: "+1", label: "USA (+1)" },
  { country: "GB", countryCode: "+44", label: "UK (+44)" },
  { country: "AU", countryCode: "+61", label: "Australia (+61)" },
  { country: "JP", countryCode: "+81", label: "Japan (+81)" },
];


const postRequirementSchema = z.object({
  // Step 1 - Now optional
  name: z.string().min(2, { message: "Full name must be at least 2 characters." }).optional().or(z.literal("")),
  country: z.string().min(2, "Country is required."),
  localPhoneNumber: z.string().min(5, { message: "Phone number must be at least 5 digits." }).regex(/^\d+$/, "Phone number must be digits only.").optional().or(z.literal("")),
  // Step 2
  subject: z.array(z.string()).min(1, { message: "Please select at least one subject." }),
  gradeLevel: z.string({ required_error: "Please select a grade level." }).min(1, "Please select a grade level."),
  board: z.string({ required_error: "Please select a board." }).min(1, "Please select a board."),
  // Step 3
  teachingMode: z.array(z.string()).min(1, { message: "Please select at least one teaching mode." }),
  location: z.string().optional().or(z.literal("")), // Added location field
  preferredDays: z.array(z.string()).min(1, { message: "Please select at least one preferred day." }),
  preferredTimeSlots: z.array(z.string()).min(1, { message: "Please select at least one preferred time slot." }),
  scheduleDetails: z.string().min(10, { message: "Please provide schedule details (at least 10 characters)." }),
  additionalNotes: z.string().optional(),
}).refine(data => {
    // Location is required only if "Offline (In-person)" is selected and the field is actually present in the form data (i.e., step 3 is active)
    if (data.teachingMode?.includes("Offline (In-person)") && (!data.location || data.location.trim() === "")) {
      return false;
    }
    return true;
  }, {
    message: "Location is required for Offline (In-person) teaching mode.",
    path: ["location"],
  });


type PostRequirementFormValues = z.infer<typeof postRequirementSchema>;

interface PostRequirementModalProps {
  onSuccess: () => void;
  startFromStep?: 1 | 2;
}

export function PostRequirementModal({ onSuccess, startFromStep = 1 }: PostRequirementModalProps) {
  const initialStep = startFromStep;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const totalSchemaSteps = 3; // Total steps in the schema
  const displayTotalSteps = totalSchemaSteps - (initialStep === 2 ? 1 : 0);

  const { toast } = useToast();

  const form = useForm<PostRequirementFormValues>({
    resolver: zodResolver(postRequirementSchema),
    defaultValues: {
      name: "",
      country: "IN",
      localPhoneNumber: "",
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

  // Reset currentStep if startFromStep changes (e.g., modal re-rendered with different prop)
  useEffect(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof PostRequirementFormValues)[] = [];
    if (currentStep === 1 && initialStep === 1) {
      fieldsToValidate = ['name', 'localPhoneNumber'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['subject', 'gradeLevel', 'board'];
    }
    // Step 3 fields will be validated by the final submit

    const isValid = fieldsToValidate.length > 0 ? await form.trigger(fieldsToValidate) : true;

    if (isValid && currentStep < totalSchemaSteps) {
      setCurrentStep((prev) => prev + 1);
    } else if (!isValid) {
      // Highlight errors for the current step
      if (currentStep === 1 && initialStep === 1) {
        if (form.formState.errors.name) form.setFocus("name");
        else if (form.formState.errors.localPhoneNumber) form.setFocus("localPhoneNumber");
      } else if (currentStep === 2) {
         if (form.formState.errors.subject) { /* Focus handled by FormMessage */ }
         else if (form.formState.errors.gradeLevel) form.setFocus("gradeLevel");
         else if (form.formState.errors.board) form.setFocus("board");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > initialStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit: SubmitHandler<PostRequirementFormValues> = (data) => {
    // If step 1 was skipped, name and phone won't be in `data` from the form.
    // In a real app, you'd fetch the logged-in user's details here.
    const submissionData = { ...data };
    if (initialStep === 2) {
      // Remove potentially empty name/phone from submission if step 1 was skipped
      // and rely on backend to associate with logged-in user.
      // For mock, this is fine.
    }
    console.log("Tuition Requirement Submitted:", submissionData);
    toast({
      title: "Requirement Submitted!",
      description: "Your tuition requirement has been successfully posted. Tutors will reach out soon.",
      duration: 5000,
    });
    form.reset();
    setCurrentStep(initialStep); // Reset to the starting step for this modal instance
    onSuccess(); // Close the modal
  };

  const displayCurrentStepForProgress = currentStep - initialStep + 1;
  const isOfflineModeSelected = form.watch("teachingMode")?.includes("Offline (In-person)");

  return (
    <div className="bg-card p-0 rounded-lg">
      <DialogHeader className="text-left pt-6 px-6">
        <DialogTitle className="text-2xl font-semibold">Post Your Tuition Requirement</DialogTitle>
        <DialogDescription>
          Fill in the details below in {displayTotalSteps} easy step{displayTotalSteps > 1 ? 's' : ''} to find the perfect tutor.
        </DialogDescription>
      </DialogHeader>

      <div className="my-6 px-6">
        <Progress value={(displayCurrentStepForProgress / displayTotalSteps) * 100} className="w-full h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center font-medium">
          Step {displayCurrentStepForProgress} of {displayTotalSteps}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-6 max-h-[65vh] overflow-y-auto">
          {currentStep === 1 && initialStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-lg font-semibold flex items-center text-primary"><User className="mr-2 h-5 w-5" />Personal Details</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} className="bg-input border-border focus:border-primary focus:ring-primary/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="w-auto min-w-[120px]">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                              <SelectValue placeholder="Country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOCK_COUNTRIES.map(c => (
                              <SelectItem key={c.country} value={c.country} className="text-sm">{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="localPhoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="tel" placeholder="XXXXXXXXXX" {...field} className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormItem>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-lg font-semibold flex items-center text-primary"><BookOpen className="mr-2 h-5 w-5" />Tutoring Details</h3>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Subjects</FormLabel>
                    <MultiSelectCommand
                      options={subjectsList}
                      selectedValues={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select subjects..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
                    />
                    <FormDescription>You can select multiple subjects.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30"><SelectValue placeholder="Select a grade level" /></SelectTrigger>
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
                    <FormLabel>Board (e.g., CBSE, ICSE, State)</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30"><SelectValue placeholder="Select a board" /></SelectTrigger>
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
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-semibold flex items-center text-primary"><Settings2 className="mr-2 h-5 w-5" />Preferences & Details</h3>
              
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
                              htmlFor={`teaching-mode-modal-${option.id}`}
                              className={cn(
                                "flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md bg-input/30 hover:bg-accent/50 transition-colors cursor-pointer",
                                field.value?.includes(option.id) && "bg-primary/10 border-primary ring-1 ring-primary"
                              )}
                            >
                            <FormControl>
                              <Checkbox
                                id={`teaching-mode-modal-${option.id}`}
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    form.setValue("teachingMode", [...currentValues, option.id], { shouldValidate: true });
                                  } else {
                                    form.setValue("teachingMode", currentValues.filter(v => v !== option.id), { shouldValidate: true });
                                  }
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

              <FormField
                control={form.control}
                name="preferredDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Preferred Days</FormLabel>
                     <MultiSelectCommand
                        options={daysOptions}
                        selectedValues={field.value || []}
                        onValueChange={(values) => field.onChange(values)}
                        placeholder="Select preferred days..."
                        className="bg-input border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
                      />
                    <FormDescription>You can select multiple days.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferredTimeSlots"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-base flex items-center"><Clock className="mr-2 h-4 w-4"/>Preferred Time Slots</FormLabel>
                    <MultiSelectCommand
                      options={timeSlotsOptions}
                      selectedValues={field.value || []}
                      onValueChange={(values) => field.onChange(values)}
                      placeholder="Select preferred time slots..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
                    />
                    <FormDescription>You can select multiple time slots.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduleDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-primary/80"/>Schedule Details & Other Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Weekdays after 5 PM, 2-3 times a week. Student needs help with exam preparation..."
                        className="resize-none bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                     <FormDescription>Provide specific timings, frequency, and goals.</FormDescription>
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
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between pt-6">
            <div>
              {currentStep > initialStep && (
                <Button type="button" variant="outline" onClick={handlePrevious} className="transform transition-transform hover:scale-105 active:scale-95">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              )}
            </div>
            <div>
              {currentStep < totalSchemaSteps && (
                <Button type="button" onClick={handleNext} className="transform transition-transform hover:scale-105 active:scale-95">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {currentStep === totalSchemaSteps && (
                <Button type="submit" disabled={form.formState.isSubmitting} className="transform transition-transform hover:scale-105 active:scale-95">
                  <Send className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting ? "Submitting..." : "Submit Requirement"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
