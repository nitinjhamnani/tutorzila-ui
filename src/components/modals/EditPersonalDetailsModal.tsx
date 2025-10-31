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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, Loader2, Edit3, VenetianMask } from "lucide-react";
import { useEffect } from "react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";

const editPersonalDetailsSchema = z.object({
  name: z.string().min(2, "Full name is required."),
  gender: z.enum(["male", "female", "other", "not_specified"]).optional(),
});

type EditPersonalDetailsFormValues = z.infer<typeof editPersonalDetailsSchema>;

interface EditPersonalDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User | null;
}

const mapGenderToForm = (genderValue?: string | null): "male" | "female" | "other" | "not_specified" => {
    const lowerGender = genderValue?.toLowerCase();
    if (lowerGender === "male" || lowerGender === "female" || lowerGender === "other") {
        return lowerGender;
    }
    return "not_specified";
};

const updateUserPersonalDetails = async ({
  userId,
  token,
  formData,
}: {
  userId: string;
  token: string | null;
  formData: EditPersonalDetailsFormValues;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!userId) throw new Error("User ID is missing.");
  
  const requestBody = {
    name: formData.name,
    gender: formData.gender === "not_specified" ? "" : formData.gender?.toUpperCase(),
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  // This endpoint is assumed based on user update patterns.
  // It might need to be /api/user/update or similar.
  const response = await fetch(`${apiBaseUrl}/api/admin/user/update/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update details." }));
    throw new Error(errorData.message);
  }
  
  return response.json();
};

export function EditPersonalDetailsModal({ isOpen, onOpenChange, user }: EditPersonalDetailsModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();

  const form = useForm<EditPersonalDetailsFormValues>({
    resolver: zodResolver(editPersonalDetailsSchema),
    defaultValues: {
      name: user?.name || "",
      gender: mapGenderToForm(user?.gender),
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      form.reset({
        name: user.name || "",
        gender: mapGenderToForm(user.gender),
      });
    }
  }, [user, isOpen, form]);

  const mutation = useMutation({
    mutationFn: (data: EditPersonalDetailsFormValues) => updateUserPersonalDetails({ userId: user!.id, token, formData: data }),
    onSuccess: (updatedUserDetails) => {
      queryClient.setQueryData(['userDetails', token], (oldData: User | undefined) => {
        if (!oldData) return updatedUserDetails;
        return {
          ...oldData,
          ...updatedUserDetails,
        };
      });
      toast({
        title: "Details Updated!",
        description: "Your personal details have been successfully updated.",
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
  
  const onSubmit = (data: EditPersonalDetailsFormValues) => {
    mutation.mutate(data);
  };
  
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit3 className="mr-2 h-5 w-5" />
            Edit Personal Details
          </DialogTitle>
          <DialogDescription>
            Update your name and gender information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><UserIcon className="mr-2 h-4 w-4 text-primary/80" />Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} disabled={mutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center"><VenetianMask className="mr-2 h-4 w-4 text-primary/80" />Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "not_specified"}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="not_specified">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
