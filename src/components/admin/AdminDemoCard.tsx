
"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { EnquiryDemo } from "@/types";
import { cn } from "@/lib/utils";
import { CalendarDays, Clock, User, Video, XCircle, CheckCircle, MessageSquareQuote, RadioTower, Users as UsersIcon, Settings, DollarSign, Info } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminDemoCardProps {
  demo: EnquiryDemo;
}

export function AdminDemoCard({ demo }: AdminDemoCardProps) {
  if (!demo) {
    return null; // or a loading skeleton
  }

  const { demoDetails } = demo;
  const demoDate = parseISO(demoDetails.date);

  const getStatusBadgeClasses = () => {
    switch (demo.demoStatus) {
      case "SCHEDULED": return "bg-blue-100 text-blue-700";
      case "COMPLETED": return "bg-green-100 text-green-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      case "REQUESTED": return "bg-yellow-100 text-yellow-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const StatusIcon = () => {
    const iconProps = "w-3 h-3 mr-1";
    switch (demo.demoStatus) {
      case "SCHEDULED": return <Clock className={iconProps} />;
      case "REQUESTED": return <MessageSquareQuote className={iconProps} />;
      case "COMPLETED": return <CheckCircle className={iconProps} />;
      case "CANCELLED": return <XCircle className={iconProps} />;
      default: return <Info className={iconProps} />;
    }
  };

  const ModeIcon = () => {
    const iconProps = "w-3 h-3 mr-1";
    if (demoDetails.online) return <RadioTower className={iconProps} />;
    if (demoDetails.offline) return <UsersIcon className={iconProps} />;
    return null;
  };

  return (
    <Card className="shadow border p-4 sm:p-5">
        <CardHeader className="flex flex-row justify-between items-start space-x-4 p-0 mb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-semibold">{demoDetails.tutorName}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Demo with {demoDetails.studentName} for {demoDetails.subjects}
            </CardDescription>
          </div>
          <Badge className={cn("text-[10px] px-2 py-0.5", getStatusBadgeClasses())}>
            <StatusIcon />
            {demo.demoStatus}
          </Badge>
        </CardHeader>

        <CardContent className="text-xs space-y-2">
            <div className="flex items-center"><CalendarDays className="w-3.5 h-3.5 mr-1 text-primary/70" />Date: {format(demoDate, "PPP")}</div>
            <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-primary/70" />Time: {demoDetails.startTime} ({demoDetails.duration} mins)</div>
            {demoDetails.paid && <div className="flex items-center"><DollarSign className="w-3.5 h-3.5 mr-1 text-primary/70" />Fee: ₹{demoDetails.demoFees}</div>}
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t pt-3 mt-2">
           <div className="flex items-center gap-2">
            <Badge className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground">
              <ModeIcon />
              {demoDetails.online ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <Button size="sm" variant="outline" className="text-xs px-3 py-1.5 h-auto">
            <Settings className="w-3 h-3 mr-1" />
            Manage
          </Button>
        </CardFooter>
      </Card>
  );
}
