
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit3, Trash2, ListChecks } from "lucide-react";
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
      setMyRequirements(MOCK_PARENT_REQUIREMENTS.filter(req => req.parentId === user.id || req.parentName === user.name));
    }
  }, [user]);

  if (!user) return <p className="animate-in fade-in duration-300">Loading...</p>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
        <h1 className="text-3xl font-bold flex items-center"><ListChecks className="w-8 h-8 mr-3 text-primary"/>My Posted Requirements</h1>
        <Button asChild className="transform transition-transform hover:scale-105 active:scale-95">
          <Link href="/dashboard/post-requirement">
            <PlusCircle className="mr-2 h-4 w-4" /> Post New Requirement
          </Link>
        </Button>
      </div>

      {myRequirements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRequirements.map((req, index) => (
            <div 
              key={req.id} 
              className="relative group animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TuitionRequirementCard requirement={req} />
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-background hover:bg-accent transform hover:scale-110 transition-transform" title="Edit Requirement" disabled>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8 transform hover:scale-110 transition-transform" title="Delete Requirement" disabled>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-md animate-in fade-in zoom-in-95 duration-500 ease-out">
          <CardContent>
            <ListChecks className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">You haven&apos;t posted any requirements yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Click the button above to post your first tuition need.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
