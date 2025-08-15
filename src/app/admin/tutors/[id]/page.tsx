
"use client";

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
import React, { useState, type ElementType } from "react";
import { ActivationModal } from "@/components/admin/modals/ActivationModal";
import { AdminUpdateTutorModal } from "@/components/admin/modals/AdminUpdateTutorModal";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAtomValue } from "jotai";
import { selectedTutorAtom } from "@/lib/state/admin";

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
    
    // The API response for details doesn't include personal info, so we will merge it later
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


const getInitials = (name: string): string => {
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
  IconEl: ElementType;
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
    });
    
    // Merge initial data (source of truth for personal info) with fetched data
    const displayTutor = React.useMemo(() => {
        if (fetchedTutorDetails) {
            return {
                ...fetchedTutorDetails, // Fetched details
                name: initialTutorData?.name, // Use name from atom
                email: initialTutorData?.email, // Use email from atom
                phone: initialTutorData?.phone, // Use phone from atom
                countryCode: initialTutorData?.countryCode, // use countryCode from atom
                profilePicUrl: fetchedTutorDetails.profilePicUrl || initialTutorData?.profilePicUrl, // Prioritize fetched URL
            };
        }
        return initialTutorData;
    }, [initialTutorData, fetchedTutorDetails]);

    const handleShareProfile = async () => {
        if (!displayTutor) return;
        const profileUrl = `${window.location.origin}/tutors/${displayTutor.id}`;
        try {
            await navigator.clipboard.writeText(profileUrl);
            toast({ title: "Profile Link Copied!", description: "Tutor's public profile link copied to clipboard." });
        } catch (err) {
            toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy link." });
        }
    };
    
    if (isLoading && !initialTutorData) {
      return (
         <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }

    if (error && !initialTutorData) {
        return (
            <div className="text-center py-10 text-destructive">
                <p>Error loading tutor profile: {(error as Error).message}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Go Back
                </Button>
            </div>
        )
    }

    if (!displayTutor) {
        return <div className="text-center py-10 text-muted-foreground">Tutor not found.</div>;
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
                                <AvatarImage src={displayTutor.profilePicUrl} alt={displayTutor.displayName || displayTutor.name} />
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                    {getInitials(displayTutor.displayName || displayTutor.name || "")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <CardTitle className="text-2xl font-bold text-foreground">{displayTutor.displayName || displayTutor.name}</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">{displayTutor.gender}</CardDescription>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <Badge variant={displayTutor.isActive ? "default" : "destructive"}>
                                        {displayTutor.isActive ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                                        {displayTutor.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <Badge variant={displayTutor.isVerified ? "default" : "destructive"}>
                                        {displayTutor.isVerified ? <ShieldCheck className="mr-1 h-3 w-3"/> : <ShieldAlert className="mr-1 h-3 w-3"/>}
                                        {displayTutor.isVerified ? 'Verified' : 'Not Verified'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                 <div className="absolute top-4 right-4 flex items-center gap-2">
                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <Link href={`/tutors/${displayTutor.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleShareProfile}>
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
                <CardFooter className="flex-wrap justify-between gap-2 p-4 border-t">
                    <div className="flex flex-wrap gap-2">
                         {displayTutor.documentsUrl && (
                            <Button asChild variant="outline" size="sm" className="text-xs py-1.5 px-3 h-auto">
                            <a href={displayTutor.documentsUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-1.5 h-3.5 w-3.5"/> View Documents
                            </a>
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsUpdateModalOpen(true)}>
                            <Edit3 className="mr-1.5 h-3.5 w-3.5"/> Update
                        </Button>
                        {!displayTutor.isActive && (
                            <Button size="sm" variant="outline" className="text-xs py-1.5 px-3 h-auto" onClick={() => setIsActivationModalOpen(true)}>
                                <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Activate
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Enquiries Assigned" value={String(tutorInsights.enquiriesAssigned)} IconEl={Briefcase} />
                <MetricCard title="Demos Scheduled" value={String(tutorInsights.demosScheduled)} IconEl={CalendarDays} />
                <MetricCard title="Average Rating" value={String(tutorInsights.averageRating)} IconEl={Star} />
                <MetricCard title="Profile Completion" value={`${displayTutor.profileCompletion || 0}%`} IconEl={Percent} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>About</CardTitle>
                            <Badge variant={displayTutor.isBioReviewed ? "default" : "destructive"}>
                                {displayTutor.isBioReviewed ? "Reviewed" : "Pending Review"}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{displayTutor.bio || "No biography provided."}</p>
                        </CardContent>
                        {!displayTutor.isBioReviewed && (
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
                            <InfoBadgeList icon={BookOpen} label="Subjects" items={displayTutor.subjectsList}/>
                            <InfoBadgeList icon={GraduationCap} label="Grades" items={displayTutor.gradesList}/>
                            <InfoBadgeList icon={Building} label="Boards" items={displayTutor.boardsList}/>
                             <Separator />
                            <InfoBadgeList icon={CalendarDays} label="Available Days" items={displayTutor.availabilityDaysList}/>
                            <InfoBadgeList icon={Clock} label="Available Times" items={displayTutor.availabilityTimeList}/>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal & Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InfoItem icon={Mail} label="Email">{displayTutor.email}</InfoItem>
                            <InfoItem icon={Phone} label="Phone">{displayTutor.countryCode ? `${displayTutor.countryCode} ${displayTutor.phone}` : displayTutor.phone}</InfoItem>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InfoItem icon={Briefcase} label="Experience">{displayTutor.experienceYears}</InfoItem>
                            <InfoItem icon={DollarSign} label="Hourly Rate">{`₹${displayTutor.hourlyRate} ${displayTutor.isRateNegotiable ? '(Negotiable)' : ''}`}</InfoItem>
                            <InfoItem icon={GraduationCap} label="Qualifications">{displayTutor.qualificationList?.join(', ')}</InfoItem>
                            <InfoItem icon={Languages} label="Languages">{displayTutor.languagesList?.join(', ')}</InfoItem>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Location & Mode</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center gap-2">
                                {displayTutor.online && <Badge><RadioTower className="w-3 h-3 mr-1.5"/> Online</Badge>}
                                {displayTutor.offline && <Badge><UsersIcon className="w-3 h-3 mr-1.5"/> Offline</Badge>}
                                {displayTutor.isHybrid && <Badge>Hybrid</Badge>}
                             </div>
                             {displayTutor.offline && (
                                <InfoItem icon={MapPin} label="Address">
                                  {displayTutor.googleMapsLink ? (
                                    <a href={displayTutor.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                      {displayTutor.addressName || displayTutor.address}
                                    </a>
                                  ) : (
                                    <span>{displayTutor.addressName || displayTutor.address || "Not specified"}</span>
                                  )}
                                </InfoItem>
                              )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <ActivationModal
                isOpen={isActivationModalOpen}
                onOpenChange={setIsActivationModalOpen}
                tutorName={displayTutor.displayName || displayTutor.name || ""}
            />
            
            <AdminUpdateTutorModal
                isOpen={isUpdateModalOpen}
                onOpenChange={setIsUpdateModalOpen}
                tutor={displayTutor}
            />
        </div>
    );
}

