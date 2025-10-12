
"use client";

import type { TutorProfile } from "@/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Award,
  Laptop,
  Users as UsersIcon,
  MapPin,
  CalendarDays,
  Clock,
  Languages,
  DollarSign,
  RadioTower,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface TutorPublicProfileProps {
  tutor: TutorProfile;
}

const getInitials = (name?: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2);
};

const InfoSection = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-sm font-semibold text-primary mb-2 flex items-center">
      <Icon className="w-4 h-4 mr-2"/>
      {title}
    </h4>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
);

const InfoItem = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children?: React.ReactNode }) => {
  if (!children && typeof children !== 'number') return null;
  return (
    <div className="flex items-start">
      <Icon className="w-4 h-4 mr-2.5 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">{label}</span>
        </div>
        <div className="text-muted-foreground text-xs">{children}</div>
      </div>
    </div>
  );
};

const InfoBadgeList = ({ icon: Icon, label, items }: { icon: React.ElementType; label: string; items: string[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex items-start">
       <Icon className="w-4 h-4 mr-2.5 mt-1 text-muted-foreground shrink-0" />
      <div className="flex flex-col">
        <span className="font-medium text-foreground mb-1">{label}</span>
        <div className="flex flex-wrap gap-1">
          {items.map(item => <Badge key={item} variant="secondary" className="font-normal">{item}</Badge>)}
        </div>
      </div>
    </div>
  );
};


export function TutorPublicProfile({ tutor }: TutorPublicProfileProps) {
    const teachingModeText = Array.isArray(tutor.teachingMode) ? tutor.teachingMode.join(' & ') : tutor.teachingMode;

    const TeachingModeIcon =
      Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("Online") && (tutor.teachingMode.includes("In-person") || tutor.teachingMode.includes("Offline (In-person)"))
        ? Laptop
        : Array.isArray(tutor.teachingMode) && tutor.teachingMode.includes("Online")
        ? Laptop
        : Array.isArray(tutor.teachingMode) && (tutor.teachingMode.includes("In-person") || tutor.teachingMode.includes("Offline (In-person)"))
        ? UsersIcon
        : Laptop;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column */}
        <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-[calc(var(--header-height,0px)+1.5rem)] lg:self-start">
          <Card className="overflow-hidden shadow-lg border border-border/30 rounded-xl bg-card">
            <CardContent className="pt-6 text-center">
              <Avatar className="w-28 h-28 border-4 border-card shadow-md ring-2 ring-primary/40 mx-auto">
                <AvatarFallback className="text-3xl bg-primary/20 text-primary font-semibold">
                  {getInitials(tutor.name)}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-lg font-semibold text-foreground tracking-tight mt-4">{tutor.name}</h1>
              <p className="text-xs text-muted-foreground mt-1">{tutor.role === "tutor" ? "Professional Tutor" : tutor.role}</p>

              <Separator className="my-4" />
              <div className="text-left space-y-3">
                <InfoItem icon={Briefcase} label="Experience">{tutor.experience}</InfoItem>
                <InfoItem icon={DollarSign} label="Hourly Rate">{`₹${tutor.hourlyRate} ${tutor.isRateNegotiable ? '(Negotiable)' : ''}`}</InfoItem>
              </div>

            </CardContent>
            <div className="p-4 border-t">
              <Button className={cn("w-full py-2.5 font-semibold text-sm", "bg-primary text-primary-foreground hover:bg-primary/90")}>
                <MessageSquare className="mr-2 h-4 w-4" /> Book a Demo
              </Button>
            </div>
          </Card>
        </aside>

        {/* Right Column */}
        <main className="lg:col-span-2 space-y-6">
           <Card className="shadow-lg border border-border/30 rounded-xl bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-primary flex items-center">
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{tutor.bio || "No biography provided."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Tutoring Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <InfoBadgeList icon={BookOpen} label="Subjects" items={tutor.subjects}/>
                <InfoBadgeList icon={GraduationCap} label="Grades" items={tutor.gradeLevelsTaught}/>
                <InfoBadgeList icon={Award} label="Boards" items={tutor.boardsTaught}/>
                <InfoItem icon={TeachingModeIcon} label="Teaching Mode">{teachingModeText}</InfoItem>
                {tutor.location && <InfoItem icon={MapPin} label="Address">{tutor.location}</InfoItem>}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Other Details</CardTitle>
            </CardHeader>
             <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoBadgeList icon={GraduationCap} label="Qualifications" items={tutor.qualifications} />
                <InfoBadgeList icon={Languages} label="Languages" items={tutor.languages || []} />
                <InfoItem icon={Briefcase} label="Experience">{tutor.experience}</InfoItem>
                <InfoBadgeList icon={CalendarDays} label="Available Days" items={tutor.preferredDays}/>
                <InfoBadgeList icon={Clock} label="Available Times" items={tutor.preferredTimeSlots}/>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
