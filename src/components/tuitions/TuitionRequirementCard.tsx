
"use client"; 

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, CalendarDays, MapPin, Briefcase, Building, Users as UsersIcon, Clock, Eye, Presentation, Star as StarIcon, Bookmark, UserCheck, RadioTower, Send, Edit3, Trash2, XCircle, Info, Users, BookOpen } from "lucide-react"; 
import { formatDistanceToNow } from 'date-fns';
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

export function TuitionRequirementCard({ requirement, showActions, onEdit, onDelete, onClose, isParentContext = false }: TuitionRequirementCardProps) {
  const postedDate = new Date(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const { toast } = useToast();

  const parentInitials = getInitials(requirement.parentName); 
  const [isShortlisted, setIsShortlisted] = useState(false);
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
    // List Item Layout for "My Enquiries"
    return (
      <div className={cn(
        "group bg-card border border-border/50 rounded-lg shadow-sm hover:bg-muted/30 transition-colors duration-200 flex flex-col sm:flex-row items-center p-3 sm:p-4 justify-between gap-3", 
        isPastEnquiry && "opacity-70 bg-muted/50"
      )}>
        <Link href={`/dashboard/my-requirements/${requirement.id}`} className="flex items-center space-x-3 flex-grow min-w-0 w-full sm:w-auto cursor-pointer">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-md shadow-sm border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-md text-[10px] sm:text-xs">
              {parentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0 space-y-1">
            <p className="text-sm font-semibold text-primary group-hover:text-primary/90 transition-colors">
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
        {!isPastEnquiry && (
          <div className="flex space-x-1.5 shrink-0 mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto justify-end">
            <Button variant="outline" size="icon" className="h-7 w-7" title="Edit" onClick={() => onEdit?.(requirement.id)} disabled={false} >
              <Edit3 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="destructive" size="icon" className="h-7 w-7" title="Delete" onClick={() => onDelete?.(requirement.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7 border-orange-500 text-orange-600 hover:bg-orange-500/10" title="Close Requirement" onClick={() => onClose?.(requirement.id)}>
              <XCircle className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Original Card Layout (for public listings etc.)
  return (
    <Card className={cn(
      "group bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-0.5",
      isPastEnquiry && "opacity-70 bg-muted/50" 
    )}>
      <CardHeader className="p-4 pb-3 bg-muted/20 border-b relative">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10 shrink-0 rounded-md shadow-sm border border-primary/20 mt-0.5">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-md text-xs">
              {parentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors">
               {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
              Posted {timeAgo}
            </CardDescription>
          </div>
        </div>
        {!isParentContext && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
                "absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full",
                isShortlisted && "text-primary"
            )}
            onClick={handleShortlistToggle}
            title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
            >
            <Bookmark className={cn("h-4 w-4 transition-colors", isShortlisted && "fill-primary")} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-xs flex-grow p-4 pt-3"> 
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
      <CardFooter className="p-3 border-t bg-card/50 group-hover:bg-muted/20 transition-colors duration-300 flex justify-between items-center">
        <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
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
        {!(isParentContext && showActions) && !isParentContext && ( 
          <Button 
            asChild 
            className={cn(
              "transform transition-transform hover:scale-105 active:scale-95 text-xs py-1.5 px-2.5",
              "bg-primary border-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Link href={`/dashboard/enquiries/${requirement.id}`}> 
                <Send className="w-3.5 h-3.5 mr-1.5" />
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
  truncateValue?: number;
  className?: string; // Add className to InfoItemProps
}

function InfoItem({ icon: Icon, label, value, truncateValue, className }: InfoItemProps) {
  const displayValue = truncateValue && value && value.length > truncateValue 
    ? `${value.substring(0, truncateValue - 3)}...` 
    : value;

  return (
    <div className={cn("flex items-start text-xs", className)}>
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0 mt-[1px] transition-transform duration-300 group-hover:scale-105" />
      <div className="min-w-0 flex-1">
        <strong className="text-foreground/80 font-medium">{label}:</strong>&nbsp;
        <span className="text-muted-foreground break-words">{displayValue}</span>
      </div>
    </div>
  );
}
