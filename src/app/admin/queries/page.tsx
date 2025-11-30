
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MessageSquareText } from "lucide-react";

export default function AdminQueriesPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <MessageSquareText className="w-5 h-5 mr-2.5" />
            Contact Queries
          </CardTitle>
          <CardDescription className="text-sm text-foreground/70 mt-1">
            View and manage queries submitted through the contact form.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Contact queries will be displayed here once the API is integrated.</p>
        </CardContent>
      </Card>
    </div>
  );
}
