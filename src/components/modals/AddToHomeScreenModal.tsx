
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowDownCircle, Share } from "lucide-react";

interface AddToHomeScreenModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddToHomeScreenModal({ isOpen, onOpenChange }: AddToHomeScreenModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ArrowDownCircle className="mr-2 h-5 w-5 text-primary" />
            Add to Home Screen
          </DialogTitle>
          <DialogDescription>
            For quick access, add this app to your home screen.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">On iOS (iPhone/iPad):</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Open this site in the **Safari** browser.</li>
              <li className="flex items-center">
                Tap the **Share** button 
                <Share className="mx-1.5 h-4 w-4 inline-block text-blue-500" />
                at the bottom of the screen.
              </li>
              <li>Scroll down and tap **"Add to Home Screen"**.</li>
              <li>Confirm by tapping **"Add"**.</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">On Android (Chrome):</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Tap the **three dots** in the top-right corner.</li>
              <li>Select **"Install app"** or **"Add to Home screen"**.</li>
              <li>Follow the on-screen prompts to confirm.</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
