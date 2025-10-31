
"use client";

import { useState } from "react";
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

const bankDetailsSchema = z.object({
  paymentMode: z.enum(["UPI", "NEFT/IMPS"]),
  upiId: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
}).refine(data => {
    if (data.paymentMode === 'UPI') {
      return !!data.upiId && data.upiId.includes('@');
    }
    return true;
}, {
    message: "A valid UPI ID is required.",
    path: ["upiId"],
}).refine(data => {
    if (data.paymentMode === 'NEFT/IMPS') {
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
}

export function UpdateBankDetailsModal({ isOpen, onOpenChange }: UpdateBankDetailsModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BankDetailsFormValues>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      paymentMode: "UPI",
      upiId: "",
      accountName: "",
      accountNumber: "",
      ifscCode: "",
    },
  });

  const paymentMode = form.watch("paymentMode");

  const onSubmit: SubmitHandler<BankDetailsFormValues> = async (data) => {
    setIsSubmitting(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Submitting Bank Details:", data);
    
    toast({
      title: "Bank Details Saved!",
      description: "Your payment information has been updated.",
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
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
            This information will be used to process your payments.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="paymentMode"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Payment Mode</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-4"
                      disabled={isSubmitting}
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
                        <RadioGroupItem value="NEFT/IMPS" id="mode-bank" className="sr-only" />
                        <Label
                          htmlFor="mode-bank"
                           className={cn(
                            "flex items-center justify-center rounded-md border-2 p-3 font-normal cursor-pointer transition-colors",
                            field.value === "NEFT/IMPS"
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
                      <Input placeholder="yourname@bank" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {paymentMode === "NEFT/IMPS" && (
              <div className="space-y-4 pt-2 border-t mt-4">
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
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
                        <Input placeholder="Enter account number" {...field} disabled={isSubmitting} />
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
                        <Input placeholder="Enter IFSC code" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Details</>}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
