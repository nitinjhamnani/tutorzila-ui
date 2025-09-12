
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

export function PhonePePaymentModal({ isOpen, onOpenChange, onPaymentSuccess, onPaymentFailure }: PhonePePaymentModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const paymentContainerRef = useRef<HTMLDivElement>(null);
  const mockPaymentUrl = "https://mercury-uat.phonepe.com/transact/uat_v2?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzT24iOjE3NTc3MDcyODIzODksIm1lcmNoYW50SWQiOiJURVNULU0yM1VRR0cwMjROSVMiLCJtZXJjaGFudE9yZGVySWQiOiI1YmI5YjgxYS0yY2JiLTRiOTktYjE4NS02NmUyMDc1NmM4MTUifQ.KCoOafCY9cIzAd0qp4sGj82MVtfhykDdghpdexS-f5s";

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setError(null);
      return;
    }

    const scriptUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox/v2/checkout-v2.js';
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

    const handleScriptLoad = () => {
      console.log("PhonePe script loaded.");

      const intervalId = setInterval(() => {
        if (window.PhonePeCheckout && paymentContainerRef.current) {
          clearInterval(intervalId);
          console.log("PhonePe SDK is ready. Initiating transaction.");
          
          setIsLoading(false);

          try {
            window.PhonePeCheckout.transact({
              paymentUrl: mockPaymentUrl, 
              callback: (response: any) => {
                console.log("PhonePe callback received:", response);
                if (response?.code === 'PAYMENT_SUCCESS') {
                  onPaymentSuccess();
                } else {
                  toast({ title: "Payment Not Completed", description: response.description || "The payment process was not successfully completed." });
                  onPaymentFailure();
                }
                if (window.PhonePeCheckout.closePage) {
                  window.PhonePeCheckout.closePage();
                }
                onOpenChange(false);
              },
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
      }, 100);
    };

    const handleScriptError = () => {
      console.error("Failed to load PhonePe script.");
      setError("Failed to load the payment SDK. Please check your network or browser settings.");
      setIsLoading(false);
    };

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        script.addEventListener('load', handleScriptLoad);
        script.addEventListener('error', handleScriptError);
        document.body.appendChild(script);

        return () => {
            script.removeEventListener('load', handleScriptLoad);
            script.removeEventListener('error', handleScriptError);
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    } else {
        handleScriptLoad(); // Script is already there, just run the logic
    }
  }, [isOpen, onOpenChange, onPaymentFailure, onPaymentSuccess, toast]);

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
          <div id="phonepe-checkout-container" ref={paymentContainerRef} className="w-full h-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
