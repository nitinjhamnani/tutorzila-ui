
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";


const subjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));
const gradeLevelsList = ["Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner"];
const locationsList = ["Online", "Student's Home", "Tutor's Home", "Public Place (e.g. Library)"];

const tuitionRequirementSchema = z.object({
  subject: z.array(z.string()).min(1, { message: "Please select at least one subject." }),
  gradeLevel: z.string().min(1, { message: "Grade level is required." }),
  scheduleDetails: z.string().min(10, { message: "Please provide schedule details (at least 10 characters)." }),
  location: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type TuitionRequirementFormValues = z.infer<typeof tuitionRequirementSchema>;


export function TuitionRequirementForm() {
  const { toast } = useToast();
  const form = useForm<TuitionRequirementFormValues>({
    resolver: zodResolver(tuitionRequirementSchema),
    defaultValues: {
      subject: [],
      gradeLevel: "",
      scheduleDetails: "",
      location: "Online",
      additionalNotes: "",
    },
  });

  function onSubmit(values: TuitionRequirementFormValues) {
    // In a real app, you would submit this data to your backend.
    console.log(values);
    toast({
      title: "Requirement Posted!",
      description: `Your tuition requirement for ${values.subject.join(', ')} has been posted.`,
    });
    form.reset(); // Reset form after submission
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>Post a New Tuition Requirement</CardTitle>
        <CardDescription>Fill in the details below to find the perfect tutor for your needs.</CardDescription>
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

            <FormField
              control={form.control}
              name="gradeLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/50">
                        <SelectValue placeholder="Select a grade level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gradeLevelsList.map(gl => <SelectItem key={gl} value={gl}>{gl}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    What is the student&apos;s current grade level?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduleDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Schedule</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Weekdays after 5 PM, 2-3 times a week, flexible on weekends..."
                      className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your preferred days, times, and frequency for tuition.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/50">
                        <SelectValue placeholder="Select a location preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locationsList.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific requirements, learning style, or goals..."
                      className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto transform transition-transform hover:scale-105 active:scale-95">Post Requirement</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
