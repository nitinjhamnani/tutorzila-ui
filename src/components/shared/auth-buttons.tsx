"use client";

import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AuthButtons({ vertical = false }: { vertical?: boolean }) {
  // In a real app, this would check auth state
  const isAuthenticated = false; 

  if (isAuthenticated) {
    return (
      <Link href="/profile" passHref>
        <Button variant="outline">
          My Profile
        </Button>
      </Link>
    );
  }

  return (
    <div className={cn("flex gap-2", vertical && "flex-col items-stretch")}>
      <Link href="/auth/signin" passHref>
        <Button variant="ghost" className={cn(vertical && "w-full justify-start")}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </Link>
      <Link href="/auth/signup" passHref>
        <Button className={cn(vertical && "w-full justify-start")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
