// src/components/tutors/TutorPublicProfile.tsx
"use client";

import type { TutorProfile } from "@/types";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  BookOpen,
  GraduationCap,
  Star,
  MessageSquare,
  Award,
  CheckCircle,
  Brain,
  Palette,
  Users,
  Atom,
  Code,
  Globe,
  Music,
  Calculator,
  Lightbulb,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Laptop,
  UserCheck,
  Sparkles,
  Quote
} from "lucide-react";
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
  Default: BookOpen,
};

const mockReviews = [
  { id: "r1", reviewer: "Alice P.", rating: 5, comment: "Amazing tutor! My son's grades improved significantly.", date: "2024-04-15" },
  { id: "r2", reviewer: "Bob L.", rating: 4, comment: "Very knowledgeable and patient. Highly recommend.", date: "2024-03-20" },
];

export function TutorPublicProfile({ tutor }: TutorPublicProfileProps) {
  const teachingModeText = tutor.teachingMode === "Hybrid" ? "Online & In-person" : tutor.teachingMode;
  const rating = 4.5; // Mock rating

  const TeachingModeIcon = tutor.teachingMode === "Online" ? Laptop : tutor.teachingMode === "In-person" ? Users : Laptop;


  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 ease-out">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column */}
        <aside className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden shadow-lg border border-border/30 rounded-xl bg-card">
            <CardHeader className="p-0 relative">
              <div className="h-24 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                <Avatar className="w-28 h-28 border-4 border-card shadow-md ring-2 ring-primary/40">
                  <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/200`} alt={tutor.name} />
                  <AvatarFallback className="text-3xl bg-primary/20 text-primary font-semibold">
                    {tutor.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="pt-16 text-center">
              <h1 className="text-xl font-bold text-foreground tracking-tight">{tutor.name}</h1>
              <p className="text-xs text-muted-foreground mt-1">{tutor.role === "tutor" ? "Professional Tutor" : tutor.role}</p>
              
              <div className="flex items-center justify-center mt-2.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-3.5 h-3.5 ${index < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
                  />
                ))}
                <span className="ml-1.5 text-[11px] text-muted-foreground">({rating} stars)</span>
              </div>

              {tutor.hourlyRate && (
                <Badge variant="secondary" className="mt-3 text-sm py-1 px-3 border-primary/30 bg-primary/10 text-primary font-semibold">
                   ₹{tutor.hourlyRate} / hr
                </Badge>
              )}
            </CardContent>
            <div className="p-4 border-t">
              <Button size="md" className="w-full shadow-md hover:shadow-lg transform transition-transform hover:scale-105 active:scale-95 text-sm">
                <MessageSquare className="mr-2 h-4 w-4" /> Contact {tutor.name.split(" ")[0]}
              </Button>
            </div>
          </Card>
          
          <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary flex items-center">
                <UserCheck className="w-5 h-5 mr-2.5"/> Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
                <div className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2 text-muted-foreground"/>
                    <span className="text-foreground/80">Email:</span>
                    {tutor.isEmailVerified ? 
                        <Badge variant="default" className="ml-auto bg-green-500 hover:bg-green-600 text-white text-[10px] px-1.5 py-0.5"><CheckCircle className="w-3 h-3 mr-1"/>Verified</Badge> :
                        <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0.5">Not Verified</Badge>
                    }
                </div>
                 <div className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-2 text-muted-foreground"/>
                    <span className="text-foreground/80">Phone:</span>
                     {tutor.isPhoneVerified ? 
                        <Badge variant="default" className="ml-auto bg-green-500 hover:bg-green-600 text-white text-[10px] px-1.5 py-0.5"><CheckCircle className="w-3 h-3 mr-1"/>Verified</Badge> :
                        <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0.5">Not Verified</Badge>
                    }
                </div>
            </CardContent>
          </Card>

        </aside>

        {/* Right Column */}
        <main className="lg:col-span-2 space-y-6">
          {tutor.bio && (
            <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary flex items-center">
                  <Sparkles className="w-5 h-5 mr-2.5"/> About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{tutor.bio}</p>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary flex items-center">
                <Briefcase className="w-5 h-5 mr-2.5"/> Expertise & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InfoSection icon={BookOpen} title="Subjects Taught">
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {tutor.subjects.map((subject) => {
                    const IconComponent = subjectIcons[subject] || subjectIcons.Default;
                    return (
                      <Badge key={subject} variant="outline" className="py-0.5 px-2 text-xs border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                        <IconComponent className="w-3 h-3 mr-1"/>
                        {subject}
                      </Badge>
                    );
                  })}
                </div>
              </InfoSection>
              {tutor.grade && <InfoSection icon={GraduationCap} title="Grade Levels" content={tutor.grade} />}
              {tutor.experience && <InfoSection icon={Award} title="Experience" content={tutor.experience} />}
              {tutor.qualifications && <InfoSection icon={Briefcase} title="Qualifications" content={tutor.qualifications}/>}
              {tutor.teachingMode && (
                <InfoSection icon={TeachingModeIcon} title="Teaching Mode" content={teachingModeText} />
              )}
               {tutor.location && <InfoSection icon={MapPin} title="Primary Location" content={tutor.location} />}
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
             <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary flex items-center">
                  <Quote className="w-5 h-5 mr-2.5"/> Student Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockReviews.length > 0 ? mockReviews.map(review => (
                    <div key={review.id} className="p-3 border rounded-lg bg-background/50">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold text-foreground">{review.reviewer}</p>
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}/>
                                ))}
                            </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground mb-1.5">{new Date(review.date).toLocaleDateString()}</p>
                        <p className="text-xs text-foreground/80 leading-normal">{review.comment}</p>
                    </div>
                )) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No reviews yet for {tutor.name}.</p>
                )}
              </CardContent>
          </Card>

        </main>
      </div>
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
        <div className="space-y-1">
            <div className="flex items-center text-sm font-medium text-foreground/90">
                <Icon className="w-4 h-4 mr-2 text-primary/80"/>
                {title}
            </div>
            {content && <p className="text-xs text-foreground/70 pl-[24px]">{content}</p>}
            {children && <div className="pl-[24px]">{children}</div>}
        </div>
    )
}
