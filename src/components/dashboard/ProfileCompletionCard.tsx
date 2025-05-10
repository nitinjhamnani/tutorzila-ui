"use client";

import type { TutorProfile, User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ProfileCompletionCardProps {
  tutor: TutorProfile;
}

export function ProfileCompletionCard({ tutor }: ProfileCompletionCardProps) {
  const calculateProfileCompletion = (profile: TutorProfile): number => {
    let completedFields = 0;
    const totalFields = 6; // bio, subjects, grade, experience, hourlyRate, teachingMode

    if (profile.bio && profile.bio.trim() !== "") completedFields++;
    if (profile.subjects && profile.subjects.length > 0) completedFields++;
    if (profile.grade && profile.grade.trim() !== "") completedFields++;
    if (profile.experience && profile.experience.trim() !== "") completedFields++;
    if (profile.hourlyRate && profile.hourlyRate.trim() !== "") completedFields++;
    if (profile.teachingMode && profile.teachingMode.trim() !== "") completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const completionPercentage = calculateProfileCompletion(tutor);
  const isComplete = completionPercentage === 100;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card border border-border/30 rounded-xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              {isComplete ? <CheckCircle2 className="w-6 h-6 mr-2.5 text-green-500"/> : <Edit className="w-6 h-6 mr-2.5"/>}
              Profile Completion
            </CardTitle>
            <span className={`text-lg font-bold ${isComplete ? 'text-green-500' : 'text-primary'}`}>
                {completionPercentage}%
            </span>
        </div>
        <CardDescription className="text-sm mt-1">
          {isComplete 
            ? "Your profile is complete! Well done." 
            : "Complete your profile to attract more students."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={completionPercentage} className="w-full h-3 mb-4" 
            indicatorClassName={isComplete ? "bg-green-500" : "bg-primary"}
        />
        {!isComplete && (
            <Button asChild className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95" disabled>
             <Link href="#"> 
                <Edit className="mr-2 h-4 w-4" /> Update Profile
             </Link>
            </Button>
        )}
      </CardContent>
    </Card>
  );
}
