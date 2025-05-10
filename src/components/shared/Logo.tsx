
import Link from "next/link";
import Image from 'next/image';
import logoAsset from '@/assets/images/logo.png'; 
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn(`flex items-center space-x-2 text-2xl font-bold`, className)}>
      {/*
        The logo.png is referenced here. Ensure it is a valid PNG file.
        If you are seeing an error like "unable to decode image data" or "Invalid PNG signature",
        it means the file at 'src/assets/images/logo.png' is likely corrupted or not a valid PNG.
        Please replace 'src/assets/images/logo.png' with a valid PNG image file.
      */}
      <Image
        src={logoAsset}
        alt="Tutorzila Logo"
        width={405} 
        height={96} 
        className="h-24 w-auto" // h-24 is 6rem
        priority
      />
    </Link>
  );
}
