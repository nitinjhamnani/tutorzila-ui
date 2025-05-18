
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle as SheetTitleComponent, // Renamed to avoid conflict with local SheetTitle
  SheetTrigger
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, 
  DialogTrigger as ShadDialogTrigger, 
} from "@/components/ui/dialog";
import { Menu, LogIn, UserPlus, Search, HomeIcon } from "lucide-react"; // UserPlus might be removed if sign-up link is gone
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SignInForm } from "@/components/auth/SignInForm";

export function AppHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const bannerHeightString = typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--verification-banner-height').trim() : '0px';
      const bannerHeight = parseFloat(bannerHeightString) || 0;
      setIsScrolled(window.scrollY > (bannerHeight > 0 ? 10 : 20));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('signin') === 'true') {
        setSignInModalOpen(true);
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerClasses = cn(
    "sticky z-50 w-full transition-all duration-300 ease-in-out",
    "top-[var(--verification-banner-height,0px)]", 
    isScrolled || pathname !== "/" ? "bg-card shadow-md border-b border-border/20" : "bg-transparent"
  );

  const signInButtonClass = cn(
    "transform transition-transform hover:scale-105 active:scale-95 text-[15px] font-semibold py-2.5 px-5 rounded-lg"
  );
  
  const mobileLinkClass = "flex items-center gap-3 p-3 rounded-md hover:bg-accent text-base font-medium transition-colors";
  const mobileButtonClass = cn(mobileLinkClass, "w-full justify-start");

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-[var(--header-height)] items-center justify-between px-4 md:px-6">
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
          <Logo className="h-[var(--logo-height)] w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="default" className={cn(signInButtonClass, "bg-transparent hover:bg-primary/10 text-primary border-primary border-2")}>
              <Link href="/search-tuitions">Find Tutors</Link>
            </Button>
            <Dialog open={signInModalOpen} onOpenChange={setSignInModalOpen}>
              <ShadDialogTrigger asChild>
                <Button className={cn(signInButtonClass, "bg-primary hover:bg-primary/90 text-primary-foreground")}>Sign In</Button>
              </ShadDialogTrigger>
              <DialogContent className="sm:max-w-md p-0 bg-card rounded-lg overflow-hidden">
                 <DialogHeader className="sr-only">
                  <DialogTitle>Sign In to Tutorzila</DialogTitle>
                </DialogHeader>
                <SignInForm onSuccess={() => setSignInModalOpen(false)} />
              </DialogContent>
            </Dialog>
            {/* Sign Up Button Removed */}
          </div>

          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(
                  (isScrolled || pathname !== "/") ? "text-foreground" : "text-card-foreground hover:bg-white/10 active:bg-white/20", 
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0 flex flex-col pt-[var(--verification-banner-height,0px)]">
                <SheetHeader className="p-4 border-b">
                  <SheetTitleComponent> 
                    <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                      <Logo className="h-[calc(var(--logo-height)_/_1.5)] w-auto" />
                    </Link>
                  </SheetTitleComponent>
                </SheetHeader>
                <div className="flex flex-col space-y-2 p-4 overflow-y-auto flex-grow">
                  <Button asChild variant="ghost" className={mobileButtonClass} onClick={() => { setMobileMenuOpen(false); }}>
                    <Link href="/search-tuitions">
                      <Search className="h-5 w-5 text-primary" /> Find Tutors
                    </Link>
                  </Button>

                  <Dialog open={signInModalOpen} onOpenChange={(isOpen) => {
                    setSignInModalOpen(isOpen);
                    if (isOpen) setMobileMenuOpen(false); 
                  }}>
                    <ShadDialogTrigger asChild>
                      <Button variant="ghost" className={mobileButtonClass}>
                        <LogIn className="h-5 w-5 text-primary" /> Sign In
                      </Button>
                    </ShadDialogTrigger>
                    <DialogContent className="sm:max-w-md p-0 bg-card rounded-lg overflow-hidden">
                      <DialogHeader className="sr-only">
                        <DialogTitle>Sign In to Tutorzila</DialogTitle>
                      </DialogHeader>
                      <SignInForm onSuccess={() => { setSignInModalOpen(false); setMobileMenuOpen(false); }} />
                    </DialogContent>
                  </Dialog>
                  {/* Sign Up Button Removed from Mobile Menu */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
