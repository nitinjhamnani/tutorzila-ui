
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import type { TuitionRequirement, User } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FilterIcon as LucideFilterIcon, Star, CheckCircle, Bookmark, ListChecks, ChevronDown, Briefcase, XIcon, BookOpen, Users as UsersIcon, MapPin, RadioTower, XCircle as ErrorIcon, Loader2, Settings, Search, User as UserIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelectCommand, type Option as MultiSelectOption } from "@/components/ui/multi-select-command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allSubjectsList, boardsList, gradeLevelsList, teachingModeOptions } from "@/lib/constants";


const fetchAdminEnquiries = async (token: string | null): Promise<TuitionRequirement[]> => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/manage/enquiry/list`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    if (response.status === 504) {
      throw new Error("The server took too long to respond (504 Gateway Timeout). Please try again later.");
    }
    throw new Error("Failed to fetch enquiries.");
  }
  
  const data = await response.json();
  
  return data.map((item: any, index: number) => ({
    id: item.enquiryId || `enq-${index}-${Date.now()}`,
    enquiryCode: item.enquiryCode,
    parentName: item.parentName || "A Parent", 
    studentName: item.studentName,
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
    applicantsCount: item.assignedTutors,
  }));
};

const initialFilters = {
  subjects: [],
  grade: 'All',
  board: 'All',
  teachingMode: [],
};


export default function AdminAllEnquiriesPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { showLoader, hideLoader } = useGlobalLoader();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);


  const { data: allRequirements = [], isLoading, error } = useQuery({
    queryKey: ['adminAllEnquiries', token],
    queryFn: () => fetchAdminEnquiries(token),
    enabled: !!token && !!user && user.role === 'admin',
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
  
  const filteredAndSortedRequirements = useMemo(() => {
    let requirements = allRequirements;

    // Tab filtering
    if (activeTab === "applied") {
        requirements = allRequirements.filter(req => (req.applicantsCount ?? 0) > 0);
    } else if (activeTab === "assigned") {
        requirements = allRequirements.filter(req => req.status === "matched");
    }

    // Modal filters
    if (appliedFilters.subjects.length > 0) {
      requirements = requirements.filter(req => req.subject.some(s => appliedFilters.subjects.includes(s)));
    }
    if (appliedFilters.grade !== 'All') {
      requirements = requirements.filter(req => req.gradeLevel === appliedFilters.grade);
    }
    if (appliedFilters.board !== 'All') {
      requirements = requirements.filter(req => req.board === appliedFilters.board);
    }
    if (appliedFilters.teachingMode.length > 0) {
      requirements = requirements.filter(req => req.teachingMode?.some(m => appliedFilters.teachingMode.includes(m)));
    }

    // Search term filtering
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      requirements = requirements.filter((req) => {
        const includesEnquiryCode = req.enquiryCode?.toLowerCase().includes(lowercasedFilter);
        const includesStudentName = req.studentName?.toLowerCase().includes(lowercasedFilter);
        const includesSubject = req.subject.some(s => s.toLowerCase().includes(lowercasedFilter));
        const includesGrade = req.gradeLevel.toLowerCase().includes(lowercasedFilter);
        const includesMode = req.teachingMode?.some(m => m.toLowerCase().includes(lowercasedFilter));
        return includesEnquiryCode || includesStudentName || includesSubject || includesGrade || includesMode;
      });
    }

    return requirements.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  }, [searchTerm, allRequirements, activeTab, appliedFilters]);

  const totalPages = Math.ceil(filteredAndSortedRequirements.length / itemsPerPage);

  const paginatedRequirements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedRequirements.slice(startIndex, endIndex);
  }, [filteredAndSortedRequirements, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [searchTerm, activeTab, appliedFilters]);


  useEffect(() => {
    if (isLoading) {
      showLoader("Fetching enquiries...");
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setIsFilterModalOpen(false);
  };
  
  const handleClearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setIsFilterModalOpen(false);
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={9}>
                <Skeleton className="h-8 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    
    if (error) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={9} className="text-center text-destructive py-10">
              <ErrorIcon className="mx-auto h-8 w-8 mb-2"/>
              <p className="font-semibold">Error Fetching Enquiries</p>
              <p className="text-sm">{(error as Error).message}</p>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (paginatedRequirements.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={9} className="text-center py-12">
               <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ListChecks className="h-12 w-12 text-primary/30" />
                <p className="font-semibold">No Enquiries Found</p>
                <p className="text-sm">There are no tuition enquiries matching your search or filter.</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {paginatedRequirements.map((req) => (
          <TableRow key={req.id}>
            <TableCell className="font-medium text-foreground">{req.enquiryCode}</TableCell>
            <TableCell className="font-medium text-foreground">{req.studentName}</TableCell>
            <TableCell className="font-medium">
              <div className="text-foreground">{Array.isArray(req.subject) ? req.subject.join(', ') : req.subject}</div>
            </TableCell>
            <TableCell className="text-xs">{req.gradeLevel}</TableCell>
            <TableCell className="text-xs">{req.board}</TableCell>
            <TableCell className="text-xs">{req.teachingMode?.join(' / ')}</TableCell>
            <TableCell className="text-xs">{format(new Date(req.postedAt), "MMM d, yyyy")}</TableCell>
            <TableCell>
              <Badge variant="default">{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</Badge>
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
    );
  };

  const renderEnquiryList = () => {
    return (
       <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
             <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code, subject, grade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-background"
              />
            </div>
             <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                        <LucideFilterIcon className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Filter Enquiries</DialogTitle>
                        <DialogDescription>
                            Refine the list of enquiries based on specific criteria.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                        <div className="space-y-2 md:col-span-2">
                            <Label>Subjects</Label>
                            <MultiSelectCommand
                                options={allSubjectsList}
                                selectedValues={filters.subjects}
                                onValueChange={(value) => setFilters(prev => ({...prev, subjects: value}))}
                                placeholder="Select subjects..."
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Grade</Label>
                            <Select onValueChange={(value) => setFilters(prev => ({...prev, grade: value}))} value={filters.grade}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Grades</SelectItem>
                                    {gradeLevelsList.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Board</Label>
                            <Select onValueChange={(value) => setFilters(prev => ({...prev, board: value}))} value={filters.board}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Boards</SelectItem>
                                    {boardsList.map(board => <SelectItem key={board} value={board}>{board}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Teaching Mode</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {teachingModeOptions.map(item => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`mode-filter-${item.id}`}
                                        checked={filters.teachingMode.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            setFilters(prev => ({
                                                ...prev,
                                                teachingMode: checked
                                                    ? [...prev.teachingMode, item.id]
                                                    : prev.teachingMode.filter(m => m !== item.id)
                                            }));
                                        }}
                                    />
                                    <Label htmlFor={`mode-filter-${item.id}`} className="font-normal">{item.label}</Label>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:justify-between">
                        <Button type="button" variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
                        <Button type="button" onClick={handleApplyFilters}>Apply Filters</Button>
                    </DialogFooter>
                </DialogContent>
             </Dialog>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Board</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {renderTableBody()}
          </Table>
        </CardContent>
         <CardFooter className="flex justify-between items-center py-3 px-4 border-t">
          <div className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center gap-4 justify-start mb-4">
                <TabsList className="bg-transparent p-0 gap-2 h-auto">
                    <TabsTrigger 
                        value="all" 
                        className="text-sm px-4 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-card data-[state=inactive]:border data-[state=inactive]:border-border data-[state=inactive]:text-foreground data-[state=inactive]:hover:bg-primary/10 data-[state=inactive]:hover:border-primary/50"
                    >
                        All Enquiries
                    </TabsTrigger>
                    <TabsTrigger 
                        value="applied" 
                        className="text-sm px-4 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-card data-[state=inactive]:border data-[state=inactive]:border-border data-[state=inactive]:text-foreground data-[state=inactive]:hover:bg-primary/10 data-[state=inactive]:hover:border-primary/50"
                    >
                        Applied
                    </TabsTrigger>
                    <TabsTrigger 
                        value="assigned" 
                        className="text-sm px-4 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-card data-[state=inactive]:border data-[state=inactive]:border-border data-[state=inactive]:text-foreground data-[state=inactive]:hover:bg-primary/10 data-[state=inactive]:hover:border-primary/50"
                    >
                        Assigned
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="all">{renderEnquiryList()}</TabsContent>
            <TabsContent value="applied">{renderEnquiryList()}</TabsContent>
            <TabsContent value="assigned">{renderEnquiryList()}</TabsContent>
        </Tabs>
    </div>
  );
}

