
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, VenetianMask, Loader2, Save } from "lucide-react";
import React from "react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const personalDetailsSchema = z.object({
  gender: z.enum(["MALE", "FEMALE"]),
});

type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;

interface EditPersonalDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentGender: "MALE" | "FEMALE" | undefined;
}

const updateTutorGender = async ({
  token,
  gender,
}: {
  token: string | null;
  gender: "MALE" | "FEMALE";
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
      changeType: "GENDER",
      value: gender,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update gender." }));
    throw new Error(errorData.message);
  }
  
  return response.json();
};

export function EditPersonalDetailsModal({ isOpen, onOpenChange, currentGender }: EditPersonalDetailsModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();

  const form = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      gender: currentGender,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ gender: currentGender });
    }
  }, [isOpen, currentGender, form]);

  const mutation = useMutation({
    mutationFn: (data: PersonalDetailsFormValues) => updateTutorGender({ token, gender: data.gender }),
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
        title: "Details Updated!",
        description: "Your personal details have been updated.",
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

  function onSubmit(data: PersonalDetailsFormValues) {
    mutation.mutate(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserCircle className="mr-2 h-5 w-5" />
            Edit Personal Details
          </DialogTitle>
          <DialogDescription>
            Update your gender information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Gender</FormLabel>
                  <div className="relative">
                    <VenetianMask className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select onValueChange={field.onChange} value={field.value} disabled={mutation.isPending}>
                      <FormControl>
                        <SelectTrigger className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={mutation.isPending || !form.formState.isValid}>
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
