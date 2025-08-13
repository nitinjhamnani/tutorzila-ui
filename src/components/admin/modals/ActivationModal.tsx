
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

interface ActivationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutorName: string;
}

const activationReasons = [
  { id: "free_activation", label: "Free Activation" },
  { id: "cash_received", label: "Activation Fee Received (Cash)" },
  { id: "online_received", label: "Activation Fee Received (Online)" },
  { id: "other", label: "Other" },
];

export function ActivationModal({ isOpen, onOpenChange, tutorName }: ActivationModalProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState<string | null>(null);

  const handleConfirmActivation = () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for activation.",
      });
      return;
    }
    console.log("Activating tutor with reason:", reason);
    toast({
      title: "Tutor Activated (Mock)",
      description: `${tutorName} has been activated. Reason: ${reason}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Confirm Activation for {tutorName}</DialogTitle>
          <DialogDescription>
            Please provide a reason for activating this tutor profile. The activation fee is ₹199.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Label htmlFor="activation-reason">Reason for Activation</Label>
          <RadioGroup
            id="activation-reason"
            onValueChange={setReason}
            value={reason || ""}
            className="flex flex-col space-y-2"
          >
            {activationReasons.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value={option.label} id={option.id} />
                <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleConfirmActivation} disabled={!reason}>
            <CheckCircle className="mr-2 h-4 w-4" /> Confirm Activation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

