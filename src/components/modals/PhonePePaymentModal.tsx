
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

  useEffect(() => {
    if (!isOpen) return;

    const scriptId = 'phonepe-checkout-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

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

          if (data.paymentUrl && window.PhonePeCheckout) {
            const handlePaymentCallback = (response: 'USER_CANCEL' | 'CONCLUDED') => {
              if (response === 'USER_CANCEL') {
                toast({ title: "Payment Cancelled", description: "You have cancelled the payment process.", variant: "destructive" });
                onPaymentFailure();
              } else if (response === 'CONCLUDED') {
                // Here you might want to call another API to verify the payment status
                onPaymentSuccess();
              }
              window.PhonePeCheckout.closePage();
              onOpenChange(false);
            };

            window.PhonePeCheckout.transact({
              paymentUrl: data.paymentUrl,
              type: "IFRAME",
              containerId: "phonepe-checkout-container",
              callback: handlePaymentCallback
            });
            setIsLoading(false);
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
    
    if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
        script.async = true;
        
        script.onload = () => {
            initiatePayment();
        };

        script.onerror = () => {
            setError("Failed to load payment script. Please check your connection.");
            setIsLoading(false);
        };
        document.body.appendChild(script);
    } else {
        initiatePayment();
    }

  }, [isOpen, token, amount, toast, onPaymentSuccess, onPaymentFailure, onOpenChange]);

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
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Initializing secure payment...</p>
            </div>
          )}
          {error && (
             <div className="text-center text-destructive h-full flex flex-col items-center justify-center p-4">
                <p className="font-semibold">Payment Error</p>
                <p className="text-sm">{error}</p>
             </div>
          )}
          <div id="phonepe-checkout-container" className={cn("w-full h-full", isLoading || error ? 'hidden' : 'block')} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
