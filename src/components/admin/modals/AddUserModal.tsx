
"use client";

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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Phone, User, Loader2 } from "lucide-react";
import { useState } from 'react';
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useGlobalLoader } from "@/hooks/use-global-loader";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.885-.002 2.024.63 3.965 1.739 5.618l-1.187 4.349 4.443-1.152z" />
        <path d="M15.246 14.148c-.281-.141-1.66-1.04-1.916-1.158-.256-.117-.44-.187-.625.117-.184.305-.724.938-.887 1.115-.164.177-.328.188-.609.047-.282-.14-1.188-.438-2.262-1.395-.837-.745-1.395-1.661-1.56-1.944-.163-.282-.01- .438.104-.576.104-.13.234-.336.351-.49.117-.154.156-.257.234-.422.078-.164.039-.305-.019-.445-.058-.141-.625-1.492-.859-2.04-.233-.547-.467-.469-.625-.469-.141 0-.305-.019-.469-.019-.164 0-.438.058-.672.305-.234.246-.887.867-.887 2.109s.906 2.441 1.023 2.617c.118.176 1.77 2.899 4.293 4.098 2.522 1.199 2.522.797 2.969.762.447-.039 1.66-.672 1.898-1.32.238-.648.238-1.199.16-1.319-.078-.121-.281-.188-.586-.328z" />
    </svg>
);


const addUserSchema = z.object({
  name: z.string().min(2, "Full name is required."),
  email: z.string().email("Invalid email address."),
  country: z.string().min(1, "Country is required."),
  localPhoneNumber: z.string().min(10, "Phone number must be at least 10 digits.").regex(/^\d+$/, "Phone number must contain only digits."),
  whatsappEnabled: z.boolean().default(true),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

interface AddUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userType: "TUTOR" | "PARENT";
  onSuccess: () => void;
}

const MOCK_COUNTRIES = [
  { country: "IN", countryCode: "+91", label: "India (+91)" },
  { country: "US", countryCode: "+1", label: "USA (+1)" },
  { country: "GB", countryCode: "+44", label: "UK (+44)" },
  { country: "AU", countryCode: "+61", label: "Australia (+61)" },
  { country: "JP", countryCode: "+81", label: "Japan (+81)" },
];


export function AddUserModal({ isOpen, onOpenChange, userType, onSuccess }: AddUserModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuthMock();
  const router = useRouter();
  const { showLoader, hideLoader } = useGlobalLoader();

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "IN",
      localPhoneNumber: "",
      whatsappEnabled: true,
    },
  });

  const handleCreateUser = async (data: AddUserFormValues) => {
    setIsSubmitting(true);
    if (userType === 'TUTOR') {
      showLoader();
    }

    const selectedCountryData = MOCK_COUNTRIES.find(c => c.country === data.country);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/api/admin/user/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        },
        body: JSON.stringify({ 
            name: data.name,
            email: data.email,
            userType,
            country: data.country,
            countryCode: selectedCountryData?.countryCode || '',
            phone: data.localPhoneNumber,
            whatsappEnabled: data.whatsappEnabled,
         }),
      });

      if (!response.ok) {
        // Try to parse JSON error first
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create user.");
        } catch (e) {
          // If response is not JSON, use text
          const errorText = await response.text();
          throw new Error(errorText || "Failed to create user.");
        }
      }
      
      const responseText = await response.text();

      toast({
        title: "User Created!",
        description: `A new ${userType.toLowerCase()} account for ${data.name} has been created.`,
      });

      onOpenChange(false);
      form.reset();
      
      if (userType === "TUTOR" && responseText) {
        router.push(`/admin/tutors/${responseText}`);
        // Do NOT call hideLoader here. It will be called by the destination page.
      } else {
        onSuccess();
        setIsSubmitting(false); 
      }

    } catch (error) {
      setIsSubmitting(false); 
      if (userType === 'TUTOR') {
        hideLoader();
      }
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: (error as Error).message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Add New {userType === "TUTOR" ? "Tutor" : "Parent"}
          </DialogTitle>
          <DialogDescription>
            Enter the details below to create a new user account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-primary/80"/>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} disabled={isSubmitting}/>
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
                  <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-primary/80"/>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} disabled={isSubmitting}/>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
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
                    name="localPhoneNumber"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormControl>
                            <Input type="tel" placeholder="XXXXXXXXXX" {...field} disabled={isSubmitting}/>
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
                    <FormDescription className="text-xs">
                      Receive updates on this number.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                    </>
                ) : `Create ${userType === "TUTOR" ? "Tutor" : "Parent"}`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
