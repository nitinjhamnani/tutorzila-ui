
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAtomValue } from "jotai";
import { selectedTutorAtom } from "@/lib/state/admin";
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
    
    // API returns only professional details. Personal info comes from the atom state.
    return {
      id: tutorId,
      displayName: data.displayName,
      gender: data.gender || "Not specified",
      subjectsList: data.tutoringDetails.subjects || [],
      hourlyRate: data.tutoringDetails.hourlyRate || 0,
      bio: data.tutoringDetails.tutorBio || "",
      qualificationList: data.tutoringDetails.qualifications || [],
      experienceYears: data.tutoringDetails.yearOfExperience || "",
      availabilityDaysList: data.tutoringDetails.availabilityDays || [],
      availabilityTimeList: data.tutoringDetails.availabilityTime || [],
      addressName: data.tutoringDetails.addressName || "",
      address: data.tutoringDetails.address || "",
      city: data.tutoringDetails.city || "",
      state: data.tutoringDetails.state || "",
      area: data.tutoringDetails.area || "",
      pincode: data.tutoringDetails.pincode || "",
      country: data.tutoringDetails.country || "",
      googleMapsLink: data.tutoringDetails.googleMapsLink || "",
      languagesList: data.tutoringDetails.languages || [],
      gradesList: data.tutoringDetails.grades || [],
      boardsList: data.tutoringDetails.boards || [],
      documentsUrl: data.documentsUrl || "",
      profileCompletion: data.profileCompletion || 0,
      isVerified: data.isVerified || false,
      isActive: data.tutorActive,
      isRateNegotiable: data.tutoringDetails.rateNegotiable || false,
      isHybrid: data.tutoringDetails.hybrid || false,
      isBioReviewed: data.tutoringDetails.bioReviewed || false,
      online: data.tutoringDetails.online || false,
      offline: data.tutoringDetails.offline || false,
      profilePicUrl: data.profilePicUrl,
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

const InfoItem = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children?: React.ReactNode }) => {
  if (!children && typeof children !== 'number') return null;
  return (
    <div className="flex items-start">
      <Icon className="w-4 h-4 mr-2.5 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{label}</span>
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

interface MetricCardProps {
  title: string;
  value: string;
  IconEl: React.ElementType;
}

function MetricCard({ title, value, IconEl }: MetricCardProps) {
  return (
    <Card className="bg-card rounded-lg p-4 border-0 shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-3">
         <div className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-lg text-primary shrink-0">
            <IconEl className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <h3 className="text-lg font-bold text-primary">{value}</h3>
        </div>
      </div>
    </Card>
  );
}


export default function AdminTutorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { token } = useAuthMock();
    const { toast } = useToast();
    const tutorId = params.id as string;
    
    const initialTutorData = useAtomValue(selectedTutorAtom);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);

    const { data: fetchedTutorDetails, isLoading, error } = useQuery<ApiTutor>({
        queryKey: ['tutorProfile', tutorId],
        queryFn: () => fetchTutorProfile(tutorId, token),
        enabled: !!tutorId && !!token,
        refetchOnWindowFocus: false,
    });

    const handleShareProfile = async () => {
        if (!initialTutorData) return;
        const profileUrl = `${window.location.origin}/tutors/${initialTutorData.id}`;
        try {
            await navigator.clipboard.writeText(profileUrl);
            toast({ title: "Profile Link Copied!", description: "Tutor's public profile link copied to clipboard." });
        } catch (err) {
            toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy link." });
        }
    };
    
    if (!initialTutorData) {
        return (
          <div className="flex h-screen items-center justify-center text-center">
            <div>
              <p className="text-destructive text-lg font-semibold">Tutor data not available.</p>
              <p className="text-muted-foreground mt-2">Please go back to the list and select a tutor again.</p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/admin/tutors"><ArrowLeft className="mr-2 h-4 w-4"/> Go Back</Link>
              </Button>
            </div>
          </div>
        );
    }
    
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
    
    const tutorInsights = {
        enquiriesAssigned: fetchedTutorDetails?.profileCompletion || 12, 
        demosScheduled: 5,
        averageRating: 4.8
    };

    return (
        <div className="space-y-6">
            <Card className="relative">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex items-center gap-4 flex-grow min-w-0">
                            <Avatar className="h-24 w-24 border-2 border-primary/30">
                                <AvatarImage src={fetchedTutorDetails?.profilePicUrl || initialTutorData?.profilePicUrl} alt={initialTutorData?.name || ""} />
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                    {getInitials(initialTutorData?.name || fetchedTutorDetails?.displayName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <CardTitle className="text-2xl font-bold text-foreground">{initialTutorData?.name || fetchedTutorDetails?.displayName || "Tutor Details"}</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">{fetchedTutorDetails?.gender || "Not Specified"}</CardDescription>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    {isLoading ? <Skeleton className="h-5 w-20 rounded-full" /> : (
                                        <Badge variant={fetchedTutorDetails?.isActive ? "default" : "destructive"}>
                                            {fetchedTutorDetails?.isActive ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                                            {fetchedTutorDetails?.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    )}
                                     {isLoading ? <Skeleton className="h-5 w-24 rounded-full" /> : (
                                        <Badge variant={fetchedTutorDetails?.isVerified ? "default" : "destructive"}>
                                            {fetchedTutorDetails?.isVerified ? <ShieldCheck className="mr-1 h-3 w-3"/> : <ShieldAlert className="mr-1 h-3 w-3"/>}
                                            {fetchedTutorDetails?.isVerified ? 'Verified' : 'Not Verified'}
                                        </Badge>
                                     )}
                                </div>
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
                    {fetchedTutorDetails?.documentsUrl ? (
                        <Button asChild variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto">
                        <a href={fetchedTutorDetails.documentsUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-1.5 h-3.5 w-3.5"/> View Documents
                        </a>
                        </Button>
                    ) : isLoading && <Skeleton className="h-8 w-32 rounded-md" />}
                    <Button size="sm" variant="outline" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsUpdateModalOpen(true)} disabled={!fetchedTutorDetails}>
                        <Edit3 className="mr-1.5 h-3.5 w-3.5"/> Update
                    </Button>
                    {fetchedTutorDetails && !fetchedTutorDetails.isActive && (
                        <Button size="sm" variant="outline" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsActivationModalOpen(true)}>
                            <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Activate
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />) : (
                    <>
                        <MetricCard title="Enquiries Assigned" value={String(tutorInsights.enquiriesAssigned)} IconEl={Briefcase} />
                        <MetricCard title="Demos Scheduled" value={String(tutorInsights.demosScheduled)} IconEl={CalendarDays} />
                        <MetricCard title="Average Rating" value={String(tutorInsights.averageRating)} IconEl={Star} />
                        <MetricCard title="Profile Completion" value={`${fetchedTutorDetails?.profileCompletion || 0}%`} IconEl={Percent} />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>About</CardTitle>
                            {isLoading ? <Skeleton className="h-6 w-24 rounded-full"/> : 
                            <Badge variant={fetchedTutorDetails?.isBioReviewed ? "default" : "destructive"}>
                                {fetchedTutorDetails?.isBioReviewed ? "Reviewed" : "Pending Review"}
                            </Badge>}
                        </CardHeader>
                        <CardContent>
                           {isLoading ? <Skeleton className="h-20 w-full"/> : 
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{fetchedTutorDetails?.bio || "No biography provided."}</p>}
                        </CardContent>
                        {!isLoading && fetchedTutorDetails && !fetchedTutorDetails.isBioReviewed && (
                            <CardFooter>
                                <Button size="sm">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve Bio
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Specialization & Availability</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            {isLoading ? <Skeleton className="h-32 w-full"/> : <>
                            <InfoBadgeList icon={BookOpen} label="Subjects" items={fetchedTutorDetails?.subjectsList || []}/>
                            <InfoBadgeList icon={GraduationCap} label="Grades" items={fetchedTutorDetails?.gradesList || []}/>
                            <InfoBadgeList icon={Building} label="Boards" items={fetchedTutorDetails?.boardsList || []}/>
                             <Separator />
                            <InfoBadgeList icon={CalendarDays} label="Available Days" items={fetchedTutorDetails?.availabilityDaysList || []}/>
                            <InfoBadgeList icon={Clock} label="Available Times" items={fetchedTutorDetails?.availabilityTimeList || []}/>
                            </>}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Personal & Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InfoItem icon={Mail} label="Email">{initialTutorData?.email || "Not Available"}</InfoItem>
                            <InfoItem icon={Phone} label="Phone">{initialTutorData?.countryCode ? `${initialTutorData.countryCode} ${initialTutorData.phone}` : (initialTutorData?.phone || "Not Available")}</InfoItem>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {isLoading ? <Skeleton className="h-24 w-full"/> : <>
                            <InfoItem icon={Briefcase} label="Experience">{fetchedTutorDetails?.experienceYears}</InfoItem>
                            <InfoItem icon={DollarSign} label="Hourly Rate">{`₹${fetchedTutorDetails?.hourlyRate} ${fetchedTutorDetails?.isRateNegotiable ? '(Negotiable)' : ''}`}</InfoItem>
                            <InfoItem icon={GraduationCap} label="Qualifications">{fetchedTutorDetails?.qualificationList?.join(', ')}</InfoItem>
                            <InfoItem icon={Languages} label="Languages">{fetchedTutorDetails?.languagesList?.join(', ')}</InfoItem>
                            </>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Location & Mode</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {isLoading ? <Skeleton className="h-16 w-full"/> : <>
                             <div className="flex items-center gap-2">
                                {fetchedTutorDetails?.online && <Badge><RadioTower className="w-3 h-3 mr-1.5"/> Online</Badge>}
                                {fetchedTutorDetails?.offline && <Badge><UsersIcon className="w-3 h-3 mr-1.5"/> Offline</Badge>}
                                {fetchedTutorDetails?.isHybrid && <Badge>Hybrid</Badge>}
                             </div>
                             {fetchedTutorDetails?.offline && (
                                <InfoItem icon={MapPin} label="Address">
                                  {fetchedTutorDetails.googleMapsLink ? (
                                    <a href={fetchedTutorDetails.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                      {fetchedTutorDetails.addressName || fetchedTutorDetails.address}
                                    </a>
                                  ) : (
                                    <span>{fetchedTutorDetails.addressName || fetchedTutorDetails.address || "Not specified"}</span>
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
                tutorName={initialTutorData?.name || fetchedTutorDetails?.displayName || ""}
            />
            
            {fetchedTutorDetails && (
              <AdminUpdateTutorModal
                  isOpen={isUpdateModalOpen}
                  onOpenChange={setIsUpdateModalOpen}
                  tutor={fetchedTutorDetails}
              />
            )}
        </div>
    );
}
