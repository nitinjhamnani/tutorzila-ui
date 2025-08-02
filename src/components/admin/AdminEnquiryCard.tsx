
"use client";

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, Users as UsersIcon, Clock, Eye, RadioTower, Building, Send, Edit3, Settings, CheckCircle } from "lucide-react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface AdminEnquiryCardProps {
  requirement: TuitionRequirement;
}

const getInitials = (subject?: string[]): string => {
  if (!subject || subject.length === 0 || !subject[0]) return "?";
  const firstSubject = subject[0];
  return firstSubject[0].toUpperCase();
};

const InfoItem = ({ icon: Icon, text, className }: { icon: React.ElementType; text?: string | string[]; className?: string }) => {
  if (!text || (Array.isArray(text) && text.length === 0)) return null;
  const displayText = Array.isArray(text) ? text.join(", ") : text;
  return (
    <div className={cn("flex items-start text-xs w-full min-w-0", className)}>
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0 mt-[1px]" />
      <div className="min-w-0 flex-1">
        <span className="text-foreground/90 break-words">{displayText}</span>
      </div>
    </div>
  );
};

export function AdminEnquiryCard({ requirement }: AdminEnquiryCardProps) {
  const postedDate = parseISO(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const subjectInitials = getInitials(requirement.subject);
  const locationString = typeof requirement.location === 'object' && requirement.location !== null
    ? [requirement.location.area, requirement.location.city, requirement.location.country].filter(Boolean).join(', ')
    : requirement.location;

  const manageEnquiryUrl = `/admin/manage-enquiry/${requirement.id}`;


  return (
    <Card className="bg-card rounded-xl shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full">
      <CardHeader className="p-0 pb-3 sm:pb-4 relative">
        <div className="flex items-start space-x-3">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm bg-primary text-primary-foreground">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-base">
              {subjectInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
               {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
            </CardTitle>
            <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex items-center">
              <Clock className="w-3 h-3 mr-1 text-muted-foreground/80" /> Posted {timeAgo}
            </CardDescription>
          </div>
          <Badge variant="default" className="absolute top-0 right-0 text-xs">
            {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2 sm:pt-3 space-y-1.5 sm:space-y-2 text-xs flex-grow">
        <InfoItem icon={GraduationCap} text={requirement.gradeLevel} />
        {requirement.board && (
          <InfoItem icon={Building} text={requirement.board} />
        )}
        {requirement.teachingMode && requirement.teachingMode.length > 0 && (
            <InfoItem icon={RadioTower} text={requirement.teachingMode.join(', ')} />
        )}
      </CardContent>
      <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-wrap gap-1.5 items-center text-[10px] text-muted-foreground self-start sm:self-center min-w-0">
          {requirement.applicantsCount !== undefined && requirement.applicantsCount > 0 && (
            <Badge variant="outline" className="py-0.5 px-1.5 border-border/70 bg-background/50 font-normal">
              <UsersIcon className="w-2.5 h-2.5 mr-1 text-muted-foreground/80" /> {requirement.applicantsCount} Tutors Assigned
            </Badge>
          )}
           {locationString && (
            <Badge variant="outline" className="py-0.5 px-1.5 border-border/70 bg-background/50 font-normal">
              <MapPin className="w-2.5 h-2.5 mr-1 text-muted-foreground/80" />
              {locationString}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 self-end">
            {requirement.status === 'open' && (
               <Button
                size="sm"
                variant="default"
                className="text-xs py-1.5 px-3 h-auto bg-green-600 hover:bg-green-700"
               >
                <CheckCircle className="w-3 h-3 mr-1.5" /> Accept
              </Button>
            )}
            <Button
                asChild
                size="sm"
                variant="default"
                className="text-xs py-1.5 px-3 h-auto"
                >
                <Link href={manageEnquiryUrl}>
                    <Settings className="w-3 h-3 mr-1.5" /> Manage
                </Link>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
