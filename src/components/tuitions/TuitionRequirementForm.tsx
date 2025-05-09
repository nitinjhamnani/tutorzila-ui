
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

const tuitionRequirementSchema = z.object({
  subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
  gradeLevel: z.string().min(1, { message: "Grade level is required." }),
  scheduleDetails: z.string().min(10, { message: "Please provide schedule details (at least 10 characters)." }),
  location: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type TuitionRequirementFormValues = z.infer<typeof tuitionRequirementSchema>;

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music"];
const gradeLevels = ["Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner"];
const locations = ["Online", "Student's Home", "Tutor's Home", "Public Place (e.g. Library)"];

export function TuitionRequirementForm() {
  const { toast } = useToast();
  const form = useForm<TuitionRequirementFormValues>({
    resolver: zodResolver(tuitionRequirementSchema),
    defaultValues: {
      subject: "",
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
      description: `Your tuition requirement for ${values.subject} has been posted.`,
    });
    form.reset(); // Reset form after submission
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
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
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Which subject do you need a tutor for?
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select a grade level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gradeLevels.map(gl => <SelectItem key={gl} value={gl}>{gl}</SelectItem>)}
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
                      className="resize-none"
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
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
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto">Post Requirement</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
