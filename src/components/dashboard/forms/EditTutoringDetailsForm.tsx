
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
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { useToast } from "@/hooks/use-toast";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { TutorProfile } from "@/types";
import { BookOpen, GraduationCap, Briefcase, DollarSign, Info, RadioTower, MapPin, Edit } from "lucide-react";
import React from "react";

const subjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));
const gradeLevelsList: MultiSelectOption[] = ["Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner", "Other"].map(gl => ({ value: gl, label: gl }));
const experienceLevels = ["Less than 1 year", "1-3 years", "3-5 years", "5-7 years", "7+ years", "10+ years"];
const teachingModes: Array<TutorProfile["teachingMode"]> = ["Online", "In-person", "Hybrid"];


const tutoringDetailsSchema = z.object({
  subjects: z.array(z.string()).min(1, "Please select at least one subject."),
  gradeLevelsTaught: z.array(z.string()).min(1, "Please select at least one grade level you teach."),
  experience: z.string().min(1, "Experience level is required."),
  hourlyRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid rate. e.g., 500 or 500.50").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio should not exceed 500 characters.").optional().or(z.literal("")),
  qualifications: z.string().max(300, "Qualifications should not exceed 300 chars.").optional().or(z.literal("")),
  teachingMode: z.enum(["Online", "In-person", "Hybrid"]),
  location: z.string().optional().or(z.literal("")),
}).refine(data => {
  if ((data.teachingMode === "In-person" || data.teachingMode === "Hybrid") && (!data.location || data.location.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Location is required for In-person or Hybrid teaching modes.",
  path: ["location"],
});

type TutoringDetailsFormValues = z.infer<typeof tutoringDetailsSchema>;

export function EditTutoringDetailsForm() {
  const { user, isAuthenticated } = useAuthMock();
  const tutorUser = user as TutorProfile | null;
  const { toast } = useToast();

  const form = useForm<TutoringDetailsFormValues>({
    resolver: zodResolver(tutoringDetailsSchema),
    defaultValues: {
      subjects: tutorUser?.subjects || [],
      gradeLevelsTaught: tutorUser?.gradeLevelsTaught || [],
      experience: tutorUser?.experience || "",
      hourlyRate: tutorUser?.hourlyRate || "",
      bio: tutorUser?.bio || "",
      qualifications: tutorUser?.qualifications || "",
      teachingMode: tutorUser?.teachingMode || "Online",
      location: tutorUser?.location || "",
    },
  });

  React.useEffect(() => {
    if (tutorUser) {
      form.reset({
        subjects: tutorUser.subjects || [],
        gradeLevelsTaught: tutorUser.gradeLevelsTaught || [],
        experience: tutorUser.experience || "",
        hourlyRate: tutorUser.hourlyRate || "",
        bio: tutorUser.bio || "",
        qualifications: tutorUser.qualifications || "",
        teachingMode: tutorUser.teachingMode || "Online",
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
                    selectedValues={field.value}
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
                    selectedValues={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select grade levels..."
                    className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                  />
                  <FormDescription className="text-xs">Select all grade levels you are comfortable teaching.</FormDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <FormField
              control={form.control}
              name="qualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Qualifications & Certifications</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Max 300 characters..." {...field} rows={3} className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="teachingMode"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center"><RadioTower className="mr-2 h-4 w-4 text-primary/80"/>Preferred Teaching Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"><SelectValue placeholder="Select mode" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {teachingModes.map(mode => <SelectItem key={mode} value={mode!}>{mode!}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                {(form.watch("teachingMode") === "In-person" || form.watch("teachingMode") === "Hybrid") && (
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary/80"/>Primary Tutoring Location</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Cityville Center" {...field} className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                )}
            </div>

            <Button type="submit" className="w-full mt-8 py-2.5 text-base" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Tutoring Details"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
