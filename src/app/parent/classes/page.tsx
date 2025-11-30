
"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { School } from "lucide-react";
import { useGlobalLoader } from "@/hooks/use-global-loader";

export default function ParentMyClassesPage() {
  const { hideLoader } = useGlobalLoader();

  useEffect(() => {
    hideLoader();
  }, [hideLoader]);

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card border rounded-lg shadow-md animate-in fade-in duration-500 ease-out">
          <CardHeader className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-full text-primary">
                <School className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold text-primary tracking-tight">
                  My Classes
                </CardTitle>
                <CardDescription className="text-sm text-foreground/70 mt-1">
                  Track your student's ongoing, upcoming, and completed classes.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
           <CardContent className="p-5 text-center">
             <div className="text-center py-12">
                <School className="w-16 h-16 text-primary/30 mx-auto mb-5" />
                <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Classes Found</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  You do not have any active or upcoming classes scheduled at the moment. Once you finalize a tutor after a demo, your classes will appear here.
                </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
