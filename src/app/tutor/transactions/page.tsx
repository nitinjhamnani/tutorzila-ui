
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks, ArrowUpCircle, ArrowDownCircle, Coins, CheckCircle2, XCircle, ShieldAlert } from "lucide-react"; 
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import type { TutorTransaction, TutorProfile } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTutorTransactions = async (token: string | null): Promise<TutorTransaction[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/payment/list`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions.");
  }

  const data = await response.json();
  
  // Map API response to our TutorTransaction type
  return data.map((txn: any, index: number) => ({
    id: `txn-${index}-${new Date(txn.transactionDate).getTime()}`, // Generate a unique ID
    type: txn.transactionType,
    amount: txn.transactionAmount,
    status: txn.transactionStatus,
    mode: txn.transactionMode,
    date: txn.transactionDate,
    summary: `Transaction of type ${txn.transactionType}` // Generate a summary
  }));
};

export default function TutorTransactionsPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { hideLoader, showLoader } = useGlobalLoader();
  const tutorUser = user as TutorProfile | null;

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['tutorTransactions', token],
    queryFn: () => fetchTutorTransactions(token),
    enabled: !!token && !!tutorUser,
    staleTime: 0, 
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading) {
      showLoader("Fetching transactions...");
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || !tutorUser || tutorUser.role !== 'tutor')) {
      router.replace("/");
    }
  }, [isCheckingAuth, isAuthenticated, tutorUser, router]);

  const formattedTransactions = useMemo(() => {
    return transactions.map(txn => ({
      ...txn,
      formattedDate: format(new Date(txn.date), "MMM d, yyyy"),
    }));
  }, [transactions]);

  const StatusIcon = ({ status }: { status?: string }) => {
    const iconClasses = "w-3 h-3 mr-1";
    switch (status?.toLowerCase()) {
      case "completed":
      case "success": return <CheckCircle2 className={cn(iconClasses)} />;
      case "failed": return <XCircle className={cn(iconClasses)} />;
      case "pending": return <Coins className={cn(iconClasses)} />;
      default: return null;
    }
  };

  if (isCheckingAuth || !user) {
    return null;
  }

  const renderTableContent = () => {
    if (isLoading) {
      return (
         <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      )
    }

    if (error) {
      return (
        <TableBody>
            <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                    <ShieldAlert className="h-8 w-8" />
                    <span className="font-semibold">Failed to load transactions</span>
                    <span className="text-sm">{(error as Error).message}</span>
                </div>
                </TableCell>
            </TableRow>
        </TableBody>
      );
    }
    
    if (formattedTransactions.length === 0) {
       return (
        <TableBody>
            <TableRow>
                <TableCell colSpan={5}>
                    <div className="text-center py-16">
                        <ListChecks className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                        <p className="text-md font-semibold text-foreground/70 mb-2">No Transactions Found</p>
                        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        You don't have any transactions yet.
                        </p>
                    </div>
                </TableCell>
            </TableRow>
        </TableBody>
       );
    }

    return (
      <TableBody>
        {formattedTransactions.map((txn) => (
          <TableRow key={txn.id} className="hover:bg-muted/20">
            <TableCell className={cn(
              "px-4 py-3 text-xs font-semibold flex items-center",
              txn.type?.toLowerCase() === "credit" ? "text-green-600" : "text-red-600"
            )}>
              {txn.type?.toLowerCase() === "credit" ? <ArrowUpCircle className="w-3.5 h-3.5 mr-1.5"/> : <ArrowDownCircle className="w-3.5 h-3.5 mr-1.5"/>}
              {txn.type}
            </TableCell>
            <TableCell className="px-4 py-3 text-xs text-foreground">{txn.mode}</TableCell>
            <TableCell className="px-4 py-3 text-xs text-foreground text-right">
              {txn.mode?.toLowerCase() === "wallet" && txn.type?.toLowerCase() === "debit" ? (
                <span className="flex items-center justify-end">
                  <Coins className="w-3.5 h-3.5 mr-1 inline-block text-yellow-600"/> {txn.amount}
                </span>
              ) : (
                `₹${txn.amount?.toLocaleString()}`
              )}
            </TableCell>
            <TableCell className="px-4 py-3 text-xs text-foreground">{txn.formattedDate}</TableCell>
              <TableCell className="px-4 py-3 text-xs">
              <Badge variant="default" className="py-0.5 px-2 text-[10px] font-medium">
                <StatusIcon status={txn.status} />
                {txn.status || "N/A"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }
  
  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0 mb-6 md:mb-8">
          <CardHeader className="p-0 mb-0 flex flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-grow">
              <div className="flex items-center">
                <ListChecks className="w-5 h-5 mr-2.5 text-primary"/>
                <CardTitle className="text-xl font-semibold text-primary">
                  Transaction History
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1 ml-[calc(1.25rem+0.625rem)] sm:ml-0 sm:mt-0.5">
                View your leads credits/debits and fee credits.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableCaption className="py-4 text-xs">A list of your recent transactions.</TableCaption>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Type</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Mode</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">Amount</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Date</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              {renderTableContent()}
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
