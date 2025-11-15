
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
import { Loader2, Landmark, Save } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiTutor } from "@/types";

const bankDetailsSchema = z.object({
  paymentType: z.enum(["UPI", "BANK"]),
  upiId: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
}).refine(data => {
    if (data.paymentType === 'UPI') {
      return !!data.upiId && data.upiId.includes('@');
    }
    return true;
}, {
    message: "A valid UPI ID is required.",
    path: ["upiId"],
}).refine(data => {
    if (data.paymentType === 'BANK') {
      return !!data.accountName && !!data.accountNumber && !!data.ifscCode;
    }
    return true;
}, {
    message: "Account name, number, and IFSC code are required for bank transfer.",
    path: ["accountName"], 
});

type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>;

interface UpdateBankDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialAccountName?: string;
  tutorId?: string; // Add tutorId prop
}

const updateTutorBankDetails = async ({
  tutorId,
  token,
  formData,
}: {
  tutorId: string;
  token: string | null;
  formData: BankDetailsFormValues;
}) => {
  if (!token) throw new Error("Authentication token not found.");

  let requestBody;
  if (formData.paymentType === "UPI") {
    requestBody = {
      paymentType: "UPI",
      accountNumber: formData.upiId, // As per requirement
    };
  } else { // BANK
    requestBody = {
      paymentType: "BANK",
      accountNumber: formData.accountNumber,
      ifsc: formData.ifscCode,
      accountHolderName: formData.accountName,
    };
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/manage/tutor/bank/${tutorId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update bank details." }));
    throw new Error(errorData.message);
  }
  
  return response.json();
};

export function UpdateBankDetailsModal({ isOpen, onOpenChange, initialAccountName, tutorId }: UpdateBankDetailsModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();

  const form = useForm<BankDetailsFormValues>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      paymentType: "UPI",
      upiId: "",
      accountName: initialAccountName || "",
      accountNumber: "",
      ifscCode: "",
    },
  });
  
  const mutation = useMutation({
    mutationFn: (data: BankDetailsFormValues) => {
        if (!tutorId) throw new Error("Tutor ID is not available.");
        return updateTutorBankDetails({ tutorId, token, formData: data });
    },
    onSuccess: (newBankDetails) => {
      queryClient.setQueryData(['tutorProfile', tutorId], (oldData: ApiTutor | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          bankDetails: newBankDetails,
        };
      });
      toast({
        title: "Bank Details Saved!",
        description: "The payment information has been successfully updated.",
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
        paymentType: "UPI",
        upiId: "",
        accountName: initialAccountName || "",
        accountNumber: "",
        ifscCode: "",
      });
    }
  }, [isOpen, initialAccountName, form]);

  const paymentMode = form.watch("paymentType");

  const onSubmit: SubmitHandler<BankDetailsFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Landmark className="mr-2 h-5 w-5" />
            Update Bank Details
          </DialogTitle>
          <DialogDescription>
            This information will be used to process payments for the tutor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Payment Mode</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-4"
                      disabled={mutation.isPending}
                    >
                      <FormItem>
                        <RadioGroupItem value="UPI" id="mode-upi" className="sr-only" />
                        <Label
                          htmlFor="mode-upi"
                          className={cn(
                            "flex items-center justify-center rounded-md border-2 p-3 font-normal cursor-pointer transition-colors",
                            field.value === "UPI"
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:bg-accent/50"
                          )}
                        >
                          UPI
                        </Label>
                      </FormItem>
                      <FormItem>
                        <RadioGroupItem value="BANK" id="mode-bank" className="sr-only" />
                        <Label
                          htmlFor="mode-bank"
                           className={cn(
                            "flex items-center justify-center rounded-md border-2 p-3 font-normal cursor-pointer transition-colors",
                            field.value === "BANK"
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:bg-accent/50"
                          )}
                        >
                          Bank Transfer
                        </Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMode === "UPI" && (
              <FormField
                control={form.control}
                name="upiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPI ID</FormLabel>
                    <FormControl>
                      <Input placeholder="yourname@bank" {...field} disabled={mutation.isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {paymentMode === "BANK" && (
              <div className="space-y-4 pt-2 border-t mt-4">
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} disabled={mutation.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter account number" {...field} disabled={mutation.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ifscCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter IFSC code" {...field} disabled={mutation.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Details</>}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
