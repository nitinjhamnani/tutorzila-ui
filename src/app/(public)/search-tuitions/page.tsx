
import { TutorProfileSearch } from "@/components/tutors/TutorProfileSearch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Tutors - Tutorzila",
};

export default function SearchTutorsPage() {
  return (
    // Added a container div with horizontal padding for consistent spacing.
    <div className="py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      <TutorProfileSearch />
    </div>
  );
}

