
"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthMock } from '@/hooks/use-auth-mock';

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
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const initiatePayment = async () => {
        setIsLoading(true);
        setError(null);
        setPaymentUrl(null);

        if (!token) {
          toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to make a payment." });
          setIsLoading(false);
          setError("Authentication failed.");
          onPaymentFailure();
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
            setPaymentUrl(data.paymentUrl);
          } else {
            throw new Error("Payment URL not received from the server.");
          }
        } catch (err) {
          const errorMessage = (err as Error).message || "Could not prepare the payment page. Please try again.";
          console.error("Payment initiation failed:", err);
          toast({
            variant: "destructive",
            title: "Payment Initialization Failed",
            description: errorMessage,
          });
          setError(errorMessage);
          onPaymentFailure();
        } finally {
          setIsLoading(false);
        }
      };

      initiatePayment();
    }
  }, [isOpen, token, amount, toast, onPaymentFailure]);

  let content;

  if (isLoading) {
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
  } else if (paymentUrl) {
    content = (
      <iframe
        src={paymentUrl}
        className="w-full h-full border-0"
        title="PhonePe Payment"
        allow="payment"
      ></iframe>
    );
  } else {
      content = (
      <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
        <p>Could not load payment gateway.</p>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card p-0 flex flex-col" style={{ height: '80vh', maxHeight: '600px' }}>
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            You are being redirected to our secure payment gateway.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow flex items-center justify-center relative">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
