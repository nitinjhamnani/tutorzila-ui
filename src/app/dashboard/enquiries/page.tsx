// This file has been moved to src/app/tutor/enquiries/page.tsx
// It can be safely deleted after confirming the new path works.
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OldTutorEnquiriesRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/tutor/enquiries');
  }, [router]);
  return <div className="flex h-screen items-center justify-center text-muted-foreground">Redirecting to tutor enquiries...</div>;
}
