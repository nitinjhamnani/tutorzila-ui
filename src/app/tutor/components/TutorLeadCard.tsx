
"use client";

import type { TutorLead } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Mail, Phone, Send, MessageSquareText, User, Coins } from "lucide-react"; // Added Coins
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TutorLeadCardProps {
  lead: TutorLead;
}

const getInitials = (name?: string): string => {
  if (!name || name.trim() === "") return "P";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export function TutorLeadCard({ lead }: TutorLeadCardProps) {
  const { toast } = useToast();
  const contactedDate = new Date(lead.contactedOn);
  const parentInitials = getInitials(lead.parentName);

  const handleMessageNow = () => {
    toast({
      title: "Action Placeholder",
      description: `Messaging functionality for ${lead.parentName} coming soon.`,
    });
  };

  return (
    <Card className="bg-card rounded-none shadow-lg border-0 w-full overflow-hidden p-4 sm:p-5 flex flex-col h-full">
      <CardHeader className="p-0 pb-3 sm:pb-4 relative">
        <div className="flex items-start space-x-3">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm border bg-primary text-primary-foreground">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-xs">
              {parentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
              {lead.parentName}
            </CardTitle>
            <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex items-center">
              <CalendarDays className="w-3 h-3 mr-1 text-muted-foreground/80" />
              Contacted On: {format(contactedDate, "PP")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2 sm:pt-3 space-y-1 sm:space-y-1.5 text-xs flex-grow">
        <InfoItem icon={Mail} label="Email:" value={lead.email} />
        <InfoItem icon={Phone} label="Phone:" value={lead.phone} />
        {lead.enquirySubject && <InfoItem icon={User} label="Regarding:" value={`${lead.enquirySubject} ${lead.enquiryGrade ? `(${lead.enquiryGrade})` : '' }`} />}
      </CardContent>
      <CardFooter className="p-0 pt-3 sm:pt-4 border-t border-border/20 flex justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
            <Badge
                className={cn(
                    "py-0.5 px-1.5 border border-border/70 bg-background/50 font-normal text-muted-foreground text-[10px] flex items-center rounded-full"
                )}
            >
                <MessageSquareText className="w-2.5 h-2.5 mr-1 text-muted-foreground/80" />
                {lead.messagesCount} Message{lead.messagesCount !== 1 ? 's' : ''}
            </Badge>
            {typeof lead.leadsConsumed === 'number' && (
                 <Badge
                    className={cn(
                        "py-0.5 px-1.5 border border-border/70 bg-background/50 font-normal text-muted-foreground text-[10px] flex items-center rounded-full"
                    )}
                >
                    <Coins className="w-2.5 h-2.5 mr-1 text-muted-foreground/80" />
                    Leads: {lead.leadsConsumed}
                </Badge>
            )}
        </div>
        <Button
          size="sm"
          className="text-xs py-1.5 px-3 h-auto bg-primary border-primary text-primary-foreground hover:bg-primary/90 transform transition-transform hover:scale-105 active:scale-95"
          onClick={handleMessageNow}
        >
          <Send className="w-3 h-3 mr-1.5" /> Message Now
        </Button>
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

