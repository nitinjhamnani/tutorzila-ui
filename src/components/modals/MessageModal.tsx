
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Import ScrollBar
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface Message {
  id: string;
  sender: "You" | "Parent" | string; // Allow for dynamic parent name
  text: string;
  timestamp: Date;
}

interface MessageModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  leadName: string;
  enquirySubject?: string;
  initialMessages: Message[];
  onSendMessage: (messageText: string) => void;
}

export function MessageModal({
  isOpen,
  onOpenChange,
  leadName,
  enquirySubject,
  initialMessages,
  onSendMessage,
}: MessageModalProps) {
  const [newMessage, setNewMessage] = useState("");
  const viewportRef = useRef<HTMLDivElement>(null); // Ref for the viewport

  useEffect(() => {
    if (isOpen && viewportRef.current) {
      // Scroll to bottom when new messages are added or modal opens
      setTimeout(() => {
        if (viewportRef.current) {
          viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
        }
      }, 50); // Small delay to ensure DOM update
    }
  }, [initialMessages, isOpen]);

  const handleInternalSendMessage = () => {
    if (newMessage.trim() === "") return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card p-0 rounded-xl flex flex-col h-[70vh] sm:h-[600px] overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-semibold text-primary">Chat with {leadName}</DialogTitle>
          {enquirySubject && (
            <DialogDescription className="text-sm text-muted-foreground">
              Regarding: {enquirySubject}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea
          className="flex-grow" // Removed p-4 from here
          viewportRef={viewportRef} // Pass the ref to ScrollArea's viewportRef prop
        >
          <div className="p-4 space-y-3"> {/* Inner div for padding message content */}
            {initialMessages.map((msg) => (
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
                      : "bg-muted text-foreground"
                  )}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {format(new Date(msg.timestamp), "p, MMM d")}
                </span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical" /> {/* Explicitly add ScrollBar */}
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
                  handleInternalSendMessage();
                }
              }}
            />
            <Button type="button" size="icon" onClick={handleInternalSendMessage} disabled={!newMessage.trim()} className="h-10 w-10 shrink-0">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
