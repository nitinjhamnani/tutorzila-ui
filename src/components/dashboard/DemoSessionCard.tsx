
"use client";

import type { DemoSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Video, CheckCircle, XCircle, AlertTriangle, BookOpen, GraduationCap, ShieldCheck, Settings } from "lucide-react"; // Changed Edit3 to Settings
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ManageDemoModal } from "@/components/modals/ManageDemoModal";

interface DemoSessionCardProps {
  demo: DemoSession;
  onUpdateSession: (updatedDemo: DemoSession) => void;
  onCancelSession: (sessionId: string) => void;
}

export function DemoSessionCard({ demo, onUpdateSession, onCancelSession }: DemoSessionCardProps) {
  const demoDate = new Date(demo.date);

  const statusBadgeClasses = () => {
    switch (demo.status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700 border-blue-500/50 hover:bg-blue-200";
      case "Completed":
        return "bg-green-100 text-green-700 border-green-500/50 hover:bg-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-500/50 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-500/50 hover:bg-gray-200";
    }
  };

  const StatusIcon = () => {
    switch (demo.status) {
      case "Scheduled":
        return <Clock className="mr-1.5 h-3.5 w-3.5" />;
      case "Completed":
        return <CheckCircle className="mr-1.5 h-3.5 w-3.5" />;
      case "Cancelled":
        return <XCircle className="mr-1.5 h-3.5 w-3.5" />;
      default:
        return <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />;
    }
  };

  return (
    <Dialog>
      <Card className="bg-card border border-border/40 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-1">
        <CardHeader className="p-4 pb-3 bg-muted/20 border-b border-border/30">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-grow min-w-0">
              <CardTitle className="text-sm font-semibold text-primary group-hover:text-primary/90 transition-colors line-clamp-1">
                Demo: {demo.subject}
              </CardTitle>
              <CardDescription className="text-[0.7rem] text-muted-foreground mt-0.5 flex items-center">
                <User className="w-3 h-3 mr-1 text-muted-foreground/80" />
                With {demo.studentName}
              </CardDescription>
            </div>
            {demo.status === "Scheduled" ? (
              <DialogTrigger asChild>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[0.65rem] py-1 px-2 border font-medium whitespace-nowrap cursor-pointer rounded-full flex items-center gap-1",
                    "bg-card text-primary border-primary/60 hover:border-primary hover:text-primary/90" // Updated styling for white background
                  )}
                >
                  <Settings className="h-3 w-3" /> Manage {/* Changed icon to Settings */}
                </Badge>
              </DialogTrigger>
            ) : (
              <Badge
                variant="outline"
                className={cn("text-[0.65rem] py-1 px-2 border font-medium whitespace-nowrap rounded-full", statusBadgeClasses())}
              >
                <StatusIcon />
                {demo.status}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-1.5 text-xs flex-grow">
          <InfoItem icon={GraduationCap} label="Grade" value={demo.gradeLevel} />
          <InfoItem icon={ShieldCheck} label="Board" value={demo.board} />
          <InfoItem icon={Calendar} label="Date" value={format(demoDate, "MMM d, yyyy")} />
          <InfoItem icon={Clock} label="Time" value={demo.time} />
        </CardContent>
        <CardFooter className="p-3 border-t border-border/30 bg-card/50 group-hover:bg-muted/20 transition-colors duration-300">
          {demo.joinLink && demo.status === "Scheduled" ? (
            <Button asChild size="sm" className="w-full transform transition-transform hover:scale-105 active:scale-95 text-[0.7rem] py-1.5 h-auto">
              <Link href={demo.joinLink} target="_blank" rel="noopener noreferrer">
                <Video className="w-3 h-3 mr-1" /> Join Session
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="w-full text-[0.7rem] py-1.5 h-auto cursor-default bg-muted/50 border-border/50 text-muted-foreground" disabled>
              {demo.status === "Completed" ? "Session Completed" : demo.status === "Cancelled" ? "Session Cancelled" : "No Join Link"}
            </Button>
          )}
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-lg bg-card p-0 rounded-xl overflow-hidden">
          <ManageDemoModal
            demoSession={demo}
            onUpdateSession={(updatedDemo) => {
                onUpdateSession(updatedDemo);
            }}
            onCancelSession={(sessionId) => {
                onCancelSession(sessionId);
            }}
          />
      </DialogContent>
    </Dialog>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center text-xs">
      <Icon className="w-3 h-3 mr-1.5 text-primary/80 shrink-0" />
      <strong className="text-foreground/90 font-medium">{label}:</strong>&nbsp;
      <span className="text-muted-foreground truncate">{value}</span>
    </div>
  );
}

