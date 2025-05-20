
"use client";

import type { TutorPayment } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, DollarSign as DollarSignIcon, Clock, CalendarDays, CheckCircle, XCircle, Info, TrendingUp, FileText, Coins, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface TutorPaymentCardProps {
  payment: TutorPayment;
  onMarkPaid: (paymentId: string) => void;
}

const getInitials = (name?: string): string => {
  if (!name || name.trim() === "") return "S";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};


export function TutorPaymentCard({ payment, onMarkPaid }: TutorPaymentCardProps) {
  const { toast } = useToast();
  const studentInitials = getInitials(payment.studentName);

  const statusBadgeClasses = () => {
    switch (payment.status) {
      case "Pending":
        return "bg-orange-100 text-orange-700 border-orange-500/50 hover:bg-orange-200";
      case "Paid":
        return "bg-green-100 text-green-700 border-green-500/50 hover:bg-green-200";
      case "Overdue":
        return "bg-red-100 text-red-700 border-red-500/50 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-500/50 hover:bg-gray-200";
    }
  };

  const StatusIcon = () => {
    const iconClasses = "w-2.5 h-2.5 mr-1 text-muted-foreground/80";
    switch (payment.status) {
      case "Pending": return <Clock className={iconClasses} />;
      case "Paid": return <CheckCircle2 className={iconClasses} />;
      case "Overdue": return <XCircle className={iconClasses} />;
      default: return <Info className={iconClasses} />;
    }
  };

  const handleMarkPaid = () => {
    onMarkPaid(payment.id);
    toast({
      title: "Payment Updated",
      description: `Payment from ${payment.studentName} for ₹${payment.amount} marked as paid.`,
    });
  };

  return (
    <Card className="bg-card rounded-xl shadow-lg border border-border/30 w-full overflow-hidden flex flex-col h-full">
      <CardHeader className="bg-muted/30 p-3 sm:p-4 border-b border-border/30">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm border">
              <AvatarImage src={payment.studentAvatarSeed ? `https://picsum.photos/seed/${payment.studentAvatarSeed}/128` : `https://avatar.vercel.sh/${payment.studentName}.png`} alt={payment.studentName} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {studentInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <CardTitle className="text-sm sm:text-base font-semibold text-primary line-clamp-1" title={`Payment Due: ₹${payment.amount}`}>
                Payment Due: ₹{payment.amount.toLocaleString()}
              </CardTitle>
              <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex items-center">
                <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 text-muted-foreground/80" />
                With {payment.studentName}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("text-[10px] py-0.5 px-2 border font-medium whitespace-nowrap rounded-full", statusBadgeClasses())}
          >
            <StatusIcon />
            {payment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 text-xs flex-grow">
        {payment.subject && <InfoItem icon={BookOpen} label="Subject:" value={payment.subject} />}
        {payment.hourlyRate && <InfoItem icon={DollarSignIcon} label="Hourly Rate:" value={`₹${payment.hourlyRate}/hr`} />}
        {payment.totalHours !== undefined && payment.totalSessions !== undefined && (
          <InfoItem icon={Clock} label="Total Duration:" value={`${payment.totalHours} hrs (${payment.totalSessions} sessions)`} />
        )}
        <InfoItem icon={CalendarDays} label="Period:" value={`${format(new Date(payment.fromDate), "PP")} - ${format(new Date(payment.toDate), "PP")}`} />
        {payment.status === "Paid" && payment.paymentDate && (
          <InfoItem icon={CheckCircle} label="Paid On:" value={format(new Date(payment.paymentDate), "PP")} />
        )}
      </CardContent>
      <CardFooter className="bg-muted/30 p-3 sm:p-4 border-t border-border/30 flex justify-end items-center gap-2">
        {payment.status === "Pending" && (
          <Button
            size="sm"
            className="text-xs py-1.5 px-3 h-auto bg-primary border-primary text-primary-foreground hover:bg-primary/90 transform transition-transform hover:scale-105 active:scale-95"
            onClick={handleMarkPaid}
          >
            <CheckCircle className="w-3 h-3 mr-1.5" /> Mark Paid
          </Button>
        )}
         {payment.status === "Overdue" && (
          <Button
            size="sm"
            variant="destructive"
            className="text-xs py-1.5 px-3 h-auto transform transition-transform hover:scale-105 active:scale-95"
            onClick={() => console.log("Send Reminder for", payment.id)}
          >
            <Bell className="w-3 h-3 mr-1.5" /> Send Reminder
          </Button>
        )}
        {payment.status === "Paid" && (
           <Button size="sm" variant="outline" className="text-xs py-1.5 px-3 h-auto cursor-default">
            Payment Cleared
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start text-xs">
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/80 shrink-0 mt-[1px]" />
      <strong className="text-foreground/80 font-medium whitespace-nowrap">{label}</strong>&nbsp;
      <span className="text-muted-foreground break-words">{value}</span>
    </div>
  );
}

// Additional icons if not already declared
const Bell: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);
const BookOpen: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
