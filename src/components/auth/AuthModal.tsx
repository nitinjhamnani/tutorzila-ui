
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
    onOpenChange(false); // Close the entire modal on successful OTP verification and login
  };

  const handleOtpCancel = () => {
    setCurrentForm('signup'); // Go back to the sign-up form if OTP is cancelled
  };

  return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent 
          className="p-0 flex flex-col visible max-h-[90vh]"
          onPointerDownOutside={(e) => {
             // Prevent closing only if we are in the OTP step, which has its own logic
            if (currentForm === 'otp') {
              e.preventDefault();
            }
          }}
        >
          <DialogTitle className="sr-only">Authentication</DialogTitle>
          <div className="overflow-y-auto flex-grow h-full">
            {currentForm === 'signin' && (
              <SignInForm onSwitchForm={handleSwitchForm} onClose={() => onOpenChange(false)} initialName={initialName} />
            )}
            {currentForm === 'signup' && (
              <SignUpForm onSwitchForm={handleSwitchForm} onClose={() => onOpenChange(false)} onShowOtp={handleShowOtp}/>
            )}
            {currentForm === 'otp' && (
                <OtpVerificationModal
                    isOpen={true} // It's open because the parent state dictates it
                    onOpenChange={(open) => {
                      if (!open) {
                        handleOtpCancel(); // If it's asked to close, go back to sign-up
                      }
                    }}
                    verificationType="email"
                    identifier={otpIdentifier}
                    onSuccess={handleOtpSuccess}
                    isInsideAuthModal={true} // Pass the prop to adjust layout
                />
            )}
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default AuthModal;
