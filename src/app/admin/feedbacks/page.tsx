
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MessageSquareQuote } from "lucide-react";

export default function AdminFeedbacksPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <MessageSquareQuote className="w-5 h-5 mr-2.5" />
            User Feedbacks
          </CardTitle>
          <CardDescription className="text-sm text-foreground/70 mt-1">
            Review feedback submitted by parents and tutors.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Feedback data will be displayed here once the API is integrated.</p>
        </CardContent>
      </Card>
    </div>
  );
}
