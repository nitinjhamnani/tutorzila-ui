
"use client";

import type { ApiTutor } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Copy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TutorContactModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutor: ApiTutor | null;
}

const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
};

export function TutorContactModal({ isOpen, onOpenChange, tutor }: TutorContactModalProps) {
  const { toast } = useToast();

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
        <DialogHeader className="p-6 pb-4 text-center items-center">
            <Avatar className="h-20 w-20 border-2 border-primary/20 mb-3">
                <AvatarImage src={tutor.profilePicUrl} alt={tutor.displayName} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                    {getInitials(tutor.displayName)}
                </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-xl font-bold text-foreground">{tutor.displayName}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Tutor Contact Information</DialogDescription>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
            <div className="space-y-1">
                <Label htmlFor="tutor-email" className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail className="w-3 h-3"/> Email Address</Label>
                <div className="flex items-center gap-2">
                    <Input id="tutor-email" value={tutor.email} readOnly className="h-9 bg-muted/50 text-sm"/>
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleCopy(tutor.email, "Email")}>
                        <Copy className="w-4 h-4"/>
                    </Button>
                </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="tutor-phone" className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="w-3 h-3"/> Phone Number</Label>
                <div className="flex items-center gap-2">
                    <Input id="tutor-phone" value={`${tutor.countryCode} ${tutor.phone}`} readOnly className="h-9 bg-muted/50 text-sm"/>
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleCopy(`${tutor.countryCode} ${tutor.phone}`, "Phone Number")}>
                        <Copy className="w-4 h-4"/>
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
