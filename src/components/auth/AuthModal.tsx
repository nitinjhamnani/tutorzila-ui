
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import { OtpVerificationModal } from "@/components/modals/OtpVerificationModal";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  initialForm?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onOpenChange, initialName, initialForm = 'signin' }) => {
  const [currentForm, setCurrentForm] = useState<'signin' | 'signup' | 'otp'>(initialForm);
  const [otpIdentifier, setOtpIdentifier] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCurrentForm(initialForm);
      setOtpIdentifier("");
    }
  }, [isOpen, initialForm]);

  const handleSwitchForm = (formType: 'signin' | 'signup') => {
    setCurrentForm(formType);
  };
  
  const handleShowOtp = (email: string) => {
    setOtpIdentifier(email);
    setCurrentForm('otp');
  };

  const handleOtpSuccess = () => {
    onOpenChange(false);
  }

  const handleClose = () => {
    if (currentForm === 'otp') {
      setCurrentForm('signup');
    } else {
      onOpenChange(false);
    }
  }

 return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="p-0 flex flex-col visible max-h-[90vh]">
          {/* This DialogTitle is for accessibility and will be visually hidden */}
          <DialogTitle className="sr-only">Authentication</DialogTitle>
          {/* The forms SignInForm and SignUpForm provide their own visual titles */}
          <div className="overflow-y-auto flex-grow h-full">
            {currentForm === 'signin' && (
              <SignInForm onSwitchForm={handleSwitchForm} onClose={() => onOpenChange(false)} initialName={initialName} />
            )}
            {currentForm === 'signup' && (
               <SignUpForm onSwitchForm={handleSwitchForm} onClose={() => onOpenChange(false)} onShowOtp={handleShowOtp}/>
            )}
            {currentForm === 'otp' && (
              <OtpVerificationModal
                isOpen={true} // It's controlled by parent state
                onOpenChange={(open) => { if (!open) handleClose() }} // If closed, trigger our close logic
                verificationType="email"
                identifier={otpIdentifier}
                onSuccess={handleOtpSuccess}
                onResend={async () => { console.log("OTP Resend (AuthModal)") }} // Mock or implement resend logic
                isInsideAuthModal={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default AuthModal;
