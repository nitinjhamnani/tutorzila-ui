
"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Presentation, XCircle, Clock, CheckCircle, RadioTower, Users as UsersIcon, ListFilter, ChevronDown, CheckSquare, Eye, Edit, Ban, Settings, Trash2 } from "lucide-react";
import type { EnquiryDemo } from "@/types";
import { format, parseISO } from 'date-fns';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

const demoStatusCategories = [
  { value: "SCHEDULED", label: "Scheduled", icon: Clock },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle },
  { value: "REQUESTED", label: "Requested", icon: CheckSquare },
] as const;

type DemoStatusCategory = typeof demoStatusCategories[number]['value'];


const fetchAdminDemos = async (token: string | null, status: DemoStatusCategory): Promise<EnquiryDemo[]> => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/demo/all/${status}`, {
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

const cancelDemoApi = async ({ demoId, reason, token }: { demoId: string; reason: string; token: string | null }) => {
  if (!token) throw new Error("Authentication token not found.");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/demo/cancel`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'TZ-DMO-ID': demoId,
      'accept': '*/*',
    },
    body: JSON.stringify({ message: reason }),
  });

  if (!response.ok) {
    throw new Error("Failed to cancel the demo session.");
  }
  
  return true; 
};

const removeDemoApi = async ({ demoId, token }: { demoId: string; token: string | null; }) => {
    if (!token) throw new Error("Authentication token not found.");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/api/demo/remove`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'TZ-DMO-ID': demoId,
            'accept': '*/*',
        },
    });

    if (!response.ok) {
        throw new Error("Failed to remove the demo.");
    }
    return true;
};


const StatusIcon = ({ status }: { status: string }) => {
    const iconProps = "w-3 h-3 mr-1";
    switch (status) {
      case "SCHEDULED": return <Clock className={iconProps} />;
      case "COMPLETED": return <CheckCircle className={iconProps} />;
      case "CANCELLED": return <XCircle className={iconProps} />;
      case "REQUESTED": return <CheckSquare className={iconProps} />;
      default: return null;
    }
};


export default function AdminAllDemosPage() {
    const { token } = useAuthMock();
    const { hideLoader, showLoader } = useGlobalLoader();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeFilterCategory, setActiveFilterCategory] = useState<DemoStatusCategory>("SCHEDULED");
    const [demoToCancel, setDemoToCancel] = useState<EnquiryDemo | null>(null);
    const [demoToRemove, setDemoToRemove] = useState<EnquiryDemo | null>(null);


    const { data: allDemos = [], isLoading, error } = useQuery({
        queryKey: ['adminAllDemos', token, activeFilterCategory],
        queryFn: () => fetchAdminDemos(token, activeFilterCategory),
        enabled: !!token,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
    
    useEffect(() => {
        if(isLoading) {
          showLoader("Fetching demos...");
        } else {
          hideLoader();
        }
    }, [isLoading, showLoader, hideLoader]);

    const cancelDemoMutation = useMutation({
        mutationFn: ({ demoId, reason }: { demoId: string; reason: string; }) => cancelDemoApi({ demoId, reason, token }),
        onSuccess: () => {
        toast({ title: "Demo Cancelled", description: "The demo session has been cancelled." });
        queryClient.invalidateQueries({ queryKey: ['adminAllDemos', token, activeFilterCategory] });
        setDemoToCancel(null);
        },
        onError: (error: any) => {
        toast({ variant: "destructive", title: "Cancellation Failed", description: error.message });
        }
    });

    const removeDemoMutation = useMutation({
        mutationFn: (demoId: string) => removeDemoApi({ demoId, token }),
        onSuccess: () => {
            toast({ title: "Demo Removed", description: "The demo has been successfully removed." });
            queryClient.invalidateQueries({ queryKey: ['adminAllDemos', token, activeFilterCategory] });
        },
        onError: (error: any) => {
            toast({ variant: "destructive", title: "Removal Failed", description: error.message });
        },
        onSettled: () => {
            setDemoToRemove(null);
        }
    });

    const selectedCategoryData = useMemo(() => {
        return demoStatusCategories.find(cat => cat.value === activeFilterCategory) || demoStatusCategories[0];
    }, [activeFilterCategory]);
    
    const confirmCancelDemo = () => {
        if (!demoToCancel) return;
        cancelDemoMutation.mutate({ demoId: demoToCancel.demoId, reason: "Cancelled by Admin" });
    };

    const confirmRemoveDemo = () => {
        if (demoToRemove) {
            removeDemoMutation.mutate(demoToRemove.demoId);
        }
    };


    const renderDemoTable = () => {
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
                      There are currently no demos matching "{selectedCategoryData.label}".
                    </p>
                </CardContent>
                </Card>
            );
        }

        return (
            <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
                <CardContent className="p-0">
                    <TooltipProvider>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Tutor</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {allDemos.map((demo) => (
                            <TableRow key={demo.demoId}>
                                <TableCell>
                                    <Badge variant="default" className={cn("text-[10px] px-2 py-0.5", "bg-primary text-primary-foreground")}>
                                        <StatusIcon status={demo.demoStatus} />
                                        {demo.demoStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium text-foreground">{demo.demoDetails.tutorName}</TableCell>
                                <TableCell>{demo.demoDetails.studentName}</TableCell>
                                <TableCell>{demo.demoDetails.subjects}</TableCell>
                                <TableCell className="text-xs">
                                    <div>{format(parseISO(demo.demoDetails.date), "MMM d, yyyy")}</div>
                                    <div className="text-muted-foreground">{demo.demoDetails.startTime} ({demo.demoDetails.duration} mins)</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                    {demo.demoDetails.online && (
                                        <Tooltip>
                                            <TooltipTrigger asChild><div className="p-1.5 bg-primary/10 rounded-full"><RadioTower className="w-4 h-4 text-primary" /></div></TooltipTrigger>
                                            <TooltipContent><p>Online</p></TooltipContent>
                                        </Tooltip>
                                    )}
                                    {demo.demoDetails.offline && (
                                        <Tooltip>
                                            <TooltipTrigger asChild><div className="p-1.5 bg-primary/10 rounded-full"><UsersIcon className="w-4 h-4 text-primary" /></div></TooltipTrigger>
                                            <TooltipContent><p>Offline</p></TooltipContent>
                                        </Tooltip>
                                    )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1.5">
                                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                                      <Link href={`/admin/manage-enquiry/${demo.demoDetails.enquiryId}`}>
                                        <Settings className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                    {demo.demoStatus === 'SCHEDULED' && (
                                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setDemoToCancel(demo)}>
                                        <XCircle className="w-4 h-4" />
                                      </Button>
                                    )}
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setDemoToRemove(demo)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TooltipProvider>
                </CardContent>
            </Card>
        )
    };

    return (
      <>
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
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button
                            variant="default"
                            size="sm"
                            className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <span>
                            {selectedCategoryData.label} ({isLoading ? '...' : allDemos.length})
                            </span>
                            <ChevronDown className="w-4 h-4 opacity-70" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[220px]">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {demoStatusCategories.map((category) => (
                            <DropdownMenuItem
                            key={category.value}
                            onClick={() => setActiveFilterCategory(category.value)}
                            className={cn(
                                "text-sm",
                                activeFilterCategory === category.value && "bg-primary text-primary-foreground"
                            )}
                            >
                            <category.icon className="mr-2 h-4 w-4" />
                            {category.label}
                            </DropdownMenuItem>
                        ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
            </Card>
            {renderDemoTable()}
        </div>
        <AlertDialog open={!!demoToCancel} onOpenChange={(open) => !open && setDemoToCancel(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will cancel the demo session scheduled with {demoToCancel?.demoDetails.tutorName}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Back</AlertDialogCancel>
              <AlertDialogAction onClick={confirmCancelDemo} disabled={cancelDemoMutation.isPending}>
                {cancelDemoMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                Confirm Cancellation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!demoToRemove} onOpenChange={(open) => !open && setDemoToRemove(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove Demo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to permanently remove this demo session? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDemoToRemove(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmRemoveDemo} disabled={removeDemoMutation.isPending} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                        {removeDemoMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Remove
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </>
    );
}
