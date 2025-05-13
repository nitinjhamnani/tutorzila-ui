"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote, RadioTower } from "lucide-react"; // Changed to RadioTower for consistency
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DemoSessionsPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-card border rounded-lg shadow-sm animate-in fade-in duration-500 ease-out">
        <CardHeader className="p-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <CardTitle className="text-2xl font-semibold text-primary tracking-tight flex items-center">
                <MessageSquareQuote className="w-6 h-6 mr-2.5"/>
                Demo Sessions
              </CardTitle>
              <CardDescription className="text-sm text-foreground/70 mt-1">
                Manage your requested and scheduled demo classes.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="active" disabled>Active (N/A)</TabsTrigger>
              <TabsTrigger value="past" disabled>Past</TabsTrigger>
              <TabsTrigger value="completed" disabled>Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="pt-6 text-center">
                <RadioTower className="w-16 h-16 text-primary/30 mx-auto mb-5" />
                <p className="text-xl font-semibold text-foreground/70 mb-1.5">Demo Session Management Coming Soon!</p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    You&apos;ll be able to see upcoming demos, book full classes, reschedule, or cancel demos from here.
                </p>
            </TabsContent>
            {/* Add TabsContent for active, past, completed when implemented */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

