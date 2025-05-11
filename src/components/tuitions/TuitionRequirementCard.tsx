

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, CalendarDays, MapPin, Tag, Briefcase, Building, Users,Clock, Eye, RadioTower } from "lucide-react"; 
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link"; 
import { Badge } from "@/components/ui/badge";

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

  const parentInitials = getInitials(requirement.parentName); 

  return (
    <Card className="group bg-card border border-border/30 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-0.5">
      <CardHeader className="p-4 pb-3 bg-muted/20 border-b border-border/30">
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
      </CardHeader>
      <CardContent className="space-y-1.5 text-xs flex-grow p-4 pt-3"> 
        <InfoItem icon={GraduationCap} label="Grade" value={requirement.gradeLevel} />
        {requirement.board && (
          <InfoItem icon={Building} label="Board" value={requirement.board} />
        )}
      </CardContent>
      <CardFooter className="p-3 border-t bg-card/50 group-hover:bg-muted/20 transition-colors duration-300 flex justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {requirement.teachingMode && requirement.teachingMode.length > 0 && (
            <div className="flex items-center">
              <RadioTower className="w-3 h-3 mr-1 text-primary/70 shrink-0" />
              <span>{requirement.teachingMode.join(', ')}</span>
            </div>
          )}
          {requirement.location && (
             <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1 text-primary/70 shrink-0" />
              <span>{requirement.location}</span>
            </div>
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
            <Eye className="w-3 h-3 mr-1.5" /> 
            View & Apply
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

