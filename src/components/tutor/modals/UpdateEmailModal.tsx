
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2 } from "lucide-react";

const updateEmailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address."),
});

type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;

interface UpdateEmailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentEmail: string;
}

export function UpdateEmailModal({ isOpen, onOpenChange, currentEmail }: UpdateEmailModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const onSubmit: SubmitHandler<UpdateEmailFormValues> = async (data) => {
    setIsSubmitting(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Updating email to:", data.newEmail);

    // On mock success
    toast({
      title: "Verification Sent!",
      description: `A verification link has been sent to ${data.newEmail}. Please check your inbox.`,
    });
    setIsSubmitting(false);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Update Your Email Address</DialogTitle>
          <DialogDescription>
            Your current email is <strong>{currentEmail}</strong>. A verification link will be sent to the new email address.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="new.email@example.com"
                        {...field}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? "Sending..." : "Send Verification Link"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
