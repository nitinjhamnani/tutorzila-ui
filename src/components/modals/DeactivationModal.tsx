
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
import { Lock, Trash2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";

interface DeactivationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userName: string;
  userId: string;
}

const deactivationReasons = [
  { id: "tutor_request", label: "User requested deactivation" },
  { id: "terms_violation", label: "Violation of platform terms" },
  { id: "poor_performance", label: "Poor performance or reviews" },
  { id: "other", label: "Other (requires manual note)" },
];

const updateTutorActivation = async ({
  userId,
  reason,
  token,
  activate,
}: {
  userId: string;
  reason: string;
  token: string | null;
  activate: boolean;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!userId) throw new Error("User ID is missing.");
  if (!reason) throw new Error("A reason is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/tutor/activate/${userId}?activated=${activate}`, {
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
    mutationFn: (deactivationReason: string) => updateTutorActivation({ userId, reason: deactivationReason, token, activate: false }),
    onSuccess: (updatedDetails) => {
      // Invalidate both possible query keys
      queryClient.invalidateQueries({ queryKey: ['tutorProfile', userId] });
      queryClient.invalidateQueries({ queryKey: ['parentDetails', userId] });

      toast({
        title: "User Deactivated",
        description: `${userName} has been successfully deactivated.`,
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Deactivation Failed",
        description: error.message,
      });
    },
  });

  const handleDeactivation = () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for deactivation.",
      });
      return;
    }
    mutation.mutate(reason);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate Account: {userName}</AlertDialogTitle>
          <AlertDialogDescription>
            We're sorry to see you go. Please let us know why you're deactivating. This will temporarily disable your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <Label htmlFor="deactivation-reason">Reason for Deactivation</Label>
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
          >
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Lock className="mr-2 h-4 w-4" />}
            {mutation.isPending ? 'Deactivating...' : 'Confirm Deactivation'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
