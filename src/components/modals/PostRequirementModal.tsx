
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { User, BookOpen, Settings2, ArrowLeft, ArrowRight, Send } from "lucide-react";

const subjectsList = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"];
const gradeLevelsList = ["Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner", "Other"];
const boardsList = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"];
const teachingModeOptions = [
  { id: "online", label: "Online" },
  { id: "in-person", label: "In-person" },
  { id: "hybrid", label: "Hybrid" },
];

const postRequirementSchema = z.object({
  // Step 1
  name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format."),
  // Step 2
  subject: z.string({ required_error: "Please select a subject." }).min(1, "Please select a subject."),
  gradeLevel: z.string({ required_error: "Please select a grade level." }).min(1, "Please select a grade level."),
  board: z.string({ required_error: "Please select a board." }).min(1, "Please select a board."),
  // Step 3
  teachingMode: z.enum(["online", "in-person", "hybrid"], { required_error: "Please select a teaching mode." }),
  availability: z.string().min(10, { message: "Availability details must be at least 10 characters." }),
});

type PostRequirementFormValues = z.infer<typeof postRequirementSchema>;

interface PostRequirementModalProps {
  onSuccess: () => void;
}

export function PostRequirementModal({ onSuccess }: PostRequirementModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const { toast } = useToast();

  const form = useForm<PostRequirementFormValues>({
    resolver: zodResolver(postRequirementSchema),
    defaultValues: {
      name: "",
      phone: "",
      subject: "",
      gradeLevel: "",
      board: "",
      teachingMode: undefined, 
      availability: "",
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof PostRequirementFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'phone'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['subject', 'gradeLevel', 'board'];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Highlight errors for the current step
      if (currentStep === 1) {
        if (form.formState.errors.name) form.setFocus("name");
        else if (form.formState.errors.phone) form.setFocus("phone");
      } else if (currentStep === 2) {
         if (form.formState.errors.subject) form.setFocus("subject");
         else if (form.formState.errors.gradeLevel) form.setFocus("gradeLevel");
         else if (form.formState.errors.board) form.setFocus("board");
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit: SubmitHandler<PostRequirementFormValues> = (data) => {
    console.log("Tuition Requirement Submitted:", data);
    toast({
      title: "Requirement Submitted!",
      description: "Your tuition requirement has been successfully posted. Tutors will reach out soon.",
      duration: 5000,
    });
    form.reset();
    setCurrentStep(1);
    onSuccess(); // Close the modal
  };

  return (
    <div className="bg-card p-0 rounded-lg"> {/* Ensure modal content itself has white background */}
      <DialogHeader className="text-left pt-6 px-6">
        <DialogTitle className="text-2xl font-semibold">Post Your Tuition Requirement</DialogTitle>
        <DialogDescription>
          Fill in the details below in {totalSteps} easy steps to find the perfect tutor.
        </DialogDescription>
      </DialogHeader>

      <div className="my-6 px-6">
        <Progress value={(currentStep / totalSteps) * 100} className="w-full h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center font-medium">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-6">
          {currentStep === 1 && (
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
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="e.g., +919876543210" {...field} className="bg-input border-border focus:border-primary focus:ring-primary/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-lg font-semibold flex items-center text-primary"><BookOpen className="mr-2 h-5 w-5" />Tutoring Details</h3>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30"><SelectValue placeholder="Select a subject" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjectsList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-lg font-semibold flex items-center text-primary"><Settings2 className="mr-2 h-5 w-5" />Preferences</h3>
              <FormField
                control={form.control}
                name="teachingMode"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Preferred Teaching Mode</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row gap-3"
                      >
                        {teachingModeOptions.map(opt => (
                           <FormItem key={opt.id} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={opt.id} />
                            </FormControl>
                            <FormLabel className="font-normal">{opt.label}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability &amp; Schedule</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Weekdays 5 PM - 7 PM, Weekends flexible, 3 classes per week..."
                        className="resize-none bg-input border-border focus:border-primary focus:ring-primary/30"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between pt-6">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious} className="transform transition-transform hover:scale-105 active:scale-95">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              )}
            </div>
            <div>
              {currentStep < totalSteps && (
                <Button type="button" onClick={handleNext} className="transform transition-transform hover:scale-105 active:scale-95">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {currentStep === totalSteps && (
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

