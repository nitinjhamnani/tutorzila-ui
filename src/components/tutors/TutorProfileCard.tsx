
"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, GraduationCap, Award, Star, Laptop, Users, CheckCircle, XCircle, Eye } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";
import Link from "next/link"; 
import { Button } from "@/components/ui/button"; 
import { cn } from "@/lib/utils";

interface TutorProfileCardProps {
  tutor: TutorProfile;
}

export function TutorProfileCard({ tutor }: TutorProfileCardProps) {
  const rating = 4; 

  const TeachingModeIcon = tutor.teachingMode === "Online" ? Laptop : tutor.teachingMode === "In-person" ? Users : Laptop;

  return (
    <Card className="group bg-card border border-border/50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full min-h-[24rem] w-full max-w-sm mx-auto overflow-hidden relative transform hover:-translate-y-1">
      <Link href={`/tutors/${tutor.id}`} passHref legacyBehavior>
        <a className="absolute inset-0 z-0" aria-label={`View profile of ${tutor.name}`}></a>
      </Link>
      <CardHeader className="items-center text-center p-5 pb-4 relative z-10 bg-gradient-to-b from-muted/30 via-card to-card rounded-t-xl">
        <Avatar className="w-28 h-28 border-4 border-card shadow-md ring-2 ring-primary/50">
          <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/128`} alt={tutor.name} />
          <AvatarFallback className="text-2xl bg-primary/20 text-primary font-semibold">
            {tutor.name.split(" ").map(n => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg font-semibold mt-3.5 truncate w-full px-2 text-foreground">{tutor.name}</CardTitle>
        
        {tutor.status && (
          <Badge
            variant={tutor.status === "Active" ? "default" : "destructive"}
            className="text-[11px] py-0.5 px-2 mt-1.5"
          >
            {tutor.status === "Active" ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
            {tutor.status}
          </Badge>
        )}

        {tutor.teachingMode && (
          <div className="flex items-center text-[11px] text-muted-foreground mt-1.5 group-hover:text-primary transition-colors">
            <TeachingModeIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>{tutor.teachingMode}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3 text-xs flex-grow p-5 pt-3 relative z-10"> 
        
        <div className="flex items-center pt-1.5">
          <BookOpen className="w-4 h-4 mr-2.5 text-primary/80 shrink-0 group-hover:text-primary transition-colors" />
          <p className="text-foreground/80 text-[13px] line-clamp-1">
            {tutor.subjects.join(", ")}
          </p>
        </div>

        {tutor.grade && (
          <div className="flex items-center pt-1.5">
            <GraduationCap className="w-4 h-4 mr-2.5 text-primary/80 shrink-0 group-hover:text-primary transition-colors" />
            <p className="text-foreground/80 text-[13px] line-clamp-1">{tutor.grade}</p>
          </div>
        )}

        <div className="flex items-center pt-1.5">
          <Award className="w-4 h-4 mr-2.5 text-primary/80 shrink-0 group-hover:text-primary transition-colors" />
          <p className="text-foreground/80 text-[13px] line-clamp-1">{tutor.experience}</p>
        </div>
      </CardContent>
      {tutor.hourlyRate && (
        <CardFooter className="p-4 pt-3 border-t bg-muted/20 relative z-10">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${index < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/60'}`}
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
       <Button
        asChild
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-20 h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
        onClick={(e) => e.stopPropagation()} 
      >
        <Link href={`/tutors/${tutor.id}`} aria-label={`View profile of ${tutor.name}`}>
          <Eye className="h-4.5 w-4.5" />
        </Link>
      </Button>
    </Card>
  );
}
