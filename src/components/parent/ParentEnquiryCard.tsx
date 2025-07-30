
"use client";

import type { TuitionRequirement } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Clock,
  GraduationCap,
  Building,
  RadioTower,
  MapPin,
  Settings as SettingsIcon, // Renamed to avoid conflict
  Eye,
  Users as UsersIcon, // Aliased
  Archive,
  Edit3,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ParentEnquiryCardProps {
  requirement: TuitionRequirement;
  onEdit: (requirement: TuitionRequirement) => void;
  onReopen: (id: string) => void;
}

const getInitials = (subject?: string[]): string => {
  if (!subject || subject.length === 0 || !subject[0]) return "?";
  const firstSubject = subject[0];
  return firstSubject[0].toUpperCase();
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon?: React.ElementType;
  label?: string;
  value?: string | string[];
  className?: string;
}) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const displayText = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div className={cn("flex items-start text-xs w-full min-w-0", className)}>
      {Icon && (
        <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0 mt-[1px]" />
      )}
      {label && (
        <strong className="text-muted-foreground font-medium whitespace-nowrap">
          {label}:&nbsp;
        </strong>
      )}
      <span className="text-foreground/90 break-words">{displayText}</span>
    </div>
  );
};

export function ParentEnquiryCard({
  requirement,
  onEdit,
  onReopen,
}: ParentEnquiryCardProps) {
  const postedDate = parseISO(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const subjectInitials = getInitials(requirement.subject);
  const isPastEnquiry = requirement.status === "closed";

  const locationString = typeof requirement.location === 'object' && requirement.location !== null
    ? [requirement.location.area, requirement.location.city, requirement.location.country].filter(Boolean).join(', ')
    : requirement.location;

  return (
      <Card
        className={cn(
          "bg-card rounded-xl shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full",
          isPastEnquiry && "opacity-70 bg-muted/30"
        )}
      >
        <CardHeader className="p-0 pb-3 sm:pb-4 relative">
          <div className="flex items-start space-x-3">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm bg-primary text-primary-foreground">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-base">
                {subjectInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0 space-y-0.5">
              <CardTitle className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
                {Array.isArray(requirement.subject)
                  ? requirement.subject.join(", ")
                  : requirement.subject}
              </CardTitle>
              <CardDescription className="text-[11px] sm:text-xs text-muted-foreground flex items-center">
                <Clock className="w-3 h-3 inline mr-1 text-muted-foreground/80" />{" "}
                Posted {timeAgo}
              </CardDescription>
            </div>
            {(requirement.status === 'open' || requirement.status === 'matched') && (
                 <Button
                    variant="default"
                    size="icon"
                    className="absolute top-0 right-0 h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90"
                    title="Edit Enquiry"
                    onClick={() => onEdit(requirement)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
            )}
             {/* Settings icon linking to detailed view if needed */}
             <Link href={`/parent/my-enquiries/${requirement.id}`} passHref legacyBehavior>
                <Button
                  asChild
                  variant="ghost" 
                  size="icon"
                  className="absolute top-0 right-0 h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90"
                  title="View Enquiry Details & Timeline"
                  // Removed onClick from here as Link handles navigation
                >
                  <a><SettingsIcon className="h-4 w-4" /></a>
                </Button>
              </Link>
          </div>
        </CardHeader>

        <CardContent className="p-0 pt-2 sm:pt-3 space-y-1 sm:space-y-1.5 text-xs flex-grow">
          <InfoItem icon={GraduationCap} label="Grade" value={requirement.gradeLevel} />
          {requirement.board && (
            <InfoItem icon={Building} label="Board" value={requirement.board} />
          )}
          {requirement.teachingMode && requirement.teachingMode.length > 0 && (
            <InfoItem
              icon={RadioTower}
              label="Mode"
              value={requirement.teachingMode.join(", ")}
            />
          )}
          {locationString && requirement.teachingMode?.includes('Offline (In-person)') && (
            <InfoItem icon={MapPin} label="Location" value={locationString} />
          )}
        </CardContent>

        <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex justify-between items-center">
            <div className="flex-shrink-0">
                {requirement.assignedTutors !== undefined && (
                    <Badge
                        variant="outline"
                        className="py-0.5 px-1.5 border-border/70 bg-background/50 font-normal text-muted-foreground text-[10px] flex items-center rounded-full"
                    >
                        <UsersIcon className="w-2.5 h-2.5 mr-1 text-muted-foreground/80" />
                        {requirement.assignedTutors} Tutor
                        {requirement.assignedTutors === 1 ? " Assigned" : "s Assigned"}
                    </Badge>
                )}
            </div>
           <div className="flex items-center gap-2">
            {isPastEnquiry && onReopen && (
              <Button
                variant="outline"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onReopen(requirement.id);
                }}
                className="text-xs py-1.5 px-2.5 h-auto border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Archive className="mr-1.5 h-3 w-3" /> Reopen
              </Button>
            )}
            <Button
                asChild
                size="sm"
                className={cn(
                "text-xs py-1.5 px-3 h-auto",
                "bg-primary border-primary text-primary-foreground hover:bg-primary/90 transform transition-transform hover:scale-105 active:scale-95"
                )}
            >
                <Link href={`/parent/my-tutors/${requirement.id}`}>
                  <UsersIcon className="w-3 h-3 mr-1.5" />
                  View Tutors
                </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
  );
}
