
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BookOpen, GraduationCap, Briefcase, DollarSign, Info, RadioTower, MapPin, Edit, CalendarDays, Clock, ShieldCheck, X, Languages, CheckSquare } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { DialogClose } from "@/components/ui/dialog";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { LocationAutocompleteInput, type LocationDetails } from "@/components/shared/LocationAutocompleteInput";

const subjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));
const gradeLevelsList: MultiSelectOption[] = ["Kindergarten", "Grade 1-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "College Level", "Adult Learner", "Other"].map(gl => ({ value: gl, label: gl }));
const experienceLevels = ["Less than 1 year", "1-3 years", "3-5 years", "5-7 years", "7+ years", "10+ years"];
const boardsList: MultiSelectOption[] = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"].map(b => ({ value: b, label: b }));
const qualificationsList: MultiSelectOption[] = ["Bachelor's Degree", "Master's Degree", "PhD", "Teaching Certification", "Subject Matter Expert", "Other"].map(q => ({ value: q, label: q }));
const languagesList: MultiSelectOption[] = ["English", "Hindi", "Spanish", "French", "German", "Mandarin", "Japanese", "Other"].map(l => ({ value: l, label: l }));


const teachingModeItems = [
  { id: "Online", label: "Online" },
  { id: "Offline", label: "Offline (Student's Home)" },
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
  { value: "0700-0900", label: "7:00 AM - 9:00 AM" },
  { value: "0900-1100", label: "9:00 AM - 11:00 AM" },
  { value: "1100-1300", label: "11:00 AM - 1:00 PM" },
  { value: "1300-1500", label: "1:00 PM - 3:00 PM" },
  { value: "1500-1700", label: "3:00 PM - 5:00 PM" },
  { value: "1700-1900", label: "5:00 PM - 7:00 PM" },
  { value: "1900-2100", label: "7:00 PM - 9:00 PM" },
  { value: "Flexible", label: "Flexible" },
];


const tutoringDetailsSchema = z.object({
  subjects: z.array(z.string()).min(1, "Please select at least one subject."),
  gradeLevelsTaught: z.array(z.string()).min(1, "Please select at least one grade level you teach."),
  boardsTaught: z.array(z.string()).min(1, "Please select at least one board."),
  preferredDays: z.array(z.string()).min(1, "Please select at least one preferred day."),
  preferredTimeSlots: z.array(z.string()).min(1, "Please select at least one preferred time slot."),
  teachingMode: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one teaching mode.",
  }),
  isHybrid: z.boolean().default(false).optional(),
  location: z.custom<LocationDetails | null>(
    (val) => val === null || (typeof val === 'object' && val !== null && 'address' in val),
    "Invalid location format."
  ).nullable().optional(),
  hourlyRate: z.string().regex(/^\d{1,4}(\.\d{1,2})?$/, "Rate must be up to 4 digits (e.g., 9999).").optional().or(z.literal("")),
  isRateNegotiable: z.boolean().default(false).optional(),
  qualifications: z.array(z.string()).min(1, "Please select at least one qualification."),
  languages: z.array(z.string()).min(1, "Please select at least one language you speak."),
  experience: z.string().min(1, "Experience level is required."),
  bio: z.string().max(500, "Bio should not exceed 500 characters.").optional().or(z.literal("")),
});

type TutoringDetailsFormValues = z.infer<typeof tutoringDetailsSchema>;

const ensureArray = (value: any): string[] => Array.isArray(value) ? value : [];

interface EditTutoringDetailsFormProps {
  onSuccess?: () => void;
  initialData?: any;
}

export function EditTutoringDetailsForm({ onSuccess, initialData }: EditTutoringDetailsFormProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();

  const form = useForm<TutoringDetailsFormValues>({
    resolver: zodResolver(tutoringDetailsSchema),
    defaultValues: {
      subjects: [],
      gradeLevelsTaught: [],
      boardsTaught: [],
      preferredDays: [],
      preferredTimeSlots: [],
      teachingMode: [],
      isHybrid: false,
      location: null,
      hourlyRate: "",
      isRateNegotiable: false,
      qualifications: [],
      languages: [],
      experience: "",
      bio: "",
    },
  });

  React.useEffect(() => {
    if (initialData?.tutoringDetails) {
      const details = initialData.tutoringDetails;
      const modes = [];
      if (details.online) modes.push("Online");
      if (details.offline) modes.push("Offline");
      
      form.reset({
        subjects: ensureArray(details.subjects),
        gradeLevelsTaught: ensureArray(details.grades),
        boardsTaught: ensureArray(details.boards),
        preferredDays: ensureArray(details.availabilityDays),
        preferredTimeSlots: ensureArray(details.availabilityTime),
        teachingMode: modes,
        isHybrid: details.hybrid || false,
        location: {
          name: details.addressName || details.address,
          address: details.address || "",
          area: details.area,
          city: details.city,
          state: details.state,
          country: details.country,
          pincode: details.pincode,
          googleMapsUrl: details.googleMapsLink,
        },
        hourlyRate: details.hourlyRate ? String(details.hourlyRate) : "",
        isRateNegotiable: details.rateNegotiable || false,
        qualifications: ensureArray(details.qualifications),
        languages: ensureArray(details.languages),
        experience: details.yearOfExperience || "",
        bio: details.tutorBio || "",
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: TutoringDetailsFormValues) {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You are not authenticated. Please log in again.",
      });
      return;
    }

    const locationDetails = data.location;
    const requestBody = {
      subjects: data.subjects,
      grades: data.gradeLevelsTaught,
      boards: data.boardsTaught,
      qualifications: data.qualifications,
      availabilityDays: data.preferredDays,
      availabilityTime: data.preferredTimeSlots,
      yearOfExperience: data.experience,
      tutorBio: data.bio,
      hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : 0,
      languages: data.languages,
      online: data.teachingMode.includes("Online"),
      offline: data.teachingMode.includes("Offline"),
      hybrid: data.isHybrid,
      rateNegotiable: data.isRateNegotiable,
      // Location fields
      addressName: locationDetails?.name || "",
      address: locationDetails?.address || "",
      city: locationDetails?.city || "",
      state: locationDetails?.state || "",
      country: locationDetails?.country || "",
      area: locationDetails?.area || "",
      pincode: locationDetails?.pincode || "",
      googleMapsLink: locationDetails?.googleMapsUrl || "",
    };

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiBaseUrl}/api/tutor/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
        throw new Error(errorData.message || 'Failed to update details.');
      }

      toast({
        title: "Tutoring Details Updated!",
        description: "Your tutoring information has been saved successfully.",
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to update tutoring details:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: (error as Error).message || "An unexpected error occurred.",
      });
    }
  }


  return (
    <Card className="border-0 shadow-none rounded-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="p-6 border-b relative">
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <Edit className="mr-2.5 h-6 w-6" />
              Edit Tutoring Details
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">Showcase your expertise and preferences to students.</CardDescription>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-primary/80"/>Subjects You Teach</FormLabel>
                    <MultiSelectCommand
                      options={subjectsList}
                      selectedValues={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select subjects..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                    />
                     <FormDescription className="text-xs">Select all subjects you are proficient in teaching.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="gradeLevelsTaught"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Grade Levels You Teach</FormLabel>
                    <MultiSelectCommand
                      options={gradeLevelsList}
                      selectedValues={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select grade levels..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                    />
                    <FormDescription className="text-xs">Select all grade levels you are comfortable teaching.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="boardsTaught"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-primary/80"/>Boards You're Familiar With</FormLabel>
                    <MultiSelectCommand
                      options={boardsList}
                      selectedValues={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select boards..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="teachingMode"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center text-base font-medium"><RadioTower className="mr-2 h-4 w-4 text-primary/80"/>Teaching Mode</FormLabel>
                     <FormDescription className="text-xs">Select all applicable teaching modes.</FormDescription>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {teachingModeItems.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="teachingMode"
                        render={({ field }) => {
                          return (
                             <FormItem key={item.id}>
                              <Label
                                htmlFor={`teaching-mode-${item.id}`}
                                className={cn(
                                  "flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md bg-input/30 hover:bg-accent/50 transition-colors cursor-pointer",
                                  field.value?.includes(item.id) && "bg-primary/10 border-primary ring-1 ring-primary"
                                )}
                              >
                                <FormControl>
                                  <Checkbox
                                    id={`teaching-mode-${item.id}`}
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      return checked
                                        ? field.onChange([...currentValues, item.id])
                                        : field.onChange(currentValues.filter(value => value !== item.id));
                                    }}
                                  />
                                </FormControl>
                                <span className="font-normal text-sm">{item.label}</span>
                              </Label>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    </div>
                    <FormMessage />
                     <FormField
                        control={form.control}
                        name="isHybrid"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 mt-2">
                            <FormControl>
                              <Checkbox
                                id="isHybridCheckbox"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="h-3.5 w-3.5 rounded-[2px]"
                              />
                            </FormControl>
                            <Label
                              htmlFor="isHybridCheckbox"
                              className="text-xs font-semibold text-muted-foreground"
                            >
                              Also available for Hybrid (mix of Online & Offline) classes.
                            </Label>
                          </FormItem>
                        )}
                      />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary/80"/>Your Primary Location</FormLabel>
                    <FormControl>
                      <LocationAutocompleteInput
                        initialValue={field.value}
                        onValueChange={(details) => field.onChange(details)}
                        placeholder="Search for your city or area..."
                      />
                    </FormControl>
                    <FormDescription className="text-xs">This helps students find you for in-person tuitions.</FormDescription>
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
                            <Input
                              type="text"
                              inputMode="decimal"
                              placeholder="e.g., 800"
                              maxLength={4}
                              {...field}
                              className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isRateNegotiable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 mt-0">
                          <FormControl>
                            <Checkbox
                              id="isRateNegotiableCheckbox"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-3.5 w-3.5 rounded-[2px]"
                            />
                          </FormControl>
                          <Label
                            htmlFor="isRateNegotiableCheckbox"
                            className="text-xs font-semibold text-muted-foreground"
                          >
                            Rate is Negotiable
                          </Label>
                        </FormItem>
                      )}
                    />
                </div>
              </FormItem>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80"/>Qualifications & Certifications</FormLabel>
                      <MultiSelectCommand
                        options={qualificationsList}
                        selectedValues={field.value || []}
                        onValueChange={field.onChange}
                        placeholder="Select qualifications..."
                        className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-primary/80"/>Years of Experience</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"><SelectValue placeholder="Select experience" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {experienceLevels.map(exp => <SelectItem key={exp} value={exp}>{exp}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Languages className="mr-2 h-4 w-4 text-primary/80"/>Languages Spoken</FormLabel>
                    <MultiSelectCommand
                      options={languagesList}
                      selectedValues={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select languages..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                    />
                     <FormDescription className="text-xs">Select all languages you can teach in.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="preferredDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary/80"/>Preferred Teaching Days</FormLabel>
                      <MultiSelectCommand
                        options={daysOptionsList}
                        selectedValues={field.value || []}
                        onValueChange={field.onChange}
                        placeholder="Select preferred days..."
                        className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
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
                      <FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary/80"/>Preferred Time Slots</FormLabel>
                      <MultiSelectCommand
                        options={timeSlotsOptionsList}
                        selectedValues={field.value || []}
                        onValueChange={(values) => field.onChange(values)}
                        placeholder="Select preferred time slots..."
                        className="bg-input border-border focus-within:border-primary focus-within:ring-primary/30 shadow-sm"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-primary/80"/>Your Bio / Teaching Philosophy</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Max 500 characters..." {...field} rows={4} className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="p-6 border-t">
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Tutoring Details"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
