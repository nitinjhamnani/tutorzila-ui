
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
import { CheckCircle, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { ApiTutor } from "@/types";

interface ActivationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutorName: string;
  tutorId: string;
}

const activationReasons = [
  { id: "free_activation", label: "Free Activation" },
  { id: "cash_received", label: "Activation Fee Received (Cash)" },
  { id: "online_received", label: "Activation Fee Received (Online)" },
  { id: "other", label: "Other" },
];

const activateTutor = async ({
  tutorId,
  reason,
  token,
}: {
  tutorId: string;
  reason: string;
  token: string | null;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!tutorId) throw new Error("Tutor ID is missing.");
  if (!reason) throw new Error("An activation reason is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/tutor/activate/${tutorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify({ message: reason }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to activate tutor." }));
    throw new Error(errorData.message);
  }

  return response.json();
};

export function ActivationModal({ isOpen, onOpenChange, tutorName, tutorId }: ActivationModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (activationReason: string) => activateTutor({ tutorId, reason: activationReason, token }),
    onSuccess: (updatedTutoringDetails) => {
      queryClient.setQueryData(['tutorProfile', tutorId], (oldData: ApiTutor | undefined) => {
        if (!oldData) return undefined;
        // Merge the existing userDetails with the new tutoringDetails from the API response
        return {
          ...oldData,
          subjectsList: updatedTutoringDetails.subjects,
          gradesList: updatedTutoringDetails.grades,
          boardsList: updatedTutoringDetails.boards,
          qualificationList: updatedTutoringDetails.qualifications,
          availabilityDaysList: updatedTutoringDetails.availabilityDays,
          availabilityTimeList: updatedTutoringDetails.availabilityTime,
          yearOfExperience: updatedTutoringDetails.yearOfExperience,
          bio: updatedTutoringDetails.tutorBio,
          addressName: updatedTutoringDetails.addressName,
          address: updatedTutoringDetails.address,
          city: updatedTutoringDetails.city,
          state: updatedTutoringDetails.state,
          area: updatedTutoringDetails.area,
          pincode: updatedTutoringDetails.pincode,
          country: updatedTutoringDetails.country,
          googleMapsLink: updatedTutoringDetails.googleMapsLink,
          hourlyRate: updatedTutoringDetails.hourlyRate,
          languagesList: updatedTutoringDetails.languages,
          profileCompletion: updatedTutoringDetails.profileCompletion,
          isActive: updatedTutoringDetails.active,
          isRateNegotiable: updatedTutoringDetails.rateNegotiable,
          isBioReviewed: updatedTutoringDetails.bioReviewed,
          online: updatedTutoringDetails.online,
          offline: updatedTutoringDetails.offline,
          isHybrid: updatedTutoringDetails.hybrid,
        };
      });
      toast({
        title: "Tutor Activated!",
        description: `${tutorName} has been successfully activated.`,
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Activation Failed",
        description: error.message,
      });
    },
  });

  const handleConfirmActivation = () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for activation.",
      });
      return;
    }
    mutation.mutate(reason);
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
          <Button type="button" onClick={handleConfirmActivation} disabled={!reason || mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            {mutation.isPending ? "Activating..." : "Confirm Activation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
