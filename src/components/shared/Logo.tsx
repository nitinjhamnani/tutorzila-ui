
import Link from "next/link";
import { BookHeart } from "lucide-react"; // Using an icon as a placeholder
// To use your custom logo, uncomment the Image import and the Image component below.
// import Image from 'next/image';
// import logoAsset from '@/assets/images/logo.png'; // Make sure this path is correct

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 text-2xl font-bold text-primary ${className}`}>
      {/* 
        IMPORTANT: The custom logo.png file at 'src/assets/images/logo.png' 
        is currently causing an error ("unable to decode image data" / "Invalid PNG signature"). 
        This means the file is likely corrupted or not a valid PNG.

        Please replace 'src/assets/images/logo.png' with a valid PNG image file.

        Once you have a valid logo.png, you can use it by:
        1. Uncommenting the 'Image' import at the top of this file:
           import Image from 'next/image';
        2. Uncommenting the 'logoAsset' import at the top of this file:
           import logoAsset from '@/assets/images/logo.png';
        3. Uncommenting the <Image /> component below and commenting out or removing the <BookHeart /> icon and <span>:
      */}
      {/*
      <Image
        src={logoAsset} 
        alt="Tutorzila Logo"
        width={150} // Adjust width as needed for your logo
        height={35} // Adjust height as needed for your logo
        className="h-8 w-auto sm:h-9" // Adjust classes as needed
        priority 
      />
      */}
      {/* Fallback to icon and text logo until the image issue is resolved: */}
      <BookHeart className="h-8 w-8 sm:h-9 sm:w-9 text-primary" />
      <span className="hidden sm:inline">Tutorzila</span>
    </Link>
  );
}

