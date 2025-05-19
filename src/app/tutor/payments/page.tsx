
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import Link from "next/link";

export default function TutorPaymentsPage() {
  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card border rounded-lg shadow-md animate-in fade-in duration-500 ease-out">
          <CardHeader className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-full text-primary">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold text-primary tracking-tight">
                  Manage Payments
                </CardTitle>
                <CardDescription className="text-sm text-foreground/70 mt-1">
                  View your payment history and manage pending transactions.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 text-center">
            <DollarSign className="w-16 h-16 text-primary/30 mx-auto mb-5" />
            <p className="text-xl font-semibold text-foreground/70 mb-1.5">Payment Management Coming Soon!</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              This section will allow you to track payments received, manage invoices, and view your earnings.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
