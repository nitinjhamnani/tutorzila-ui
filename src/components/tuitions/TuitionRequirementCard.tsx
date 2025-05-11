
import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, CalendarDays, MapPin, Tag, Briefcase, Building, Users,Clock, Eye } from "lucide-react"; 
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link"; 

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
    <Card className="group bg-card border border-border/50 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-1">
      <CardHeader className="p-4 pb-3 bg-muted/20 rounded-t-xl border-b border-border/40">
        <div className="flex items-start space-x-3.5">
          <Avatar className="h-11 w-11 shrink-0 rounded-lg shadow-sm border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-lg text-sm">
              {parentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-md font-semibold text-primary group-hover:text-primary/90 transition-colors line-clamp-2">
              {requirement.subject}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Posted {timeAgo}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-[13px] flex-grow p-4 pt-3"> 
        <InfoItem icon={GraduationCap} label="Grade" value={requirement.gradeLevel} />
        {requirement.board && (
          <InfoItem icon={Building} label="Board" value={requirement.board} />
        )}
      </CardContent>
      <CardFooter className="p-3.5 border-t bg-card/50 group-hover:bg-muted/30 transition-colors duration-300 flex justify-end">
        <Button 
          asChild 
          size="sm" 
          variant="outline"
          className={cn(
            "transform transition-transform hover:scale-105 active:scale-95 text-[11px] py-1.5 px-3 shadow-sm hover:shadow-md rounded-md", // Adjusted text size and padding
            "bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Link href={`/dashboard/enquiries/${requirement.id}`}> 
            <Eye className="w-3 h-3 mr-1.5" /> {/* Adjusted icon size */}
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
    <div className="flex items-start text-[13px]">
      <Icon className="w-3.5 h-3.5 mr-2 text-primary/70 shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
      <div>
        <strong className="text-foreground/80 font-medium">{label}:</strong>&nbsp;
        <span className="text-muted-foreground">{displayValue}</span>
      </div>
    </div>
  );
}
