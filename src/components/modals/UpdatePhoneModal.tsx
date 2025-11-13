
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, Loader2, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const MOCK_COUNTRIES = [
  { country: "IN", countryCode: "+91", label: "India (+91)" },
  { country: "US", countryCode: "+1", label: "USA (+1)" },
  { country: "GB", countryCode: "+44", label: "UK (+44)" },
  { country: "AU", countryCode: "+61", label: "Australia (+61)" },
  { country: "JP", countryCode: "+81", label: "Japan (+81)" },
];

interface UpdatePhoneModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentPhone?: string;
  currentCountryCode?: string;
}

const updatePhoneApi = async ({
  token,
  newPhoneNumber,
}: {
  token: string | null;
  newPhoneNumber: string;
}) => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/user/change`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify({
      changeType: "PHONE",
      value: newPhoneNumber,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update phone number." }));
    if (response.status === 400) {
      throw new Error("A user with this phone number already exists.");
    }
    throw new Error(errorData.message);
  }
  
  return response.json();
};

export function UpdatePhoneModal({ isOpen, onOpenChange, currentPhone, currentCountryCode }: UpdatePhoneModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();

  const defaultCountry = MOCK_COUNTRIES.find(c => c.countryCode === currentCountryCode)?.country || "IN";

  const updatePhoneSchema = z.object({
    country: z.string().min(1, "Country is required."),
    phone: z.string().min(10, "Phone number must be at least 10 digits.").regex(/^\d+$/, "Phone number must be numeric."),
  }).refine(
    (data) => {
      const selectedCountry = MOCK_COUNTRIES.find(c => c.country === data.country);
      return !(selectedCountry?.countryCode === currentCountryCode && data.phone === currentPhone);
    },
    {
      message: "New phone number must be different from the current one.",
      path: ["phone"],
    }
  );

  type UpdatePhoneFormValues = z.infer<typeof updatePhoneSchema>;

  const form = useForm<UpdatePhoneFormValues>({
    resolver: zodResolver(updatePhoneSchema),
    mode: "onChange",
    defaultValues: {
      country: defaultCountry,
      phone: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UpdatePhoneFormValues) => {
      const selectedCountry = MOCK_COUNTRIES.find(c => c.country === data.country);
      const fullPhoneNumber = `${data.country}-${selectedCountry?.countryCode}-${data.phone}`;
      return updatePhoneApi({ token, newPhoneNumber: fullPhoneNumber });
    },
    onSuccess: (updatedUserDetails) => {
      queryClient.setQueryData(['tutorAccountDetails', token], (oldData: any) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          userDetails: {
            ...oldData.userDetails,
            ...updatedUserDetails,
          }
        };
      });
      toast({
        title: "Phone Number Updated!",
        description: "Your phone number has been successfully updated.",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        country: defaultCountry,
        phone: "",
      });
    }
  }, [isOpen, defaultCountry, form]);

  const onSubmit: SubmitHandler<UpdatePhoneFormValues> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Update Your Phone Number</DialogTitle>
          <DialogDescription>
            Your current number is <strong>{currentCountryCode} {currentPhone}</strong>. Enter the new number you'd like to use.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormItem>
                <FormLabel>New Phone Number</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="w-auto min-w-[120px]">
                        <Select onValueChange={field.onChange} value={field.value} disabled={mutation.isPending}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOCK_COUNTRIES.map(c => (
                              <SelectItem key={c.country} value={c.country}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="tel" placeholder="XXXXXXXXXX" {...field} className="pl-10" disabled={mutation.isPending}/>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
            </FormItem>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={mutation.isPending || !form.formState.isValid}>
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
