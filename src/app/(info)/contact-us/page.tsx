
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, MessageSquare, Send, LifeBuoy, Building, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(20, { message: "Message must be at least 20 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactUsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    console.log("Contact Form Submitted:", values);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Ticket Submitted!",
      description: "Thank you for contacting us. We will get back to you shortly.",
    });
    form.reset();
    setIsSubmitting(false);
  }

  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";

  return (
    <div className={`${containerPadding} max-w-5xl py-12 md:py-16`}>
       <div className="text-center mb-12 animate-in fade-in duration-500 ease-out">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4 shadow-sm">
            <LifeBuoy className="w-9 h-9 text-primary"/>
        </div>
        <h1 className="text-4xl font-bold text-primary tracking-tight">Get in Touch</h1>
        <p className="mt-2 text-md text-muted-foreground max-w-2xl mx-auto">
          We're here to help. Contact us for any questions, support, or feedback.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out">
        {/* Left Column: Contact Info */}
        <div className="space-y-6 bg-card p-6 md:p-8 rounded-xl shadow-lg border">
            <h2 className="text-2xl font-semibold text-foreground">Contact Information</h2>
            <p className="text-sm text-muted-foreground">
              You can reach us through any of the following channels. We look forward to hearing from you!
            </p>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-full text-primary shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Company</h3>
                  <p className="text-sm text-muted-foreground">Zilics Ventures Private Limited</p>
                </div>
              </div>
               <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-full text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <a href="tel:+918971126362" className="text-sm text-muted-foreground hover:text-primary transition-colors">+91-89711-26362</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-full text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <a href="mailto:support@tutorzila.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">support@tutorzila.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-full text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Location</h3>
                  <p className="text-sm text-muted-foreground">Bangalore, India</p>
                </div>
              </div>
            </div>
        </div>

        {/* Right Column: Contact Form */}
        <Card className="bg-card border rounded-lg shadow-lg">
          <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary"/> Raise a Support Ticket
            </CardTitle>
            <CardDescription className="text-md text-muted-foreground mt-1">
              Have an issue? Fill out the form below and we'll get back to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-primary/80"/>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-primary/80"/>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-primary/80"/>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Issue with payment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-primary/80"/>Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe your issue in detail..."
                          className="resize-none"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
