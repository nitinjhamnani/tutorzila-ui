
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
import { LayoutDashboard, LogOut, UserCircle, Settings, LifeBuoy } from "lucide-react";
import { Logo } from "./Logo";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function AppHeader() {
  const { user, isAuthenticated, logout } = useAuthMock();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    // Call handler once on mount to set initial state based on scroll position
    handleScroll(); 

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { href: "/dashboard/search-tuitions", label: "Find Tuitions", roles: ["tutor", "parent", "admin"] },
    { href: "/dashboard/post-requirement", label: "Post Requirement", roles: ["parent"] },
  ];

  const headerClasses = cn(
    "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
    isScrolled ? "bg-card shadow-sm border-b border-border" : "bg-transparent shadow-none border-b border-transparent"
  );

  const linkClasses = (href: string) => cn(
    "text-sm font-medium transition-colors hover:opacity-80",
    pathname === href ? "text-primary" : (isScrolled ? "text-muted-foreground" : "text-foreground hover:text-primary/80"),
  );

  const authButtonVariant = isScrolled ? "outline" : "secondary";
  const authButtonTextColor = isScrolled ? "" : "text-primary-foreground";
  const signUpButtonClass = isScrolled ? "" : "bg-primary/80 hover:bg-primary text-primary-foreground";


  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-28 items-center justify-between px-4 md:px-6">
        <Logo className={cn("transition-opacity hover:opacity-80", !isScrolled && "text-card-foreground")} />
        <nav className="hidden items-center space-x-6 md:flex">
          {isAuthenticated && user && navLinks.filter(link => user && link.roles.includes(user.role)).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClasses(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("relative h-10 w-10 rounded-full transform transition-transform hover:scale-110", !isScrolled && "hover:bg-white/20")}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email} ({user.role})
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                 <DropdownMenuItem disabled>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant={authButtonVariant} asChild className={cn("transform transition-transform hover:scale-105 active:scale-95", authButtonTextColor)}>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className={cn("transform transition-transform hover:scale-105 active:scale-95", signUpButtonClass)}>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
