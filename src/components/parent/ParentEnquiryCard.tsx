
"use client";

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Kept for Reopen button
import { GraduationCap, Clock, RadioTower, Building, MapPin, Users as UsersIcon, Archive } from "lucide-react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
// Link import is removed as the card itself will not be a link
import { Badge } from "@/components/ui/badge";

interface ParentEnquiryCardProps {
  requirement: TuitionRequirement;
  onEdit?: (id: string) => void; // Prop remains, but no button for it on this card
  onDelete?: (requirement: TuitionRequirement) => void; // Prop remains
  onClose?: (requirement: TuitionRequirement) => void; // Prop remains
  onReopen?: (id: string) => void; // Prop remains, used by Reopen button
}

const getInitials = (name?: string): string => {
  if (!name || name.trim() === "") return "P";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

// Helper component for info items with icons
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

  // Card content is now directly rendered, not wrapped in a Link
  const cardContent = (
    <div
      className={cn(
        "bg-card rounded-none shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full",
        isPastEnquiry && "opacity-70 bg-muted/30"
      )}
    >
      <CardHeader className="p-0 pb-3 sm:pb-4 relative">
        <div className="flex items-start space-x-3">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm bg-primary text-primary-foreground border-primary/20">
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
          {/* Status Badge was removed as per previous request */}
        </div>
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

      <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex justify-between items-center">
        <div className="flex-grow min-w-0">
           {/* Applicants Count Badge removed as per previous request */}
        </div>
        {/* Action buttons are removed from here based on prior instructions. */}
        {/* Reopen button for past enquiries remains as it's a specific action on the card itself */}
        {isPastEnquiry && onReopen && (
            <Button
                variant="outline"
                size="xs"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent any potential parent click if this button was inside a Link
                    onReopen(requirement.id);
                }}
                className="text-xs py-1.5 px-2.5 h-auto border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
            >
                <Archive className="mr-1.5 h-3 w-3" /> Reopen
            </Button>
        )}
      </CardFooter>
    </div>
  );

  return cardContent; // The card is no longer wrapped in a Link
}
