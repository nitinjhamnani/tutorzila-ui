
"use client";

import Link from "next/link";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Settings, LifeBuoy, Search, Edit } from "lucide-react"; // Added Edit for Post Requirement
import { Logo } from "./Logo";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import logoAsset from '@/assets/images/logo.png';

export function AppHeader() {
  const { user, isAuthenticated, logout } = useAuthMock();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { href: "/dashboard/search-tuitions", label: "Find Tuitions", icon: Search, roles: ["tutor", "parent", "admin"] },
    { href: "/dashboard/post-requirement", label: "Post Requirement", icon: Edit, roles: ["parent", "admin"] }, // Changed icon for Post Requirement
  ];

  const headerClasses = cn(
    "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
    isScrolled ? "bg-card shadow-md border-b border-border" : "bg-transparent border-b border-transparent"
  );

  const linkClasses = (href: string) => cn(
    "text-sm font-medium transition-colors hover:text-primary/80 flex items-center gap-2 py-2 px-3 rounded-md",
    isScrolled ? (pathname === href ? "text-primary bg-primary/10" : "text-foreground hover:bg-muted") : (pathname === href ? "text-primary bg-white/20" : "text-card-foreground hover:bg-white/10"),
    "transform hover:scale-105 active:scale-95"
  );
  
  const signUpButtonClass = cn(
    "transform transition-transform hover:scale-105 active:scale-95 text-lg font-semibold", // Added text-lg and font-semibold
    isScrolled ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground" // Kept primary style for visibility
  );


  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-28 items-center justify-between px-4 md:px-6">
        <Logo className={cn("transition-opacity hover:opacity-80")} />
        <nav className="hidden items-center space-x-2 md:flex">
          {isAuthenticated && user && navLinks.filter(link => user && link.roles.includes(user.role)).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClasses(link.href)}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          ))}
           {!isAuthenticated && ( // Show specific links for non-authenticated users
            <>
              <Link href="/dashboard/search-tuitions" className={linkClasses("/dashboard/search-tuitions")}>
                <Search className="h-5 w-5" /> Find Tutors
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("relative h-12 w-12 rounded-full transform transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", !isScrolled && "hover:bg-white/10 active:bg-white/20")}>
                  <Avatar className="h-12 w-12 border-2 border-primary/50 group-hover:border-primary transition-all">
                    <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1 p-1">
                    <p className="text-base font-semibold leading-none">{user.name}</p>
                    <p className="text-sm leading-none text-muted-foreground">
                      {user.email} ({user.role})
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-base py-2.5">
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2.5 h-5 w-5" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="text-base py-2.5">
                  <Settings className="mr-2.5 h-5 w-5" />
                  Settings
                </DropdownMenuItem>
                 <DropdownMenuItem disabled className="text-base py-2.5">
                  <LifeBuoy className="mr-2.5 h-5 w-5" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-base py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2.5 h-5 w-5" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              {/* Removed original "Sign In" button, repurposed "Sign Up" button below */}
              <Button asChild className={signUpButtonClass}>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
