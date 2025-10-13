
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, User as UserIcon, Loader2, Edit3 } from "lucide-react"; // Renamed User to UserIcon
import { useState, useEffect } from "react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.885-.002 2.024.63 3.965 1.739 5.618l-1.187 4.349 4.443-1.152z" />
        <path d="M15.246 14.148c-.281-.141-1.66-1.04-1.916-1.158-.256-.117-.44-.187-.625.117-.184.305-.724.938-.887 1.115-.164.177-.328.188-.609.047-.282-.14-1.188-.438-2.262-1.395-.837-.745-1.395-1.661-1.56-1.944-.163-.282-.01- .438.104-.576.104-.13.234-.336.351-.49.117-.154.156-.257.234-.422.078-.164.039-.305-.019-.445-.058-.141-.625-1.492-.859-2.04-.233-.547-.467-.469-.625-.469-.141 0-.305-.019-.469-.019-.164 0-.438.058-.672.305-.234.246-.887.867-.887 2.109s.906 2.441 1.023 2.617c.118.176 1.77 2.899 4.293 4.098 2.522 1.199 2.522.797 2.969.762.447-.039 1.66-.672 1.898-1.32.238-.648.238-1.199.16-1.319-.078-.121-.281-.188-.586-.328z" />
    </svg>
);

const MOCK_COUNTRIES = [
  { country: "IN", countryCode: "+91", label: "India (+91)" },
  { country: "US", countryCode: "+1", label: "USA (+1)" },
  { country: "GB", countryCode: "+44", label: "UK (+44)" },
  { country: "AU", countryCode: "+61", label: "Australia (+61)" },
  { country: "JP", countryCode: "+81", label: "Japan (+81)" },
];

const editParentSchema = z.object({
  name: z.string().min(2, "Full name is required."),
  email: z.string().email("Invalid email address."),
  country: z.string().min(1, "Country is required."),
  phone: z.string().min(10, "Phone number must be at least 10 digits.").regex(/^\d+$/, "Phone number must contain only digits."),
  whatsappEnabled: z.boolean().default(false),
});

type EditParentFormValues = z.infer<typeof editParentSchema>;

interface EditParentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  parent: User | null;
}

const updateParentDetails = async ({
  userId,
  token,
  formData,
}: {
  userId: string;
  token: string | null;
  formData: EditParentFormValues;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!userId) throw new Error("User ID is missing.");
  
  const selectedCountryData = MOCK_COUNTRIES.find(c => c.country === formData.country);

  const requestBody = {
    ...formData,
    countryCode: selectedCountryData?.countryCode || '',
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/admin/user/update/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update parent details." }));
    throw new Error(errorData.message);
  }
  
  return response.json();
};

export function EditParentModal({ isOpen, onOpenChange, parent }: EditParentModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();

  const form = useForm<EditParentFormValues>({
    resolver: zodResolver(editParentSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "IN",
      phone: "",
      whatsappEnabled: false,
    },
  });

  useEffect(() => {
    if (parent && isOpen) {
      form.reset({
        name: parent.name || "",
        email: parent.email || "",
        phone: parent.phone || "",
        country: "IN", 
        whatsappEnabled: parent.whatsappEnabled || false,
      });
    }
  }, [parent, isOpen, form]);

  const mutation = useMutation({
    mutationFn: (data: EditParentFormValues) => updateParentDetails({ userId: parent!.id, token, formData: data }),
    onSuccess: (updatedUserDetails) => {
      queryClient.setQueryData(['parentDetails', parent!.id], (oldData: { user: User; enquiries: any[] } | undefined) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          user: {
            ...oldData.user,
            ...updatedUserDetails,
          },
        };
      });
      toast({
        title: "Parent Details Updated!",
        description: `The details for ${parent!.name} have been successfully updated.`,
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    },
  });
  
  const onSubmit = (data: EditParentFormValues) => {
    mutation.mutate(data);
  };
  
  if (!parent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit3 className="mr-2 h-5 w-5" />
            Edit Parent: {parent.name}
          </DialogTitle>
          <DialogDescription>
            Update the contact information for this parent.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><UserIcon className="mr-2 h-4 w-4 text-primary/80" />Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} disabled={mutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-primary/80" />Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} disabled={mutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel className="text-foreground">Phone Number</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="w-auto min-w-[120px]">
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={mutation.isPending}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOCK_COUNTRIES.map(c => (
                              <SelectItem key={c.country} value={c.country} className="text-sm">{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="tel" placeholder="XXXXXXXXXX" {...field} disabled={mutation.isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
            </FormItem>

             <FormField
              control={form.control}
              name="whatsappEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-input/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm flex items-center">
                      <WhatsAppIcon className="h-4 w-4 mr-2 text-primary" />
                      WhatsApp Notifications
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
