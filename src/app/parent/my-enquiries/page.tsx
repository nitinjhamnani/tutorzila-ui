
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ParentEnquiryCard } from "@/components/parent/ParentEnquiryCard";
import type { User, TuitionRequirement, LocationDetails } from "@/types";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ListChecks,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  Eye,
  Trash2,
  Edit3,
  Users as UsersIcon,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { CreateEnquiryFormModal, type CreateEnquiryFormValues } from "@/components/parent/modals/CreateEnquiryFormModal";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type EnquiryStatusCategory = "All" | "Open" | "Matched" | "Closed";

const enquiryStatusCategories: {
  label: string;
  value: EnquiryStatusCategory;
  icon: React.ElementType;
}[] = [
  { label: "All Enquiries", value: "All", icon: ListChecks },
  { label: "Open", value: "Open", icon: Eye },
  { label: "Matched", value: "Matched", icon: UsersIcon },
  { label: "Closed", value: "Closed", icon: Archive },
];

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
    scheduleDetails: item.initial || "Details not provided by API",
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
    assignedTutors: item.assignedTutors,
  }));
};

const createEnquiry = async ({ token, formData }: { token: string | null, formData: CreateEnquiryFormValues }) => {
  if (!token) throw new Error("Authentication token is required.");
  
  const locationDetails = formData.location;
  const requestBody = {
    studentName: formData.studentName,
    subjects: formData.subject,
    grade: formData.gradeLevel,
    board: formData.board,
    addressName: locationDetails?.name || locationDetails?.address || "",
    address: locationDetails?.address || "",
    city: locationDetails?.city || "",
    state: locationDetails?.state || "",
    country: locationDetails?.country || "",
    area: locationDetails?.area || "",
    pincode: locationDetails?.pincode || "",
    googleMapsLink: locationDetails?.googleMapsUrl || "",
    availabilityDays: formData.preferredDays,
    availabilityTime: formData.preferredTimeSlots,
    online: formData.teachingMode.includes("Online"),
    offline: formData.teachingMode.includes("Offline (In-person)"),
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/enquiry/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Failed to create enquiry.");
  }
  return response.json();
};

export default function ParentMyEnquiriesPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeFilterCategory, setActiveFilterCategory] = useState<EnquiryStatusCategory>("Open");
  const [isCreateEnquiryModalOpen, setIsCreateEnquiryModalOpen] = useState(false);

  const { data: allRequirements = [], isLoading: isLoadingEnquiries, error: enquiriesError } = useQuery({
    queryKey: ['parentEnquiries', token],
    queryFn: () => fetchParentEnquiries(token),
    enabled: !!token && !!user && user.role === 'parent',
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const createEnquiryMutation = useMutation({
    mutationFn: (formData: CreateEnquiryFormValues) => createEnquiry({ token, formData }),
    onSuccess: () => {
      toast({ title: "Requirement Submitted!", description: "Your tuition requirement has been successfully posted." });
      queryClient.invalidateQueries({ queryKey: ['parentEnquiries'] });
      setIsCreateEnquiryModalOpen(false);
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Submission Failed", description: error.message });
    },
  });

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated || user?.role !== "parent") {
        router.replace("/");
      }
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);
  
  const handleSuccess = () => {
    setIsCreateEnquiryModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['parentEnquiries'] });
  };


  const categoryCounts = useMemo(() => {
    const counts = {
      All: allRequirements.length,
      Open: allRequirements.filter((req) => req.status === "open").length,
      Matched: allRequirements.filter((req) => req.status === "matched").length,
      Closed: allRequirements.filter((req) => req.status === "closed").length,
    };
    return counts;
  }, [allRequirements]);

  const filteredRequirements = useMemo(() => {
    if (activeFilterCategory === "All") {
      return allRequirements;
    }
    return allRequirements.filter(
      (req) => req.status.toLowerCase() === activeFilterCategory.toLowerCase()
    );
  }, [allRequirements, activeFilterCategory]);

  const handleReopen = (id: string) => {
    router.push(`/parent/my-enquiries/${id}`); 
  };
  
  const selectedCategoryData = enquiryStatusCategories.find(cat => cat.value === activeFilterCategory);

  if (isCheckingAuth || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading My Enquiries...
      </div>
    );
  }

  const isDataLoading = isLoadingEnquiries || createEnquiryMutation.isPending;

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
          <CreateEnquiryFormModal 
            onSuccess={handleSuccess} 
            onFormSubmit={createEnquiryMutation.mutate}
            isSubmitting={createEnquiryMutation.isPending}
          />
        </Dialog>


        <div className="flex justify-end mb-4 sm:mb-6">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="default"
                size="sm" 
                className={cn(
                    "py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90",
                    "text-xs sm:text-sm rounded-[5px]"
                )}
                >
                <span className="text-primary-foreground">
                    {selectedCategoryData?.label || "Filter"} ({selectedCategoryData ? categoryCounts[selectedCategoryData.value] : 'N/A'})
                </span>
                <ChevronDown className="w-4 h-4 opacity-70 text-primary-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {enquiryStatusCategories.map((category) => (
                <DropdownMenuItem
                    key={category.value}
                    onClick={() => setActiveFilterCategory(category.value)}
                    className={cn(
                    "text-sm",
                    activeFilterCategory === category.value && "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary hover:text-primary-foreground focus:text-primary-foreground"
                    )}
                >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.label} ({categoryCounts[category.value]})
                </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          {isDataLoading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : enquiriesError ? (
            <Card className="text-center py-12 bg-destructive/10 border-destructive/20 rounded-lg shadow-sm">
                <CardContent className="flex flex-col items-center">
                    <XCircle className="w-16 h-16 text-destructive mx-auto mb-5" />
                    <p className="text-xl font-semibold text-destructive mb-1.5">Error Fetching Enquiries</p>
                    <p className="text-sm text-destructive/80 max-w-sm mx-auto">Could not load your enquiries. Please try again later.</p>
                </CardContent>
            </Card>
          ) : filteredRequirements.length > 0 ? (
            filteredRequirements.map((req) => (
              <ParentEnquiryCard
                key={req.id}
                requirement={req}
                onEdit={() => router.push(`/parent/my-enquiries/${req.id}`)}
                onReopen={() => handleReopen(req.id)}
              />
            ))
          ) : (
            <Card className="text-center py-12 bg-card border rounded-lg shadow-sm">
              <CardContent className="flex flex-col items-center">
                <ListChecks className="w-16 h-16 text-primary/30 mx-auto mb-5" />
                <p className="text-xl font-semibold text-foreground/70 mb-1.5">
                  No Enquiries Found
                </p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  There are no enquiries matching "{activeFilterCategory}". Try a different filter or post a new requirement.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
