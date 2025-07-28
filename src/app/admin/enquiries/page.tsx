
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { TuitionRequirement, User } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { AdminEnquiryCard } from "@/components/admin/AdminEnquiryCard";
import { FilterIcon as LucideFilterIcon, Star, CheckCircle, Bookmark, ListChecks, ChevronDown, Briefcase, XIcon, BookOpen, Users as UsersIcon, MapPin, RadioTower, XCircle as ErrorIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const fetchAdminEnquiries = async (token: string | null): Promise<TuitionRequirement[]> => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/enquiry/list`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    if (response.status === 504) {
      throw new Error("The server took too long to respond (504 Gateway Timeout). Please try again later.");
    }
    throw new Error("Failed to fetch enquiries. The server returned an error.");
  }
  
  const data = await response.json();
  
  return data.map((item: any, index: number) => ({
    id: item.enquiryId || `enq-${index}-${Date.now()}`,
    parentId: `p-${index}`, 
    parentName: "A Parent", 
    subject: typeof item.subjects === 'string' ? item.subjects.split(',').map((s: string) => s.trim()) : [],
    gradeLevel: item.grade,
    scheduleDetails: "Details not provided by API",
    location: [item.area, item.city, item.country].filter(Boolean).join(', '),
    status: "open", 
    postedAt: new Date().toISOString(), 
    board: item.board,
    teachingMode: [
      ...(item.online ? ["Online"] : []),
      ...(item.offline ? ["Offline (In-person)"] : []),
    ],
    applicantsCount: item.assignedTutors,
  }));
};

export default function AdminAllEnquiriesPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();

  const { data: allRequirements = [], isLoading, error } = useQuery({
    queryKey: ['adminAllEnquiries', token],
    queryFn: () => fetchAdminEnquiries(token),
    enabled: !!token && !!user && user.role === 'admin',
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const renderEnquiryList = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[200px] w-full rounded-lg" />)}
        </div>
      );
    }

    if (error) {
      return (
        <Card className="text-center py-12 bg-destructive/10 border-destructive/20 rounded-lg shadow-sm col-span-full">
            <CardContent className="flex flex-col items-center">
                <ErrorIcon className="w-16 h-16 text-destructive mx-auto mb-5" />
                <p className="text-xl font-semibold text-destructive mb-1.5">Error Fetching Enquiries</p>
                <p className="text-sm text-destructive/80 max-w-sm mx-auto">{(error as Error).message}</p>
            </CardContent>
        </Card>
      );
    }

    if (allRequirements.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {allRequirements.map((req, index) => (
            <div
              key={req.id}
              className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out h-full"
              style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
            >
              <AdminEnquiryCard requirement={req} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <Card className="text-center py-12 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out col-span-full">
        <CardContent className="flex flex-col items-center">
          <ListChecks className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Enquiries Found</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            There are currently no open tuition enquiries on the platform.
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
        <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
            <CardHeader className="p-0 flex flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-grow min-w-0">
                    <CardTitle className="text-xl font-semibold text-primary flex items-center">
                        <Briefcase className="w-5 h-5 mr-2.5" />
                        All Enquiries
                    </CardTitle>
                     <CardDescription className="text-sm text-foreground/70 mt-1">
                        A comprehensive list of all tuition requirements posted on the platform.
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>
        
        {renderEnquiryList()}
    </div>
  );
}
