
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Users, School, CheckSquare } from "lucide-react";

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

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
  role: z.enum(["parent", "tutor"], { required_error: "You need to select your role." }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions to continue.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const { signup } = useAuthMock();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole>("parent");

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "parent",
      acceptTerms: false,
    },
  });

  useEffect(() => {
    form.setValue("role", selectedRole);
  }, [selectedRole, form]);

  function onSubmit(values: SignUpFormValues) {
     signup(values.name, values.email, values.role as UserRole);
    toast({
      title: "Account Created!",
      description: `Welcome to Tutorzila, ${values.name}! You are registered as a ${values.role}.`,
    });
  }

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    form.setValue("role", role, { shouldValidate: true });
  };

  return (
    <Card className="w-full max-w-3xl shadow-lg bg-card border rounded-lg animate-in fade-in zoom-in-95 duration-500 ease-out">
      <CardHeader className="flex flex-col items-center pt-8 pb-6">
        <Link href="/" className="hover:opacity-90 transition-opacity inline-block mb-6">
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
                    onValueChange={(value) => handleRoleChange(value as UserRole)}
                    value={selectedRole}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <FormItem className="relative">
                      <FormControl>
                        <RadioGroupItem value="parent" id="role-parent-signup" className="sr-only" />
                      </FormControl>
                      <Label
                        htmlFor="role-parent-signup"
                        className={cn(
                          "flex items-center justify-start rounded-lg border-2 p-3 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.03]",
                          selectedRole === "parent"
                            ? "border-primary ring-2 ring-primary shadow-md scale-[1.03] bg-primary text-primary-foreground"
                            : "border-border bg-card hover:bg-primary hover:text-primary-foreground"
                        )}
                      >
                        <Users className={cn("mr-3 h-5 w-5 transition-colors", selectedRole === 'parent' ? 'text-primary-foreground' : 'text-muted-foreground')} />
                        <span className={cn("font-medium text-sm", selectedRole === 'parent' ? 'text-primary-foreground' : 'text-foreground')}>Parent</span>
                      </Label>
                    </FormItem>
                    <FormItem className="relative">
                      <FormControl>
                        <RadioGroupItem value="tutor" id="role-tutor-signup" className="sr-only" />
                      </FormControl>
                      <Label
                        htmlFor="role-tutor-signup"
                        className={cn(
                          "flex items-center justify-start rounded-lg border-2 p-3 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.03]",
                          selectedRole === "tutor"
                            ? "border-primary ring-2 ring-primary shadow-md scale-[1.03] bg-primary text-primary-foreground"
                            : "border-border bg-card hover:bg-primary hover:text-primary-foreground"
                        )}
                      >
                        <School className={cn("mr-3 h-5 w-5 transition-colors", selectedRole === 'tutor' ? 'text-primary-foreground' : 'text-muted-foreground')} />
                         <span className={cn("font-medium text-sm", selectedRole === 'tutor' ? 'text-primary-foreground' : 'text-foreground')}>Tutor</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" {...field} className="pl-12 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" {...field} className="pl-12 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
            
            <Button type="submit" className="w-full py-3.5 text-lg font-semibold tracking-wide transform transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </CardContent>
       <CardFooter className="flex flex-col items-center space-y-3 pt-6 pb-8">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors">
            <Link href="/?signin=true" onClick={() => { /* Ensure modal logic is handled if coming from modal context */}}>
             Sign In
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
    
