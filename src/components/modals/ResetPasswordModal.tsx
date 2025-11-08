
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
import { KeyRound, Lock, Loader2, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const resetPasswordSchema = z
  .object({
    newPassword: z.string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const resetPasswordApi = async ({
  password,
  token,
}: {
  password: string;
  token: string | null;
}) => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/user/password`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'TZ-USER-PASS': password,
      'accept': '*/*',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to reset password." }));
    throw new Error(errorData.message);
  }
  
  return true; 
};


const PasswordCheck = ({ label, isMet }: { label: string; isMet: boolean }) => (
  <div className={cn("flex items-center text-xs", isMet ? "text-green-600" : "text-muted-foreground")}>
    {isMet ? <Check className="mr-2 h-3.5 w-3.5" /> : <Circle className="mr-2 h-3.5 w-3.5" />}
    <span>{label}</span>
  </div>
);

export function ResetPasswordModal({ isOpen, onOpenChange }: ResetPasswordModalProps) {
  const { toast } = useToast();
  const { logout, token } = useAuthMock();
  const queryClient = useQueryClient();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = form.watch("newPassword");

  const validationChecks = {
    length: (newPassword || "").length >= 8,
    uppercase: /[A-Z]/.test(newPassword || ""),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword || ""),
  };
  
  const mutation = useMutation({
    mutationFn: (data: ResetPasswordFormValues) => resetPasswordApi({ password: data.newPassword, token }),
    onSuccess: () => {
      toast({
        title: "Password Reset Successful!",
        description: "Your password has been changed. Please log in again with your new credentials.",
      });
      logout();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: error.message,
      });
    },
  });


  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);


  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <KeyRound className="mr-2 h-5 w-5" />
            Reset Your Password
          </DialogTitle>
          <DialogDescription>
            Enter and confirm a new strong password for your account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Lock className="mr-2 h-4 w-4 text-primary/80" />
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="p-3 bg-muted/50 rounded-md space-y-1.5 border border-border/50">
              <PasswordCheck label="At least 8 characters long" isMet={validationChecks.length} />
              <PasswordCheck label="At least one uppercase letter" isMet={validationChecks.uppercase} />
              <PasswordCheck label="At least one special symbol" isMet={validationChecks.specialChar} />
            </div>

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Lock className="mr-2 h-4 w-4 text-primary/80" />
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={mutation.isPending || !form.formState.isValid}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
