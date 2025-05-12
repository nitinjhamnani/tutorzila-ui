
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
  { id: "1", parentId: "p1", parentName: "Alice Smith", subject: "Mathematics", gradeLevel: "Grade 9-10", scheduleDetails: "Mon, Wed, Fri 5-7 PM", location: "Online", status: "open", postedAt: new Date(Date.now() - 86400000 * 2).toISOString(), additionalNotes: "Needs help with algebra and geometry.", board: "CBSE", teachingMode: ["Online"], applicantsCount: 10 },
  { id: "6", parentId: "p1", parentName: "Alice Smith", subject: "History", gradeLevel: "Grade 9-10", scheduleDetails: "Tues 6-8 PM", location: "Student's Home", status: "matched", postedAt: new Date(Date.now() - 86400000 * 15).toISOString(), board: "State Board", teachingMode: ["Offline (In-person)"], applicantsCount: 3 },
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

  if (!user) return <div className="flex h-screen items-center justify-center text-sm font-medium text-muted-foreground animate-in fade-in duration-300">Loading...</div>;

  return (
    <div className="space-y-6"> {/* Reduced space-y */}
      <Card className="bg-card border rounded-lg shadow-sm animate-in fade-in duration-500 ease-out overflow-hidden"> {/* Reduced shadow */}
        <CardHeader className="p-5"> {/* Reduced padding */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"> {/* Reduced gap */}
            <div>
              <CardTitle className="text-2xl font-semibold text-primary tracking-tight flex items-center"> {/* Reduced text size */}
                <ListChecks className="w-6 h-6 mr-2.5"/>My Posted Requirements {/* Reduced icon size and margin */}
              </CardTitle>
              <CardDescription className="text-sm text-foreground/70 mt-1"> {/* Reduced text size */}
                Manage your tuition needs and connect with tutors.
              </CardDescription>
            </div>
            <Button asChild className="transform transition-transform hover:scale-105 active:scale-95 shadow-sm text-sm py-2 px-4"> {/* Reduced text size and padding, reduced shadow */}
              <Link href="/dashboard/post-requirement">
                <PlusCircle className="mr-1.5 h-4 w-4" /> Post New Requirement {/* Reduced icon size and margin */}
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>


      {myRequirements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"> {/* Adjusted gap */}
          {myRequirements.map((req, index) => (
            <div 
              key={req.id} 
              className="relative group animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            >
              <TuitionRequirementCard requirement={req} />
              <div className="absolute top-2.5 right-2.5 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2"> {/* Adjusted top/right */}
                <Button variant="outline" size="icon" className="h-8 w-8 bg-card hover:bg-accent/80 border-border/50 hover:border-primary/50 transform hover:scale-110 transition-transform shadow-xs hover:shadow-sm" title="Edit Requirement" disabled> {/* Reduced size, reduced shadow */}
                  <Edit3 className="h-3.5 w-3.5" /> {/* Reduced icon size */}
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8 transform hover:scale-110 transition-transform shadow-xs hover:shadow-sm" title="Delete Requirement" disabled> {/* Reduced size, reduced shadow */}
                  <Trash2 className="h-3.5 w-3.5" /> {/* Reduced icon size */}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out"> {/* Reduced padding, reduced shadow */}
          <CardContent className="flex flex-col items-center">
            <Search className="w-16 h-16 text-primary/30 mx-auto mb-5" /> {/* Reduced icon size and margin */}
            <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Requirements Posted Yet</p> {/* Reduced text size and margin */}
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              It looks like you haven&apos;t posted any tuition requirements. Click the button above to share your needs and find the perfect tutor.
            </p>
             <Button asChild className="mt-6 transform transition-transform hover:scale-105 active:scale-95 text-sm py-2 px-4"> {/* Reduced text size and padding */}
              <Link href="/dashboard/post-requirement">
                <PlusCircle className="mr-1.5 h-4 w-4" /> Post Your First Requirement {/* Reduced icon size */}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
