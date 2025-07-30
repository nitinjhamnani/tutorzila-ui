
"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";

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

const allSubjectsList: MultiSelectOption[] = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Art", "Music", "Other"].map(s => ({ value: s, label: s }));
const boardsList = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"];
const gradeLevelsList = [
    "Nursery", "LKG", "UKG",
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
    "Grade 11", "Grade 12",
    "College Level", "Adult Learner", "Other"
];


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

function AssignTutorsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const enquiryId = params.enquiryId as string;
  const { token } = useAuthMock();
  const { toast } = useToast();
  
  const [selectedTutorIds, setSelectedTutorIds] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const enquiry = useMemo(() => {
    if (!searchParams) return null;
    return {
        id: enquiryId,
        subject: searchParams.get('subjects')?.split(',') || [],
        gradeLevel: searchParams.get('grade') || '',
        board: searchParams.get('board') || '',
        teachingMode: searchParams.get('mode')?.split(',') || [],
        location: { address: searchParams.get('location') || "" },
        parentName: '',
        studentName: '',
        status: 'open' as const,
        postedAt: new Date().toISOString(),
        scheduleDetails: ''
    };
  }, [searchParams, enquiryId]);
  
  const getInitialFilters = useCallback(() => ({
    subjects: enquiry?.subject || [],
    grade: enquiry?.gradeLevel || '',
    board: enquiry?.board || '',
    isOnline: enquiry?.teachingMode?.includes("Online") || false,
    isOffline: enquiry?.teachingMode?.includes("Offline (In-person)") || false,
    city: "",
    area: "",
  }), [enquiry]);

  const [filters, setFilters] = useState(getInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState(getInitialFilters);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setIsFilterModalOpen(false);
  };
  
  const handleClearFilters = () => {
    const initialFilters = getInitialFilters();
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setIsFilterModalOpen(false);
  };


  const handleFilterChange = (key: keyof typeof filters, value: string | boolean | string[]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleCityChange = (city: string) => {
    setFilters(prev => ({ ...prev, city: city === 'all-cities' ? '' : city, area: '' }));
  };

  const handleAreaChange = (area: string) => {
      setFilters(prev => ({ ...prev, area: area === 'all-areas' ? '' : area }));
  };


  const tutorSearchParams = useMemo(() => {
    const params = new URLSearchParams();
    if(appliedFilters.subjects.length > 0) params.append('subjects', appliedFilters.subjects.join(','));
    if(appliedFilters.grade) params.append('grades', appliedFilters.grade);
    if(appliedFilters.board) params.append('boards', appliedFilters.board);
    if(appliedFilters.isOnline) params.append('isOnline', 'true');
    if(appliedFilters.isOffline) params.append('isOffline', 'true');
    if(appliedFilters.city) params.append('location', appliedFilters.city);
    if(appliedFilters.area) params.append('location', `${appliedFilters.area}, ${appliedFilters.city}`);
    return params;
  }, [appliedFilters]);
  
  const { data: allTutors = [], isLoading: isLoadingTutors, error: tutorsError } = useQuery({
    queryKey: ['assignableTutors', enquiryId, tutorSearchParams.toString()],
    queryFn: () => fetchAssignableTutors(token, tutorSearchParams),
    enabled: !!token && !!enquiry,
    refetchOnWindowFocus: false,
  });

  const uniqueCities = useMemo(() => {
    if (!allTutors) return [];
    return Array.from(new Set(allTutors.map(tutor => tutor.city).filter(Boolean))).sort();
  }, [allTutors]);

  const uniqueAreasInCity = useMemo(() => {
    if (!filters.city || !allTutors) return [];
    return Array.from(new Set(allTutors.filter(tutor => tutor.city === filters.city).map(tutor => tutor.area).filter(Boolean))).sort();
  }, [allTutors, filters.city]);
  
  const handleAssignTutors = () => {
    if (selectedTutorIds.length === 0) {
      toast({
        variant: "destructive",
        title: "No Tutors Selected",
        description: "Please select at least one tutor to assign.",
      });
      return;
    }
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
  
  if (!enquiry) {
    return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
        <CardHeader className="p-0">
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
                 {enquiry.location?.address && <span className="flex items-center gap-1.5 col-span-2"><MapPin className="w-3.5 h-3.5 text-primary/80"/><strong>Location:</strong> {enquiry.location.address}</span>}
              </CardDescription>
            </>
        </CardHeader>
      </Card>
      
      <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2"><UsersRound className="w-5 h-5"/> Available Tutors ({allTutors.length})</h3>
                 <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ListFilter className="w-4 h-4 mr-2"/>
                      Filter Tutors
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Filter Tutors</DialogTitle>
                      <DialogDescription>
                        Refine the list of tutors based on specific criteria.
                      </DialogDescription>
                    </DialogHeader>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="subjects-filter-modal">Subjects</Label>
                             <MultiSelectCommand
                                options={allSubjectsList}
                                selectedValues={filters.subjects}
                                onValueChange={(value) => handleFilterChange('subjects', value)}
                                placeholder="Select subjects..."
                                className="w-full"
                             />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="grade-filter-modal">Grade</Label>
                            <Select onValueChange={(value) => handleFilterChange('grade', value)} value={filters.grade}>
                                 <SelectTrigger id="grade-filter-modal">
                                    <SelectValue placeholder="Select Grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {gradeLevelsList.map(grade => (
                                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="board-filter-modal">Board</Label>
                             <Select onValueChange={(value) => handleFilterChange('board', value)} value={filters.board}>
                                <SelectTrigger id="board-filter-modal">
                                    <SelectValue placeholder="Select Board" />
                                </SelectTrigger>
                                <SelectContent>
                                    {boardsList.map(board => (
                                        <SelectItem key={board} value={board}>{board}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city-filter-modal">City</Label>
                            <Select onValueChange={handleCityChange} value={filters.city}>
                                <SelectTrigger id="city-filter-modal">
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all-cities">All Cities</SelectItem>
                                    {uniqueCities.map(loc => (
                                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="area-filter-modal">Area</Label>
                            <Select onValueChange={handleAreaChange} value={filters.area} disabled={!filters.city}>
                                <SelectTrigger id="area-filter-modal">
                                    <SelectValue placeholder="Select Area" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all-areas">All Areas</SelectItem>
                                    {uniqueAreasInCity.map(loc => (
                                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-4 pt-5 md:col-span-2">
                             <div className="flex items-center space-x-2">
                                <Checkbox id="online-filter-modal" checked={filters.isOnline} onCheckedChange={(checked) => handleFilterChange('isOnline', !!checked)} />
                                <Label htmlFor="online-filter-modal" className="font-medium">Online</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="offline-filter-modal" checked={filters.isOffline} onCheckedChange={(checked) => handleFilterChange('isOffline', !!checked)} />
                                <Label htmlFor="offline-filter-modal" className="font-medium">Offline</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:justify-between">
                        <Button type="button" variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
                        <Button type="button" onClick={handleApplyFilters}>Apply Filters</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
        <CardFooter className="p-4 border-t">
          <Button onClick={handleAssignTutors} disabled={selectedTutorIds.length === 0}>
              Assign ({selectedTutorIds.length}) Selected Tutors
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AssignTutorsToEnquiryPage() {
    return (
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
            <AssignTutorsContent />
        </Suspense>
    )
}
