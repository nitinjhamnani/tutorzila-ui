
"use client";

import type { TuitionRequirement } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, Eye, RadioTower, Edit3, Trash2, Archive, Building } from "lucide-react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ParentEnquiryCardProps {
  requirement: TuitionRequirement;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: (id: string) => void;
  onReopen: (id: string) => void;
}

const getInitials = (name?: string): string => {
  if (!name || name.trim() === "") return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export function ParentEnquiryCard({ requirement, onEdit, onDelete, onClose, onReopen }: ParentEnquiryCardProps) {
  const postedDate = parseISO(requirement.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const parentInitials = getInitials(requirement.parentName);
  const isPastEnquiry = requirement.status === 'closed';

  return (
    <Card
      className={cn(
        "border border-border/50 rounded-lg shadow-sm hover:bg-muted/30 transition-colors duration-200 w-full overflow-hidden",
        isPastEnquiry ? "opacity-70 bg-muted/50" : "bg-card"
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 justify-between gap-3">
        <Link href={`/parent/my-enquiries/${requirement.id}`} className="flex items-center space-x-3 flex-grow min-w-0 w-full sm:w-auto cursor-pointer overflow-hidden">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full shadow-sm bg-primary text-primary-foreground">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-full text-[10px] sm:text-xs">
              {parentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0 space-y-1 overflow-hidden">
            <p className="text-sm font-semibold text-primary group-hover:text-primary/90 transition-colors break-words">
              {Array.isArray(requirement.subject) ? requirement.subject.join(', ') : requirement.subject}
            </p>
            <div className="text-[10px] sm:text-[11px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 items-center">
              {requirement.gradeLevel && <span className="flex items-center"><GraduationCap className="w-3 h-3 inline mr-1 text-primary/70" /> {requirement.gradeLevel}</span>}
              {requirement.teachingMode && requirement.teachingMode.length > 0 && (
                <span className="flex items-center"><RadioTower className="w-3 h-3 inline mr-1 text-primary/70" /> {requirement.teachingMode.join(', ')}</span>
              )}
              {requirement.board && (
                <span className="flex items-center"><Building className="w-3 h-3 inline mr-1 text-primary/70" /> {requirement.board}</span>
              )}
              <span className="flex items-center"><Clock className="w-3 h-3 inline mr-1 text-primary/70" /> {timeAgo}</span>
              <Badge
                variant={requirement.status === 'open' ? 'secondary' : requirement.status === 'matched' ? 'default' : 'outline'}
                className={cn(
                    "text-[9px] py-0.5 px-1.5 border font-medium",
                    requirement.status === 'open' && "bg-blue-100 text-blue-700 border-blue-500/50",
                    requirement.status === 'matched' && "bg-green-100 text-green-700 border-green-500/50",
                    requirement.status === 'closed' && "bg-gray-100 text-gray-600 border-gray-400/50",
                )}
              >
                {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
              </Badge>
            </div>
          </div>
        </Link>
        <div className="flex space-x-1.5 shrink-0 mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto justify-end min-w-[calc(3*1.75rem+2*0.375rem)]">
            {!isPastEnquiry && (
              <>
                <Button variant="outline" size="icon" className="h-7 w-7 border-primary/50 text-primary hover:bg-primary/10" title="Edit Enquiry" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(requirement.id); }}>
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="destructiveOutline" size="icon" className="h-7 w-7" title="Delete Enquiry" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(requirement.id); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-7 w-7 border-orange-500 text-orange-600 hover:bg-orange-500/10" title="Close Enquiry" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(requirement.id); }}>
                  <Archive className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            {isPastEnquiry && onReopen && (
              <Button variant="outline" size="icon" className="h-7 w-7 border-green-500 text-green-600 hover:bg-green-500/10" title="Reopen Enquiry" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onReopen(requirement.id); }}>
                <Archive className="h-3.5 w-3.5" />
              </Button>
            )}
        </div>
      </div>
    </Card>
  );
}

    