
import { EditPersonalDetailsForm } from "@/components/dashboard/forms/EditPersonalDetailsForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Personal Details - Tutorzila",
};

export default function EditPersonalDetailsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      <EditPersonalDetailsForm />
    </div>
  );
}
