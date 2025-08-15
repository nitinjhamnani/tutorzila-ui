
"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from 'date-fns';
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Eye,
  CheckCircle,
  XCircle,
  MailCheck,
  PhoneCall,
  Loader2,
  ShieldAlert,
  ListFilter
} from "lucide-react";

interface ApiTutor {
  id: string;
  name: string;
  email: string;
  country: string;
  countryCode: string;
  phone: string;
  userType: "PARENT" | "TUTOR";
  registeredDate: string;
  profilePicUrl?: string;
  active: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  whatsappEnabled: boolean;
}

const fetchAdminTutors = async (token: string | null): Promise<ApiTutor[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/admin/users?userType=TUTOR`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch tutors." }));
    throw new Error(errorData.message);
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


export default function AdminTutorsPage() {
  const { token } = useAuthMock();
  const { data: tutors = [], isLoading, error } = useQuery<ApiTutor[]>({
    queryKey: ['adminAllTutors', token],
    queryFn: () => fetchAdminTutors(token),
    enabled: !!token,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-64 text-center">
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="font-semibold">Loading Tutors...</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
    
    if (error) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                <ShieldAlert className="h-8 w-8" />
                <span className="font-semibold">Failed to load tutors</span>
                <span className="text-sm">{(error as Error).message}</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (tutors.length === 0) {
      return (
         <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
               <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Users className="h-8 w-8" />
                <span className="font-semibold">No Tutors Found</span>
                <span className="text-sm">There are no tutors registered on the platform yet.</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {tutors.map((tutor) => (
          <TableRow key={tutor.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src={tutor.profilePicUrl} alt={tutor.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {getInitials(tutor.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium text-foreground">{tutor.name}</div>
                    <div className="text-xs text-muted-foreground">{tutor.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-xs">
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{`${tutor.countryCode} ${tutor.phone}`}</span>
                {tutor.whatsappEnabled && <Badge variant="secondary" className="mt-1 w-fit bg-green-100 text-green-700">WhatsApp</Badge>}
              </div>
            </TableCell>
            <TableCell className="text-xs">{format(new Date(tutor.registeredDate), "MMM d, yyyy")}</TableCell>
            <TableCell>
              <div className="flex flex-col items-start gap-1.5">
                  <Badge variant={tutor.emailVerified ? "default" : "destructive"} className={cn("text-xs py-0.5 px-2", tutor.emailVerified ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20")}>
                    {tutor.emailVerified ? <MailCheck className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                    Email
                  </Badge>
                  <Badge variant={tutor.phoneVerified ? "default" : "destructive"} className={cn("text-xs py-0.5 px-2", tutor.phoneVerified ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20")}>
                    {tutor.phoneVerified ? <PhoneCall className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                    Phone
                  </Badge>
              </div>
            </TableCell>
             <TableCell>
               <Badge variant={tutor.active ? "default" : "destructive"} className="text-xs py-1 px-2.5">
                {tutor.active ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                {tutor.active ? 'Active' : 'Inactive'}
               </Badge>
            </TableCell>
            <TableCell>
              <Button asChild variant="outline" size="icon" className="h-8 w-8">
                <Link href={`/admin/tutors/${tutor.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
        <CardHeader className="p-0 flex flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-grow min-w-0">
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <Users className="w-5 h-5 mr-2.5" />
              Tutor Management
            </CardTitle>
            <CardDescription className="text-sm text-foreground/70 mt-1">
              View, manage, and approve tutors on the platform.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <ListFilter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </CardHeader>
      </Card>

      <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tutor Details</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {renderTableContent()}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
