
"use client";

import type { ParentPayment } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    CalendarDays, Clock, User, FileText, Send, CheckCircle2, AlertTriangle, BookOpen, DollarSign, MessageSquareQuote, FilePlus
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ParentPaymentCardProps {
  payment: ParentPayment;
  onDownloadInvoice: (paymentId: string) => void;
  onSendInvoice: (paymentId: string) => void;
  onGenerateInvoice: (paymentId: string) => void;
}

const getTutorInitials = (name?: string): string => {
  if (!name || name.trim() === "") return "T";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export function ParentPaymentCard({ payment, onDownloadInvoice, onSendInvoice, onGenerateInvoice }: ParentPaymentCardProps) {
  const dueDate = new Date(payment.dueDate);
  const paidDate = payment.paidDate ? new Date(payment.paidDate) : null;
  const tutorInitials = getTutorInitials(payment.tutorName);

  const statusBadgeClasses = () => {
    switch (payment.status) {
      case "Paid": return "bg-green-600 text-green-50 border-green-700/50 hover:bg-green-700";
      case "Due": return "bg-accent text-accent-foreground border-accent/50 hover:bg-accent/90";
      case "Upcoming": return "bg-secondary text-secondary-foreground border-secondary/50 hover:bg-secondary/80";
      case "Overdue": return "bg-destructive text-destructive-foreground border-destructive/50 hover:bg-destructive/90";
      default: return "bg-muted text-muted-foreground border-border hover:bg-muted/80";
    }
  };

  const StatusIcon = () => {
    const iconClasses = cn(
      "w-2.5 h-2.5 mr-1",
      payment.status === "Paid" && "text-green-50",
      payment.status === "Due" && "text-accent-foreground",
      payment.status === "Upcoming" && "text-secondary-foreground",
      payment.status === "Overdue" && "text-destructive-foreground",
      payment.status !== "Paid" && payment.status !== "Due" && payment.status !== "Upcoming" && payment.status !== "Overdue" && "text-muted-foreground"
    );
    switch (payment.status) {
      case "Paid": return <CheckCircle2 className={iconClasses} />;
      case "Due": return <Clock className={iconClasses} />;
      case "Upcoming": return <Clock className={iconClasses} />;
      case "Overdue": return <AlertTriangle className={iconClasses} />; 
      default: return <DollarSign className={iconClasses} />; 
    }
  };

  return (
    <Card className="bg-card rounded-none shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full">
      <CardHeader className="p-0 pb-3 sm:pb-4 relative">
        <div className="flex items-start space-x-3">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm border bg-primary text-primary-foreground">
            <AvatarImage src={payment.tutorAvatarSeed ? `https://picsum.photos/seed/${payment.tutorAvatarSeed}/128` : undefined} alt={payment.tutorName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-xs">
              {tutorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
              Payment for {payment.subject}
            </CardTitle>
            <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex items-center">
              <User className="w-3 h-3 mr-1 text-muted-foreground/80" />
              To: {payment.tutorName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2 sm:pt-3 space-y-1.5 text-xs flex-grow">
        <InfoItem icon={DollarSign} label="Amount:" value={`₹${payment.amount.toLocaleString()}`} />
        <InfoItem icon={CalendarDays} label={payment.status === "Paid" ? "Paid On:" : "Due Date:"} value={payment.status === "Paid" && paidDate ? format(paidDate, "MMM d, yyyy") : format(dueDate, "MMM d, yyyy")} />
        {payment.description && <InfoItem icon={BookOpen} label="Description:" value={payment.description} />}
      </CardContent>
      <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
        <div className="flex items-center space-x-2 self-start sm:self-center">
           <Badge
              className={cn(
                  "py-0.5 px-1.5 border font-normal text-[10px] flex items-center rounded-full",
                  statusBadgeClasses()
              )}
            >
              <StatusIcon />
              {payment.status}
            </Badge>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-end">
          {payment.status === "Paid" ? (
            payment.invoiceId ? (
              <>
                <Button size="sm" variant="outline" className="flex-grow sm:flex-grow-0 text-xs py-1.5 px-2.5 h-auto" onClick={() => onDownloadInvoice(payment.id)}>
                  <FileText className="w-3 h-3 mr-1" /> Download Invoice
                </Button>
                <Button size="sm" variant="outline" className="flex-grow sm:flex-grow-0 text-xs py-1.5 px-2.5 h-auto" onClick={() => onSendInvoice(payment.id)}>
                  <Send className="w-3 h-3 mr-1" /> Send Invoice
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" className="flex-grow sm:flex-grow-0 text-xs py-1.5 px-2.5 h-auto" onClick={() => onGenerateInvoice(payment.id)}>
                <FilePlus className="w-3 h-3 mr-1" /> Generate Invoice
              </Button>
            )
          ) : (payment.status === "Due" || payment.status === "Overdue") ? (
             <Button size="sm" className="flex-grow sm:flex-grow-0 text-xs py-1.5 px-2.5 h-auto bg-primary text-primary-foreground hover:bg-primary/90">
                <DollarSign className="w-3 h-3 mr-1" /> Pay Now
            </Button>
          ) : payment.status === "Upcoming" ? (
             <Button size="sm" variant="outline" className="flex-grow sm:flex-grow-0 text-xs py-1.5 px-2.5 h-auto cursor-default">
                Payment Upcoming
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value?: string;
  className?: string;
}

function InfoItem({ icon: Icon, label, value, className }: InfoItemProps) {
  if (!value) return null;
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

    
