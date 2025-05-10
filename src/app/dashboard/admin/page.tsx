
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, BarChart2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuthMock();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      router.push("/dashboard"); // Redirect non-admins
    }
  }, [user, isAuthenticated, router]);
  
  if (!user || user.role !== "admin") {
    return <div className="text-center p-8 animate-in fade-in duration-300">Access Denied. Admins only.</div>;
  }

  const adminActions = [
    { title: "Manage Users", description: "View, edit, or suspend parent and tutor accounts.", href: "/dashboard/admin/manage-users", icon: Users, disabled: true },
    { title: "Manage Tuitions", description: "Review, approve, or remove tuition postings.", href: "/dashboard/admin/manage-tuitions", icon: BookOpen, disabled: true },
    { title: "Site Analytics", description: "View platform statistics and user activity.", href: "/dashboard/admin/analytics", icon: BarChart2, disabled: true },
  ];

  return (
    <div className="space-y-8">
      <Card className="shadow-lg bg-gradient-to-r from-primary/10 to-transparent animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl">Admin Control Panel</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Manage users, tuition requirements, and view site analytics.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminActions.map((action, index) => (
          <div 
            key={action.title}
            className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <AdminActionCard {...action} />
          </div>
        ))}
      </div>
       <Card 
        className="mt-8 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
        style={{ animationDelay: `${adminActions.length * 0.1 + 0.1}s` }}
      >
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">120</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold">75</p>
            <p className="text-sm text-muted-foreground">Active Tutors</p>
          </div>
          <div>
            <p className="text-3xl font-bold">45</p>
            <p className="text-sm text-muted-foreground">Active Parents</p>
          </div>
           <div>
            <p className="text-3xl font-bold">200</p>
            <p className="text-sm text-muted-foreground">Open Tuitions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AdminActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

function AdminActionCard({ title, description, href, icon: Icon, disabled }: AdminActionCardProps) {
  return (
    <Card className="group shadow-md hover:shadow-lg transition-all duration-300 flex flex-col transform hover:scale-105 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-primary transition-transform duration-300 group-hover:rotate-[-10deg] group-hover:scale-110" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardContent>
        <Button asChild className="w-full transform transition-transform hover:scale-105 active:scale-95" disabled={disabled}>
          <Link href={disabled ? "#" : href }>{disabled ? "Coming Soon" : `Go to ${title}`}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
