
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  GraduationCap,
  Building,
  RadioTower,
  MapPin,
  CalendarDays,
  Clock,
  Info,
  VenetianMask,
  XCircle,
  MapPinned,
  UsersRound,
  Coins,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicEnquiryDetails } from "@/types";

const fetchEnquiryByCode = async (code: string): Promise<PublicEnquiryDetails> => {
  if (!code) throw new Error("Enquiry code is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/auth/enquiry/${code}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Enquiry not found.");
    }
    throw new Error("Failed to fetch enquiry details.");
  }
  return response.json();
};

const EnquiryInfoItem = ({
  icon: Icon,
  label,
  value,
  children,
  className,
}: {
  icon?: React.ElementType;
  label?: string;
  value?: string | string[] | number | null;
  children?: React.ReactNode;
  className?: string;
}) => {
  if (!value && !children && value !== 0) return null;
  
  let displayText: React.ReactNode = Array.isArray(value) ? value.join(", ") : value;
  
  if (typeof value === 'number') {
    displayText = value.toLocaleString();
  }
  if (label?.toLowerCase().includes('fees')) {
    displayText = `₹${displayText}`;
  }


  return (
    <div className={cn("space-y-0.5", className)}>
      {label && (
         <span className="text-xs text-muted-foreground font-medium flex items-center">
            {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/80" />}
            {label}
        </span>
      )}
      {!label && Icon && <Icon className="w-3.5 h-3.5 text-primary/80" />}
      {displayText && <div className={cn("text-sm text-foreground/90", !label && "pl-0")}>{children ? null : displayText}</div>}
      {children && <div className={cn("text-sm text-foreground/90", !label && "pl-0")}>{children}</div>}
    </div>
  );
};


export default function PublicEnquiryPage() {
  const params = useParams();
  const code = params.code as string;

  const { data: enquiry, isLoading, error } = useQuery({
    queryKey: ['publicEnquiry', code],
    queryFn: () => fetchEnquiryByCode(code),
    enabled: !!code,
    refetchOnWindowFocus: false,
  });

  const containerPadding = "container mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10";

  if (isLoading) {
    return (
      <div className={containerPadding}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerPadding} flex justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height,0px))]`}>
        <Alert variant="destructive" className="max-w-md text-center shadow-lg rounded-xl">
          <XCircle className="h-10 w-10 mx-auto mb-3 text-destructive" />
          <AlertTitle className="text-xl font-semibold">Enquiry Not Found</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!enquiry) {
    return <div className={`${containerPadding} text-center`}>No enquiry data available.</div>;
  }
  
  const transformStringToArray = (str: string | null | undefined): string[] => {
    if (typeof str === 'string' && str.trim() !== '') {
        return str.split(',').map(s => s.trim());
    }
    return [];
  };

  const teachingModes = [];
  if(enquiry.online) teachingModes.push("Online");
  if(enquiry.offline) teachingModes.push("Offline (In-person)");
  
  const hasScheduleInfo = enquiry.availabilityDays || enquiry.availabilityTime;
  const hasPreferences = enquiry.tutorGenderPreference || enquiry.startDatePreference;
  const hasLocationInfo = enquiry.address || enquiry.city || enquiry.state;
  const hasBudgetInfo = enquiry.daysPerWeek || enquiry.hoursPerDay || enquiry.totalFees || enquiry.totalDays;

  return (
    <div className={`${containerPadding} animate-in fade-in duration-500 ease-out`}>
      <Card className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-card p-4 sm:p-5 relative">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-xl font-semibold text-primary">{enquiry.subjects}</CardTitle>
                <Badge variant="default" className="text-xs">Open</Badge>
              </div>
              <div className="space-y-2 pt-2">
                <CardDescription className="text-sm text-foreground/80 flex items-center gap-1.5">
                  <UsersRound className="w-4 h-4"/> {enquiry.studentName}
                </CardDescription>
                <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                  <Clock className="w-3.5 h-3.5" /> 
                  Posted on {format(parseISO(enquiry.createdOn), "MMM d, yyyy")}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-5 space-y-5 border-t">
          <section className="space-y-3">
              <h3 className="text-base font-semibold text-foreground flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-primary/80" />
                Academic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                <EnquiryInfoItem label="Grade Level" value={enquiry.grade} icon={GraduationCap} />
                <EnquiryInfoItem label="Board" value={enquiry.board} icon={Building} />
                <EnquiryInfoItem label="Mode(s)" value={teachingModes.join(', ')} icon={RadioTower} />
              </div>
          </section>

          {(hasPreferences || hasScheduleInfo || hasBudgetInfo) && <Separator />}

          {hasPreferences && (
            <section className="space-y-3">
              <h3 className="text-base font-semibold text-foreground flex items-center">
                <Info className="w-4 h-4 mr-2 text-primary/80" />
                Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                <EnquiryInfoItem label="Tutor Gender" value={enquiry.tutorGenderPreference} icon={VenetianMask} />
                <EnquiryInfoItem label="Start Date" value={enquiry.startDatePreference?.replace(/_/g, ' ')} icon={CalendarDays} />
              </div>
            </section>
          )}

          {hasScheduleInfo && (
            <section className="space-y-3">
              <h3 className="text-base font-semibold text-foreground flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-primary/80" />
                Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                <EnquiryInfoItem label="Preferred Days" value={transformStringToArray(enquiry.availabilityDays)} icon={CalendarDays} />
                <EnquiryInfoItem label="Preferred Time" value={transformStringToArray(enquiry.availabilityTime)} icon={Clock} />
              </div>
            </section>
          )}

          {hasBudgetInfo && (
            <section className="space-y-3">
              <h3 className="text-base font-semibold text-foreground flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-primary/80" />
                Session & Budget
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                <EnquiryInfoItem label="Sessions per Week" value={enquiry.daysPerWeek} icon={CalendarDays} />
                <EnquiryInfoItem label="Hours per Session" value={enquiry.hoursPerDay} icon={Clock} />
                <EnquiryInfoItem label="Total Monthly Fees" value={enquiry.totalFees} icon={Coins} />
                <EnquiryInfoItem label="Total Days per Month" value={enquiry.totalDays} icon={CalendarDays} />
              </div>
            </section>
          )}

          {hasLocationInfo && (
            <>
              <Separator />
              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary/80" />
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-6">
                  <EnquiryInfoItem label="Area" value={enquiry.area} icon={MapPin} />
                  <EnquiryInfoItem label="City/State" value={[enquiry.city, enquiry.state].filter(Boolean).join(', ')} icon={MapPinned} />
                </div>
              </section>
            </>
          )}
          
          {(enquiry.notes || enquiry.additionalNotes) && (
            <>
              <Separator />
              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground flex items-center">
                  <Info className="w-4 h-4 mr-2 text-primary/80" />
                  Additional Notes
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed pl-6 whitespace-pre-wrap">
                  {enquiry.notes || enquiry.additionalNotes}
                </p>
              </section>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
