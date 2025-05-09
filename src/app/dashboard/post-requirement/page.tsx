
import { TuitionRequirementForm } from "@/components/tuitions/TuitionRequirementForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Tuition Requirement - Tutorzila",
};

export default function PostRequirementPage() {
  return (
    <div>
      <TuitionRequirementForm />
    </div>
  );
}
