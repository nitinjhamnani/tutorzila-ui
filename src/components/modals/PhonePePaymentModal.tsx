
"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthMock } from '@/hooks/use-auth-mock';
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    PhonePeCheckout: {
      transact: (options: {
        paymentUrl: string;
        type: "IFRAME";
        containerId: string;
        callback: (response: 'USER_CANCEL' | 'CONCLUDED') => void;
      }) => void;
      closePage: () => void;
    };
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
  const { toast } = useToast();
  const { token } = useAuthMock();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Effect to load the PhonePe script
  useEffect(() => {
    if (!isOpen) return;

    const scriptId = 'phonepe-checkout-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (script) {
        // If script is already there and window.PhonePeCheckout exists, we are good.
        if (window.PhonePeCheckout) {
            setScriptLoaded(true);
        } else {
             // If script tag exists but SDK is not on window, might be loading. Listen for load.
            const handleLoad = () => {
                console.log("PhonePe script loaded (event listener).");
                setScriptLoaded(true);
                script?.removeEventListener('load', handleLoad);
            };
            script.addEventListener('load', handleLoad);
        }
        return;
    }

    script = document.createElement('script');
    script.id = scriptId;
    script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
    script.async = true;
    
    script.onload = () => {
        console.log("PhonePe script loaded.");
        setScriptLoaded(true);
    };

    script.onerror = () => {
        console.error("Failed to load PhonePe script.");
        setError("Failed to load payment script. Please check your connection.");
        setIsLoading(false);
    };
    document.body.appendChild(script);

  }, [isOpen]);

  // Effect to initiate payment once the script is loaded and the modal is open
  useEffect(() => {
    if (!isOpen || !scriptLoaded) {
      // Don't do anything if modal is closed or script is not ready
      return;
    }

    const initiatePayment = async () => {
        setIsLoading(true);
        setError(null);

        if (!token) {
          setError("Authentication failed. Please log in again.");
          setIsLoading(false);
          return;
        }

        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
          const response = await fetch(`${apiBaseUrl}/api/tutor/payment?amount=${amount}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' },
          });

          if (!response.ok) throw new Error("Failed to initialize payment from the server.");
          
          const data = await response.json();
          const paymentUrl = data.paymentUrl;

          if (paymentUrl && window.PhonePeCheckout) {
             const handlePaymentCallback = (response: 'USER_CANCEL' | 'CONCLUDED') => {
              if (window.PhonePeCheckout) {
                  window.PhonePeCheckout.closePage();
              }
              onOpenChange(false);
              if (response === 'USER_CANCEL') {
                toast({ title: "Payment Cancelled", description: "You have cancelled the payment process.", variant: "destructive" });
                onPaymentFailure();
              } else if (response === 'CONCLUDED') {
                // In a real app, you must verify the payment status on your backend here.
                onPaymentSuccess();
              }
            };
            
            // Wait a brief moment to ensure the container is in the DOM
            setTimeout(() => {
              window.PhonePeCheckout.transact({
                paymentUrl: paymentUrl,
                type: "IFRAME",
                containerId: "phonepe-checkout-container",
                callback: handlePaymentCallback
              });
              setIsLoading(false);
            }, 100);
            
          } else {
            throw new Error("PhonePe SDK not available or payment URL not received.");
          }
        } catch (err) {
            console.error("Payment initiation failed:", err);
            const errorMessage = (err as Error).message || "An unexpected error occurred.";
            setError(errorMessage);
            setIsLoading(false);
        }
    };
    
    initiatePayment();

  }, [isOpen, scriptLoaded, token, amount, toast, onPaymentSuccess, onPaymentFailure, onOpenChange]);

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
          {(isLoading || !scriptLoaded) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-background z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Initializing secure payment...</p>
            </div>
          )}
          {error && (
             <div className="absolute inset-0 text-center text-destructive h-full flex flex-col items-center justify-center p-4 bg-background z-10">
                <p className="font-semibold">Payment Error</p>
                <p className="text-sm">{error}</p>
             </div>
          )}
          <div id="phonepe-checkout-container" className={cn("w-full h-full", isLoading || error ? 'invisible' : 'visible')} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
