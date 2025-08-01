
"use client";

import type { ApiTutor } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Briefcase,
  DollarSign,
  Languages,
  Clock,
  CalendarDays,
  MapPin,
  CheckCircle,
  XCircle,
  RadioTower,
  Users as UsersIcon,
  ShieldCheck,
  ShieldAlert,
  Building,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TutorProfileModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutor: ApiTutor | null;
}

const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
};

const InfoSection = ({ title, children, className }: { title: string; children: React.ReactNode; className?:string }) => (
  <div className={className}>
    <h4 className="text-sm font-semibold text-primary mb-2">{title}</h4>
    <div className="space-y-2 text-xs">{children}</div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | number | React.ReactNode }) => {
  if (!value) return null;
  return (
    <div className="flex items-start">
      <Icon className="w-3.5 h-3.5 mr-2 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
    </div>
  );
};

const InfoBadgeList = ({ icon: Icon, label, items }: { icon: React.ElementType; label: string; items: string[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex items-start">
       <Icon className="w-3.5 h-3.5 mr-2 mt-1 text-muted-foreground shrink-0" />
      <div className="flex flex-col">
        <span className="font-medium text-foreground mb-1">{label}</span>
        <div className="flex flex-wrap gap-1">
          {items.map(item => <Badge key={item} variant="secondary" className="font-normal">{item}</Badge>)}
        </div>
      </div>
    </div>
  );
};

export function TutorProfileModal({ isOpen, onOpenChange, tutor }: TutorProfileModalProps) {
  if (!tutor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 bg-white">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={tutor.profilePicUrl} alt={tutor.displayName} />
                <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                    {getInitials(tutor.displayName)}
                </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-2xl font-bold text-foreground">{tutor.displayName}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">{tutor.gender}</DialogDescription>
                   <div className="mt-2 flex items-center gap-2">
                    <Badge variant={tutor.isActive ? "default" : "destructive"}>
                        {tutor.isActive ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                        {tutor.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant={tutor.isVerified ? "default" : "destructive"}>
                        {tutor.isVerified ? <ShieldCheck className="mr-1 h-3 w-3"/> : <ShieldAlert className="mr-1 h-3 w-3"/>}
                        {tutor.isVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </div>
                </div>
            </div>
            <Button size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">
                <UserPlus className="w-4 h-4 mr-2"/>
                Assign Tutor
            </Button>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          <InfoSection title="About">
            <p className="text-sm text-foreground/80 leading-relaxed">{tutor.bio || "No biography provided."}</p>
          </InfoSection>

          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoSection title="Contact & Personal">
              <InfoItem icon={Mail} label="Email" value={tutor.email} />
              <InfoItem icon={Phone} label="Phone" value={tutor.countryCode ? `${tutor.countryCode} ${tutor.phone}` : tutor.phone} />
              <InfoItem icon={Languages} label="Languages" value={tutor.languagesList?.join(', ')} />
            </InfoSection>

            <InfoSection title="Tutoring Details">
              <InfoItem icon={DollarSign} label="Hourly Rate" value={`₹${tutor.hourlyRate} ${tutor.isRateNegotiable ? '(Negotiable)' : ''}`} />
              <InfoItem icon={GraduationCap} label="Qualifications" value={tutor.qualificationList?.join(', ')} />
              <InfoItem icon={Briefcase} label="Experience" value={tutor.experienceYears} />
            </InfoSection>
          </div>
          
          <Separator />
          
          <InfoSection title="Specialization">
              <InfoBadgeList icon={BookOpen} label="Subjects" items={tutor.subjectsList}/>
              <InfoBadgeList icon={GraduationCap} label="Grades" items={tutor.gradesList}/>
              <InfoBadgeList icon={Building} label="Boards" items={tutor.boardsList}/>
          </InfoSection>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoSection title="Availability">
                 <InfoBadgeList icon={CalendarDays} label="Days" items={tutor.availabilityDaysList}/>
                 <InfoBadgeList icon={Clock} label="Time Slots" items={tutor.availabilityTimeList}/>
              </InfoSection>
              <InfoSection title="Location & Mode">
                 <div className="flex items-center gap-2">
                    {tutor.online && <Badge><RadioTower className="w-3 h-3 mr-1.5"/> Online</Badge>}
                    {tutor.offline && <Badge><UsersIcon className="w-3 h-3 mr-1.5"/> Offline</Badge>}
                    {tutor.isHybrid && <Badge>Hybrid</Badge>}
                 </div>
                 {tutor.offline && (
                    <InfoItem icon={MapPin} label="Address" value={
                        tutor.googleMapsLink ? (
                        <a href={tutor.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {tutor.addressName || tutor.address}
                        </a>
                        ) : (
                        <span>{tutor.addressName || tutor.address || "Not specified"}</span>
                        )
                    } />
                    )}
              </InfoSection>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
