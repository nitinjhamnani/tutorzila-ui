
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Search, User, Clock, Send, ArrowLeft, UserCircle as UserProfileIcon, Info } from "lucide-react";
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { ConversationSummary, Message, TuitionRequirement } from "@/types";
import { MOCK_PARENT_CONVERSATIONS, MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const getInitials = (name: string): string => {
  if (!name || name.trim() === "") return "?";
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
};

export default function ParentConversationDetailPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;

  const [conversation, setConversation] = useState<ConversationSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCheckingAuth && conversationId && user) {
      if (!isAuthenticated || user?.role !== "parent") {
        router.replace("/");
        return;
      }
      const foundConversation = MOCK_PARENT_CONVERSATIONS.find(c => c.id === conversationId);
      if (foundConversation) {
        setConversation(foundConversation);
        
        let initialMessages: Message[] = [
          { id: "m1", sender: foundConversation.tutorName, text: `Hello! I saw your enquiry. How can I help?`, timestamp: new Date(Date.now() - 3600000 * 3), type: 'chat' },
          { id: "m2", sender: "You", text: `Hi ${foundConversation.tutorName}, I wanted to discuss the schedule.`, timestamp: new Date(Date.now() - 3600000 * 2.5), type: 'chat' },
          { id: "m3", sender: foundConversation.tutorName, text: foundConversation.lastMessage, timestamp: parseISO(foundConversation.lastMessageTimestamp), type: 'chat' },
        ];

        // Try to find the associated enquiry
        let associatedEnquiry: TuitionRequirement | undefined;
        if (foundConversation.enquiryId) {
            associatedEnquiry = MOCK_ALL_PARENT_REQUIREMENTS.find(req => req.id === foundConversation.enquiryId && req.parentId === user.id);
        } else if (foundConversation.enquirySubject && foundConversation.tutorId) {
            // Fallback matching logic if enquiryId is not present
            associatedEnquiry = MOCK_ALL_PARENT_REQUIREMENTS.find(
                req => req.parentId === user.id && 
                       req.subject.includes(foundConversation.enquirySubject!) && 
                       req.appliedTutorIds?.includes(foundConversation.tutorId)
            );
        }
        
        if (associatedEnquiry) {
          const enquiryInfoMessage: Message = {
            id: `enquiry-info-${associatedEnquiry.id}`,
            sender: "System", // Not displayed for info_block
            type: 'info_block',
            enquiry: associatedEnquiry,
            timestamp: new Date(Date.now() - 3600000 * 4), // Ensure it's older
          };
          initialMessages.unshift(enquiryInfoMessage); // Add to the beginning
        }

        setMessages(initialMessages);
      } else {
        router.replace("/parent/messages");
      }
      setLoading(false);
    }
  }, [isCheckingAuth, isAuthenticated, user, router, conversationId]);
  
  useEffect(() => {
    if (viewportRef.current) {
      setTimeout(() => { 
        viewportRef.current!.scrollTop = viewportRef.current!.scrollHeight;
      }, 50);
    }
  }, [messages]);

  const [newMessageText, setNewMessageText] = useState(""); // Renamed from newMessage to avoid conflict

  const handleSendMessage = () => {
    if (!newMessageText.trim() || !conversation) return;
    const messageToSend: Message = { 
      id: `m${messages.length + 1}`,
      sender: "You",
      text: newMessageText,
      timestamp: new Date(),
      type: 'chat',
    };
    setMessages(prev => [...prev, messageToSend]);
    setNewMessageText("");

    setTimeout(() => {
        if (conversation) { 
            setMessages(prev => [...prev, {
                id: `m${prev.length + 1}`,
                sender: conversation.tutorName,
                text: "Thanks for your message! I'll get back to you shortly.",
                timestamp: new Date(),
                type: 'chat',
            }]);
        }
    }, 1500);
  };

  if (loading || isCheckingAuth || !user) {
    return <div className="flex h-[calc(100vh_-_var(--header-height))] items-center justify-center text-muted-foreground">Loading Chat...</div>;
  }

  if (!conversation) {
    return (
      <div className="flex h-[calc(100vh_-_var(--header-height))] items-center justify-center text-muted-foreground">
        Conversation not found. <Link href="/parent/messages" className="ml-2 text-primary hover:underline">Go back to messages</Link>
      </div>
    );
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-0 md:px-6 py-0 md:py-8 h-[calc(100vh_-_var(--header-height))] md:h-auto">
        <Card className="flex flex-col rounded-none md:rounded-lg border-0 md:border bg-card shadow-none md:shadow-sm overflow-hidden h-full">
          <CardHeader className="p-3 md:p-4 border-b bg-muted/30 flex flex-row items-center justify-between space-x-3">
            <div className="flex items-center space-x-3 flex-grow min-w-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden text-muted-foreground hover:text-primary" onClick={() => router.push('/parent/messages')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage src={`https://picsum.photos/seed/${conversation.tutorAvatarSeed}/128`} alt={conversation.tutorName} />
                <AvatarFallback className="text-sm bg-primary/10 text-primary">{getInitials(conversation.tutorName)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow min-w-0">
                <h2 className="text-base font-semibold text-foreground truncate" title={conversation.tutorName}>{conversation.tutorName}</h2>
                {/* Removed "Regarding: {conversation.enquirySubject}" */}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {conversation.status && (
                    <div className="hidden sm:flex items-center">
                        <span className={cn("h-2 w-2 rounded-full mr-1.5", conversation.status === "Online" ? "bg-green-500" : "bg-gray-400")}></span>
                        <p className="text-xs text-muted-foreground">{conversation.status}</p>
                    </div>
                )}
                 <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                          <Link href={`/tutors/${conversation.tutorId}`}>
                            <UserProfileIcon className="h-5 w-5" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View {conversation.tutorName}'s Profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-grow bg-background/30" viewportRef={viewportRef}>
            <div className="p-4 space-y-4">
              {messages.map((msg) => {
                if (msg.type === 'info_block' && msg.enquiry) {
                  return (
                    <div key={msg.id} className="my-3 p-3 bg-muted/40 border border-border rounded-lg text-xs text-foreground shadow-sm">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Info className="h-4 w-4 text-primary shrink-0" />
                        <h4 className="font-semibold text-primary text-sm">Tuition Enquiry Details:</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 pl-1">
                        <p><strong>Subject(s):</strong> {msg.enquiry.subject.join(', ')}</p>
                        <p><strong>Grade:</strong> {msg.enquiry.gradeLevel}</p>
                        {msg.enquiry.board && <p><strong>Board:</strong> {msg.enquiry.board}</p>}
                        {msg.enquiry.teachingMode && msg.enquiry.teachingMode.length > 0 && <p><strong>Mode:</strong> {msg.enquiry.teachingMode.join(', ')}</p>}
                        {msg.enquiry.location && <p><strong>Location:</strong> {msg.enquiry.location}</p>}
                      </div>
                       <div className="mt-2 text-right">
                        <Link href={`/parent/my-enquiries/${msg.enquiry.id}`} className="text-primary hover:underline text-[11px] font-medium">
                          View Full Enquiry &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                }
                // Render regular chat bubble
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
                            : "bg-card border"
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

          <CardFooter className="p-3 md:p-4 border-t bg-card">
            <div className="flex items-center gap-2 w-full">
              <Textarea
                placeholder="Type your message..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                className="flex-1 text-sm min-h-[40px] max-h-[100px] resize-none bg-input border-border focus:border-primary shadow-sm"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!newMessageText.trim()} className="h-10 w-10">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
