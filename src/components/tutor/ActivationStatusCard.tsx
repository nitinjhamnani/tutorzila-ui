
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Unlock, Percent, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import { PhonePePaymentModal } from "@/components/modals/PhonePePaymentModal";

interface ActivationStatusCardProps {
  onActivate: () => void;
  className?: string;
}

export function ActivationStatusCard({ onActivate, className }: ActivationStatusCardProps) {
  const { toast } = useToast();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{ tokenUrl: string; paymentId: string } | null>(null);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const activationFee = 199;

  const initiatePayment = async () => {
    setIsInitiatingPayment(true);
    try {
      // In a real app, this would be a fetch to your backend.
      // const response = await fetch('/api/initiate-payment', { method: 'POST', body: JSON.stringify({ amount: activationFee }) });
      // const data = await response.json();
      
      // Simulating the API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
          tokenUrl: "https://mercury-uat.phonepe.com/transact/uat_v2?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzT24iOjE3NTc3MDcyODIzODksIm1lcmNoYW50SWQiOiJURVNULU0yM1VRR0cwMjROSVMiLCJtZXJjaGFudE9yZGVySWQiOiI1YmI5YjgxYS0yY2JiLTRiOTktYjE4NS02NmUyMDc1NmM4MTUifQ.KCoOafCY9cIzAd0qp4sGj82MVtfhykDdghpdexS-f5s",
          paymentId: `pid_${Date.now()}` // A unique mock payment ID
      };
      
      setPaymentDetails(mockData);
      setIsPaymentModalOpen(true);

    } catch (error) {
       toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Could not initiate the payment process. Please try again.",
      });
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    toast({
        title: "Payment Successful!",
        description: "Your account has been activated.",
    });
    onActivate();
  };

  const handlePaymentFailure = () => {
      setIsPaymentModalOpen(false);
      toast({
          variant: "destructive",
          title: "Payment Failed",
          description: "Your payment could not be completed. Please try again.",
      });
  };

  return (
    <>
      <Card className={cn(
          "bg-destructive/10 border-destructive/20 text-destructive-foreground animate-in fade-in duration-500 ease-out",
          className
      )}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-destructive/20 rounded-full">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-destructive">
                Account Activation Required
              </CardTitle>
              <CardDescription className="text-destructive/80 mt-1">
                Your account is currently inactive. Please complete the activation to start receiving student enquiries.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-destructive/10 p-4 border-t border-destructive/20">
            <div className="flex-grow">
                <p className="text-sm font-semibold text-destructive">
                    One-Time Activation Fee: <span className="text-lg">₹{activationFee}</span>
                </p>
                <p className="text-xs text-destructive/80 mt-1">
                    By activating, you agree to our{' '}
                    <Link href="/terms-and-conditions" className="underline hover:text-destructive transition-colors" target="_blank">
                        Terms & Conditions
                    </Link>
                    .
                </p>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-1.5 w-full sm:w-auto">
                <Button 
                    variant="destructive" 
                    size="sm"
                    className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95 text-xs sm:text-sm py-2 px-3"
                    onClick={initiatePayment}
                    disabled={isInitiatingPayment}
                >
                  {isInitiatingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Unlock className="mr-2 h-4 w-4" />}
                  {isInitiatingPayment ? "Initiating..." : "Activate My Account Now"}
                </Button>
            </div>
        </CardFooter>
      </Card>
      
    {paymentDetails && (
        <PhonePePaymentModal 
            isOpen={isPaymentModalOpen}
            onOpenChange={setIsPaymentModalOpen}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailure={handlePaymentFailure}
            amount={activationFee}
            tokenUrl={paymentDetails.tokenUrl}
            paymentId={paymentDetails.paymentId}
        />
    )}
    </>
  );
}
