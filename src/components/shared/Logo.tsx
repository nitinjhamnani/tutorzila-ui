
import Link from "next/link";
// To use your custom logo, uncomment the Image import and the Image component below.
import Image from 'next/image';
import logoAsset from '@/assets/images/logo.png'; // Make sure this path is correct

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 text-2xl font-bold text-primary ${className}`}>
      {/*
        If you are seeing an error like "unable to decode image data" or "Invalid PNG signature",
        it means the file at 'src/assets/images/logo.png' is likely corrupted or not a valid PNG.
        Please replace 'src/assets/images/logo.png' with a valid PNG image file.
      */}
      <Image
        src={logoAsset}
        alt="Tutorzila Logo"
        width={190} // Increased width to maintain aspect ratio
        height={45} // Increased height
        className="h-11 w-auto sm:h-12" // Adjusted height classes
        priority
      />
      {/* Fallback to icon and text logo if the image is problematic: */}
      {/*
      <BookHeart className="h-8 w-8 sm:h-9 sm:w-9 text-primary" />
      <span className="hidden sm:inline">Tutorzila</span>
      */}
    </Link>
  );
}

