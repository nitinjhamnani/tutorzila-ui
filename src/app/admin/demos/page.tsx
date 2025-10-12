
"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Presentation, XCircle, Clock, CheckCircle, RadioTower, Users as UsersIcon, ListFilter, ChevronDown, CheckSquare } from "lucide-react";
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
import { Button } from "@/components/ui/button";

const demoStatusCategories = [
  { value: "SCHEDULED", label: "Scheduled", icon: Clock },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle },
  { value: "REQUESTED", label: "Requested", icon: CheckSquare },
] as const;

type DemoStatusCategory = typeof demoStatusCategories[number]['value'];


const fetchAdminDemos = async (token: string | null, status: DemoStatusCategory): Promise<EnquiryDemo[]> => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
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
    const [activeFilterCategory, setActiveFilterCategory] = useState<DemoStatusCategory>("SCHEDULED");


    const { data: allDemos = [], isLoading, error } = useQuery({
        queryKey: ['adminAllDemos', token, activeFilterCategory],
        queryFn: () => fetchAdminDemos(token, activeFilterCategory),
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

    const selectedCategoryData = useMemo(() => {
        return demoStatusCategories.find(cat => cat.value === activeFilterCategory) || demoStatusCategories[0];
    }, [activeFilterCategory]);

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
                            <TableHead>Tutor</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {allDemos.map((demo) => (
                            <TableRow key={demo.demoId}>
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
                                    <Badge variant="default" className={cn("text-[10px] px-2 py-0.5")}>
                                        <StatusIcon status={demo.demoStatus} />
                                        {demo.demoStatus}
                                    </Badge>
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
    );
}
