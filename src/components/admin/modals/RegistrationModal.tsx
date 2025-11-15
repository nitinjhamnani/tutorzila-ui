
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
import { Unlock, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { ApiTutor } from "@/types";

interface RegistrationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutorName: string;
  tutorId: string;
}

const registrationReasons = [
  { id: "profile_complete", label: "Profile verified and complete" },
  { id: "payment_received", label: "Registration payment received" },
  { id: "re-activated", label: "Re-registering a previously unregistered account" },
  { id: "other", label: "Other (Manual Override)" },
];

const updateTutorRegistration = async ({
  tutorId,
  reason,
  token,
  register,
}: {
  tutorId: string;
  reason: string;
  token: string | null;
  register: boolean;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!tutorId) throw new Error("Tutor ID is missing.");
  if (!reason) throw new Error("A reason is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/tutor/activate/${tutorId}?activated=${register}`, {
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


export function RegistrationModal({ isOpen, onOpenChange, tutorName, tutorId }: RegistrationModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (registrationReason: string) => updateTutorRegistration({ tutorId, reason: registrationReason, token, register: true }),
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
          registered: updatedTutoringDetails.registered,
          isActive: updatedTutoringDetails.active,
          isRateNegotiable: updatedTutoringDetails.rateNegotiable,
          isBioReviewed: updatedTutoringDetails.bioReviewed,
          online: updatedTutoringDetails.online,
          offline: updatedTutoringDetails.offline,
          isHybrid: updatedTutoringDetails.hybrid,
        };
      });
      toast({
        title: "Tutor Registered!",
        description: `${tutorName} has been successfully registered.`,
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    },
    onSettled: () => {
        setReason(null);
    }
  });

  const handleConfirmRegistration = () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please select a reason for registration.",
      });
      return;
    }
    mutation.mutate(reason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if(!open) setReason(null); }}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Confirm Registration for {tutorName}</DialogTitle>
          <DialogDescription>
            This action will mark the tutor as registered and activate their profile. Please provide a reason.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Label htmlFor="registration-reason">Reason for Registration</Label>
          <RadioGroup
            id="registration-reason"
            onValueChange={setReason}
            value={reason || ""}
            className="flex flex-col space-y-2"
            disabled={mutation.isPending}
          >
            {registrationReasons.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value={option.label} id={`reg-${option.id}`} />
                <Label htmlFor={`reg-${option.id}`} className="font-normal">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleConfirmRegistration} disabled={!reason || mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Unlock className="mr-2 h-4 w-4" />}
            {mutation.isPending ? "Registering..." : "Confirm Registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
