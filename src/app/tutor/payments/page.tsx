
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, Coins, FileText, PlusCircle, ListFilter, CheckCircle, XCircle, Clock as ClockIcon, Info, Search } from "lucide-react";
import Link from "next/link";
import { MOCK_TUTOR_PAYMENTS } from "@/lib/mock-data";
import type { TutorPayment, TutorProfile } from "@/types";
import { TutorPaymentCard } from "@/app/tutor/components/TutorPaymentCard"; // Updated path
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function TutorPaymentsPage() {
  const { user } = useAuthMock();
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null;

  const [allPayments, setAllPayments] = useState<TutorPayment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TutorPayment["status"]>("All");

  useEffect(() => {
    if (tutorUser) {
      const tutorPayments = MOCK_TUTOR_PAYMENTS.filter(p => p.tutorId === tutorUser.id);
      setAllPayments(tutorPayments);
    }
  }, [tutorUser]);

  const summaryStats = useMemo(() => {
    const collected = allPayments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
    const pending = allPayments.filter(p => p.status === "Pending" || p.status === "Overdue").reduce((sum, p) => sum + p.amount, 0);
    return {
      totalCollected: collected,
      totalPending: pending,
    };
  }, [allPayments]);

  const filteredPayments = useMemo(() => {
    return allPayments.filter(payment => {
      const matchesSearch = searchTerm === "" ||
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.subject && payment.subject.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "All" || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allPayments, searchTerm, statusFilter]);

  const handleMarkPaid = (paymentId: string) => {
    setAllPayments(prev =>
      prev.map(p =>
        p.id === paymentId ? { ...p, status: "Paid", paymentDate: new Date().toISOString() } : p
      )
    );
  };
  
  const paymentStatusOptions = ["All", "Pending", "Paid", "Overdue"];


  if (!tutorUser) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading or access denied...</div>;
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <DollarSign className="w-5 h-5 mr-2.5"/>
                Manage Payments
              </CardTitle>
              <Button 
                size="sm" 
                className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95 shadow-sm text-xs py-2 md:px-3 px-2 flex items-center"
                onClick={() => toast({ title: "Feature Coming Soon", description: "Ability to manually add payments will be added soon."})}
              >
                <PlusCircle className="h-4 w-4 md:mr-1.5" />
                <span className="hidden md:inline">Add Payment Record</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <Coins className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Payment Collected</p>
                      <p className="text-xl font-semibold text-green-600">₹{summaryStats.totalCollected.toLocaleString()}</p>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500 opacity-70" />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-3 text-orange-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Pending Payment</p>
                      <p className="text-xl font-semibold text-orange-600">₹{summaryStats.totalPending.toLocaleString()}</p>
                    </div>
                  </div>
                  <ClockIcon className="w-5 h-5 text-orange-500 opacity-70" />
                </div>
              </div>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-4">
             <CardTitle className="text-lg font-medium text-foreground flex items-center">
                <ListFilter className="w-4 h-4 mr-2 text-primary"/>
                Filter Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by student, subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 text-xs sm:text-sm h-11 rounded-lg bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm hover:shadow-md focus:shadow-lg w-full"
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "All" | TutorPayment["status"])}>
                        <SelectTrigger className="w-full sm:w-[180px] h-11 text-xs sm:text-sm rounded-lg bg-input border-border focus:border-primary shadow-sm hover:shadow-md">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {paymentStatusOptions.map(status => (
                                <SelectItem key={status} value={status} className="text-xs sm:text-sm">{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </CardContent>
        </Card>
        
        {filteredPayments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:gap-5">
            {filteredPayments.map((payment) => (
              <TutorPaymentCard key={payment.id} payment={payment} onMarkPaid={handleMarkPaid} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 bg-card border rounded-lg shadow-sm">
            <CardContent className="flex flex-col items-center">
              <DollarSign className="w-16 h-16 text-primary/30 mx-auto mb-5" />
              <p className="text-xl font-semibold text-foreground/70 mb-1.5">No Payments Found</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                There are no payment records matching your current filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
