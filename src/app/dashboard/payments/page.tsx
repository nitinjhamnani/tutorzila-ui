"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText } from "lucide-react";
import Link from "next/link";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-card border rounded-lg shadow-sm animate-in fade-in duration-500 ease-out">
        <CardHeader className="p-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <CardTitle className="text-2xl font-semibold text-primary tracking-tight flex items-center">
                <DollarSign className="w-6 h-6 mr-2.5"/>
                My Payments
              </CardTitle>
              <CardDescription className="text-sm text-foreground/70 mt-1">
                Track your tuition payment history and manage pending transactions.
              </CardDescription>
            </div>
             {/* Placeholder for future actions like "Make a Payment" */}
          </div>
        </CardHeader>
        <CardContent className="p-5 text-center">
          <FileText className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">Payment Tracking Coming Soon!</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            This section will display your payment history, including amounts, dates, tutor names, and payment statuses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
