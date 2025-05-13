
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PostRequirementModal } from "@/components/modals/PostRequirementModal";
import { PlusCircle } from "lucide-react"; // Removed SquarePen as PlusCircle is more common for "add"
import { cn } from "@/lib/utils";

interface FloatingPostRequirementButtonProps {
  className?: string;
}

export function FloatingPostRequirementButton({ className }: FloatingPostRequirementButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "fixed bottom-5 right-5 z-50 h-12 w-12 md:h-12 md:w-auto md:px-4 rounded-full shadow-lg text-sm font-medium", // Adjusted size, padding, font
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "transform transition-all hover:scale-105 active:scale-95",
            "flex items-center justify-center",
            className
          )}
          aria-label="Post a new tuition requirement"
        >
          <PlusCircle className="h-5 w-5 md:mr-1.5" /> {/* Adjusted icon size and margin */}
          <span className="hidden md:inline">Post Requirement</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden">
        <PostRequirementModal onSuccess={() => setIsModalOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

