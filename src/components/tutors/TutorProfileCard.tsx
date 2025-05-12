
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
  // Mock rating, replace with actual data if available, e.g. tutor.rating
  const rating = tutor.rating || 4.5; // Assuming a rating property or default

  const TeachingModeIcon = tutor.teachingMode && tutor.teachingMode.includes("Online") && tutor.teachingMode.includes("In-person") 
    ? Laptop // Or a specific icon for hybrid if available
    : tutor.teachingMode && tutor.teachingMode.includes("Online") 
    ? Laptop 
    : tutor.teachingMode && tutor.teachingMode.includes("In-person") 
    ? Users 
    : Laptop; // Default icon

  const teachingModeText = tutor.teachingMode && tutor.teachingMode.length > 0 
    ? tutor.teachingMode.join(' & ') 
    : "Not specified";

  return (
    <Card className={cn(
      "w-full h-44", // Fixed height for uniform card dimensions
      "flex flex-col p-3", // Internal padding
      "rounded-lg shadow-md hover:shadow-lg", // Subtle shadow, rounded corners
      "transition-all duration-300 bg-card border border-border/40",
      "transform hover:-translate-y-0.5 relative" // Hover effect
    )}>
      {/* Clickable overlay link for the entire card */}
      <Link href={`/tutors/${tutor.id}`} passHref legacyBehavior>
        <a className="absolute inset-0 z-0" aria-label={`View profile of ${tutor.name}`}></a>
      </Link>

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1"> {/* flex-1 to use available space, mt-auto for footer */}
        
        {/* Top section: Subject, Mode, Rating */}
        <div className="flex justify-between items-start mb-1.5">
          {/* Left part of top section: Subject and Mode */}
          <div className="min-w-0 pr-2"> {/* To allow truncation, pr-2 for spacing from rating */}
            {tutor.subjects && tutor.subjects.length > 0 && (
              <p className="text-xs font-bold text-foreground/90 truncate">
                {tutor.subjects.join(", ")}
              </p>
            )}
            <div className="flex items-center text-[11px] text-muted-foreground mt-0.5 truncate">
              <TeachingModeIcon className="w-3 h-3 mr-1 text-primary/70 shrink-0" />
              <span>{teachingModeText}</span>
            </div>
          </div>
          {/* Right part of top section: Rating */}
          <div className="flex items-center text-xs text-muted-foreground shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
            <span>{typeof rating === 'number' ? rating.toFixed(1) : 'N/A'}</span>
          </div>
        </div>

        {/* Middle section: Avatar, Name, Location */}
        <div className="flex items-center gap-2 my-1">
          <Avatar className="w-10 h-10 border-2 border-primary/30 shadow-sm shrink-0">
            <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/100`} alt={tutor.name} />
            <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">
              {tutor.name.split(" ").map(n => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {tutor.name}
            </CardTitle>
            {tutor.location && (
              <div className="flex items-center text-[11px] text-muted-foreground mt-0.5 truncate">
                <MapPin className="w-3 h-3 mr-1 text-primary/70 shrink-0" />
                <p>{tutor.location}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Spacer to push fee and button to bottom */}
        <div className="flex-grow"></div>

        {/* Bottom Section: Fee and View Button */}
        <div className="flex justify-between items-end">
          {tutor.hourlyRate && (
            <p className="text-xs font-semibold text-primary shrink-0">
              ₹{tutor.hourlyRate}/hr
            </p>
          )}
          <Button
            asChild
            variant="ghost" // Use ghost variant for icon button feel
            size="icon" // Makes it small and square-ish
            className="relative z-20 h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full" // Sizing and styling for the icon button
            onClick={(e) => e.stopPropagation()} // Prevent link navigation if button has its own action
          >
            <Link href={`/tutors/${tutor.id}`} aria-label={`View profile of ${tutor.name}`}>
              <Eye className="h-4 w-4" /> {/* Icon size */}
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
