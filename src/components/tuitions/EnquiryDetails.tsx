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
  ClipboardList,
  Info,
  DollarSign,
  Briefcase,
  MessageSquare,
  Send,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  const postedDate = new Date(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const formattedPostedDate = format(postedDate, "MMMM d, yyyy 'at' h:mm a");
  const parentInitials = getInitials(requirement.parentName);

  return (
    <Card className="bg-card border rounded-lg shadow-lg animate-in fade-in duration-500 ease-out overflow-hidden">
      <CardHeader className="bg-muted/30 p-4 md:p-5 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base md:text-lg font-semibold text-primary tracking-tight flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-primary/80" />
              Tuition Requirement Details
            </CardTitle>
            <CardDescription className="text-xs text-foreground/70 mt-0.5">
              Posted {timeAgo} (on {formattedPostedDate})
            </CardDescription>
          </div>
          <Badge variant={requirement.status === "open" ? "default" : "secondary"} className="text-xs py-0.5 px-2 self-start sm:self-center">
            Status: {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-5 space-y-4">
        {/* Parent Information */}
        <section className="space-y-2">
          <h3 className="text-sm md:text-base font-semibold text-foreground flex items-center">
            <User className="w-4 h-4 mr-2 text-primary/80" />
            Parent Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pl-6 text-xs">
            <DetailItem label="Posted by" value={requirement.parentName || "N/A"} />
          </div>
        </section>

        <Separator />

        {/* Tutoring Requirements */}
        <section className="space-y-2">
          <h3 className="text-sm md:text-base font-semibold text-foreground flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-primary/80" />
            Tutoring Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5 pl-6 text-xs">
            <DetailItem label="Subject(s)" value={requirement.subject} />
            <DetailItem label="Grade Level" value={requirement.gradeLevel} />
            {requirement.board && <DetailItem label="Board" value={requirement.board} />}
          </div>
        </section>

        <Separator />

        {/* Schedule & Location */}
        <section className="space-y-2">
          <h3 className="text-sm md:text-base font-semibold text-foreground flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-primary/80" />
            Schedule & Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5 pl-6 text-xs">
            <DetailItem label="Preferred Schedule" value={requirement.scheduleDetails} icon={Clock} />
            {requirement.location && <DetailItem label="Location Preference" value={requirement.location} icon={MapPin} />}
            {requirement.teachingMode && requirement.teachingMode.length > 0 && (
              <DetailItem label="Teaching Mode(s)" icon={RadioTower}>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {requirement.teachingMode.map(mode => (
                    <Badge key={mode} variant="secondary" className="text-[10px] py-0.5 px-1.5">{mode}</Badge>
                  ))}
                </div>
              </DetailItem>
            )}
          </div>
        </section>

        {requirement.additionalNotes && (
          <>
            <Separator />
            <section className="space-y-2">
              <h3 className="text-sm md:text-base font-semibold text-foreground flex items-center">
                <Info className="w-4 h-4 mr-2 text-primary/80" />
                Additional Notes
              </h3>
              <p className="text-xs text-muted-foreground pl-6 whitespace-pre-wrap">{requirement.additionalNotes}</p>
            </section>
          </>
        )}
      </CardContent>

      <CardFooter className="bg-muted/30 p-4 border-t flex flex-col sm:flex-row justify-end items-center gap-2">
        <Button variant="outline" className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95 text-xs py-1.5 px-2.5">
           <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Contact Parent (Mock)
        </Button>
        <Button className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95 text-xs py-1.5 px-2.5">
          <Send className="w-3.5 h-3.5 mr-1.5" /> Apply Now (Mock)
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
}

function DetailItem({ label, value, icon: Icon, children }: DetailItemProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] text-muted-foreground font-medium flex items-center mb-0.5">
        {Icon && <Icon className="w-3 h-3 mr-1.5 text-primary/70" />}
        {label}
      </span>
      {value && <p className="text-xs text-foreground/90">{value}</p>}
      {children}
    </div>
  );
}
