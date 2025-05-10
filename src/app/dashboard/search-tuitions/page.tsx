
import { TuitionSearch } from "@/components/tuitions/TuitionSearch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Tuitions - Tutorzila",
};

export default function SearchTuitionsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      <TuitionSearch />
    </div>
  );
}
