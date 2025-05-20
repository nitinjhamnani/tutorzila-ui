"use client";
import { EditTutoringDetailsForm } from "@/components/dashboard/forms/EditTutoringDetailsForm";
import type { Metadata } from "next";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";

// Note: Metadata is not typically used in client components in the App Router in the same way.
// export const metadata: Metadata = {
//   title: "Edit Tutoring Details - Tutorzila",
// };

export default function TutorEditTutoringDetailsPage() {
  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
         <BreadcrumbHeader
          segments={[
            { label: "Dashboard", href: "/tutor/dashboard" },
            { label: "My Account", href: "/tutor/my-account" },
            { label: "Edit Tutoring Details" },
          ]}
        />
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
          <EditTutoringDetailsForm />
        </div>
      </div>
    </main>
  );
}
