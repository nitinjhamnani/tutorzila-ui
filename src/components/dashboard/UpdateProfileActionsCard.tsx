
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, ClipboardEdit, Edit } from "lucide-react";
import Link from "next/link";

export function UpdateProfileActionsCard() {
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
          Manage your personal and tutoring information.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4 justify-center p-6">
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
