
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
      isVerified: tutoringDetails.verified,
      isRateNegotiable: tutoringDetails.rateNegotiable,
      isBioReviewed: tutoringDetails.bioReviewed,
      online: tutoringDetails.online,
      offline: tutoringDetails.offline,
      isHybrid: tutoringDetails.hybrid,
      
      gender: userDetails.gender,
    } as ApiTutor;
};


const getInitials = (name?: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2);
};

const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-sm font-semibold text-primary mb-2">{title}</h4>
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
            {verificationBadge}
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
    
    const handleShareProfile = async () => {
        if (!tutorId) return;
        const profileUrl = `${window.location.origin}/tutors/${tutorId}`;
        try {
            await navigator.clipboard.writeText(profileUrl);
            toast({ title: "Profile Link Copied!", description: "Tutor's public profile link copied to clipboard." });
        } catch (err) {
            toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy link." });
        }
    };
    
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
        <div className="space-y-6">
            <Card className="relative">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-grow min-w-0">
                            <CardTitle className="text-xl font-semibold text-primary">
                                Tutoring Specialization
                            </CardTitle>
                             <CardDescription className="text-sm text-foreground/70 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-primary/80"/>{tutor.subjectsList?.join(', ') || 'N/A'}</span>
                                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-primary/80"/>{tutor.gradesList?.join(', ') || 'N/A'}</span>
                                <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-primary/80"/>{tutor.boardsList?.join(', ') || 'N/A'}</span>
                            </CardDescription>
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <Badge variant={tutor?.isActive ? "default" : "destructive"}>
                                    {tutor?.isActive ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                                    {tutor?.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                 <Badge variant={tutor?.isVerified ? "default" : "destructive"}>
                                    {tutor?.isVerified ? <ShieldCheck className="mr-1 h-3 w-3"/> : <ShieldAlert className="mr-1 h-3 w-3"/>}
                                    {tutor?.isVerified ? 'Verified' : 'Not Verified'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                 <div className="absolute top-4 right-4 flex items-center gap-2">
                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <Link href={`/tutors/${tutorId}`} target="_blank">
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleShareProfile}>
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
                <CardFooter className="flex-wrap justify-start gap-2 p-4 border-t">
                    {tutor?.documentsUrl ? (
                        <Button asChild variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto">
                        <a href={tutor.documentsUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-1.5 h-3.5 w-3.5"/> View Documents
                        </a>
                        </Button>
                    ) : isLoading && <Skeleton className="h-8 w-32 rounded-md" />}
                    <Button size="sm" variant="outline" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsUpdateModalOpen(true)} disabled={isLoading}>
                        <Edit3 className="mr-1.5 h-3.5 w-3.5"/> Update
                    </Button>
                    {tutor && !tutor.isActive && (
                        <Button size="sm" variant="outline" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsActivationModalOpen(true)}>
                            <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Activate
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>About</CardTitle>
                            {isLoading ? <Skeleton className="h-6 w-24 rounded-full"/> : 
                            <Badge variant={tutor?.isBioReviewed ? "default" : "destructive"}>
                                {tutor?.isBioReviewed ? "Reviewed" : "Pending Review"}
                            </Badge>}
                        </CardHeader>
                        <CardContent>
                           {isLoading ? <Skeleton className="h-20 w-full"/> : 
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{tutor?.bio || "No biography provided."}</p>}
                        </CardContent>
                        {!isLoading && tutor && !tutor.isBioReviewed && (
                            <CardFooter>
                                <Button size="sm">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve Bio
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Specialization &amp; Availability</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            {isLoading ? <Skeleton className="h-32 w-full"/> : <>
                            <InfoBadgeList icon={BookOpen} label="Subjects" items={tutor?.subjectsList || []}/>
                            <InfoBadgeList icon={GraduationCap} label="Grades" items={tutor?.gradesList || []}/>
                            <InfoBadgeList icon={Building} label="Boards" items={tutor?.boardsList || []}/>
                             <Separator />
                            <InfoBadgeList icon={CalendarDays} label="Available Days" items={tutor?.availabilityDaysList || []}/>
                            <InfoBadgeList icon={Clock} label="Available Times" items={tutor?.availabilityTimeList || []}/>
                            </>}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Personal &amp; Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <InfoItem icon={User} label="Full Name">{tutor?.displayName || "Not Available"}</InfoItem>
                           <InfoItem icon={User} label="Gender">{tutor?.gender || "Not Specified"}</InfoItem>
                            <InfoItem 
                                icon={Mail} 
                                label="Email" 
                                verificationBadge={
                                  tutor?.emailVerified ? (
                                    <Badge variant="default" className="text-xs py-0.5 px-2 bg-primary/10 text-primary border-primary/20">
                                      <MailCheck className="mr-1 h-3 w-3" /> Verified
                                    </Badge>
                                  ) : (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <ShieldAlert className="h-4 w-4 text-destructive"/>
                                      </TooltipTrigger>
                                      <TooltipContent><p>Not Verified</p></TooltipContent>
                                    </Tooltip>
                                  )
                                }
                            >
                                {tutor?.email || "Not Available"}
                            </InfoItem>
                             <InfoItem 
                                icon={Phone} 
                                label="Phone" 
                                verificationBadge={
                                  tutor?.phoneVerified ? (
                                    <Badge variant="default" className="text-xs py-0.5 px-2 bg-primary/10 text-primary border-primary/20">
                                      <PhoneCall className="mr-1 h-3 w-3" /> Verified
                                    </Badge>
                                  ) : (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <ShieldAlert className="h-4 w-4 text-destructive"/>
                                      </TooltipTrigger>
                                      <TooltipContent><p>Not Verified</p></TooltipContent>
                                    </Tooltip>
                                  )
                                }
                             >
                               {tutor?.countryCode ? `${tutor.countryCode} ${tutor.phone}` : (tutor?.phone || "Not Available")}
                             </InfoItem>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {isLoading ? <Skeleton className="h-24 w-full"/> : <>
                            <InfoItem icon={Briefcase} label="Experience">{tutor?.yearOfExperience}</InfoItem>
                            <InfoItem icon={DollarSign} label="Hourly Rate">{`₹${tutor?.hourlyRate} ${tutor?.isRateNegotiable ? '(Negotiable)' : ''}`}</InfoItem>
                            <InfoItem icon={GraduationCap} label="Qualifications">{tutor?.qualificationList?.join(', ')}</InfoItem>
                            <InfoItem icon={Languages} label="Languages">{tutor?.languagesList?.join(', ')}</InfoItem>
                            </>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Location &amp; Mode</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {isLoading ? <Skeleton className="h-16 w-full"/> : <>
                             <div className="flex items-center gap-2">
                                {tutor?.online && <Badge><RadioTower className="w-3 h-3 mr-1.5"/> Online</Badge>}
                                {tutor?.offline && <Badge><UsersIcon className="w-3 h-3 mr-1.5"/> Offline</Badge>}
                                {tutor?.isHybrid && <Badge>Hybrid</Badge>}
                             </div>
                             {tutor?.offline && (
                                <InfoItem icon={MapPin} label="Address">
                                  {tutor.googleMapsLink ? (
                                    <a href={tutor.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                      {tutor.addressName || tutor.address}
                                    </a>
                                  ) : (
                                    <span>{tutor.addressName || tutor.address || "Not specified"}</span>
                                  )}
                                </InfoItem>
                              )}
                              </>}
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
        </div>
      </TooltipProvider>
    );
}
