
"use client";

import { useState } from 'react';
import { SignUpForm } from "@/components/auth/SignUpForm";
import AuthModal from '@/components/auth/AuthModal';

export default function SignUpPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSwitchToSignIn = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <SignUpForm onSwitchForm={handleSwitchToSignIn} />
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onOpenChange={setIsAuthModalOpen}
        />
      )}
    </>
  );
}
