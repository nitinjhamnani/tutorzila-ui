
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Send, Info } from "lucide-react"; // Added Info icon
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { TuitionRequirement } from "@/types"; // Added TuitionRequirement type
import Link from "next/link"; // Added Link import

export interface Message {
  id: string;
  sender: "You" | string; 
  text?: string;
  timestamp: Date;
  type?: 'chat' | 'info_block';
  enquiry?: TuitionRequirement;
}

interface MessageModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  leadName: string; // This is the tutor's name
  enquirySubject?: string; // Kept for DialogDescription, but info_block is primary
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
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && viewportRef.current) {
      setTimeout(() => {
        if (viewportRef.current) {
          viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
        }
      }, 50); 
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
          {enquirySubject && !initialMessages.some(msg => msg.type === 'info_block') && ( // Only show if no info_block
            <DialogDescription className="text-sm text-muted-foreground">
              Regarding: {enquirySubject}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea
          className="flex-grow"
          viewportRef={viewportRef}
        >
          <div className="p-4 space-y-3">
            {initialMessages.map((msg) => {
              if (msg.type === 'info_block' && msg.enquiry) {
                return (
                  <div key={msg.id} className="my-3 p-3 bg-muted/40 border border-border rounded-lg text-xs text-foreground shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Info className="h-4 w-4 text-primary shrink-0" />
                      <h4 className="font-semibold text-primary text-sm">Tuition Enquiry Details:</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 pl-1">
                      <p><strong>Subject(s):</strong> {Array.isArray(msg.enquiry.subject) ? msg.enquiry.subject.join(', ') : msg.enquiry.subject}</p>
                      <p><strong>Grade:</strong> {msg.enquiry.gradeLevel}</p>
                      {msg.enquiry.board && <p><strong>Board:</strong> {msg.enquiry.board}</p>}
                      {msg.enquiry.teachingMode && msg.enquiry.teachingMode.length > 0 && <p><strong>Mode:</strong> {msg.enquiry.teachingMode.join(', ')}</p>}
                      {msg.enquiry.location && <p><strong>Location:</strong> {msg.enquiry.location}</p>}
                    </div>
                      <div className="mt-2 text-right">
                      <Link href={`/parent/my-enquiries/${msg.enquiry.id}`} className="text-primary hover:underline text-[11px] font-medium" onClick={() => onOpenChange(false)}>
                          View Full Enquiry &rarr;
                      </Link>
                      </div>
                  </div>
                );
              }
              return (
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
              );
            })}
          </div>
          <ScrollBar orientation="vertical" />
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
