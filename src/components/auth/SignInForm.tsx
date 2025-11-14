
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

const signInSchema = z.object({
  email: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm({ onSuccess, onSwitchForm, onClose, initialName }: { onSuccess?: () => void, onSwitchForm: (formType: 'signin' | 'signup') => void, onClose?: () => void, initialName?: string }) {
  const { login, setSession } = useAuthMock();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const { showLoader, hideLoader } = useGlobalLoader();
  const router = useRouter();

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: initialName || "",
      password: "",
    },
  });

  const handleOtpLogin = async () => {
    const email = form.getValues("email");
    const isEmailValid = await form.trigger("email");

    if (!isEmailValid) {
        form.setFocus("email");
        return;
    }

    setIsOtpSubmitting(true);
    showLoader("Sending OTP...");

    try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/api/auth/otplogin?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: { 'accept': '*/*' },
        });

        const responseData = await response.json();
        hideLoader();

        if (response.ok) {
            toast({
                title: "OTP Sent!",
                description: responseData.message || `An OTP has been sent to ${email}.`,
            });
            setOtpIdentifier(email);
            setIsOtpModalOpen(true);
        } else {
            throw new Error(responseData.message || "Failed to send OTP.");
        }
    } catch (error) {
        hideLoader();
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
    // This function is now handled by the OTP modal itself, but we keep it
    // in case we need to add logic here later.
    console.log("OTP verified successfully in sign-in form context.");
  };

  const handleResendOtp = async () => {
    // This is a mock resend function.
    console.log("Resending OTP for login to", form.getValues("email"));
    await new Promise(resolve => setTimeout(resolve, 1000));
  };


  async function onSubmit(values: SignInFormValues) {
    setIsSubmitting(true);
    showLoader();
    try {
      const result = await login(values.email, values.password);
      toast({
        title: "Signed In!",
        description: result.message,
      });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      // Do not hide loader here; the destination dashboard page will handle it.
    } catch (error) {
      hideLoader(); // Only hide loader on failure
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: (error as Error).message || "An unexpected error occurred.",
      });
    } finally {
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-left block w-full">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="tel" placeholder="Enter your phone number" {...field} className="pl-12 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg" />
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
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-foreground text-left block w-full">Password</FormLabel>
                    <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Link
                          href="#" 
                      >
                          Forgot Password?
                      </Link>
                    </Button>
                  </div>
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
             <div className="flex justify-start">
               <Button type="button" variant="link" className="p-0 h-auto text-xs text-primary font-semibold" onClick={handleOtpLogin} disabled={isOtpSubmitting}>
                    {isOtpSubmitting ? 'Sending OTP...' : 'Get OTP to Login'}
               </Button>
            </div>
            
            <Button type="submit" className="w-full py-3.5 text-lg font-semibold tracking-wide transform transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2" disabled={isSubmitting}>
              <LogIn className="mr-2 h-5 w-5" /> 
              {isSubmitting ? 'Logging In...' : 'Login with Password'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-3 pt-6 pb-8 bg-card rounded-b-lg">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
            <Button variant="link" onClick={() => onSwitchForm('signup')} className="p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors">
              Sign Up
            </Button>
        </p>
      </CardFooter>
    </Card>
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
