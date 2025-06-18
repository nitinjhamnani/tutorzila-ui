"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { intelligentTutorMatching, type IntelligentTutorMatchingInput, type IntelligentTutorMatchingOutput } from "@/ai/flows/tutor-matcher";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import { Loader2, Lightbulb } from "lucide-react";
import TutorCard from "@/components/features/tutors/tutor-card"; // Assuming a simplified card for matched tutors
import type { MatchedTutor, Tutor } from '@/types';
import { mockTutors } from "@/lib/mock-data"; // To map matched tutors to full profiles if needed

const formSchema = z.object({
  subject: z.string().min(2, { message: "Subject must be at least 2 characters." }).max(50),
  gradeLevel: z.string().min(2, { message: "Grade level must be at least 2 characters." }).max(30),
  learningPreferences: z.string().min(10, { message: "Please describe your learning preferences (min 10 characters)." }).max(300),
});

export default function MatchForm() {
  const [isPending, startTransition] = useTransition();
  const [matchedTutors, setMatchedTutors] = useState<IntelligentTutorMatchingOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      gradeLevel: "",
      learningPreferences: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setMatchedTutors(null);
      try {
        const result = await intelligentTutorMatching(values as IntelligentTutorMatchingInput);
        if (result && result.length > 0) {
          setMatchedTutors(result);
          toast({
            title: "Tutors Found!",
            description: `We found ${result.length} tutors matching your preferences.`,
          });
        } else {
          setMatchedTutors([]);
          toast({
            title: "No Tutors Found",
            description: "We couldn't find tutors matching your exact criteria. Try broadening your search.",
            variant: "default", 
          });
        }
      } catch (error) {
        console.error("Error matching tutors:", error);
        toast({
          title: "Error",
          description: "Failed to find tutors. Please try again later.",
          variant: "destructive",
        });
      }
    });
  }

  // Helper to map AI output to full Tutor profiles if possible, or use AI output directly
  const displayTutors: Tutor[] = (matchedTutors || []).map(matchedTutor => {
    const existingTutor = mockTutors.find(t => t.name === matchedTutor.name); // Simple name match for demo
    if (existingTutor) {
      return {
        ...existingTutor,
        // Override with AI data if it's more specific or different
        expertise: [matchedTutor.expertise], 
        rating: matchedTutor.rating,
        hourlyRate: matchedTutor.hourlyRate,
      };
    }
    // If not found in mock data, create a partial Tutor object from AI output
    return {
      id: matchedTutor.name.toLowerCase().replace(/\s+/g, '-'), // Generate a temp ID
      name: matchedTutor.name,
      email: "", // Placeholder
      avatarUrl: "https://placehold.co/100x100.png", // Placeholder
      expertise: [matchedTutor.expertise],
      bio: `Specializes in ${matchedTutor.expertise}.`, // Placeholder bio
      rating: matchedTutor.rating,
      hourlyRate: matchedTutor.hourlyRate,
      availability: [], // Placeholder
      subjects: [matchedTutor.expertise], // Placeholder
      gradeLevels: [] // Placeholder
    };
  });


  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., High School Physics, Creative Writing" {...field} />
                </FormControl>
                <FormDescription>
                  What subject do you need help with?
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
                <FormControl>
                  <Input placeholder="E.g., 10th Grade, College Sophomore" {...field} />
                </FormControl>
                <FormDescription>
                  What is your current grade or academic level?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="learningPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Learning Preferences</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your preferred learning style, pace, or any specific needs.&#10;E.g., I prefer visual explanations, hands-on examples, and a patient tutor."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Help us understand how you learn best.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Matching...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Find My Tutor
              </>
            )}
          </Button>
        </form>
      </Form>

      {isPending && (
        <div className="mt-8 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Our AI is searching for the best tutors for you...</p>
        </div>
      )}

      {matchedTutors && !isPending && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">
            {matchedTutors.length > 0 ? "Recommended Tutors For You" : "No Matches Found"}
          </h2>
          {displayTutors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground">
              We couldn&apos;t find tutors that perfectly match your criteria with our current AI model. 
              You can try adjusting your preferences or browse all available <a href="/tutors" className="text-primary underline">tutors</a>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
