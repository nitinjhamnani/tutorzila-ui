
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

interface TutorDeactivationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const deactivationReasons = [
  { id: "not_enough_leads", label: "Not receiving enough relevant student leads" },
  { id: "dissatisfied_platform", label: "Dissatisfied with the platform's features or policies" },
  { id: "found_opportunities", label: "Found tutoring opportunities elsewhere" },
  { id: "taking_break", label: "Taking a temporary break from tutoring" },
  { id: "other", label: "Other" },
];

export function TutorDeactivationModal({ isOpen, onOpenChange }: TutorDeactivationModalProps) {
  const { toast } = useToast();
  const { user, logout } = useAuthMock();
  const [reason, setReason] = useState<string | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDeactivation = async () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for deactivating your account.",
      });
      return;
    }
    setIsDeactivating(true);
    // In a real app, you would make an API call here.
    console.log(`Deactivating account for ${user?.name} with reason: ${reason}`);
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    toast({
      title: "Account Deactivated",
      description: "Your account has been deactivated. We're sorry to see you go.",
    });
    
    setIsDeactivating(false);
    onOpenChange(false);
    logout(); // Log the user out after deactivation.
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
            disabled={isDeactivating}
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
          <AlertDialogCancel disabled={isDeactivating}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeactivation} 
            disabled={!reason || isDeactivating}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeactivating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Lock className="mr-2 h-4 w-4" />}
            {isDeactivating ? 'Deactivating...' : 'Confirm Deactivation'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
