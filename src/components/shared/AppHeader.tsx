
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

export function AppHeader() {
  const { user, isAuthenticated, logout } = useAuthMock();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard/search-tuitions", label: "Find Tuitions", roles: ["tutor", "parent", "admin"] },
    { href: "/dashboard/post-requirement", label: "Post Requirement", roles: ["parent"] },
    // Add more public/semi-public links if needed
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6"> {/* Increased height from h-16 to h-20 */}
        <Logo className="transition-opacity hover:opacity-80" />
        <nav className="hidden items-center space-x-6 md:flex">
          {isAuthenticated && user && navLinks.filter(link => user && link.roles.includes(user.role)).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary/80",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full transform transition-transform hover:scale-110">
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
              <Button variant="outline" asChild className="transform transition-transform hover:scale-105 active:scale-95">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="transform transition-transform hover:scale-105 active:scale-95">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

