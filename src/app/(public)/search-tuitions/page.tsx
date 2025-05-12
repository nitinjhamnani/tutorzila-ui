
import { TutorProfileSearch } from "@/components/tutors/TutorProfileSearch";
import { FixedPostRequirementBanner } from "@/components/shared/FixedPostRequirementBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Tutors - Find Your Perfect Tutor", // Updated title
};

export default function SearchTutorsPage() {
  return (
    // Removed explicit padding here as TutorProfileSearch now handles its own container padding.
    // pb-28 md:pb-24 remains to account for FixedPostRequirementBanner.
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out pb-28 md:pb-24">
      <TutorProfileSearch />
      <FixedPostRequirementBanner />
    </div>
  );
}

