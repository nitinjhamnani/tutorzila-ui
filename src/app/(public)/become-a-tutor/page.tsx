
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Mail, User, School, Phone, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Switch } from "@/components/ui/switch";
import AuthModal from "@/components/auth/AuthModal";
import bannerImage from '@/assets/images/banner-11.png';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.885-.002 2.024.63 3.965 1.739 5.618l-1.187 4.349 4.443-1.152z" />
        <path d="M15.246 14.148c-.281-.141-1.66-1.04-1.916-1.158-.256-.117-.44-.187-.625.117-.184.305-.724.938-.887 1.115-.164.177-.328.188-.609.047-.282-.14-1.188-.438-2.262-1.395-.837-.745-1.395-1.661-1.56-1.944-.163-.282-.01- .438.104-.576.104-.13.234-.336.351-.49.117-.154.156-.257.234-.422.078-.164.039-.305-.019-.445-.058-.141-.625-1.492-.859-2.04-.233-.547-.467-.469-.625-.469-.141 0-.305-.019-.469-.019-.164 0-.438.058-.672.305-.234.246-.887.867-.887 2.109s.906 2.441 1.023 2.617c.118.176 1.77 2.899 4.293 4.098 2.522 1.199 2.522.797 2.969.762.447-.039 1.66-.672 1.898-1.32.238-.648.238-1.199.16-1.319-.078-.121-.281-.188-.586-.328z" />
    </svg>
);


const tutorSignUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  country: z.string().min(2, "Country is required."),
  localPhoneNumber: z.string().min(5, { message: "Phone number must be at least 5 digits." }).regex(/^\d+$/, "Phone number must be digits only."),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions to continue.",
  }),
  whatsAppNotifications: z.boolean().default(true),
});

type TutorSignUpFormValues = z.infer<typeof tutorSignUpSchema>;

const MOCK_COUNTRIES = [
  { country: "IN", countryCode: "+91", label: "India (+91)" },
  { country: "US", countryCode: "+1", label: "USA (+1)" },
  { country: "GB", countryCode: "+44", label: "UK (+44)" },
  { country: "AU", countryCode: "+61", label: "Australia (+61)" },
  { country: "JP", countryCode: "+81", label: "Japan (+81)" },
];


export default function BecomeTutorPage() {
  const { setSession } = useAuthMock();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoader, hideLoader } = useGlobalLoader();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const form = useForm<TutorSignUpFormValues>({
    resolver: zodResolver(tutorSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "IN",
      localPhoneNumber: "",
      acceptTerms: false,
      whatsAppNotifications: true,
    },
  });

  async function onSubmit(values: TutorSignUpFormValues) {
    setIsSubmitting(true);
    showLoader();

    const selectedCountryData = MOCK_COUNTRIES.find(c => c.country === values.country);

    const apiRequestBody = {
      name: values.name,
      email: values.email,
      userType: 'TUTOR',
      country: values.country,
      countryCode: selectedCountryData?.countryCode || '',
      phone: values.localPhoneNumber,
      whatsappConsent: values.whatsAppNotifications,
    };

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiBaseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(apiRequestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: responseData.message || `Welcome, ${values.name}! Redirecting to your dashboard...`,
        });
        
        if (responseData.token && responseData.type === 'TUTOR') {
            setSession(responseData.token, responseData.type, values.email, values.name, apiRequestBody.phone);
            router.push("/tutor/dashboard");
        }
      } else {
        hideLoader();
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
                  
                  <FormItem>
                    <FormLabel className="text-foreground">Phone Number</FormLabel>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem className="w-auto min-w-[120px]"> 
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Input type="tel" placeholder="XXXXXXXXXX" {...field} className="pl-12 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="whatsAppNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-input/50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm flex items-center">
                            <WhatsAppIcon className="h-4 w-4 mr-2 text-primary" />
                            WhatsApp Notifications
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Receive updates on this number.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=unchecked]:bg-destructive/50"
                          />
                        </FormControl>
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
            <CardFooter className="flex flex-col items-center space-y-3 pt-6 pb-8">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button variant="link" onClick={() => setIsAuthModalOpen(true)} className="p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors">
                  Sign In
                </Button>
              </p>
            </CardFooter>
          </Card>
      </div>
      </div>
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onOpenChange={setIsAuthModalOpen}
        />
      )}
    </>
  );
}
