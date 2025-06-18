
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DollarSign,
  ListFilter,
  ChevronDown,
  CheckCircle2,
  Clock as ClockIcon,
  XCircle as AlertCircleIcon, 
  FileText,
} from "lucide-react";
import type { ParentPayment, User } from "@/types";
import { cn } from "@/lib/utils";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { MOCK_PARENT_PAYMENTS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ParentPaymentCard } from "@/components/dashboard/parent/ParentPaymentCard";

const paymentStatusCategories = [
  "All",
  "Paid",
  "Due",
  "Upcoming",
  "Overdue",
] as const;
type PaymentStatusCategory = (typeof paymentStatusCategories)[number];

const statusIcons: Record<PaymentStatusCategory, React.ElementType> = {
  All: ListFilter,
  Paid: CheckCircle2,
  Due: ClockIcon,
  Upcoming: ClockIcon,
  Overdue: AlertCircleIcon,
};

export default function ParentPaymentsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();

  const [allPayments, setAllPayments] = useState<ParentPayment[]>([]);
  const [activeFilterCategory, setActiveFilterCategory] =
    useState<PaymentStatusCategory>("All");

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated || user?.role !== "parent") {
        router.replace("/");
      } else if (user) {
        const parentPayments = MOCK_PARENT_PAYMENTS.filter(
          (payment) => payment.parentId === user.id
        );
        setAllPayments(parentPayments);
      }
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  const summaryStats = useMemo(() => {
    const paid = allPayments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const due = allPayments
      .filter((p) => p.status === "Due" || p.status === "Overdue")
      .reduce((sum, p) => sum + p.amount, 0);
    const upcoming = allPayments
      .filter((p) => p.status === "Upcoming")
      .reduce((sum, p) => sum + p.amount, 0);
    return {
      totalPaid: paid,
      totalDue: due,
      totalUpcoming: upcoming,
    };
  }, [allPayments]);

  const categoryCounts = useMemo(() => {
    const counts = {
      All: allPayments.length,
      Paid: allPayments.filter((p) => p.status === "Paid").length,
      Due: allPayments.filter((p) => p.status === "Due").length,
      Upcoming: allPayments.filter((p) => p.status === "Upcoming").length,
      Overdue: allPayments.filter((p) => p.status === "Overdue").length,
    };
    return counts;
  }, [allPayments]);

  const filteredPayments = useMemo(() => {
    if (activeFilterCategory === "All") return allPayments;
    return allPayments.filter((p) => p.status === activeFilterCategory);
  }, [allPayments, activeFilterCategory]);

  const handleDownloadInvoice = (paymentId: string) => {
    toast({
      title: "Generating Invoice (Mock)",
      description: `Invoice for payment ID ${paymentId} would be generated and downloaded.`,
    });
  };

  const handleSendInvoice = (paymentId: string) => {
     toast({
      title: "Sending Invoice (Mock)",
      description: `Invoice for payment ID ${paymentId} would be generated and sent to your email.`,
    });
  };

  const handleGenerateInvoice = (paymentId: string) => {
    setAllPayments(prevPayments => 
      prevPayments.map(p => {
        if (p.id === paymentId && p.status === "Paid" && !p.invoiceId) {
          return { ...p, invoiceId: `INV-MOCK-${p.id.slice(-4)}-${Date.now().toString().slice(-5)}` };
        }
        return p;
      })
    );
    toast({
      title: "Invoice Generated (Mock)",
      description: `Mock invoice ID generated for payment ${paymentId}. You can now download or send it.`,
    });
  };


  if (isCheckingAuth || !user) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }
  
  const selectedCategoryData = statusIcons[activeFilterCategory];

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="bg-card rounded-none shadow-lg p-4 sm:p-5 mb-6 md:mb-8 border-0">
          <CardHeader className="p-0 mb-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-grow">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2.5 text-primary" />
                <CardTitle className="text-xl font-semibold text-primary">
                  My Payments
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1 ml-[calc(1.25rem+0.625rem)] sm:ml-0 sm:mt-0.5">
                View your payment history and manage upcoming payments.
              </CardDescription>
            </div>
          </CardHeader>
           <CardContent className="p-0 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryItem title="Total Paid" value={`₹${summaryStats.totalPaid.toLocaleString()}`} Icon={CheckCircle2} iconColor="text-green-600"/>
              <SummaryItem title="Total Due" value={`₹${summaryStats.totalDue.toLocaleString()}`} Icon={ClockIcon} iconColor="text-orange-600"/>
              <SummaryItem title="Upcoming" value={`₹${summaryStats.totalUpcoming.toLocaleString()}`} Icon={ClockIcon} iconColor="text-blue-600"/>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mb-4 sm:mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg flex items-center justify-between gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <span>
                  {activeFilterCategory} ({categoryCounts[activeFilterCategory] || 0})
                </span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {paymentStatusCategories.map((category) => {
                const IconComponent = statusIcons[category];
                return (
                    <DropdownMenuItem
                    key={category}
                    onClick={() => setActiveFilterCategory(category)}
                    className={cn(
                        "text-sm",
                        activeFilterCategory === category && "bg-primary text-primary-foreground"
                    )}
                    >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {category} ({categoryCounts[category] || 0})
                    </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          {filteredPayments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:gap-5">
              {filteredPayments.map((payment) => (
                <ParentPaymentCard
                  key={payment.id}
                  payment={payment}
                  onDownloadInvoice={handleDownloadInvoice}
                  onSendInvoice={handleSendInvoice}
                  onGenerateInvoice={handleGenerateInvoice}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 bg-card border rounded-lg shadow-sm">
              <CardContent className="flex flex-col items-center">
                <DollarSign className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <p className="text-md font-semibold text-foreground/70 mb-2">
                  No Payments Found
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  There are no payments matching "{activeFilterCategory}".
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

interface SummaryItemProps {
  title: string;
  value: string;
  Icon: React.ElementType;
  iconColor?: string;
}

function SummaryItem({ title, value, Icon, iconColor = "text-primary" }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg shadow-sm">
      <div className="flex items-center">
        <Icon className={cn("w-5 h-5 mr-3", iconColor)} />
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className={cn("text-xl font-semibold", iconColor)}>{value}</p>
        </div>
      </div>
    </div>
  );
}
