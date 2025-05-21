
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDesc, 
  DialogFooter,
  DialogClose,
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
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ListChecks,
  FilterIcon as LucideFilterIcon,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  Trash2,
  Edit3,
  Eye,
  UserCheck,
  Users,
  Briefcase,
  Send,
  PlusCircle,
} from "lucide-react";
import { ParentEnquiryModal } from "@/components/parent/modals/ParentEnquiryModal";

type EnquiryStatusCategory = "All" | "Open" | "Matched" | "Closed";

const enquiryStatusCategories: {
  label: string;
  value: EnquiryStatusCategory;
  icon: React.ElementType;
}[] = [
  { label: "All Enquiries", value: "All", icon: ListChecks },
  { label: "Open", value: "Open", icon: Eye },
  { label: "Matched", value: "Matched", icon: UserCheck },
  { label: "Closed", value: "Closed", icon: Archive },
];

export default function ParentMyEnquiriesPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();

  const [allRequirements, setAllRequirements] = useState<TuitionRequirement[]>([]);
  const [activeFilterCategory, setActiveFilterCategory] = useState<EnquiryStatusCategory>("Open");
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isCloseEnquiryModalOpen, setIsCloseEnquiryModalOpen] = useState(false);
  const [closeEnquiryStep, setCloseEnquiryStep] = useState(1);
  const [foundTutorName, setFoundTutorName] = useState("");
  const [startClassesConfirmation, setStartClassesConfirmation] = useState< "yes" | "no" | "">("");
  const [selectedRequirementForAction, setSelectedRequirementForAction] = useState<TuitionRequirement | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEnquiryForEdit, setSelectedEnquiryForEdit] = useState<TuitionRequirement | null>(null);


  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || user?.role !== "parent")) {
      router.replace("/");
    } else if (user) {
      const parentRequirements = MOCK_ALL_PARENT_REQUIREMENTS.filter(
        (req) => req.parentId === user.id
      );
      setAllRequirements(parentRequirements);
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

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

  const handleOpenEditModal = (requirement: TuitionRequirement) => {
    setSelectedEnquiryForEdit(requirement);
    setIsEditModalOpen(true);
  };

  const handleUpdateEnquiryInList = (updatedData: Partial<TuitionRequirement>) => {
    if (!selectedEnquiryForEdit) return;
    setAllRequirements(prevReqs => 
      prevReqs.map(req => 
        req.id === selectedEnquiryForEdit.id ? { ...req, ...updatedData } : req
      )
    );
    toast({
      title: "Enquiry Updated",
      description: `Requirement for "${Array.isArray(updatedData.subject) ? updatedData.subject.join(', ') : updatedData.subject}" has been updated.`,
    });
    setIsEditModalOpen(false);
    setSelectedEnquiryForEdit(null);
  };


  const handleOpenDeleteConfirm = (requirement: TuitionRequirement) => {
    setSelectedRequirementForAction(requirement);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedRequirementForAction) return;
    setAllRequirements((prev) =>
      prev.filter((req) => req.id !== selectedRequirementForAction.id)
    );
    toast({
      title: "Enquiry Deleted",
      description: `Requirement for "${Array.isArray(selectedRequirementForAction.subject) ? selectedRequirementForAction.subject.join(', ') : selectedRequirementForAction.subject}" has been deleted.`,
      variant: "destructive",
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
      setAllRequirements((prev) =>
        prev.map((req) =>
          req.id === selectedRequirementForAction.id
            ? {
                ...req,
                status: "closed",
                additionalNotes: `${req.additionalNotes || ""}\nUpdate: Requirement closed. ${
                  foundTutorName
                    ? `Tutor found: ${foundTutorName}.`
                    : "No tutor specified."
                } ${
                  startClassesConfirmation === "yes"
                    ? "Classes started."
                    : startClassesConfirmation === "no"
                    ? "Decided not to start classes."
                    : ""
                }`,
              }
            : req
        )
      );
      toast({
        title: "Enquiry Closed",
        description: `Requirement for "${Array.isArray(selectedRequirementForAction.subject) ? selectedRequirementForAction.subject.join(', ') : selectedRequirementForAction.subject}" has been marked as closed.`,
      });
      setIsCloseEnquiryModalOpen(false);
      setSelectedRequirementForAction(null);
    }
  };

  const handleReopen = (id: string) => {
    const reqToReopen = allRequirements.find(req => req.id === id);
    if (reqToReopen) {
      setAllRequirements(prev => prev.map(r => 
        r.id === id ? { ...r, status: "open" } : r
      ));
      handleOpenEditModal({ ...reqToReopen, status: "open" }); 
    }
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
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-grow min-w-0">
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <ListChecks className="w-5 h-5 mr-2.5" />
                My Enquiries
              </CardTitle>
              <CardDescription className="text-sm text-foreground/70 mt-1">
                Manage your posted tuition requirements and track their status.
              </CardDescription>
            </div>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className={cn(
                    "text-xs py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto rounded-[5px]"
                  )}
                >
                  <LucideFilterIcon className="w-3.5 h-3.5 mr-1 text-primary-foreground/80" />
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
                      activeFilterCategory === category.value && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                    )}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.label} ({categoryCounts[category.value]})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Enquiries</p>
                    <p className="text-xl font-semibold text-primary">{categoryCounts.All}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Open Enquiries</p>
                    <p className="text-xl font-semibold text-green-600">{categoryCounts.Open}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Archive className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Closed Enquiries</p>
                    <p className="text-xl font-semibold text-gray-600">{categoryCounts.Closed}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-4">
          {filteredRequirements.length > 0 ? (
            filteredRequirements.map((req) => (
              <ParentEnquiryCard
                key={req.id}
                requirement={req}
                onEdit={() => handleOpenEditModal(req)}
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
                  tuition requirement for "{Array.isArray(selectedRequirementForAction.subject) ? selectedRequirementForAction.subject.join(', ') : selectedRequirementForAction.subject}".
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

        <ParentEnquiryModal 
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            enquiryData={selectedEnquiryForEdit}
            onUpdateEnquiry={handleUpdateEnquiryInList}
        />
      </div>
    </main>
  );
}
