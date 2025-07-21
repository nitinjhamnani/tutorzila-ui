
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Unlock, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface ActivationStatusCardProps {
  onActivate: () => void;
  className?: string;
}

export function ActivationStatusCard({ onActivate, className }: ActivationStatusCardProps) {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

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
    setIsReferralModalOpen(false); // Close modal on success
  };

  return (
    <Dialog open={isReferralModalOpen} onOpenChange={setIsReferralModalOpen}>
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
          <div className="w-full pt-2">
            <DialogTrigger asChild>
              <Button variant="link" className="p-0 h-auto text-xs text-destructive/80 hover:text-destructive">
                Have a referral code?
              </Button>
            </DialogTrigger>
          </div>
        </CardFooter>
      </Card>
      
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center text-primary">
            <Percent className="mr-2 h-5 w-5"/>
            Apply Referral Code
          </DialogTitle>
          <DialogDescription>
            Enter your referral code below to avail a discount on your activation fee.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
           <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="referral-code-modal"
                    placeholder="Enter code..."
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="pl-9 h-10 text-sm bg-input border-border focus:border-primary focus:ring-primary/30"
                />
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleApplyReferral}>Apply Code</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
