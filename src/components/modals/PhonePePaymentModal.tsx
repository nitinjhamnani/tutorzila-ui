
"use client";

import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthMock } from '@/hooks/use-auth-mock';
import { cn } from '@/lib/utils';

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

type PaymentStatus = "IDLE" | "FETCHING_URL" | "RENDERING_IFRAME" | "POLLING_STATUS" | "SUCCESS" | "FAILED" | "TIMED_OUT";

export function PhonePePaymentModal({ isOpen, onOpenChange, onPaymentSuccess, onPaymentFailure, amount }: PhonePePaymentModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [status, setStatus] = useState<PaymentStatus>("IDLE");
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTransactedRef = useRef(false);

  // 1. Load the PhonePe script when the modal opens
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
      console.error("PhonePe script failed to load.");
      setError("Payment provider script failed to load. Please check your network or ad-blocker.");
      setStatus("FAILED");
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            // Optional: remove script on close to keep DOM clean, but might cause issues if modal is rapidly opened/closed
            // document.body.removeChild(existingScript);
        }
    };
  }, [isOpen]);

  // 2. Fetch payment URL when modal is open
  useEffect(() => {
    if (isOpen && status === "IDLE") {
      const initiatePayment = async () => {
        setStatus("FETCHING_URL");
        setError(null);
        hasTransactedRef.current = false;

        if (!token) {
          setError("Authentication failed. Please log in again.");
          setStatus("FAILED");
          return;
        }

        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
          const response = await fetch(`${apiBaseUrl}/api/tutor/payment?amount=${amount}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Failed to initialize payment." }));
            throw new Error(errorData.message);
          }

          const data = await response.json();
          if (data.paymentUrl && data.paymentId) {
            setPaymentUrl(data.paymentUrl);
            setPaymentId(data.paymentId);
            // State will be updated, and the next useEffect will handle the transaction
          } else {
            throw new Error("Payment URL or ID not received from the server.");
          }
        } catch (err) {
          setError((err as Error).message || "An unexpected error occurred during payment initiation.");
          setStatus("FAILED");
        }
      };

      initiatePayment();
    }
  }, [isOpen, token, amount, status]);


  // 3. Start polling for activation status
  const startPolling = (pId: string) => {
    setStatus("POLLING_STATUS");

    const checkStatus = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${apiBaseUrl}/api/tutor/activation?paymentId=${pId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' },
        });

        if (response.ok) {
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
          setStatus("SUCCESS");
          setTimeout(() => {
            onPaymentSuccess();
            onOpenChange(false);
          }, 1500);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };
    
    checkStatus();
    pollingIntervalRef.current = setInterval(checkStatus, 3000);
    pollingTimeoutRef.current = setTimeout(() => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (status !== 'SUCCESS') {
          setStatus("TIMED_OUT");
      }
    }, 60000);
  };


  // 4. Transact with PhonePe once URL and script are ready
  useEffect(() => {
    if (scriptLoaded && paymentUrl && paymentId && !hasTransactedRef.current) {
        hasTransactedRef.current = true; 
        setStatus("RENDERING_IFRAME");
        
        const handlePaymentCallback = (response: 'USER_CANCEL' | 'CONCLUDED') => {
            if (window.PhonePeCheckout) {
                window.PhonePeCheckout.closePage();
            }

            if (response === 'USER_CANCEL') {
                toast({ title: "Payment Cancelled", description: "You have cancelled the payment process.", variant: "destructive" });
                onOpenChange(false);
                onPaymentFailure();
            } else if (response === 'CONCLUDED') {
                startPolling(paymentId);
            }
        };

        const checkSdkAndTransact = () => {
            if (window.PhonePeCheckout) {
                 window.PhonePeCheckout.transact({
                    paymentUrl: paymentUrl,
                    type: "IFRAME",
                    containerId: "phonepe-checkout-container",
                    callback: handlePaymentCallback
                });
            } else {
                 // Retry if SDK not ready
                 setTimeout(checkSdkAndTransact, 100);
            }
        };
        
        checkSdkAndTransact();
    }
  }, [scriptLoaded, paymentUrl, paymentId, onOpenChange, onPaymentFailure, startPolling, toast]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setScriptLoaded(false);
      setPaymentUrl(null);
      setPaymentId(null);
      setStatus("IDLE");
      setError(null);
      hasTransactedRef.current = false;
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
    }
  }, [isOpen]);

  const showOverlay = status !== 'RENDERING_IFRAME' || error;

  const renderStatus = () => {
    switch (status) {
      case "FETCHING_URL":
        return <><Loader2 className="h-8 w-8 animate-spin text-primary" /><p>Initializing secure payment...</p></>;
      case "POLLING_STATUS":
        return <><Loader2 className="h-8 w-8 animate-spin text-primary" /><p>Verifying payment status...</p></>;
      case "SUCCESS":
        return <><CheckCircle className="h-8 w-8 text-green-500" /><p>Payment Successful! Your account is now active.</p></>;
      case "FAILED":
        return <><p className="font-semibold text-destructive">Payment Error</p><p className="text-sm text-destructive/80">{error}</p></>;
      case "TIMED_OUT":
        return <><Clock className="h-8 w-8 text-yellow-500" /><p>Verification is taking longer than usual. Please check back in a few minutes.</p></>;
      default:
        return <><Loader2 className="h-8 w-8 animate-spin text-primary" /><p>Loading Payment SDK...</p></>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card p-0 flex flex-col" style={{ height: '80vh', maxHeight: '600px' }}>
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            {status !== 'POLLING_STATUS' && status !== 'SUCCESS' ? "Please follow the instructions on the payment page. Do not close this window." : "Verifying your payment. Please wait."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow flex items-center justify-center relative">
          <div
            id="phonepe-checkout-container"
            className={cn(
              "w-full h-full transition-opacity duration-300",
              showOverlay ? "opacity-0" : "opacity-100"
            )}
          />
          {showOverlay && (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-background z-10 p-4 text-center">
              {renderStatus()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
