
"use client";

import React from "react";
import Link from "next/link";
// import { Logo } from "./Logo"; // Removed incorrect Logo import
import Image from "next/image"; // Ensure Image is imported
import logoAsset from '@/assets/images/logo.png';
import { Github, Twitter, Facebook, Instagram, Home, BookOpen, Info, FileText, ShieldCheck, Mail, LogIn, UserPlus, Phone, MapPin, HelpCircle, GraduationCap, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PostRequirementModal } from "@/components/common/modals/PostRequirementModal";
import { useAuthMock } from "@/hooks/use-auth-mock";
import AuthModal from "@/components/auth/AuthModal";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/", icon: Home },
      { label: "Become a Tutor", href: "/become-a-tutor", icon: GraduationCap },
      { label: "Tutors in Bangalore", href: "/tutors-in-bangalore", icon: MapPin },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Us", href: "/about-us", icon: Info },
      { label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck },
      { label: "Terms & Conditions", href: "/terms-and-conditions", icon: FileText },
      { label: "FAQ", href: "/faq", icon: HelpCircle },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact Us", href: "/contact-us", icon: Mail },
      { label: "Sign In", href: "/?signin=true", icon: LogIn }, 
    ],
  },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/tutorzila", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/tutorzila", icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/tutorzila", icon: Linkedin },
];

export function AppFooter() {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user } = useAuthMock();

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleTriggerSignIn = () => {
    setIsRequirementModalOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleOpenRequirementModal = () => {
    setIsRequirementModalOpen(true);
  };
  
  if (!hasMounted) {
    return null;
  }
  
  return (
    <>
      <footer className="bg-card border-t border-border/50 text-card-foreground animate-in fade-in duration-500 ease-out">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="space-y-0 md:col-span-2 lg:col-span-1">
              <Link href="/" style={{ position: 'relative', top: '-30px', left: '-15px' }}>
                <Image
                  src={logoAsset}
                  alt="Tutorzila Logo"
                  width={405}
                  height={96}
                  className="h-[var(--logo-height)] w-auto"
                  priority
                />
              </Link>
              <p 
                className="text-muted-foreground leading-relaxed"
                style={{ marginTop: '-40px', fontSize: '14px' }}
              >
                Tutorzila connects parents with qualified home and online tutors across India for personalised learning.
              </p>
            </div>

            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 text-sm group">
                        <Link href={link.href} className="flex items-center">
                          <link.icon className="w-4 h-4 mr-2 text-primary/70 group-hover:text-primary transition-colors" />
                          {link.label}
                        </Link>
                      </Button>
                    </li>
                  ))}
                   {section.title === 'Explore' && (
                    <li>
                      <Button variant="link" onClick={handleOpenRequirementModal} className="p-0 h-auto text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 text-sm group flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-primary/70 group-hover:text-primary transition-colors" />
                        Post Requirement
                      </Button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
               <h4 className="text-sm font-semibold text-foreground pt-2 text-center md:text-left">Follow Us</h4>
                <div className="flex space-x-1 pt-1">
                  {socialLinks.map((social) => (
                    <Button key={social.label} variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary hover:bg-primary/10 transform hover:scale-110 transition-all duration-200">
                      <Link href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                        <social.icon className="w-5 h-5" />
                      </Link>
                    </Button>
                  ))}
                </div>
            </div>

             <div className="text-sm text-muted-foreground">
                <p className="text-xs text-center md:text-right text-muted-foreground"> 
                  &copy; {new Date().getFullYear()} Zilics Ventures Private Limited. All rights reserved.
                </p>
              </div>
          </div>
        </div>
         <style jsx global>{`
          :root {
            --footer-height: ${footerLinks.length > 2 ? '20rem' : '15rem'}; /* Adjust based on content */
          }
        `}</style>
      </footer>

      {/* Modals controlled by the footer's state */}
      <Dialog open={isRequirementModalOpen} onOpenChange={setIsRequirementModalOpen}>
        <DialogContent 
          className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <PostRequirementModal 
            startFromStep={1}
            onSuccess={() => setIsRequirementModalOpen(false)} 
            onTriggerSignIn={handleTriggerSignIn}
          />
        </DialogContent>
      </Dialog>
      
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onOpenChange={setIsAuthModalOpen} 
        />
      )}
    </>
  );
}
