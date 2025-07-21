
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
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
  FormDescription,
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { User, BookOpen, Settings2, ArrowLeft, ArrowRight, Send, CalendarDays, Clock, MapPin, Info, Phone, Mail, X, GraduationCap, Building, RadioTower } from "lucide-react";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { LocationAutocompleteInput, type LocationDetails } from "@/components/shared/LocationAutocompleteInput";
import { Switch } from "@/components/ui/switch";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.885-.002 2.024.63 3.965 1.739 5.618l-1.187 4.349 4.443-1.152z" />
        <path d="M15.246 14.148c-.281-.141-1.66-1.04-1.916-1.158-.256-.117-.44-.187-.625.117-.184.305-.724.938-.887 1.115-.164.177-.328.188-.609.047-.282-.14-1.188-.438-2.262-1.395-.837-.745-1.395-1.661-1.56-1.944-.163-.282-.01- .438.104-.576.104-.13.234-.336.351-.49.117-.154.156-.257.234-.422.078-.164.039-.305-.019-.445-.058-.141-.625-1.492-.859-2.04-.233-.547-.467-.469-.625-.469-.141 0-.305-.019-.469-.019-.164 0-.438.058-.672.305-.234.246-.887.867-.887 2.109s.906 2.441 1.023 2.617c.118.176 1.77 2.899 4.293 4.098 2.522 1.199 2.522.797 2.969.762.447-.039 1.66-.672 1.898-1.32.238-.648.238-1.199.16-1.319-.078-.121-.281-.188-.586-.328z" />
    </svg>
);

const subjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));

const gradeLevelsList = [
    "Nursery", "LKG", "UKG",
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
    "Grade 11", "Grade 12",
    "College Level", "Adult Learner", "Other"
];
const boardsList = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"];

const teachingModeOptions = [
  { id: "Online", label: "Online" },
  { id: "Offline (In-person)", label: "Offline (In-person)" },
];

const daysOptions: MultiSelectOption[] = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
  { value: "Weekdays", label: "Weekdays" },
  { value: "Weekends", label: "Weekends" },
  { value: "Flexible", label: "Flexible"},
];

const timeSlotsOptions: MultiSelectOption[] = [
  { value: "0800-1000", label: "8:00 AM - 10:00 AM" },
  { value: "1000-1200", label: "10:00 AM - 12:00 PM" },
  { value: "1200-1400", label: "12:00 PM - 2:00 PM" },
  { value: "1400-1600", label: "2:00 PM - 4:00 PM" },
  { value: "1600-1800", label: "4:00 PM - 6:00 PM" },
  { value: "1800-2000", label: "6:00 PM - 8:00 PM" },
  { value: "2000-2200", label: "8:00 PM - 10:00 PM" },
  { value: "Flexible", label: "Flexible"},
];

const MOCK_COUNTRIES = [
  { country: "IN", countryCode: "+91", label: "India (+91)" },
  { country: "US", countryCode: "+1", label: "USA (+1)" },
  { country: "GB", countryCode: "+44", label: "UK (+44)" },
  { country: "AU", countryCode: "+61", label: "Australia (+61)" },
  { country: "JP", countryCode: "+81", label: "Japan (+81)" },
];

const postRequirementSchema = z.object({
  // Step 1
  studentName: z.string().min(2, { message: "Student's name is required." }),
  subject: z.array(z.string()).min(1, { message: "Please select at least one subject." }),
  gradeLevel: z.string({ required_error: "Please select a grade level." }).min(1, "Please select a grade level."),
  board: z.string({ required_error: "Please select a board." }).min(1, "Please select a board."),
  // Step 2
  teachingMode: z.array(z.string()).min(1, { message: "Please select at least one teaching mode." }),
  location: z.custom<LocationDetails | null>(
    (val) => val === null || (typeof val === 'object' && val !== null && 'address' in val),
    "Invalid location format."
  ).nullable(),
  preferredDays: z.array(z.string()).optional(),
  preferredTimeSlots: z.array(z.string()).optional(),
  // Step 3
  name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  country: z.string().min(2, "Country is required."),
  localPhoneNumber: z.string().min(5, { message: "Phone number must be at least 5 digits." }).regex(/^\d+$/, "Phone number must be digits only."),
  whatsAppNotifications: z.boolean().default(true),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions to continue.",
  }),
}).refine(data => {
    if (data.teachingMode?.includes("Offline (In-person)") && (!data.location || !data.location.address || data.location.address.trim() === "")) {
      return false;
    }
    return true;
  }, {
    message: "Location is required for Offline (In-person) teaching mode.",
    path: ["location"],
  });


type PostRequirementFormValues = z.infer<typeof postRequirementSchema>;

interface PostRequirementModalProps {
  onSuccess: () => void;
  startFromStep?: 1 | 2;
  onTriggerSignIn?: (name?: string) => void;
}

export function PostRequirementModal({ onSuccess, startFromStep = 1, onTriggerSignIn }: PostRequirementModalProps) {
  const [currentStep, setCurrentStep] = useState(startFromStep);
  const totalSteps = 3;

  const { toast } = useToast();
  const { user, setSession, isAuthenticated } = useAuthMock();
  const { showLoader, hideLoader } = useGlobalLoader();
  const router = useRouter();

  const form = useForm<PostRequirementFormValues>({
    resolver: zodResolver(postRequirementSchema),
    defaultValues: {
      studentName: "",
      name: "",
      email: "",
      country: "IN",
      localPhoneNumber: "",
      subject: [],
      gradeLevel: "",
      board: "",
      teachingMode: [],
      location: null,
      preferredDays: [],
      preferredTimeSlots: [],
      whatsAppNotifications: true,
      acceptTerms: false,
    },
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === 'parent') {
        setCurrentStep(2);
        form.setValue("name", user.name || "");
        form.setValue("email", user.email || "");
        if (user.phone) {
            const matchingCountry = MOCK_COUNTRIES.find(c => user.phone!.startsWith(c.countryCode));
            if (matchingCountry) {
                form.setValue("country", matchingCountry.country);
                form.setValue("localPhoneNumber", user.phone.substring(matchingCountry.countryCode.length));
            } else {
                form.setValue("localPhoneNumber", user.phone);
            }
        }
        form.setValue("acceptTerms", true);
    }
  }, [isAuthenticated, user, form]);


  const handleNext = async () => {
    let fieldsToValidate: (keyof PostRequirementFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['studentName', 'subject', 'gradeLevel', 'board'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['teachingMode', 'location', 'preferredDays', 'preferredTimeSlots'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['name', 'email', 'country', 'localPhoneNumber', 'acceptTerms', 'whatsAppNotifications'];
    }

    const isValid = fieldsToValidate.length > 0 ? await form.trigger(fieldsToValidate) : true;

    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit: SubmitHandler<PostRequirementFormValues> = async (data) => {
    form.clearErrors();
    showLoader();

    const selectedCountryData = MOCK_COUNTRIES.find(c => c.country === data.country);

    const availabilityTimeLabels = data.preferredTimeSlots?.map(value => {
      const option = timeSlotsOptions.find(opt => opt.value === value);
      return option ? option.label : value;
    }) || [];

    const locationDetails = data.location;
    let apiRequestBody: any = {
      signupRequest: {
        name: data.name,
        email: data.email,
        country: data.country,
        countryCode: selectedCountryData?.countryCode || '',
        phone: data.localPhoneNumber,
        userType: "PARENT",
        whatsappConsent: data.whatsAppNotifications,
      },
      studentName: data.studentName,
      subjects: data.subject,
      grade: data.gradeLevel,
      board: data.board,
      address: locationDetails?.address || "",
      city: locationDetails?.city || "",
      state: locationDetails?.state || "",
      country: locationDetails?.country || data.country,
      area: locationDetails?.area || "",
      pincode: locationDetails?.pincode || "",
      googleMapsLink: locationDetails?.googleMapsUrl || "",
      availabilityDays: data.preferredDays || [],
      availabilityTime: availabilityTimeLabels,
      online: data.teachingMode.includes("Online"),
      offline: data.teachingMode.includes("Offline (In-person)"),
    };
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiBaseUrl}/api/enquiry/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(apiRequestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "An unexpected error occurred.");
      }

      if (responseData.token && responseData.type === 'PARENT') {
        toast({
          title: "Requirement Posted & Logged In!",
          description: "You are being redirected to your dashboard...",
        });
        setSession(responseData.token, responseData.type, data.email, data.name, data.localPhoneNumber);
        router.push("/parent/dashboard");
      } else {
        hideLoader();
        toast({
          title: "Account Exists",
          description: responseData.message || "Please sign in to complete posting your requirement.",
        });
        if (onTriggerSignIn) {
          onTriggerSignIn(data.email);
        }
        onSuccess();
      }

    } catch (error) {
      hideLoader();
      console.error("Enquiry creation failed:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: (error as Error).message || "Could not submit your requirement. Please try again.",
      });
    }
  };

  const isOfflineModeSelected = form.watch("teachingMode")?.includes("Offline (In-person)");

  return (
    <div className="bg-card p-0 rounded-lg relative">
      <DialogHeader className="text-left pt-6 px-6">
        <DialogTitle className="text-2xl font-semibold">Post Your Tuition Requirement</DialogTitle>
        <DialogDescription>
          Fill in the details below in {totalSteps} easy steps to find the perfect tutor.
        </DialogDescription>
      </DialogHeader>

      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogClose>

      <div className="my-6 px-6">
        <Progress value={(currentStep / totalSteps) * 100} className="w-full h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center font-medium">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-6 max-h-[65vh] overflow-y-auto">
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-lg font-semibold flex items-center text-primary"><BookOpen className="mr-2 h-5 w-5" />Academic Information</h3>
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
                    <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4 text-primary/80" />Subjects</FormLabel>
                    <MultiSelectCommand
                      options={subjectsList}
                      selectedValues={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select subjects..."
                      className="bg-input border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
                    />
                    <FormDescription className="text-xs">You can select multiple subjects.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-primary/80" />Grade Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30"><SelectValue placeholder="Select a grade level" /></SelectTrigger>
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
                      <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4 text-primary/80" />Board</FormLabel>
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
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-semibold flex items-center text-primary"><Settings2 className="mr-2 h-5 w-5" />Tuition Preferences</h3>

              <FormField
                control={form.control}
                name="teachingMode"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center"><RadioTower className="mr-2 h-4 w-4 text-primary/80" />Preferred Teaching Mode</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {teachingModeOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="teachingMode"
                          render={({ field }) => (
                            <FormItem>
                              <Label
                                htmlFor={`teaching-mode-modal-${option.id}`}
                                className={cn(
                                  "flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md bg-input/30 hover:bg-accent/50 transition-colors cursor-pointer",
                                  field.value?.includes(option.id) && "bg-primary/10 border-primary ring-1 ring-primary"
                                )}
                              >
                                <FormControl>
                                  <Checkbox
                                    id={`teaching-mode-modal-${option.id}`}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="preferredDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 text-primary/80" />
                        Preferred Days (Optional)
                      </FormLabel>
                       <MultiSelectCommand
                          options={daysOptions}
                          selectedValues={field.value || []}
                          onValueChange={(values) => field.onChange(values)}
                          placeholder="Select preferred days..."
                          className="bg-input border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
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
                      <FormLabel className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-primary/80" />
                        Preferred Time (Optional)
                      </FormLabel>
                      <MultiSelectCommand
                        options={timeSlotsOptions}
                        selectedValues={field.value || []}
                        onValueChange={(values) => field.onChange(values)}
                        placeholder="Select preferred time slots..."
                        className="bg-input border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-lg font-semibold flex items-center text-primary"><User className="mr-2 h-5 w-5" />Your Contact Details</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-primary/80" />Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} className="bg-input border-border focus:border-primary focus:ring-primary/30" />
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
                      <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} className="bg-input border-border focus:border-primary focus:ring-primary/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-primary/80" />Phone Number</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="w-auto min-w-[120px]">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
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
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="tel" placeholder="XXXXXXXXXX" {...field} className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormItem>
               <FormField
                control={form.control}
                name="whatsAppNotifications"
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
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-input/50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="pr-acceptTerms"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel
                        htmlFor="pr-acceptTerms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accept terms and conditions
                      </FormLabel>
                      <FormDescription className="text-xs text-muted-foreground">
                        By submitting, you agree to our{' '}
                        <Link href="/terms-and-conditions" className="text-primary hover:underline" target="_blank">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy-policy" className="text-primary hover:underline" target="_blank">
                          Privacy Policy
                        </Link>
                        .
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          <DialogFooter className="pt-6 flex flex-row justify-between items-center w-full">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious} className="transform transition-transform hover:scale-105 active:scale-95">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              )}
            </div>
            <div>
              {currentStep < totalSteps && (
                <Button type="button" onClick={handleNext} className="transform transition-transform hover:scale-105 active:scale-95">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {currentStep === totalSteps && (
                <Button type="submit" disabled={form.formState.isSubmitting} className="transform transition-transform hover:scale-105 active:scale-95">
                  <Send className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting ? "Sending..." : "Send"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
