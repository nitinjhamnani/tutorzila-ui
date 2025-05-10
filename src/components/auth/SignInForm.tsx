"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Users, Briefcase } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button"; // Imported buttonVariants
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import logoAsset from '@/assets/images/logo.png';
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["parent", "tutor"], { required_error: "You need to select your role." }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { login } = useAuthMock();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole>("parent"); // Default to parent

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "parent",
    },
  });

   useEffect(() => {
    // Initialize form with the default selected role
    form.setValue("role", selectedRole);
  }, [selectedRole, form]);


  async function onSubmit(values: SignInFormValues) {
    await login(values.email, values.role);
    toast({
      title: "Signed In!",
      description: `Welcome back! You are logged in as a ${values.role}.`,
    });
  }

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    form.setValue("role", role, { shouldValidate: true });
  };


  return (
    <Card className="w-full max-w-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-card animate-in fade-in zoom-in-95 duration-500 ease-out">
      <CardHeader className="flex flex-col items-center pt-8 pb-6">
        <Link href="/" className="hover:opacity-90 transition-opacity inline-block mb-6">
          <Image src={logoAsset} alt="Tutorzila Logo" width={180} height={45} priority className="h-auto" />
        </Link>
        <CardTitle className="text-center text-3xl font-bold tracking-tight">Welcome Back!</CardTitle>
        <CardDescription className="text-center text-muted-foreground mt-2">Login to access your Tutorzila account.</CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold text-foreground">Sign in as:</FormLabel>
                  <RadioGroup
                    onValueChange={(value) => handleRoleChange(value as UserRole)}
                    value={selectedRole}
                    className="grid grid-cols-2 gap-4"
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="parent" id="role-parent" className="sr-only" />
                      </FormControl>
                      <Label
                        htmlFor="role-parent"
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg border-2 border-border bg-card p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105",
                          selectedRole === "parent" && "border-primary ring-2 ring-primary shadow-xl scale-105 bg-primary/5"
                        )}
                      >
                        <Users className={cn("mb-2 h-10 w-10 transition-colors", selectedRole === 'parent' ? 'text-primary' : 'text-muted-foreground')} />
                        <span className={cn("font-medium text-sm", selectedRole === 'parent' ? 'text-primary' : 'text-foreground')}>Parent</span>
                      </Label>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="tutor" id="role-tutor" className="sr-only" />
                      </FormControl>
                      <Label
                        htmlFor="role-tutor"
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg border-2 border-border bg-card p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105",
                          selectedRole === "tutor" && "border-primary ring-2 ring-primary shadow-xl scale-105 bg-primary/5"
                        )}
                      >
                        <Briefcase className={cn("mb-2 h-10 w-10 transition-colors", selectedRole === 'tutor' ? 'text-primary' : 'text-muted-foreground')} />
                         <span className={cn("font-medium text-sm", selectedRole === 'tutor' ? 'text-primary' : 'text-foreground')}>Tutor</span>
                      </Label>
                    </FormItem>
                  </RadioGroup>
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
            <Button type="submit" className="w-full py-3.5 text-lg font-semibold tracking-wide transform transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Logging In...' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-3 pt-6 pb-8">
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "text-muted-foreground hover:text-primary transition-colors"
          )}
        >
          Forgot Password?
        </Link>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
