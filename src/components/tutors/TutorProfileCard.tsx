
"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star } from "lucide-react";

interface TutorProfileCardProps {
  tutor: TutorProfile;
}

export function TutorProfileCard({ tutor }: TutorProfileCardProps) {
  return (
    <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col transform hover:scale-102 hover:-translate-y-1 bg-card">
      <CardHeader className="items-center text-center p-4 md:p-6">
        <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-primary/30 group-hover:border-primary transition-all duration-300 transform group-hover:scale-105">
          <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/128`} alt={tutor.name} />
          <AvatarFallback className="text-2xl bg-primary/20 text-primary">{tutor.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl md:text-2xl mt-3">{tutor.name}</CardTitle>
        <div className="flex items-center mt-1">
          <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400 transition-transform duration-300 group-hover:rotate-[-5deg]" />
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
           <span className="ml-1.5 text-xs text-muted-foreground">(Mock)</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm flex-grow p-4 md:p-6">
        <div className="flex items-start">
          <BookOpen className="w-4 h-4 mr-2 text-primary transition-transform duration-300 group-hover:rotate-[-5deg] shrink-0 mt-0.5" />
           <p className="text-foreground/80 line-clamp-2">
            {tutor.subjects.join(", ")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

