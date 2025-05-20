"use client";
// This file has been moved to src/app/tutor/edit-tutoring-details/page.tsx
// It can be safely deleted after confirming the new path works.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OldTutorEditTutoringDetailsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/tutor/edit-tutoring-details');
  }, [router]);
  return <div className="flex h-screen items-center justify-center text-muted-foreground">Redirecting to edit tutoring details...</div>;
}
