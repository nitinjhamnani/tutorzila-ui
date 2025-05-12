

"use client"; 

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, CalendarDays, MapPin, Briefcase, Building, Users,Clock, Eye, Presentation, Star as StarIcon, Bookmark, UserCheck } from "lucide-react"; 
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link"; 
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react"; // Added useEffect
import { useToast } from "@/hooks/use-toast";


interface TuitionRequirementCardProps {
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

export function TuitionRequirementCard({ requirement }: TuitionRequirementCardProps) {
  const postedDate = new Date(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const { toast } = useToast();

  const parentInitials = getInitials(requirement.parentName); 
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [mockViewsCount, setMockViewsCount] = useState<number | null>(null); // For client-side rendering

  useEffect(() => {
    // Generate mockViewsCount only on the client-side to avoid hydration mismatch
    setMockViewsCount(Math.floor(Math.random() * 150) + 20); // Example: 20-169 views
  }, []);


  const handleShortlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsShortlisted(!isShortlisted);
    toast({
      title: isShortlisted ? "Removed from Shortlist" : "Added to Shortlist",
      description: `Enquiry for ${requirement.subject} has been ${isShortlisted ? 'removed from' : 'added to'} your shortlist.`,
    });
  };


  return (
    <Card className="group bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-0.5">
      <CardHeader className="p-4 pb-3 bg-muted/20 border-b relative">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10 shrink-0 rounded-md shadow-sm border border-primary/20 mt-0.5">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-md text-xs">
              {parentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors line-clamp-2">
              {requirement.subject}
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
              Posted {timeAgo}
            </CardDescription>
          </div>
        </div>
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
      </CardHeader>
      <CardContent className="space-y-1.5 text-xs flex-grow p-4 pt-3"> 
        <InfoItem icon={GraduationCap} label="Grade" value={requirement.gradeLevel} />
        {requirement.board && (
          <InfoItem icon={Building} label="Board" value={requirement.board} />
        )}
        {requirement.teachingMode && requirement.teachingMode.length > 0 && (
            <InfoItem icon={Presentation} label="Mode" value={requirement.teachingMode.join(', ')} />
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
          {requirement.applicantsCount !== undefined && requirement.applicantsCount > 0 && (
            <Badge variant="outline" className="py-0.5 px-1.5 border-border/70 bg-background/50 font-normal">
              <UserCheck className="w-2.5 h-2.5 mr-1 text-muted-foreground/80" /> {requirement.applicantsCount} Applied
            </Badge>
          )}
        </div>
        <Button 
          asChild 
          size="sm" 
          variant="outline"
          className={cn(
            "transform transition-transform hover:scale-105 active:scale-95 text-[11px] py-1.5 px-3 shadow-sm hover:shadow-md rounded-md", 
            "bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Link href={`/dashboard/enquiries/${requirement.id}`}> 
            Apply Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  truncateValue?: number;
}

function InfoItem({ icon: Icon, label, value, truncateValue }: InfoItemProps) {
  const displayValue = truncateValue && value.length > truncateValue 
    ? `${value.substring(0, truncateValue - 3)}...` 
    : value;

  return (
    <div className="flex items-start text-xs">
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0 mt-[1px] transition-transform duration-300 group-hover:scale-105" />
      <div>
        <strong className="text-foreground/80 font-medium">{label}:</strong>&nbsp;
        <span className="text-muted-foreground">{displayValue}</span>
      </div>
    </div>
  );
}

