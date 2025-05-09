
import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, CalendarDays, MapPin, UserCircle, Tag } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface TuitionRequirementCardProps {
  requirement: TuitionRequirement;
}

export function TuitionRequirementCard({ requirement }: TuitionRequirementCardProps) {
  const postedDate = new Date(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl mb-1">{requirement.subject}</CardTitle>
          <Badge variant={requirement.status === 'open' ? 'default' : 'secondary'} className={requirement.status === 'open' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}>
            {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">Posted {timeAgo}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm flex-grow">
        <div className="flex items-center">
          <Tag className="w-4 h-4 mr-2 text-primary" />
          <strong>Grade:</strong>&nbsp;{requirement.gradeLevel}
        </div>
        <div className="flex items-center">
          <CalendarDays className="w-4 h-4 mr-2 text-primary" />
          <strong>Schedule:</strong>&nbsp;{requirement.scheduleDetails.length > 100 ? requirement.scheduleDetails.substring(0,97) + "..." : requirement.scheduleDetails}
        </div>
        {requirement.location && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            <strong>Location:</strong>&nbsp;{requirement.location}
          </div>
        )}
        {requirement.parentName && (
             <div className="flex items-center">
                <UserCircle className="w-4 h-4 mr-2 text-primary" />
                <strong>Posted by:</strong>&nbsp;{requirement.parentName}
            </div>
        )}
        {requirement.additionalNotes && (
          <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
            <strong>Notes:</strong> {requirement.additionalNotes.length > 150 ? requirement.additionalNotes.substring(0,147) + "..." : requirement.additionalNotes}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          View Details & Apply
        </Button>
      </CardFooter>
    </Card>
  );
}
