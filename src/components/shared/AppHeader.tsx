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
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle as SheetTitleComponent,
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger as ShadDialogTrigger,
} from "@/components/ui/dialog";
import { LayoutDashboard, LogOut, Settings, LifeBuoy, Search, Edit, Menu, LogIn, UserPlus, HomeIcon, UserCircle, ClipboardList, UsersRound } from "lucide-react";
import { Logo } from "./Logo";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SignInForm } from "@/components/auth/SignInForm";
import logoAsset from '@/assets/images/logo.png';


export function AppHeader() {
  const { user, isAuthenticated, logout } = useAuthMock();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

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

  const headerClasses = cn(
    "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
    isScrolled ? "bg-card shadow-md border-b border-border" : "bg-transparent"
  );
  
  const findTutorButtonClass = cn(
    "transform transition-transform hover:scale-105 active:scale-95 text-[15px] font-semibold py-2.5 px-5 rounded-lg border-2",
    "border-primary text-primary hover:bg-primary/10",
     isScrolled || pathname !== "/" ? "border-primary text-primary hover:bg-primary/10" : "border-card text-card hover:bg-card/80"
  );
  
  const signInButtonClass = cn(
    "transform transition-transform hover:scale-105 active:scale-95 text-[15px] font-semibold py-2.5 px-5 rounded-lg",
     "bg-primary hover:bg-primary/90 text-primary-foreground" 
  );

  const navButtonClasses = cn(
    "transform transition-transform hover:scale-105 active:scale-95 text-[15px] font-semibold py-2.5 px-4 rounded-lg",
    isScrolled ? "text-foreground hover:bg-muted/50" : "text-card-foreground hover:bg-white/10"
  );


  const mobileLinkClass = "flex items-center gap-3 p-3 rounded-md hover:bg-accent text-base font-medium transition-colors";
  const mobileButtonClass = cn(mobileLinkClass, "w-full justify-start");

  const logoHref = isAuthenticated && user?.role === 'tutor' ? "/dashboard" : "/";


  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-[var(--header-height)] items-center justify-between px-4 md:px-6">
        <Link href={logoHref} onClick={() => setMobileMenuOpen(false)}>
          <Logo className="h-[var(--logo-height)] w-auto"/>
        </Link>
        
        <nav className="hidden items-center space-x-1 md:flex">
           {isAuthenticated && user && user.role === 'tutor' && (
             <>
               <Button
                 asChild
                 className={cn(
                   "text-xs font-semibold py-1.5 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 flex items-center gap-1.5 mx-1", // Added mx-1 for spacing and font-semibold
                   pathname === "/dashboard"
                     ? "bg-primary text-primary-foreground shadow-sm border-primary" 
                     : "bg-card text-primary border border-primary hover:bg-primary/10" 
                 )}
               >
                 <Link href="/dashboard">
                   <UserCircle className="h-4 w-4" /> My Profile
                 </Link>
               </Button>
               <Button
                 asChild
                 className={cn(
                   "text-xs font-semibold py-1.5 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 flex items-center gap-1.5 mx-1", // Added mx-1 for spacing and font-semibold
                   pathname === "/dashboard/enquiries"
                     ? "bg-primary text-primary-foreground shadow-sm border-primary" 
                     : "bg-card text-primary border border-primary hover:bg-primary/10" 
                 )}
               >
                 <Link href="/dashboard/enquiries">
                   <ClipboardList className="h-4 w-4" /> My Enquiries
                 </Link>
               </Button>
               {/* My Classes button removed as per previous request to remove it from tutor dashboard */}
             </>
           )}
           {isAuthenticated && user && user.role !== 'tutor' && ( 
             <Button asChild variant="ghost" className={navButtonClasses}>
                <Link href="/dashboard">
                    <HomeIcon className="mr-2 h-4 w-4" /> Dashboard
                </Link>
            </Button>
           )}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
             {!(isAuthenticated && user?.role === 'tutor') && (
                <Button asChild variant="outline" className={findTutorButtonClass}>
                  <Link href="/search-tuitions">Find Tutors</Link>
                </Button>
              )}
            {!isAuthenticated && (
              <>
                <Dialog open={signInModalOpen} onOpenChange={setSignInModalOpen}>
                  <ShadDialogTrigger asChild>
                    <Button className={signInButtonClass}>Sign In</Button>
                  </ShadDialogTrigger>
                  <DialogContent className="sm:max-w-md p-0 bg-card rounded-lg overflow-hidden">
                     <DialogHeader className="sr-only"> 
                       <DialogTitle>Sign In to Tutorzila</DialogTitle>
                     </DialogHeader>
                    <SignInForm onSuccess={() => setSignInModalOpen(false)} /> 
                  </DialogContent>
                </Dialog>
              </>
            )}
            {isAuthenticated && user && (
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
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(isScrolled ? "text-foreground" : "text-card-foreground hover:bg-white/10 active:bg-white/20", "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2")}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                  <SheetTitleComponent> 
                     <Link href={logoHref} onClick={() => setMobileMenuOpen(false)}>
                        <Logo className="h-[calc(var(--logo-height)_/_1.5)] w-auto" /> 
                     </Link>
                  </SheetTitleComponent>
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

                      {user.role === 'tutor' && (
                        <>
                          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                            <UserCircle className="h-5 w-5 text-primary" /> My Profile
                          </Link>
                          <Link href="/dashboard/enquiries" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                            <ClipboardList className="h-5 w-5 text-primary" /> My Enquiries
                          </Link>
                          {/* My Classes link removed from mobile menu as well */}
                        </>
                      )}
                      {user.role === 'parent' && (
                        <>
                          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                            <LayoutDashboard className="h-5 w-5 text-primary" /> Dashboard
                          </Link>
                          <Link href="/dashboard/post-requirement" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                            <Edit className="h-5 w-5 text-primary" /> Post Requirement
                          </Link>
                           <Button asChild variant="ghost" className={mobileButtonClass} onClick={() => {setMobileMenuOpen(false)}}>
                            <Link href="/search-tuitions">
                              <Search className="h-5 w-5 text-primary" /> Find Tutors
                            </Link>
                          </Button>
                        </>
                      )}
                       {user.role === 'admin' && (
                        <>
                          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                            <LayoutDashboard className="h-5 w-5 text-primary" /> Dashboard
                          </Link>
                           <Button asChild variant="ghost" className={mobileButtonClass} onClick={() => {setMobileMenuOpen(false)}}>
                            <Link href="/search-tuitions">
                              <Search className="h-5 w-5 text-primary" /> Find Tutors
                            </Link>
                          </Button>
                        </>
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
                      <Button asChild variant="ghost" className={mobileButtonClass} onClick={() => {setMobileMenuOpen(false)}}>
                        <Link href="/search-tuitions">
                          <Search className="h-5 w-5 text-primary" /> Find Tutors
                         </Link>
                       </Button>
                      
                      <Dialog open={signInModalOpen} onOpenChange={(isOpen) => {
                        setSignInModalOpen(isOpen);
                        if(isOpen) setMobileMenuOpen(false); 
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

                       <Button asChild variant="ghost" className={mobileButtonClass} onClick={() => setMobileMenuOpen(false)}>
                         <Link href="/sign-up">
                          <UserPlus className="h-5 w-5 text-primary" /> Sign Up
                         </Link>
                       </Button>
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

