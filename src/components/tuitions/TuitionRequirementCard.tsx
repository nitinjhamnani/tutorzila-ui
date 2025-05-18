
// src/components/tuitions/TuitionRequirementCard.tsx
"use client";

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, CalendarDays, MapPin, Building, Users as UsersIcon, Clock, Eye, RadioTower, Send, Edit3, Trash2, XCircle, Info, Archive, Bookmark, UserCheck, AlertTriangle, CheckCircle } from "lucide-react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface TuitionRequirementCardProps {
  requirement: TuitionRequirement;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClose?: (id: string) => void;
  onReopen?: (id: string) => void;
  isParentContext?: boolean;
}

const getInitials = (name?: string): string => {
  if (!name || name.trim() === "") return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export function TuitionRequirementCard({ requirement, showActions, onEdit, onDelete, onClose, onReopen, isParentContext = false }: TuitionRequirementCardProps) {
  const postedDate = parseISO(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const { toast } = useToast();

  const parentInitials = getInitials(requirement.parentName);
  const [isShortlisted, setIsShortlisted] = useState(requirement.mockIsShortlistedByCurrentUser || false);
  const [mockViewsCount, setMockViewsCount] = useState<number | null>(null);

  useEffect(() => {
    setMockViewsCount(Math.floor(Math.random() * 150) + 20);
  }, []);

  const handleShortlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShortlisted(!isShortlisted);
    toast({
      title: isShortlisted ? "Removed from Shortlist" : "Added to Shortlist",
      description: `Enquiry for ${Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject} has been ${isShortlisted ? 'removed from' : 'added to'} your shortlist.`,
    });
  };

  const isPastEnquiry = requirement.status === 'closed';

  if (isParentContext && showActions) {
    // Parent's "My Enquiries" list view
    return (
      <div
        className={cn(
          "group border border-border/50 rounded-lg shadow-sm hover:bg-muted/30 transition-colors duration-200 flex flex-col sm:flex-row items-center p-3 sm:p-4 justify-between gap-3 overflow-hidden w-full",
          isPastEnquiry ? "opacity-70 bg-muted/50" : "bg-card"
        )}
      >
        <Link href={`/dashboard/my-requirements/${requirement.id}`} className="flex items-center space-x-3 flex-grow min-w-0 w-full sm:w-auto cursor-pointer overflow-hidden">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-md shadow-sm border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-md text-[10px] sm:text-xs">
              {parentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0 space-y-1 overflow-hidden">
            <p className="text-sm font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
              {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
            </p>
            <div className="text-[10px] sm:text-[11px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 items-center">
              {requirement.gradeLevel && <span className="flex items-center"><GraduationCap className="w-3 h-3 inline mr-1 text-primary/70" /> {requirement.gradeLevel}</span>}
              {requirement.teachingMode && requirement.teachingMode.length > 0 && (
                <span className="flex items-center"><RadioTower className="w-3 h-3 inline mr-1 text-primary/70" /> {requirement.teachingMode.join(', ')}</span>
              )}
               {requirement.board && (
                 <span className="flex items-center"><Building className="w-3 h-3 inline mr-1 text-primary/70" /> {requirement.board}</span>
              )}
              <span className="flex items-center"><Clock className="w-3 h-3 inline mr-1 text-primary/70" /> {timeAgo}</span>
              <Badge
                variant={requirement.status === 'open' ? 'secondary' : requirement.status === 'matched' ? 'default' : 'outline'}
                className={cn(
                    "text-[9px] py-0.5 px-1.5 border font-medium",
                    requirement.status === 'open' && "bg-blue-100 text-blue-700 border-blue-500/50",
                    requirement.status === 'matched' && "bg-green-100 text-green-700 border-green-500/50",
                    requirement.status === 'closed' && "bg-gray-100 text-gray-600 border-gray-400/50",
                )}
              >
                {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
              </Badge>
            </div>
          </div>
        </Link>
        <div className="flex space-x-1.5 shrink-0 mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto justify-end min-w-[calc(3*1.75rem+2*0.375rem)]">
            {isPastEnquiry && onReopen && (
              <Button variant="outline" size="icon" className="h-7 w-7 border-green-500 text-green-600 hover:bg-green-500/10" title="Reopen Enquiry" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onReopen(requirement.id); }}>
                <Archive className="h-3.5 w-3.5" />
              </Button>
            )}
        </div>
      </div>
    );
  }

  // Tutor's "View All Enquiries" list view & public listings
  return (
    <Card className="bg-card rounded-xl shadow-lg p-4 md:p-5 border-0 w-full overflow-hidden">
      <CardHeader className="p-0 pb-3 relative">
        <div className="flex items-start space-x-3">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-md shadow-sm border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-md text-xs">
              {parentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-sm sm:text-base font-semibold text-primary break-words">
               {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Posted {timeAgo}
            </CardDescription>
          </div>
        </div>
        {!isParentContext && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
                "absolute top-0 right-0 h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full", // Adjusted positioning
                isShortlisted && "text-primary"
            )}
            onClick={handleShortlistToggle}
            title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
            >
            <Bookmark className={cn("h-4 w-4 transition-colors", isShortlisted && "fill-primary")} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0 pt-3 space-y-1.5 sm:space-y-2 text-xs">
        <InfoItem icon={GraduationCap} label="Grade:" value={requirement.gradeLevel} />
        {requirement.board && (
          <InfoItem icon={Building} label="Board:" value={requirement.board} />
        )}
        {requirement.teachingMode && requirement.teachingMode.length > 0 && (
            <InfoItem icon={RadioTower} label="Mode:" value={requirement.teachingMode.join(', ')} />
        )}
        {requirement.location && (
            <InfoItem icon={MapPin} label="Location:" value={requirement.location} />
        )}
      </CardContent>
      <CardFooter className="p-0 pt-3 mt-3 border-t border-border/20 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-wrap gap-1.5 items-center text-[10px] text-muted-foreground self-start sm:self-center min-w-0">
          {mockViewsCount !== null && (
            <Badge variant="outline" className="py-0.5 px-1.5 border-border/70 bg-background/50 font-normal">
              <Eye className="w-2.5 h-2.5 mr-1 text-muted-foreground/80" /> {mockViewsCount} Views
            </Badge>
          )}
          {requirement.applicantsCount !== undefined && requirement.applicantsCount >= 0 && (
            <Badge variant="outline" className="py-0.5 px-1.5 border-border/70 bg-background/50 font-normal">
              <UserCheck className="w-2.5 h-2.5 mr-1 text-muted-foreground/80" /> {requirement.applicantsCount} Applied
            </Badge>
          )}
        </div>
        {!isParentContext && (
          <Button
            asChild
            size="sm" // Use standard size prop
            className={cn(
              "w-full sm:w-auto text-xs py-1.5 px-3 h-auto", // Adjusted padding and height
              "bg-primary border-primary text-primary-foreground hover:bg-primary/90 transform transition-transform hover:scale-105 active:scale-95"
            )}
          >
            <Link href={`/dashboard/enquiries/${requirement.id}`}>
                <Send className="w-3 h-3 mr-1.5" />
                Apply Now
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  className?: string;
}

function InfoItem({ icon: Icon, label, value, className }: InfoItemProps) {
  return (
    <div className={cn("flex items-start text-xs w-full min-w-0", className)}>
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0 mt-[1px]" />
      <div className="min-w-0 flex-1">
        <strong className="text-muted-foreground font-medium">{label}</strong>&nbsp;
        <span className="text-foreground/90 break-words">{value}</span>
      </div>
    </div>
  );
}

    