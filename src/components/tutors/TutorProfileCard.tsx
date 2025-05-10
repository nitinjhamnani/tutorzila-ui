"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, GraduationCap, Award, Star, Laptop, Users, CheckCircle, XCircle } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";

interface TutorProfileCardProps {
  tutor: TutorProfile;
}

export function TutorProfileCard({ tutor }: TutorProfileCardProps) {
  // Mock rating for display purposes
  const rating = 4; // Example rating (out of 5)

  const TeachingModeIcon = tutor.teachingMode === "Online" ? Laptop : tutor.teachingMode === "In-person" ? Users : Laptop; // Default to Laptop for Hybrid or undefined

  return (
    <Card className="group shadow-md hover:shadow-lg transition-all duration-300 flex flex-col transform hover:scale-102 hover:-translate-y-0.5 bg-card h-full min-h-[22rem] w-full max-w-sm mx-auto rounded-xl overflow-hidden border border-border/30 hover:border-primary/50">
      <CardHeader className="items-center text-center p-5 pb-3">
        <Avatar className="w-24 h-24 border-2 border-primary/30 group-hover:border-primary transition-all duration-300 group-hover:shadow-lg">
          <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/128`} alt={tutor.name} />
          <AvatarFallback className="text-xl bg-primary/20 text-primary">{tutor.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg font-semibold mt-3 truncate w-full px-1">{tutor.name}</CardTitle>
        
        {tutor.status && (
          <Badge
            variant={tutor.status === "Active" ? "default" : "destructive"}
            className="text-xs py-0.5 px-2 mt-1"
          >
            {tutor.status === "Active" ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
            {tutor.status}
          </Badge>
        )}

        {tutor.teachingMode && (
          <div className="flex items-center text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">
            <TeachingModeIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>{tutor.teachingMode}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3 text-xs flex-grow p-5 pt-2"> 
        
        <div className="flex items-center pt-1.5">
          <BookOpen className="w-4 h-4 mr-2.5 text-primary shrink-0" />
          <p className="text-foreground/80 text-xs line-clamp-1">
            {tutor.subjects.join(", ")}
          </p>
        </div>

        {tutor.grade && (
          <div className="flex items-center pt-1.5">
            <GraduationCap className="w-4 h-4 mr-2.5 text-primary shrink-0" />
            <p className="text-foreground/80 text-xs line-clamp-1">{tutor.grade}</p>
          </div>
        )}

        <div className="flex items-center pt-1.5">
          <Award className="w-4 h-4 mr-2.5 text-primary shrink-0" />
          <p className="text-foreground/80 text-xs line-clamp-1">{tutor.experience}</p>
        </div>
      </CardContent>
      {tutor.hourlyRate && (
        <CardFooter className="p-4 pt-3 border-t bg-muted/20">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${index < rating ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground'}`}
                />
              ))}
               <span className="ml-1.5 text-xs text-muted-foreground">({rating}.0)</span>
            </div>
            <div className="text-sm font-semibold text-primary">
              <span>₹{tutor.hourlyRate}/hr</span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}