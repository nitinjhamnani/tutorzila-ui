"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DemoSession } from "@/types";
import { cn } from "@/lib/utils";
import { CalendarDays, Clock, User, Video, XCircle, CheckCircle, MessageSquareQuote, RadioTower, Users as UsersIcon, Settings } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ManageDemoModal } from "@/components/modals/ManageDemoModal";
import Link from "next/link";

interface ParentDemoCardProps {
  demo: DemoSession;
  onUpdateSession: (updatedDemo: DemoSession) => void;
  onCancelSession: (sessionId: string) => void;
}

export function ParentDemoCard({ demo, onUpdateSession, onCancelSession }: ParentDemoCardProps) {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const demoDate = new Date(demo.date);

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0].slice(0, 2);
  };

  const statusBadgeClasses = {
    Scheduled: "bg-blue-100 text-blue-700",
    Requested: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  }[demo.status] || "bg-muted text-muted-foreground";

  const StatusIcon = () => {
    const iconProps = "w-3 h-3 mr-1";
    switch (demo.status) {
      case "Scheduled": return <Clock className={iconProps} />;
      case "Requested": return <MessageSquareQuote className={iconProps} />;
      case "Completed": return <CheckCircle className={iconProps} />;
      case "Cancelled": return <XCircle className={iconProps} />;
      default: return null;
    }
  };

  const ModeIcon = () => {
    const iconProps = "w-3 h-3 mr-1";
    return demo.mode === "Online" ? <RadioTower className={iconProps} /> : <UsersIcon className={iconProps} />;
  };

  return (
    <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
      <Card className="shadow border p-4 sm:p-5">
        <CardHeader className="flex flex-row justify-between items-start space-x-4 p-0 mb-2">
          <div className="flex items-start space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{getInitials(demo.tutorName)}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <CardTitle className="text-base font-semibold">{demo.subject} with {demo.tutorName}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {format(demoDate, "PPP")} — {demo.startTime} to {demo.endTime}
              </CardDescription>
            </div>
          </div>
          {demo.status === "Scheduled" && (
            <DialogTrigger asChild>
              <Button size="icon" variant="outline" className="h-7 w-7">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          )}
        </CardHeader>

        <CardContent className="text-xs space-y-2">
          <div className="flex items-center">
            <User className="w-3.5 h-3.5 mr-1 text-primary/70" />
            Student: {demo.studentName}
          </div>
          <div className="flex items-center">
            <CalendarDays className="w-3.5 h-3.5 mr-1 text-primary/70" />
            Grade: {demo.gradeLevel} {demo.board && `(${demo.board})`}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t pt-3 mt-2">
          <div className="flex gap-2 items-center">
            <Badge className={cn("text-[10px] px-2 py-0.5", statusBadgeClasses)}>
              <StatusIcon />
              {demo.status}
            </Badge>
            <Badge className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground">
              <ModeIcon />
              {demo.mode === "Offline (In-person)" ? "Offline" : demo.mode}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {demo.joinLink && demo.status === "Scheduled" && (
              <Button size="sm" asChild className="text-xs px-3 py-1.5">
                <Link href={demo.joinLink} target="_blank" rel="noopener noreferrer">
                  <Video className="w-3 h-3 mr-1" /> Join
                </Link>
              </Button>
            )}

            {demo.status === "Scheduled" && (
              <Button
                size="sm"
                variant="destructive"
                className="text-xs px-3 py-1.5"
                onClick={() => onCancelSession(demo.id)}
              >
                <XCircle className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </CardFooter>

        {demo.status === "Scheduled" && (
          <DialogContent className="p-0">
            <ManageDemoModal
              demoSession={demo}
              onUpdateSession={(updated) => {
                onUpdateSession(updated);
                setIsManageModalOpen(false);
              }}
              onCancelSession={() => {
                onCancelSession(demo.id);
                setIsManageModalOpen(false);
              }}
            />
          </DialogContent>
        )}
      </Card>
    </Dialog>
  );
}
