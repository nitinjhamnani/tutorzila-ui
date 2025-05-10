
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { Mail, Lock, Users, GraduationCap } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["parent", "tutor"], { required_error: "You need to select a role." }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const roleOptions: { value: "parent" | "tutor"; label: string; icon: React.ElementType }[] = [
  { value: "parent", label: "Parent", icon: Users },
  { value: "tutor", label: "Tutor", icon: GraduationCap },
];

export function SignInForm() {
  const { login } = useAuthMock();
  const { toast } = useToast();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "parent",
    },
  });

  function onSubmit(values: SignInFormValues) {
    login(values.email, values.role as UserRole); // Role is already narrowed by schema
    toast({
      title: "Signed In!",
      description: `Welcome back, ${values.email}! You are logged in as a ${values.role}.`,
    });
  }

  return (
    <Card className="w-full max-w-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>Sign in to continue your Tutorzila journey.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="you@example.com" {...field} className="pl-10 py-6 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50"/>
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
                  <FormLabel className="sr-only">Password</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="password" placeholder="••••••••" {...field} className="pl-10 py-6 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50"/>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-center block text-sm font-medium text-muted-foreground">Sign in as:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4 pt-2"
                    >
                      {roleOptions.map((option) => (
                        <FormItem key={option.value}>
                          <FormControl>
                            <RadioGroupItem value={option.value} id={`role-${option.value}`} className="sr-only peer" />
                          </FormControl>
                          <FormLabel
                            htmlFor={`role-${option.value}`}
                            className={cn(
                              "flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 py-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-300",
                              "peer-data-[state=checked]:border-primary peer-data-[state=checked]:shadow-lg peer-data-[state=checked]:scale-105",
                              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            )}
                          >
                            <option.icon className={cn("h-8 w-8 mb-2 transition-colors", field.value === option.value ? "text-primary" : "text-muted-foreground")} />
                            <span className="text-sm font-medium">{option.label}</span>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full py-6 text-lg font-semibold transform transition-transform hover:scale-105 active:scale-95">
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 pt-6">
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
