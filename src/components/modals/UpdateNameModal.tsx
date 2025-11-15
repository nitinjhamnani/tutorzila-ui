
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
import { UserCircle, Loader2, Save } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateNameModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentName: string;
}

const updateNameApi = async ({
  token,
  newName,
}: {
  token: string | null;
  newName: string;
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
      changeType: "NAME",
      value: newName,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update name." }));
    throw new Error(errorData.message);
  }

  return response.json();
};

export function UpdateNameModal({ isOpen, onOpenChange, currentName }: UpdateNameModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();

  const updateNameSchema = z.object({
    newName: z.string().min(2, "Name must be at least 2 characters.").refine(
      (name) => name !== currentName,
      { message: "New name must be different from the current one." }
    ),
  });

  type UpdateNameFormValues = z.infer<typeof updateNameSchema>;

  const form = useForm<UpdateNameFormValues>({
    resolver: zodResolver(updateNameSchema),
    mode: "onChange",
    defaultValues: {
      newName: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateNameFormValues) => updateNameApi({ token, newName: data.newName }),
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
        title: "Name Updated!",
        description: "Your name has been successfully updated.",
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
        form.setValue("newName", currentName);
    } else {
      form.reset();
    }
  }, [isOpen, currentName, form]);

  const onSubmit: SubmitHandler<UpdateNameFormValues> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Update Your Name</DialogTitle>
          <DialogDescription>
            Your current name is <strong>{currentName}</strong>. Enter the new name you'd like to use.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="newName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter your new name"
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
                {mutation.isPending ? "Saving..." : "Save Name"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
