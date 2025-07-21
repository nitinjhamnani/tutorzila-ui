
"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { Github, Twitter, Facebook, Instagram, Home, Search, BookOpen, Info, FileText, ShieldCheck, Mail, LogIn, UserPlus, Phone, MapPin, HelpCircle, GraduationCap } from "lucide-react"; // Added HelpCircle, GraduationCap
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/", icon: Home },
      { label: "Search Tutors", href: "/search-tuitions", icon: Search },
      { label: "Post Requirement", href: "/dashboard/post-requirement", icon: BookOpen },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck },
      { label: "Terms & Conditions", href: "/terms-and-conditions", icon: FileText },
      { label: "FAQ", href: "/faq", icon: HelpCircle },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact Us", href: "mailto:support@tutorzila.com", icon: Mail },
      { label: "Become a Tutor", href: "/become-a-tutor", icon: GraduationCap },
      { label: "Sign In", href: "/?signin=true", icon: LogIn }, 
    ],
  },
];

const socialLinks = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Github", icon: Github, href: "#" },
];

export function AppFooter() {
  return (
    <footer className="bg-card border-t border-border/50 text-card-foreground animate-in fade-in duration-500 ease-out">
      <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2 lg:col-span-1">
            <Link href="/">
              <Logo className="h-[var(--logo-height)] w-auto" />
            </Link>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button key={social.label} variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary hover:bg-primary/10 transform hover:scale-110 transition-all duration-200">
                  <Link href={social.href} aria-label={social.label}>
                    <social.icon className="w-5 h-5" />
                  </Link>
                </Button>
              ))}
            </div>
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
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" /> 
        
        <div className="text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4 md:mb-0 text-center w-full">
            <a href="mailto:contact@tutorzila.com" className="flex items-center hover:text-primary transition-colors justify-center sm:justify-start text-sm text-muted-foreground group sm:w-1/3">
              <Mail className="w-4 h-4 mr-2 text-primary/80 group-hover:text-primary transition-colors" />
              contact@tutorzila.com
            </a>
            <a href="tel:+1234567890" className="flex items-center hover:text-primary transition-colors justify-center sm:justify-start text-sm text-muted-foreground group sm:w-1/3">
              <Phone className="w-4 h-4 mr-2 text-primary/80 group-hover:text-primary transition-colors" />
              (123) 456-7890
            </a>
            <p className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground group sm:w-1/3">
              <MapPin className="w-4 h-4 mr-2 text-primary/80 group-hover:text-primary transition-colors" />
              123 Learning Lane, Knowledge City, EDU 54321
            </p>
          </div>
          <Separator className="my-4" /> 
          <p className="text-xs text-center text-muted-foreground"> 
            &copy; {new Date().getFullYear()} Tutorzila. All rights reserved.
          </p>
        </div>
      </div>
       <style jsx global>{`
        :root {
          --footer-height: ${footerLinks.length > 2 ? '20rem' : '15rem'}; /* Adjust based on content */
        }
      `}</style>
    </footer>
  );
}
