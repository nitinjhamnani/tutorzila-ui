
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { School } from "lucide-react";

export default function AdminAllClassesPage() {

  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <School className="w-5 h-5 mr-2.5" />
            All Classes
          </CardTitle>
          <CardDescription className="text-sm text-foreground/70 mt-1">
            A comprehensive list of all ongoing, upcoming, and past classes.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card className="text-center py-16 bg-card border rounded-lg shadow-sm">
        <CardContent className="flex flex-col items-center">
          <School className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Classes Found</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            There are currently no classes to display on the platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
