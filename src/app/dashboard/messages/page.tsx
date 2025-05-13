
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Inbox } from "lucide-react";
import Link from "next/link";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-card border rounded-lg shadow-sm animate-in fade-in duration-500 ease-out">
        <CardHeader className="p-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <CardTitle className="text-2xl font-semibold text-primary tracking-tight flex items-center">
                <MessageSquare className="w-6 h-6 mr-2.5"/>
                Messages
              </CardTitle>
              <CardDescription className="text-sm text-foreground/70 mt-1">
                View and manage your conversations with parents and tutors.
              </CardDescription>
            </div>
            {/* Placeholder for future actions like "New Message" */}
          </div>
        </CardHeader>
        <CardContent className="p-5 text-center">
          <Inbox className="w-16 h-16 text-primary/30 mx-auto mb-5" />
          <p className="text-xl font-semibold text-foreground/70 mb-1.5">Messaging Feature Coming Soon!</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            This section will allow you to communicate directly with other users on the platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
