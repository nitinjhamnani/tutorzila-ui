
import { TutorProfileSearch } from "@/components/tutors/TutorProfileSearch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Tutors - Tutorzila",
};

export default function SearchTutorsPage() {
  // containerPadding is now handled within TutorProfileSearch or at a higher layout level
  // No specific container padding needed here as TutorProfileSearch will manage its internal layout.
  // The overall page padding is handled by the PublicLayout.
  return (
    <div className="py-6 md:py-8 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      <TutorProfileSearch />
    </div>
  );
}
