
"use client";

import type { TutorLead } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Mail, Phone, Send, MessageSquareText, User, Coins } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Input might be better than Textarea for single line

interface TutorLeadCardProps {
  lead: TutorLead;
}

interface Message {
  id: string;
  sender: "You" | "Parent";
  text: string;
  timestamp: Date;
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

  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [messagesCount, setMessagesCount] = useState(lead.messagesCount);

  useEffect(() => {
    // Mock fetching initial messages for this lead
    const initialMessages: Message[] = [
      { id: "msg1", sender: "Parent", text: `Hi, I'm interested in ${lead.enquirySubject || 'your tutoring services'} for ${lead.enquiryGrade || 'my child'}.`, timestamp: new Date(Date.now() - 3600000 * 2) },
      { id: "msg2", sender: "You", text: `Hello ${lead.parentName}! Thanks for reaching out. How can I help you today?`, timestamp: new Date(Date.now() - 3600000 * 1.5) },
    ];
    if (lead.lastMessageSnippet && lead.messagesCount > 2) {
         initialMessages.push({id: "msg_last_parent", sender: "Parent", text: lead.lastMessageSnippet, timestamp: new Date(Date.now() - 3600000 * 1)});
    }
    setMessageHistory(initialMessages);
    setMessagesCount(lead.messagesCount);
  }, [lead]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const myMessage: Message = {
      id: `msg${messageHistory.length + 1}`,
      sender: "You",
      text: newMessage,
      timestamp: new Date(),
    };
    const updatedHistory = [...messageHistory, myMessage];
    setMessageHistory(updatedHistory);
    setNewMessage("");
    setMessagesCount(prev => prev + 1);

    // Mock parent reply
    setTimeout(() => {
      const parentReply: Message = {
        id: `msg${updatedHistory.length + 1}`,
        sender: "Parent",
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date(),
      };
      setMessageHistory(prev => [...prev, parentReply]);
      setMessagesCount(prev => prev + 1);
    }, 1500);
  };


  return (
    <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
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
                  {messagesCount} Message{messagesCount !== 1 ? 's' : ''}
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
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="text-xs py-1.5 px-3 h-auto bg-primary border-primary text-primary-foreground hover:bg-primary/90 transform transition-transform hover:scale-105 active:scale-95"
            >
              <Send className="w-3 h-3 mr-1.5" /> Message Now
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-lg bg-card p-0 rounded-xl flex flex-col h-[70vh] sm:h-[600px]">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-semibold text-primary">Chat with {lead.parentName}</DialogTitle>
          {lead.enquirySubject && (
            <DialogDescription className="text-sm text-muted-foreground">
              Regarding: {lead.enquirySubject} {lead.enquiryGrade ? `(${lead.enquiryGrade})` : ''}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <ScrollArea className="flex-grow p-4 space-y-3">
          {messageHistory.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full max-w-[85%] sm:max-w-[75%] flex-col gap-1",
                msg.sender === "You" ? "ml-auto items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-3 py-2 text-sm shadow",
                  msg.sender === "You"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground px-1">
                {format(msg.timestamp, "p, MMM d")}
              </span>
            </div>
          ))}
        </ScrollArea>
        
        <DialogFooter className="p-4 border-t bg-card">
          <div className="flex items-center w-full space-x-2">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[40px] max-h-[100px] flex-1 text-sm resize-none bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button type="button" size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()} className="h-10 w-10 shrink-0">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

    