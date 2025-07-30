
"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from 'date-fns';
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import type { ApiTutor, TuitionRequirement } from "@/types";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
  Briefcase,
  Search,
  GraduationCap,
  BookOpen
} from "lucide-react";

// API Fetching Functions (similar to other admin pages)

const fetchAdminEnquiryDetails = async (enquiryId: string, token: string | null): Promise<TuitionRequirement> => {
  if (!token || !enquiryId) throw new Error("Token and Enquiry ID are required.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/enquiry/details/${enquiryId}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
  });
  if (!response.ok) throw new Error("Failed to fetch enquiry details.");
  const data = await response.json();
  return {
    id: data.enquirySummary.enquiryId,
    parentName: data.name || "A Parent", 
    studentName: data.studentName,
    subject: typeof data.enquirySummary.subjects === 'string' ? data.enquirySummary.subjects.split(',').map((s:string) => s.trim()) : [],
    gradeLevel: data.enquirySummary.grade,
    board: data.enquirySummary.board,
    location: { address: data.address || ""},
    teachingMode: [
      ...(data.enquirySummary.online ? ["Online"] : []),
      ...(data.enquirySummary.offline ? ["Offline (In-person)"] : []),
    ],
    status: data.status?.toLowerCase() || 'open',
    postedAt: data.enquirySummary.createdOn,
    applicantsCount: data.enquirySummary.assignedTutors,
    scheduleDetails: data.notes,
  };
};


const fetchAllTutors = async (token: string | null): Promise<ApiTutor[]> => {
  if (!token) throw new Error("Authentication token not found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/admin/users?userType=TUTOR`, {
    headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' }
  });
  if (!response.ok) throw new Error("Failed to fetch tutors.");
  return response.json();
};

const getInitials = (name: string): string => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0].slice(0, 2);
};


export default function AssignTutorsToEnquiryPage() {
  const params = useParams();
  const enquiryId = params.enquiryId as string;
  const { token } = useAuthMock();
  const { toast } = useToast();
  
  const [selectedTutorIds, setSelectedTutorIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: enquiry, isLoading: isLoadingEnquiry, error: enquiryError } = useQuery({
    queryKey: ['adminEnquiryDetails', enquiryId],
    queryFn: () => fetchAdminEnquiryDetails(enquiryId, token),
    enabled: !!token && !!enquiryId,
  });
  
  const { data: allTutors = [], isLoading: isLoadingTutors, error: tutorsError } = useQuery({
    queryKey: ['allAdminTutors'],
    queryFn: () => fetchAllTutors(token),
    enabled: !!token,
  });

  const filteredTutors = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return allTutors;
    return allTutors.filter(tutor => 
      tutor.name.toLowerCase().includes(term) ||
      tutor.email.toLowerCase().includes(term)
    );
  }, [allTutors, searchTerm]);
  
  const handleAssignTutors = () => {
    if (selectedTutorIds.length === 0) {
      toast({
        variant: "destructive",
        title: "No Tutors Selected",
        description: "Please select at least one tutor to assign.",
      });
      return;
    }
    // Mock API call
    console.log(`Assigning tutors ${selectedTutorIds.join(", ")} to enquiry ${enquiryId}`);
    toast({
      title: "Tutors Assigned (Mock)",
      description: `${selectedTutorIds.length} tutor(s) have been notified about this enquiry.`,
    });
    setSelectedTutorIds([]);
  };

  const isAllSelected = filteredTutors.length > 0 && selectedTutorIds.length === filteredTutors.length;
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTutorIds([]);
    } else {
      setSelectedTutorIds(filteredTutors.map(t => t.id));
    }
  };

  const handleSelectTutor = (tutorId: string) => {
    setSelectedTutorIds(prev =>
      prev.includes(tutorId)
        ? prev.filter(id => id !== tutorId)
        : [...prev, tutorId]
    );
  };
  
  const isLoading = isLoadingEnquiry || isLoadingTutors;

  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
        <CardHeader className="p-0">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : enquiryError ? (
            <CardTitle className="text-destructive">Error loading enquiry</CardTitle>
          ) : enquiry && (
            <>
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <Briefcase className="w-5 h-5 mr-2.5" />
                Assign Tutors for Enquiry
              </CardTitle>
              <CardDescription className="text-sm text-foreground/70 mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-primary/80"/><strong>Subject:</strong> {Array.isArray(enquiry.subject) ? enquiry.subject.join(', ') : enquiry.subject}</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-primary/80"/><strong>Grade:</strong> {enquiry.gradeLevel}</span>
              </CardDescription>
            </>
          )}
        </CardHeader>
      </Card>
      
      <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAssignTutors} disabled={selectedTutorIds.length === 0}>
              Assign ({selectedTutorIds.length}) Selected Tutors
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                   <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all tutors"
                  />
                </TableHead>
                <TableHead>Tutor Details</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingTutors ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-5 rounded-sm" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : tutorsError ? (
                 <TableRow><TableCell colSpan={6} className="text-center text-destructive">Failed to load tutors.</TableCell></TableRow>
              ) : filteredTutors.length === 0 ? (
                 <TableRow><TableCell colSpan={6} className="text-center">No tutors found.</TableCell></TableRow>
              ) : (
                filteredTutors.map(tutor => (
                  <TableRow key={tutor.id} data-state={selectedTutorIds.includes(tutor.id) && "selected"}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTutorIds.includes(tutor.id)}
                        onCheckedChange={() => handleSelectTutor(tutor.id)}
                        aria-label={`Select tutor ${tutor.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src={tutor.profilePicUrl} alt={tutor.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{getInitials(tutor.name)}</AvatarFallback>
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
                            {tutor.emailVerified ? <MailCheck className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />} Email
                          </Badge>
                          <Badge variant={tutor.phoneVerified ? "default" : "destructive"} className={cn("text-xs py-0.5 px-2", tutor.phoneVerified ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20")}>
                            {tutor.phoneVerified ? <PhoneCall className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />} Phone
                          </Badge>
                      </div>
                    </TableCell>
                     <TableCell>
                       <Badge variant={tutor.active ? "default" : "destructive"} className="text-xs py-1 px-2.5">
                        {tutor.active ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                        {tutor.active ? 'Active' : 'Inactive'}
                       </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
           </Table>
        </CardContent>
      </Card>
    </div>
  );
}

