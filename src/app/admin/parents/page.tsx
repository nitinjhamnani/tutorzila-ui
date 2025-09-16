
"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from 'date-fns';
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
  ListFilter,
  UsersRound,
  UserPlus,
  Settings,
} from "lucide-react";
import { AddUserModal } from "@/components/admin/modals/AddUserModal";

interface ApiParent {
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

const fetchAdminParents = async (token: string | null): Promise<ApiParent[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/admin/users?userType=PARENT`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch parents." }));
    throw new Error(errorData.message);
  }
  
  return response.json();
};

const getInitials = (name: string): string => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.slice(0, 2);
};


export default function AdminParentsPage() {
  const { token } = useAuthMock();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: parents = [], isLoading, error } = useQuery<ApiParent[]>({
    queryKey: ['adminAllParents', token],
    queryFn: () => fetchAdminParents(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleAddUserSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['adminAllParents'] });
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(8)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-8 w-24 rounded-md" /></TableCell>
            </TableRow>
          ))}
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
                <span className="font-semibold">Failed to load parents</span>
                <span className="text-sm">{(error as Error).message}</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (parents.length === 0) {
      return (
         <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
               <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Users className="h-8 w-8" />
                <span className="font-semibold">No Parents Found</span>
                <span className="text-sm">There are no parents registered on the platform yet.</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {parents.map((parent) => (
          <TableRow key={parent.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src={parent.profilePicUrl} alt={parent.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {getInitials(parent.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium text-foreground">{parent.name}</div>
                    <div className="text-xs text-muted-foreground">{parent.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-xs">
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{`${parent.countryCode} ${parent.phone}`}</span>
                {parent.whatsappEnabled && <Badge variant="secondary" className="mt-1 w-fit bg-primary/10 text-primary border-primary/20">WhatsApp</Badge>}
              </div>
            </TableCell>
            <TableCell className="text-xs">{format(new Date(parent.registeredDate), "MMM d, yyyy")}</TableCell>
            <TableCell>
              <div className="flex flex-col items-start gap-1.5">
                  <Badge variant={parent.emailVerified ? "default" : "destructive"} className={cn("text-xs py-0.5 px-2", parent.emailVerified ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20")}>
                    {parent.emailVerified ? <MailCheck className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                    Email
                  </Badge>
                  <Badge variant={parent.phoneVerified ? "default" : "destructive"} className={cn("text-xs py-0.5 px-2", parent.phoneVerified ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20")}>
                    {parent.phoneVerified ? <PhoneCall className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                    Phone
                  </Badge>
              </div>
            </TableCell>
             <TableCell>
               <Badge variant={parent.active ? "default" : "destructive"} className="text-xs py-1 px-2.5">
                {parent.active ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                {parent.active ? 'Active' : 'Inactive'}
               </Badge>
            </TableCell>
            <TableCell>
              <Button asChild variant="outline" size="icon" className="h-8 w-8">
                <Link href={`/admin/parents/${parent.id}`}>
                  <Settings className="h-4 w-4" />
                </Link>
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
                <UsersRound className="w-5 h-5 mr-2.5" />
                Parent Management
              </CardTitle>
              <CardDescription className="text-sm text-foreground/70 mt-1">
                View and manage parent accounts on the platform.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddUserModalOpen(true)} size="sm" className="h-9 w-9 p-0 sm:w-auto sm:px-4 sm:py-1.5">
              <UserPlus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Parent</span>
            </Button>
          </CardHeader>
        </Card>

        <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parent Details</TableHead>
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
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        userType="PARENT"
        onSuccess={handleAddUserSuccess}
      />
    </>
  );
}
