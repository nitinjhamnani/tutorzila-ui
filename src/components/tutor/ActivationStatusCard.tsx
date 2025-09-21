
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Unlock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from 'react';

declare global {
  interface Window {
    PhonePeCheckout: any;
  }
}

interface ActivationStatusCardProps {
  onActivate: () => void;
  className?: string;
}

type VerificationStatus = 'idle' | 'verifying' | 'success' | 'failed' | 'timeout';

export function ActivationStatusCard({ onActivate, className }: ActivationStatusCardProps) {
  const { toast } = useToast();
  const [isPaymentFlowActive, setIsPaymentFlowActive] = useState(false);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activationFee = 199;

  const cleanupAndClose = (success: boolean) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPaymentFlowActive(false);
    if (success) {
      onActivate();
    } else {
      toast({
          variant: "destructive",
          title: "Payment Failed",
          description: "Your payment could not be completed. Please try again.",
      });
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/tutor/activation?paymentId=${paymentId}`, {
        method: 'GET',
        headers: { 'accept': '*/*' }
      });
      if (response.ok) {
        setVerificationStatus('success');
        cleanupAndClose(true);
        return 'success';
      }
      return 'pending';
    } catch (e) {
      console.error("Polling failed:", e);
      return 'pending';
    }
  };

  const startPolling = (paymentId: string) => {
    setVerificationStatus('verifying');
    let attempts = 0;
    const maxAttempts = 20; // ~1 minute

    pollingIntervalRef.current = setInterval(async () => {
      attempts++;
      const status = await checkPaymentStatus(paymentId);
      if (status === 'success' || attempts >= maxAttempts) {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        if (status !== 'success') {
          setVerificationStatus('timeout');
        }
      }
    }, 3000);
  };
  
  const initiatePayment = async () => {
    setIsInitiatingPayment(true);
    setError(null);
    try {
      // MOCK: Replace with your actual API call to get the payment token
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = {
        tokenUrl: "https://mercury-uat.phonepe.com/transact/uat_v2?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzT24iOjE3NTg0NzAyMjY3MTEsIm1lcmNoYW50SWQiOiJURVNULU0yM1VRR0cwMjROSVMiLCJtZXJjaGFudE9yZGVySWQiOiJhN2QyNjhiMS1iOWI4LTQ0YWItOTJiMS1jMjA5MTFiYWQwZDkifQ.I4GgZXbfpwbahuYCFW8fsLeEgPfirqe7D0fDpE6ELEY",
        paymentId: `pid_${Date.now()}`
      };

      setIsPaymentFlowActive(true);
      setIsInitiatingPayment(false);

      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.PhonePeCheckout) {
          clearInterval(interval);
          try {
            window.PhonePeCheckout.transact({
              tokenUrl: mockData.tokenUrl,
              callback: () => {
                if (window.PhonePeCheckout.closePage) window.PhonePeCheckout.closePage();
                startPolling(mockData.paymentId);
              },
              type: "IFRAME",
              containerId: "phonepe-container-direct"
            });
          } catch (e) {
            setError("Could not initiate PhonePe checkout.");
            setIsPaymentFlowActive(false);
          }
        } else if (attempts > 50) { // ~5 seconds timeout
          clearInterval(interval);
          setError("Failed to initialize payment SDK. Please refresh and try again.");
          setIsPaymentFlowActive(false);
        }
      }, 100);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Could not initiate the payment process. Please try again.",
      });
      setIsInitiatingPayment(false);
    }
  };

  return (
    <Card className={cn("bg-destructive/10 border-destructive/20 text-destructive-foreground animate-in fade-in duration-500 ease-out", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-destructive/20 rounded-full">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-destructive">Account Activation Required</CardTitle>
            <CardDescription className="text-destructive/80 mt-1">
              Your account is currently inactive. Please complete the activation to start receiving student enquiries.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-destructive/10 p-4 border-t border-destructive/20">
        <div className="flex-grow">
          <p className="text-sm font-semibold text-destructive">One-Time Activation Fee: <span className="text-lg">₹{activationFee}</span></p>
          <p className="text-xs text-destructive/80 mt-1">
            By activating, you agree to our{' '}
            <Link href="/terms-and-conditions" className="underline hover:text-destructive transition-colors" target="_blank">Terms & Conditions</Link>.
          </p>
        </div>
        
        <div className={cn("w-full sm:w-auto", !isPaymentFlowActive && "hidden")}>
          {isInitiatingPayment ? (
            <div className="flex items-center justify-center gap-2 text-sm text-destructive h-[36px]">
              <Loader2 className="h-4 w-4 animate-spin"/>
              <span>Loading payment gateway...</span>
            </div>
          ) : (
            <div id="phonepe-container-direct" className="w-full h-full min-h-[50px]"></div>
          )}
        </div>

        {!isPaymentFlowActive && (
          <Button 
            variant="destructive" 
            size="sm"
            className="w-full sm:w-auto text-xs sm:text-sm py-2 px-3 transform transition-transform hover:scale-105 active:scale-95"
            onClick={initiatePayment}
            disabled={isInitiatingPayment}
          >
            {isInitiatingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Unlock className="mr-2 h-4 w-4" />}
            {isInitiatingPayment ? "Initiating..." : "Activate My Account Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
