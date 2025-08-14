
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
import { MOCK_ALL_PARENT_REQUIREMENTS, MOCK_CLASSES } from "@/lib/mock-data";


const fetchParentDetails = async (parentId: string, token: string | null): Promise<User> => {
    if (!token) throw new Error("Authentication token not found.");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    // This is a mock implementation. In a real app, you would fetch from an endpoint like:
    // const response = await fetch(`${apiBaseUrl}/api/admin/parent/${parentId}`, { ... });
    // For now, we simulate finding the parent from a mock API user list.
    const usersResponse = await fetch(`${apiBaseUrl}/api/admin/users?userType=PARENT`, {
      headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
    });
    if (!usersResponse.ok) throw new Error("Failed to fetch parent list to find details.");
    const allParents: any[] = await usersResponse.json();
    const parentData = allParents.find(p => p.id === parentId);
    
    if (!parentData) throw new Error("Parent not found.");

    return {
        id: parentData.id,
        name: parentData.name,
        email: parentData.email,
        phone: parentData.phone,
        role: 'parent',
        avatar: parentData.profilePicUrl,
        isEmailVerified: parentData.emailVerified,
        isPhoneVerified: parentData.phoneVerified,
        status: parentData.active ? 'Active' : 'Inactive',
    };
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

    const { data: parent, isLoading: isLoadingParent, error: parentError } = useQuery<User>({
        queryKey: ['parentDetails', parentId],
        queryFn: () => fetchParentDetails(parentId, token),
        enabled: !!parentId && !!token,
    });

    const { data: enquiries = [], isLoading: isLoadingEnquiries } = useQuery<TuitionRequirement[]>({
        queryKey: ['parentEnquiriesForAdmin', parentId],
        queryFn: async () => {
            // Mock: Filter global enquiries by parentId
            return MOCK_ALL_PARENT_REQUIREMENTS.filter(req => req.parentId === parentId);
        },
        enabled: !!parentId,
    });

    const { data: classes = [], isLoading: isLoadingClasses } = useQuery<MyClass[]>({
        queryKey: ['parentClassesForAdmin', parentId],
        queryFn: async () => {
            // Mock: Filter global classes by parent association (needs more robust logic in real app)
            // This is a simplified mock logic
            const parentEnquiryIds = MOCK_ALL_PARENT_REQUIREMENTS.filter(req => req.parentId === parentId).map(req => req.id);
            return MOCK_CLASSES.filter(c => parentEnquiryIds.includes(c.id)); // Using class ID as a mock link
        },
        enabled: !!parentId,
    });
    
    if (isLoadingParent) {
      return (
         <div className="space-y-6">
            <Skeleton className="h-[150px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
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
                 {isLoadingEnquiries ? <Skeleton className="h-40 w-full rounded-xl" /> : (
                    enquiries.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {enquiries.map(req => <AdminEnquiryCard key={req.id} requirement={req} />)}
                        </div>
                    ) : <p className="text-muted-foreground text-sm">This parent has not posted any enquiries yet.</p>
                 )}
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

