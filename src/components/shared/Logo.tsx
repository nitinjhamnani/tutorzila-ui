

import Link from "next/link";
import { BookHeart } from "lucide-react"; // Using an icon as a placeholder

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 text-2xl font-bold text-primary ${className}`}>
      {/* 
        The user's logo.png at src/assets/images/logo.png is causing an error.
        Reverting to a text/icon logo temporarily.
        User needs to replace src/assets/images/logo.png with a valid PNG file.
        Once replaced, the following Image component can be used:
      
        import Image from 'next/image';
        import logoAsset from '@/assets/images/logo.png'; // Make sure this path is correct
      
        <Image
          src={logoAsset} 
          alt="Tutorzila Logo"
          width={150} 
          height={35} 
          className="h-8 w-auto sm:h-9"
          priority 
        />
      */}
      <BookHeart className="h-8 w-8 sm:h-9 sm:w-9 text-primary" />
      <span className="hidden sm:inline">Tutorzila</span>
    </Link>
  );
}

