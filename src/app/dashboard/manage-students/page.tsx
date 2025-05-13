"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { School, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ManageStudentsPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-card border rounded-lg shadow-sm animate-in fade-in duration-500 ease-out">
        <CardHeader className="p-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <CardTitle className="text-2xl font-semibold text-primary tracking-tight flex items-center">
                <School className="w-6 h-6 mr-2.5"/>
                Manage Student Profiles
              </CardTitle>
              <CardDescription className="text-sm text-foreground/70 mt-1">
                Add, view, and edit profiles for your children.
              </CardDescription>
            </div>
            <Button asChild className="transform transition-transform hover:scale-105 active:scale-95 shadow-sm text-sm py-2 px-4" disabled>
              <Link href="#">
                <PlusCircle className="mr-1.5 h-4 w-4" /> Add New Student (Coming Soon)
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-5 text-center">
          <School className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">Feature Coming Soon!</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            This section will allow you to manage individual student profiles, making it easier to post specific tuition requirements for each child.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

