
import { TuitionRequirementForm } from "@/components/tuitions/TuitionRequirementForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Tuition Requirement - Tutorzila",
};

export default function PostRequirementPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      <TuitionRequirementForm />
    </div>
  );
}
