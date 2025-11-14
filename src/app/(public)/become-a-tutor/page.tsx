
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Mail, User, School, Phone, CheckCircle, Info, BriefcaseBusiness, Briefcase, CalendarCheck, GraduationCap, Lock, Check, Circle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from 'react';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Switch } from "@/components/ui/switch";
import AuthModal from "@/components/auth/AuthModal";
import bannerImage from '@/assets/images/banner-11.png';
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal"; // Import the new modal
import { cn } from "@/lib/utils";

const tutorSignUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  country: z.string().min(2, "Country is required."),
  localPhoneNumber: z.string().length(10, { message: "Phone number must be 10 digits." }).regex(/^\d+$/, "Phone number must be digits only."),
  password: z.string()
      .min(8, "Password must be at least 8 characters long and include an uppercase letter and a special symbol.")
      .regex(/[A-Z]/, "Password must be at least 8 characters long and include an uppercase letter and a special symbol.")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must be at least 8 characters long and include an uppercase letter and a special symbol."),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions to continue.",
  }),
});


type TutorSignUpFormValues = z.infer<typeof tutorSignUpSchema>;

const MOCK_COUNTRIES = [
  { country: "IN", countryCode: "+91", label: "India (+91)" },
  { country: "US", countryCode: "+1", label: "USA (+1)" },
  { country: "GB", countryCode: "+44", label: "UK (+44)" },
  { country: "AU", countryCode: "+61", label: "Australia (+61)" },
  { country: "JP", countryCode: "+81", label: "Japan (+81)" },
];

const becomeTutorBenefits = [
  {
    icon: BriefcaseBusiness, 
    title: "Reach Students",
    description: "Connect with thousands of potential students actively looking for tutors like you.",
  },
  {
    icon: Briefcase, 
    title: "Flexible Schedule & Rates",
    description: "Set your own working hours and competitive rates that suit your expertise.",
  },
  {
    icon: CalendarCheck, 
    title: "Manage Easily",
    description: "Utilize our user-friendly platform to manage your profile, bookings, and communication.",
  },
];

export default function BecomeTutorPage() {
  const { setSession } = useAuthMock();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoader, hideLoader } = useGlobalLoader();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TutorSignUpFormValues>({
    resolver: zodResolver(tutorSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "IN",
      localPhoneNumber: "",
      password: "",
      acceptTerms: false,
    },
     mode: "onTouched",
  });
  
  const handleOtpSuccess = async (otp: string) => {
    // This logic is now handled directly inside OtpVerificationModal
    // This function can be kept for future use or removed if not needed elsewhere.
    console.log("OTP verification successful with OTP:", otp);
  };

  const handleResendOtp = async () => {
    // In a real app, you'd call an API to resend the OTP
    console.log("Resending OTP to", form.getValues("email"));
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  async function onSubmit(values: TutorSignUpFormValues) {
    setIsSubmitting(true);
    showLoader();

    const selectedCountryData = MOCK_COUNTRIES.find(c => c.country === values.country);

    const apiRequestBody = {
      name: values.name,
      email: values.email,
      password: values.password,
      userType: 'TUTOR',
      country: values.country,
      countryCode: selectedCountryData?.countryCode || '',
      phone: values.localPhoneNumber,
    };

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify(apiRequestBody),
      });

      const responseData = await response.json();
      hideLoader();

      if (response.ok) {
        setOtpIdentifier(values.email);
        setIsOtpModalOpen(true);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: responseData.message || "An unknown error occurred. Please try again.",
        });
      }
    } catch (error) { 
      hideLoader();
      console.error("Sign Up API call failed:", error);
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "Could not connect to the server. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const sectionPadding = "py-10 md:py-16"; 
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";

  return (
    <>
      <div className="w-full lg:grid lg:min-h-[calc(100vh_-_var(--header-height))] lg:grid-cols-2 xl:min-h-[calc(100vh_-_var(--header-height))] bg-secondary">
        <div className="hidden lg:flex lg:items-center lg:justify-center p-8">
            <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                <Image
                    src={bannerImage}
                    alt="Become a Tutor Illustration"
                    width={500}
                    height={500}
                    className="mb-8 rounded-xl object-contain"
                    data-ai-hint="teacher online education"
                />
                <h1 className="text-3xl font-bold text-primary tracking-tight">Inspire Minds, Change Lives</h1>
                <p className="mt-4 text-base text-foreground/80">
                    Join our community of passionate educators. Share your knowledge, set your own schedule, and earn by making a difference.
                </p>
            </div>
        </div>
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-lg shadow-xl bg-card border rounded-lg animate-in fade-in zoom-in-95 duration-500 ease-out">
            <CardHeader className="p-8 pb-4 space-y-1.5 flex flex-col items-center bg-card rounded-t-lg">
              <CardTitle className="text-center text-3xl font-bold tracking-tight">Become a Tutor</CardTitle>
              <CardDescription className="text-center text-muted-foreground mt-2 px-4">Join our community of passionate educators and start earning.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="John Doe" {...field} className="pl-12 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg" />
                          </div>
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
                        <FormLabel className="text-foreground">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="your.email@example.com" {...field} className="pl-12 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel className="text-foreground">Phone Number</FormLabel>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem className="w-auto min-w-[120px]"> 
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                              <FormControl>
                                <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg py-3 text-base">
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
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                  type="tel"
                                  pattern="[0-9]*"
                                  placeholder="XXXXXXXXXX"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow only numeric input
                                    const numericValue = value.replace(/[^0-9]/g, '');
                                    field.onChange(numericValue);
                                  }}
                                  className="pl-12 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="pl-12 pr-10 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg" />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => setShowPassword(prev => !prev)}>
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground pt-1">
                            Must be at least 8 characters long and include an uppercase letter and a special symbol.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-input/50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="acceptTerms-tutor"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel
                            htmlFor="acceptTerms-tutor"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Accept terms and conditions
                          </FormLabel>
                          <FormDescription className="text-xs text-muted-foreground">
                            By signing up, you agree to our{' '}
                            <Link href="/terms-and-conditions" className="text-primary hover:underline" target="_blank">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy-policy" className="text-primary hover:underline" target="_blank">
                              Privacy Policy
                            </Link>
                            .
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full py-3.5 text-lg font-semibold tracking-wide transform transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2" disabled={isSubmitting}>
                    <School className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Registering...' : 'Register as Tutor'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
      </div>
      </div>
      <section className={`w-full bg-background ${sectionPadding}`}>
        <div className={`${containerPadding}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Become A Tutor with Tutorzila</h2>
            <p className="mt-4 max-w-2xl mx-auto text-foreground/80 md:text-lg">
              Share your knowledge, inspire students, and earn on your own schedule. Join our community of passionate educators today.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {becomeTutorBenefits.map((benefit, index) => (
              <Card key={index} className="group bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.02]">
                <div className="flex flex-col items-center text-center">
                  <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{benefit.title}</h3>
                  <p className="text-sm text-foreground/70 mt-2">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-10">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95" onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}>
                <GraduationCap className="mr-2.5 h-5 w-5" /> Start Teaching Today
              </Button>
          </div>
        </div>
      </section>
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onOpenChange={setIsOtpModalOpen}
        verificationType="email"
        identifier={otpIdentifier}
        onSuccess={handleOtpSuccess}
        onResend={handleResendOtp}
      />
    </>
  );
}
