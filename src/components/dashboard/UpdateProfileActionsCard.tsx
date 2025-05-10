
"use client";

import type { TutorProfile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, ClipboardEdit, Edit, CheckCircle, Activity } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

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
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card border border-border/30 rounded-xl overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <Edit className="w-6 h-6 mr-2.5"/>
              Update Profile
            </CardTitle>
        </div>
        <CardDescription className="text-sm mt-1">
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
            <p className="text-xs text-muted-foreground text-right">{completedSteps} of {totalSteps} steps completed</p>
          </div>
        )}
        <Button asChild variant="outline" className="w-full transform transition-transform hover:scale-105 active:scale-95 text-base py-3">
            <Link href="#"> {/* Placeholder Link - Update with actual routes later */}
                <UserCog className="mr-2 h-5 w-5" />
                Edit Personal Details
            </Link>
        </Button>
        <Button asChild variant="outline" className="w-full transform transition-transform hover:scale-105 active:scale-95 text-base py-3">
            <Link href="#"> {/* Placeholder Link - Update with actual routes later */}
                <ClipboardEdit className="mr-2 h-5 w-5" />
                Edit Tutoring Details
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

