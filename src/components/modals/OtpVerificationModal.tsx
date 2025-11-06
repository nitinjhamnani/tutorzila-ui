
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
import { ShieldCheck, RefreshCw, Mail, Phone, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }).regex(/^\d{6}$/, "OTP must be numeric and 6 digits long."),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpVerificationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  verificationType: "email" | "phone";
  identifier: string;
  onSuccess: (otp: string) => void; 
  onResend: () => Promise<void>; 
}

export function OtpVerificationModal({
  isOpen,
  onOpenChange,
  verificationType,
  identifier,
  onSuccess,
  onResend,
}: OtpVerificationModalProps) {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (isOpen) {
      setTimer(600); // Reset timer when modal opens
    }
  }, [isOpen]);

  useEffect(() => {
    if (timer > 0 && isOpen) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isOpen]);

  const onSubmit: SubmitHandler<OtpFormValues> = async (data) => {
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async
    onSuccess(data.otp);
    setIsVerifying(false);
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
        await onResend();
        setTimer(600); // Reset timer on resend
        toast({
            title: "OTP Resent",
            description: `A new OTP has been sent to ${identifier}.`,
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Failed to Resend",
            description: (error as Error).message || "An unexpected error occurred.",
        });
    } finally {
        setIsResending(false);
    }
  };

  const Icon = verificationType === "email" ? Mail : Phone;
  const typeTitle = verificationType.charAt(0).toUpperCase() + verificationType.slice(1);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md bg-card p-0 rounded-lg overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4 text-left border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-foreground">
                Verify Your {typeTitle}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                An OTP has been sent to <span className="font-medium text-foreground">{identifier}</span>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pt-5 pb-6 space-y-5">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">Enter 6-Digit OTP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text" 
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={6}
                      placeholder="••••••"
                      className="text-center text-base tracking-[0.3em] py-2.5 h-11 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm hover:shadow-md focus:shadow-lg rounded-md"
                      disabled={isVerifying}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="text-center text-sm text-muted-foreground">
                OTP is valid for: <span className="font-semibold text-primary">{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</span>
             </div>
            <DialogFooter className="gap-2 flex-col sm:flex-row sm:justify-between pt-2">
              <Button
                type="button"
                variant="link"
                onClick={handleResendOtp}
                disabled={isResending || isVerifying || timer > 540} // Disable resend for the first minute
                className="text-xs text-primary hover:text-primary/80 p-0 h-auto self-center sm:self-auto"
              >
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
                {isResending ? "Resending..." : "Resend OTP"}
              </Button>
              <Button
                type="submit"
                disabled={isVerifying || !form.formState.isValid}
                className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95 text-sm py-2.5"
              >
                {isVerifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Verifying...</> : "Verify Code"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
