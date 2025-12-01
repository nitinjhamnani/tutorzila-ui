// src/components/tutors/TutorProfileCard.tsx
"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, GraduationCap, Laptop, Users, MapPin, Briefcase, ShieldCheck, Bookmark } from "lucide-react";
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
    <div className={cn("flex items-start text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors", className)}>
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 group-hover:text-primary/90 transition-colors shrink-0 mt-0.5" />
      <span className="text-[12.5px] font-medium break-words">{displayText}</span>
    </div>
  );
};

export function TutorProfileCard({ tutor, parentContextBaseUrl, hideRating = false, showFullName = false, showShortlistButton = false }: TutorProfileCardProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

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
                <AvatarFallback className="text-sm sm:text-base bg-primary/10 text-primary font-semibold">
                  {tutor.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
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
          </CardHeader>

          <CardContent className="p-0 space-y-2 flex-grow">
            <InfoItem icon={BookOpen} text={Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : tutor.subjects} className="font-medium"/>
            <InfoItem icon={GraduationCap} text={Array.isArray(tutor.gradeLevelsTaught) ? tutor.gradeLevelsTaught.join(", ") : tutor.grade} className="font-medium"/>
            {tutor.boardsTaught && tutor.boardsTaught.length > 0 && (
              <InfoItem icon={ShieldCheck} text={tutor.boardsTaught.join(', ')} className="font-medium"/>
            )}
            {tutor.experience && <InfoItem icon={Briefcase} text={tutor.experience} className="font-medium"/>}
          </CardContent>

          <CardFooter className="p-0 mt-3 pt-3 border-t border-border/20 flex justify-between items-center">
            {tutor.location && <InfoItem icon={MapPin} text={tutor.location} />}
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}
