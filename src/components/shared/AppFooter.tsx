
"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { Github, Twitter, Facebook, Instagram, Home, Search, BookOpen, Info, FileText, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      { label: "About Us", href: "/privacy-policy", icon: Info }, // Placeholder link
      { label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck },
      { label: "Terms & Conditions", href: "/terms-and-conditions", icon: FileText },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact Us", href: "mailto:support@tutorzila.com", icon: Mail },
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
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Link href="/">
              <Logo className="h-16 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Tutorzila: Connecting students with passionate tutors to unlock their full potential.
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
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Tutorzila. All rights reserved.
          </p>
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
      </div>
    </footer>
  );
}

