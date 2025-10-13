
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BookOpen, GraduationCap, Briefcase, DollarSign, Info, RadioTower, MapPin, Edit, CalendarDays, Clock, ShieldCheck, X, Languages, CheckSquare, ChevronDown, Save, Loader2 } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { LocationAutocompleteInput, type LocationDetails } from "@/components/shared/LocationAutocompleteInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiTutor } from "@/types";

const subjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));
const gradeLevelsList: MultiSelectOption[] = ["Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner", "Other"].map(gl => ({ value: gl, label: gl }));
const experienceLevels = ["Less than 1 year", "1-3 years", "3-5 years", "5-7 years", "7+ years", "10+ years"];
const boardsList: MultiSelectOption[] = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"].map(b => ({ value: b, label: b }));
const qualificationsList: MultiSelectOption[] = ["Bachelor's Degree", "Master's Degree", "PhD", "Teaching Certification", "Subject Matter Expert", "Other"].map(q => ({ value: q, label: q }));
const languagesList: MultiSelectOption[] = ["English", "Hindi", "Spanish", "French", "German", "Mandarin", "Japanese", "Other"].map(l => ({ value: l, label: l }));

const teachingModeItems = [
  { id: "Online", label: "Online" },
  { id: "Offline", label: "Offline (In-person)" },
];

const daysOptionsList: MultiSelectOption[] = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
    { value: "Weekdays", label: "Weekdays" },
    { value: "Weekends", label: "Weekends" },
    { value: "Flexible", label: "Flexible" },
];

const timeSlotsOptionsList: MultiSelectOption[] = [
  { value: "7:00 AM - 9:00 AM", label: "7:00 AM - 9:00 AM" },
  { value: "9:00 AM - 11:00 AM", label: "9:00 AM - 11:00 AM" },
  { value: "11:00 AM - 1:00 PM", label: "11:00 AM - 1:00 PM" },
  { value: "1:00 PM - 3:00 PM", label: "1:00 PM - 3:00 PM" },
  { value: "3:00 PM - 5:00 PM", label: "3:00 PM - 5:00 PM" },
  { value: "5:00 PM - 7:00 PM", label: "5:00 PM - 7:00 PM" },
  { value: "7:00 PM - 9:00 PM", label: "7:00 PM - 9:00 PM" },
  { value: "Flexible", label: "Flexible" },
];


const adminTutorUpdateSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters.").optional().or(z.literal("")),
  gender: z.string().optional(),
  bio: z.string().max(500, "Bio should not exceed 500 characters.").optional().or(z.literal("")),
  hourlyRate: z.number({ coerce: true }).min(0, "Rate must be a positive number.").optional(),
  isRateNegotiable: z.boolean().default(false).optional(),
  experienceYears: z.string().optional().or(z.literal("")),
  qualifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  subjects: z.array(z.string()).min(1, "Please select at least one subject."),
  grades: z.array(z.string()).min(1, "Please select at least one grade level."),
  boards: z.array(z.string()).default([]),
  availabilityDays: z.array(z.string()).default([]),
  availabilityTime: z.array(z.string()).default([]),
  online: z.boolean().default(false),
  offline: z.boolean().default(false),
  isHybrid: z.boolean().default(false).optional(),
  location: z.custom<LocationDetails | null>((val) => val === null || (typeof val === 'object' && val !== null && 'address' in val), "Invalid location format.").nullable().optional(),
}).refine(data => data.online || data.offline, {
  message: "At least one teaching mode (Online or Offline) must be selected.",
  path: ["online"], 
});

type AdminTutorUpdateFormValues = z.infer<typeof adminTutorUpdateSchema>;

interface AdminUpdateTutorModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutor: ApiTutor | null;
}

const ensureArray = (value: any): string[] => Array.isArray(value) ? value : [];

const updateTutorDetails = async ({ tutorId, token, formData }: { tutorId: string; token: string | null; formData: AdminTutorUpdateFormValues }) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!tutorId) throw new Error("Tutor ID is missing.");

  const locationDetails = formData.location;
  const requestBody = {
    subjects: formData.subjects,
    grades: formData.grades,
    boards: formData.boards,
    qualifications: formData.qualifications,
    availabilityDays: formData.availabilityDays,
    availabilityTime: formData.availabilityTime,
    yearOfExperience: formData.experienceYears,
    tutorBio: formData.bio,
    addressName: locationDetails?.name || "",
    address: locationDetails?.address || "",
    city: locationDetails?.city || "",
    state: locationDetails?.state || "",
    area: locationDetails?.area || "",
    pincode: locationDetails?.pincode || "",
    country: locationDetails?.country || "",
    googleMapsLink: locationDetails?.googleMapsUrl || "",
    hourlyRate: formData.hourlyRate || 0,
    languages: formData.languages,
    rateNegotiable: formData.isRateNegotiable,
    online: formData.online,
    offline: formData.offline,
    hybrid: formData.isHybrid,
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/manage/tutor/update/${tutorId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update tutor." }));
    throw new Error(errorData.message);
  }

  return response.json();
};

export function AdminUpdateTutorModal({ isOpen, onOpenChange, tutor }: AdminUpdateTutorModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();

  const form = useForm<AdminTutorUpdateFormValues>({
    resolver: zodResolver(adminTutorUpdateSchema),
    defaultValues: {
      bio: "",
      hourlyRate: 0,
      isRateNegotiable: false,
      experienceYears: "",
      qualifications: [],
      languages: [],
      subjects: [],
      grades: [],
      boards: [],
      availabilityDays: [],
      availabilityTime: [],
      online: false,
      offline: false,
      isHybrid: false,
      location: null,
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: AdminTutorUpdateFormValues) => {
        if (!tutor?.id) {
            throw new Error("Tutor ID is missing. Cannot update.");
        }
        return updateTutorDetails({ tutorId: tutor.id, token, formData });
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['tutorProfile', tutor?.id], (oldData: ApiTutor | undefined) => {
        if (!oldData) return undefined;
        const tutoringDetails = response.tutoringDetails || response;
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
        title: "Tutor Updated!",
        description: "The tutor's details have been updated successfully.",
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

  React.useEffect(() => {
    if (tutor && isOpen) {
      form.reset({
        displayName: tutor.displayName || "",
        gender: tutor.gender || "",
        bio: tutor.bio || "",
        hourlyRate: tutor.hourlyRate || 0,
        isRateNegotiable: tutor.isRateNegotiable || false,
        experienceYears: tutor.yearOfExperience || "",
        qualifications: ensureArray(tutor.qualificationList),
        languages: ensureArray(tutor.languagesList),
        subjects: ensureArray(tutor.subjectsList),
        grades: ensureArray(tutor.gradesList),
        boards: ensureArray(tutor.boardsList),
        availabilityDays: ensureArray(tutor.availabilityDaysList),
        availabilityTime: ensureArray(tutor.availabilityTimeList),
        online: tutor.online || false,
        offline: tutor.offline || false,
        isHybrid: tutor.isHybrid || false,
        location: {
            name: tutor.addressName || tutor.address || "",
            address: tutor.address || "",
            area: tutor.area || "",
            city: tutor.city || "",
            state: tutor.state || "",
            country: tutor.country || "",
            pincode: tutor.pincode || "",
            googleMapsLink: tutor.googleMapsLink || "",
        },
      });
    }
  }, [tutor, isOpen, form]);

  const onSubmit = (data: AdminTutorUpdateFormValues) => {
    mutation.mutate(data);
  };
  
  const isOfflineModeSelected = form.watch("offline");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-3xl p-0 bg-card flex flex-col max-h-[90vh]"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
            <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
                <DialogTitle>Update Tutor: {tutor?.displayName}</DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="update-tutor-form" className="p-6 space-y-6">
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-primary/80"/>Bio / Teaching Philosophy</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Max 500 characters..." {...field} rows={4} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="subjects"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-primary/80"/>Subjects Taught</FormLabel>
                                <MultiSelectCommand
                                    options={subjectsList}
                                    selectedValues={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Select subjects..."
                                    className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                                />
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="grades"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Grade Levels Taught</FormLabel>
                                <MultiSelectCommand
                                    options={gradeLevelsList}
                                    selectedValues={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Select grade levels..."
                                    className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                                />
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="boards"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-primary/80"/>Boards</FormLabel>
                                <MultiSelectCommand
                                    options={boardsList}
                                    selectedValues={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Select boards..."
                                    className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                                />
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <div className="space-y-2">
                            <Label className="flex items-center"><RadioTower className="mr-2 h-4 w-4 text-primary/80" />Teaching Mode</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                                <FormField
                                control={form.control}
                                name="online"
                                render={({ field }) => (
                                    <FormItem>
                                    <Label htmlFor="mode-online" className={cn("flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md cursor-pointer", field.value && "bg-primary/10 border-primary")}>
                                        <FormControl><Checkbox id="mode-online" checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        <span className="font-normal text-sm">Online</span>
                                    </Label>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="offline"
                                render={({ field }) => (
                                    <FormItem>
                                    <Label htmlFor="mode-offline" className={cn("flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md cursor-pointer", field.value && "bg-primary/10 border-primary")}>
                                        <FormControl><Checkbox id="mode-offline" checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        <span className="font-normal text-sm">Offline (In-person)</span>
                                    </Label>
                                    </FormItem>
                                )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="isHybrid"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 mt-2">
                                    <FormControl><Checkbox id="isHybridCheckbox-admin" checked={field.value} onCheckedChange={field.onChange} className="h-3.5 w-3.5" /></FormControl>
                                    <Label htmlFor="isHybridCheckbox-admin" className="text-xs font-semibold text-muted-foreground">Also available for Hybrid classes.</Label>
                                    </FormItem>
                                )}
                                />
                        </div>
                        {isOfflineModeSelected && (
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary/80"/>Primary Location for Offline Classes</FormLabel>
                                <FormControl>
                                <LocationAutocompleteInput
                                    initialValue={field.value}
                                    onValueChange={(details) => field.onChange(details)}
                                    placeholder="Search for tutor's primary city or area..."
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        )}
                        <FormField
                            control={form.control}
                            name="qualifications"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Qualifications & Certifications</FormLabel>
                                <MultiSelectCommand
                                    options={qualificationsList}
                                    selectedValues={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Select qualifications..."
                                    className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                                />
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="languages"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center"><Languages className="mr-2 h-4 w-4 text-primary/80"/>Languages Spoken</FormLabel>
                                <MultiSelectCommand
                                    options={languagesList}
                                    selectedValues={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Select languages..."
                                    className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                                />
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="experienceYears"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-primary/80" />Experience</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                    <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"><SelectValue placeholder="Select experience" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {experienceLevels.map(exp => <SelectItem key={exp} value={exp}>{exp}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormItem>
                                <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-primary/80"/>Hourly Rate (₹)</FormLabel>
                                <div className="flex flex-col gap-2">
                                    <FormField
                                    control={form.control}
                                    name="hourlyRate"
                                    render={({ field }) => (
                                        <FormItem className="flex-grow">
                                        <FormControl>
                                            <Input type="number" placeholder="e.g., 800" {...field} className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm" />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="isRateNegotiable"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-2 mt-2">
                                        <FormControl><Checkbox id="isRateNegotiableCheckbox-admin" checked={field.value} onCheckedChange={field.onChange} className="h-3.5 w-3.5" /></FormControl>
                                        <Label htmlFor="isRateNegotiableCheckbox-admin" className="text-xs font-semibold text-muted-foreground">Rate is Negotiable</Label>
                                        </FormItem>
                                    )}
                                    />
                                </div>
                            </FormItem>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="availabilityDays"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary/80"/>Available Days</FormLabel>
                                <MultiSelectCommand
                                    options={daysOptionsList}
                                    selectedValues={field.value}
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
                            name="availabilityTime"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary/80"/>Available Time Slots</FormLabel>
                                <MultiSelectCommand
                                    options={timeSlotsOptionsList}
                                    selectedValues={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Select time slots..."
                                    className="bg-input border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 shadow-sm"
                                />
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                    </form>
                </Form>
            </div>
            <DialogFooter className="p-6 pt-4 border-t flex justify-end flex-shrink-0">
                <Button type="submit" form="update-tutor-form" disabled={mutation.isPending}>
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
