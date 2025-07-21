
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDesc,
  DialogFooter
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ParentEnquiryCard } from "@/components/parent/ParentEnquiryCard";
import type { User, TuitionRequirement } from "@/types";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ListChecks,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  Eye,
  Trash2,
  Edit3,
  Users as UsersIcon,
  PlusCircle,
} from "lucide-react";
import { CreateEnquiryFormModal } from "@/components/parent/modals/CreateEnquiryFormModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type EnquiryStatusCategory = "All" | "Open" | "Matched" | "Closed";

const enquiryStatusCategories: {
  label: string;
  value: EnquiryStatusCategory;
  icon: React.ElementType;
}[] = [
  { label: "All Enquiries", value: "All", icon: ListChecks },
  { label: "Open", value: "Open", icon: Eye },
  { label: "Matched", value: "Matched", icon: UsersIcon },
  { label: "Closed", value: "Closed", icon: Archive },
];

const fetchParentEnquiries = async (token: string | null): Promise<TuitionRequirement[]> => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/parent/enquiries`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch enquiries.");
  }
  
  const data = await response.json();
  
  return data.map((item: any) => ({
    id: item.enquiryId,
    parentId: "", 
    parentName: "", 
    subject: typeof item.subjects === 'string' ? item.subjects.split(',').map((s: string) => s.trim()) : [],
    gradeLevel: item.grade,
    scheduleDetails: item.initial || "Details not provided by API",
    location: item.location,
    status: item.status?.toLowerCase() || 'open',
    postedAt: new Date().toISOString(),
    board: item.board,
    teachingMode: [
      ...(item.online ? ["Online"] : []),
      ...(item.offline ? ["Offline (In-person)"] : []),
    ],
    applicantsCount: item.appliedTutors,
  }));
};

export default function ParentMyEnquiriesPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeFilterCategory, setActiveFilterCategory] = useState<EnquiryStatusCategory>("Open");
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isCloseEnquiryModalOpen, setIsCloseEnquiryModalOpen] = useState(false);
  const [closeEnquiryStep, setCloseEnquiryStep] = useState(1);
  const [foundTutorName, setFoundTutorName] = useState("");
  const [startClassesConfirmation, setStartClassesConfirmation] = useState< "yes" | "no" | "">("");
  const [selectedRequirementForAction, setSelectedRequirementForAction] = useState<TuitionRequirement | null>(null);

  const [isCreateEnquiryModalOpen, setIsCreateEnquiryModalOpen] = useState(false);

  const { data: allRequirements = [], isLoading: isLoadingEnquiries, error: enquiriesError } = useQuery({
    queryKey: ['parentEnquiries', token],
    queryFn: () => fetchParentEnquiries(token),
    enabled: !!token && !!user && user.role === 'parent',
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated || user?.role !== "parent") {
        router.replace("/");
      }
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);
  
  const handleSuccess = () => {
    setIsCreateEnquiryModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['parentEnquiries'] });
  };


  const categoryCounts = useMemo(() => {
    const counts = {
      All: allRequirements.length,
      Open: allRequirements.filter((req) => req.status === "open").length,
      Matched: allRequirements.filter((req) => req.status === "matched").length,
      Closed: allRequirements.filter((req) => req.status === "closed").length,
    };
    return counts;
  }, [allRequirements]);

  const filteredRequirements = useMemo(() => {
    if (activeFilterCategory === "All") {
      return allRequirements;
    }
    return allRequirements.filter(
      (req) => req.status.toLowerCase() === activeFilterCategory.toLowerCase()
    );
  }, [allRequirements, activeFilterCategory]);

  const handleOpenDeleteConfirm = (requirement: TuitionRequirement) => {
    setSelectedRequirementForAction(requirement);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedRequirementForAction) return;
    toast({
      title: "Deletion (Mock)",
      description: `Requirement for "${Array.isArray(selectedRequirementForAction.subject) ? selectedRequirementForAction.subject.join(', ') : selectedRequirementForAction.subject}" would be deleted.`,
    });
    setIsDeleteConfirmOpen(false);
    setSelectedRequirementForAction(null);
  };

  const handleOpenCloseEnquiryModal = (requirement: TuitionRequirement) => {
    setSelectedRequirementForAction(requirement);
    setCloseEnquiryStep(1);
    setFoundTutorName("");
    setStartClassesConfirmation("");
    setIsCloseEnquiryModalOpen(true);
  };

  const handleCloseEnquiryDialogAction = () => {
    if (!selectedRequirementForAction) return;

    if (closeEnquiryStep === 1) {
      setCloseEnquiryStep(2);
    } else if (closeEnquiryStep === 2) {
      toast({
        title: "Enquiry Closed (Mock)",
        description: `Requirement for "${Array.isArray(selectedRequirementForAction.subject) ? selectedRequirementForAction.subject.join(', ') : selectedRequirementForAction.subject}" would be marked as closed.`,
      });
      setIsCloseEnquiryModalOpen(false);
      setSelectedRequirementForAction(null);
    }
  };

  const handleReopen = (id: string) => {
    router.push(`/parent/my-enquiries/${id}`); 
  };
  
  const selectedCategoryData = enquiryStatusCategories.find(cat => cat.value === activeFilterCategory);

  if (isCheckingAuth || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading My Enquiries...
      </div>
    );
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Dialog open={isCreateEnquiryModalOpen} onOpenChange={setIsCreateEnquiryModalOpen}>
          <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
            <CardHeader className="p-0 mb-0 flex flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-grow min-w-0">
                <CardTitle className="text-xl font-semibold text-primary flex items-center">
                  <ListChecks className="w-5 h-5 mr-2.5" />
                  My Enquiries
                </CardTitle>
                <CardDescription className="text-sm text-foreground/70 mt-1">
                  Manage your posted tuition requirements and track their status.
                </CardDescription>
              </div>
              <DialogTrigger asChild>
                  <Button
                      variant="default"
                      size="sm"
                      className={cn(
                          "text-xs sm:text-sm py-2.5 md:px-3 px-2 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-center gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                      )}
                    >
                      <PlusCircle className="w-4 h-4 opacity-90 md:mr-1.5" />
                      <span className="hidden md:inline">Create Enquiry</span>
                    </Button>
                </DialogTrigger>
            </CardHeader>
          </Card>
          <CreateEnquiryFormModal onSuccess={handleSuccess} />
        </Dialog>


        <div className="flex justify-end mb-4 sm:mb-6">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="default"
                size="sm" 
                className={cn(
                    "py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90",
                    "text-xs sm:text-sm rounded-[5px]"
                )}
                >
                <span className="text-primary-foreground">
                    {selectedCategoryData?.label || "Filter"} ({selectedCategoryData ? categoryCounts[selectedCategoryData.value] : 'N/A'})
                </span>
                <ChevronDown className="w-4 h-4 opacity-70 text-primary-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {enquiryStatusCategories.map((category) => (
                <DropdownMenuItem
                    key={category.value}
                    onClick={() => setActiveFilterCategory(category.value)}
                    className={cn(
                    "text-sm",
                    activeFilterCategory === category.value && "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary hover:text-primary-foreground focus:text-primary-foreground"
                    )}
                >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.label} ({categoryCounts[category.value]})
                </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          {isLoadingEnquiries ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-[150px] w-full rounded-lg" />)
          ) : enquiriesError ? (
            <Card className="text-center py-12 bg-destructive/10 border-destructive/20 rounded-lg shadow-sm">
                <CardContent className="flex flex-col items-center">
                    <XCircle className="w-16 h-16 text-destructive mx-auto mb-5" />
                    <p className="text-xl font-semibold text-destructive mb-1.5">Error Fetching Enquiries</p>
                    <p className="text-sm text-destructive/80 max-w-sm mx-auto">Could not load your enquiries. Please try again later.</p>
                </CardContent>
            </Card>
          ) : filteredRequirements.length > 0 ? (
            filteredRequirements.map((req) => (
              <ParentEnquiryCard
                key={req.id}
                requirement={req}
                onEdit={() => router.push(`/parent/my-enquiries/${req.id}`)}
                onReopen={() => handleReopen(req.id)}
              />
            ))
          ) : (
            <Card className="text-center py-12 bg-card border rounded-lg shadow-sm">
              <CardContent className="flex flex-col items-center">
                <ListChecks className="w-16 h-16 text-primary/30 mx-auto mb-5" />
                <p className="text-xl font-semibold text-foreground/70 mb-1.5">
                  No Enquiries Found
                </p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  There are no enquiries matching "{activeFilterCategory}". Try a different filter or post a new requirement.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {selectedRequirementForAction && (
          <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  tuition requirement for "${Array.isArray(selectedRequirementForAction.subject) ? selectedRequirementForAction.subject.join(', ') : selectedRequirementForAction.subject}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedRequirementForAction(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {selectedRequirementForAction && (
          <Dialog open={isCloseEnquiryModalOpen} onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedRequirementForAction(null);
            setIsCloseEnquiryModalOpen(isOpen);
          }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Close Enquiry: {Array.isArray(selectedRequirementForAction.subject) ? selectedRequirementForAction.subject.join(', ') : selectedRequirementForAction.subject}</DialogTitle>
                <DialogDesc> 
                  Please provide some details before closing this requirement.
                </DialogDesc>
              </DialogHeader>
              {closeEnquiryStep === 1 && (
                <div className="py-4 space-y-4">
                  <Label htmlFor="foundTutor">Did you find a tutor for this requirement?</Label>
                  <Input
                    id="foundTutor"
                    placeholder="Enter Tutor's Name (Optional)"
                    value={foundTutorName}
                    onChange={(e) => setFoundTutorName(e.target.value)}
                  />
                </div>
              )}
              {closeEnquiryStep === 2 && (
                <div className="py-4 space-y-4">
                  <Label>Would you like to start classes with {foundTutorName || "the selected tutor"}?</Label>
                  <RadioGroup
                    onValueChange={(value: "yes" | "no") => setStartClassesConfirmation(value)}
                    value={startClassesConfirmation}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="start-yes" />
                      <Label htmlFor="start-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="start-no" />
                      <Label htmlFor="start-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button" onClick={handleCloseEnquiryDialogAction}>
                  {closeEnquiryStep === 1 ? "Next" : "Confirm & Close"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </main>
  );
}
