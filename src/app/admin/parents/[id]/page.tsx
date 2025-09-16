
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { User, TuitionRequirement, MyClass } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, User as UserIcon, Mail, Phone, CalendarDays, Briefcase, School } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { AdminEnquiryCard } from "@/components/admin/AdminEnquiryCard";
import { ClassCard } from "@/components/dashboard/ClassCard";
import { MOCK_CLASSES } from "@/lib/mock-data";


const fetchParentDetails = async (parentId: string, token: string | null): Promise<{ user: User; enquiries: TuitionRequirement[] }> => {
    if (!token) throw new Error("Authentication token not found.");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    
    const response = await fetch(`${apiBaseUrl}/api/admin/parent/${parentId}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch parent details.");
    }
    const data = await response.json();
    const { userDetails, enquirySummaryList } = data;

    const user: User = {
        id: parentId,
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        role: 'parent',
        avatar: userDetails.profilePicUrl,
        isEmailVerified: userDetails.emailVerified,
        isPhoneVerified: userDetails.phoneVerified,
        status: userDetails.active ? 'Active' : 'Inactive',
    };
    
    const enquiries: TuitionRequirement[] = (enquirySummaryList || []).map((item: any) => ({
      id: item.enquiryId,
      parentName: userDetails.name, 
      subject: typeof item.subjects === 'string' ? item.subjects.split(',').map((s: string) => s.trim()) : [],
      gradeLevel: item.grade,
      scheduleDetails: "Details not provided by API",
      location: {
        address: [item.area, item.city, item.country].filter(Boolean).join(', '),
        area: item.area,
        city: item.city,
        country: item.country,
      },
      status: item.status?.toLowerCase() || 'open', 
      postedAt: item.createdOn || new Date().toISOString(),
      board: item.board,
      teachingMode: [
        ...(item.online ? ["Online"] : []),
        ...(item.offline ? ["Offline (In-person)"] : []),
      ],
      applicantsCount: item.assignedTutors || 0,
    }));

    return { user, enquiries };
};

const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2);
};

export default function AdminParentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { token } = useAuthMock();
    const parentId = params.id as string;

    const { data, isLoading: isLoadingParent, error: parentError } = useQuery({
        queryKey: ['parentDetails', parentId],
        queryFn: () => fetchParentDetails(parentId, token),
        enabled: !!parentId && !!token,
    });
    
    const parent = data?.user;
    const enquiries = data?.enquiries || [];


    const { data: classes = [], isLoading: isLoadingClasses } = useQuery<MyClass[]>({
        queryKey: ['parentClassesForAdmin', parentId],
        queryFn: async () => {
            const parentEnquiryIds = enquiries.map(req => req.id);
            return MOCK_CLASSES.filter(c => parentEnquiryIds.includes(c.id)); 
        },
        enabled: !!parentId && !!enquiries && enquiries.length > 0,
    });
    
    if (isLoadingParent) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }

    if (parentError) {
        return (
            <div className="text-center py-10 text-destructive">
                <p>Error loading parent details: {(parentError as Error).message}</p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href="/admin/parents">
                        <ArrowLeft className="mr-2 h-4 w-4"/> Go Back
                    </Link>
                </Button>
            </div>
        )
    }

    if (!parent) {
        return <div className="text-center py-10 text-muted-foreground">Parent not found.</div>;
    }

    return (
        <div className="space-y-6">
             <Button asChild variant="outline" size="sm">
                <Link href="/admin/parents">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to All Parents
                </Link>
            </Button>
            <Card className="bg-card rounded-xl shadow-lg border-0">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border-2 border-primary/20">
                            <AvatarImage src={parent.avatar} alt={parent.name} />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                {getInitials(parent.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl font-bold text-foreground">{parent.name}</CardTitle>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4"/> {parent.email}</span>
                                {parent.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4"/> {parent.phone}</span>}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-3 text-primary"/>
                    Enquiries ({enquiries.length})
                </h2>
                 {enquiries.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {enquiries.map(req => <AdminEnquiryCard key={req.id} requirement={req} />)}
                    </div>
                 ) : <p className="text-muted-foreground text-sm">This parent has not posted any enquiries yet.</p>
                 }
            </section>
            
            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <School className="w-5 h-5 mr-3 text-primary"/>
                    Classes ({classes.length})
                </h2>
                 {isLoadingClasses ? <Skeleton className="h-40 w-full rounded-xl" /> : (
                    classes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {classes.map(cls => <ClassCard key={cls.id} classData={cls} />)}
                        </div>
                    ) : <p className="text-muted-foreground text-sm">This parent has no active or past classes.</p>
                 )}
            </section>
        </div>
    );
}

