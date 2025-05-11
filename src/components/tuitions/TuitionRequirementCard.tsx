
import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CalendarDays, MapPin, Tag, Briefcase, Building, Users,Clock } from "lucide-react"; 
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TuitionRequirementCardProps {
  requirement: TuitionRequirement;
}

const getInitials = (name?: string): string => {
  if (!name) return "??";
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export function TuitionRequirementCard({ requirement }: TuitionRequirementCardProps) {
  const postedDate = new Date(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  const initials = getInitials(requirement.parentName);

  return (
    <Card className="group bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {requirement.parentName || 'Anonymous'}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Posted {timeAgo}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm flex-grow p-4 pt-2">
        <h3 className="text-md font-semibold text-primary mb-1.5 line-clamp-2">{requirement.subject}</h3>
        <InfoItem icon={Tag} label="Grade" value={requirement.gradeLevel} />
        {requirement.board && (
          <InfoItem icon={Building} label="Board" value={requirement.board} />
        )}
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/10">
        <Button className="w-full transform transition-transform hover:scale-105 active:scale-95 text-[15px] py-2" variant="outline">
          <Briefcase className="w-3.5 h-3.5 mr-2" /> View Details & Apply
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
      <Icon className="w-3.5 h-3.5 mr-2 text-primary/70 shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
      <div>
        <strong className="text-foreground/80 font-medium">{label}:</strong>&nbsp;
        <span className="text-muted-foreground">{displayValue}</span>
      </div>
    </div>
  );
}
