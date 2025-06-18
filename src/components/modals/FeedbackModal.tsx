
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const nextStepOptions = [
  { value: "start_classes", label: "Yes, I'd like to start regular classes." },
  { value: "evaluating_others", label: "I liked the demo, but I'm evaluating other tutors." },
  { value: "more_demos", label: "I'd like to request another demo session with this tutor." },
  { value: "not_liked", label: "I did not like this demo session." },
  { value: "not_decided", label: "I haven't decided yet." },
] as const;

type NextStepDecisionValue = typeof nextStepOptions[number]['value'];

const feedbackSchema = z.object({
  rating: z.number().min(1, "Rating is required.").max(5),
  comment: z.string().max(500, "Comment cannot exceed 500 characters.").optional(),
  nextStepDecision: z.enum([nextStepOptions[0].value, ...nextStepOptions.slice(1).map(o => o.value)]).optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface FeedbackModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutorName: string;
  demoSubject: string;
  onSubmitFeedback: (rating: number, comment?: string, nextStepDecision?: NextStepDecisionValue) => void;
}

export function FeedbackModal({
  isOpen,
  onOpenChange,
  tutorName,
  demoSubject,
  onSubmitFeedback,
}: FeedbackModalProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      nextStepDecision: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ rating: 0, comment: "", nextStepDecision: undefined });
    }
  }, [isOpen, form]);

  const currentRating = form.watch("rating");

  const handleSubmit: SubmitHandler<FeedbackFormValues> = (data) => {
    onSubmitFeedback(data.rating, data.comment, data.nextStepDecision);
    form.reset(); 
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card p-0 rounded-xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-lg font-semibold text-primary">Share Your Feedback</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            How was your demo session for {demoSubject} with {tutorName}?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 pt-5 pb-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 p-0 text-muted-foreground hover:text-yellow-400",
                            (hoveredRating ?? currentRating) >= star && "text-yellow-400"
                          )}
                          onClick={() => form.setValue("rating", star, { shouldValidate: true })}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(null)}
                        >
                          <Star
                            className={cn(
                              "h-6 w-6",
                              (hoveredRating ?? currentRating) >= star && "fill-current"
                            )}
                          />
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your experience..."
                      className="resize-none bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nextStepDecision"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium flex items-center">
                     <GraduationCap className="h-4 w-4 mr-2 text-primary/80"/>
                     What are your next steps?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {nextStepOptions.map(option => (
                        <FormItem 
                          key={option.value} 
                          className="flex items-center space-x-3 space-y-0 p-3 border rounded-md bg-input/30 hover:bg-accent/50 transition-colors cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary"
                        >
                          <FormControl>
                            <RadioGroupItem value={option.value} id={`next-step-${option.value}`} />
                          </FormControl>
                          <FormLabel htmlFor={`next-step-${option.value}`} className="font-normal text-sm text-foreground cursor-pointer w-full">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => { form.reset(); onOpenChange(false); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
