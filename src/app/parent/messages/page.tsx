
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
// Link import removed as cards are no longer direct links
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUp, ArrowDown, ArrowLeft } from "lucide-react"; 
import { useAuthMock } from "@/hooks/use-auth-mock";
import type { ConversationSummary, Message, TuitionRequirement } from "@/types"; // Added Message, TuitionRequirement
import { MOCK_PARENT_CONVERSATIONS, MOCK_ALL_PARENT_REQUIREMENTS } from "@/lib/mock-data"; // Added MOCK_ALL_PARENT_REQUIREMENTS
import { formatDistanceToNow, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; 
import { Button } from "@/components/ui/button";
import { MessageModal } from "@/components/modals/MessageModal"; // Import the modal
import Link from "next/link";


const getInitials = (name: string): string => {
  if (!name || name.trim() === "") return "?";
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
};

export default function ParentMessagesPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const viewportRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConversationForModal, setSelectedConversationForModal] = useState<ConversationSummary | null>(null);
  const [modalMessages, setModalMessages] = useState<Message[]>([]);
  // modalEnquiryDetails state removed as info_block will carry this

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated || user?.role !== "parent") {
        router.replace("/");
      } else {
        const sortedConversations = [...MOCK_PARENT_CONVERSATIONS].sort( // Create a copy before sorting
          (a, b) => parseISO(b.lastMessageTimestamp).getTime() - parseISO(a.lastMessageTimestamp).getTime()
        );
        setConversations(sortedConversations);
      }
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  const filteredConversations = useMemo(() => {
    if (!searchTerm) return conversations;
    return conversations.filter(
      (conv) =>
        conv.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (conv.enquirySubject && conv.enquirySubject.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, conversations]);

  const handleConversationClick = (conv: ConversationSummary) => {
    setSelectedConversationForModal(conv);
    let messagesForModal: Message[] = [];
    let associatedEnquiry: TuitionRequirement | undefined;

    if (conv.enquiryId) {
        associatedEnquiry = MOCK_ALL_PARENT_REQUIREMENTS.find(req => req.id === conv.enquiryId && req.parentId === user?.id);
    } else if (conv.enquirySubject && conv.tutorId && user) {
        associatedEnquiry = MOCK_ALL_PARENT_REQUIREMENTS.find(
            req => req.parentId === user.id && 
                   (Array.isArray(req.subject) ? req.subject.includes(conv.enquirySubject!) : req.subject === conv.enquirySubject) &&
                   req.appliedTutorIds?.includes(conv.tutorId)
        );
    }
    
    if (associatedEnquiry) {
      messagesForModal.push({
        id: `enquiry-info-${associatedEnquiry.id}`,
        sender: "System",
        type: 'info_block',
        enquiry: associatedEnquiry,
        timestamp: new Date(parseISO(associatedEnquiry.postedAt).getTime() - 1000), // Slightly before first message
      });
    }
    
    // Add some mock chat messages
    messagesForModal.push(
      { id: `m1-${conv.id}`, sender: conv.tutorName, text: `Hello! I saw your enquiry${conv.enquirySubject ? ` for ${conv.enquirySubject}` : ''}. How can I help?`, timestamp: new Date(parseISO(conv.lastMessageTimestamp).getTime() - 3600000 * 2), type: 'chat' },
      { id: `m2-${conv.id}`, sender: "You", text: `Hi ${conv.tutorName}, thanks for reaching out.`, timestamp: new Date(parseISO(conv.lastMessageTimestamp).getTime() - 3600000 * 1), type: 'chat' },
      { id: `m3-${conv.id}`, sender: conv.tutorName, text: conv.lastMessage, timestamp: parseISO(conv.lastMessageTimestamp), type: 'chat' }
    );
    
    setModalMessages(messagesForModal);
    setIsModalOpen(true);
  };

  const handleSendMessageInModal = (messageText: string) => {
    if (!selectedConversationForModal) return;

    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      sender: "You",
      text: messageText,
      timestamp: new Date(),
      type: 'chat',
    };
    setModalMessages(prev => [...prev, userMessage]);

    // Simulate tutor reply
    const tutorReplyText = "Thanks for your message! I'll get back to you shortly.";
    const tutorReplyTimestamp = new Date(Date.now() + 1000); // Ensure reply is later
    setTimeout(() => {
      const tutorMessage: Message = {
        id: `msg-tutor-${Date.now()}`,
        sender: selectedConversationForModal.tutorName,
        text: tutorReplyText,
        timestamp: tutorReplyTimestamp,
        type: 'chat',
      };
      setModalMessages(prev => [...prev, tutorMessage]);

      // Update the main conversation list
      setConversations(prevConvs => 
        prevConvs.map(c => 
          c.id === selectedConversationForModal.id 
            ? { ...c, lastMessage: tutorReplyText, lastMessageTimestamp: tutorReplyTimestamp.toISOString(), unreadCount: 0 } 
            : c
        ).sort((a, b) => parseISO(b.lastMessageTimestamp).getTime() - parseISO(a.lastMessageTimestamp).getTime())
      );
    }, 1500);
  };


  const scrollToTop = () => {
    viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  if (isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading Messages...</div>;
  }

  const showScrollButtons = filteredConversations.length > 5;

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-transparent h-9 w-9">
            <Link href="/parent/dashboard" aria-label="Back to Dashboard">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold text-primary">
            My Messages
          </h1>
        </div>

        <Card className="rounded-lg border bg-card shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages, tutors, or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-sm h-9 bg-input border-border focus:border-primary shadow-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border bg-card shadow-sm overflow-hidden relative">
          <ScrollArea 
            className="h-[calc(100vh_-_var(--header-height)_-_12.5rem)]" 
            viewportRef={viewportRef}
          >
            <div className="p-2 space-y-2">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleConversationClick(conv)}
                    className="block w-full group text-left"
                    aria-label={`Open chat with ${conv.tutorName}`}
                  >
                    <Card className="relative p-3 sm:p-4 hover:bg-muted/30 transition-colors duration-150 ease-in-out cursor-pointer shadow-sm hover:shadow-md border-border/50">
                      <div className="flex items-center justify-between space-x-3 sm:space-x-4">
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-grow min-w-0">
                          <Avatar className="h-10 w-10 shrink-0 border-2 border-transparent group-hover:border-primary/30 transition-colors">
                            <AvatarImage src={`https://picsum.photos/seed/${conv.tutorAvatarSeed}/128`} alt={conv.tutorName} />
                            <AvatarFallback className="text-xs bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              {getInitials(conv.tutorName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                              <p className={cn("text-sm sm:text-base font-semibold truncate text-foreground group-hover:text-primary transition-colors")}>{conv.tutorName}</p>
                            <div className={cn("text-xs sm:text-sm font-normal mt-0.5 truncate", conv.unreadCount > 0 ? "text-foreground" : "text-muted-foreground/90")}>{conv.lastMessage}</div>
                              <div className="text-[10px] text-muted-foreground whitespace-nowrap mt-1">
                              {formatDistanceToNow(parseISO(conv.lastMessageTimestamp), { addSuffix: true, includeSeconds: false })}
                            </div>
                          </div>
                        </div>

                        <div className="flex-shrink-0 self-center">
                          {conv.unreadCount > 0 && (
                              <Badge className="h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground">
                              {conv.unreadCount}
                              </Badge>
                          )}
                          </div>
                      </div>
                    </Card>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No conversations found.
                </div>
              )}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          {showScrollButtons && (
            <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollToTop}
                className="h-8 w-8 bg-card/80 hover:bg-muted text-primary border-primary/50 backdrop-blur-sm"
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollToBottom}
                className="h-8 w-8 bg-card/80 hover:bg-muted text-primary border-primary/50 backdrop-blur-sm"
                aria-label="Scroll to bottom"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
      {selectedConversationForModal && (
        <MessageModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          leadName={selectedConversationForModal.tutorName}
          enquirySubject={selectedConversationForModal.enquirySubject} // Kept for context, though info_block is primary
          initialMessages={modalMessages}
          onSendMessage={handleSendMessageInModal}
        />
      )}
    </main>
  );
}
