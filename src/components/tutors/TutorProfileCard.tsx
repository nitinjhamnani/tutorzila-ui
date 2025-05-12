
"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, GraduationCap, Award, Star, Laptop, Users, CheckCircle, XCircle, Eye, MapPin } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";
import Link from "next/link"; 
import { Button } from "@/components/ui/button"; 
import { cn } from "@/lib/utils";

interface TutorProfileCardProps {
  tutor: TutorProfile;
}

export function TutorProfileCard({ tutor }: TutorProfileCardProps) {
  const rating = 4; // Mock rating, replace with actual data

  const TeachingModeIcon = tutor.teachingMode && tutor.teachingMode.includes("Online") && tutor.teachingMode.includes("In-person") 
    ? Laptop 
    : tutor.teachingMode && tutor.teachingMode.includes("Online") 
    ? Laptop 
    : tutor.teachingMode && tutor.teachingMode.includes("In-person") 
    ? Users 
    : Laptop; 

  const teachingModeText = tutor.teachingMode && tutor.teachingMode.length > 0 
    ? tutor.teachingMode.join(' & ') 
    : "Not specified";

  return (
    <Card className="group bg-card border border-border/40 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full overflow-hidden relative transform hover:-translate-y-0.5">
      <Link href={`/tutors/${tutor.id}`} passHref legacyBehavior>
        <a className="absolute inset-0 z-0" aria-label={`View profile of ${tutor.name}`}></a>
      </Link>
      <div className="flex items-start p-3 space-x-3"> {/* Reduced padding, using flex for horizontal layout */}
        <Avatar className="w-14 h-14 border-2 border-primary/30 shadow-sm shrink-0"> {/* Reduced avatar size */}
          <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/100`} alt={tutor.name} />
          <AvatarFallback className="text-base bg-primary/10 text-primary font-medium"> {/* Adjusted fallback text size */}
            {tutor.name.split(" ").map(n => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-grow min-w-0">
          <CardTitle className="text-sm font-semibold mt-0 truncate w-full text-foreground group-hover:text-primary transition-colors">{tutor.name}</CardTitle> {/* Reduced title font size & margin */}
          
          <div className="flex items-center text-[10px] text-muted-foreground mt-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`w-2.5 h-2.5 ${index < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/30'}`}
              />
            ))}
            <span className="ml-1">({rating}.0)</span>
          </div>

          {tutor.subjects && tutor.subjects.length > 0 && (
            <div className="flex items-center mt-1 text-[10px]">
              <BookOpen className="w-2.5 h-2.5 mr-1 text-primary/70 shrink-0 group-hover:text-primary transition-colors" />
              <p className="text-foreground/70 line-clamp-1">
                {tutor.subjects.join(", ")}
              </p>
            </div>
          )}

          {tutor.location && (
             <div className="flex items-center mt-1 text-[10px]">
              <MapPin className="w-2.5 h-2.5 mr-1 text-primary/70 shrink-0 group-hover:text-primary transition-colors" />
              <p className="text-foreground/70 line-clamp-1">{tutor.location}</p>
            </div>
          )}

        </div>
        {tutor.hourlyRate && (
          <div className="text-xs font-semibold text-primary self-start pt-0.5"> {/* Adjusted text size and alignment */}
            <span>₹{tutor.hourlyRate}/hr</span>
          </div>
        )}
      </div>
      
       <Button
        asChild
        variant="ghost"
        size="icon"
        className="absolute top-1.5 right-1.5 z-20 h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" // Adjusted size
        onClick={(e) => e.stopPropagation()} 
      >
        <Link href={`/tutors/${tutor.id}`} aria-label={`View profile of ${tutor.name}`}>
          <Eye className="h-3 w-3" /> {/* Adjusted icon size */}
        </Link>
      </Button>
    </Card>
  );
}

