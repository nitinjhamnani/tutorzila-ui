
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, Lock, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
} from "@/components/ui/card";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { useRouter } from "next/navigation";
import logoAsset from '@/assets/images/logo.png';

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const { login } = useAuthMock();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoader, hideLoader } = useGlobalLoader();

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: AdminLoginFormValues) {
    setIsSubmitting(true);
    showLoader();
    try {
      const result = await login(values.email, values.password);

      if (result.type.toLowerCase() !== 'admin') {
        hideLoader();
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have administrative privileges.",
        });
        return;
      }
      
      toast({
        title: "Admin Sign In Successful!",
        description: `Welcome back, ${result.name || 'Admin'}!`,
      });
      
      router.push("/admin/dashboard");
    } catch (error) {
      hideLoader();
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
    <Card className="w-full max-w-md shadow-xl bg-card border rounded-lg">
      <CardHeader className="space-y-1.5 text-center p-8 pb-4 flex flex-col items-center">
        <Link href="/" className="hover:opacity-90 transition-opacity inline-block mb-4">
          <Image src={logoAsset} alt="Tutorzila Logo" width={180} height={45} priority className="h-auto" />
        </Link>
        <CardDescription className="text-muted-foreground pt-2">
          Enter your credentials to access the admin dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="admin@tutorzila.com" {...field} className="pl-12 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30" />
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
                      <Input type="password" placeholder="••••••••" {...field} className="pl-12 pr-4 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full py-3.5 text-lg font-semibold" disabled={isSubmitting}>
              <LogIn className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Logging In...' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
