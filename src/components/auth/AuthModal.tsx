
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
  const [currentForm, setCurrentForm] = useState<'signin' | 'signup'>(initialForm);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpIdentifier, setOtpIdentifier] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCurrentForm(initialForm);
      setOtpIdentifier("");
      setIsOtpModalOpen(false); // Reset OTP state when main modal opens
    }
  }, [isOpen, initialForm]);

  const handleSwitchForm = (formType: 'signin' | 'signup') => {
    setCurrentForm(formType);
  };
  
  const handleShowOtp = (email: string) => {
    setOtpIdentifier(email);
    onOpenChange(false); // Close the main AuthModal
    setIsOtpModalOpen(true); // Open the separate OTP modal
  };

  const handleOtpSuccess = () => {
    setIsOtpModalOpen(false); // Close OTP modal on success
    onOpenChange(false); // Ensure main modal is also closed
  }

  return (
      <>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            </div>
          </DialogContent>
        </Dialog>

        {/* OTP Modal is now a separate, self-contained dialog */}
        <OtpVerificationModal
            isOpen={isOtpModalOpen}
            onOpenChange={setIsOtpModalOpen}
            verificationType="email"
            identifier={otpIdentifier}
            onSuccess={handleOtpSuccess}
            onResend={async () => { console.log("OTP Resend (AuthModal)") }}
        />
      </>
  );
};

export default AuthModal;
