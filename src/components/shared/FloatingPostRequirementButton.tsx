
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PostRequirementModal } from "@/components/common/modals/PostRequirementModal";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthMock } from "@/hooks/use-auth-mock";
import AuthModal from "@/components/auth/AuthModal";

interface FloatingPostRequirementButtonProps {
  className?: string;
}

export function FloatingPostRequirementButton({ className }: FloatingPostRequirementButtonProps) {
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuthMock();

  const handleTriggerSignIn = (name?: string) => {
    setIsRequirementModalOpen(false); // Close requirement modal first
    setIsAuthModalOpen(true);
  };
  
  return (
    <>
      <Dialog open={isRequirementModalOpen} onOpenChange={setIsRequirementModalOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "fixed bottom-5 right-5 z-50 h-12 w-12 md:h-12 md:w-auto md:px-4 rounded-full shadow-lg text-sm font-medium",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "transform transition-all hover:scale-105 active:scale-95",
              "flex items-center justify-center",
              className
            )}
            aria-label="Post a new tuition requirement"
          >
            <PlusCircle className="h-5 w-5 md:mr-1.5" />
            <span className="hidden md:inline">Post Requirement</span>
          </Button>
        </DialogTrigger>
        <DialogContent 
          className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <PostRequirementModal 
            startFromStep={1}
            onSuccess={() => setIsRequirementModalOpen(false)} 
            onTriggerSignIn={handleTriggerSignIn}
          />
        </DialogContent>
      </Dialog>
      
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onOpenChange={setIsAuthModalOpen} 
        />
      )}
    </>
  );
}
