
"use client";

import type { DemoSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, User, Video, CheckCircle, XCircle, MessageSquareQuote, Edit3, MessageSquareText, Info, ListFilter } from "lucide-react"; // Added MessageSquareQuote
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ParentDemoSessionCardProps {
  demo: DemoSession;
  onReschedule: (demoId: string) => void;
  onCancel: (demoId: string) => void;
  onEditRequest: (demoId: string) => void;
  onWithdrawRequest: (demoId: string) => void;
  onGiveFeedback: (demoId: string) => void;
}

export function ParentDemoSessionCard({ demo, onReschedule, onCancel, onEditRequest, onWithdrawRequest, onGiveFeedback }: ParentDemoSessionCardProps) {
  const demoDate = new Date(demo.date);

  const getStatusBadgeVariant = () => {
    switch (demo.status) {
      case "Scheduled": return "bg-blue-100 text-blue-700 border-blue-500/50";
      case "Requested": return "bg-yellow-100 text-yellow-700 border-yellow-500/50";
      case "Completed": return "bg-green-100 text-green-700 border-green-500/50";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-500/50";
      default: return "outline";
    }
  };

  const StatusIcon = () => {
    switch (demo.status) {
      case "Scheduled": return <Clock className="mr-1.5 h-3 w-3" />;
      case "Requested": return <MessageSquareQuote className="mr-1.5 h-3 w-3" />;
      case "Completed": return <CheckCircle className="mr-1.5 h-3 w-3" />;
      case "Cancelled": return <XCircle className="mr-1.5 h-3 w-3" />;
      default: return <Info className="mr-1.5 h-3 w-3" />;
    }
  };

  return (
    <Card className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-0.5">
      <CardHeader className="p-4 pb-3 bg-muted/20 border-b">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
             <Avatar className="h-10 w-10 shrink-0 rounded-full shadow-sm border">
              <AvatarImage src={demo.tutorAvatarSeed ? `https://picsum.photos/seed/${demo.tutorAvatarSeed}/128` : `https://avatar.vercel.sh/${demo.tutorName}.png`} alt={demo.tutorName} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {demo.tutorName?.split(" ").map(n => n[0]).join("").toUpperCase() || "T"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <CardTitle className="text-sm font-semibold text-foreground truncate" title={demo.subject}>
                Demo: {demo.subject}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground mt-0.5 truncate">
                Tutor: {demo.tutorName || "N/A"} | For: {demo.studentName}
              </CardDescription>
            </div>
          </div>
           <Badge variant="outline" className={cn("text-[10px] py-0.5 px-2 border font-medium whitespace-nowrap rounded-full", getStatusBadgeVariant())}>
            <StatusIcon />
            {demo.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-xs flex-grow">
        <InfoItem icon={CalendarDays} label="Date" value={format(demoDate, "MMM d, yyyy")} />
        <InfoItem icon={Clock} label="Time" value={demo.time} />
        {demo.mode && <InfoItem icon={demo.mode === "Online" ? Video : Users} label="Mode" value={demo.mode} />}
        <InfoItem icon={ListFilter} label="Grade" value={demo.gradeLevel} />
        <InfoItem icon={ListFilter} label="Board" value={demo.board} />
      </CardContent>
      <CardFooter className="p-3 border-t bg-card/50 flex flex-wrap justify-end items-center gap-2">
        {demo.status === "Scheduled" && (
          <>
            {demo.joinLink && (
              <Button asChild size="xs" className="text-[11px] py-1 px-2 h-auto">
                <Link href={demo.joinLink} target="_blank" rel="noopener noreferrer">
                  <Video className="w-3 h-3 mr-1" /> Join Now
                </Link>
              </Button>
            )}
            <Button size="xs" variant="outline" className="text-[11px] py-1 px-2 h-auto" onClick={() => onReschedule(demo.id)}>
              <Edit3 className="w-3 h-3 mr-1" /> Reschedule
            </Button>
            <Button size="xs" variant="destructiveOutline" className="text-[11px] py-1 px-2 h-auto" onClick={() => onCancel(demo.id)}>
              <XCircle className="w-3 h-3 mr-1" /> Cancel
            </Button>
          </>
        )}
        {demo.status === "Requested" && (
          <>
            <Button size="xs" variant="outline" className="text-[11px] py-1 px-2 h-auto" onClick={() => onEditRequest(demo.id)}>
              <Edit3 className="w-3 h-3 mr-1" /> Edit Request
            </Button>
            <Button size="xs" variant="destructiveOutline" className="text-[11px] py-1 px-2 h-auto" onClick={() => onWithdrawRequest(demo.id)}>
              <XCircle className="w-3 h-3 mr-1" /> Withdraw
            </Button>
          </>
        )}
        {demo.status === "Completed" && !demo.feedbackSubmitted && (
          <Button size="xs" variant="outline" className="text-[11px] py-1 px-2 h-auto" onClick={() => onGiveFeedback(demo.id)}>
            <MessageSquareText className="w-3 h-3 mr-1" /> Give Feedback
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface InfoItemPropsLocal { // Renamed to avoid conflict if InfoItem is used elsewhere
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemPropsLocal) {
  return (
    <div className="flex items-center text-xs">
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0" />
      <strong className="text-foreground/80 font-medium">{label}:</strong>&nbsp;
      <span className="text-muted-foreground truncate">{value}</span>
    </div>
  );
}
