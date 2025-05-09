
import Link from "next/link";
import { BookHeart } from "lucide-react"; // Using BookHeart as a thematic icon

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 text-2xl font-bold text-primary ${className}`}>
      <BookHeart className="h-8 w-8" />
      <span>Tutorzila</span>
    </Link>
  );
}
