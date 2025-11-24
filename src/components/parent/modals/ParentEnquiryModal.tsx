
"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User, BookOpen, Settings2, Save, Loader2, CalendarDays, Clock, MapPin, RadioTower, VenetianMask, Building, GraduationCap } from "lucide-react";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { LocationAutocompleteInput, type LocationDetails } from "@/components/shared/LocationAutocompleteInput";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { allSubjectsList, gradeLevelsList, boardsList, teachingModeOptions, daysOptions, timeSlotsOptions, startDatePreferenceOptions, tutorGenderPreferenceOptions } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const parentEnquirySchema = z.object({
  studentName: z.string().min(2, { message: "Student's name is required." }),
  subject: z.array(z.string()).min(1, { message: "Please select at least one subject." }),
  gradeLevel: z.string({ required_error: "Please select a grade level." }).min(1, "Please select a grade level."),
  board: z.string({ required_error: "Please select a board." }).min(1, "Please select a board."),
  teachingMode: z.array(z.string()).min(1, { message: "Please select at least one teaching mode." }),
  location: z.custom<LocationDetails | null>(
    (val) => val === null || (typeof val === 'object' && val !== null && 'address' in val),
    "Invalid location format."
  ).nullable(),
  tutorGenderPreference: z.enum(["MALE", "FEMALE", "NO_PREFERENCE"], { required_error: "Please select a gender preference." }),
  startDatePreference: z.enum(["IMMEDIATELY", "WITHIN_A_MONTH", "JUST_EXPLORING"], { required_error: "Please select a start date preference." }),
  preferredDays: z.array(z.string()).optional(),
  preferredTimeSlots: z.array(z.string()).optional(),
}).refine(data => {
  if (data.teachingMode?.includes("Offline (In-person)") && (!data.location || !data.location.address || data.location.address.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Location is required for Offline (In-person) teaching mode.",
  path: ["location"],
});

export type ParentEnquiryFormValues = z.infer<typeof parentEnquirySchema>;

interface ParentEnquiryModalProps {
  onSuccess: () => void;
  initialSubject?: string[];
}

export function ParentEnquiryModal({ onSuccess, initialSubject }: ParentEnquiryModalProps) {
  const { toast } = useToast();
  const { showLoader, hideLoader } = useGlobalLoader();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();

  const form = useForm<ParentEnquiryFormValues>({
    resolver: zodResolver(parentEnquirySchema),
    defaultValues: {
      studentName: "",
      subject: initialSubject || [],
      gradeLevel: "",
      board: "",
      teachingMode: [],
      location: null,
      tutorGenderPreference: "NO_PREFERENCE",
      startDatePreference: "IMMEDIATELY",
      preferredDays: [],
      preferredTimeSlots: [],
    },
  });

  const onSubmit: SubmitHandler<ParentEnquiryFormValues> = async (data) => {
    showLoader("Submitting your requirement...");
    const locationDetails = data.location;
    
    const requestBody = {
      studentName: data.studentName,
      subjects: data.subject,
      grade: data.gradeLevel,
      board: data.board,
      addressName: locationDetails?.name || locationDetails?.address || "",
      address: locationDetails?.address,
      city: locationDetails?.city,
      state: locationDetails?.state,
      country: locationDetails?.country,
      area: locationDetails?.area,
      pincode: locationDetails?.pincode,
      googleMapsLink: locationDetails?.googleMapsUrl,
      availabilityDays: data.preferredDays,
      availabilityTime: data.preferredTimeSlots,
      genderPreference: data.tutorGenderPreference,
      startPreference: data.startDatePreference,
      online: data.teachingMode.includes("Online"),
      offline: data.teachingMode.includes("Offline (In-person)"),
    };
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/api/enquiry/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        },
        body: JSON.stringify(requestBody),
      });

      hideLoader();

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "An unexpected server error occurred."}));
        throw new Error(errorData.message);
      }

      toast({
        title: "Requirement Submitted!",
        description: "Your tuition requirement has been posted successfully.",
      });
      sessionStorage.setItem('showNewRequirementToast', 'true');
      onSuccess();
    } catch (error) {
      hideLoader();
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: (error as Error).message || "An unknown error occurred.",
      });
    }
  };
  
  const isOfflineModeSelected = form.watch("teachingMode")?.includes("Offline (In-person)");

  return (
    <div className="bg-card p-0 rounded-lg relative">
      <DialogHeader className="text-left pt-6 px-6">
        <DialogTitle className="text-2xl font-semibold">Post Your Tuition Requirement</DialogTitle>
        <DialogDescription>
          Fill in the details below to find the perfect tutor.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-6 max-h-[70vh] overflow-y-auto">
           <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-primary/80" />Student's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Rohan Kumar" {...field} className="bg-input border-border focus:border-primary focus:ring-primary/30" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-primary/80"/>Subject(s)</FormLabel>
                 <MultiSelectCommand
                    options={allSubjectsList}
                    selectedValues={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="Select subjects..."
                    className="bg-input border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
                  />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="gradeLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Grade Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30"><SelectValue placeholder="Select a grade" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gradeLevelsList.map(gl => <SelectItem key={gl} value={gl}>{gl}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="board"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4 text-primary/80"/>Board</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30"><SelectValue placeholder="Select a board" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {boardsList.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="teachingMode"
            render={() => (
              <FormItem>
                <FormLabel className="flex items-center"><RadioTower className="mr-2 h-4 w-4 text-primary/80"/>Teaching Mode</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {teachingModeOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="teachingMode"
                      render={({ field }) => (
                         <FormItem key={option.id}>
                          <Label
                            htmlFor={`teaching-mode-parent-modal-${option.id}`}
                            className={cn(
                              "flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md bg-input/30 hover:bg-accent/50 transition-colors cursor-pointer",
                              field.value?.includes(option.id) && "bg-primary/10 border-primary ring-1 ring-primary"
                            )}
                          >
                            <FormControl>
                              <Checkbox
                                id={`teaching-mode-parent-modal-${option.id}`}
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValues, option.id])
                                    : field.onChange(currentValues.filter(v => v !== option.id));
                                }}
                              />
                            </FormControl>
                            <span className="font-normal text-sm">{option.label}</span>
                          </Label>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {isOfflineModeSelected && (
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
              <FormItem>
                  <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary/80"/>Location (for In-person)</FormLabel>
                  <FormControl>
                    <LocationAutocompleteInput
                      initialValue={field.value}
                      onValueChange={(details) => field.onChange(details)}
                      placeholder="Search for address or area..."
                    />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />
          )}
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tutorGenderPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><VenetianMask className="mr-2 h-4 w-4 text-primary/80" />Preferred Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"><SelectValue placeholder="Select gender" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tutorGenderPreferenceOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDatePreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary/80" />Start Date</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"><SelectValue placeholder="Select start time" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {startDatePreferenceOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField
              control={form.control}
              name="preferredDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary/80"/>Preferred Days (Optional)</FormLabel>
                  <MultiSelectCommand
                    options={daysOptions}
                    selectedValues={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="Select days..."
                    className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredTimeSlots"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary/80"/>Preferred Time (Optional)</FormLabel>
                  <MultiSelectCommand
                    options={timeSlotsOptions}
                    selectedValues={field.value || []}
                    onValueChange={(values) => field.onChange(values)}
                    placeholder="Select time slots..."
                    className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onSuccess()} disabled={form.formState.isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Submit Requirement
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
