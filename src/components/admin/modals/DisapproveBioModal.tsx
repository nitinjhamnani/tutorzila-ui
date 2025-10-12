
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
import { Ban, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { ApiTutor } from "@/types";

interface DisapproveBioModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutorName: string;
  tutorId: string;
}

const disapprovalReasons = [
  { id: "inappropriate", label: "Inappropriate Content" },
  { id: "grammar_spelling", label: "Significant Grammar/Spelling Errors" },
  { id: "unprofessional", label: "Unprofessional Tone or Content" },
  { id: "not_relevant", label: "Not relevant to tutoring" },
  { id: "other", label: "Other" },
];

const disapproveTutorBioApi = async ({
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
  if (!reason) throw new Error("A disapproval reason is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/tutor/bio/approve/${tutorId}?approved=false`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify({ message: reason }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to disapprove bio." }));
    throw new Error(errorData.message);
  }
  return response.json();
};

export function DisapproveBioModal({ isOpen, onOpenChange, tutorName, tutorId }: DisapproveBioModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (disapprovalReason: string) => disapproveTutorBioApi({ tutorId, reason: disapprovalReason, token }),
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
        title: "Bio Disapproved",
        description: `The bio for ${tutorName} has been marked for review.`,
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Disapproval Failed",
        description: error.message,
      });
    },
    onSettled: () => {
      setReason(null);
    }
  });

  const handleConfirmDisapproval = () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for disapproving the bio.",
      });
      return;
    }
    mutation.mutate(reason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if(!open) setReason(null); }}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Disapprove Bio for {tutorName}</DialogTitle>
          <DialogDescription>
            Select a reason for disapproving this tutor's biography. This will mark the bio as not reviewed.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Label htmlFor="disapproval-reason">Reason for Disapproval</Label>
          <RadioGroup
            id="disapproval-reason"
            onValueChange={setReason}
            value={reason || ""}
            className="flex flex-col space-y-2"
            disabled={mutation.isPending}
          >
            {disapprovalReasons.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value={option.label} id={`disapprove-${option.id}`} />
                <Label htmlFor={`disapprove-${option.id}`} className="font-normal">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="button" variant="destructive" onClick={handleConfirmDisapproval} disabled={!reason || mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Ban className="mr-2 h-4 w-4" />}
            {mutation.isPending ? "Submitting..." : "Confirm Disapproval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
