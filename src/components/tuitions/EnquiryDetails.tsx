
"use client";

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Clock,
  MapPin,
  Building,
  RadioTower,
  ClipboardList,
  Info,
  DollarSign,
  Briefcase,
  MessageSquare,
  Send,
  ArrowLeft,
  Copy,
  Mail,
  Phone,
  Lock,
  Unlock,
  CheckCircle, 
  Bookmark,
  Users as UsersIcon, 
} from "lucide-react";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter, 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface EnquiryDetailsProps {
  requirement: TuitionRequirement;
}

const getInitials = (name?: string): string => {
  if (!name || name.trim() === "") return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export function EnquiryDetails({ requirement }: EnquiryDetailsProps) {
  const postedDate = requirement.postedAt ? parseISO(requirement.postedAt) : new Date();
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const formattedPostedDate = format(postedDate, "MMMM d, yyyy 'at' h:mm a");
  const { toast } = useToast();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false); 
  const [isShortlisted, setIsShortlisted] = useState(requirement.mockIsShortlistedByCurrentUser || false); 

  const parentInitials = getInitials(requirement.parentName);
  const mockParentEmail = `${requirement.parentName?.toLowerCase().replace(/\s+/g, '.')}@example.com`;
  const mockParentPhone = `+91-98765XXXXX`; 

  const handleCopy = async (textToCopy: string, fieldName: string) => {
    if (!isApplied) {
      toast({
        variant: "destructive",
        title: "Details Locked",
        description: `Please apply for the tuition to view and copy ${fieldName.toLowerCase()}.`,
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: `${fieldName} Copied!`,
        description: `${textToCopy} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: `Could not copy ${fieldName.toLowerCase()}. Please try again.`,
      });
      console.error(`Failed to copy ${fieldName}: `, err);
    }
  };

  const handleApplyMock = () => {
    setIsApplied(true);
    toast({
      title: "Applied Successfully (Mock)",
      description: "You have successfully applied for this tuition. Parent contact details are now unlocked.",
    });
  };

  const handleShortlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsShortlisted(prev => {
      const newShortlistStatus = !prev;
      toast({
        title: newShortlistStatus ? "Added to Shortlist" : "Removed from Shortlist",
        description: `Enquiry for ${Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject} has been ${newShortlistStatus ? 'added to' : 'removed from'} your shortlist.`,
      });
      // In a real app, you would also make an API call here to update the shortlist status
      return newShortlistStatus;
    });
  };

  return (
    <Card className="bg-card border rounded-lg shadow-lg animate-in fade-in duration-500 ease-out overflow-hidden">
      <CardHeader className="bg-muted/30 p-4 md:p-5 border-b relative"> 
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center space-x-3 flex-grow min-w-0">
            {requirement.parentName && (
              <Avatar className="h-10 w-10 shrink-0 rounded-full shadow-sm border border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-xs">
                  {parentInitials}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-grow min-w-0">
                {requirement.parentName && (
                    <CardTitle className="text-lg md:text-xl font-semibold text-primary tracking-tight mb-0.5 break-words">
                        {requirement.parentName}
                    </CardTitle>
                )}
                <CardDescription className="text-xs text-foreground/70 mt-0">
                Posted {timeAgo} (on {formattedPostedDate})
                </CardDescription>
            </div>
          </div>
           <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full", 
              isShortlisted && "text-primary"
            )}
            onClick={handleShortlistToggle}
            title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
          >
            <Bookmark className={cn("h-4.5 w-4.5 transition-colors", isShortlisted && "fill-primary")} /> 
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-5 space-y-4">
        
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-primary/80" />
            Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pl-6 text-xs">
            <DetailItem label="Subject(s)" value={Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject} className="text-xs"/>
            <DetailItem label="Grade Level" value={requirement.gradeLevel} className="text-xs" />
            {requirement.board && <DetailItem label="Board" value={requirement.board} className="text-xs"/>}
             {requirement.applicantsCount !== undefined && (
              <DetailItem label="Applicants" value={String(requirement.applicantsCount)} icon={UsersIcon} className="text-xs"/>
            )}
          </div>
        </section>

        <Separator />

        
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-primary/80" />
            Schedule & Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pl-6 text-xs">
            {requirement.preferredDays && requirement.preferredDays.length > 0 && (
              <DetailItem label="Preferred Days" value={requirement.preferredDays.join(', ')} icon={CalendarDays} className="text-xs"/>
            )}
            {requirement.preferredTimeSlots && requirement.preferredTimeSlots.length > 0 && (
              <DetailItem label="Preferred Time" value={requirement.preferredTimeSlots.join(', ')} icon={Clock} className="text-xs"/>
            )}
            {requirement.location && <DetailItem label="Location Preference" value={requirement.location} icon={MapPin} className="text-xs"/>}
            {requirement.teachingMode && requirement.teachingMode.length > 0 && (
              <DetailItem label="Teaching Mode(s)" icon={RadioTower} className="text-xs">
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {requirement.teachingMode.map(mode => (
                    <Badge key={mode} variant="secondary" className="text-[10px] py-0.5 px-1.5">{mode}</Badge>
                  ))}
                </div>
              </DetailItem>
            )}
          </div>
        </section>

        {requirement.additionalNotes && (
          <>
            <Separator />
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center">
                <Info className="w-4 h-4 mr-2 text-primary/80" />
                Additional Notes
              </h3>
              <p className="text-xs text-foreground/80 leading-relaxed pl-6 whitespace-pre-wrap">
                {requirement.additionalNotes}
              </p>
            </section>
          </>
        )}
      </CardContent>

      <CardFooter className="bg-muted/30 p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
        <Button variant="link" asChild className="text-xs p-0 h-auto text-primary hover:text-primary/80">
          <Link href="/dashboard/enquiries">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Go back to listing
          </Link>
        </Button>
        <div className="flex gap-2">
            <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95 text-xs py-1.5 px-2.5"
                >
                  {isApplied ? <Unlock className="w-3.5 h-3.5 mr-1.5"/> : <Lock className="w-3.5 h-3.5 mr-1.5"/>}
                   Contact Parent
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card">
                <DialogHeader>
                  <DialogTitle className="flex items-center text-lg font-semibold text-primary">
                    {isApplied ? <Unlock className="mr-2 h-5 w-5"/> : <Lock className="mr-2 h-5 w-5"/>}
                     Parent Contact Information
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                      <span className={cn("text-sm", isApplied ? "text-foreground" : "text-muted-foreground italic")}>
                        {isApplied ? mockParentEmail : "Locked - Apply to view email"}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopy(mockParentEmail, "Email")} 
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      disabled={!isApplied}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                     <div className="flex items-center">
                       <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                       <span className={cn("text-sm", isApplied ? "text-foreground" : "text-muted-foreground italic")}>
                         {isApplied ? mockParentPhone : "Locked - Apply to view phone"}
                        </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopy(mockParentPhone, "Phone Number")} 
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      disabled={!isApplied}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {!isApplied && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      Apply for this tuition to unlock contact details.
                    </p>
                  )}
                </div>
                 {!isApplied && (
                  <DialogFooter>
                    <Button onClick={() => { handleApplyMock(); setIsContactModalOpen(true); }} className="w-full">
                      <Send className="w-3.5 h-3.5 mr-1.5" /> Apply Now (Mock)
                    </Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}

interface DetailItemProps {
  label: string;
  value?: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}

function DetailItem({ label, value, icon: Icon, children, className }: DetailItemProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-[11px] text-muted-foreground font-medium flex items-center mb-0.5">
        {Icon && <Icon className="w-3 h-3 mr-1.5 text-primary/70" />}
        {label}
      </span>
      {value && <p className="text-xs text-foreground/80">{value}</p>}
      {children && <div className={cn("text-xs", className)}>{children}</div>}
    </div>
  );
}

    