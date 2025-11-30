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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquareQuote, Send, Quote as QuoteIcon, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().length(10, { message: "Phone number must be 10 digits." }).regex(/^\d+$/, "Phone number must be digits only."),
  role: z.enum(["parent", "tutor"], { required_error: "Please select your role." }),
  rating: z.number().min(1, "Please provide a rating.").max(5),
  comment: z.string().min(20, "Your feedback must be at least 20 characters.").max(500, "Your feedback cannot exceed 500 characters."),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

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

export default function TestimonialsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      phone: "",
      rating: 0,
      comment: "",
    },
  });

  async function onSubmit(values: TestimonialFormValues) {
    setIsSubmitting(true);
    console.log("Testimonial Submitted:", values);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Thank You for Your Feedback!",
      description: "Your testimonial has been submitted successfully and is pending review.",
    });
    form.reset();
    setIsSubmitting(false);
  }

  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";
  const sectionPadding = "py-10 md:py-16";

  return (
    <>
      <div className={`${containerPadding} py-12`}>
        <div className="text-center mb-12 animate-in fade-in duration-500 ease-out">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Share Your Experience</h1>
          <p className="mt-2 text-md text-muted-foreground max-w-2xl mx-auto">
            Your feedback helps us grow and improve. We'd love to hear about your experience with Tutorzila, whether you're a parent or a tutor.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto bg-card border rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-2xl font-semibold text-primary flex items-center">
              <MessageSquareQuote className="mr-2.5 h-6 w-6" />
              Write a Testimonial
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
                      <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-primary/80"/>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                    <FormLabel className="text-foreground flex items-center"><Phone className="mr-2 h-4 w-4 text-primary/80"/>Phone Number</FormLabel>
                    <div className="flex gap-2">
                        <Select defaultValue="+91" disabled>
                            <SelectTrigger className="w-[80px] bg-input border-border focus:border-primary focus:ring-primary/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="+91">IN +91</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                <Input
                                    type="tel"
                                    placeholder="XXXXXXXXXX"
                                    maxLength={10}
                                    {...field}
                                    disabled={isSubmitting}
                                    onChange={(e) => {
                                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                      field.onChange(numericValue);
                                    }}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </FormItem>
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
                  {isSubmitting ? "Submitting..." : "Submit Testimonial"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

       {/* Testimonials Section */}
       <section className={`w-full bg-secondary ${sectionPadding}`}>
        <div className={`${containerPadding}`}>
          <div className="text-center mb-12 md:mb-16 animate-in fade-in duration-500 ease-out">
               <div className="inline-block p-3.5 bg-primary/10 rounded-full mb-4 shadow-sm">
                  <QuoteIcon className="w-8 h-8 text-primary"/>
              </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">What Our Users Say</h2>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: MOCK_TESTIMONIALS.length > 2, 
            }}
            className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-3.5 md:-ml-4.5">
              {MOCK_TESTIMONIALS.map((testimonial, index) => (
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
    </>
  );
}
