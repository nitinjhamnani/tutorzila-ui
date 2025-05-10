
import Image from 'next/image';
import logoAsset from '@/assets/images/logo.png'; 
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    // The Image component is now the root of Logo.
    // The Link component will be applied by the parent where navigation is needed.
    <Image
      src={logoAsset}
      alt="Tutorzila Logo"
      width={405} // Intrinsic width of the logo image
      height={96} // Intrinsic height of the logo image
      className={cn(
        "h-24 w-auto", // Default: 6rem height, auto width to maintain aspect ratio
        className // Allows overriding or extending styles from parent
      )}
      priority
    />
  );
}
