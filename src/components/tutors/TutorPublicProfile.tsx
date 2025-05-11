
"use client";

import type { TutorProfile } from "@/types";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Briefcase, BookOpen, GraduationCap, Star, MessageSquare, Award, CheckCircle, Brain, Palette, Users, Atom, Code, Globe, Music, Calculator, Lightbulb } from "lucide-react"; // Added more icons
import { cn } from "@/lib/utils";

interface TutorPublicProfileProps {
  tutor: TutorProfile;
}

const subjectIcons: { [key: string]: React.ElementType } = {
  Mathematics: Calculator,
  Science: Atom,
  English: BookOpen,
  Coding: Code,
  History: Globe,
  Art: Palette,
  Music: Music,
  Physics: Lightbulb,
  Chemistry: Atom,
  Biology: Brain,
  "Computer Science": Code,
  Spanish: Globe,
  French: Globe,
  "English Literature": BookOpen,
  "Creative Writing": BookOpen,
  "Web Development": Code,
  // Add more as needed
  Default: BookOpen,
};


export function TutorPublicProfile({ tutor }: TutorPublicProfileProps) {
  const teachingModeText = tutor.teachingMode === "Hybrid" ? "Online & In-person" : tutor.teachingMode;
  const rating = 4.5; // Mock rating

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="overflow-hidden shadow-xl border border-primary/20 rounded-2xl bg-card">
        <CardHeader className="p-0 relative">
           {/* Removed the cover image div */}
           {/* <div className="h-48 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 relative">
             <Image 
                src={`https://picsum.photos/seed/${tutor.id}bg/1200/300`} 
                alt={`${tutor.name}'s cover photo`} 
                layout="fill" 
                objectFit="cover" 
                className="opacity-50"
                data-ai-hint="abstract background"
              />
           </div> */}
           {/* Added a placeholder div to maintain some header height for avatar positioning if CardHeader is otherwise empty */}
           <div className="h-20 bg-muted/20"></div> 
           <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-card shadow-lg ring-2 ring-primary/50">
              <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/200`} alt={tutor.name} />
              <AvatarFallback className="text-3xl md:text-4xl bg-primary/20 text-primary font-semibold">
                {tutor.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
           </div>
        </CardHeader>

        <CardContent className="pt-20 md:pt-24 px-6 md:px-8 pb-6 md:pb-8"> {/* Adjusted pt slightly */}
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary tracking-tight">{tutor.name}</CardTitle>
              <CardDescription className="text-sm text-foreground/70 mt-1"> {/* Reduced from text-md */}
                Professional {tutor.role}
                {tutor.teachingMode && ` | ${teachingModeText}`}
              </CardDescription>
              <div className="flex items-center mt-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${index < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/50"}`} // Reduced star size
                  />
                ))}
                <span className="ml-2 text-xs text-muted-foreground">({rating} stars based on mock reviews)</span> {/* Reduced from text-sm */}
              </div>
            </div>
             <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end space-y-2">
                {tutor.hourlyRate && (
                    <Badge variant="secondary" className="text-base py-1.5 px-3 border-primary/30 bg-primary/5 text-primary font-semibold"> {/* Reduced from text-lg */}
                        ₹{tutor.hourlyRate} / hr
                    </Badge>
                )}
                 {tutor.status === "Active" && (
                    <Badge variant="default" className="text-xs py-1 px-2.5 bg-green-500 hover:bg-green-600 text-white">
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5"/> Available for Tutoring
                    </Badge>
                )}
            </div>
          </div>
          
          <Separator className="my-5 md:my-6" /> {/* Reduced margin */}

          {tutor.bio && (
            <section className="mb-5"> {/* Reduced margin */}
              <h3 className="text-lg font-semibold text-primary mb-1.5">About Me</h3> {/* Reduced from text-xl, mb-2 to mb-1.5 */}
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{tutor.bio}</p> {/* Explicitly text-sm */}
            </section>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"> {/* Reduced gap */}
            <InfoSection icon={BookOpen} title="Subjects Taught">
                <div className="flex flex-wrap gap-1.5 mt-1"> {/* Reduced gap */}
                {tutor.subjects.map((subject) => {
                    const IconComponent = subjectIcons[subject] || subjectIcons.Default;
                    return (
                    <Badge key={subject} variant="outline" className="py-0.5 px-2 text-xs border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"> {/* Reduced from text-sm */}
                        <IconComponent className="w-3.5 h-3.5 mr-1"/> {/* Reduced icon size and margin */}
                        {subject}
                    </Badge>
                    );
                })}
                </div>
            </InfoSection>

            {tutor.grade && (
              <InfoSection icon={GraduationCap} title="Grade Levels" content={tutor.grade} />
            )}

            {tutor.experience && (
              <InfoSection icon={Award} title="Experience" content={tutor.experience} />
            )}
            
            {tutor.qualifications && (
                <InfoSection icon={Briefcase} title="Qualifications" content={tutor.qualifications}/>
            )}
          </div>
          
        </CardContent>
        <CardFooter className="bg-muted/20 p-5 md:p-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3"> {/* Reduced padding and gap */}
          <p className="text-xs text-muted-foreground"> {/* Reduced from text-sm */}
            Interested in learning from {tutor.name}?
          </p>
          <Button size="md" className="w-full sm:w-auto shadow-md hover:shadow-lg transform transition-transform hover:scale-105 active:scale-95 text-sm"> {/* Reduced from size="lg", icon size adjusted by button's default svg sizing */}
            <MessageSquare className="mr-2 h-4 w-4" /> Contact {tutor.name.split(" ")[0]}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


interface InfoSectionProps {
    icon: React.ElementType;
    title: string;
    content?: string;
    children?: React.ReactNode;
}

function InfoSection({ icon: Icon, title, content, children }: InfoSectionProps) {
    return (
        <div className="space-y-1"> {/* Reduced space-y */}
            <div className="flex items-center text-sm font-medium text-foreground/90"> {/* Reduced from text-md */}
                <Icon className="w-4 h-4 mr-2 text-primary/80"/> {/* Reduced from w-5 h-5, mr-2.5 */}
                {title}
            </div>
            {content && <p className="text-xs text-foreground/70 pl-[28px]">{content}</p>} {/* Reduced from text-sm, pl-[34px] */}
            {children && <div className="pl-[28px]">{children}</div>} {/* Reduced pl */}
        </div>
    )
}

