// This file has been moved to src/app/tutor/enquiries/[id]/page.tsx
// It can be safely deleted after confirming the new path works.
"use client";
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function OldTutorEnquiryDetailRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  useEffect(() => {
    if (id) {
      router.replace(`/tutor/enquiries/${id}`);
    } else {
      router.replace('/tutor/enquiries');
    }
  }, [router, id]);
  return <div className="flex h-screen items-center justify-center text-muted-foreground">Redirecting to enquiry details...</div>;
}
