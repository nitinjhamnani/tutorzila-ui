
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, UserCircle, Mail, Phone, VenetianMask } from "lucide-react"; 
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { TutorProfile } from "@/types";
import React from "react";

const personalDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."), 
  phone: z.string().min(10, "Phone number must be at least 10 digits.").optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  dateOfBirth: z.date().optional(),
});

type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;

export function EditPersonalDetailsForm() {
  const { user, isAuthenticated } = useAuthMock(); 
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null;

  const form = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      name: tutorUser?.name || "",
      email: tutorUser?.email || "",
      phone: tutorUser?.phone || "",
      gender: tutorUser?.gender || "", 
      dateOfBirth: tutorUser?.dateOfBirth ? new Date(tutorUser.dateOfBirth) : undefined,
    },
  });

  React.useEffect(() => {
    if (tutorUser) {
      form.reset({
        name: tutorUser.name || "",
        email: tutorUser.email || "",
        phone: tutorUser.phone || "",
        gender: tutorUser.gender || "",
        dateOfBirth: tutorUser.dateOfBirth ? new Date(tutorUser.dateOfBirth) : undefined,
      });
    }
  }, [tutorUser, form]);


  function onSubmit(data: PersonalDetailsFormValues) {
    console.log("Personal Details Submitted:", data);
    // Mock API call
    toast({
      title: "Personal Details Updated!",
      description: "Your personal information has been saved.",
    });
  }

  if (!isAuthenticated || !user) {
    // This should ideally be handled by the dashboard layout's auth check
    return <p className="text-center py-10">Loading user data or please sign in.</p>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl border bg-card">
      <CardHeader className="p-6 border-b">
        <CardTitle className="text-xl font-semibold text-primary flex items-center">
          <UserCircle className="mr-2.5 h-6 w-6" />
          Edit Personal Details
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">Update your personal information below.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Your full name" {...field} className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm" />
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
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="your.email@example.com" {...field} readOnly className="pl-10 bg-muted/30 cursor-not-allowed border-border shadow-sm" />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">Email address cannot be changed.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="tel" placeholder="Your phone number" {...field} className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <div className="relative">
                      <VenetianMask className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal pl-3 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full mt-8 py-2.5 text-base" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
