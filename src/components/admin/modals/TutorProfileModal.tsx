
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
  UserPlus,
  Bookmark,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";

interface TutorProfileModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tutor: ApiTutor | null;
  enquiryId: string;
  sourceTab?: string;
}

const assignTutorToEnquiry = async ({
  enquiryId,
  tutorId,
  status,
  token,
}: {
  enquiryId: string;
  tutorId: string;
  status: "SHORTLISTED" | "ASSIGNED";
  token: string | null;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  if (!enquiryId) throw new Error("Enquiry ID is missing.");
  if (!tutorId) throw new Error("Tutor ID is missing.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/manage/enquiry/assign/${status}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'TZ-ENQ-ID': enquiryId,
      'TZ-TUTOR-ID': tutorId,
      'accept': '*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to ${status.toLowerCase()} tutor.`);
  }
  // The API returns only a status, so we return true on success.
  return true;
};


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

const InfoItem = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children?: React.ReactNode }) => {
  if (!children) return null;
  return (
    <div className="flex items-start">
      <Icon className="w-3.5 h-3.5 mr-2 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{label}</span>
        <div className="text-muted-foreground">{children}</div>
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

export function TutorProfileModal({ isOpen, onOpenChange, tutor, enquiryId, sourceTab = "recommended" }: TutorProfileModalProps) {
  const { token } = useAuthMock();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const shortlistMutation = useMutation({
    mutationFn: (tutorId: string) => assignTutorToEnquiry({ enquiryId, tutorId, status: "SHORTLISTED", token }),
    onSuccess: () => {
      toast({
        title: "Tutor Shortlisted",
        description: `${tutor?.displayName} has been added to the shortlist for this enquiry.`,
      });
      queryClient.invalidateQueries({ queryKey: ['enquiryTutors', enquiryId] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Shortlist Failed",
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
  
  const assignMutation = useMutation({
    mutationFn: (tutorId: string) => assignTutorToEnquiry({ enquiryId, tutorId, status: "ASSIGNED", token }),
    onSuccess: () => {
      toast({
        title: "Tutor Assigned",
        description: `${tutor?.displayName} has been assigned to this enquiry.`,
      });
      queryClient.invalidateQueries({ queryKey: ['enquiryTutors', enquiryId] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  const handleShortlistTutor = () => {
    if (tutor) {
      shortlistMutation.mutate(tutor.id);
    }
  };
  
  const handleAssignTutor = () => {
    if (tutor) {
      assignMutation.mutate(tutor.id);
    }
  };


  if (!tutor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 bg-white">
        <DialogHeader className="p-6 pb-4 border-b relative">
            {/* Wrapper for all content except the absolute close button */}
            <div className="pr-8"> 
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-grow min-w-0">
                        <Avatar className="h-16 w-16 border-2 border-primary/20">
                            <AvatarImage src={tutor.profilePicUrl} alt={tutor.displayName} />
                            <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                                {getInitials(tutor.displayName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
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
                    <div className="w-full sm:w-auto flex-shrink-0">
                        {sourceTab === "recommended" || sourceTab === "applied" ? (
                        <Button size="sm" className="w-full sm:w-auto" onClick={handleShortlistTutor} disabled={shortlistMutation.isPending}>
                           {shortlistMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Bookmark className="w-4 h-4 mr-2"/>}
                           {shortlistMutation.isPending ? "Shortlisting..." : "Shortlist Tutor"}
                        </Button>
                        ) : sourceTab === 'shortlisted' ? (
                        <Button size="sm" className="w-full sm:w-auto" onClick={handleAssignTutor} disabled={assignMutation.isPending}>
                            {assignMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <UserPlus className="w-4 h-4 mr-2"/>}
                            {assignMutation.isPending ? "Assigning..." : "Assign Tutor"}
                        </Button>
                        ): null}
                    </div>
                </div>
            </div>
             {/* The close button remains absolutely positioned but the content above has padding to avoid it */}
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          <InfoSection title="About">
            <p className="text-sm text-foreground/80 leading-relaxed">{tutor.bio || "No biography provided."}</p>
          </InfoSection>

          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoSection title="Contact & Personal">
              <InfoItem icon={Mail} label="Email">{tutor.email}</InfoItem>
              <InfoItem icon={Phone} label="Phone">{tutor.countryCode ? `${tutor.countryCode} ${tutor.phone}` : tutor.phone}</InfoItem>
              <InfoItem icon={Languages} label="Languages">{tutor.languagesList?.join(', ')}</InfoItem>
            </InfoSection>

            <InfoSection title="Tutoring Details">
              <InfoItem icon={DollarSign} label="Hourly Rate">{`₹${tutor.hourlyRate} ${tutor.isRateNegotiable ? '(Negotiable)' : ''}`}</InfoItem>
              <InfoItem icon={GraduationCap} label="Qualifications">{tutor.qualificationList?.join(', ')}</InfoItem>
              <InfoItem icon={Briefcase} label="Experience">{tutor.experienceYears}</InfoItem>
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
                    <InfoItem icon={MapPin} label="Address">
                      {tutor.googleMapsLink ? (
                        <a href={tutor.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {tutor.addressName || tutor.address}
                        </a>
                      ) : (
                        <span>{tutor.addressName || tutor.address || "Not specified"}</span>
                      )}
                      {(tutor.addressName && tutor.address && tutor.addressName !== tutor.address) && (
                        <div className="text-xs text-muted-foreground mt-1">{tutor.address}</div>
                      )}
                    </InfoItem>
                  )}
              </InfoSection>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
