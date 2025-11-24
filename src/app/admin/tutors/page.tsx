
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from 'date-fns';
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ApiTutor } from "@/types";
import { useToast } from "@/hooks/use-toast";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  RadioTower,
  Users as UsersIcon,
  ShieldCheck,
  Search,
  Trash2,
} from "lucide-react";
import { AddUserModal } from "@/components/admin/modals/AddUserModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { allSubjectsList, boardsList, gradeLevelsList } from "@/lib/constants";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Input } from "@/components/ui/input";


const fetchAdminTutors = async (token: string | null, params: URLSearchParams): Promise<ApiTutor[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/search/tutors?${params.toString()}`, {
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
  
  return data.map((tutor: any) => ({
    id: tutor.tutorId,
    displayName: tutor.tutorName,
    name: tutor.tutorName,
    subjectsList: tutor.subjects ? tutor.subjects.split(',').map((s:string) => s.trim()) : [],
    gradesList: tutor.grades ? tutor.grades.split(',').map((g:string) => g.trim()) : [],
    boardsList: tutor.boards ? tutor.boards.split(',').map((b:string) => b.trim()) : [],
    area: tutor.area,
    city: tutor.city,
    state: tutor.state,
    googleMapsLink: tutor.googleMapLink,
    createdAt: tutor.createdAt,
    registeredDate: tutor.createdAt,
    gender: tutor.gender,
    isActive: tutor.active,
    registered: tutor.registered,
    isBioReviewed: tutor.bioReviewed,
    online: tutor.online,
    offline: tutor.offline,
    isVerified: tutor.verified,
    profilePicUrl: tutor.profilePicUrl,
  }));
};

const removeTutorApi = async ({ tutorId, token }: { tutorId: string, token: string | null }) => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/manage/tutor/remove/${tutorId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    throw new Error("Failed to remove tutor.");
  }
  return true;
};

const getInitials = (name: string): string => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
};


export default function AdminTutorsPage() {
  const { token } = useAuthMock();
  const { toast } = useToast();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { hideLoader, showLoader } = useGlobalLoader();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [tutorToRemove, setTutorToRemove] = useState<ApiTutor | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const initialFilters = {
    subjects: [],
    grade: '',
    board: '',
    isOnline: false,
    isOffline: false,
    city: "",
    area: "",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

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

  const { data: tutors = [], isLoading, error } = useQuery<ApiTutor[]>({
    queryKey: ['adminAllTutors', token, tutorSearchParams.toString()],
    queryFn: () => fetchAdminTutors(token, tutorSearchParams),
    enabled: !!token,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const removeTutorMutation = useMutation({
    mutationFn: (tutorId: string) => removeTutorApi({ tutorId, token }),
    onSuccess: (_, tutorId) => {
      toast({
        title: "Tutor Removed",
        description: `The tutor has been successfully removed.`,
      });
      queryClient.invalidateQueries({ queryKey: ['adminAllTutors'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Removal Failed",
        description: error.message,
      });
    },
    onSettled: () => {
      setTutorToRemove(null);
    }
  });

  
  const filteredTutors = useMemo(() => {
    if (!searchTerm) return tutors;
    const lowercasedFilter = searchTerm.toLowerCase();
    return tutors.filter((tutor) => {
      const includesName = tutor.displayName.toLowerCase().includes(lowercasedFilter);
      const includesSubject = tutor.subjectsList.some(s => s.toLowerCase().includes(lowercasedFilter));
      const includesGrade = tutor.gradesList.some(g => g.toLowerCase().includes(lowercasedFilter));
      const includesMode = (tutor.online && 'online'.includes(lowercasedFilter)) || (tutor.offline && 'offline'.includes(lowercasedFilter));
      return includesName || includesSubject || includesGrade || includesMode;
    });
  }, [searchTerm, tutors]);


  useEffect(() => {
    if (!isLoading) {
      hideLoader();
    }
  }, [isLoading, hideLoader]);

  const handleAddUserSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['adminAllTutors'] });
  };
  
  const handleViewTutor = (tutor: ApiTutor) => {
    showLoader("Loading tutor details...");
    router.push(`/admin/tutors/${tutor.id}`);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setIsFilterModalOpen(false);
  };
  
  const handleClearFilters = () => {
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

  const handleRemoveClick = (tutor: ApiTutor) => {
    setTutorToRemove(tutor);
  };

  const handleConfirmRemove = () => {
    if (tutorToRemove) {
      removeTutorMutation.mutate(tutorToRemove.id);
    }
  };

  const uniqueCities = useMemo(() => {
    if (!tutors) return [];
    return Array.from(new Set(tutors.map(tutor => tutor.city).filter(Boolean))).sort();
  }, [tutors]);

  const uniqueAreasInCity = useMemo(() => {
    if (!filters.city || !tutors) return [];
    return Array.from(new Set(tutors.filter(tutor => tutor.city === filters.city).map(tutor => tutor.area).filter(Boolean))).sort();
  }, [tutors, filters.city]);


  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(8)].map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={8}><Skeleton className="h-10 w-full" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    
    if (error) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="h-24 text-center">
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

    if (filteredTutors.length === 0) {
      return (
         <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="h-24 text-center">
               <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Users className="h-8 w-8" />
                <span className="font-semibold">No Tutors Found</span>
                <span className="text-sm">There are no tutors that match the current filters.</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {filteredTutors.map((tutor) => (
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
                    <div className="text-xs text-muted-foreground">
                        {[tutor.area, tutor.city].filter(Boolean).join(', ')}
                    </div>
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
             <TableCell className="text-xs">
               {tutor.isActive ? 'Yes' : 'No'}
            </TableCell>
            <TableCell className="text-xs">{tutor.createdAt ? format(new Date(tutor.createdAt), "MMM d, yyyy, p") : 'N/A'}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleViewTutor(tutor)}>
                    <Settings className="h-4 h-4" />
                </Button>
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleRemoveClick(tutor)}>
                    <Trash2 className="h-4 h-4" />
                </Button>
              </div>
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
           <Button onClick={() => setIsAddUserModalOpen(true)} size="sm" className="h-9 w-9 p-0 sm:w-auto sm:px-4 sm:py-1.5">
            <UserPlus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Tutor</span>
          </Button>
        </CardHeader>
      </Card>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, subject, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-card"
          />
        </div>
        <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto flex-shrink-0 bg-card text-primary border-primary">
                <ListFilter className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Filter Tutors</DialogTitle>
                <DialogDescription>
                  Refine the list of tutors based on specific criteria.
                </DialogDescription>
              </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
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
      
      <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tutor Details</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Grades</TableHead>
                <TableHead>Boards</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Created At</TableHead>
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
      <AlertDialog open={!!tutorToRemove} onOpenChange={() => setTutorToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently remove the tutor <strong>{tutorToRemove?.displayName}</strong>. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTutorToRemove(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={removeTutorMutation.isPending}
            >
              {removeTutorMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    