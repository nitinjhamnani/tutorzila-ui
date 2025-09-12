
"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthMock } from '@/hooks/use-auth-mock';
import { useScript } from '@/hooks/use-script';

declare global {
  interface Window {
    PhonePeCheckout: {
      transact: (options: {
        paymentUrl: string;
        type: "IFRAME";
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
  const scriptStatus = useScript("https://mercury.phonepe.com/web/bundle/checkout.js");
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && scriptStatus === 'ready') {
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
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': '*/*',
            },
          });

          if (!response.ok) {
            throw new Error("Failed to initialize payment from the server.");
          }

          const data = await response.json();
          if (data.paymentUrl) {
              const handlePaymentCallback = (response: 'USER_CANCEL' | 'CONCLUDED') => {
                  console.log('PhonePe Callback Response:', response);
                  if (response === 'USER_CANCEL') {
                      toast({
                          title: "Payment Cancelled",
                          description: "You have cancelled the payment process.",
                          variant: "destructive"
                      });
                      onPaymentFailure();
                  } else if (response === 'CONCLUDED') {
                      // Note: Final success/failure should be confirmed via server-side webhook.
                      // This callback indicates the user has completed the flow on the PhonePe page.
                      // We optimistically call onPaymentSuccess here.
                      onPaymentSuccess();
                  }
                  window.PhonePeCheckout.closePage();
                  onOpenChange(false); // Close the modal
              };

              window.PhonePeCheckout.transact({
                paymentUrl: data.paymentUrl,
                type: "IFRAME",
                callback: handlePaymentCallback
              });
          } else {
            throw new Error("Payment URL not received from the server.");
          }
        } catch (err) {
          const errorMessage = (err as Error).message || "An unexpected error occurred.";
          console.error("Payment initiation failed:", err);
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      initiatePayment();
    } else if (isOpen && scriptStatus === 'error') {
        setError("Failed to load payment script. Please check your connection and try again.");
        setIsLoading(false);
    }
  }, [isOpen, scriptStatus, token, amount, toast, onPaymentSuccess, onPaymentFailure, onOpenChange]);

  let content;

  if (isLoading || scriptStatus === 'loading') {
    content = (
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Initializing secure payment...</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center text-destructive h-full flex flex-col items-center justify-center">
        <p className="font-semibold">Payment Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  } else {
    content = (
        <div id="phonepe-checkout-container" className="w-full h-full">
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading payment page...</p>
          </div>
        </div>
    );
  }

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
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
