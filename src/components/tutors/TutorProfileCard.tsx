
"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, GraduationCap, Award, Star } from "lucide-react"; 

interface TutorProfileCardProps {
  tutor: TutorProfile;
}

export function TutorProfileCard({ tutor }: TutorProfileCardProps) {
  // Mock rating for display purposes
  const rating = 4; // Example rating (out of 5)

  return (
    <Card className="group shadow-md hover:shadow-lg transition-all duration-300 flex flex-col transform hover:scale-102 hover:-translate-y-0.5 bg-card h-full min-h-[18rem] w-full"> {/* Adjusted min-height and width */}
      <CardHeader className="items-center text-center p-4 pb-2 md:p-5 md:pb-2">
        <Avatar className="w-20 h-20 md:w-20 md:h-20 border-2 border-primary/30 group-hover:border-primary transition-all duration-300">
          <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/128`} alt={tutor.name} />
          <AvatarFallback className="text-lg bg-primary/20 text-primary">{tutor.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-base font-semibold md:text-lg mt-2 truncate w-full px-1">{tutor.name}</CardTitle> {/* Increased font size slightly */}
      </CardHeader>
      <CardContent className="space-y-3.5 text-xs flex-grow p-4 pt-2 md:p-5 md:pt-2"> {/* Increased padding and space-y */}
        
        <div className="flex items-start pt-1.5">
          <BookOpen className="w-4 h-4 mr-2.5 text-primary shrink-0 mt-[1px]" /> {/* Increased icon size and margin */}
          <p className="text-foreground/80 text-xs line-clamp-1">
            {tutor.subjects.join(", ")}
          </p>
        </div>

        {tutor.grade && (
          <div className="flex items-center pt-1.5">
            <GraduationCap className="w-4 h-4 mr-2.5 text-primary shrink-0" /> {/* Increased icon size and margin */}
            <p className="text-foreground/80 text-xs line-clamp-1">{tutor.grade}</p>
          </div>
        )}

        <div className="flex items-center pt-1.5">
          <Award className="w-4 h-4 mr-2.5 text-primary shrink-0" /> {/* Increased icon size and margin */}
          <p className="text-foreground/80 text-xs line-clamp-1">{tutor.experience}</p>
        </div>
      </CardContent>
      {tutor.hourlyRate && (
        <CardFooter className="p-3 pt-2 border-t">
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
