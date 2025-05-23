
import { TutorProfileSearch } from "@/components/tutors/TutorProfileSearch";
import { FloatingPostRequirementButton } from "@/components/shared/FloatingPostRequirementButton"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Tutors - Find Your Perfect Tutor", 
};

export default function SearchTutorsPage() {
  return (
    // TutorProfileSearch now handles its own container padding.
    // pb-20 md:pb-24 remains to ensure space for the FloatingPostRequirementButton.
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out pb-20 md:pb-24">
      <TutorProfileSearch />
      <FloatingPostRequirementButton />
    </div>
  );
}

