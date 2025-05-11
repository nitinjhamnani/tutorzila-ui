
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit3, Trash2, ListChecks, Search } from "lucide-react";
import Link from "next/link";
import type { TuitionRequirement } from "@/types";
import { TuitionRequirementCard } from "@/components/tuitions/TuitionRequirementCard";
import { useAuthMock } from "@/hooks/use-auth-mock";

// Mock data - replace with API call specific to the logged-in parent
const MOCK_PARENT_REQUIREMENTS: TuitionRequirement[] = [
  { id: "1", parentId: "p1", parentName: "Alice Smith", subject: "Mathematics", gradeLevel: "Grade 9-10", scheduleDetails: "Mon, Wed, Fri 5-7 PM", location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 2).toISOString(), additionalNotes: "Needs help with algebra and geometry." },
  { id: "6", parentId: "p1", parentName: "Alice Smith", subject: "History", gradeLevel: "Grade 9-10", scheduleDetails: "Tues 6-8 PM", location: "Student's Home", status: "matched", postedAt: new Date(Date.now() - 86400000 * 15).toISOString() },
];

export default function MyRequirementsPage() {
  const { user } = useAuthMock();
  const [myRequirements, setMyRequirements] = useState<TuitionRequirement[]>([]);

  useEffect(() => {
    if (user) {
      // In a real app, fetch requirements for the logged-in user
      setMyRequirements(MOCK_PARENT_REQUIREMENTS.filter(req => req.parentId === user.id || req.parentName === user.name));
    }
  }, [user]);

  if (!user) return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground animate-in fade-in duration-300">Loading...</div>;

  return (
    <div className="space-y-8">
      <Card className="bg-card border rounded-lg shadow-md animate-in fade-in duration-700 ease-out overflow-hidden">
        <CardHeader className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-bold text-primary tracking-tight flex items-center">
                <ListChecks className="w-8 h-8 md:w-10 md:h-10 mr-3"/>My Posted Requirements
              </CardTitle>
              <CardDescription className="text-lg md:text-xl text-foreground/80 mt-1">
                Manage your tuition needs and connect with tutors.
              </CardDescription>
            </div>
            <Button asChild className="transform transition-transform hover:scale-105 active:scale-95 shadow-md text-base py-2.5 px-5">
              <Link href="/dashboard/post-requirement">
                <PlusCircle className="mr-2 h-5 w-5" /> Post New Requirement
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>


      {myRequirements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRequirements.map((req, index) => (
            <div 
              key={req.id} 
              className="relative group animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            >
              <TuitionRequirementCard requirement={req} />
              <div className="absolute top-3 right-3 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                <Button variant="outline" size="icon" className="h-9 w-9 bg-card hover:bg-accent/80 border-border/50 hover:border-primary/50 transform hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Edit Requirement" disabled>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" className="h-9 w-9 transform hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Delete Requirement" disabled>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 bg-card border rounded-lg shadow-md animate-in fade-in zoom-in-95 duration-500 ease-out">
          <CardContent className="flex flex-col items-center">
            <Search className="w-20 h-20 text-primary/40 mx-auto mb-6" /> {/* Changed icon */}
            <p className="text-2xl font-semibold text-foreground/80 mb-2">No Requirements Posted Yet</p>
            <p className="text-md text-muted-foreground max-w-md mx-auto">
              It looks like you haven&apos;t posted any tuition requirements. Click the button above to share your needs and find the perfect tutor.
            </p>
             <Button asChild className="mt-8 transform transition-transform hover:scale-105 active:scale-95 text-base py-2.5 px-6">
              <Link href="/dashboard/post-requirement">
                <PlusCircle className="mr-2 h-5 w-5" /> Post Your First Requirement
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


    