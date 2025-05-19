
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { School } from "lucide-react";

export default function TutorManageClassesPage() {
  return (
    <div className="flex-grow"> {/* Ensure it can take up space if layout is flex */}
      <div className="max-w-7xl mx-auto w-full"> {/* Consistent with other tutor pages */}
        <Card className="bg-card border rounded-lg shadow-md animate-in fade-in duration-500 ease-out">
          <CardHeader className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-full text-primary">
                <School className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold text-primary tracking-tight">
                  Manage My Classes
                </CardTitle>
                <CardDescription className="text-sm text-foreground/70 mt-1">
                  Organize your scheduled classes, track student progress, and manage class materials.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 text-center">
            <School className="w-16 h-16 text-primary/30 mx-auto mb-5" />
            <p className="text-xl font-semibold text-foreground/70 mb-1.5">Feature Coming Soon!</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              This section will allow you to manage all aspects of your regular tutoring classes, including scheduling, attendance, and sharing resources.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
