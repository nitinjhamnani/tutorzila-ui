
"use client";

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, Users as UsersIcon, Clock, Eye, RadioTower, Send, Bookmark, Building } from "lucide-react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGlobalLoader } from "@/hooks/use-global-loader";

interface TutorEnquiryCardProps {
  requirement: TuitionRequirement;
}

const getInitials = (subject?: string[]): string => {
  if (!subject || subject.length === 0 || !subject[0]) return "?";
  const firstSubject = subject[0];
  return firstSubject[0].toUpperCase();
};

// Helper component for info items with icons
const InfoItem = ({ icon: Icon, text, className }: { icon: React.ElementType; text?: string | string[]; className?: string }) => {
  if (!text || (Array.isArray(text) && text.length === 0)) return null;
  const displayText = Array.isArray(text) ? text.join(", ") : text;
  return (
    <div className={cn("flex items-start text-xs w-full min-w-0", className)}>
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0 mt-[1px]" />
      <div className="min-w-0 flex-1">
        <span className="text-foreground/90 break-words">{displayText}</span>
      </div>
    </div>
  );
};


export function TutorEnquiryCard({ requirement }: TutorEnquiryCardProps) {
  const postedDate = parseISO(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const { toast } = useToast();
  const { showLoader } = useGlobalLoader();

  const subjectInitials = getInitials(requirement.subject);
  
  const handleApplyClick = () => {
    showLoader("Fetching enquiry details...");
  };

  return (
    <Card className="bg-card rounded-xl shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full">
      <CardHeader className="p-0 pb-3 sm:pb-4 relative">
        <div className="flex items-start space-x-3">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm bg-primary text-primary-foreground">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-base">
              {subjectInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
               {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
            </CardTitle>
            <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex items-center">
              <Clock className="w-3 h-3 mr-1 text-muted-foreground/80" /> Posted {timeAgo}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2 sm:pt-3 space-y-1.5 sm:space-y-2 text-xs flex-grow">
        <InfoItem icon={GraduationCap} text={requirement.gradeLevel} />
        {requirement.board && (
          <InfoItem icon={Building} text={requirement.board} />
        )}
        {requirement.teachingMode && requirement.teachingMode.length > 0 && (
            <InfoItem icon={RadioTower} text={requirement.teachingMode.join(', ')} />
        )}
      </CardContent>
      <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-wrap gap-1.5 items-center text-[10px] text-muted-foreground self-start sm:self-center min-w-0">
          
          {requirement.location && (
            <Badge variant="outline" className="py-0.5 px-1.5 border-border/70 bg-background/50 font-normal">
              <MapPin className="w-2.5 h-2.5 mr-1 text-muted-foreground/80" />
              {requirement.location as string}
            </Badge>
          )}
        </div>
          <Button
            asChild
            size="sm"
            variant="primary-outline"
            className="w-full sm:w-auto text-xs py-1.5 px-3 h-auto"
          >
            <Link href={`/tutor/enquiries/${requirement.id}`} onClick={handleApplyClick}>
                <Send className="w-3 h-3 mr-1.5" />
                Apply Now
            </Link>
          </Button>
      </CardFooter>
    </Card>
  );
}
