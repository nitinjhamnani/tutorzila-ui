"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquareQuote, Send, Quote as QuoteIcon, Phone, User, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import AuthModal from "@/components/auth/AuthModal";

const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.enum(["parent", "tutor"], { required_error: "Please select your role." }),
  phone: z.string().length(10, { message: "Phone number must be 10 digits." }).regex(/^\d+$/, "Phone number must be digits only."),
  rating: z.number().min(1, "Please provide a rating.").max(5),
  comment: z.string().min(20, "Your feedback must be at least 20 characters.").max(500, "Your feedback cannot exceed 500 characters."),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const StarRating = ({
  rating,
  setRating,
  disabled,
}: {
  rating: number;
  setRating: (rating: number) => void;
  disabled: boolean;
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 p-0 text-muted-foreground transition-colors duration-200",
            (hoveredRating ?? rating) >= star && "text-yellow-400",
            disabled && "cursor-not-allowed"
          )}
          onClick={() => !disabled && setRating(star)}
          onMouseEnter={() => !disabled && setHoveredRating(star)}
          onMouseLeave={() => !disabled && setHoveredRating(null)}
          disabled={disabled}
        >
          <Star
            className={cn(
              "h-7 w-7 transition-all",
              (hoveredRating ?? rating) >= star ? "fill-current" : ""
            )}
          />
        </Button>
      ))}
    </div>
  );
};

export default function FeedbackPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'signin' | 'signup'>('signup');

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      phone: "",
      rating: 0,
      comment: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(values: FeedbackFormValues) {
    setIsSubmitting(true);
    console.log("Feedback Submitted:", values);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Thank You for Your Feedback!",
      description: "Your feedback has been submitted successfully.",
    });
    form.reset();
    setIsSubmitting(false);
  }

  const handleTriggerSignUp = () => {
    setAuthModalInitialView('signup');
    setIsAuthModalOpen(true);
  };

  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";
  const sectionPadding = "py-10 md:py-16";

  return (
    <>
      <div className={`${containerPadding} py-12`}>
        <div className="text-center mb-12 animate-in fade-in duration-500 ease-out">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Share Your Feedback</h1>
          <p className="mt-2 text-md text-muted-foreground max-w-2xl mx-auto">
            We value your opinion! Let us know how we're doing and how we can improve our services.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto bg-card border rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-2xl font-semibold text-primary flex items-center">
              <MessageSquareQuote className="mr-2.5 h-6 w-6" />
              Feedback Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Overall Rating</FormLabel>
                      <FormControl>
                        <StarRating rating={field.value} setRating={(r) => field.onChange(r)} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><User className="h-4 w-4 mr-2"/>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>You are a...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                          disabled={isSubmitting}
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="parent" />
                            </FormControl>
                            <FormLabel className="font-normal">Parent</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="tutor" />
                            </FormControl>
                            <FormLabel className="font-normal">Tutor</FormLabel>
                          </FormItem>
                        </RadioGroup>
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
                      <FormLabel className="flex items-center"><Phone className="h-4 w-4 mr-2"/>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Your 10-digit phone number"
                          maxLength={10}
                          {...field}
                          onChange={(e) => {
                              const value = e.target.value;
                              const numericValue = value.replace(/[^0-9]/g, '');
                              field.onChange(numericValue);
                          }}
                          disabled={isSubmitting}
                        />
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
                      <FormLabel>Your Feedback</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your experience..."
                          className="resize-none"
                          rows={5}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                   <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <section className={`w-full text-center ${sectionPadding} bg-primary`}>
        <div className={`${containerPadding} animate-in fade-in zoom-in-95 duration-700 ease-out`}>
          <div className="inline-block p-4 bg-primary-foreground/10 rounded-full mb-5 shadow-sm">
            <Star className="w-9 h-9 text-white"/>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-white/90 md:text-lg">
            Whether you&apos;re looking for a tutor or want to share your expertise, Tutorzila is the place to connect and grow.
          </p>
          <div className="mt-10">
            <Button size="lg" variant="secondary" className="shadow-xl text-secondary-foreground hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-100 animate-pulse-once py-3.5 px-8 text-base" onClick={handleTriggerSignUp}>
              Sign Up Now <Send className="ml-2.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className={`w-full bg-secondary ${sectionPadding}`}>
        <div className={`${containerPadding}`}>
          <div className="text-center mb-12 md:mb-16 animate-in fade-in duration-500 ease-out">
            <div className="inline-block p-3.5 bg-primary/10 rounded-full mb-4 shadow-sm">
              <QuoteIcon className="w-8 h-8 text-primary"/>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">What Our Users Say</h2>
          </div>
          <Carousel
            opts={{ align: "start", loop: MOCK_TESTIMONIALS.length > 2 }}
            className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-3.5 md:-ml-4.5">
              {MOCK_TESTIMONIALS.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="basis-full sm:basis-1/2 lg:basis-1/3 pl-3.5 md:pl-4.5">
                  <div className="p-1.5 h-full">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center items-center mt-10 space-x-4">
              <CarouselPrevious className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
              <CarouselNext className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
            </div>
          </Carousel>
        </div>
      </section>

      <section className={`w-full bg-primary text-primary-foreground ${sectionPadding}`}>
        <div className={`${containerPadding} text-center`}>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
            Stay Updated with Tutorzila
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-white/90 md:text-lg">
            Subscribe to our newsletter for the latest updates on tutors, special offers, and educational tips.
          </p>
          <div className="mt-8 max-w-lg mx-auto">
            <form className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow bg-card/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white focus:text-card-foreground py-3.5 px-4 text-base h-auto"
                aria-label="Email address"
              />
              <Button type="submit" variant="secondary" size="lg" className="shrink-0 text-secondary-foreground shadow-md hover:shadow-lg transition-shadow">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onOpenChange={setIsAuthModalOpen} 
          initialForm={authModalInitialView}
        />
      )}
    </>
  );
}
