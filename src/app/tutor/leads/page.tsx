
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, PlusCircle, Crown, Coins, TrendingUp, Clock } from "lucide-react"; 
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

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

  const mockLeadBalance = 25; 
  const mockPlanName = "Premium Plan";

  const summaryStats = useMemo(() => {
    return {
      currentPlan: mockPlanName,
      leadBalance: mockLeadBalance,
    };
  }, [mockPlanName, mockLeadBalance]);


  if (!hasMounted || isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-none shadow-lg border-0 p-4 sm:p-5 mb-6">
          <CardHeader className="p-0 mb-3 flex flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-grow">
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2.5 text-primary"/>
                <CardTitle className="text-xl font-semibold text-primary">
                  Lead Management
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1 ml-[calc(1.25rem+0.625rem)] sm:ml-0 sm:mt-0.5">
                View your lead balance, current plan, and purchase more leads.
              </CardDescription>
            </div>
            <div className="shrink-0">
              <Button 
                variant="default" 
                size="sm" 
                className="text-xs sm:text-sm py-2.5 md:px-3 px-2 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-center gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              >
                <PlusCircle className="w-4 h-4 opacity-90 md:mr-1.5" />
                <span className="hidden md:inline">Buy More Leads</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Plan Card */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Crown className="w-5 h-5 mr-3 text-yellow-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Plan</p>
                    <p className="text-xl font-semibold text-yellow-600">{summaryStats.currentPlan}</p>
                  </div>
                </div>
              </div>

              {/* Lead Balance Card */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Coins className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Lead Balance</p>
                    <p className="text-xl font-semibold text-green-600">{summaryStats.leadBalance}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-none shadow-lg border-0 p-4 sm:p-5">
          <CardHeader className="p-0 mb-3">
            <div className="flex items-center">
               <TrendingUp className="w-5 h-5 mr-2.5 text-primary"/>
                <CardTitle className="text-xl font-semibold text-primary">
                    Purchased Leads History
                </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-4 text-center">
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
