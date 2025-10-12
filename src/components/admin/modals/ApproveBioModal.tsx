
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
import { CheckSquare, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { ApiTutor } from "@/types";

interface ApproveBioModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutorName: string;
  tutorId: string;
}

const approvalReasons = [
  { id: "grammar_checked", label: "Grammar and spelling checked" },
  { id: "content_verified", label: "Content verified against qualifications" },
  { id: "adheres_guidelines", label: "Adheres to community guidelines" },
  { id: "other", label: "Other (Manual check)" },
];

const approveTutorBioApi = async ({
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
  if (!reason) throw new Error("An approval reason is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/tutor/bio/approve/${tutorId}?approved=true`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify({ message: reason }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to approve bio." }));
    throw new Error(errorData.message);
  }
  return response.json();
};

export function ApproveBioModal({ isOpen, onOpenChange, tutorName, tutorId }: ApproveBioModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (approvalReason: string) => approveTutorBioApi({ tutorId, reason: approvalReason, token }),
    onSuccess: (tutoringDetails) => {
      queryClient.setQueryData(['tutorProfile', tutorId], (oldData: ApiTutor | undefined) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          subjectsList: tutoringDetails.subjects,
          gradesList: tutoringDetails.grades,
          boardsList: tutoringDetails.boards,
          qualificationList: tutoringDetails.qualifications,
          availabilityDaysList: tutoringDetails.availabilityDays,
          availabilityTimeList: tutoringDetails.availabilityTime,
          yearOfExperience: tutoringDetails.yearOfExperience,
          bio: tutoringDetails.tutorBio,
          addressName: tutoringDetails.addressName,
          address: tutoringDetails.address,
          city: tutoringDetails.city,
          state: tutoringDetails.state,
          area: tutoringDetails.area,
          pincode: tutoringDetails.pincode,
          country: tutoringDetails.country,
          googleMapsLink: tutoringDetails.googleMapsLink,
          hourlyRate: tutoringDetails.hourlyRate,
          languagesList: tutoringDetails.languages,
          profileCompletion: tutoringDetails.profileCompletion,
          isActive: tutoringDetails.active,
          isRateNegotiable: tutoringDetails.rateNegotiable,
          isBioReviewed: tutoringDetails.bioReviewed,
          online: tutoringDetails.online,
          offline: tutoringDetails.offline,
          isHybrid: tutoringDetails.hybrid,
        };
      });
      toast({
        title: "Bio Approved!",
        description: `The bio for ${tutorName} has been successfully approved.`,
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: error.message,
      });
    },
    onSettled: () => {
      setReason(null);
    }
  });


  const handleConfirmApproval = () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for approving the bio.",
      });
      return;
    }
    mutation.mutate(reason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if(!open) setReason(null); }}>
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
            disabled={mutation.isPending}
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
          <Button type="button" onClick={handleConfirmApproval} disabled={!reason || mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckSquare className="mr-2 h-4 w-4" />}
            {mutation.isPending ? "Approving..." : "Confirm Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
