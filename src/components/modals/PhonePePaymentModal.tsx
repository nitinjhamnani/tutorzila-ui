
"use client";

import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthMock } from '@/hooks/use-auth-mock';

// Define the structure of the PhonePeCheckout object that will be available on the window
declare global {
  interface Window {
    PhonePeCheckout: {
      transact: (options: {
        method: 'IFRAME';
        data: {
          merchantId: string;
          merchantTransactionId: string;
          amount: number;
          redirectUrl: string;
          redirectMode: 'POST' | 'GET';
          callbackUrl: string;
          mobileNumber?: string;
          paymentInstrument: {
            type: 'PAY_PAGE';
          };
        };
        checksum: string;
        apiEndPoint: string;
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
}

export function PhonePePaymentModal({ isOpen, onOpenChange, onPaymentSuccess, onPaymentFailure }: PhonePePaymentModalProps) {
  const { toast } = useToast();
  const { user } = useAuthMock();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  // Dynamically load the PhonePe script
  useEffect(() => {
    if (isOpen && !scriptLoaded) {
      const script = document.createElement('script');
      script.src = 'https://mercury.phonepe.com/web/bundle/checkout.js';
      script.onload = () => {
        setScriptLoaded(true);
        console.log("PhonePe script loaded successfully.");
      };
      script.onerror = () => {
        console.error("Failed to load PhonePe script.");
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: "Could not load payment gateway. Please try again later.",
        });
        onOpenChange(false);
      };
      document.body.appendChild(script);

      return () => {
        // Clean up the script tag if the component unmounts or the modal closes
        const existingScript = document.querySelector('script[src="https://mercury.phonepe.com/web/bundle/checkout.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [isOpen, scriptLoaded, onOpenChange, toast]);

  // Initiate the transaction once the script is loaded
  useEffect(() => {
    if (isOpen && scriptLoaded && user) {
        setIsLoading(true);
        // TODO: Replace with actual API call to your backend
        // This endpoint should generate the payload and checksum on the server
        const initiatePayment = async () => {
            try {
                // const response = await fetch('/api/payments/initiate-phonepe', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ userId: user.id, amount: 19900 }) // amount in paise
                // });
                // const paymentData = await response.json();

                // MOCKING the response for now
                await new Promise(resolve => setTimeout(resolve, 1500));
                const paymentData = {
                    success: true,
                    data: {
                        merchantId: 'MOCK_MERCHANT_ID',
                        merchantTransactionId: `TXN_${Date.now()}`,
                        amount: 19900,
                        redirectUrl: `${window.location.origin}/tutor/dashboard?status=success`,
                        redirectMode: 'POST',
                        callbackUrl: `https://webhook.site/callback-url`, // Your server's callback
                        mobileNumber: user.phone || '9999999999',
                    },
                    checksum: 'mock-checksum-string', // This will be the SHA256 hash
                    apiEndPoint: '/pg/v1/pay',
                };
                
                if (!paymentData.success) {
                    throw new Error('Failed to initiate payment.');
                }
                
                window.PhonePeCheckout.transact({
                    method: 'IFRAME',
                    data: {
                        ...paymentData.data,
                        paymentInstrument: {
                            type: 'PAY_PAGE'
                        }
                    },
                    checksum: paymentData.checksum,
                    apiEndPoint: paymentData.apiEndPoint
                });

                // This is a placeholder. In a real scenario, you'd rely on the callbackUrl
                // to get the final status from your backend. For this demo, we'll simulate it.
                setTimeout(() => {
                    console.log("Simulating payment success callback.");
                    onPaymentSuccess();
                }, 8000); // Simulate an 8-second payment process

            } catch (error) {
                console.error("Payment initiation failed", error);
                toast({
                    variant: "destructive",
                    title: "Payment Initiation Failed",
                    description: "We couldn't start the payment process. Please try again.",
                });
                onFailure();
            } finally {
                setIsLoading(false);
            }
        };

        initiatePayment();
    }
  }, [isOpen, scriptLoaded, user, toast, onPaymentSuccess, onFailure]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card p-0 flex flex-col" style={{ height: '80vh', maxHeight: '600px' }}>
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            You are being redirected to our secure payment gateway.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow flex items-center justify-center relative" ref={iframeContainerRef}>
          {isLoading && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Connecting to payment gateway...</p>
            </div>
          )}
          {/* The PhonePe iframe will be mounted here by their script */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
