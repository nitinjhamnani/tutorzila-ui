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
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useMutation } from "@tanstack/react-query";

interface TutorDeactivationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const deactivationReasons = [
  { id: "not_enough_leads", label: "I'm not getting enough relevant student enquiries." },
  { id: "dissatisfied_platform", label: "I'm not satisfied with the platform's features or policies." },
  { id: "found_opportunities", label: "I've found tutoring opportunities elsewhere." },
  { id: "taking_break", label: "I'm taking a temporary break from tutoring." },
  { id: "other", label: "Other" },
];

const deactivateTutorApi = async ({ token, reason }: { token: string | null; reason: string }) => {
  if (!token) throw new Error("Authentication token is required to deactivate.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/tutor/deactivate`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ message: reason }),
  });

  if (!response.ok) {
    let errorMsg = "Failed to deactivate account.";
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      // Ignore if response is not JSON
    }
    throw new Error(errorMsg);
  }
  
  // No response body is expected on success, just the status code.
  return true;
};


export function TutorDeactivationModal({ isOpen, onOpenChange }: TutorDeactivationModalProps) {
  const { toast } = useToast();
  const { user, logout, token } = useAuthMock();
  const [reason, setReason] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (deactivationReason: string) => deactivateTutorApi({ token, reason: deactivationReason }),
    onSuccess: () => {
      toast({
        title: "Account Deactivated",
        description: "Your account has been deactivated. We're sorry to see you go.",
      });
      onOpenChange(false);
      logout(); // Log the user out and clear session data
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Deactivation Failed",
        description: error.message,
      });
    },
    onSettled: () => {
      setReason(null);
    }
  });


  const handleDeactivation = () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for deactivating your account.",
      });
      return;
    }
    mutation.mutate(reason);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to deactivate your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will make your profile inactive and you will no longer appear in search results. Please select a reason for leaving.
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
                <RadioGroupItem value={option.label} id={`self-deact-${option.id}`} />
                <Label htmlFor={`self-deact-${option.id}`} className="font-normal">{option.label}</Label>
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
            {mutation.isPending ? 'Deactivating...' : 'Confirm Deactivation'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
