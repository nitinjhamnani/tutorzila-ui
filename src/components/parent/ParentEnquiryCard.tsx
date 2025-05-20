
"use client";

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, Eye, RadioTower, Edit3, Trash2, Archive, Building, MapPin, Users as UsersIcon } from "lucide-react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ParentEnquiryCardProps {
  requirement: TuitionRequirement;
  onEdit: (id: string) => void;
  onDelete: (requirement: TuitionRequirement) => void;
  onClose: (requirement: TuitionRequirement) => void;
  onReopen: (id: string) => void;
}

const getInitials = (name?: string): string => {
  if (!name || name.trim() === "") return "P";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

const InfoItem = ({ icon: Icon, label, value, className }: { icon?: React.ElementType; label?: string; value?: string | string[]; className?: string }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const displayText = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div className={cn("flex items-start text-xs w-full min-w-0", className)}>
      {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0 mt-[1px]" />}
      {label && <strong className="text-muted-foreground font-medium whitespace-nowrap">{label}:&nbsp;</strong>}
      <span className="text-foreground/90 break-words">{displayText}</span>
    </div>
  );
};

export function ParentEnquiryCard({ requirement, onEdit, onDelete, onClose, onReopen }: ParentEnquiryCardProps) {
  const postedDate = parseISO(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const parentInitials = getInitials(requirement.parentName);
  const isPastEnquiry = requirement.status === 'closed';

  const statusBadgeVariant = () => {
    switch (requirement.status) {
      case 'open': return 'bg-blue-100 text-blue-700 border-blue-500/50';
      case 'matched': return 'bg-green-100 text-green-700 border-green-500/50';
      case 'closed': return 'bg-gray-100 text-gray-600 border-gray-400/50';
      default: return 'outline';
    }
  };

  return (
    <Card
      className={cn(
        "bg-card rounded-none shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full",
        isPastEnquiry && "opacity-75 bg-muted/30"
      )}
    >
      <CardHeader className="p-0 pb-3 sm:pb-4 relative">
        <div className="flex items-start space-x-3">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm bg-primary text-primary-foreground">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-[10px] sm:text-xs">
              {parentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0 space-y-0.5">
            <CardTitle className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
              {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
            </CardTitle>
            <CardDescription className="text-[11px] sm:text-xs text-muted-foreground flex items-center">
              <Clock className="w-3 h-3 inline mr-1 text-muted-foreground/80" /> Posted {timeAgo}
            </CardDescription>
          </div>
        </div>
         <Badge
            variant="outline"
            className={cn(
                "absolute top-0 right-0 text-[9px] py-0.5 px-2 border font-medium whitespace-nowrap",
                statusBadgeVariant()
            )}
          >
            {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
          </Badge>
      </CardHeader>

      <CardContent className="p-0 pt-2 sm:pt-3 space-y-1 sm:space-y-1.5 text-xs flex-grow">
        <InfoItem icon={GraduationCap} label="Grade" value={requirement.gradeLevel} />
        {requirement.board && (
          <InfoItem icon={Building} label="Board" value={requirement.board} />
        )}
        {requirement.teachingMode && requirement.teachingMode.length > 0 && (
            <InfoItem icon={RadioTower} label="Mode" value={requirement.teachingMode.join(', ')} />
        )}
        {requirement.location && (
            <InfoItem icon={MapPin} label="Location" value={requirement.location} />
        )}
      </CardContent>

      <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex-grow min-w-0">
            {requirement.status === 'open' && requirement.applicantsCount !== undefined && (
                <Badge variant="outline" className="py-0.5 px-1.5 border-border/70 bg-background/50 font-normal text-muted-foreground text-[10px] flex items-center rounded-full">
                    <UsersIcon className="w-2.5 h-2.5 mr-1 text-muted-foreground/80" /> {requirement.applicantsCount} Applicant{requirement.applicantsCount !== 1 ? 's' : ''}
                </Badge>
            )}
        </div>
        {/* Action buttons are removed from here */}
      </CardFooter>
    </Card>
  );
}
