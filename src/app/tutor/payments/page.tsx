
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Coins, FileText } from "lucide-react";

export default function TutorPaymentsPage() {
  const mockData = {
    totalCollected: "₹1,25,000",
    totalPending: "₹15,000",
  };

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Changed md:grid-cols-2 to grid-cols-1 to make the card take full width */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-card border rounded-lg shadow-md animate-in fade-in duration-500 ease-out">
            <CardHeader className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-full text-primary">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-primary tracking-tight">
                    Manage Payments
                  </CardTitle>
                  <CardDescription className="text-sm text-foreground/70 mt-1">
                    Overview of your earnings and pending payments.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Coins className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Payment Collected</p>
                    <p className="text-2xl font-semibold text-green-600">{mockData.totalCollected}</p>
                  </div>
                </div>
                <TrendingUp className="w-6 h-6 text-green-500 opacity-70" />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pending Payment</p>
                    <p className="text-2xl font-semibold text-orange-600">{mockData.totalPending}</p>
                  </div>
                </div>
                <TrendingDown className="w-6 h-6 text-orange-500 opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Placeholder for future payment list/details */}
        <div className="mt-8 text-center text-muted-foreground">
          <p>Detailed payment history and transaction management will be available soon.</p>
        </div>
      </div>
    </main>
  );
}
