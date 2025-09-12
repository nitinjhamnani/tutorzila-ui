
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
  paymentUrl: string | null;
  paymentId: string | null;
}

export function PhonePePaymentModal({ isOpen, onOpenChange, onPaymentSuccess, onPaymentFailure, paymentUrl, paymentId }: PhonePePaymentModalProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 1. Load the PhonePe script when the modal opens
  useEffect(() => {
    if (!isOpen) {
      setScriptLoaded(false); // Reset on close
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://mercury.phonepe.com/web/bundle/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log("PhonePe script loaded successfully.");
      setScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load PhonePe script.");
      setError("Failed to load the payment SDK. Please check your network or browser settings.");
    };

    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [isOpen]);

  // 2. Transact only when script is loaded, paymentUrl is ready, and container is rendered
  useEffect(() => {
    if (isOpen && scriptLoaded && paymentUrl && containerRef.current) {
      const intervalId = setInterval(() => {
        if (window.PhonePeCheckout) {
          clearInterval(intervalId);
          console.log("PhonePe SDK ready. Initiating transaction...");

          const callback = (response: any) => {
            console.log("PhonePe callback received:", response);
            if (response?.code === 'PAYMENT_SUCCESS') {
                setIsVerifying(true);
            } else {
              toast({ title: "Payment Not Completed", description: "The payment process was not successfully completed." });
              onPaymentFailure();
            }
             // Close the iframe page
            if (window.PhonePeCheckout.closePage) {
                window.PhonePeCheckout.closePage();
            }
            onOpenChange(false);
          };

          try {
            window.PhonePeCheckout.transact({
              paymentUrl: paymentUrl,
              callback: callback,
              type: "IFRAME",
              containerId: "phonepe-checkout-container" // The ID of our div
            });
          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            console.error("PhonePe transact error:", errorMessage);
            setError(`Could not initiate PhonePe checkout. ${errorMessage}`);
          }
        }
      }, 100); // Poll for SDK readiness

      return () => clearInterval(intervalId);
    }
  }, [isOpen, scriptLoaded, paymentUrl, onOpenChange, onPaymentFailure, toast]);
  
    // 3. Poll for payment status after successful transaction
    useEffect(() => {
        if (!isVerifying || !paymentId) return;

        const startTime = Date.now();
        const intervalDuration = 3000; // 3 seconds
        const timeoutDuration = 60000; // 1 minute

        const pollInterval = setInterval(async () => {
            if (Date.now() - startTime > timeoutDuration) {
                clearInterval(pollInterval);
                toast({
                    title: "Verification In Progress",
                    description: "Payment is being processed. Please check your dashboard in a few moments.",
                });
                setIsVerifying(false);
                onOpenChange(false); 
                return;
            }

            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                const response = await fetch(`${apiBaseUrl}/api/tutor/activation?paymentId=${paymentId}`);

                if (response.ok) {
                    clearInterval(pollInterval);
                    onPaymentSuccess();
                } else {
                    console.log(`Polling... Status: ${response.status}`);
                }
            } catch (pollError) {
                console.error("Polling error:", pollError);
            }
        }, intervalDuration);

        return () => clearInterval(pollInterval);
    }, [isVerifying, paymentId, onPaymentSuccess, onOpenChange, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card p-0 flex flex-col" style={{ height: '80vh', maxHeight: '600px' }}>
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            {isVerifying ? "Verifying payment status, please wait..." : "Please follow the instructions on the payment page."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow flex items-center justify-center relative">
          {(!scriptLoaded || !paymentUrl || isVerifying || error) && (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-background z-10 p-4 text-center">
              {!scriptLoaded || !paymentUrl ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p>Loading payment page...</p>
                </>
              ) : isVerifying ? (
                 <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p>Verifying payment...</p>
                </>
              ) : (
                <p className="text-destructive">{error}</p>
              )}
            </div>
          )}
          {/* This container is now always rendered, visibility controlled by the overlay */}
          <div id="phonepe-checkout-container" className={cn("w-full h-full", (!scriptLoaded || !paymentUrl || isVerifying || error) ? 'opacity-0' : 'opacity-100')} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
