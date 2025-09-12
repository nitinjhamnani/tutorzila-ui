
"use client";

import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
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

type PaymentStatus = "IDLE" | "LOADING_SCRIPT" | "RENDERING_IFRAME" | "POLLING_STATUS" | "SUCCESS" | "FAILED" | "TIMED_OUT";

export function PhonePePaymentModal({ isOpen, onOpenChange, onPaymentSuccess, onPaymentFailure, amount }: PhonePePaymentModalProps) {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const [status, setStatus] = useState<PaymentStatus>("IDLE");
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const mockPaymentUrl = "https://mercury-uat.phonepe.com/transact/uat_v2?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzT24iOjE3NTc3MDcyODIzODksIm1lcmNoYW50SWQiOiJURVNULU0yM1VRR0cwMjROSVMiLCJtZXJjaGFudE9yZGVySWQiOiI1YmI5YjgxYS0yY2JiLTRiOTktYjE4NS02NmUyMDc1NmM4MTUifQ.KCoOafCY9cIzAd0qp4sGj82MVtfhykDdghpdexS-f5s";
  const mockPaymentId = "MOCK_PAYMENT_ID_12345";

  useEffect(() => {
    if (!isOpen) {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
      setStatus("IDLE");
      setError(null);
      return;
    }

    setStatus("LOADING_SCRIPT");
    const scriptId = 'phonepe-checkout-script';

    if (document.getElementById(scriptId)) {
      initiatePayment();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
    script.async = true;
    script.onload = initiatePayment;
    script.onerror = () => {
      console.error("PhonePe script failed to load.");
      setError("Payment provider script could not be loaded. Please check your network or try again.");
      setStatus("FAILED");
    };
    document.body.appendChild(script);

  }, [isOpen]);

  const initiatePayment = () => {
    setStatus("RENDERING_IFRAME");
    
    // Using setTimeout to ensure the DOM has updated and the container is ready
    setTimeout(() => {
        if (window.PhonePeCheckout) {
            try {
                window.PhonePeCheckout.transact({
                    paymentUrl: mockPaymentUrl,
                    type: "IFRAME",
                    containerId: "phonepe-checkout-container",
                    callback: handlePaymentCallback,
                });
            } catch (e) {
                console.error("PhonePe transact error:", e);
                setError("Could not launch the payment page.");
                setStatus("FAILED");
            }
        } else {
            console.error("PhonePe SDK not found on window object.");
            setError("Payment SDK failed to initialize. Please reload.");
            setStatus("FAILED");
        }
    }, 0); // Pushes execution to the end of the browser's event queue
  };

  const handlePaymentCallback = (response: 'USER_CANCEL' | 'CONCLUDED') => {
    if (window.PhonePeCheckout) {
        window.PhonePeCheckout.closePage();
    }

    if (response === 'USER_CANCEL') {
        toast({ title: "Payment Cancelled", description: "You have cancelled the payment process.", variant: "destructive" });
        onOpenChange(false);
        onPaymentFailure();
    } else if (response === 'CONCLUDED') {
        startPolling(mockPaymentId);
    }
  };

  const startPolling = (pId: string) => {
    setStatus("POLLING_STATUS");

    const checkStatus = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        // This will fail for the mock payment ID, but we simulate success for testing UI
        if (pId === mockPaymentId) {
            console.log("Simulating successful payment status poll for mock ID.");
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
            setStatus("SUCCESS");
            setTimeout(() => {
              onPaymentSuccess();
              onOpenChange(false);
            }, 2000);
            return;
        }

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
          }, 2000);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };
    
    pollingIntervalRef.current = setInterval(checkStatus, 3000);
    pollingTimeoutRef.current = setTimeout(() => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (status !== 'SUCCESS') {
          setStatus("TIMED_OUT");
      }
    }, 60000);
  };

  const renderStatus = () => {
    switch (status) {
      case "RENDERING_IFRAME": // This status will be brief, so a loader is fine.
      case "LOADING_SCRIPT":
        return <><Loader2 className="h-8 w-8 animate-spin text-primary" /><p>Loading payment page...</p></>;
      case "POLLING_STATUS":
        return <><Loader2 className="h-8 w-8 animate-spin text-primary" /><p>Verifying payment, please wait...</p></>;
      case "SUCCESS":
        return <><CheckCircle className="h-8 w-8 text-green-500" /><p>Payment Successful! Account is now active.</p></>;
      case "FAILED":
        return <><ShieldAlert className="h-8 w-8 text-destructive" /><p className="font-semibold">Payment Error</p><p className="text-sm text-destructive/80">{error}</p></>;
      case "TIMED_OUT":
        return <><Clock className="h-8 w-8 text-yellow-500" /><p>Verification is taking longer than usual. Please check back in a few minutes.</p></>;
      default:
        return <><Loader2 className="h-8 w-8 animate-spin text-primary" /><p>Initializing...</p></>;
    }
  };

  // Show an overlay with status info UNLESS the iframe is supposed to be visible.
  const showOverlay = status !== 'RENDERING_IFRAME';

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
          {/* Container is now always in the DOM, visibility is controlled by opacity */}
          <div
            id="phonepe-checkout-container"
            className={cn(
              "w-full h-full transition-opacity duration-300",
              showOverlay ? "opacity-0" : "opacity-100"
            )}
          />
          {/* Overlay is shown based on showOverlay flag */}
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
