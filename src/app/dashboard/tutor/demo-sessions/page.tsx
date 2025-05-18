// This file has been moved to src/app/tutor/demo-sessions/page.tsx
// It can be safely deleted after confirming the new path works.
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OldTutorDemoSessionsPageRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/tutor/demo-sessions');
  }, [router]);
  return <div className="flex h-screen items-center justify-center text-muted-foreground">Redirecting to tutor demo sessions...</div>;
}
