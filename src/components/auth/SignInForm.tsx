
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, LogIn, Users, School, KeyRound, Eye, EyeOff, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import logoAsset from '@/assets/images/logo.png';
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const signInSchema = z.object({
  country: z.string().min(1, "Country is required."),
  localPhoneNumber: z.string().length(10, { message: "Phone number must be 10 digits." }).regex(/^\d+$/, "Phone number must be digits only."),
  password: z.string().min(1, { message: "Password is required." }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const MOCK_COUNTRIES = [
  { country: "IN", countryCode: "+91", label: "India (+91)" },
  { country: "US", countryCode: "+1", label: "USA (+1)" },
  { country: "GB", countryCode: "+44", label: "UK (+44)" },
  { country: "AU", countryCode: "+61", label: "Australia (+61)" },
  { country: "JP", countryCode: "+81", label: "Japan (+81)" },
];

export function SignInForm({ onSuccess, onSwitchForm, onClose, initialName }: { onSuccess?: () => void, onSwitchForm: (formType: 'signin' | 'signup') => void, onClose?: () => void, initialName?: string }) {
  const { login } = useAuthMock();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      country: "IN",
      localPhoneNumber: initialName || "",
      password: "",
    },
    mode: "onTouched", // Added mode to track validity
  });

  const isPhoneNumberValidForOtp = form.watch("localPhoneNumber").length === 10 && /^\d{10}$/.test(form.watch("localPhoneNumber"));

  const handleOtpLogin = async () => {
    const localPhoneNumber = form.getValues("localPhoneNumber");
    const country = form.getValues("country");

    const isPhoneValid = await form.trigger("localPhoneNumber");
    if (!isPhoneValid) {
        form.setFocus("localPhoneNumber");
        return;
    }

    setIsOtpSubmitting(true);

    try {
        const selectedCountryData = MOCK_COUNTRIES.find(c => c.country === country);
        const fullPhoneNumberForDisplay = `${selectedCountryData?.countryCode || ''} ${localPhoneNumber}`;

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        
        const response = await fetch(`${apiBaseUrl}/api/auth/otplogin?username=${encodeURIComponent(localPhoneNumber)}`, {
            method: 'GET',
            headers: { 'accept': '*/*' },
        });

        const responseData = await response.json();

        if (response.ok) {
            toast({
                title: "OTP Sent!",
                description: responseData.message || `An OTP has been sent to ${fullPhoneNumberForDisplay}.`,
            });
            setOtpIdentifier(fullPhoneNumberForDisplay); // For display in OTP modal
            setIsOtpModalOpen(true);
        } else {
            throw new Error(responseData.message || "Failed to send OTP.");
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Failed to Send OTP",
            description: (error as Error).message,
        });
    } finally {
        setIsOtpSubmitting(false);
    }
  };
  
  const handleOtpSuccess = async (otp: string) => {
    console.log("OTP verified successfully in sign-in form context.");
  };

  const handleResendOtp = async () => {
    console.log("Resending OTP for login to", form.getValues("localPhoneNumber"));
    await new Promise(resolve => setTimeout(resolve, 1000));
  };


  async function onSubmit(values: SignInFormValues) {
    setIsSubmitting(true);
    try {
      const result = await login(values.localPhoneNumber, values.password);
      
      const role = result.type.toLowerCase();
      let targetPath = "/";

      if (role === 'tutor') {
          targetPath = "/tutor/dashboard";
      } else if (role === 'parent') {
          targetPath = "/parent/dashboard";
      } else if (role === 'admin') {
          targetPath = "/admin/dashboard";
      }
      
      router.push(targetPath);

      if (onSuccess) onSuccess();
      if (onClose) onClose();

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: (error as Error).message || "An unexpected error occurred.",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <>
    <Card className="w-full max-w-lg shadow-lg rounded-lg bg-card border animate-in fade-in zoom-in-95 duration-500 ease-out">
      <CardHeader className="space-y-1.5 flex flex-col items-center bg-card rounded-t-lg p-0 pt-0 pb-0">
        <Link href="/" className="hover:opacity-90 transition-opacity inline-block">
          <Image src={logoAsset} alt="Tutorzila Logo" width={180} height={45} priority className="h-auto" />
        </Link>
        <CardTitle className="text-center text-3xl font-bold tracking-tight">Welcome Back!</CardTitle>
        <CardDescription className="text-center text-muted-foreground mt-2">Login to access your Tutorzila account.</CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
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
                  <FormLabel className="text-foreground text-left block w-full">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="pl-12 pr-10 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg" />
                       <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => setShowPassword(prev => !prev)}>
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full py-3.5 text-lg font-semibold tracking-wide transform transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2" disabled={isSubmitting}>
              <LogIn className="mr-2 h-5 w-5" /> 
              {isSubmitting ? 'Logging In...' : 'Login with Password'}
            </Button>
             <div className="flex justify-start items-center">
               <Button type="button" variant="link" className="p-0 h-auto text-xs text-primary font-semibold" onClick={handleOtpLogin} disabled={isOtpSubmitting || !isPhoneNumberValidForOtp}>
                    {isOtpSubmitting ? 'Sending OTP...' : 'Get OTP to Login'}
               </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-3 pt-6 pb-8 bg-card rounded-b-lg">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors">
              <button type="button" onClick={() => onSwitchForm('signup')}>Sign Up</button>
            </Button>
        </p>
      </CardFooter>
    </Card>
     <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onOpenChange={setIsOtpModalOpen}
        verificationType="phone"
        identifier={otpIdentifier}
        onSuccess={handleOtpSuccess}
        onResend={handleResendOtp}
    />
    </>
  );
}
