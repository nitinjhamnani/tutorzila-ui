// src/components/tuitions/EnquiryDetails.tsx
"use client";

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Clock,
  MapPin,
  Building,
  RadioTower,
  Info,
  Briefcase,
  ArrowLeft,
  Users as UsersIcon, 
  Bookmark,
} from "lucide-react";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface EnquiryDetailsProps {
  requirement: TuitionRequirement;
}

const getInitials = (name?: string): string => {
  if (!name || name.trim() === "") return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export function EnquiryDetails({ requirement }: EnquiryDetailsProps) {  
  const postedDate = requirement.postedAt ? parseISO(requirement.postedAt) : new Date();
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const formattedPostedDate = format(postedDate, "MMMM d, yyyy 'at' h:mm a");
  const { toast } = useToast();
  const [isShortlisted, setIsShortlisted] = useState(requirement.mockIsShortlistedByCurrentUser || false);

  const parentInitials = getInitials(requirement.parentName);

  const hasScheduleInfo = (requirement.preferredDays && requirement.preferredDays.length > 0) || (requirement.preferredTimeSlots && requirement.preferredTimeSlots.length > 0);
  const hasLocationInfo = !!requirement.address && requirement.address.trim() !== '';

  const handleShortlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsShortlisted(prev => {
      const newShortlistStatus = !prev;
      toast({
        title: newShortlistStatus ? "Added to Shortlist" : "Removed from Shortlist",
        description: `Enquiry for ${Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject} has been ${newShortlistStatus ? 'added to' : 'removed from'} your shortlist.`,
      });
      return newShortlistStatus;
    });
  };
  
  return (
    <Card className="bg-card border rounded-lg shadow-lg animate-in fade-in duration-500 ease-out overflow-hidden">
      <CardHeader className="bg-muted/30 p-4 md:p-5 border-b relative"> 
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center space-x-3 flex-grow min-w-0">
            {requirement.parentName && (
              <Avatar className="h-10 w-10 shrink-0 rounded-full shadow-sm border border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-xs">
                  {parentInitials}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-grow min-w-0">
                {requirement.parentName && (
                    <CardTitle className="text-lg md:text-xl font-semibold text-primary tracking-tight mb-0.5 break-words">
                        {requirement.parentName}
                    </CardTitle>
                )}
                <CardDescription className="text-xs text-foreground/70 mt-0">
                Posted {timeAgo} (on {formattedPostedDate})
                </CardDescription>
            </div>
          </div>
           <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full", 
              isShortlisted && "text-primary"
            )}
            onClick={handleShortlistToggle}
            title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
          >
            <Bookmark className={cn("h-4.5 w-4.5 transition-colors", isShortlisted && "fill-primary")} /> 
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-5 space-y-4">
        
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-primary/80" />
            Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pl-6 text-xs">
            <DetailItem label="Subject(s)" value={Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject} className="text-xs"/>
            <DetailItem label="Grade Level" value={requirement.gradeLevel} className="text-xs" />
            {requirement.board && <DetailItem label="Board" value={requirement.board} className="text-xs"/>}
             {requirement.applicantsCount !== undefined && (
              <DetailItem label="Applicants" value={String(requirement.applicantsCount)} icon={UsersIcon} className="text-xs"/>
            )}
             {requirement.teachingMode && requirement.teachingMode.length > 0 && (
              <DetailItem label="Teaching Mode(s)" icon={RadioTower} className="md:col-span-2">
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {requirement.teachingMode.map(mode => (
                      <Badge key={mode} variant="secondary" className="text-[11px] py-0.5 px-1.5">{mode}</Badge>
                  ))}
                </div>
              </DetailItem>
             )}
          </div>
        </section>
        
        {hasScheduleInfo && (
          <>
            <Separator />
            <section className="space-y-2">
              <h3 className="text-base font-semibold text-foreground flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-primary/80" />
                Schedule Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pl-6 text-xs">
                {requirement.preferredDays && requirement.preferredDays.length > 0 && (
                  <DetailItem label="Preferred Days" value={requirement.preferredDays.join(', ')} icon={CalendarDays} className="text-xs"/>
                )}
                {requirement.preferredTimeSlots && requirement.preferredTimeSlots.length > 0 && (
                  <DetailItem label="Preferred Time" value={requirement.preferredTimeSlots.join(', ')} icon={Clock} className="text-xs"/>
                )}
              </div>
            </section>
          </>
        )}
        
        {hasLocationInfo && (
          <>
            <Separator />
            <section className="space-y-2">
              <h3 className="text-base font-semibold text-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary/80" />
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pl-6 text-xs">
                <DetailItem label="Preference" value={requirement.address} icon={MapPin} className="text-xs"/>
              </div>
            </section>
          </>
        )}

        {requirement.additionalNotes && (
          <>
            <Separator />
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center">
                <Info className="w-4 h-4 mr-2 text-primary/80" />
                Additional Notes
              </h3>
              <p className="text-xs text-foreground/80 leading-relaxed pl-6 whitespace-pre-wrap">
                {requirement.additionalNotes}
              </p>
            </section>
          </>
        )}
      </CardContent>

      <CardFooter className="bg-muted/30 p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
        <Button variant="link" asChild className="text-xs p-0 h-auto text-primary hover:text-primary/80">
          <Link href="/tutor/enquiries">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Go back to listing
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

interface DetailItemProps {
  label: string;
  value?: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}

function DetailItem({ label, value, icon: Icon, children, className }: DetailItemProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-[11px] text-muted-foreground font-medium flex items-center mb-0.5">
        {Icon && <Icon className="w-3 h-3 mr-1.5 text-primary/70" />}
        {label}
      </span>
      {value && <p className="text-xs text-foreground/80">{value}</p>}
      {children && <div className={cn("text-xs", className)}>{children}</div>}
    </div>
  );
}
