
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PostRequirementModal } from "@/components/modals/PostRequirementModal";
import { PlusCircle, SquarePen } from "lucide-react";
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
            "fixed bottom-6 right-6 z-50 h-14 w-14 md:h-16 md:w-auto md:px-6 rounded-full shadow-lg text-lg font-semibold",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "transform transition-all hover:scale-105 active:scale-95",
            "flex items-center justify-center",
            className
          )}
          aria-label="Post a new tuition requirement"
        >
          <PlusCircle className="h-6 w-6 md:mr-2" />
          <span className="hidden md:inline">Post Requirement</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden">
        <PostRequirementModal onSuccess={() => setIsModalOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
