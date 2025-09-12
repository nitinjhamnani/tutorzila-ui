
"use client";

import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
}

export function PhonePePaymentModal({ isOpen, onOpenChange, onPaymentSuccess, onPaymentFailure, amount }: PhonePePaymentModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const mockPaymentUrl = "https://mercury-uat.phonepe.com/transact/uat_v2?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzT24iOjE3NTc3MDcyODIzODksIm1lcmNoYW50SWQiOiJURVNULU0yM1VRR0cwMjROSVMiLCJtZXJjaGFudE9yZGVySWQiOiI1YmI5YjgxYS0yY2JiLTRiOTktYjE4NS02NmUyMDc1NmM4MTUifQ.KCoOafCY9cIzAd0qp4sGj82MVtfhykDdghpdexS-f5s";

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);

      // Load PhonePe script
      const script = document.createElement('script');
      script.src = 'https://mercury.phonepe.com/web/bundle/checkout.js';
      script.async = true;
      script.onload = () => {
        // Polling to check for window.PhonePeCheckout
        const interval = setInterval(() => {
          if (window.PhonePeCheckout) {
            clearInterval(interval);
            console.log("PhonePe SDK is ready.");
            try {
                setIsLoading(false);
                window.PhonePeCheckout.transact({
                    paymentUrl: mockPaymentUrl,
                    callback: (response: any) => {
                      if (response === 'USER_CANCEL') {
                        toast({ title: "Payment Cancelled", description: "The payment process was cancelled by the user."});
                        onOpenChange(false);
                      } else if (response === 'CONCLUDED') {
                        toast({ title: "Payment Concluded", description: "Your payment process has concluded. Verifying status..."});
                        // Here you would start polling your backend with the paymentId
                        onPaymentSuccess(); // Mocking success for now
                      }
                      window.PhonePeCheckout.closePage();
                    },
                    type: "IFRAME",
                    containerId: "phonepe-checkout-container"
                });
            } catch (e) {
                console.error("PhonePe transact error:", e);
                setError("Could not initiate PhonePe checkout. Please try again.");
                setIsLoading(false);
            }
          }
        }, 100); // Check every 100ms
      };
      script.onerror = () => {
        setError("Failed to load the payment SDK. Please check your internet connection and try again.");
        setIsLoading(false);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen, onOpenChange, onPaymentSuccess, toast, mockPaymentUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card p-0 flex flex-col" style={{ height: '80vh', maxHeight: '600px' }}>
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            Please follow the instructions on the payment page.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow flex items-center justify-center relative">
          {(isLoading || error) && (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-background z-10 p-4 text-center">
              {isLoading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p>Loading payment page...</p>
                </>
              ) : (
                <p className="text-destructive">{error}</p>
              )}
            </div>
          )}
          <div id="phonepe-checkout-container" className={cn("w-full h-full", isLoading || error ? 'opacity-0' : 'opacity-100')} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
