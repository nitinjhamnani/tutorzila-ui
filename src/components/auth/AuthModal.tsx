
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
  const [otpVerificationType, setOtpVerificationType] = useState<"email" | "phone">("email");

  useEffect(() => {
    if (isOpen) {
      setCurrentForm(initialForm);
      setIsOtpModalOpen(false); // Reset OTP modal state when main modal opens
      setOtpIdentifier("");
    }
  }, [isOpen, initialForm]);

  const handleSwitchForm = (formType: 'signin' | 'signup') => {
    setCurrentForm(formType);
  };
  
  const handleShowOtp = (identifier: string, type: "email" | "phone") => {
    setOtpIdentifier(identifier);
    setOtpVerificationType(type);
    setIsOtpModalOpen(true);
  };
  
  const handleOtpSuccess = () => {
    setIsOtpModalOpen(false);
    onOpenChange(false); // Close the main auth modal on successful OTP verification and login
  };

  const handleOtpCancel = () => {
    setIsOtpModalOpen(false); // Only close the OTP modal
    // The user remains on the signup form
  };

  return (
      <>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent 
            className="p-0 flex flex-col visible max-h-[90vh]"
          >
            <DialogTitle className="sr-only">Authentication</DialogTitle>
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

        {/* This is the nested OTP Modal */}
        <OtpVerificationModal
            isOpen={isOtpModalOpen}
            onOpenChange={(open) => {
              if (!open) {
                handleOtpCancel();
              } else {
                setIsOtpModalOpen(true);
              }
            }}
            verificationType={otpVerificationType}
            identifier={otpIdentifier}
            onSuccess={handleOtpSuccess}
        />
      </>
  );
};

export default AuthModal;
