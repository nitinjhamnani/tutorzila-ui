
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, PlusCircle } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TutorLeadsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || user?.role !== 'tutor') {
        router.replace("/");
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, user, router]);

  if (!hasMounted || isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }

  const mockLeadBalance = 25; // Example mock data

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-xl shadow-lg border-0 mb-6">
          <CardHeader className="p-4 sm:p-5 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-primary">
                    Lead Management
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    View your lead balance and purchase more leads.
                  </CardDescription>
                </div>
              </div>
              <Button variant="default" size="sm" className="text-xs">
                <PlusCircle className="w-4 h-4 mr-1.5 opacity-90" />
                Buy More Leads
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <div className="text-sm text-foreground">
              Current Lead Balance: <span className="font-bold text-primary">{mockLeadBalance}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-xl shadow-lg border-0">
          <CardHeader className="p-4 sm:p-5">
            <CardTitle className="text-base sm:text-lg font-semibold text-primary">
              Purchased Leads History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 text-center">
            <ShoppingBag className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground/70 mb-1">
              Feature Coming Soon!
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              This section will display a history of all the leads you have purchased.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
