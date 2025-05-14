
// src/app/dashboard/my-requirements/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusCircle, ListChecks, Search, Edit3, Trash2, XCircle, CheckCircle as CheckCircleIcon, Archive, Send, UserCheck } from "lucide-react";
import Link from "next/link";
import type { TuitionRequirement } from "@/types";
import { TuitionRequirementCard } from "@/components/tuitions/TuitionRequirementCard";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingPostRequirementButton } from "@/components/shared/FloatingPostRequirementButton";
import { MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";


export default function MyRequirementsPage() {
  const { user } = useAuthMock();
  const { toast } = useToast();
  const [allRequirements, setAllRequirements] = useState<TuitionRequirement[]>([]);
  
  const [selectedRequirement, setSelectedRequirement] = useState<TuitionRequirement | null>(null);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [foundTutor, setFoundTutor] = useState<boolean | null>(null);
  const [tutorName, setTutorName] = useState("");
  const [isStartClassesConfirmOpen, setIsStartClassesConfirmOpen] = useState(false);
  const [isTutorNameModalOpen, setIsTutorNameModalOpen] = useState(false);


  useEffect(() => {
    if (user) {
      // Filter mock requirements for the logged-in user (e.g., Alice Smith)
      setAllRequirements(MOCK_ALL_PARENT_REQUIREMENTS.filter(req => req.parentId === user.id || req.parentName === user.name));
    }
  }, [user]);

  const currentRequirements = useMemo(() => allRequirements.filter(req => req.status === 'open' || req.status === 'matched'), [allRequirements]);
  const pastRequirements = useMemo(() => allRequirements.filter(req => req.status === 'closed'), [allRequirements]);

  const handleEdit = (id: string) => {
    toast({ title: "Edit Action (Mock)", description: `Editing requirement ID: ${id}. Feature coming soon.` });
  };

  const handleDelete = (id: string) => {
    const requirementToDelete = allRequirements.find(req => req.id === id);
    if (requirementToDelete) {
        setSelectedRequirement(requirementToDelete);
        // For a real delete, you would open a confirmation dialog first
        // For mock, we'll just show a toast
        toast({ 
          title: "Delete Action (Mock)", 
          description: `Deleting requirement ID: ${id}. This is a mock, no data will be deleted.`,
          variant: "destructive"
        });
        // Example: setAllRequirements(prev => prev.filter(req => req.id !== id));
    }
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
        updateRequirementStatus(selectedRequirement.id, "closed", "No tutor specified.");
        toast({ title: "Requirement Closed", description: `${selectedRequirement.subject} requirement has been marked as closed.` });
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
            ? `Classes for ${selectedRequirement.subject} with ${tutorName || 'selected tutor'} will start soon. The requirement is now closed.` 
            : `${selectedRequirement.subject} requirement has been marked as closed. You chose not to start classes now.`
      });
    }
    resetCloseFlow();
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
        <div className="flex flex-col bg-card border rounded-lg shadow-sm overflow-hidden divide-y divide-border">
          {requirementsToRender.map((req) => (
            <TuitionRequirementCard
              key={req.id}
              requirement={req}
              onEdit={() => handleEdit(req.id)}
              onDelete={() => handleDelete(req.id)}
              onClose={() => handleCloseRequirement(req.id)}
              showActions={type === 'current' || (type === 'all' && (req.status === 'open' || req.status === 'matched'))}
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
    <div className="space-y-6 container mx-auto px-0 sm:px-0 lg:px-0 py-0 pb-20 md:pb-24"> {/* Removed container padding */}
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


      {/* Dialog for "Did you find a tutor?" */}
      <AlertDialog open={isCloseConfirmOpen} onOpenChange={setIsCloseConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><UserCheck className="mr-2 h-5 w-5 text-primary"/> Found a Tutor?</AlertDialogTitle>
            <AlertDialogDescription>
              Did you find a suitable tutor for your requirement: <strong>{selectedRequirement?.subject}</strong>?
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
              Great! Please enter the name of the tutor you found for <strong>{selectedRequirement?.subject}</strong>.
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
              Would you like to start classes with <strong>{tutorName || "the selected tutor"}</strong> for your <strong>{selectedRequirement?.subject}</strong> requirement?
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

