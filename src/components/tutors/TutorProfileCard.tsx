
"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Briefcase, DollarSign, Star, MapPinIcon } from "lucide-react";
import Image from "next/image";

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
        <CardDescription className="text-sm text-muted-foreground">Experienced Tutor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm flex-grow p-4 md:p-6">
        <div className="flex items-center">
          <BookOpen className="w-4 h-4 mr-2 text-primary transition-transform duration-300 group-hover:rotate-[-5deg]" />
          <strong>Subjects:</strong>
        </div>
        <div className="flex flex-wrap gap-1.5 ml-6">
          {tutor.subjects.map(subject => (
            <Badge key={subject} variant="secondary" className="transition-all group-hover:bg-primary/20 group-hover:text-primary text-xs px-2 py-0.5">
              {subject}
            </Badge>
          ))}
        </div>

        <div className="flex items-center pt-1">
          <Star className="w-4 h-4 mr-2 text-primary transition-transform duration-300 group-hover:rotate-[-5deg]" />
          <strong>Experience:</strong>&nbsp;{tutor.experience}
        </div>

        {tutor.hourlyRate && (
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-primary transition-transform duration-300 group-hover:rotate-[-5deg]" />
            <strong>Rate:</strong>&nbsp;{tutor.hourlyRate}/hr
          </div>
        )}
         {tutor.availability && (
            <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2 text-primary transition-transform duration-300 group-hover:rotate-[-5deg]" />
                <strong>Availability:</strong>&nbsp;{tutor.availability}
            </div>
        )}
        {tutor.bio && (
          <p className="text-xs text-muted-foreground pt-2 border-t mt-3">
            {tutor.bio.length > 100 ? tutor.bio.substring(0, 97) + "..." : tutor.bio}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 md:p-6">
        <Button className="w-full transform transition-transform hover:scale-105 active:scale-95" variant="default" disabled>
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
