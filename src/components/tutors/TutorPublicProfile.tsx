// src/components/tutors/TutorPublicProfile.tsx
"use client";

import type { TutorProfile } from "@/types";
import Image from "next/image";
import React from "react"; // Added React import
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
  Quote,
  UserX,
  CalendarClock,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format }
from 'date-fns';
import { FixedPostRequirementBanner } from "@/components/shared/FixedPostRequirementBanner";


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
  { id: "r1", reviewer: "Alice P.", rating: 5, comment: "Amazing tutor! My son's grades improved significantly.", date: new Date().toISOString() },
  { id: "r2", reviewer: "Bob L.", rating: 4, comment: "Very knowledgeable and patient. Highly recommend.", date: new Date(Date.now() - 86400000 * 15).toISOString() }, // 15 days ago
];


export function TutorPublicProfile({ tutor }: TutorPublicProfileProps) {
  const teachingModeText = Array.isArray(tutor.teachingMode) ? tutor.teachingMode.join(' & ') : tutor.teachingMode;
  const rating = tutor.rating || 4.5; // Mock rating or use actual if available

  const TeachingModeIcon = 
    Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("Online") && (tutor.teachingMode.includes("In-person") || tutor.teachingMode.includes("Offline (In-person)"))
      ? Laptop // Hybrid (using Laptop for now, could be specific hybrid icon)
      : Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("Online")
      ? Laptop
      : Array.isArray(tutor.teachingMode) && (tutor.teachingMode.includes("In-person") || tutor.teachingMode.includes("Offline (In-person)"))
      ? Users
      : Laptop; // Default


  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 ease-out pb-28 md:pb-24"> {/* Added padding-bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column */}
        <aside className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden shadow-lg border border-border/30 rounded-xl bg-card">
            <CardContent className="pt-6 text-center">
              <Avatar className="w-28 h-28 border-4 border-card shadow-md ring-2 ring-primary/40 mx-auto">
                <AvatarImage src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/200`} alt={tutor.name} />
                <AvatarFallback className="text-3xl bg-primary/20 text-primary font-semibold">
                  {tutor.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-lg font-semibold text-foreground tracking-tight mt-4">{tutor.name}</h1>
              <p className="text-xs text-muted-foreground mt-1">{tutor.role === "tutor" ? "Professional Tutor" : tutor.role}</p>
              
              <div className="flex items-center justify-center mt-2.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-3 h-3 ${index < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
                  />
                ))}
                <span className="ml-1.5 text-[10px] text-muted-foreground">({rating.toFixed(1)} stars)</span>
              </div>

              {tutor.hourlyRate && (
                <Badge variant="secondary" className="mt-3 text-[13px] py-1 px-3 border-primary/30 bg-primary/10 text-primary font-semibold">
                   ₹{tutor.hourlyRate} / hr
                </Badge>
              )}
            </CardContent>
            <div className="p-4 border-t">
              <Button
                variant="outline"
                className={cn(
                  "w-full transform transition-transform hover:scale-105 active:scale-95",
                  "py-3", 
                  "bg-primary border-primary text-primary-foreground", 
                  "hover:bg-primary/90", 
                  "font-semibold text-[15px]" 
                )}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> Book a Session
              </Button>
            </div>
          </Card>
        </aside>

        {/* Right Column */}
        <main className="lg:col-span-2 space-y-6">
           <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-primary flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-2"/> Expertise & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <InfoSection icon={BookOpen} title="Subjects Taught">
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {tutor.subjects.map((subject) => {
                    const IconComponent = subjectIcons[subject] || subjectIcons.Default;
                    return (
                      <Badge key={subject} variant="outline" className="py-0.5 px-2 text-[11px] border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                        <IconComponent className="w-2.5 h-2.5 mr-1"/>
                        {subject}
                      </Badge>
                    );
                  })}
                </div>
              </InfoSection>
              {tutor.grade && <InfoSection icon={GraduationCap} title="Grade Levels" content={tutor.grade} className="text-[13px]" />}
              {tutor.experience && <InfoSection icon={Award} title="Experience" content={tutor.experience} className="text-[13px]" />}
              {tutor.qualifications && <InfoSection icon={Briefcase} title="Qualifications" content={Array.isArray(tutor.qualifications) ? tutor.qualifications.join(', ') : tutor.qualifications} className="text-[13px]" />}
              {tutor.teachingMode && (
                <InfoSection icon={TeachingModeIcon} title="Teaching Mode" content={teachingModeText} className="text-[13px]" />
              )}
               {tutor.location && <InfoSection icon={MapPin} title="Primary Location" content={tutor.location} className="text-[13px]" />}
               {tutor.preferredDays && tutor.preferredDays.length > 0 && <InfoSection icon={CalendarClock} title="Availability (Days)" content={tutor.preferredDays.join(', ')} className="text-[13px]" />}
               {tutor.preferredTimeSlots && tutor.preferredTimeSlots.length > 0 && <InfoSection icon={Clock} title="Availability (Time)" content={tutor.preferredTimeSlots.join(', ')} className="text-[13px]" />}
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-primary flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-2"/> About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-line">{tutor.bio || "No biography provided."}</p>
              </CardContent>
            </Card>
          
           <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
             <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-primary flex items-center">
                  <Quote className="w-3.5 h-3.5 mr-2"/> Student Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockReviews.length > 0 ? mockReviews.map((review, index) => (
                    <React.Fragment key={review.id}>
                        <div className="p-0">
                            <div className="flex items-start justify-between mb-1">
                               <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2.5 border-primary/20 border">
                                        <AvatarImage src={`https://avatar.vercel.sh/${review.reviewer.replace(/\s+/g, '')}.png?s=32`} alt={review.reviewer} />
                                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                            {review.reviewer.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">{review.reviewer}</p>
                                        <p className="text-[10px] text-muted-foreground flex items-center"><CalendarClock size={10} className="mr-1"/>{format(new Date(review.date), "PP")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-0.5 mt-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}/>
                                    ))}
                                </div>
                            </div>
                            <p className="text-[13px] text-foreground/80 leading-normal pl-10">{review.comment}</p>
                        </div>
                        {index < mockReviews.length - 1 && <Separator className="my-3" />}
                    </React.Fragment>
                )) : (
                    <p className="text-xs text-muted-foreground text-center py-3">No reviews yet for {tutor.name}.</p>
                )}
              </CardContent>
          </Card>

        </main>
      </div>
      <FixedPostRequirementBanner />
    </div>
  );
}

interface InfoSectionProps {
    icon: React.ElementType;
    title: string;
    content?: string;
    children?: React.ReactNode;
    className?: string;
}

function InfoSection({ icon: Icon, title, content, children, className }: InfoSectionProps) {
    return (
        <div className="space-y-0.5">
            <div className="flex items-center text-xs font-medium text-foreground/90">
                <Icon className="w-3 h-3 mr-1.5 text-primary/80"/>
                {title}
            </div>
            {content && <p className={cn("text-[13px] text-foreground/70 pl-[18px]", className)}>{content}</p>}
            {children && <div className={cn("text-[13px] pl-[18px]", className)}>{children}</div>}
        </div>
    )
}



