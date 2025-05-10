
"use client";

import Link from "next/link";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard, LogOut, Settings, LifeBuoy, Search, Edit, Menu, LogIn, UserPlus } from "lucide-react";
import { Logo } from "./Logo";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";


export function AppHeader() {
  const { user, isAuthenticated, logout } = useAuthMock();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    // For authenticated users, specific links can be added here based on role if needed in the future
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
  
  const actionButtonClass = cn(
    "transform transition-transform hover:scale-105 active:scale-95 text-lg font-semibold py-3 px-6 rounded-lg", 
    isScrolled ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"
  );

  const mobileLinkClass = "flex items-center gap-3 p-3 rounded-md hover:bg-accent text-base font-medium transition-colors";
  const mobileButtonClass = cn(mobileLinkClass, "w-full justify-start");


  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-28 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className={cn(
            "flex items-center space-x-2 text-2xl font-bold", // Base link styling from original Logo
            "transition-opacity hover:opacity-80", // Original className from AppHeader for Logo
            isScrolled ? "" : "text-card-foreground" // Original className from AppHeader for Logo
          )}
        >
          <Logo /> {/* Logo component now just renders the Image */}
        </Link>
        
        <nav className="hidden items-center space-x-1 md:flex">
          {/* Desktop Navigation for authenticated users (if any) */}
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
        </nav>

        <div className="flex items-center gap-4">
          {/* Desktop: Auth Buttons / User Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("relative h-12 w-12 rounded-full transform transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", !isScrolled && "hover:bg-white/10 active:bg-white/20 text-card-foreground")}>
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
                  <DropdownMenuItem asChild className="text-base py-2.5 cursor-pointer">
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2.5 h-5 w-5" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="text-base py-2.5 cursor-not-allowed">
                    <Settings className="mr-2.5 h-5 w-5" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="text-base py-2.5 cursor-not-allowed">
                    <LifeBuoy className="mr-2.5 h-5 w-5" />
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-base py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2.5 h-5 w-5" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost" className={cn("transform transition-transform hover:scale-105 active:scale-95 text-lg font-semibold", isScrolled ? "text-foreground hover:bg-muted/50" : "text-card-foreground hover:bg-white/10")}>
                  <Link href="/dashboard/search-tuitions">Find Tutors</Link>
                </Button>
                <Button asChild className={actionButtonClass}>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger & Content */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(isScrolled ? "text-foreground" : "text-card-foreground hover:bg-white/10 active:bg-white/20", "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2")}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 text-2xl font-bold", // Base link styling
                        isScrolled ? "" : "text-card-foreground" // Ensure text color contrasts with transparent/scrolled header
                      )}
                    >
                       <Logo />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-2 p-4 overflow-y-auto flex-grow">
                  {isAuthenticated && user ? (
                    <>
                      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted/50 border">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                          <AvatarFallback className="text-lg bg-primary/20 text-primary">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-md font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                        </div>
                      </div>

                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                        <LayoutDashboard className="h-5 w-5 text-primary" /> Dashboard
                      </Link>
                      {/* Authenticated nav links for mobile (if any added to navLinks based on role) */}
                      {navLinks.filter(link => user && link.roles.includes(user.role)).map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={mobileLinkClass}
                        >
                          <link.icon className="h-5 w-5 text-primary" />
                          <span>{link.label}</span>
                        </Link>
                      ))}
                      {/* Specific role based links if not covered by navLinks */}
                      {user.role === "parent" && (
                        <Link href="/dashboard/post-requirement" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                            <Edit className="h-5 w-5 text-primary" /> Post Requirement
                        </Link>
                      )}
                       {user.role === "tutor" && (
                        <Link href="/dashboard/search-tuitions" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                            <Search className="h-5 w-5 text-primary" /> Search Tuitions
                        </Link>
                      )}


                      <Separator className="my-3" />
                      <Link href="#" onClick={(e) => {e.preventDefault(); setMobileMenuOpen(false);}} className={cn(mobileLinkClass, "text-muted-foreground cursor-not-allowed opacity-70")}>
                        <Settings className="h-5 w-5" /> Settings
                      </Link>
                       <Link href="#" onClick={(e) => {e.preventDefault(); setMobileMenuOpen(false);}} className={cn(mobileLinkClass, "text-muted-foreground cursor-not-allowed opacity-70")}>
                        <LifeBuoy className="h-5 w-5" /> Support
                      </Link>
                      <Separator className="my-3" />
                      <Button variant="ghost" onClick={() => { logout(); setMobileMenuOpen(false); }} className={cn(mobileButtonClass, "text-destructive hover:bg-destructive/10 hover:text-destructive")}>
                        <LogOut className="h-5 w-5" /> Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/dashboard/search-tuitions" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                        <Search className="h-5 w-5 text-primary" /> Find Tutors
                      </Link>
                      <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                        <LogIn className="h-5 w-5 text-primary" /> Sign In
                      </Link>
                       <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                        <UserPlus className="h-5 w-5 text-primary" /> Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
