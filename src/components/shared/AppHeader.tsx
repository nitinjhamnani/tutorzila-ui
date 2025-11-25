
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle as SheetTitleComponent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Menu, LogIn, GraduationCap } from "lucide-react";
import Image from 'next/image';
import logoAsset from '@/assets/images/logo.png';
import { cn } from "@/lib/utils";
import { useEffect, useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";

export function AppHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // This effect now correctly handles both initial load and path changes.
  useLayoutEffect(() => {
    setHasMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Run on mount and on every path change
    handleScroll(); 

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]); // Rerunning the entire effect on pathname change is the key.


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('signin') === 'true') {
        setIsAuthModalOpen(true);
      }
    }
  }, []);

  const transparentHeaderPaths = [
    "/", 
    "/become-a-tutor", 
    "/tutors-in-bangalore", 
    "/terms-and-conditions",
    "/privacy-policy",
    "/faq",
    "/contact-us",
    "/about-us"
  ];
  const isTransparentPath = transparentHeaderPaths.includes(pathname) || pathname.startsWith('/tutors/');
  
  const headerBaseClasses = "sticky z-50 w-full transition-all duration-300 ease-in-out top-[var(--verification-banner-height,0px)]";
  
  const headerDynamicClasses = isTransparentPath && !isScrolled
    ? "bg-transparent shadow-none border-transparent"
    : "bg-card shadow-md border-b border-border/20";
    
  const mobileMenuTriggerDynamicClasses = isTransparentPath && !isScrolled
    ? "text-card-foreground hover:bg-white/10 active:bg-white/20"
    : "text-foreground hover:bg-accent";
    
  const signInButtonClass = cn(
    "transform transition-transform hover:scale-105 active:scale-95 text-[15px] font-semibold py-2.5 px-5 rounded-lg"
  );
  
  const mobileLinkClass = "flex items-center gap-3 p-3 rounded-md hover:bg-accent text-base font-medium transition-colors";
  const mobileButtonClass = cn(mobileLinkClass, "w-full justify-start");

  return (
    <header className={cn(headerBaseClasses, hasMounted ? headerDynamicClasses : 'bg-card shadow-md border-b border-border/20')}>
      <div className="container mx-auto flex h-[var(--header-height)] items-center justify-between px-4 md:px-6">
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
          <Image
            src={logoAsset}
            alt="Tutorzila Logo"
            width={405} // Intrinsic width of the logo image
            height={96} // Intrinsic height of the logo image
            className={cn("h-[var(--logo-height)] w-auto")} // Allows overriding or extending styles from parent
            priority
          />
        </Link>

        <div className="flex items-center gap-4">          
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="default" className={cn(signInButtonClass, "bg-transparent hover:bg-primary/10 text-primary border-primary border-2")}>
              <Link href="/become-a-tutor">Become A Tutor</Link>
            </Button>
            {hasMounted && (
              <Button className={cn(signInButtonClass, "bg-primary hover:bg-primary/90 text-primary-foreground")} onClick={() => setIsAuthModalOpen(true)}>Sign In</Button>
            )}
          </div>
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  hasMounted ? mobileMenuTriggerDynamicClasses : 'text-foreground hover:bg-accent'
                )}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0 flex flex-col pt-[var(--verification-banner-height,0px)]">
                <SheetHeader className="p-4 border-b flex-shrink-0">
                  <SheetTitleComponent> 
                    <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                      <Image
                        src={logoAsset}
                        alt="Tutorzila Logo"
                        width={405} // Intrinsic width of the logo image
                        height={96} // Intrinsic height of the logo image
                        className={cn("h-[calc(var(--logo-height)_/_1.5)] w-auto")} // Allows overriding or extending styles from parent
                        priority
                      />
                    </Link>
                  </SheetTitleComponent>
                </SheetHeader>
                <div className="flex flex-col space-y-2 p-4 overflow-y-auto flex-grow visible">
                  <Button asChild variant="ghost" className={mobileButtonClass} onClick={() => { setMobileMenuOpen(false); }}>
                    <Link href="/become-a-tutor">
                      <GraduationCap className="h-5 w-5 text-primary" /> Become a Tutor
                    </Link>
                  </Button>

                  {hasMounted && (
                    <Button variant="ghost" className={mobileButtonClass} onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}>
                      <LogIn className="h-5 w-5 text-primary" /> Sign In
                    </Button>
                  )}
                </div>                
              </SheetContent>
            </Sheet>
          </div>
          {hasMounted && isAuthModalOpen && (
            <AuthModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
          )}
        </div>
      </div>
    </header>
  );
}
