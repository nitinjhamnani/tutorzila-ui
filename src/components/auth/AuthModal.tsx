
"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Added DialogHeader, DialogTitle, DialogDescription
import { SignInForm } from "@/components/auth/SignInForm";
// X icon import removed as DialogContent now handles its own close button by default from ui/dialog.tsx
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
          {/* This DialogTitle is for accessibility and will be visually hidden */}
          <DialogTitle className="sr-only">Authentication</DialogTitle>
          {/* The forms SignInForm and SignUpForm provide their own visual titles */}
          <div className="overflow-y-auto flex-grow h-full">
            {currentForm === 'signin' ? (
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
