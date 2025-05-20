
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { User } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function ParentDashboardPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || user?.role !== 'parent') {
        router.replace("/");
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, user, router]);

  if (isCheckingAuth || !hasMounted || (hasMounted && !isAuthenticated) || (hasMounted && user?.role !== 'parent')) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Parent Dashboard...</div>;
  }
  
  if (!user && hasMounted) {
     return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">User data not available. Redirecting...</div>;
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-xl shadow-lg p-6 md:p-8 border-0">
          <CardHeader className="p-0 mb-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-full text-primary">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold text-primary tracking-tight">
                  Parent Dashboard
                </CardTitle>
                <CardDescription className="text-sm text-foreground/70 mt-1">
                  Welcome, {user?.name || "Parent"}! Manage your tutoring activities here.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Parent dashboard content coming soon...</p>
            {/* Add Parent-specific cards and sections here */}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
