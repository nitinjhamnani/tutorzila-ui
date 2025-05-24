"use client";

import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { SignInForm } from "@/components/auth/SignInForm";
import { X } from 'lucide-react';
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onOpenChange }) => {
  const [currentForm, setCurrentForm] = useState<'signin' | 'signup'>('signin');

  const handleSwitchForm = (formType: 'signin' | 'signup') => {
    setCurrentForm(formType);
  };

 return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 flex flex-col visible max-h-[90vh]">
 <DialogPrimitive.Close className="fixed right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
 <X className="h-4 w-4" />
 <span className="sr-only">Close</span>
 </DialogPrimitive.Close>
 <div className="overflow-y-auto flex-grow h-full">
          {currentForm === 'signin' ? ( // Corrected variant syntax and button content
 <SignInForm onSwitchForm={handleSwitchForm} onClose={() => onOpenChange(false)} />
 ) : (
 <SignUpForm onSwitchForm={handleSwitchForm} onClose={() => onOpenChange(false)} />
 )}
 </div>
        </DialogContent>
      </Dialog>
  );
};

export default AuthModal;