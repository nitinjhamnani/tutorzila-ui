
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { ParentEnquiryCard } from "@/components/parent/ParentEnquiryCard";
import type { User, TuitionRequirement, LocationDetails } from "@/types";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ListChecks,
  PlusCircle,
  Loader2,
  XCircle,
  ChevronDown,
  CheckCircle,
  Archive,
} from "lucide-react";
import { ParentEnquiryModal } from "@/components/parent/modals/ParentEnquiryModal";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fetchParentEnquiries = async (token: string | null): Promise<TuitionRequirement[]> => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/parent/enquiries`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch enquiries.");
  }
  
  const data = await response.json();
  
  return data.map((item: any) => ({
    id: item.enquiryId,
    parentId: "", 
    parentName: "", 
    subject: typeof item.subjects === 'string' ? item.subjects.split(',').map((s: string) => s.trim()) : [],
    gradeLevel: item.grade,
    scheduleDetails: "Details not provided by API",
    location: {
      address: [item.area, item.city, item.country].filter(Boolean).join(', '),
      area: item.area,
      city: item.city,
      country: item.country,
    },
    status: item.status?.toLowerCase() || 'open', 
    postedAt: item.createdOn || new Date().toISOString(),
    board: item.board,
    teachingMode: [
      ...(item.online ? ["Online"] : []),
      ...(item.offline ? ["Offline (In-person)"] : []),
    ],
    applicantsCount: item.assignedTutors,
  }));
};

const reopenEnquiryApi = async ({ enquiryId, token }: { enquiryId: string; token: string | null; }) => {
  if (!token) throw new Error("Authentication token is required.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/manage/enquiry/reopen`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'TZ-ENQ-ID': enquiryId,
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify({ message: "Reopened by Parent" }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to reopen enquiry." }));
    throw new Error(errorData.message);
  }
  return response.json();
};


type EnquiryStatusCategory = "Open" | "Accepted" | "Closed";

const statusIcons: Record<EnquiryStatusCategory, React.ElementType> = {
  Open: ListChecks,
  Accepted: CheckCircle,
  Closed: Archive,
};

export default function ParentMyEnquiriesPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { hideLoader, showLoader } = useGlobalLoader();

  const [isCreateEnquiryModalOpen, setIsCreateEnquiryModalOpen] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState<EnquiryStatusCategory>("Open");

  const { data: allRequirements = [], isLoading: isLoadingEnquiries, error: enquiriesError } = useQuery({
    queryKey: ['parentEnquiries', token],
    queryFn: () => fetchParentEnquiries(token),
    enabled: !!token && !!user && user.role === 'parent',
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const reopenMutation = useMutation({
    mutationFn: (enquiryId: string) => reopenEnquiryApi({ enquiryId, token }),
    onSuccess: (updatedData) => {
        toast({ title: "Enquiry Reopened", description: "Your requirement is now active again." });
        queryClient.invalidateQueries({ queryKey: ['parentEnquiries', token] });
        showLoader("Loading enquiry details...");
        router.push(`/parent/my-enquiries/${updatedData.enquiryResponse.enquirySummary.enquiryId}`);
    },
    onError: (error: Error) => {
        toast({ variant: "destructive", title: "Failed to Reopen", description: error.message });
    }
  });

  useEffect(() => {
    if (isLoadingEnquiries) {
      showLoader("Fetching your enquiries...");
    } else {
      hideLoader();
    }
  }, [isLoadingEnquiries, showLoader, hideLoader]);

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || user?.role !== "parent")) {
      router.replace("/");
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  const handleSuccess = () => {
    setIsCreateEnquiryModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['parentEnquiries'] });
    setActiveFilterCategory("Open"); // Switch to open to see the new enquiry
  };

  const handleReopen = (id: string) => {
    reopenMutation.mutate(id);
  };
  
  const filteredRequirements = useMemo(() => {
    switch (activeFilterCategory) {
      case "Open":
        return allRequirements.filter(r => r.status === "open" || r.status === "reopened");
      case "Accepted":
        return allRequirements.filter(r => r.status === "accepted" || r.status === "matched");
      case "Closed":
        return allRequirements.filter(r => r.status === "closed");
      default:
        return allRequirements;
    }
  }, [allRequirements, activeFilterCategory]);

  const categoryCounts = useMemo(() => ({
    Open: allRequirements.filter(r => r.status === "open" || r.status === "reopened").length,
    Accepted: allRequirements.filter(r => r.status === "accepted" || r.status === "matched").length,
    Closed: allRequirements.filter(r => r.status === "closed").length,
  }), [allRequirements]);

  if (isCheckingAuth || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading My Enquiries...
      </div>
    );
  }

  const isDataLoading = isLoadingEnquiries;

  const renderEnquiryList = () => {
    if (isDataLoading) return null;

    if (enquiriesError) {
      return (
        <Card className="text-center py-12 bg-destructive/10 border-destructive/20 rounded-lg shadow-sm">
            <CardContent className="flex flex-col items-center">
                <XCircle className="w-16 h-16 text-destructive mx-auto mb-5" />
                <p className="text-xl font-semibold text-destructive mb-1.5">Error Fetching Enquiries</p>
                <p className="text-sm text-destructive/80 max-w-sm mx-auto">Could not load your enquiries. Please try again later.</p>
            </CardContent>
        </Card>
      );
    }
    
    if (filteredRequirements.length === 0) {
      return (
        <Card className="text-center py-12 bg-card border rounded-lg shadow-sm">
          <CardContent className="flex flex-col items-center">
            <ListChecks className="w-16 h-16 text-primary/30 mx-auto mb-5" />
            <p className="text-xl font-semibold text-foreground/70 mb-1.5">
              No {activeFilterCategory} Enquiries Found
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You do not have any enquiries in this category.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {filteredRequirements.map((req) => (
          <ParentEnquiryCard
            key={req.id}
            requirement={req}
            onEdit={() => router.push(`/parent/my-enquiries/${req.id}`)}
            onReopen={() => handleReopen(req.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Dialog open={isCreateEnquiryModalOpen} onOpenChange={setIsCreateEnquiryModalOpen}>
          <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
            <CardHeader className="p-0 mb-0 flex flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-grow min-w-0">
                <CardTitle className="text-xl font-semibold text-primary flex items-center">
                  <ListChecks className="w-5 h-5 mr-2.5" />
                  My Enquiries
                </CardTitle>
                <CardDescription className="text-sm text-foreground/70 mt-1">
                  Manage your posted tuition requirements and track their status.
                </CardDescription>
              </div>
              <DialogTrigger asChild>
                  <Button
                      variant="default"
                      size="sm"
                      className={cn(
                          "text-xs sm:text-sm py-2.5 md:px-3 px-2 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-center gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                      )}
                    >
                      <PlusCircle className="w-4 h-4 opacity-90 md:mr-1.5" />
                      <span className="hidden md:inline">Create Enquiry</span>
                    </Button>
                </DialogTrigger>
            </CardHeader>
          </Card>
          <DialogContent 
            className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <ParentEnquiryModal 
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>

         <div className="flex justify-end mb-4 sm:mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                    variant="default"
                    size="sm"
                    className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <span>
                        {activeFilterCategory} ({categoryCounts[activeFilterCategory]})
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(statusIcons) as EnquiryStatusCategory[]).map((category) => {
                  const Icon = statusIcons[category];
                  return (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setActiveFilterCategory(category)}
                      className={cn(
                          "text-sm",
                          activeFilterCategory === category && "bg-primary text-primary-foreground"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {category} ({categoryCounts[category]})
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>


        <div className="mt-6 grid grid-cols-1 gap-4">
          {renderEnquiryList()}
        </div>
      </div>
    </main>
  );
}
