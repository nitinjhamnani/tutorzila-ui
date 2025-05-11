
import { TutorProfileSearch } from "@/components/tutors/TutorProfileSearch";
import type { Metadata } from "next";
// MOCK_TUTOR_PROFILES import is removed as it's now fetched within TutorProfileSearch or passed as prop if needed
// For this setup, TutorProfileSearch uses its own mock data source or fetches it.

export const metadata: Metadata = {
  title: "Search Tutors - Tutorzila",
};

export default function SearchTutorsPage() {
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";
  return (
    <div className={`${containerPadding} py-8 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out`}>
      <TutorProfileSearch />
    </div>
  );
}
