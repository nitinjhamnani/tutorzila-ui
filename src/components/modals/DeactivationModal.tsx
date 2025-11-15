
"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { XCircle, Loader2, Lock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { ApiTutor, User } from "@/types";

interface DeactivationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userName: string;
  userId: string;
}

const deactivationReasons = [
  { id: "user_request", label: "User requested deactivation" },
  { id: "terms_violation", label: "Violation of platform terms" },
  { id: "poor_performance", label: "Poor performance or reviews" },
  { id: "other", label: "Other (requires manual note)" },
];

const updateUserRegistration = async ({
  userId,
  reason,
  token,
  register,
}: {
  userId: string;
  reason: string;
  token: string | null;
  register: boolean;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!userId) throw new Error("User ID is missing.");
  if (!reason) throw new Error("A reason is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/tutor/register/${userId}?registered=${register}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify({ message: reason }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update user status." }));
    throw new Error(errorData.message);
  }

  return response.json();
};

export function DeactivationModal({ isOpen, onOpenChange, userName, userId }: DeactivationModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (deactivationReason: string) => updateUserRegistration({ userId, reason: deactivationReason, token, register: false }),
    onSuccess: (updatedDetails) => {
      // Check if it's a tutor or parent being deactivated
      const tutorQueryKey = ['tutorProfile', userId];
      const parentQueryKey = ['parentDetails', userId];

      const existingTutorData = queryClient.getQueryData<ApiTutor>(tutorQueryKey);
      
      if (existingTutorData) {
        queryClient.setQueryData(tutorQueryKey, (oldData: ApiTutor | undefined) => {
          if (!oldData) return undefined;
           // The API for unregister returns tutoring details
          return { ...oldData, ...updatedDetails };
        });
      } else {
        // If it's a parent, their details might be cached differently
        queryClient.invalidateQueries({ queryKey: parentQueryKey });
      }

      toast({
        title: "User Unregistered",
        description: `${userName} has been successfully unregistered.`,
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Unregistration Failed",
        description: error.message,
      });
    },
  });

  const handleDeactivation = () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for this action.",
      });
      return;
    }
    mutation.mutate(reason);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>Unregister Account: {userName}</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason for unregistering this user. This will make the tutor inactive and remove them from public listings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <Label htmlFor="deactivation-reason">Reason for Unregistering</Label>
          <RadioGroup
            id="deactivation-reason"
            onValueChange={setReason}
            value={reason || ""}
            className="flex flex-col space-y-2"
            disabled={mutation.isPending}
          >
            {deactivationReasons.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value={option.label} id={`deact-reason-${option.id}`} />
                <Label htmlFor={`deact-reason-${option.id}`} className="font-normal">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeactivation} 
            disabled={!reason || mutation.isPending}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Lock className="mr-2 h-4 w-4" />}
            {mutation.isPending ? 'Processing...' : 'Confirm Unregister'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
