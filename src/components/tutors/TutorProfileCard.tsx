
"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, GraduationCap, Award } from "lucide-react";

interface TutorProfileCardProps {
  tutor: TutorProfile;
}

export function TutorProfileCard({ tutor }: TutorProfileCardProps) {
  return (
    <Card className="group shadow-md hover:shadow-lg transition-all duration-300 flex flex-col transform hover:scale-102 hover:-translate-y-0.5 bg-card h-full min-h-[16rem]"> {/* Increased min-height slightly */}
      <CardHeader className="items-center text-center p-4 pb-2 md:p-5 md:pb-2">
        <Avatar className="w-20 h-20 md:w-20 md:h-20 border-2 border-primary/30 group-hover:border-primary transition-all duration-300">
          <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/128`} alt={tutor.name} />
          <AvatarFallback className="text-lg bg-primary/20 text-primary">{tutor.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-sm font-semibold md:text-base mt-2 truncate w-full px-1">{tutor.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 text-xs flex-grow p-5 pt-2 md:p-6 md:pt-2"> {/* Increased padding and space-y */}
        
        <div className="flex items-start pt-1">
          <BookOpen className="w-3.5 h-3.5 mr-2 text-primary shrink-0 mt-[1px]" /> {/* Increased icon size and margin */}
          <p className="text-foreground/70 leading-tight line-clamp-1">
            {tutor.subjects.join(", ")}
          </p>
        </div>

        {tutor.grade && (
          <div className="flex items-center pt-0.5">
            <GraduationCap className="w-3.5 h-3.5 mr-2 text-primary shrink-0" /> {/* Increased icon size and margin */}
            <p className="text-foreground/70 leading-tight line-clamp-1">{tutor.grade}</p>
          </div>
        )}

        <div className="flex items-center pt-0.5">
          <Award className="w-3.5 h-3.5 mr-2 text-primary shrink-0" /> {/* Increased icon size and margin */}
          <p className="text-foreground/70 leading-tight line-clamp-1">{tutor.experience}</p>
        </div>
      </CardContent>
    </Card>
  );
}

