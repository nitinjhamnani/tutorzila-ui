
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { ApiTutor } from "@/types";

interface AdminUpdateBioModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutorName: string;
  tutorId: string;
  initialBio: string;
}

const updateBioSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters.").max(500, "Bio cannot exceed 500 characters."),
});

type UpdateBioFormValues = z.infer<typeof updateBioSchema>;

const updateTutorBioApi = async ({
  tutorId,
  bio,
  token,
}: {
  tutorId: string;
  bio: string;
  token: string | null;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!tutorId) throw new Error("Tutor ID is missing.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/tutor/bio/${tutorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify({ message: bio }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update bio." }));
    throw new Error(errorData.message);
  }
  return response.json();
};

export function AdminUpdateBioModal({ isOpen, onOpenChange, tutorName, tutorId, initialBio }: AdminUpdateBioModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();

  const form = useForm<UpdateBioFormValues>({
    resolver: zodResolver(updateBioSchema),
    defaultValues: {
      bio: initialBio,
    },
  });
  
  useEffect(() => {
    if(isOpen) {
        form.reset({ bio: initialBio });
    }
  }, [isOpen, initialBio, form]);

  const mutation = useMutation({
    mutationFn: (values: UpdateBioFormValues) => updateTutorBioApi({ tutorId, bio: values.bio, token }),
    onSuccess: (updatedTutoringDetails) => {
      queryClient.setQueryData(['tutorProfile', tutorId], (oldData: ApiTutor | undefined) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          ...updatedTutoringDetails,
        };
      });
      toast({
        title: "Bio Updated!",
        description: `The bio for ${tutorName} has been successfully updated.`,
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

  const onSubmit: SubmitHandler<UpdateBioFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle>Update Bio for {tutorName}</DialogTitle>
          <DialogDescription>
            Make changes to the tutor's biography. This will be visible on their public profile.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tutor Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the tutor's bio here..."
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit3 className="mr-2 h-4 w-4" />}
                {mutation.isPending ? "Saving..." : "Save Bio"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
