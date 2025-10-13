
"use client";

import { useState } from "react";
import type { ApiTutor } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Copy, X, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TutorContactModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutor: ApiTutor | null;
}

interface TutorContactDetails {
    name: string;
    email: string;
    countryCode: string;
    phone: string;
}

const fetchTutorContact = async (tutorId: string, token: string | null): Promise<TutorContactDetails> => {
    if (!token) throw new Error("Authentication token not found.");
    if (!tutorId) throw new Error("Tutor ID is required.");

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/api/admin/user/contact/${tutorId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tutor contact details.");
    }
    return response.json();
};


const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
};

export function TutorContactModal({ isOpen, onOpenChange, tutor }: TutorContactModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();

  const { data: contactDetails, isLoading, error } = useQuery({
      queryKey: ['tutorContact', tutor?.id],
      queryFn: () => fetchTutorContact(tutor!.id, token),
      enabled: !!tutor && isOpen,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
  });

  if (!tutor) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: `${fieldName} Copied!`,
        description: `${text} has been copied to your clipboard.`,
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card p-0 rounded-lg overflow-hidden">
        <DialogHeader className="p-6 pb-4">
            <DialogTitle>Tutor Information</DialogTitle>
            <DialogDescription>
                Contact details for the selected tutor.
            </DialogDescription>
        </DialogHeader>
        {isLoading ? (
            <div className="flex items-center justify-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        ) : error ? (
            <div className="text-center text-sm text-destructive px-6 pb-6">
                <p>Failed to load contact details.</p>
            </div>
        ) : contactDetails ? (
            <div className="space-y-4 py-4 px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-secondary rounded-full">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Name</Label>
                            <p className="font-medium text-foreground">{contactDetails.name}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-secondary rounded-full">
                            <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Email</Label>
                            <p className="font-medium text-foreground">{contactDetails.email}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(contactDetails.email, 'Email')}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-secondary rounded-full">
                            <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Phone</Label>
                            <p className="font-medium text-foreground">{contactDetails.countryCode} {contactDetails.phone}</p>
                        </div>
                    </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(`${contactDetails.countryCode} ${contactDetails.phone}`, 'Phone number')}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
