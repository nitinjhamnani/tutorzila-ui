"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import logoAsset from '@/assets/images/logo.png'; // Use existing logo asset

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  // Role is no longer part of the form schema
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { login, user: loggedInUser } = useAuthMock(); // Get user to access role after login
  const { toast } = useToast();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormValues) {
    // Role is now handled by the mock login (defaults or inferred)
    // For this mock, we'll call login without role, and useAuthMock will default it.
    await login(values.email); 

    // After login, user object in useAuthMock is updated
    // We need to ensure loggedInUser is updated before this toast,
    // which might require a slight delay or observing loggedInUser.
    // For simplicity here, assuming useAuthMock updates synchronously for the toast.
    // A better approach for real apps: login function could return the user object.
    
    // A short delay to allow user state to update if login is async
    setTimeout(() => {
        const currentUser = loggedInUser; // Re-fetch user from hook state
         toast({
            title: "Signed In!",
            description: `Welcome back, ${values.email}! ${currentUser?.role ? `You are logged in as a ${currentUser.role}.` : ''}`,
        });
    }, 100);


  }

  return (
    <Card className="w-full max-w-md shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-card">
      <CardHeader className="flex flex-col items-center pt-6 pb-4">
        <Link href="/" className="hover:opacity-90 transition-opacity inline-block mb-4">
            <Image src={logoAsset} alt="Tutorzila Logo" width={160} height={40} priority className="h-auto" />
        </Link>
        <CardTitle className="text-center text-2xl font-bold">Welcome Back!</CardTitle>
        <CardDescription className="text-center">Login to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="your.email@example.com" {...field} className="pl-10 py-3 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50 bg-background"/>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="password" placeholder="••••••••" {...field} className="pl-10 py-3 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50 bg-background"/>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full py-3 text-lg font-semibold transform transition-transform hover:scale-105 active:scale-95" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Logging In...' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 pt-6">
        <Button variant="link" size="sm" asChild>
            <Link href="#">Forgot Password?</Link> {/* Add actual link later */}
        </Button>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Button variant="link" asChild className="p-0 h-auto text-primary hover:text-primary/80">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
