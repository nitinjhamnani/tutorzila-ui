
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
      // In a real app, fetch requirements for this user.id (parentId)
      // For mock, filter MOCK_REQUIREMENTS or use specific mock data
      setMyRequirements(MOCK_PARENT_REQUIREMENTS.filter(req => req.parentId === user.id || req.parentName === user.name)); // Mock logic
    }
  }, [user]);

  if (!user) return <p>Loading...</p>; // Or redirect

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center"><ListChecks className="w-8 h-8 mr-3 text-primary"/>My Posted Requirements</h1>
        <Button asChild>
          <Link href="/dashboard/post-requirement">
            <PlusCircle className="mr-2 h-4 w-4" /> Post New Requirement
          </Link>
        </Button>
      </div>

      {myRequirements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRequirements.map((req) => (
            <div key={req.id} className="relative group">
              <TuitionRequirementCard requirement={req} />
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-background hover:bg-accent" title="Edit Requirement" disabled>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8" title="Delete Requirement" disabled>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-md">
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
