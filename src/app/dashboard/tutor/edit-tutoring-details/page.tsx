
import { EditTutoringDetailsForm } from "@/components/dashboard/forms/EditTutoringDetailsForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Tutoring Details - Tutorzila",
};

export default function EditTutoringDetailsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      <EditTutoringDetailsForm />
    </div>
  );
}
