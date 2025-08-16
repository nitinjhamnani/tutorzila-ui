
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
import { useToast } from "@/hooks/use-toast";
import { CheckSquare } from "lucide-react";

interface ApproveBioModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutorName: string;
}

const approvalReasons = [
  { id: "grammar_checked", label: "Grammar and spelling checked" },
  { id: "content_verified", label: "Content verified against qualifications" },
  { id: "adheres_guidelines", label: "Adheres to community guidelines" },
  { id: "other", label: "Other (Manual check)" },
];

export function ApproveBioModal({ isOpen, onOpenChange, tutorName }: ApproveBioModalProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState<string | null>(null);

  const handleConfirmApproval = () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for approving the bio.",
      });
      return;
    }
    console.log("Approving bio with reason:", reason);
    toast({
      title: "Bio Approved (Mock)",
      description: `The bio for ${tutorName} has been approved. Reason: ${reason}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Approve Bio for {tutorName}</DialogTitle>
          <DialogDescription>
            Select a reason for approving this tutor's biography.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Label htmlFor="approval-reason">Reason for Approval</Label>
          <RadioGroup
            id="approval-reason"
            onValueChange={setReason}
            value={reason || ""}
            className="flex flex-col space-y-2"
          >
            {approvalReasons.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value={option.label} id={option.id} />
                <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleConfirmApproval} disabled={!reason}>
            <CheckSquare className="mr-2 h-4 w-4" /> Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
