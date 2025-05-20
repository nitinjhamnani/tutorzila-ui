// src/app/tutor/transactions/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks, Construction } from "lucide-react"; // Added Construction
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TutorTransactionsPage() {
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

  if (isCheckingAuth || !hasMounted || (hasMounted && (!isAuthenticated || user?.role !== 'tutor'))) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading or redirecting...</div>;
  }
  
  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card border rounded-none shadow-lg p-4 sm:p-5 border-0 animate-in fade-in duration-500 ease-out">
          <CardHeader className="p-0 pb-3 sm:pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-full text-primary">
                <ListChecks className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-primary tracking-tight">
                  Transaction History
                </CardTitle>
                <CardDescription className="text-sm text-foreground/70 mt-1">
                  View your leads credits/debits and fee credits.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-4 text-center">
            <Construction className="w-16 h-16 text-primary/30 mx-auto mb-5" />
            <p className="text-xl font-semibold text-foreground/70 mb-1.5">Feature Coming Soon!</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              This section will display a detailed history of all your financial transactions, including lead purchases, fee credits, and any debits.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
