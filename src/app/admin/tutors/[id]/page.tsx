
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
  FileText
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

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
    return response.json();
};

const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
};

const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-sm font-semibold text-primary mb-2">{title}</h4>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
);

const InfoItem = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children?: React.ReactNode }) => {
  if (!children) return null;
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


export default function AdminTutorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { token } = useAuthMock();
    const tutorId = params.id as string;

    const { data: tutor, isLoading, error } = useQuery<ApiTutor>({
        queryKey: ['tutorProfile', tutorId],
        queryFn: () => fetchTutorProfile(tutorId, token),
        enabled: !!tutorId && !!token,
    });
    
    if (isLoading) {
      return (
         <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Skeleton className="h-[250px] w-full rounded-xl" />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <Skeleton className="h-[250px] w-full rounded-xl" />
                </div>
            </div>
        </div>
      );
    }

    if (error) {
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

    if (!tutor) {
        return <div className="text-center py-10 text-muted-foreground">Tutor not found.</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <Avatar className="h-24 w-24 border-2 border-primary/30">
                            <AvatarImage src={tutor.profilePicUrl} alt={tutor.displayName} />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                {getInitials(tutor.displayName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <CardTitle className="text-2xl font-bold text-foreground">{tutor.displayName}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">{tutor.gender}</CardDescription>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge variant={tutor.isActive ? "default" : "destructive"}>
                                    {tutor.isActive ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                                    {tutor.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge variant={tutor.isVerified ? "default" : "destructive"}>
                                    {tutor.isVerified ? <ShieldCheck className="mr-1 h-3 w-3"/> : <ShieldAlert className="mr-1 h-3 w-3"/>}
                                    {tutor.isVerified ? 'Verified' : 'Not Verified'}
                                </Badge>
                                 <Badge variant="outline">
                                    Profile: {tutor.profileCompletion}%
                                </Badge>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto flex flex-col gap-2">
                           {tutor.documentsUrl && (
                             <Button asChild variant="outline">
                               <a href={tutor.documentsUrl} target="_blank" rel="noopener noreferrer">
                                <FileText className="mr-2 h-4 w-4"/> View Documents
                               </a>
                             </Button>
                           )}
                            {!tutor.isActive && (
                                <Button size="sm" variant="destructive-outline">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Activate
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>About</CardTitle>
                            <Badge variant={tutor.isBioReviewed ? "default" : "destructive"}>
                                {tutor.isBioReviewed ? "Reviewed" : "Pending Review"}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{tutor.bio || "No biography provided."}</p>
                        </CardContent>
                        {!tutor.isBioReviewed && (
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
                            <InfoBadgeList icon={BookOpen} label="Subjects" items={tutor.subjectsList}/>
                            <InfoBadgeList icon={GraduationCap} label="Grades" items={tutor.gradesList}/>
                            <InfoBadgeList icon={Building} label="Boards" items={tutor.boardsList}/>
                             <Separator />
                            <InfoBadgeList icon={CalendarDays} label="Available Days" items={tutor.availabilityDaysList}/>
                            <InfoBadgeList icon={Clock} label="Available Times" items={tutor.availabilityTimeList}/>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InfoItem icon={Briefcase} label="Experience">{tutor.experienceYears}</InfoItem>
                            <InfoItem icon={DollarSign} label="Hourly Rate">{`₹${tutor.hourlyRate} ${tutor.isRateNegotiable ? '(Negotiable)' : ''}`}</InfoItem>
                            <InfoItem icon={GraduationCap} label="Qualifications">{tutor.qualificationList?.join(', ')}</InfoItem>
                            <InfoItem icon={Languages} label="Languages">{tutor.languagesList?.join(', ')}</InfoItem>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Location & Mode</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                </InfoItem>
                              )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
