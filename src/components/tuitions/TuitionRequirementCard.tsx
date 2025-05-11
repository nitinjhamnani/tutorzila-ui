
import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, CalendarDays, MapPin, Tag, Briefcase, Building, Users,Clock } from "lucide-react"; 
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
      <CardHeader className="p-4 pb-3"> {/* Adjusted padding */}
        <div className="flex items-start space-x-3"> {/* Use items-start for better vertical alignment if title wraps */}
          <Avatar className="h-10 w-10 shrink-0"> {/* Added shrink-0 */}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0"> {/* Added flex-grow and min-w-0 for proper truncation */}
            <CardTitle className="text-lg font-semibold text-primary group-hover:text-primary/80 transition-colors line-clamp-2"> {/* Subject as title, increased font size, primary color */}
              {requirement.subject}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Posted by {requirement.parentName || 'Anonymous'} &bull; {timeAgo}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm flex-grow p-4 pt-3"> {/* Adjusted padding */}
        {/* Subject is now in CardTitle, so removed from here */}
        <InfoItem icon={GraduationCap} label="Grade" value={requirement.gradeLevel} />
        {requirement.board && (
          <InfoItem icon={Building} label="Board" value={requirement.board} />
        )}
      </CardContent>
      <CardFooter className="p-4 border-t bg-card/50 group-hover:bg-muted/20 transition-colors duration-300"> {/* Adjusted background */}
        <Button className="w-full transform transition-transform hover:scale-105 active:scale-95 text-[15px] py-2.5" variant="outline"> {/* Adjusted padding and text size */}
          <Briefcase className="w-4 h-4 mr-2" /> View Details & Apply {/* Adjusted icon size */}
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
