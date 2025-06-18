import { GraduationCap } from 'lucide-react';

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSizeClass = size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-3xl";
  const iconSizeClass = size === "sm" ? "h-5 w-5" : size === "md" ? "h-6 w-6" : "h-7 w-7";

  return (
    <div className="flex items-center gap-2 text-primary">
      <GraduationCap className={iconSizeClass} />
      <span className={`${textSizeClass} font-bold`}>TutorMate</span>
    </div>
  );
}
