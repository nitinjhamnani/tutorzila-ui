// src/components/tutors/TutorProfileCard.tsx
"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, GraduationCap, Star, Laptop, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TutorProfileCardProps {
  tutor: TutorProfile;
}

// Helper component for info items with icons
const InfoItem = ({ icon: Icon, text, className }: { icon: React.ElementType; text?: string | string[]; className?: string }) => {
  if (!text || (Array.isArray(text) && text.length === 0)) return null;
  const displayText = Array.isArray(text) ? text.join(", ") : text;
  return (
    <div className={cn("flex items-center text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors", className)}>
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 group-hover:text-primary/90 transition-colors shrink-0" />
      <span className="truncate text-[12.5px]">{displayText}</span>
    </div>
  );
};

// Mock review count - replace with actual data if available
const mockReviewCount = Math.floor(Math.random() * 50) + 5; // Random number between 5 and 54

export function TutorProfileCard({ tutor }: TutorProfileCardProps) {
  const rating = tutor.rating || 0;

  const TeachingModeIcon =
    Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("Online") && tutor.teachingMode.includes("In-person")
      ? Laptop // Hybrid
      : Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("Online")
      ? Laptop
      : Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("In-person")
      ? Users
      : Laptop; // Default

  const teachingModeText =
    Array.isArray(tutor.teachingMode) && tutor.teachingMode.length > 0
      ? tutor.teachingMode.map(mode => mode.replace(" (In-person)", "")).join(' & ')
      : "Not Specified";
      
  const isOfflineTutor = Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("In-person");


  return (
    <Link href={`/tutors/${tutor.id}`} passHref legacyBehavior>
      <a className="block group cursor-pointer h-full">
        <Card className={cn(
          "w-full h-full",
          "flex flex-col p-4",
          "rounded-xl shadow-md hover:shadow-lg border border-border/30",
          "transition-all duration-300 bg-card",
          "transform hover:-translate-y-1"
        )}>
          <CardHeader className="flex flex-row items-start justify-between gap-3 p-0 mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="w-14 h-14 border-2 border-primary/20 shadow-sm shrink-0">
                <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/128`} alt={tutor.name} />
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
                  {tutor.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
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
            <div className="flex items-center text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors shrink-0 ml-2 mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
              <span>{typeof rating === 'number' ? rating.toFixed(1) : 'N/A'} ({mockReviewCount})</span>
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-2.5 flex-grow">
            <InfoItem icon={BookOpen} text={tutor.subjects} />
            {tutor.grade && <InfoItem icon={GraduationCap} text={tutor.grade} />}
            {tutor.experience && <InfoItem icon={Laptop} text={tutor.experience} />}
          </CardContent>

          <CardFooter className="p-0 mt-3 pt-3 border-t border-border/20 flex justify-between items-center">
            {isOfflineTutor && tutor.location && (
              <InfoItem icon={MapPin} text={tutor.location} className="text-[11.5px]" />
            )}
            {!isOfflineTutor && <div />} {/* Placeholder to keep space if not offline tutor */}
            
            {tutor.hourlyRate && (
              <Badge variant="outline" className="text-[11.5px] py-1 px-2.5 border-primary/40 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {`₹${tutor.hourlyRate}/hr`}
              </Badge>
            )}
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}
