
import { TuitionSearch } from "@/components/tuitions/TuitionSearch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Tuitions - Tutorzila",
};

export default function SearchTuitionsPage() {
  return (
    <div>
      <TuitionSearch />
    </div>
  );
}
