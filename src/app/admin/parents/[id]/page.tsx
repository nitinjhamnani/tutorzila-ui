
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { User, TuitionRequirement } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, User as UserIcon, Mail, Phone, CalendarDays, Briefcase, School, MailCheck, PhoneCall, CheckCircle, XCircle, Eye, UserPlus, KeyRound, UserX, RadioTower, MapPin, Settings, PlusCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { AdminEnquiryCard } from "@/components/admin/AdminEnquiryCard";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.885-.002 2.024.63 3.965 1.739 5.618l-1.187 4.349 4.443-1.152z" />
        <path d="M15.246 14.148c-.281-.141-1.66-1.04-1.916-1.158-.256-.117-.44-.187-.625.117-.184.305-.724.938-.887 1.115-.164.177-.328.188-.609.047-.282-.14-1.188-.438-2.262-1.395-.837-.745-1.395-1.661-1.56-1.944-.163-.282-.01- .438.104-.576.104-.13.234-.336.351-.49.117-.154.156-.257.234-.422.078-.164.039-.305-.019-.445-.058-.141-.625-1.492-.859-2.04-.233-.547-.467-.469-.625-.469-.141 0-.305-.019-.469-.019-.164 0-.438.058-.672.305-.234.246-.887.867-.887 2.109s.906 2.441 1.023 2.617c.118.176 1.77 2.899 4.293 4.098 2.522 1.199 2.522.797 2.969.762.447-.039 1.66-.672 1.898-1.32.238-.648.238-1.199.16-1.319-.078-.121-.281-.188-.586-.328z" />
    </svg>
);


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
        countryCode: userDetails.countryCode,
        role: 'parent',
        avatar: userDetails.profilePicUrl,
        isEmailVerified: userDetails.emailVerified,
        isPhoneVerified: userDetails.phoneVerified,
        status: userDetails.active ? 'Active' : 'Inactive',
        whatsappEnabled: userDetails.whatsappEnabled,
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

const verifyUserApi = async ({ userId, token, type }: { userId: string; token: string | null; type: 'email' | 'phone' }) => {
    if (!token) throw new Error("Authentication token not found.");
    if (!userId) throw new Error("User ID is required for verification.");
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(`${apiBaseUrl}/api/admin/user/verify/${type}/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to verify ${type}.` }));
        throw new Error(errorData.message);
    }
    return response.json();
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
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const parentId = params.id as string;

    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [verificationType, setVerificationType] = useState<'email' | 'phone' | null>(null);

    const { data, isLoading: isLoadingParent, error: parentError } = useQuery({
        queryKey: ['parentDetails', parentId],
        queryFn: () => fetchParentDetails(parentId, token),
        enabled: !!parentId && !!token,
    });

    const verificationMutation = useMutation({
        mutationFn: (type: 'email' | 'phone') => verifyUserApi({ userId: parentId, token, type }),
        onSuccess: (updatedUserDetails) => {
            queryClient.setQueryData(['parentDetails', parentId], (oldData: { user: User, enquiries: TuitionRequirement[] } | undefined) => {
                if (!oldData) return undefined;
                return { 
                    ...oldData, 
                    user: {
                        ...oldData.user,
                        isEmailVerified: updatedUserDetails.emailVerified,
                        isPhoneVerified: updatedUserDetails.phoneVerified,
                    }
                };
            });
            toast({
                title: `${verificationType?.charAt(0).toUpperCase()}${verificationType?.slice(1)} Verified!`,
                description: `The ${verificationType} for this parent has been successfully verified.`,
            });
            setIsVerificationModalOpen(false);
        },
        onError: (error: Error) => {
            toast({ variant: "destructive", title: "Verification Failed", description: error.message });
        },
    });

    const handleConfirmVerification = () => {
        if (verificationType) {
            verificationMutation.mutate(verificationType);
        }
    };
    
    const parent = data?.user;
    const enquiries = data?.enquiries || [];
    
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
        <>
        <TooltipProvider>
            <div className="space-y-6">
                <Card className="bg-card rounded-xl shadow-lg border-0">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Avatar className="h-20 w-20 border-2 border-primary/20 shrink-0">
                                <AvatarImage src={parent.avatar} alt={parent.name} />
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                    {getInitials(parent.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="w-full">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <CardTitle className="text-2xl font-bold text-foreground">{parent.name}</CardTitle>
                                   <Badge
                                      className={cn(
                                        "text-xs py-1 px-2.5 border",
                                        parent.status === "Active" ? "bg-primary text-primary-foreground border-primary" : "bg-destructive/10 text-destructive border-destructive/50"
                                      )}
                                    >
                                      {parent.status === "Active" ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                                      {parent.status}
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Mail className="w-4 h-4"/> 
                                        <span className="truncate">{parent.email}</span>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button onClick={() => { if(!parent.isEmailVerified) { setVerificationType('email'); setIsVerificationModalOpen(true);}}}>
                                                    <Badge variant={parent.isEmailVerified ? "secondary" : "destructive"} className={cn("py-1 px-2.5", parent.isEmailVerified ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200", !parent.isEmailVerified && "cursor-pointer hover:bg-red-200")}>
                                                        <MailCheck className="h-3 w-3"/>
                                                    </Badge>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent><p>Email {parent.isEmailVerified ? 'Verified' : 'Not Verified'}</p></TooltipContent>
                                        </Tooltip>
                                    </div>
                                    {parent.phone && (
                                      <div className="flex flex-col items-start gap-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Phone className="w-4 h-4"/> 
                                            <span>{parent.countryCode} {parent.phone}</span>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button onClick={() => { if(!parent.isPhoneVerified) { setVerificationType('phone'); setIsVerificationModalOpen(true);}}}>
                                                        <Badge variant={parent.isPhoneVerified ? "secondary" : "destructive"} className={cn("py-1 px-2.5", parent.isPhoneVerified ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200", !parent.isPhoneVerified && "cursor-pointer hover:bg-red-200")}>
                                                            <PhoneCall className="h-3 w-3"/>
                                                        </Badge>
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Phone {parent.isPhoneVerified ? 'Verified' : 'Not Verified'}</p></TooltipContent>
                                            </Tooltip>
                                        </div>
                                        {parent.whatsappEnabled && (
                                            <Badge variant="default" className={cn("mt-1 w-fit bg-primary/10 text-primary border-primary/20 text-xs flex items-center gap-1.5")}>
                                                <WhatsAppIcon className="h-3 w-3"/>
                                                WhatsApp
                                            </Badge>
                                        )}
                                      </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                     <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-2 p-4 border-t">
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                            <Button variant="default" size="sm" className="text-xs py-1.5 px-3 h-auto w-full sm:w-auto"><PlusCircle className="mr-1.5 h-3.5 w-3.5"/>Add Enquiry</Button>
                        </div>
                    </CardFooter>
                </Card>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                        <Briefcase className="w-5 h-5 mr-3 text-primary"/>
                        Enquiries ({enquiries.length})
                    </h2>
                     {enquiries.length > 0 ? (
                        <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
                            <CardContent className="p-0">
                                <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Board</TableHead>
                                        <TableHead>Mode</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enquiries.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-medium">{Array.isArray(req.subject) ? req.subject.join(', ') : req.subject}</TableCell>
                                        <TableCell>{req.gradeLevel}</TableCell>
                                        <TableCell>{req.board}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {req.teachingMode?.includes("Online") && <span>Online</span>}
                                                {req.teachingMode?.includes("Online") && req.teachingMode?.includes("Offline (In-person)") && <span>&</span>}
                                                {req.teachingMode?.includes("Offline (In-person)") && <span>Offline</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(req.postedAt), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="default">
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button asChild variant="outline" size="icon" className="h-8 w-8">
                                                <Link href={`/admin/manage-enquiry/${req.id}`}>
                                                  <Settings className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                     ) : (
                        <Card className="text-center py-12 bg-card border rounded-lg shadow-sm">
                            <CardContent className="flex flex-col items-center">
                                <Briefcase className="w-16 h-16 text-primary/30 mx-auto mb-5" />
                                <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Enquiries Posted</p>
                                <p className="text-sm text-muted-foreground max-w-sm mx-auto">This parent has not posted any tuition requirements yet.</p>
                            </CardContent>
                        </Card>
                     )}
                </section>
            </div>

            <AlertDialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Verification</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to manually mark this {verificationType} as verified? This action should only be taken if you have externally confirmed its validity.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setVerificationType(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmVerification} disabled={verificationMutation.isPending}>
                    {verificationMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {verificationMutation.isPending ? 'Verifying...' : 'Confirm'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </TooltipProvider>
        </>
    );
}
