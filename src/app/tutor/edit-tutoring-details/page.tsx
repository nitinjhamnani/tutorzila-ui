
"use client";
import { EditTutoringDetailsForm } from "@/components/tutor/EditTutoringDetailsForm";
import { BreadcrumbHeader } from "@/components/shared/BreadcrumbHeader";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect } from "react";
import { useGlobalLoader } from "@/hooks/use-global-loader";

const fetchTutorDashboardData = async (token: string | null) => {
  if (!token) throw new Error("No authentication token found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(`${apiBaseUrl}/api/tutor/dashboard`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "accept": "*/*",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tutor dashboard data.");
  }
  return response.json();
};


export default function TutorEditTutoringDetailsPage() {
  const { token } = useAuthMock();
  const { hideLoader } = useGlobalLoader();

  useEffect(() => {
    hideLoader();
  }, [hideLoader]);
  
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['tutorDashboard', token],
    queryFn: () => fetchTutorDashboardData(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });

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
          {isLoading ? (
            <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl border bg-card">
              <CardHeader className="p-6 border-b">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ) : error ? (
            <p className="text-destructive text-center">Failed to load tutoring details. Please try again later.</p>
          ) : (
            <EditTutoringDetailsForm initialData={dashboardData} />
          )}
        </div>
      </div>
    </main>
  );
}
