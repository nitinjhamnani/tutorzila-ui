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
    ? Laptop // Or some hybrid icon
    : tutor.teachingMode && tutor.teachingMode.includes("Online") 
    ? Laptop 
    : tutor.teachingMode && tutor.teachingMode.includes("In-person") 
    ? Users 
    : Laptop; // Default or placeholder icon

  const teachingModeText = tutor.teachingMode && tutor.teachingMode.length > 0 
    ? tutor.teachingMode.join(' & ') 
    : "Not specified";

  return (
    <Card className="group bg-card border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col w-full overflow-hidden relative transform hover:-translate-y-1">
      <Link href={`/tutors/${tutor.id}`} passHref legacyBehavior>
        <a className="absolute inset-0 z-0" aria-label={`View profile of ${tutor.name}`}></a>
      </Link>
      <CardHeader className="items-center text-center p-4 pb-2 relative z-10 bg-gradient-to-b from-muted/30 via-card to-card rounded-t-xl">
        <Avatar className="w-16 h-16 border-2 border-card shadow-sm ring-1 ring-primary/30"> {/* Reduced avatar size */}
          <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/128`} alt={tutor.name} />
          <AvatarFallback className="text-lg bg-primary/20 text-primary font-medium"> {/* Adjusted fallback text size */}
            {tutor.name.split(" ").map(n => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-base font-semibold mt-1.5 truncate w-full px-1 text-foreground">{tutor.name}</CardTitle> {/* Reduced title font size & margin */}
        
        {tutor.status && (
          <Badge
            variant={tutor.status === "Active" ? "default" : "destructive"}
            className="text-[9px] py-0.5 px-1.5 mt-0.5 leading-tight" // Adjusted badge size
          >
            {tutor.status === "Active" ? <CheckCircle className="mr-0.5 h-2 w-2" /> : <XCircle className="mr-0.5 h-2 w-2" />} {/* Adjusted icon size */}
            {tutor.status}
          </Badge>
        )}

        <div className="flex items-center text-[10px] text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">
          <TeachingModeIcon className="w-2.5 h-2.5 mr-1" /> {/* Adjusted icon size */}
          <span>{teachingModeText}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-[11px] p-3 pt-1.5 relative z-10 flex-grow"> {/* Reduced padding and spacing */}
        
        <div className="flex items-center">
          <BookOpen className="w-3 h-3 mr-1.5 text-primary/70 shrink-0 group-hover:text-primary transition-colors" /> {/* Adjusted icon size */}
          <p className="text-foreground/70 text-[10px] line-clamp-1"> {/* Adjusted text size */}
            {tutor.subjects.join(", ")}
          </p>
        </div>

        {tutor.grade && (
          <div className="flex items-center">
            <GraduationCap className="w-3 h-3 mr-1.5 text-primary/70 shrink-0 group-hover:text-primary transition-colors" />
            <p className="text-foreground/70 text-[10px] line-clamp-1">{tutor.grade}</p>
          </div>
        )}

        {tutor.experience && (
          <div className="flex items-center">
            <Award className="w-3 h-3 mr-1.5 text-primary/70 shrink-0 group-hover:text-primary transition-colors" />
            <p className="text-foreground/70 text-[10px] line-clamp-1">{tutor.experience}</p>
          </div>
        )}
         {tutor.location && tutor.teachingMode && tutor.teachingMode.includes("In-person") && (
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1.5 text-primary/70 shrink-0 group-hover:text-primary transition-colors" />
            <p className="text-foreground/70 text-[10px] line-clamp-1">{tutor.location}</p>
          </div>
        )}
      </CardContent>
      {(tutor.hourlyRate || rating > 0) && (
        <CardFooter className="p-2.5 pt-1.5 border-t bg-muted/20 relative z-10"> {/* Reduced padding */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-3 h-3 ${index < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/40'}`} // Adjusted icon size
                />
              ))}
               <span className="ml-1 text-[9px] text-muted-foreground">({rating}.0)</span> {/* Adjusted text size */}
            </div>
            {tutor.hourlyRate && (
              <div className="text-[11px] font-semibold text-primary"> {/* Adjusted text size */}
                <span>₹{tutor.hourlyRate}/hr</span>
              </div>
            )}
          </div>
        </CardFooter>
      )}
       <Button
        asChild
        variant="ghost"
        size="icon"
        className="absolute top-1.5 right-1.5 z-20 h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" // Adjusted size
        onClick={(e) => e.stopPropagation()} 
      >
        <Link href={`/tutors/${tutor.id}`} aria-label={`View profile of ${tutor.name}`}>
          <Eye className="h-3.5 w-3.5" /> {/* Adjusted icon size */}
        </Link>
      </Button>
    </Card>
  );
}
