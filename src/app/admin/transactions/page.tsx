
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

export default function AdminAllTransactionsPage() {

  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <ListChecks className="w-5 h-5 mr-2.5" />
            All Transactions
          </CardTitle>
          <CardDescription className="text-sm text-foreground/70 mt-1">
            A log of all financial transactions on the platform.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card className="text-center py-16 bg-card border rounded-lg shadow-sm">
        <CardContent className="flex flex-col items-center">
          <ListChecks className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Transactions Found</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            There are no transaction records to display.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
