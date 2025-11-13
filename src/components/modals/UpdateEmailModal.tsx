
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
import { Mail, Loader2, Save } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateEmailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentEmail: string;
}

const updateEmailApi = async ({
  token,
  newEmail,
}: {
  token: string | null;
  newEmail: string;
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
      changeType: "EMAIL",
      value: newEmail,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update email." }));
    if (response.status === 400) {
      throw new Error("A user with this email address already exists.");
    }
    throw new Error(errorData.message);
  }

  return response.json();
};

export function UpdateEmailModal({ isOpen, onOpenChange, currentEmail }: UpdateEmailModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();

  const updateEmailSchema = z.object({
    newEmail: z.string().email("Please enter a valid email address.").refine(
      (email) => email.toLowerCase() !== currentEmail.toLowerCase(),
      { message: "New email must be different from the current one." }
    ),
  });

  type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;

  const form = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailSchema),
    mode: "onChange",
    defaultValues: {
      newEmail: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateEmailFormValues) => updateEmailApi({ token, newEmail: data.newEmail }),
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
        title: "Email Updated!",
        description: "Your email address has been successfully updated.",
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
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit: SubmitHandler<UpdateEmailFormValues> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Update Your Email Address</DialogTitle>
          <DialogDescription>
            Your current email is <strong>{currentEmail}</strong>. Enter the new email address you'd like to use.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="new.email@example.com"
                        {...field}
                        className="pl-10"
                        disabled={mutation.isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={mutation.isPending || !form.formState.isValid}>
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
