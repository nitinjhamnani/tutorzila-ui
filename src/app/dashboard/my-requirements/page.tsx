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

// Mock data - replace with API call specific to the logged-in parent
const MOCK_ALL_PARENT_REQUIREMENTS: TuitionRequirement[] = [
  { id: "1", parentId: "p1", parentName: "Alice Smith", subject: "Mathematics", gradeLevel: "Grade 9-10", scheduleDetails: "Mon, Wed, Fri 5-7 PM", preferredDays: ["Mon", "Wed", "Fri"], preferredTime: ["5-7 PM"], location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 2).toISOString(), additionalNotes: "Needs help with algebra and geometry.", board: "CBSE", teachingMode: ["Online"], applicantsCount: 10 },
  { id: "6", parentId: "p1", parentName: "Alice Smith", subject: "History", gradeLevel: "Grade 9-10", scheduleDetails: "Tues 6-8 PM", preferredDays: ["Tuesday"], preferredTime: ["6-8 PM"], location: "Student's Home", status: "matched", postedAt: new Date(Date.now() - 86400000 * 15).toISOString(), board: "State Board", teachingMode: ["Offline (In-person)"], applicantsCount: 3 },
  { id: "7", parentId: "p1", parentName: "Alice Smith", subject: "Science", gradeLevel: "Grade 6-8", scheduleDetails: "Weekends 10-12 AM", preferredDays: ["Saturday", "Sunday"], preferredTime: ["10-12 AM"], location: "Online", status: "closed", postedAt: new Date(Date.now() - 86400000 * 30).toISOString(), board: "ICSE", teachingMode: ["Online"], applicantsCount: 5 },
  { id: "8", parentId: "p1", parentName: "Alice Smith", subject: "English", gradeLevel: "Grade 11-12", scheduleDetails: "Flexible evenings", preferredDays: ["Flexible"], preferredTime: ["Evenings"], location: "Tutor's Home", status: "open", postedAt: new Date(Date.now() - 86400000 * 1).toISOString(), board: "IB", teachingMode: ["Offline (In-person)"], applicantsCount: 1 },
];

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
      // In a real app, fetch requirements for the logged-in user
      // For mock, filter by parentId or parentName if parentId is not available in all mock data
      setAllRequirements(MOCK_ALL_PARENT_REQUIREMENTS.filter(req => req.parentId === user.id || req.parentName === user.name));
    }
  }, [user]);

  const currentRequirements = useMemo(() => allRequirements.filter(req => req.status === 'open' || req.status === 'matched'), [allRequirements]);
  const pastRequirements = useMemo(() => allRequirements.filter(req => req.status === 'closed'), [allRequirements]);

  const handleEdit = (id: string) => {
    toast({ title: "Edit Action (Mock)", description: `Editing requirement ID: ${id}. Feature coming soon.` });
    // Implement actual edit logic or navigation
  };

  const handleDelete = (id: string) => {
    // Show confirmation dialog before deleting
    const requirementToDelete = allRequirements.find(req => req.id === id);
    if (requirementToDelete) {
        setSelectedRequirement(requirementToDelete);
        // Trigger a confirmation dialog here, e.g., by setting a state
        toast({ title: "Delete Confirmation (Mock)", description: `Are you sure you want to delete ${requirementToDelete.subject}? Feature coming soon.` });
    }
    // Implement actual delete logic after confirmation
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
      // Mark requirement as closed
      if (selectedRequirement) {
        updateRequirementStatus(selectedRequirement.id, "closed");
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
    if (start) {
      if (selectedRequirement) {
         updateRequirementStatus(selectedRequirement.id, "closed"); // Or "matched" then "closed" after class starts
        toast({ 
            title: "Classes Initiated (Mock)", 
            description: `Classes for ${selectedRequirement.subject} with ${tutorName || 'selected tutor'} will start soon. The requirement is now closed.` 
        });
      }
    } else {
       if (selectedRequirement) {
        updateRequirementStatus(selectedRequirement.id, "closed");
        toast({ title: "Requirement Closed", description: `${selectedRequirement.subject} requirement has been marked as closed. You chose not to start classes now.` });
      }
    }
    resetCloseFlow();
  };

  const updateRequirementStatus = (id: string, status: "open" | "matched" | "closed") => {
    setAllRequirements(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const resetCloseFlow = () => {
    setSelectedRequirement(null);
    setFoundTutor(null);
    setTutorName("");
  };

  if (!user) return <div className="flex h-screen items-center justify-center text-sm font-medium text-muted-foreground animate-in fade-in duration-300">Loading...</div>;

  return (
    <div className="space-y-8 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="bg-card border rounded-xl shadow-sm animate-in fade-in duration-500 ease-out overflow-hidden">
        <CardHeader className="p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/10 rounded-full text-primary shadow-sm">
                 <ListChecks className="w-6 h-6" />
               </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-semibold text-primary tracking-tight">
                  My Posted Requirements
                </CardTitle>
                <CardDescription className="text-sm text-foreground/70 mt-1">
                  Manage your tuition needs and connect with tutors.
                </CardDescription>
              </div>
            </div>
            <Link
              href="/dashboard/post-requirement"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "transform transition-transform hover:scale-105 active:scale-95 shadow-sm text-sm py-2 px-3.5"
              )}
            >
              <PlusCircle className="mr-1.5 h-4 w-4" /> Post New Requirement
            </Link>
          </div>
        </CardHeader>
      </Card>

      {/* Current Enquiries Section */}
      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out" style={{animationDelay: '0.2s'}}>
        <h2 className="text-lg font-semibold text-foreground flex items-center">
            <ListChecks className="w-5 h-5 mr-2 text-primary"/> Current Enquiries
        </h2>
        {currentRequirements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {currentRequirements.map((req, index) => (
              <TuitionRequirementCard
                key={req.id}
                requirement={req}
                onEdit={() => handleEdit(req.id)}
                onDelete={() => handleDelete(req.id)}
                onClose={() => handleCloseRequirement(req.id)}
                showActions
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-10 bg-card border rounded-lg shadow-sm">
            <CardContent className="flex flex-col items-center">
              <Search className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <p className="text-md font-semibold text-foreground/70 mb-1">No Current Requirements</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                You don&apos;t have any active tuition requirements. Post one to find tutors!
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Past Enquiries Section */}
      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out" style={{animationDelay: '0.4s'}}>
        <h2 className="text-lg font-semibold text-foreground flex items-center">
            <Archive className="w-5 h-5 mr-2 text-muted-foreground"/> Past Enquiries
        </h2>
        {pastRequirements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {pastRequirements.map((req, index) => (
              <TuitionRequirementCard key={req.id} requirement={req} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-10 bg-card border rounded-lg shadow-sm">
            <CardContent className="flex flex-col items-center">
              <Archive className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <p className="text-md font-semibold text-foreground/70 mb-1">No Past Requirements</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Your closed or completed tuition requirements will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

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

    </div>
  );
}