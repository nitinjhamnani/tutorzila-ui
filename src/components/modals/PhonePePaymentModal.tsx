
"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthMock } from '@/hooks/use-auth-mock';
import { useScript } from '@/hooks/use-script'; // Import the new hook

declare global {
  interface Window {
    PhonePeCheckout: {
      transact: (options: {
        method: string;
        url: string;
        headers: {
          'Content-Type': string;
          'X-CALLBACK-URL': string;
          'X-CALL-MODE': string;
        };
        onSuccess: (response: any) => void;
        onFailure: (response: any) => void;
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
          setError("Authentication failed.");
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
            throw new Error("Failed to initialize payment from server.");
          }

          const data = await response.json();
          if (data.paymentUrl) {
              window.PhonePeCheckout.transact({
                method: "url",
                url: data.paymentUrl,
                headers: {
                  'Content-Type': 'application/json',
                  'X-CALLBACK-URL': 'https://www.tutorzila.com/callback', 
                  'X-CALL-MODE': 'post',
                },
                onSuccess: (response) => {
                  console.log('PhonePe Success:', response);
                  onPaymentSuccess();
                },
                onFailure: (response) => {
                  console.error('PhonePe Failure:', response);
                  toast({
                    title: "Payment Failed",
                    description: response?.message || "The payment could not be completed.",
                    variant: "destructive"
                  });
                  onPaymentFailure();
                },
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
        setError("Failed to load payment script. Please check your connection.");
        setIsLoading(false);
    }
  }, [isOpen, scriptStatus, token, amount, toast, onPaymentSuccess, onPaymentFailure]);

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
    // The iframe is now managed by the PhonePe SDK, so we just show a placeholder
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
            You will be redirected to our secure payment gateway.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow flex items-center justify-center relative">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
