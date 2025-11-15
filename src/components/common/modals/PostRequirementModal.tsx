
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
import { User, BookOpen, Settings2, ArrowLeft, ArrowRight, Send, CalendarDays, Clock, MapPin, Info, Phone, Mail, X, GraduationCap, Building, RadioTower, VenetianMask, Lock, Eye, EyeOff } from "lucide-react";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { LocationAutocompleteInput, type LocationDetails } from "@/components/shared/LocationAutocompleteInput";
import { Switch } from "@/components/ui/switch";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { allSubjectsList, gradeLevelsList, boardsList, teachingModeOptions, daysOptions, timeSlotsOptions, startDatePreferenceOptions, tutorGenderPreferenceOptions } from "@/lib/constants";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";


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
  tutorGenderPreference: z.enum(["MALE", "FEMALE", "NO_PREFERENCE"], { required_error: "Please select a gender preference." }),
  startDatePreference: z.enum(["IMMEDIATELY", "WITHIN_A_MONTH", "JUST_EXPLORING"], { required_error: "Please select a start date preference." }),
  preferredDays: z.array(z.string()).optional(),
  preferredTimeSlots: z.array(z.string()).optional(),
  // Step 3
  name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  country: z.string().min(2, "Country is required."),
  localPhoneNumber: z.string().length(10, { message: "Phone number must be 10 digits." }).regex(/^\d+$/, "Phone number must be digits only."),
  password: z.string()
      .min(8, "Password must be at least 8 characters long and include an uppercase letter and a special symbol.")
      .regex(/[A-Z]/, "Password must be at least 8 characters long and include an uppercase letter and a special symbol.")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must be at least 8 characters long and include an uppercase letter and a special symbol."),
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


export type PostRequirementFormValues = z.infer<typeof postRequirementSchema>;

interface PostRequirementModalProps {
  onSuccess: () => void;
  onTriggerSignIn?: (name?: string) => void;
  initialSubject?: string[];
  startFromStep?: number;
}

export function PostRequirementModal({ 
  onSuccess, 
  onTriggerSignIn, 
  initialSubject,
  startFromStep = 1,
}: PostRequirementModalProps) {
  
  const [currentStep, setCurrentStep] = useState(startFromStep);
  const totalSteps = 3;
  const { user, isAuthenticated } = useAuthMock();

  const { toast } = useToast();
  const { showLoader, hideLoader } = useGlobalLoader();
  const router = useRouter();
  const { setSession } = useAuthMock();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpIdentifier, setOtpIdentifier] = useState("");

  const form = useForm<PostRequirementFormValues>({
    resolver: zodResolver(postRequirementSchema),
    defaultValues: {
      studentName: "",
      name: "",
      email: "",
      country: "IN",
      localPhoneNumber: "",
      password: "",
      subject: initialSubject || [],
      gradeLevel: "",
      board: "",
      teachingMode: [],
      location: null,
      tutorGenderPreference: undefined,
      startDatePreference: undefined,
      preferredDays: [],
      preferredTimeSlots: [],
      whatsAppNotifications: true,
      acceptTerms: false,
    },
  });
  
  useEffect(() => {
    if (initialSubject) {
      form.setValue('subject', initialSubject);
    }
  }, [initialSubject, form]);
  
  useEffect(() => {
    if (startFromStep === 2 && isAuthenticated && user) {
        // No pre-filling to respect user request
    }
  }, [startFromStep, isAuthenticated, user, form]);


  const handleNext = async () => {
    let fieldsToValidate: (keyof PostRequirementFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['studentName', 'subject', 'gradeLevel', 'board'];
    } else if (currentStep === 2) { 
      fieldsToValidate = ['teachingMode', 'location', 'tutorGenderPreference', 'startDatePreference'];
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
    const locationDetails = data.location;
    
    const enquiryRequest = {
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
    
    const signupRequest = {
        name: data.name,
        email: data.email,
        password: data.password,
        country: data.country,
        countryCode: selectedCountryData?.countryCode || '',
        phone: data.localPhoneNumber,
        userType: "PARENT",
        whatsappEnabled: data.whatsAppNotifications,
    };
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const endpoint = '/api/auth/enquiry';
      
      const headers: HeadersInit = { 'Content-Type': 'application/json', 'accept': '*/*' };
      const body = JSON.stringify({ enquiryRequest, signupRequest });

      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      hideLoader(); 

      const responseData = await response.json().catch(() => ({ message: "An unexpected error occurred." }));

      if (!response.ok) {
        throw new Error(responseData.message || "An unexpected error occurred.");
      }
      
      if (responseData.message && responseData.message.toLowerCase().includes("user already exists") && onTriggerSignIn) {
          onTriggerSignIn(data.email);
          return;
      }

      if (response.ok) {
        setOtpIdentifier(data.email);
        setIsOtpModalOpen(true);
        // We do NOT call onSuccess() here anymore.
        // It will be called by the OTP modal upon successful verification.
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
  const isFinalStep = currentStep === totalSteps;

  return (
    <>
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
                      options={allSubjectsList}
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

          {(currentStep === 2) && (
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
                  name="tutorGenderPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><VenetianMask className="mr-2 h-4 w-4 text-primary/80" />Preferred Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30">
                            <SelectValue placeholder="Select tutor gender" />
                          </SelectTrigger>
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
                          <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary/30">
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
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

          {(currentStep === 3) && (
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
                              <SelectItem key={c.country} value={c.country} className="text-sm">{c.label}</SelectItem>))}
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Set Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="pl-12 pr-10 py-3 text-base bg-input border-border focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg" />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => setShowPassword(prev => !prev)}>
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground pt-1">
                        Must be at least 8 characters long and include an uppercase letter and a special symbol.
                    </FormDescription>
                    <FormMessage />
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
              {!isFinalStep && (
                <Button type="button" onClick={handleNext} className="transform transition-transform hover:scale-105 active:scale-95">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {isFinalStep && (
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
    <OtpVerificationModal
      isOpen={isOtpModalOpen}
      onOpenChange={setIsOtpModalOpen}
      verificationType="email"
      identifier={otpIdentifier}
      onSuccess={async () => { 
        // Now that OTP is verified, we can call the original onSuccess to close the PostRequirementModal
        onSuccess();
      }}
    />
    </>
  );
}
