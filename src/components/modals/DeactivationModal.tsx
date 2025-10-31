
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
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

interface DeactivationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userName: string;
  userId: string;
}

const deactivationReasons = [
  { id: "not_finding_tutors", label: "Not finding suitable tutors/students." },
  { id: "taking_a_break", label: "I'm just taking a break." },
  { id: "found_elsewhere", label: "Found a better platform elsewhere." },
  { id: "cost_issues", label: "Costs and fees are an issue." },
  { id: "other", label: "Other reason." },
];

export function DeactivationModal({ isOpen, onOpenChange, userName, userId }: DeactivationModalProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<"temporary" | "permanent" | null>(null);

  const handleDeactivation = async (type: "temporary" | "permanent") => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for deactivation.",
      });
      return;
    }
    
    setIsSubmitting(type);
    console.log(`Deactivating (${type}) user ${userId} for reason: ${reason}`);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: `Account Deactivated (${type})`,
      description: `The account for ${userName} has been handled. (This is a mock action)`,
    });
    
    setIsSubmitting(null);
    onOpenChange(false);
    // In a real app, you would likely call a logout function here and redirect.
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate Account: {userName}</AlertDialogTitle>
          <AlertDialogDescription>
            We're sorry to see you go. Please let us know why you're deactivating. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <Label htmlFor="deactivation-reason">Reason for Deactivation</Label>
          <RadioGroup
            id="deactivation-reason"
            onValueChange={setReason}
            value={reason || ""}
            className="flex flex-col space-y-2"
            disabled={!!isSubmitting}
          >
            {deactivationReasons.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value={option.label} id={`deact-reason-${option.id}`} />
                <Label htmlFor={`deact-reason-${option.id}`} className="font-normal">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <AlertDialogFooter className="gap-2 sm:flex-col md:flex-row">
          <Button 
            variant="secondary" 
            onClick={() => handleDeactivation("temporary")} 
            disabled={!reason || !!isSubmitting}
          >
            {isSubmitting === 'temporary' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Lock className="mr-2 h-4 w-4" />}
            {isSubmitting === 'temporary' ? 'Deactivating...' : 'Temporarily Deactivate'}
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => handleDeactivation("permanent")}
            disabled={!reason || !!isSubmitting}
          >
            {isSubmitting === 'permanent' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4" />}
            {isSubmitting === 'permanent' ? 'Deleting...' : 'Permanently Deactivate'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
