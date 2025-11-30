
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { ShieldCheck, RefreshCw, Mail, Phone, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface UserOtpVerificationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  verificationType: "email" | "phone";
  identifier: string;
  onSuccess: () => Promise<void> | void;
}

const verifyOtpApi = async (token: string | null, verificationId: string, otp: string) => {
    if (!token) throw new Error("Authentication token is required.");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    // The verificationId in this context is the user's email or phone, not an ID from a previous API call.
    // The API seems to expect the identifier directly.
    const endpoint = verificationId.includes('@')
        ? `/api/verify/otp?verificationId=${encodeURIComponent(verificationId)}&otp=${otp}`
        : `/api/verify/otp?verificationId=${encodeURIComponent(verificationId)}&otp=${otp}`;


    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'GET', // Method is GET as per previous implementations
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Invalid OTP or an error occurred.' }));
        throw new Error(errorData.message);
    }

    return response.json();
};

export function UserOtpVerificationModal({
  isOpen,
  onOpenChange,
  verificationType,
  identifier,
  onSuccess,
}: UserOtpVerificationModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();
  const [timer, setTimer] = useState(600);
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const mutation = useMutation({
    mutationFn: (otp: string) => verifyOtpApi(token, identifier, otp),
    onSuccess: (updatedUserDetails) => {
        // Invalidate queries to refetch user data after successful verification
        queryClient.invalidateQueries({ queryKey: ["tutorAccountDetails", token] });
        queryClient.invalidateQueries({ queryKey: ["parentAccountDetails", token] });
        
        onSuccess();
        onOpenChange(false);
    },
    onError: (error: Error) => {
        form.setError("otp", {
            type: "manual",
            message: "Invalid OTP provided. Please provide the correct OTP.",
        });
        form.resetField("otp");
    }
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
      setTimer(600);
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (timer > 0 && isOpen) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isOpen]);
  
  const handleOpenChange = (open: boolean) => {
    if (!open && !mutation.isSuccess) {
      setIsConfirmingClose(true);
    } else {
      onOpenChange(open);
    }
  };

  const handleConfirmClose = () => {
    onOpenChange(false);
    setIsConfirmingClose(false);
  };

  const onSubmit: SubmitHandler<OtpFormValues> = async (data) => {
    mutation.mutate(data.otp);
  };
  
  const typeTitle = verificationType.charAt(0).toUpperCase() + verificationType.slice(1);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md bg-card p-0 rounded-lg overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className={cn("p-6 pb-4 text-left border-b")}>
          <div className={cn("flex items-center gap-3")}>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
            <div>
              <DialogTitle className={cn("text-lg font-semibold text-foreground")}>
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
                      maxLength={6}
                      placeholder="••••••"
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(numericValue);
                      }}
                      className="text-center text-base tracking-[0.3em] py-2.5 h-11 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="text-center text-sm text-muted-foreground">
                OTP is valid for: <span className="font-semibold text-primary">{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</span>
              </div>
            <DialogFooter className="gap-2 flex-col sm:flex-row sm:justify-end pt-2">
              <Button
                type="submit"
                disabled={mutation.isPending || !form.formState.isValid}
                className="w-full sm:w-auto"
              >
                {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Verifying...</> : "Verify Code"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
     <AlertDialog open={isConfirmingClose} onOpenChange={setIsConfirmingClose}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                Closing this will cancel the verification process. You can try again from your account page.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmingClose(false)}>No, continue</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Yes, cancel</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
