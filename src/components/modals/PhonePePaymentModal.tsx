
"use client";

import { useEffect, useState, useRef } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const initiatePayment = async () => {
        setIsLoading(true);
        setPaymentUrl(null);
        
        if (!token) {
          toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to make a payment." });
          setIsLoading(false);
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
            throw new Error("Failed to initialize payment.");
          }

          const data = await response.json();
          if (data.paymentUrl) {
            setPaymentUrl(data.paymentUrl);
          } else {
            throw new Error("Payment URL not received from server.");
          }
        } catch (error) {
          console.error("Payment initiation failed:", error);
          toast({
            variant: "destructive",
            title: "Payment Initialization Failed",
            description: (error as Error).message || "Could not prepare the payment page. Please try again.",
          });
          onPaymentFailure();
        } finally {
           // Let the iframe loading indicator take over
           setTimeout(() => setIsLoading(false), 1500);
        }
      };

      initiatePayment();
    }
  }, [isOpen, token, amount, toast, onPaymentFailure]);

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
          {isLoading || !paymentUrl ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>{isLoading && !paymentUrl ? "Initializing payment..." : "Loading payment page..."}</p>
            </div>
          ) : (
            <iframe
              src={paymentUrl}
              className="w-full h-full border-0"
              allow="payment"
              title="PhonePe Payment Gateway"
            ></iframe>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
