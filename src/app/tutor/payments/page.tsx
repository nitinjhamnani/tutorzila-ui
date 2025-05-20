
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Coins, FileText, PlusCircle, ListFilter, CheckCircle2, Clock as ClockIcon, XCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import { MOCK_TUTOR_PAYMENTS } from "@/lib/mock-data";
import type { TutorPayment, TutorProfile } from "@/types";
import { TutorPaymentCard } from "@/app/tutor/components/TutorPaymentCard";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Input } from "@/components/ui/input"; // Keep for potential future use, though search is removed for now
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Keep for potential future use
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const allPaymentStatusesForPage = ["All", "Pending", "Paid", "Overdue"] as const;
type PaymentStatusCategory = typeof allPaymentStatusesForPage[number];

export default function TutorPaymentsPage() {
  const { user } = useAuthMock();
  const { toast } = useToast();
  const tutorUser = user as TutorProfile | null;

  const [allPayments, setAllPayments] = useState<TutorPayment[]>([]);
  const [activePaymentCategoryFilter, setActivePaymentCategoryFilter] = useState<PaymentStatusCategory>("All");

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

  const categoryCounts = useMemo(() => {
    return {
      "All": allPayments.length,
      "Pending": allPayments.filter(p => p.status === "Pending").length,
      "Paid": allPayments.filter(p => p.status === "Paid").length,
      "Overdue": allPayments.filter(p => p.status === "Overdue").length,
    };
  }, [allPayments]);

  const paymentStatusCategoriesForDropdown: { label: PaymentStatusCategory; value: PaymentStatusCategory; icon: React.ElementType; count: number }[] = [
    { label: "All", value: "All", icon: ListFilter, count: categoryCounts.All },
    { label: "Pending", value: "Pending", icon: ClockIcon, count: categoryCounts.Pending },
    { label: "Paid", value: "Paid", icon: CheckCircle2, count: categoryCounts.Paid },
    { label: "Overdue", value: "Overdue", icon: XCircle, count: categoryCounts.Overdue },
  ];

  const selectedCategoryLabel = useMemo(() => {
    return paymentStatusCategoriesForDropdown.find(cat => cat.value === activePaymentCategoryFilter)?.label || "All";
  }, [activePaymentCategoryFilter, paymentStatusCategoriesForDropdown]);

  const filteredPayments = useMemo(() => {
    if (activePaymentCategoryFilter === "All") {
      return allPayments;
    }
    return allPayments.filter(payment => payment.status === activePaymentCategoryFilter);
  }, [allPayments, activePaymentCategoryFilter]);

  const handleMarkPaid = (paymentId: string) => {
    setAllPayments(prev =>
      prev.map(p =>
        p.id === paymentId ? { ...p, status: "Paid", paymentDate: new Date().toISOString() } : p
      )
    );
    toast({
      title: "Payment Updated",
      description: `Payment marked as paid.`,
    });
  };

  if (!tutorUser) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading or access denied...</div>;
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2.5 text-primary"/>
              <CardTitle className="text-xl font-semibold text-primary">
                Manage Payments
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
               <Button
                size="sm"
                className="text-xs py-2 md:px-3 px-2 flex items-center transform transition-transform hover:scale-105 active:scale-95 shadow-sm"
                onClick={() => toast({ title: "Feature Coming Soon", description: "Ability to manually add payments will be added soon."})}
              >
                <PlusCircle className="h-4 w-4 md:mr-1.5" />
                <span className="hidden md:inline">Collect Payment</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    className="text-xs sm:text-sm py-2 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <span className="text-primary-foreground">
                      {selectedCategoryLabel} ({paymentStatusCategoriesForDropdown.find(cat => cat.value === activePaymentCategoryFilter)?.count || 0})
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-70 text-primary-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {paymentStatusCategoriesForDropdown.map((category) => (
                    <DropdownMenuItem
                      key={category.value}
                      onClick={() => setActivePaymentCategoryFilter(category.value)}
                      className={cn(
                        "text-sm",
                        activePaymentCategoryFilter === category.value && "bg-primary text-primary-foreground"
                      )}
                    >
                      <category.icon className="mr-2 h-4 w-4" />
                      {category.label} ({category.count})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
                    <ClockIcon className="w-5 h-5 mr-3 text-orange-600" />
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

        {/* Removed the old filter card */}
        
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

