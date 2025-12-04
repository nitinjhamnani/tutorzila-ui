
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Mail, User, Users, School, CheckSquare, Phone, MessageSquare, Lock, Eye, EyeOff } from "lucide-react"; 
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
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal"; // Import the OTP modal

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  country: z.string().min(2, "Country is required."),
  localPhoneNumber: z.string().length(10, { message: "Phone number must be 10 digits." }).regex(/^\d+$/, "Phone number must be digits only."),
  password: z.string()
      .min(8, "Password must be at least 8 characters long and include an uppercase letter and a special symbol.")
      .regex(/[A-Z]/, "Password must be at least 8 characters long and include an uppercase letter and a special symbol.")
      .regex(/[!@#$%^&*(),.?\":{}|<>]/, "Password must be at least 8 characters long and include an uppercase letter and a special symbol."),
  role: z.enum(["parent", "tutor"], { required_error: "You must select a role (Parent or Tutor)." }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions to continue.",
  }),
});

interface SignUpFormProps { 
  onSuccess?: () => void;
  onSwitchForm: (formType: 'signin' | 'signup') => void; 
  onClose?: () => void;
  onShowOtp?: (identifier: string, type: 'email' | 'phone') => void;
}
type SignUpFormValues = z.infer<typeof signUpSchema>;

const MOCK_COUNTRIES = [
  { country: "IN", countryCode: "+91", label: "India (+91)" },
  { country: "US", countryCode: "+1", label: "USA (+1)" },
  { country: "GB", countryCode: "+44", label: "UK (+44)" },
  { country: "AU", countryCode: "+61", label: "Australia (+61)" },
  { country: "JP", countryCode: "+81", label: "Japan (+81)" },
];

export function SignUpForm({ onSuccess, onSwitchForm, onClose, onShowOtp }: SignUpFormProps) {
  const { setSession } = useAuthMock();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoader, hideLoader } = useGlobalLoader();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "IN",
      localPhoneNumber: "",
      password: "",
      role: undefined, 
      acceptTerms: false,
    },
    mode: "onTouched",
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
    const fullPhoneNumber = `${selectedCountryData?.countryCode || ''} ${values.localPhoneNumber}`;

    const apiRequestBody = {
      name: values.name,
      email: values.email,
      password: values.password,
      userType: values.role.toUpperCase() as 'PARENT' | 'TUTOR',
      country: values.country,
      countryCode: selectedCountryData?.countryCode || '',
      phone: values.localPhoneNumber,
    };

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(apiRequestBody),
      });

      const responseData = await response.json();
      hideLoader();

      if (response.ok) {
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'conversion', {
            'send_to': 'AW-17759434933/NMnACJW968obELXxrZRC',
          });
        }
        if (onShowOtp) {
          onShowOtp(fullPhoneNumber, "phone");
        }
      } else {
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
      setIsSubmitting(false);
    }
  }

  const handleRoleChange = (roleValue: string) => {
    const role = roleValue as UserRole;
    setSelectedRole(role);
    form.setValue("role", role, { shouldValidate: true });
  };

  return (
    <>
    <Card className="w-full max-w-lg shadow-lg bg-card border-0 rounded-lg animate-in fade-in zoom-in-95 duration-500 ease-out">
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
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Create Password</FormLabel>
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
                      id="acceptTerms-signup-modal"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel
                      htmlFor="acceptTerms-signup-modal"
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
    </>
  );
}
