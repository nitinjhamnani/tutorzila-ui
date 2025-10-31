
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
import { Phone, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MOCK_COUNTRIES = [
  { country: "IN", countryCode: "+91", label: "India (+91)" },
  { country: "US", countryCode: "+1", label: "USA (+1)" },
  { country: "GB", countryCode: "+44", label: "UK (+44)" },
  { country: "AU", countryCode: "+61", label: "Australia (+61)" },
  { country: "JP", countryCode: "+81", label: "Japan (+81)" },
];

const updatePhoneSchema = z.object({
  country: z.string().min(1, "Country is required."),
  phone: z.string().min(10, "Phone number must be at least 10 digits.").regex(/^\d+$/, "Phone number must be numeric."),
});

type UpdatePhoneFormValues = z.infer<typeof updatePhoneSchema>;

interface UpdatePhoneModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentPhone?: string;
  currentCountryCode?: string;
}

export function UpdatePhoneModal({ isOpen, onOpenChange, currentPhone, currentCountryCode }: UpdatePhoneModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultCountry = MOCK_COUNTRIES.find(c => c.countryCode === currentCountryCode)?.country || "IN";

  const form = useForm<UpdatePhoneFormValues>({
    resolver: zodResolver(updatePhoneSchema),
    defaultValues: {
      country: defaultCountry,
      phone: currentPhone || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        country: defaultCountry,
        phone: currentPhone || "",
      });
    }
  }, [isOpen, currentPhone, currentCountryCode, defaultCountry, form]);

  const onSubmit: SubmitHandler<UpdatePhoneFormValues> = async (data) => {
    setIsSubmitting(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Updating phone to:", data.country, data.phone);

    // On mock success
    toast({
      title: "OTP Sent!",
      description: `An OTP has been sent to your new phone number for verification.`,
    });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Update Your Phone Number</DialogTitle>
          <DialogDescription>
            Your current number is <strong>{currentCountryCode} {currentPhone}</strong>. An OTP will be sent to the new number for verification.
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
                        <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
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
                            <Input type="tel" placeholder="XXXXXXXXXX" {...field} className="pl-10" disabled={isSubmitting}/>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
            </FormItem>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
