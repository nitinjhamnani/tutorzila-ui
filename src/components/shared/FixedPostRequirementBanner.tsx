
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PostRequirementModal } from "@/components/modals/PostRequirementModal";
import { SquarePen } from "lucide-react"; // Removed X icon import
import { cn } from "@/lib/utils";

export function FixedPostRequirementBanner() {
  const [isPostRequirementModalOpen, setIsPostRequirementModalOpen] = useState(false);
  // isVisible state and related logic can be removed if banner is always visible
  // const [isVisible, setIsVisible] = useState(true);

  // if (!isVisible) {
  //   return null;
  // }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 md:p-4 bg-card/95 backdrop-blur-sm border-t border-border/50 shadow-lg animate-in slide-in-from-bottom-10 duration-500 ease-out">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-grow text-center md:text-left">
          <p className="text-sm md:text-base font-medium text-foreground">
            Looking for a specific tutor?
            <span className="hidden sm:inline"> Post your requirement and let tutors find you!</span>
          </p>
          <p className="text-xs text-muted-foreground sm:hidden">
            Post your requirement and let tutors find you!
          </p>
        </div>
        <Dialog open={isPostRequirementModalOpen} onOpenChange={setIsPostRequirementModalOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="shrink-0 transform transition-transform hover:scale-105 active:scale-95 shadow-md text-xs md:text-sm py-2 px-3 md:py-2.5 md:px-4"
            >
              <SquarePen className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" /> Post Requirement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden">
            <PostRequirementModal onSuccess={() => setIsPostRequirementModalOpen(false)} />
          </DialogContent>
        </Dialog>
        {/* Removed the close button */}
        {/* 
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="h-8 w-8 md:h-9 md:w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </Button> 
        */}
      </div>
    </div>
  );
}

