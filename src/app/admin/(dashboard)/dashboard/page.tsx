
"use client";

import type { ElementType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Users,
  Briefcase,
  DollarSign,
  BarChart2,
  UsersRound,
  ShieldCheck,
  Settings,
  FileText,
  ArrowRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminDashboardData } from "@/types";

interface MetricCardProps {
  title: string;
  value: string;
  IconEl: ElementType;
  description: string;
  iconBg?: string;
  iconColor?: string;
}

function MetricCard({ title, value, IconEl, description, iconBg = "bg-primary/10", iconColor = "text-primary" }: MetricCardProps) {
  return (
    <Card className="bg-card rounded-xl shadow-lg p-5 border-0 transform transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <h3 className={cn("text-2xl font-bold mt-0.5", iconColor)}>{value}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        {IconEl && (
          <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg text-sm shrink-0", iconBg, iconColor)}>
            <IconEl className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}


interface AdminQuickActionCardProps {
  title: string;
  description: string;
  IconEl: ElementType;
  href: string;
  disabled?: boolean;
}

function AdminQuickActionCard({ title, description, IconEl, href, disabled }: AdminQuickActionCardProps) {
  const content = (
    <div className="bg-card rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between border-0 transform hover:-translate-y-1">
      <div>
        <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg text-primary mb-3">
          <IconEl className="w-5 h-5" />
        </div>
        <h3 className="font-medium text-foreground text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
      </div>
      <div className="mt-4 text-sm text-primary font-medium flex items-center gap-1 whitespace-nowrap">
        {disabled ? "Coming Soon" : "Manage"}
        {!disabled && <ArrowRight className="ml-1 w-3 h-3" />}
      </div>
    </div>
  );

  if (disabled) {
    return <div className="block h-full opacity-60 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}

const fetchAdminDashboardData = async (token: string | null): Promise<AdminDashboardData> => {
    // MOCK IMPLEMENTATION
    if (!token) throw new Error("No admin token found.");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return {
        totalTutors: 152,
        totalParents: 845,
        totalEnquiries: 234,
        monthlyRevenue: 45000,
        pendingApprovals: 12,
    };
};


export default function AdminDashboardPage() {
  const { user, token, isAuthenticated, isCheckingAuth } = useAuthMock();
  const router = useRouter();
  
  const { data: dashboardData, isLoading, error } = useQuery<AdminDashboardData>({
    queryKey: ['adminDashboard', token],
    queryFn: () => fetchAdminDashboardData(token),
    enabled: !!token && !!user && user.role === 'admin',
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || user?.role !== 'admin')) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isCheckingAuth, user, router]);

  if (isCheckingAuth || isLoading || !user) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-14 w-1/3 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
            <Skeleton className="h-10 w-1/4 rounded-lg mt-4" />
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
            </div>
        </div>
    );
  }
  
  if (error) {
      return <p className="text-destructive text-center">Failed to load dashboard data.</p>
  }
  
  const adminMetrics: MetricCardProps[] = [
    { title: "Total Tutors", value: String(dashboardData?.totalTutors || 0), IconEl: Users, description: "Active & pending tutors", iconColor: "text-blue-600" },
    { title: "Total Parents", value: String(dashboardData?.totalParents || 0), IconEl: UsersRound, description: "Registered parent accounts", iconColor: "text-green-600" },
    { title: "Open Enquiries", value: String(dashboardData?.totalEnquiries || 0), IconEl: Briefcase, description: "Active tuition requests", iconColor: "text-orange-600" },
    { title: "Revenue (Month)", value: `₹${(dashboardData?.monthlyRevenue || 0).toLocaleString()}`, IconEl: DollarSign, description: "Last 30 days", iconColor: "text-purple-600" },
  ];
  
  const adminQuickActions: AdminQuickActionCardProps[] = [
      { title: "Tutor Management", description: "Approve, view, or manage tutor profiles.", IconEl: Users, href: "#", disabled: true },
      { title: "Parent Management", description: "View and manage parent accounts.", IconEl: UsersRound, href: "#", disabled: true },
      { title: "Enquiry Management", description: "Oversee all posted tuition enquiries.", IconEl: Briefcase, href: "#", disabled: true },
      { title: "Approval Queue", description: `Review ${dashboardData?.pendingApprovals || 0} pending tutor applications.`, IconEl: ShieldCheck, href: "#", disabled: true },
      { title: "System Settings", description: "Configure platform settings and fees.", IconEl: Settings, href: "#", disabled: true },
      { title: "Reports", description: "Generate financial and user reports.", IconEl: BarChart2, href: "#", disabled: true },
      { title: "Content Management", description: "Manage site content like FAQs.", IconEl: FileText, href: "#", disabled: true },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {adminMetrics.map(metric => <MetricCard key={metric.title} {...metric} />)}
        </div>
        
        <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {adminQuickActions.map((action) => <AdminQuickActionCard key={action.title} {...action} />)}
            </div>
        </div>
    </div>
  );
}
