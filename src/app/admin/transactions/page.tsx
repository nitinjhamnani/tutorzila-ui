
"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ListChecks, AlertTriangle, CheckCircle2, Clock, XCircle, ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import type { AdminTransaction } from "@/types";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

const fetchAdminTransactions = async (token: string | null): Promise<AdminTransaction[]> => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${apiBaseUrl}/api/payment/transactions`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions.");
  }
  
  const data = await response.json();
  return data;
};

const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed':
        case 'success':
            return 'bg-green-100 text-green-700 border-green-300';
        case 'failed':
        case 'failure':
            return 'bg-red-100 text-red-700 border-red-300';
        case 'pending':
        case 'initiated':
            return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

const StatusIcon = ({ status }: { status: string }) => {
    const iconProps = "w-3 h-3 mr-1";
    switch (status.toLowerCase()) {
      case "completed":
      case "success": return <CheckCircle2 className={iconProps} />;
      case "failed":
      case "failure": return <XCircle className={iconProps} />;
      case "pending":
      case "initiated": return <Clock className={iconProps} />;
      default: return null;
    }
};

export default function AdminAllTransactionsPage() {
  const { token } = useAuthMock();
  const { hideLoader, showLoader } = useGlobalLoader();

  const { data: transactions = [], isLoading, error } = useQuery<AdminTransaction[]>({
    queryKey: ["adminAllTransactions", token],
    queryFn: () => fetchAdminTransactions(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (isLoading) {
      showLoader("Fetching transaction history...");
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);


  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={7}>
                <Skeleton className="h-8 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    
    if (error) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center text-destructive py-10">
              <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
              <p className="font-semibold">Failed to load transactions</p>
              <p className="text-sm">{(error as Error).message}</p>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (transactions.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center py-16">
              <ListChecks className="w-16 h-16 text-primary/30 mx-auto mb-5" />
              <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Transactions Found</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                There are no transaction records to display on the platform yet.
              </p>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {transactions.map((txn) => (
          <TableRow key={txn.id}>
            <TableCell>
              <div className="font-medium text-foreground">{txn.userId}</div>
              <div className="text-xs text-muted-foreground">{txn.userType}</div>
            </TableCell>
            <TableCell>
                 <Badge variant="outline" className={cn("text-xs capitalize border", getStatusClasses(txn.transactionStatus))}>
                    <StatusIcon status={txn.transactionStatus} />
                    {txn.transactionStatus}
                </Badge>
            </TableCell>
            <TableCell>
                 <Badge variant="secondary" className="capitalize text-xs">{txn.transactionType}</Badge>
            </TableCell>
             <TableCell className="font-medium">
              <div className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-muted-foreground"/>
                {txn.amountInRupee.toLocaleString()}
              </div>
            </TableCell>
            <TableCell className="text-xs">{txn.mode || 'N/A'}</TableCell>
            <TableCell className="text-xs">{format(new Date(txn.initiatedAt), "MMM d, yyyy, p")}</TableCell>
            <TableCell className="text-xs">{txn.completedAt ? format(new Date(txn.completedAt), "MMM d, yyyy, p") : "N/A"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <ListChecks className="w-5 h-5 mr-2.5" />
            All Transactions
          </CardTitle>
          <CardDescription className="text-sm text-foreground/70 mt-1">
            A log of all financial transactions on the platform.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount (₹)</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Initiated At</TableHead>
                    <TableHead>Completed At</TableHead>
                </TableRow>
                </TableHeader>
                {renderTableContent()}
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
