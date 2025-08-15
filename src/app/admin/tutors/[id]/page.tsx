
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { ApiTutor } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Briefcase,
  BookOpen,
  GraduationCap,
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
  Mail,
  Phone,
  User,
  ArrowLeft,
  Loader2,
  FileText,
  Edit3,
  Star,
  Eye,
  Percent,
  Share2,
  MailCheck,
  PhoneCall,
  Unlock,
  VenetianMask,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ActivationModal } from "@/components/admin/modals/ActivationModal";
import { AdminUpdateTutorModal } from "@/components/admin/modals/AdminUpdateTutorModal";

const fetchTutorProfile = async (tutorId: string, token: string | null): Promise<ApiTutor> => {
    if (!token) throw new Error("Authentication token not found.");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(`${apiBaseUrl}/api/manage/tutor/${tutorId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch tutor profile.");
    }
    const data = await response.json();
    
    const { userDetails, tutoringDetails } = data;

    return {
      id: tutorId,
      // From userDetails
      displayName: userDetails.name,
      name: userDetails.name,
      email: userDetails.email,
      countryCode: userDetails.countryCode,
      phone: userDetails.phone,
      profilePicUrl: userDetails.profilePicUrl,
      emailVerified: userDetails.emailVerified,
      phoneVerified: userDetails.phoneVerified,
      whatsappEnabled: userDetails.whatsappEnabled,
      registeredDate: userDetails.registeredDate,
      createdBy: userDetails.createdBy,

      // From tutoringDetails
      subjectsList: tutoringDetails.subjects,
      gradesList: tutoringDetails.grades,
      boardsList: tutoringDetails.boards,
      qualificationList: tutoringDetails.qualifications,
      availabilityDaysList: tutoringDetails.availabilityDays,
      availabilityTimeList: tutoringDetails.availabilityTime,
      yearOfExperience: tutoringDetails.yearOfExperience,
      bio: tutoringDetails.tutorBio,
      addressName: tutoringDetails.addressName,
      address: tutoringDetails.address,
      city: tutoringDetails.city,
      state: tutoringDetails.state,
      area: tutoringDetails.area,
      pincode: tutoringDetails.pincode,
      country: tutoringDetails.country,
      googleMapsLink: tutoringDetails.googleMapsLink,
      hourlyRate: tutoringDetails.hourlyRate,
      languagesList: tutoringDetails.languages,
      profileCompletion: tutoringDetails.profileCompletion,
      isActive: tutoringDetails.active,
      isRateNegotiable: tutoringDetails.rateNegotiable,
      isBioReviewed: tutoringDetails.bioReviewed,
      online: tutoringDetails.online,
      offline: tutoringDetails.offline,
      isHybrid: tutoringDetails.hybrid,
      
      gender: userDetails.gender,
      isVerified: userDetails.emailVerified && userDetails.phoneVerified, // Derived isVerified
    } as ApiTutor;
};


const getInitials = (name?: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2);
};

const InfoSection = ({ icon: Icon, title, children, className }: { icon: React.ElementType; title: string; children: React.ReactNode; className?:string }) => (
  <div className={className}>
    <h4 className="text-sm font-semibold text-primary mb-2 flex items-center">
      <Icon className="w-4 h-4 mr-2"/>
      {title}
    </h4>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
);

const InfoItem = ({ icon: Icon, label, children, verificationBadge }: { icon: React.ElementType; label: string; children?: React.ReactNode, verificationBadge?: React.ReactNode }) => {
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
        <div className="flex flex-wrap gap-1.5">
          {items.map(item => <Badge key={item} variant="secondary" className="font-normal">{item}</Badge>)}
        </div>
      </div>
    </div>
  );
};


export default function AdminTutorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { token } = useAuthMock();
    const { toast } = useToast();
    const tutorId = params.id as string;
    
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);

    const { data: tutor, isLoading, error } = useQuery<ApiTutor>({
        queryKey: ['tutorProfile', tutorId],
        queryFn: () => fetchTutorProfile(tutorId, token),
        enabled: !!tutorId && !!token,
        refetchOnWindowFocus: false,
    });
    
    if (isLoading) {
      return (
         <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 text-destructive">
          <p>Error loading tutor details: {(error as Error).message}</p>
           <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/admin/tutors"><ArrowLeft className="mr-2 h-4 w-4"/> Go Back</Link>
           </Button>
        </div>
      )
    }

    if (!tutor) {
      return (
        <div className="text-center py-10">
            <p className="text-destructive">Tutor data not available. Please go back to the list and select a tutor.</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/admin/tutors"><ArrowLeft className="mr-2 h-4 w-4"/> Go Back</Link>
           </Button>
        </div>
      )
    }


    return (
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-1 space-y-6">
                <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
                    <CardContent className="p-5 md:p-6 text-center">
                        <Avatar className="h-24 w-24 border-4 border-primary/20 mx-auto shadow-md">
                            <AvatarImage src={tutor.profilePicUrl} alt={tutor.displayName} />
                            <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                                {getInitials(tutor.displayName)}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-xl font-bold text-foreground mt-4">{tutor.displayName}</CardTitle>
                        <div className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                            { (tutor.online || tutor.offline) &&
                                <div className="flex items-center justify-center gap-1.5">
                                    <RadioTower className="w-3.5 h-3.5 text-primary"/>
                                    <span>
                                        {tutor.online && tutor.offline ? "Online & Offline" : tutor.online ? "Online" : "Offline"}
                                    </span>
                                </div>
                            }
                            { (tutor.area || tutor.city) &&
                                <div className="flex items-center justify-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-primary"/>
                                    <span>{[tutor.area, tutor.city].filter(Boolean).join(', ')}</span>
                                </div>
                            }
                        </div>
                        <div className="mt-2.5 flex justify-center items-center gap-2 flex-wrap">
                            <Badge variant={tutor?.isActive ? "default" : "destructive"}>
                                {tutor?.isActive ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                                {tutor?.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                             <Badge variant={tutor?.isVerified ? "default" : "destructive"}>
                                {tutor?.isVerified ? <ShieldCheck className="mr-1 h-3 w-3"/> : <ShieldAlert className="mr-1 h-3 w-3"/>}
                                {tutor?.isVerified ? 'Verified' : 'Not Verified'}
                            </Badge>
                        </div>
                    </CardContent>
                    <CardFooter className="p-3 border-t flex flex-wrap justify-start gap-2">
                      {!tutor?.isActive && (
                          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsActivationModalOpen(true)}>
                            <Unlock className="h-3.5 w-3.5 mr-1.5" /> Activate
                          </Button>
                      )}
                      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsUpdateModalOpen(true)}><Edit3 className="h-3.5 w-3.5 mr-1.5" /> Update</Button>
                    </CardFooter>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Personal & Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoItem icon={VenetianMask} label="Gender">{tutor.gender || 'Not Specified'}</InfoItem>
                         <InfoItem icon={Mail} label="Email">
                            <div className="flex items-center gap-2">
                                <span>{tutor.email}</span>
                                {tutor.emailVerified ? (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100"><MailCheck className="h-3 w-3"/></Badge>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Email Verified</p></TooltipContent>
                                </Tooltip>
                                ) : (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <XCircle className="h-4 w-4 text-destructive"/>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Email Not Verified</p></TooltipContent>
                                </Tooltip>
                                )}
                            </div>
                        </InfoItem>
                        <InfoItem icon={Phone} label="Phone">
                             <div className="flex items-center gap-2">
                                <span>{tutor.countryCode} {tutor.phone}</span>
                                {tutor.phoneVerified ? (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100"><PhoneCall className="h-3 w-3"/></Badge>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Phone Verified</p></TooltipContent>
                                </Tooltip>
                                ) : (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <XCircle className="h-4 w-4 text-destructive"/>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Phone Not Verified</p></TooltipContent>
                                </Tooltip>
                                )}
                            </div>
                        </InfoItem>
                    </CardContent>
                </Card>
            </div>
             {/* Main Content Column */}
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between gap-2">
                        <CardTitle>About</CardTitle>
                        {!tutor.isBioReviewed && (
                            <Badge variant="destructive" className="text-xs py-1 px-2.5 bg-destructive/10 text-destructive border-destructive/20">
                                <ShieldAlert className="mr-1 h-3 w-3"/>
                                Pending Review
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{tutor?.bio || "No biography provided."}</p>
                    </CardContent>
                    {!tutor.isBioReviewed && (
                        <CardFooter className="flex justify-end p-3 border-t">
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                                <CheckSquare className="mr-1.5 h-3.5 w-3.5" />
                                Approve Bio
                            </Button>
                        </CardFooter>
                    )}
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Specialization & Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <InfoBadgeList icon={BookOpen} label="Subjects" items={tutor?.subjectsList || []}/>
                       <InfoBadgeList icon={GraduationCap} label="Grades" items={tutor?.gradesList || []}/>
                       <InfoBadgeList icon={Building} label="Boards" items={tutor?.boardsList || []}/>
                       <InfoBadgeList icon={CalendarDays} label="Available Days" items={tutor?.availabilityDaysList || []}/>
                       <InfoBadgeList icon={Clock} label="Available Times" items={tutor?.availabilityTimeList || []}/>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Professional Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <InfoItem icon={Briefcase} label="Experience">{tutor?.yearOfExperience}</InfoItem>
                        <InfoItem icon={DollarSign} label="Hourly Rate">{`₹${tutor?.hourlyRate} ${tutor?.isRateNegotiable ? '(Negotiable)' : ''}`}</InfoItem>
                        <InfoItem icon={GraduationCap} label="Qualifications">{tutor?.qualificationList?.join(', ')}</InfoItem>
                        <InfoItem icon={Languages} label="Languages">{tutor?.languagesList?.join(', ')}</InfoItem>
                    </CardContent>
                </Card>
            </div>
        </div>
        
        <ActivationModal
            isOpen={isActivationModalOpen}
            onOpenChange={setIsActivationModalOpen}
            tutorName={tutor?.name || ""}
        />
        
        <AdminUpdateTutorModal
            isOpen={isUpdateModalOpen}
            onOpenChange={setIsUpdateModalOpen}
            tutor={tutor}
        />
      </TooltipProvider>
    );
}

    
