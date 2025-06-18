"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Users, Sparkles, CalendarDays, LayoutDashboard, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Logo from '@/components/shared/logo';
import AuthButtons from '@/components/shared/auth-buttons';

const navItems = [
  { href: '/tutors', label: 'Tutors', icon: Users },
  { href: '/match', label: 'AI Match', icon: Sparkles },
  { href: '/schedule', label: 'My Schedule', icon: CalendarDays },
  { href: '/dashboard/tutor', label: 'Tutor Dashboard', icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => (
    <Link href={href} legacyBehavior passHref>
      <a
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          pathname === href
            ? "bg-primary/10 text-primary"
            : "text-foreground/70 hover:bg-accent/50 hover:text-accent-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </a>
    </Link>
  );
  
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" legacyBehavior passHref>
            <a className="flex items-center gap-2">
              <Logo />
            </a>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          <div className="hidden md:block">
            <AuthButtons />
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-card p-4">
                <div className="flex flex-col space-y-4">
                  <Link href="/" legacyBehavior passHref>
                    <a className="flex items-center gap-2 mb-4">
                     <Logo />
                    </a>
                  </Link>
                  {navItems.map((item) => (
                     <NavLink key={item.href} {...item} />
                  ))}
                   <div className="pt-4 border-t">
                     <AuthButtons vertical />
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
