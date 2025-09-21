
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Unlock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from 'react';
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useGlobalLoader } from "@/hooks/use-global-loader";

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
  const { token } = useAuthMock();
  const { showLoader, hideLoader } = useGlobalLoader();
  const [isPaymentFlowActive, setIsPaymentFlowActive] = useState(false);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activationFee = 199;

  useEffect(() => {
    // Cleanup polling interval on component unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);


  const cleanupAndClose = (success: boolean, message?: string) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    hideLoader();
    setIsPaymentFlowActive(false);
    if (success) {
      toast({
        title: "Payment Successful!",
        description: message || "Your account has been activated.",
      });
      onActivate();
    } else {
      toast({
          variant: "destructive",
          title: "Payment Failed",
          description: message || "Your payment could not be completed. Please try again.",
      });
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      const response = await fetch(`${apiBaseUrl}/api/payment/status?paymentId=${paymentId}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success === true) {
          setVerificationStatus('success');
          cleanupAndClose(true, result.message);
          return 'success';
        } else {
          // If the API confirms failure, stop polling
          setVerificationStatus('failed');
          cleanupAndClose(false, result.message);
          return 'failed';
        }
      }
      return 'pending';
    } catch (e) {
      console.error("Polling failed:", e);
      return 'pending';
    }
  };

  const startPolling = (paymentId: string) => {
    setVerificationStatus('verifying');
    showLoader("Verifying payment status...");
    let attempts = 0;
    const maxAttempts = 20; 

    pollingIntervalRef.current = setInterval(async () => {
      attempts++;
      const status = await checkPaymentStatus(paymentId);
      if (status === 'success' || status === 'failed' || attempts >= maxAttempts) {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        if (status !== 'success' && status !== 'failed') {
          setVerificationStatus('timeout');
          cleanupAndClose(false, "Payment verification timed out. Please check again later or contact support.");
        }
      }
    }, 6000); 
  };
  
  const initiatePayment = async () => {
    if (!window.PhonePeCheckout) {
        setError("Payment SDK is not ready. Please wait a moment and try again.");
        toast({
            variant: "destructive",
            title: "Payment Gateway Not Ready",
            description: "The payment gateway is still loading. Please wait a moment and try again.",
        });
        return;
    }

    setIsInitiatingPayment(true);
    setError(null);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiBaseUrl}/api/payment/tutor?amount=${activationFee}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get payment details from server.");
      }
      
      const paymentData = await response.json();
      const { paymentUrl, paymentId } = paymentData;

      setIsPaymentFlowActive(true);
      setIsInitiatingPayment(false);

      try {
        window.PhonePeCheckout.transact({
          tokenUrl: paymentUrl,
          callback: (response: any) => {
            console.log("PhonePe callback", response);
            if (response === "CONCLUDED") {
              startPolling(paymentId);
            } else if (response === "USER_CANCEL") {
              cleanupAndClose(false, "You cancelled the payment process."); 
            }
            if (window.PhonePeCheckout.closePage) {
                window.PhonePeCheckout.closePage();
            }
          },
          type: "IFRAME",
          containerId: "phonepe-container-direct"
        });
      } catch (e) {
        setError("Could not initiate PhonePe checkout.");
        setIsPaymentFlowActive(false);
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Could not initiate the payment process. Please try again.",
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
        
        <div id="phonepe-container-direct" className={cn("w-full h-[600px] z-[201]", !isPaymentFlowActive && "hidden")}>
          {isInitiatingPayment && (
            <div className="flex items-center justify-center gap-2 text-sm text-destructive h-[36px]">
              <Loader2 className="h-4 w-4 animate-spin"/>
              <span>Loading payment gateway...</span>
            </div>
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
