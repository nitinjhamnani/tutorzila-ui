
"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from 'date-fns';
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { selectedTutorAtom } from "@/lib/state/admin";
import type { ApiTutor } from "@/types";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
  ListFilter,
  UserPlus,
  RadioTower,
  Users as UsersIcon,
  ShieldCheck,
} from "lucide-react";
import { AddUserModal } from "@/components/admin/modals/AddUserModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const fetchAdminTutors = async (token: string | null): Promise<ApiTutor[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/search/tutors/all`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch tutors." }));
    throw new Error(errorData.message);
  }
  
  const data = await response.json();
  // Transform the new API response to match the existing ApiTutor type structure
  return data.map((tutor: any) => ({
    id: tutor.tutorId,
    displayName: tutor.tutorName,
    subjectsList: tutor.subjects ? tutor.subjects.split(',').map((s:string) => s.trim()) : [],
    gradesList: tutor.grades ? tutor.grades.split(',').map((g:string) => g.trim()) : [],
    boardsList: tutor.boards ? tutor.boards.split(',').map((b:string) => b.trim()) : [],
    area: tutor.area,
    city: tutor.city,
    state: tutor.state,
    googleMapsLink: tutor.googleMapLink,
    createdAt: tutor.createdAt,
    isActive: tutor.active,
    isBioReviewed: tutor.bioReviewed,
    online: tutor.online,
    offline: tutor.offline,
    profilePicUrl: tutor.profilePicUrl,
    isVerified: tutor.isVerified, // Added from API response
    // Fields from old type that are still needed for other parts of the app
    // They will be populated from other sources or have defaults.
    name: tutor.tutorName,
    email: "email_from_other_source@example.com", // Placeholder
    phone: "9999999999", // Placeholder
  }));
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
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const setSelectedTutor = useSetAtom(selectedTutorAtom);

  const { data: tutors = [], isLoading, error } = useQuery<ApiTutor[]>({
    queryKey: ['adminAllTutors', token],
    queryFn: () => fetchAdminTutors(token),
    enabled: !!token,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const handleAddUserSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['adminAllTutors'] });
  };
  
  const handleViewTutor = (tutor: ApiTutor) => {
    setSelectedTutor(tutor);
    router.push(`/admin/tutors/${tutor.id}`);
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="h-64 text-center">
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
            <TableCell colSpan={7} className="h-24 text-center">
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
            <TableCell colSpan={7} className="h-24 text-center">
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
                {tutor.profilePicUrl && (
                  <Avatar className="h-10 w-10 border">
                      <AvatarImage src={tutor.profilePicUrl} alt={tutor.displayName} />
                  </Avatar>
                )}
                <div>
                    <div className="font-medium text-foreground flex items-center gap-1.5">
                       {tutor.isVerified ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <ShieldCheck className="h-4 w-4 text-green-500"/>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Verified</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <ShieldAlert className="h-4 w-4 text-yellow-500"/>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Not Verified</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                      {tutor.displayName}
                    </div>
                    <div className="text-xs text-muted-foreground">{tutor.city}, {tutor.state}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-xs">{tutor.subjectsList.join(', ')}</TableCell>
            <TableCell className="text-xs">{tutor.gradesList.join(', ')}</TableCell>
            <TableCell className="text-xs">{tutor.boardsList.join(', ')}</TableCell>
            <TableCell>
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  {tutor.online && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-1.5 bg-primary/10 rounded-full">
                           <RadioTower className="w-4 h-4 text-primary" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent><p>Available for Online</p></TooltipContent>
                    </Tooltip>
                  )}
                  {tutor.offline && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-1.5 bg-primary/10 rounded-full">
                           <UsersIcon className="w-4 h-4 text-primary" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent><p>Available for Offline</p></TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TooltipProvider>
            </TableCell>
             <TableCell>
               <Badge variant={tutor.isActive ? "default" : "destructive"} className="text-xs py-1 px-2.5">
                {tutor.isActive ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                {tutor.isActive ? 'Active' : 'Inactive'}
               </Badge>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleViewTutor(tutor)}>
                  <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <>
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
          <Button onClick={() => setIsAddUserModalOpen(true)} size="sm" className="h-9 sm:w-auto w-9 sm:px-3 p-0">
            <UserPlus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Tutor</span>
          </Button>
        </CardHeader>
      </Card>

      <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tutor Details</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Grades</TableHead>
                <TableHead>Board</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {renderTableContent()}
          </Table>
        </CardContent>
      </Card>
    </div>
     <AddUserModal
        isOpen={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        userType="TUTOR"
        onSuccess={handleAddUserSuccess}
      />
    </>
  );
}
