
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
import { useToast } from "@/hooks/use-toast";
import { Unlock, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { User } from "@/types";

interface ParentActivationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  parentName: string;
  parentId: string;
}

const activateParentApi = async ({
  userId,
  token,
}: {
  userId: string;
  token: string | null;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!userId) throw new Error("User ID is missing.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/admin/user/activate/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to activate parent." }));
    throw new Error(errorData.message);
  }
  return response.json();
};

export function ParentActivationModal({ isOpen, onOpenChange, parentName, parentId }: ParentActivationModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => activateParentApi({ userId: parentId, token }),
    onSuccess: (updatedUserDetails) => {
      queryClient.setQueryData(['parentDetails', parentId], (oldData: { user: User, enquiries: any[] } | undefined) => {
        if (!oldData) return undefined;
        return {
            ...oldData,
            user: { ...oldData.user, ...updatedUserDetails, status: updatedUserDetails.active ? 'Active' : 'Inactive' },
        };
      });
      toast({
        title: "Parent Activated!",
        description: `The account for ${parentName} has been successfully activated.`,
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
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Confirm Activation for {parentName}</DialogTitle>
          <DialogDescription>
            This action will make the parent's account active, allowing them to post enquiries and interact with the platform.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirmActivation} disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Unlock className="mr-2 h-4 w-4" />}
            {mutation.isPending ? "Activating..." : "Confirm Activation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

