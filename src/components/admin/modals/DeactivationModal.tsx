
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { XCircle, Loader2, Lock } from "lucide-react";

interface DeactivationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutorName: string;
  tutorId: string;
}

const deactivationReasons = [
  { id: "tutor_request", label: "Tutor requested deactivation" },
  { id: "terms_violation", label: "Violation of platform terms" },
  { id: "poor_performance", label: "Poor performance or reviews" },
  { id: "other", label: "Other (requires manual note)" },
];

export function DeactivationModal({ isOpen, onOpenChange, tutorName, tutorId }: DeactivationModalProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState<string | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleConfirmDeactivation = async () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for deactivation.",
      });
      return;
    }
    setIsDeactivating(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Deactivating tutor ${tutorId} for reason: ${reason}`);
    
    toast({
      title: "Tutor Deactivated (Mock)",
      description: `${tutorName} has been deactivated.`,
    });
    setIsDeactivating(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Confirm Deactivation for {tutorName}</DialogTitle>
          <DialogDescription>
            Please provide a reason for deactivating this tutor profile. This action will make the tutor inactive on the platform.
          </DialogDescription>
        </DialogHeader>
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
                <RadioGroupItem value={option.label} id={`deact-${option.id}`} />
                <Label htmlFor={`deact-${option.id}`} className="font-normal">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="button" variant="destructive" onClick={handleConfirmDeactivation} disabled={!reason || isDeactivating}>
            {isDeactivating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
            {isDeactivating ? "Deactivating..." : "Confirm Deactivation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
