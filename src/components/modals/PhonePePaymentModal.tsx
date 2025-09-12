
"use client";

import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

declare global {
  interface Window {
    PhonePeCheckout: any;
  }
}

interface PhonePePaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: () => void;
  onPaymentFailure: () => void;
  amount: number;
  tokenUrl: string;
  paymentId: string;
}

type VerificationStatus = 'idle' | 'verifying' | 'success' | 'failed' | 'timeout';

export function PhonePePaymentModal({ 
  isOpen, 
  onOpenChange, 
  onPaymentSuccess, 
  onPaymentFailure, 
  tokenUrl,
  paymentId,
}: PhonePePaymentModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const { toast } = useToast();
  const paymentContainerRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupAndClose = (success: boolean) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (success) {
      onPaymentSuccess();
    } else {
      onPaymentFailure();
    }
    onOpenChange(false);
  };
  
  const checkPaymentStatus = async () => {
    try {
        const response = await fetch(`/api/tutor/activation?paymentId=${paymentId}`, {
            method: 'GET',
            headers: { 'accept': '*/*' }
        });
        if (response.ok) {
            setVerificationStatus('success');
            cleanupAndClose(true);
            return 'success';
        }
        return 'pending';
    } catch (e) {
        console.error("Polling failed:", e);
        return 'pending';
    }
  };

  const startPolling = () => {
    setVerificationStatus('verifying');
    let attempts = 0;
    const maxAttempts = 20; // 3 seconds * 20 = 1 minute

    pollingIntervalRef.current = setInterval(async () => {
      attempts++;
      const status = await checkPaymentStatus();
      if (status === 'success' || attempts >= maxAttempts) {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        if (status !== 'success') {
          setVerificationStatus('timeout');
          toast({
            title: "Verification Taking Longer Than Expected",
            description: "We're still confirming your payment. Please check your dashboard in a few minutes.",
            duration: 10000,
          });
        }
      }
    }, 3000);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setError(null);
      setVerificationStatus('idle');
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      return;
    }

    const scriptUrl = 'https://mercury-stg.phonepe.com/web/bundle/checkout.js';
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    
    const initializePhonePe = () => {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.PhonePeCheckout) {
          clearInterval(interval);
          setIsLoading(false);
          try {
            window.PhonePeCheckout.transact({
              tokenUrl: tokenUrl,
              callback: (response: any) => {
                if (window.PhonePeCheckout.closePage) window.PhonePeCheckout.closePage();
                startPolling(); // Start polling after modal is closed
              },
              type: "IFRAME",
              containerId: "phonepe-checkout-container"
            });
          } catch (e) {
            setError("Could not initiate PhonePe checkout.");
            setIsLoading(false);
          }
        } else if (attempts > 50) { // Timeout after 5 seconds
          clearInterval(interval);
          setError("Failed to initialize payment SDK.");
          setIsLoading(false);
        }
      }, 100);
    };

    const handleScriptError = () => {
      setError("Failed to load the payment SDK.");
      setIsLoading(false);
    };

    if (existingScript) {
      initializePhonePe();
    } else {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = initializePhonePe;
      script.onerror = handleScriptError;
      document.body.appendChild(script);

      return () => { if (document.body.contains(script)) document.body.removeChild(script); };
    }
  }, [isOpen, tokenUrl, paymentId]);
  
  const getOverlayContent = () => {
    if (verificationStatus === 'verifying') {
        return (
            <>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Verifying payment, please wait...</p>
            </>
        )
    }
    if (verificationStatus === 'timeout') {
        return (
             <>
                <p className='text-center'>Verification is taking longer than usual. Please check your dashboard shortly.</p>
                 <Button onClick={() => onOpenChange(false)}>Close</Button>
            </>
        )
    }
     if (isLoading || error) {
        return (
            <>
              {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
              <p>{error || "Loading payment page..."}</p>
            </>
        )
    }
    return null;
  }

  const showOverlay = isLoading || error || verificationStatus === 'verifying' || verificationStatus === 'timeout';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card p-0 flex flex-col" style={{ height: '80vh', maxHeight: '600px' }}>
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            {verificationStatus === 'verifying' ? 'Verifying payment status...' : 'Please follow the instructions on the payment page.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow flex items-center justify-center relative">
          {showOverlay && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-background z-10 p-4 text-center">
              {getOverlayContent()}
            </div>
          )}
          <div id="phonepe-checkout-container" ref={paymentContainerRef} className={cn("w-full h-full transition-opacity duration-300", showOverlay ? "opacity-0" : "opacity-100")} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
