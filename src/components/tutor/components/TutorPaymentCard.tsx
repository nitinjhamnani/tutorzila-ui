
"use client";

import type { TutorPayment } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Removed AvatarImage
import { User, DollarSign as DollarSignIcon, Clock, CalendarDays, CheckCircle as CheckCircleIcon, XCircle, Info, TrendingUp, FileText, Coins, CheckCircle2, BookOpen, Bell, Settings } from "lucide-react";
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

  const handleUpdatePayment = () => {
    // Placeholder for future modal to update payment details
    console.log("Update payment clicked for ID:", payment.id);
    toast({
      title: "Update Payment (Coming Soon)",
      description: `Functionality to update payment details for ${payment.studentName} is not yet implemented.`,
    });
  };

  return (
    <Card className="bg-card rounded-none shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full">
      <CardHeader className="p-0 pb-3 sm:pb-4 relative">
        <div className="flex items-start space-x-3">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm border bg-primary text-primary-foreground">
            {/* Removed AvatarImage to only show Fallback */}
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-xs">
              {studentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
              Payment Due: ₹{payment.amount.toLocaleString()}
            </CardTitle>
            <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex items-center">
              <User className="w-3 h-3 mr-1 text-muted-foreground/80" />
              With {payment.studentName}
            </CardDescription>
          </div>
          {(payment.status === "Pending" || payment.status === "Overdue") && (
            <Button
              variant="default"
              size="icon"
              className={cn(
                "absolute top-0 right-0 h-7 w-7",
                "bg-primary text-primary-foreground hover:bg-primary/90" 
              )}
              onClick={handleUpdatePayment}
              title="Update Payment Details"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2 sm:pt-3 space-y-1 sm:space-y-1.5 text-xs flex-grow">
        {payment.subject && <InfoItem icon={BookOpen} label="Subject:" value={payment.subject} />}
        {payment.hourlyRate && <InfoItem icon={DollarSignIcon} label="Hourly Rate:" value={`₹${payment.hourlyRate}/hr`} />}
        {payment.totalHours !== undefined && payment.totalSessions !== undefined && (
          <InfoItem icon={Clock} label="Total Duration:" value={`${payment.totalHours} hrs (${payment.totalSessions} sessions)`} />
        )}
        <InfoItem icon={CalendarDays} label="Period:" value={`${format(new Date(payment.fromDate), "PP")} - ${format(new Date(payment.toDate), "PP")}`} />
        {payment.status === "Paid" && payment.paymentDate && (
          <InfoItem icon={CheckCircleIcon} label="Paid On:" value={format(new Date(payment.paymentDate), "PP")} />
        )}
      </CardContent>
      <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
            <Badge
                className={cn(
                    "py-0.5 px-1.5 border border-border/70 bg-background/50 font-normal text-muted-foreground text-[10px] flex items-center rounded-full"
                )}
            >
                <StatusIcon />
                {payment.status}
            </Badge>
        </div>
        <div className="flex items-center gap-2">
          {payment.status === "Pending" && (
            <Button
              size="sm"
              className="text-xs py-1.5 px-3 h-auto bg-primary border-primary text-primary-foreground hover:bg-primary/90 transform transition-transform hover:scale-105 active:scale-95"
              onClick={handleMarkPaid}
            >
              <CheckCircleIcon className="w-3 h-3 mr-1.5" /> Mark Paid
            </Button>
          )}
          {payment.status === "Overdue" && (
            <Button
              size="sm"
              variant="destructive"
              className="text-xs py-1.5 px-3 h-auto transform transition-transform hover:scale-105 active:scale-95"
              onClick={() => toast({ title: "Reminder Sent (Mock)", description: `Payment reminder sent to ${payment.studentName}.`})}
            >
              <Bell className="w-3 h-3 mr-1.5" /> Send Reminder
            </Button>
          )}
          {payment.status === "Paid" && (
            <Button size="sm" variant="outline" className="text-xs py-1.5 px-3 h-auto cursor-default bg-green-100 text-green-700 border-green-300 hover:bg-green-100">
              <CheckCircle2 className="w-3 h-3 mr-1.5"/>
              Payment Cleared
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  className?: string;
}

function InfoItem({ icon: Icon, label, value, className }: InfoItemProps) {
 return (
    <div className={cn("flex items-start text-xs w-full min-w-0", className)}>
      <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0 mt-[1px]" />
      <div className="min-w-0 flex-1">
        <strong className="text-muted-foreground font-medium">{label}</strong>&nbsp;
        <span className="text-foreground/90 break-words">{value}</span>
      </div>
    </div>
  );
}
