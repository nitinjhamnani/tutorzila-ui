
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActivationStatusCardProps {
  onActivate: () => void;
  className?: string;
}

export function ActivationStatusCard({ onActivate, className }: ActivationStatusCardProps) {
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
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-destructive/10 p-4 border-t border-destructive/20">
        <div className="text-center sm:text-left">
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
      </CardFooter>
    </Card>
  );
}
