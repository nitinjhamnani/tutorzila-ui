
"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, ClipboardEdit, Edit, CheckCircle, Activity } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface UpdateProfileActionsCardProps {
  user: TutorProfile;
}

export function UpdateProfileActionsCard({ user }: UpdateProfileActionsCardProps) {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const totalSteps = 5; // Number of fields considered for profile completion

  useEffect(() => {
    if (user.role === 'tutor') {
      let completed = 0;
      const fieldsToComplete = [
        user.avatar && !user.avatar.includes('pravatar.cc') && !user.avatar.includes('avatar.vercel.sh'), // Check if avatar is not default
        user.subjects && user.subjects.length > 0,
        user.bio && user.bio.trim() !== '',
        user.experience && user.experience.trim() !== '',
        user.hourlyRate && user.hourlyRate.trim() !== '',
      ];

      fieldsToComplete.forEach(isComplete => {
        if (isComplete) {
          completed++;
        }
      });
      
      setCompletedSteps(completed);
      setCompletionPercentage(Math.round((completed / totalSteps) * 100));
    }
  }, [user]);

  return (
    <Card className={cn("group transition-all duration-300 flex flex-col bg-card h-full rounded-lg border shadow-none border-border/30 hover:shadow-lg")}>
      <CardHeader className={cn("p-4 md:p-5", "pt-6")}> 
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-all duration-300">
            <Edit className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">My Profile</CardTitle>
        </div>
        <CardDescription className="text-xs mt-0.5 text-muted-foreground">
          Complete your profile to attract more students.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4 justify-center p-6">
        {user.role === 'tutor' && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-foreground/80">Profile Completion</span>
              <span className="font-semibold text-primary">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2.5" indicatorClassName={completionPercentage === 100 ? "bg-green-500" : "bg-primary"} />
          </div>
        )}
        <Button 
          asChild 
          variant="outline" 
          className="w-full transform transition-transform hover:scale-105 active:scale-95 bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        >
            <Link href="/dashboard/tutor/edit-personal-details"> 
                <UserCog className="mr-2 h-4 w-4" /> 
                Edit Personal Details
            </Link>
        </Button>
        <Button 
          asChild 
          variant="outline" 
          className="w-full transform transition-transform hover:scale-105 active:scale-95 bg-card border-foreground text-foreground hover:bg-accent hover:text-accent-foreground text-sm"
        >
            <Link href="/dashboard/tutor/edit-tutoring-details"> 
                <ClipboardEdit className="mr-2 h-4 w-4" /> 
                Edit Tutoring Details
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
