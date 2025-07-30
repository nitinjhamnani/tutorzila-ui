
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  BookOpen,
  MapPin,
  RadioTower,
  DollarSign,
  Building
} from "lucide-react";

// API Fetching Functions

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

const fetchAssignableTutors = async (token: string | null, params: URLSearchParams): Promise<ApiTutor[]> => {
  if (!token) throw new Error("Authentication token not found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/search/tutors?${params.toString()}`, {
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
  
  const { data: enquiry, isLoading: isLoadingEnquiry, error: enquiryError } = useQuery({
    queryKey: ['adminEnquiryDetails', enquiryId],
    queryFn: () => fetchAdminEnquiryDetails(enquiryId, token),
    enabled: !!token && !!enquiryId,
  });

  const tutorSearchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (enquiry) {
        if(enquiry.subject.length > 0) params.append('subjects', enquiry.subject.join(','));
        if(enquiry.gradeLevel) params.append('grades', enquiry.gradeLevel);
        if(enquiry.board) params.append('boards', enquiry.board);
        if(enquiry.teachingMode?.includes("Online")) params.append('isOnline', 'true');
        if(enquiry.teachingMode?.includes("Offline (In-person)")) params.append('isOffline', 'true');
    }
    return params;
  }, [enquiry]);
  
  const { data: allTutors = [], isLoading: isLoadingTutors, error: tutorsError } = useQuery({
    queryKey: ['assignableTutors', enquiryId, tutorSearchParams.toString()],
    queryFn: () => fetchAssignableTutors(token, tutorSearchParams),
    enabled: !!token && !!enquiry,
  });
  
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

  const isAllSelected = allTutors.length > 0 && selectedTutorIds.length === allTutors.length;
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTutorIds([]);
    } else {
      setSelectedTutorIds(allTutors.map(t => t.id));
    }
  };

  const handleSelectTutor = (tutorId: string) => {
    setSelectedTutorIds(prev =>
      prev.includes(tutorId)
        ? prev.filter(id => id !== tutorId)
        : [...prev, tutorId]
    );
  };
  
  const isLoading = isLoadingEnquiry;

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
                <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-primary/80"/><strong>Board:</strong> {enquiry.board}</span>
                <span className="flex items-center gap-1.5"><RadioTower className="w-3.5 h-3.5 text-primary/80"/><strong>Mode:</strong> {enquiry.teachingMode.join(', ')}</span>
              </CardDescription>
            </>
          )}
        </CardHeader>
      </Card>
      
      <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-base font-semibold text-foreground">Recommended Tutors</h3>
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
                <TableHead>Experience & Rate</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Qualifications</TableHead>
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
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : tutorsError ? (
                 <TableRow><TableCell colSpan={6} className="text-center text-destructive">Failed to load tutors.</TableCell></TableRow>
              ) : allTutors.length === 0 ? (
                 <TableRow><TableCell colSpan={6} className="text-center">No tutors found for these criteria.</TableCell></TableRow>
              ) : (
                allTutors.map(tutor => (
                  <TableRow key={tutor.id} data-state={selectedTutorIds.includes(tutor.id) && "selected"}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTutorIds.includes(tutor.id)}
                        onCheckedChange={() => handleSelectTutor(tutor.id)}
                        aria-label={`Select tutor ${tutor.displayName}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{tutor.displayName}</div>
                        <div className="text-xs text-muted-foreground">{tutor.area}, {tutor.city}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                        <div className="flex flex-col gap-1">
                           <span className="font-medium">{tutor.experienceYears}</span>
                           <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="w-3 h-3"/> {tutor.hourlyRate}/hr {tutor.isRateNegotiable && "(Neg.)"}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjectsList.slice(0, 2).map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                        {tutor.subjectsList.length > 2 && <Badge variant="outline">+{tutor.subjectsList.length - 2}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-wrap gap-1">
                        {tutor.qualificationList.slice(0, 1).map(q => <Badge key={q} variant="secondary" className="font-normal">{q}</Badge>)}
                        {tutor.qualificationList.length > 1 && <Badge variant="outline">+{tutor.qualificationList.length - 1}</Badge>}
                      </div>
                    </TableCell>
                     <TableCell>
                       <Badge variant={tutor.isActive ? "default" : "destructive"} className="text-xs py-1 px-2.5">
                        {tutor.isActive ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                        {tutor.isActive ? 'Active' : 'Inactive'}
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
