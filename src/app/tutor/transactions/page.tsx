
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks, ArrowUpCircle, ArrowDownCircle, Coins } from "lucide-react"; 
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import type { TutorTransaction, TutorProfile } from "@/types";
import { MOCK_TUTOR_TRANSACTIONS } from "@/lib/mock-data";
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

export default function TutorTransactionsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [transactions, setTransactions] = useState<TutorTransaction[]>([]);
  const tutorUser = user as TutorProfile | null;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isCheckingAuth) {
      if (!isAuthenticated || !tutorUser || tutorUser.role !== 'tutor') {
        router.replace("/");
      } else {
        const tutorTransactions = MOCK_TUTOR_TRANSACTIONS.filter(txn => txn.tutorId === tutorUser.id);
        setTransactions(tutorTransactions);
      }
    }
  }, [hasMounted, isAuthenticated, isCheckingAuth, tutorUser, router]);

  const formattedTransactions = useMemo(() => {
    return transactions.map(txn => ({
      ...txn,
      formattedDate: format(new Date(txn.date), "MMM d, yyyy"),
    }));
  }, [transactions]);

  if (!hasMounted || isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }
  
  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 border-0 mb-6 md:mb-8">
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
            {/* Placeholder for any header actions like "Download Statement" */}
          </CardHeader>
        </Card>

        <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
          <CardContent className="p-0">
            {formattedTransactions.length > 0 ? (
              <Table>
                <TableCaption className="py-4 text-xs">A list of your recent transactions.</TableCaption>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground w-[120px]">Transaction ID</TableHead>
                    <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Type</TableHead>
                    <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Mode</TableHead>
                    <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">Amount</TableHead>
                    <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Date</TableHead>
                    <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formattedTransactions.map((txn) => (
                    <TableRow key={txn.id} className="hover:bg-muted/20">
                      <TableCell className="px-4 py-3 text-xs font-medium text-foreground">{txn.id}</TableCell>
                      <TableCell className={cn(
                        "px-4 py-3 text-xs font-semibold flex items-center",
                        txn.type === "Credit" ? "text-green-600" : "text-red-600"
                      )}>
                        {txn.type === "Credit" ? <ArrowUpCircle className="w-3.5 h-3.5 mr-1.5"/> : <ArrowDownCircle className="w-3.5 h-3.5 mr-1.5"/>}
                        {txn.type}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-foreground">{txn.mode}</TableCell>
                      <TableCell className="px-4 py-3 text-xs text-foreground text-right">
                        {txn.mode === "Wallet" && txn.type === "Debit" ? (
                          <span className="flex items-center justify-end">
                            <Coins className="w-3.5 h-3.5 mr-1 inline-block text-yellow-600"/> {txn.amount}
                          </span>
                        ) : (
                          `₹${txn.amount.toLocaleString()}`
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-foreground">{txn.formattedDate}</TableCell>
                      <TableCell className="px-4 py-3 text-xs text-foreground">{txn.summary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16">
                <ListChecks className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <p className="text-md font-semibold text-foreground/70 mb-2">No Transactions Found</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  You don't have any transactions yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
