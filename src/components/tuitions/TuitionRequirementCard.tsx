
import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, CalendarDays, MapPin, Tag, Briefcase, Building, RadioTower } from "lucide-react"; // Added Building, RadioTower
import { formatDistanceToNow } from 'date-fns';

interface TuitionRequirementCardProps {
  requirement: TuitionRequirement;
}

export function TuitionRequirementCard({ requirement }: TuitionRequirementCardProps) {
  const postedDate = new Date(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  const statusVariant = requirement.status === 'open' 
    ? 'default' 
    : requirement.status === 'matched' 
    ? 'secondary'
    : 'outline';

  const statusColorClass = requirement.status === 'open' 
    ? 'bg-green-500 hover:bg-green-600 text-white border-green-600' 
    : requirement.status === 'matched'
    ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600'
    : 'bg-gray-400 hover:bg-gray-500 text-white border-gray-500';


  return (
    <Card className="group bg-card border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <CardHeader className="p-4 md:p-5 pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-primary group-hover:text-primary/90 transition-colors line-clamp-2">{requirement.subject}</CardTitle>
          <Badge 
            variant={statusVariant} 
            className={`transition-all duration-300 group-hover:scale-105 text-xs py-1 px-2.5 ${statusColorClass}`}
          >
            {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground">Posted {timeAgo} by {requirement.parentName || 'Anonymous'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5 text-sm flex-grow p-4 md:p-5 pt-0">
        <InfoItem icon={Tag} label="Grade" value={requirement.gradeLevel} />
        {requirement.board && (
          <InfoItem icon={Building} label="Board" value={requirement.board} />
        )}
        <InfoItem icon={CalendarDays} label="Schedule" value={requirement.scheduleDetails} truncateValue={100} />
        {requirement.location && (
          <InfoItem icon={MapPin} label="Location" value={requirement.location} />
        )}
        {requirement.teachingMode && requirement.teachingMode.length > 0 && (
          <InfoItem icon={RadioTower} label="Mode" value={requirement.teachingMode.join(', ')} />
        )}
        {requirement.additionalNotes && (
          <p className="text-xs text-muted-foreground pt-2.5 border-t border-border/30 mt-2.5 line-clamp-3">
            <strong className="text-foreground/90">Notes:</strong> {requirement.additionalNotes}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 md:p-5 border-t bg-muted/20">
        <Button className="w-full transform transition-transform hover:scale-105 active:scale-95 text-base py-2.5" variant="outline">
          <Briefcase className="w-4 h-4 mr-2" /> View Details & Apply
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
    <div className="flex items-start">
      <Icon className="w-4 h-4 mr-2.5 text-primary/80 shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
      <div>
        <strong className="text-foreground/90 font-medium">{label}:</strong>&nbsp;
        <span className="text-foreground/80">{displayValue}</span>
      </div>
    </div>
  );
}


    