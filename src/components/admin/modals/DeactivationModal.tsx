
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { ApiTutor } from "@/types";

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

const updateTutorActivation = async ({
  tutorId,
  reason,
  token,
  activate,
}: {
  tutorId: string;
  reason: string;
  token: string | null;
  activate: boolean;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!tutorId) throw new Error("Tutor ID is missing.");
  if (!reason) throw new Error("A reason is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/tutor/activate/${tutorId}?activated=${activate}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify({ message: reason }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update tutor status." }));
    throw new Error(errorData.message);
  }

  return response.json();
};

export function DeactivationModal({ isOpen, onOpenChange, tutorName, tutorId }: DeactivationModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (deactivationReason: string) => updateTutorActivation({ tutorId, reason: deactivationReason, token, activate: false }),
    onSuccess: (updatedTutoringDetails) => {
      queryClient.setQueryData(['tutorProfile', tutorId], (oldData: ApiTutor | undefined) => {
        if (!oldData) return undefined;
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
        title: "Tutor Deactivated",
        description: `${tutorName} has been successfully deactivated.`,
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

  const handleConfirmDeactivation = () => {
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
            disabled={mutation.isPending}
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
          <Button type="button" variant="destructive" onClick={handleConfirmDeactivation} disabled={!reason || mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
            {mutation.isPending ? "Deactivating..." : "Confirm Deactivation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
