
import { TutorProfileSearch } from "@/components/tutors/TutorProfileSearch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Tutors - Tutorzila",
};

export default function SearchTutorsPage() {
  return (
    <div className="container mx-auto py-8 px-6 sm:px-8 md:px-10 lg:px-12 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      <TutorProfileSearch />
    </div>
  );
}

