"use client";
// This file has been moved to src/app/tutor/edit-personal-details/page.tsx
// It can be safely deleted after confirming the new path works.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OldTutorEditPersonalDetailsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/tutor/edit-personal-details');
  }, [router]);
  return <div className="flex h-screen items-center justify-center text-muted-foreground">Redirecting to edit personal details...</div>;
}
