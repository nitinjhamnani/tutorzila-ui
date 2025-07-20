
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Mail, User, Users, School, CheckSquare, Phone, MessageSquare } from "lucide-react"; 
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import logoAsset from '@/assets/images/logo.png';
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Switch } from "@/components/ui/switch";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.885-.002 2.024.63 3.965 1.739 5.618l-1.187 4.349 4.443-1.152z" />
        <path d="M15.246 14.148c-.281-.141-1.66-1.04-1.916-1.158-.256-.117-.44-.187-.625.117-.184.305-.724.938-.887 1.115-.164.177-.328.188-.609.047-.282-.14-1.188-.438-2.262-1.395-.837-.745-1.395-1.661-1.56-1.944-.163-.282-.01- .438.104-.576.104-.13.234-.336.351-.49.117-.154.156-.257.234-.422.078-.164.039-.305-.019-.445-.058-.141-.625-1.492-.859-2.04-.233-.547-.467-.469-.625-.469-.141 0-.305-.019-.469-.019-.164 0-.438.058-.672.305-.234.246-.887.867-.887 2.109s.906 2.441 1.023 2.617c.118.176 1.77 2.899 4.293 4.098 2.522 1.199 2.522.797 2.969.762.447-.039 1.66-.672 1.898-1.32.238-.648.238-1.199.16-1.319-.078-.121-.281-.188-.586-.328z" />
    </svg>
);


const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  country: z.string().min(2, "Country is required."),
  localPhoneNumber: z.string().min(5, { message: "Phone number must be at least 5 digits." }).regex(/^\d+$/, "Phone number must be digits only."),
  role: z.enum(["parent", "tutor"], { required_error: "You must select a role (Parent or Tutor)." }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions to continue.",
  }),
  whatsAppNotifications: z.boolean().default(true),
});

interface SignUpFormProps { 
  onSuccess?: () => void;
  onSwitchForm: (formType: 'signin' | 'signup') => void; 
  onClose?: () => void;
}
type SignUpFormValues = z.infer<typeof signUpSchema>;

const MOCK_COUNTRIES = [
  { country: "IN", countryCode: "+91", label: "India (+91)" },
  { country: "US", countryCode: "+1", label: "USA (+1)" },
  { country: "GB", countryCode: "+44", label: "UK (+44)" },
  { country: "AU", countryCode: "+61", label: "Australia (+61)" },
  { country: "JP", countryCode: "+81", label: "Japan (+81)" },
];

export function SignUpForm({ onSuccess, onSwitchForm, onClose }: SignUpFormProps) {
  const { setSession } = useAuthMock();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoader, hideLoader } = useGlobalLoader();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "IN",
      localPhoneNumber: "",
      role: undefined, 
      acceptTerms: false,
      whatsAppNotifications: true,
    },
  });

  useEffect(() => {
    form.setValue("role", selectedRole);
  }, [selectedRole, form]);

  async function onSubmit(values: SignUpFormValues) {
    if (!values.role) {
      toast({
        variant: "destructive",
        title: "Role Selection Required",
        description: "Please select if you are signing up as a Parent or a Tutor.",
      });
      return;
    }
    setIsSubmitting(true);
    showLoader();

    const selectedCountryData = MOCK_COUNTRIES.find(c => c.country === values.country);

    const apiRequestBody: {
        name: string;
        email: string;
        userType: 'PARENT' | 'TUTOR';
        country: string;
        countryCode: string;
        phone?: string;
        whatsappConsent: boolean;
    } = {
      name: values.name,
      email: values.email,
      userType: values.role.toUpperCase() as 'PARENT' | 'TUTOR',
      country: values.country,
      countryCode: selectedCountryData?.countryCode || '',
      whatsappConsent: values.whatsAppNotifications,
    };
    if (values.localPhoneNumber && values.localPhoneNumber.trim() !== "") {
      apiRequestBody.phone = values.localPhoneNumber;
    }

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
          title: "Account Created!",
          description: responseData.message || `Welcome, ${values.name}! Redirecting...`,
        });
        
        if (responseData.token && responseData.type) {
            setSession(responseData.token, responseData.type, values.email, values.name, apiRequestBody.phone);
            const role = responseData.type.toLowerCase();
            if (role === 'tutor') {
                router.push("/tutor/dashboard");
            } else if (role === 'parent') {
                router.push("/parent/dashboard");
            } else {
                router.push("/");
                hideLoader(); // Hide loader if no specific dashboard
            }
        }
        
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        hideLoader();
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: responseData.message || "An unknown error occurred. Please try again.",
        });
      }
    } catch (error) { 
      hideLoader();
      console.error("Sign Up API call failed:", error);
      toast({
        variant: "destructive",
        title: "Sign Up Error",
        description: "Could not connect to the server or the response was invalid. Please try again later.",
      });
    } finally {
      // We no longer hide the loader here. It will be hidden by the destination dashboard page.
      setIsSubmitting(false);
    }
  }

  const handleRoleChange = (roleValue: string) => {
    const role = roleValue as UserRole;
    setSelectedRole(role);
    form.setValue("role", role, { shouldValidate: true });
  };

  return (
    <Card className="w-full max-w-lg shadow-lg bg-card border rounded-lg animate-in fade-in zoom-in-95 duration-500 ease-out">
      <CardHeader className="p-0 pt-0 pb-0 space-y-1.5 flex flex-col items-center bg-card rounded-t-lg">
        <Link href="/" className="hover:opacity-90 transition-opacity inline-block">
          <Image src={logoAsset} alt="Tutorzila Logo" width={180} height={45} priority className="h-auto" />
        </Link>
        <CardTitle className="text-center text-3xl font-bold tracking-tight">Create Your Account</CardTitle>
        <CardDescription className="text-center text-muted-foreground mt-2">Join Tutorzila as a parent or a tutor.</CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold text-foreground sr-only">I am signing up as:</FormLabel>
                  <RadioGroup
                    onValueChange={handleRoleChange} 
                    value={field.value} 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <FormItem className="relative">
                      <FormControl>
                        <RadioGroupItem value="parent" id="role-parent-signup" className="sr-only" />
                      </FormControl>
                      <Label
                        htmlFor="role-parent-signup"
                        className={cn(
                          "group flex items-center justify-start rounded-lg border-2 p-3 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105",
                          field.value === "parent"
                            ? "border-primary ring-2 ring-primary shadow-md scale-[1.03] bg-primary text-primary-foreground"
                            : "border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary hover:ring-2 hover:ring-primary hover:shadow-md"
                        )}
                      >
                        <Users className={cn("mr-3 h-5 w-5 transition-colors", field.value === 'parent' ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary-foreground')} />
                        <span className={cn("font-medium text-sm", field.value === 'parent' ? 'text-primary-foreground' : 'text-foreground group-hover:text-primary-foreground')}>I am Parent</span>
                      </Label>
                    </FormItem>
                    <FormItem className="relative">
                      <FormControl>
                        <RadioGroupItem value="tutor" id="role-tutor-signup" className="sr-only" />
                      </FormControl>
                      <Label
                        htmlFor="role-tutor-signup"
                        className={cn(
                          "group flex items-center justify-start rounded-lg border-2 p-3 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105",
                          field.value === "tutor"
                            ? "border-primary ring-2 ring-primary shadow-md scale-[1.03] bg-primary text-primary-foreground"
                            : "border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary hover:ring-2 hover:ring-primary hover:shadow-md"
                        )}
                      >
                        <School className={cn("mr-3 h-5 w-5 transition-colors", field.value === 'tutor' ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary-foreground')} />
                         <span className={cn("font-medium text-sm", field.value === 'tutor' ? 'text-primary-foreground' : 'text-foreground group-hover:text-primary-foreground')}>I am Tutor</span>
                      </Label>
                    </FormItem>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      id="acceptTerms"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel
                      htmlFor="acceptTerms"
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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </CardContent>
       <CardFooter className="flex flex-col items-center space-y-3 pt-6 pb-8">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors">
            <button type="button" onClick={() => onSwitchForm('signin')}>Sign In</button>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
