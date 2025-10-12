
"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Presentation, XCircle } from "lucide-react";
import type { EnquiryDemo } from "@/types";
import { AdminDemoCard } from "@/components/admin/AdminDemoCard";

const fetchAdminDemos = async (token: string | null): Promise<EnquiryDemo[]> => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/demo/all/SCHEDULED`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    if (response.status === 504) {
      throw new Error("The server took too long to respond (504 Gateway Timeout). Please try again later.");
    }
    throw new Error("Failed to fetch demos. The server returned an error.");
  }
  
  const data = await response.json();
  return data;
};


export default function AdminAllDemosPage() {
    const { token } = useAuthMock();
    const { hideLoader, showLoader } = useGlobalLoader();

    const { data: allDemos = [], isLoading, error } = useQuery({
        queryKey: ['adminAllDemos', token],
        queryFn: () => fetchAdminDemos(token),
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    
    useEffect(() => {
        if(isLoading) {
          showLoader("Fetching demos...");
        } else {
          hideLoader();
        }
    }, [isLoading, showLoader, hideLoader]);

    const renderDemoList = () => {
        if (isLoading) {
            return null; // Global loader is shown
        }

        if (error) {
            return (
                <Card className="text-center py-12 bg-destructive/10 border-destructive/20 rounded-lg shadow-sm col-span-full">
                    <CardContent className="flex flex-col items-center">
                        <XCircle className="w-16 h-16 text-destructive mx-auto mb-5" />
                        <p className="text-xl font-semibold text-destructive mb-1.5">Error Fetching Demos</p>
                        <p className="text-sm text-destructive/80 max-w-sm mx-auto">{(error as Error).message}</p>
                    </CardContent>
                </Card>
            );
        }

        if (allDemos.length === 0) {
            return (
                <Card className="text-center py-12 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out col-span-full">
                <CardContent className="flex flex-col items-center">
                    <Presentation className="w-16 h-16 text-primary/30 mx-auto mb-5" />
                    <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Demos Found</p>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    There are currently no demo sessions scheduled on the platform.
                    </p>
                </CardContent>
                </Card>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {allDemos.map((demo) => (
                    <AdminDemoCard key={demo.demoId} demo={demo} />
                ))}
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
                <CardHeader className="p-0 flex flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-grow min-w-0">
                        <CardTitle className="text-xl font-semibold text-primary flex items-center">
                            <Presentation className="w-5 h-5 mr-2.5" />
                            All Demos
                        </CardTitle>
                        <CardDescription className="text-sm text-foreground/70 mt-1">
                            A comprehensive list of all demo sessions across the platform.
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
            {renderDemoList()}
        </div>
    );
}
