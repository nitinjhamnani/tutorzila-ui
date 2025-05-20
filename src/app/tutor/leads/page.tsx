
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, PlusCircle, Crown, Coins, FileText, MessageSquareText } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { TutorLead, TutorProfile } from "@/types";
import { MOCK_TUTOR_LEADS } from "@/lib/mock-data";
import { TutorLeadCard } from "@/app/tutor/components/TutorLeadCard"; 
import { useToast } from "@/hooks/use-toast";


export default function TutorLeadsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const [hasMounted, setHasMounted] = useState(false);
  const [tutorLeads, setTutorLeads] = useState<TutorLead[]>([]);
  const tutorUser = user as TutorProfile | null;


  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || !tutorUser || tutorUser.role !== 'tutor') {
        router.replace("/");
      } else {
        // Filter leads for the current tutor
        const filteredLeads = MOCK_TUTOR_LEADS.filter(lead => lead.tutorId === tutorUser.id);
        setTutorLeads(filteredLeads);
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, tutorUser, router]);

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

  const handleBuyLeads = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Ability to purchase more leads will be available soon.",
    });
  };

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-none shadow-lg border-0 p-4 sm:p-5 mb-6 md:mb-8">
          <CardHeader className="p-0 mb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-grow">
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2.5 text-primary"/>
                <CardTitle className="text-xl font-semibold text-primary">
                  Lead Management
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1 ml-[calc(1.25rem+0.625rem)] sm:ml-0 sm:mt-0.5">
                View your lead balance, current plan, and purchased leads.
              </CardDescription>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <Button
                variant="default"
                size="sm"
                className="text-xs sm:text-sm py-2.5 md:px-3 px-2 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-center gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                onClick={handleBuyLeads}
              >
                <PlusCircle className="w-4 h-4 opacity-90 md:mr-1.5" />
                <span className="hidden md:inline">Buy More Leads</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Crown className="w-5 h-5 mr-3 text-yellow-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Plan</p>
                    <p className="text-xl font-semibold text-yellow-600">{summaryStats.currentPlan}</p>
                  </div>
                </div>
              </div>
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

        {/* Purchased Leads Section - No longer wrapped in its own Card */}
        <div className="mt-6 md:mt-8">
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2.5"/>
            Purchased Leads
          </h2>
          {tutorLeads.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:gap-5">
              {tutorLeads.map((lead) => (
                <TutorLeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-10 bg-card rounded-lg shadow-sm border">
              <CardContent className="flex flex-col items-center">
                <ShoppingBag className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <p className="text-sm font-medium text-foreground/70 mb-1">
                  No leads purchased yet.
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Purchase leads to connect with interested parents.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
