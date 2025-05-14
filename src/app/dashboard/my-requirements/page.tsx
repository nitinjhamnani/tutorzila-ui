
// src/app/dashboard/my-requirements/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusCircle, ListChecks, Search, Edit3, Trash2, XCircle, CheckCircle as CheckCircleIcon, Archive, Send, UserCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { TuitionRequirement } from "@/types";
import { TuitionRequirementCard } from "@/components/tuitions/TuitionRequirementCard";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingPostRequirementButton } from "@/components/shared/FloatingPostRequirementButton";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";


export default function MyRequirementsPage() {
  const { user } = useAuthMock();
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [allRequirements, setAllRequirements] = useState<TuitionRequirement[]>([]);
  
  const [selectedRequirement, setSelectedRequirement] = useState<TuitionRequirement | null>(null);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [foundTutor, setFoundTutor] = useState<boolean | null>(null);
  const [tutorName, setTutorName] = useState("");
  const [isStartClassesConfirmOpen, setIsStartClassesConfirmOpen] = useState(false);
  const [isTutorNameModalOpen, setIsTutorNameModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);


  useEffect(() => {
    if (user) {
      setAllRequirements(MOCK_ALL_PARENT_REQUIREMENTS.filter(req => req.parentId === user.id || req.parentName === user.name));
    }
  }, [user]);

  const currentRequirements = useMemo(() => allRequirements.filter(req => req.status === 'open' || req.status === 'matched'), [allRequirements]);
  const pastRequirements = useMemo(() => allRequirements.filter(req => req.status === 'closed'), [allRequirements]);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/my-requirements/edit/${id}`);
  };

  const openDeleteConfirm = (id: string) => {
    const requirementToDelete = allRequirements.find(req => req.id === id);
    if (requirementToDelete) {
        setSelectedRequirement(requirementToDelete); 
        setIsDeleteConfirmOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedRequirement) {
      setAllRequirements(prev => prev.filter(req => req.id !== selectedRequirement.id));
      toast({ 
        title: "Requirement Deleted", 
        description: `Requirement for ${selectedRequirement.subject.join(', ')} has been removed.`,
        variant: "destructive"
      });
    }
    setIsDeleteConfirmOpen(false);
    setSelectedRequirement(null);
  };

  const handleCloseRequirement = (id: string) => {
    const reqToClose = allRequirements.find(req => req.id === id);
    if (reqToClose) {
      setSelectedRequirement(reqToClose);
      setIsCloseConfirmOpen(true);
    }
  };

  const handleCloseConfirm = (found: boolean) => {
    setIsCloseConfirmOpen(false);
    setFoundTutor(found);
    if (found) {
      setIsTutorNameModalOpen(true);
    } else {
      if (selectedRequirement) {
        updateRequirementStatus(selectedRequirement.id, "closed", "Tutor not found or not specified.");
        toast({ title: "Requirement Closed", description: `${selectedRequirement.subject.join(', ')} requirement has been marked as closed.` });
      }
      resetCloseFlow();
    }
  };
  
  const handleTutorNameSubmit = () => {
    setIsTutorNameModalOpen(false);
    setIsStartClassesConfirmOpen(true);
  };

  const handleStartClassesConfirm = (start: boolean) => {
    setIsStartClassesConfirmOpen(false);
    if (selectedRequirement) {
      const notes = start 
        ? `Classes initiated with ${tutorName || 'selected tutor'}.` 
        : `Tutor ${tutorName || 'selected tutor'} found, but classes not started at this time.`;
      updateRequirementStatus(selectedRequirement.id, "closed", notes);
      toast({ 
          title: start ? "Classes Initiated (Mock)" : "Requirement Closed", 
          description: start 
            ? `Classes for ${selectedRequirement.subject.join(', ')} with ${tutorName || 'selected tutor'} will start soon. The requirement is now closed.` 
            : `${selectedRequirement.subject.join(', ')} requirement has been marked as closed. You chose not to start classes now.`
      });
    }
    resetCloseFlow();
  };

  const handleReopen = (id: string) => {
    const reqToReopen = allRequirements.find(req => req.id === id);
    if (reqToReopen) {
      updateRequirementStatus(id, "open", "Enquiry reopened by parent.");
      toast({
        title: "Enquiry Reopened",
        description: `Requirement for ${reqToReopen.subject.join(', ')} is now active. You can edit it.`
      });
    }
  };

  const updateRequirementStatus = (id: string, status: "open" | "matched" | "closed", additionalNotes?: string) => {
    setAllRequirements(prev => prev.map(req => 
      req.id === id 
        ? { 
            ...req, 
            status, 
            additionalNotes: additionalNotes ? `${req.additionalNotes ? req.additionalNotes + " " : ""}Update: ${additionalNotes}` : req.additionalNotes 
          } 
        : req
    ));
  };

  const resetCloseFlow = () => {
    setSelectedRequirement(null);
    setFoundTutor(null);
    setTutorName("");
  };

  const renderEnquiryList = (requirementsToRender: TuitionRequirement[], type: 'current' | 'past' | 'all') => {
    if (requirementsToRender.length > 0) {
      return (
        <div className="flex flex-col gap-4"> 
          {requirementsToRender.map((req) => (
            <TuitionRequirementCard
              key={req.id}
              requirement={req}
              onEdit={() => handleEdit(req.id)}
              onDelete={() => openDeleteConfirm(req.id)}
              onClose={() => handleCloseRequirement(req.id)}
              onReopen={() => handleReopen(req.id)}
              showActions={true} // Actions are always relevant in this parent context
              isParentContext={true} 
            />
          ))}
        </div>
      );
    }
    return (
      <Card className="text-center py-10 bg-card border rounded-lg shadow-sm">
        <CardContent className="flex flex-col items-center">
          <Search className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <p className="text-md font-semibold text-foreground/70 mb-1">No Requirements Found</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            You don&apos;t have any {type === 'current' ? 'active' : type === 'past' ? 'past' : ''} tuition requirements.
            {type !== 'past' && " Post one to find tutors!"}
          </p>
        </CardContent>
      </Card>
    );
  };


  if (!user) return <div className="flex h-screen items-center justify-center text-sm font-medium text-muted-foreground animate-in fade-in duration-300">Loading...</div>;

  return (
    <div className="space-y-0 pb-20 md:pb-24"> 
       <BreadcrumbHeader
        segments={[
          { label: "Dashboard", href: "/dashboard/parent" },
          { label: "My Enquiries" },
        ]}
        className="mb-6"
      />

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-1 bg-muted/50 p-1 rounded-lg shadow-sm mb-6">
          <TabsTrigger value="current" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Current</TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Past</TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">All</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
          {renderEnquiryList(currentRequirements, 'current')}
        </TabsContent>
        <TabsContent value="past" className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
          {renderEnquiryList(pastRequirements, 'past')}
        </TabsContent>
        <TabsContent value="all" className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
          {renderEnquiryList(allRequirements, 'all')}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the enquiry for <strong>{selectedRequirement?.subject.join(', ')}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for "Did you find a tutor?" */}
      <AlertDialog open={isCloseConfirmOpen} onOpenChange={setIsCloseConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><UserCheck className="mr-2 h-5 w-5 text-primary"/> Found a Tutor?</AlertDialogTitle>
            <AlertDialogDescription>
              Did you find a suitable tutor for your requirement: <strong>{selectedRequirement?.subject.join(', ')}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleCloseConfirm(false)}>No, Close It</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleCloseConfirm(true)}>Yes, I Found One</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for entering tutor name */}
      <Dialog open={isTutorNameModalOpen} onOpenChange={setIsTutorNameModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tutor Found!</DialogTitle>
            <DialogDescription>
              Great! Please enter the name of the tutor you found for <strong>{selectedRequirement?.subject.join(', ')}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tutor-name" className="text-right text-sm">
                Tutor&apos;s Name
              </Label>
              <Input
                id="tutor-name"
                value={tutorName}
                onChange={(e) => setTutorName(e.target.value)}
                className="col-span-3"
                placeholder="Enter tutor's name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setIsTutorNameModalOpen(false); handleStartClassesConfirm(false); }}>Skip for Now</Button>
            <Button type="button" onClick={handleTutorNameSubmit} disabled={!tutorName.trim()}>Next</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for "Would you like to start classes?" */}
      <AlertDialog open={isStartClassesConfirmOpen} onOpenChange={setIsStartClassesConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><Send className="mr-2 h-5 w-5 text-primary"/> Start Classes?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to start classes with <strong>{tutorName || "the selected tutor"}</strong> for your <strong>{selectedRequirement?.subject.join(', ')}</strong> requirement?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleStartClassesConfirm(false)}>Not Yet</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleStartClassesConfirm(true)}>Yes, Start Classes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <FloatingPostRequirementButton />
    </div>
  );
}

