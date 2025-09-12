
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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Effect to load the PhonePe script
  useEffect(() => {
    if (!isOpen) return;

    const scriptId = 'phonepe-checkout-script';
    if (document.getElementById(scriptId)) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("PhonePe script loaded.");
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load PhonePe script.");
      setError("Payment provider script failed to load. Please check your network or ad-blocker.");
    };

    document.body.appendChild(script);

  }, [isOpen]);

  // Effect to fetch the payment URL once the script is loaded
  useEffect(() => {
    if (isOpen && scriptLoaded && !paymentUrl && !isFetchingUrl && !error) {
      const initiatePayment = async () => {
        setIsFetchingUrl(true);
        setError(null);

        if (!token) {
          setError("Authentication failed. Please log in again.");
          setIsFetchingUrl(false);
          return;
        }

        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
          const response = await fetch(`${apiBaseUrl}/api/tutor/payment?amount=${amount}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' },
          });

          if (!response.ok) {
            throw new Error("Failed to initialize payment from the server.");
          }
          
          const data = await response.json();
          if (data.paymentUrl) {
            setPaymentUrl(data.paymentUrl);
          } else {
            throw new Error("Payment URL not received from the server.");
          }
        } catch (err) {
          console.error("Payment initiation API failed:", err);
          const errorMessage = (err as Error).message || "An unexpected error occurred.";
          setError(errorMessage);
        } finally {
          setIsFetchingUrl(false);
        }
      };

      initiatePayment();
    }
  }, [isOpen, scriptLoaded, token, amount, paymentUrl, isFetchingUrl, error]);

  // Effect to transact once the payment URL is available and the container is rendered
  useEffect(() => {
    if (paymentUrl && !isFetchingUrl && !error) {
      
      const handlePaymentCallback = (response: 'USER_CANCEL' | 'CONCLUDED') => {
        if (window.PhonePeCheckout) {
          window.PhonePeCheckout.closePage();
        }
        onOpenChange(false);
        if (response === 'USER_CANCEL') {
          toast({ title: "Payment Cancelled", description: "You have cancelled the payment process.", variant: "destructive" });
          onPaymentFailure();
        } else if (response === 'CONCLUDED') {
          onPaymentSuccess();
        }
      };

      try {
        if (window.PhonePeCheckout) {
          window.PhonePeCheckout.transact({
            paymentUrl: paymentUrl,
            type: "IFRAME",
            containerId: "phonepe-checkout-container",
            callback: handlePaymentCallback
          });
        } else {
          throw new Error("PhonePe SDK is not available on the window object.");
        }
      } catch (e) {
        console.error("Error during transact call:", e);
        setError((e as Error).message || "An error occurred while launching the payment page.");
      }
    }
  }, [paymentUrl, isFetchingUrl, error, onOpenChange, onPaymentSuccess, onPaymentFailure, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card p-0 flex flex-col" style={{ height: '80vh', maxHeight: '600px' }}>
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            Please follow the instructions on the payment page. Do not close this window.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow flex items-center justify-center relative">
          {(isFetchingUrl || error) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-background z-10 p-4 text-center">
              {isFetchingUrl && (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p>Initializing secure payment...</p>
                </>
              )}
              {error && !isFetchingUrl && (
                <>
                  <p className="font-semibold text-destructive">Payment Error</p>
                  <p className="text-sm text-destructive/80">{error}</p>
                </>
              )}
            </div>
          )}
          {/* This container is now only rendered when we have the payment URL */}
          {paymentUrl && !isFetchingUrl && !error && (
            <div id="phonepe-checkout-container" className="w-full h-full" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
