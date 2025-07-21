
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Unlock, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';

interface ActivationStatusCardProps {
  onActivate: () => void;
  className?: string;
}

export function ActivationStatusCard({ onActivate, className }: ActivationStatusCardProps) {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");

  const handleApplyReferral = () => {
    if (!referralCode.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter a referral code.",
      });
      return;
    }
    // Mock referral code logic
    toast({
      title: "Referral Applied (Mock)",
      description: `Discount for code "${referralCode}" would be applied.`,
    });
  };


  return (
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
      <CardFooter className="flex flex-col items-start gap-4 bg-destructive/10 p-4 border-t border-destructive/20">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-left">
                <p className="text-sm font-semibold text-destructive">
                    One-Time Activation Fee: <span className="text-lg">₹199</span>
                </p>
                <p className="text-xs text-destructive/80">
                    By activating, you agree to our{' '}
                    <Link href="/terms-and-conditions" className="underline hover:text-destructive transition-colors" target="_blank">
                        Terms & Conditions
                    </Link>
                    .
                </p>
            </div>
             <Button 
                variant="destructive" 
                size="lg" 
                className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95"
                onClick={onActivate}
            >
              <Unlock className="mr-2 h-4 w-4" />
              Activate My Account Now
            </Button>
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-2 items-end">
            <div className="w-full sm:w-auto sm:flex-grow">
                <label htmlFor="referral-code" className="text-xs font-medium text-destructive/90 mb-1 block">Have a referral code?</label>
                <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive/70" />
                    <Input 
                        id="referral-code"
                        placeholder="Enter code..."
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="pl-9 h-9 text-sm bg-destructive/10 border-destructive/30 placeholder:text-destructive/50 focus:bg-background focus:text-foreground"
                    />
                </div>
            </div>
            <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto h-9 text-xs border-destructive/50 text-destructive/90 hover:bg-destructive/20 hover:text-destructive"
                onClick={handleApplyReferral}
            >
                Apply
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
