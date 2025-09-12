
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
    if (!isOpen) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const script = document.createElement('script');
    script.src = 'https://mercury.phonepe.com/web/bundle/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log("PhonePe script loaded.");

      const intervalId = setInterval(() => {
        if (window.PhonePeCheckout) {
          clearInterval(intervalId);
          console.log("PhonePe SDK is ready. Initiating transaction.");
          setIsLoading(false);

          try {
            const callback = (response: any) => {
              console.log("PhonePe callback received:", response);
              if (response === 'USER_CANCEL') {
                toast({ title: "Payment Cancelled", description: "You cancelled the payment process."});
                onPaymentFailure();
              } else if (response === 'CONCLUDED') {
                toast({ title: "Payment Concluded", description: "Verifying payment status..."});
                onPaymentSuccess(); 
              }
              window.PhonePeCheckout.closePage();
              onOpenChange(false);
            };

            window.PhonePeCheckout.transact({
              paymentUrl: mockPaymentUrl,
              callback: callback,
              type: "IFRAME",
              containerId: "phonepe-checkout-container"
            });
            
          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            console.error("PhonePe transact error:", errorMessage);
            setError(`Could not initiate PhonePe checkout. ${errorMessage}`);
            setIsLoading(false);
          }
        }
      }, 100); // Poll every 100ms
    };

    script.onerror = () => {
      console.error("Failed to load PhonePe script.");
      setError("Failed to load the payment SDK. Please check your internet connection.");
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script when the component unmounts or modal closes
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [isOpen, mockPaymentUrl, onOpenChange, onPaymentSuccess, onPaymentFailure, toast]);

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
