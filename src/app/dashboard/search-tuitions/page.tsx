
import { TutorProfileSearch } from "@/components/tutors/TutorProfileSearch"; // Changed import
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Tutors - Tutorzila", // Changed title
};

export default function SearchTutorsPage() { // Renamed function for clarity
  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      <TutorProfileSearch /> {/* Changed component */}
    </div>
  );
}
