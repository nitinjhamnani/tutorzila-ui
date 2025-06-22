
// src/components/tutors/TutorProfileCard.tsx
"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, GraduationCap, Star, Laptop, Users, MapPin, Briefcase, ShieldCheck, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TutorProfileCardProps {
  tutor: TutorProfile;
  parentContextBaseUrl?: string;
  hideRating?: boolean;
  showFullName?: boolean;
  showShortlistButton?: boolean;
}

// Helper component for info items with icons
const InfoItem = ({ icon: Icon, text, className }: { icon: React.ElementType; text?: string | string[]; className?: string }) => {
  if (!text || (Array.isArray(text) && text.length === 0)) return null;
  const displayText = Array.isArray(text) ? text.join(", ") : text;
  return (
    <div className={cn("flex items-center text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors", className)}>
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 group-hover:text-primary/90 transition-colors shrink-0" />
      <span className="truncate text-[12.5px] font-medium">{displayText}</span>
    </div>
  );
};

export function TutorProfileCard({ tutor, parentContextBaseUrl, hideRating = false, showFullName = false, showShortlistButton = false }: TutorProfileCardProps) {
  const rating = tutor.rating || 0;
  const [mockReviewCount, setMockReviewCount] = useState<number | 0>(0);
  const [isClient, setIsClient] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setMockReviewCount(Math.floor(Math.random() * 50) + 5);
    }
  }, [isClient]);


  const TeachingModeIcon =
    Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("Online") && (tutor.teachingMode.includes("In-person") || tutor.teachingMode.includes("Offline (In-person)"))
      ? Laptop
      : Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("Online")
      ? Laptop
      : Array.isArray(tutor.teachingMode) && (tutor.teachingMode.includes("In-person") || tutor.teachingMode.includes("Offline (In-person)"))
      ? Users
      : Laptop;

  const teachingModeText =
    Array.isArray(tutor.teachingMode) && tutor.teachingMode.length > 0
      ? tutor.teachingMode.map(mode => mode.replace(" (In-person)", "").replace("Offline", "In-person")).join(' & ')
      : "Not Specified";

  let base = parentContextBaseUrl || '/tutors/';
  if (parentContextBaseUrl && !parentContextBaseUrl.endsWith('/')) {
    base += '/';
  } else if (!parentContextBaseUrl && !base.endsWith('/')) {
    base += '/';
  }
  const linkHref = `${base}${tutor.id}`;

  const handleShortlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsShortlisted(prev => {
      const newShortlistStatus = !prev;
      toast({
        title: newShortlistStatus ? "Tutor Shortlisted" : "Tutor Removed from Shortlist",
        description: `${tutor.name} has been ${newShortlistStatus ? 'added to' : 'removed from'} your shortlist.`,
      });
      return newShortlistStatus;
    });
  };

  return (
    <Link href={linkHref} passHref legacyBehavior>
      <a className="block group cursor-pointer h-full">
        <Card className={cn(
          "w-full h-full",
          "flex flex-col p-4 sm:p-5",
          "rounded-xl shadow-lg border border-border/40",
          "transition-all duration-300 bg-card",
          "hover:shadow-xl hover:-translate-y-0.5 relative" 
        )}>
          <CardHeader className="flex flex-row items-start justify-between gap-3 p-0 mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-primary/20 shadow-sm shrink-0">
                <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/128`} alt={tutor.name} />
                <AvatarFallback className="text-sm sm:text-base bg-primary/10 text-primary font-semibold">
                  {tutor.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "flex-1 min-w-0",
                showShortlistButton && "pr-8" // Add padding to the right if shortlist button is shown
              )}>
                <CardTitle className={cn(
                  "text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors",
                  !showFullName && "truncate"
                )}>
                  {tutor.name}
                </CardTitle>
                 {Array.isArray(tutor.teachingMode) && tutor.teachingMode.length > 0 && (
                  <Badge variant="outline" className="mt-1 text-[10px] py-0.5 px-1.5 border-primary/30 bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors items-center">
                    <TeachingModeIcon className="w-2.5 h-2.5 mr-1 text-primary/80" />
                    {teachingModeText}
                  </Badge>
                )}
              </div>
            </div>
            {showShortlistButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShortlistToggle}
                className="absolute top-1 right-1 h-8 w-8 text-muted-foreground hover:text-primary z-10"
                aria-label={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
              >
                <Bookmark className={cn("h-5 w-5 transition-colors", isShortlisted && "fill-primary text-primary")} />
              </Button>
            )}
            {!hideRating && !showShortlistButton && ( 
              <div className="flex items-center text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors shrink-0 ml-2 mt-1">
                <Star className="w-3.5 h-3.5 fill-primary text-primary mr-1" />
                <span className="font-medium">{typeof rating === 'number' ? rating.toFixed(1) : 'N/A'} ({mockReviewCount})</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0 space-y-2 flex-grow">
            <InfoItem icon={BookOpen} text={Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : tutor.subjects} className="font-medium"/>
            {tutor.grade && <InfoItem icon={GraduationCap} text={tutor.grade} className="font-medium"/>}
            {tutor.boardsTaught && tutor.boardsTaught.length > 0 && (
              <InfoItem icon={ShieldCheck} text={tutor.boardsTaught.join(', ')} className="font-medium"/>
            )}
            {tutor.experience && <InfoItem icon={Briefcase} text={tutor.experience} className="font-medium"/>}
          </CardContent>

          <CardFooter className="p-0 mt-3 pt-3 border-t border-border/20 flex justify-between items-center">
            {tutor.location && <InfoItem icon={MapPin} text={tutor.location} />}
            {(tutor.minHourlyRate || tutor.maxHourlyRate) && (
              <Badge variant="outline" className="text-[11.5px] py-1 px-2.5 border-primary/40 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors font-semibold">
                {tutor.minHourlyRate && tutor.maxHourlyRate && tutor.minHourlyRate !== tutor.maxHourlyRate
                  ? `₹${tutor.minHourlyRate} - ₹${tutor.maxHourlyRate}/hr`
                  : tutor.minHourlyRate && tutor.maxHourlyRate && tutor.minHourlyRate === tutor.maxHourlyRate
                  ? `₹${tutor.minHourlyRate}/hr`
                  : tutor.minHourlyRate
                  ? `From ₹${tutor.minHourlyRate}/hr`
                  : tutor.maxHourlyRate
                  ? `Up to ₹${tutor.maxHourlyRate}/hr`
                  : ''}
              </Badge>
            )}
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}
