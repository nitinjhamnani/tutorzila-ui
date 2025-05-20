
"use client";

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, Eye, RadioTower, Edit3, Trash2, Archive, Building, MapPin, Users as UsersIcon } from "lucide-react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"; // Keep Badge import if used elsewhere or for consistency, but will remove its usage in header/footer.

interface ParentEnquiryCardProps {
  requirement: TuitionRequirement;
  onEdit?: (id: string) => void; // Made optional as actions are removed
  onDelete?: (requirement: TuitionRequirement) => void; // Made optional
  onClose?: (requirement: TuitionRequirement) => void; // Made optional
  onReopen?: (id: string) => void; // Made optional
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

  // Status badge logic removed from here as the badge itself is removed from header.

  const cardContent = (
    <div
      className={cn(
        "bg-card rounded-lg shadow-sm w-full overflow-hidden border border-border/50",
        isPastEnquiry && "opacity-70 bg-muted/30"
      )}
    >
      <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-4 relative">
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
          {/* Status Badge Removed from here */}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 sm:p-5 sm:pt-3 space-y-1 sm:space-y-1.5 text-xs flex-grow">
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

      <CardFooter className="p-4 pt-3 sm:p-5 sm:pt-4 border-t border-border/20 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex-grow min-w-0">
          {/* Applicants Count Badge Removed */}
        </div>
        {/* Action Buttons were already removed */}
      </CardFooter>
    </div>
  );

  // If onEdit is defined, wrap the card content with a button or link for edit functionality
  if (onEdit) {
    return (
      <button
        onClick={() => onEdit(requirement.id)}
        className="block w-full text-left hover:bg-muted/20 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`View or edit enquiry for ${Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}`}
      >
        {cardContent}
      </button>
    );
  }

  // Otherwise, just return the card content (e.g., if no actions are needed or handled differently)
  return cardContent;
}
