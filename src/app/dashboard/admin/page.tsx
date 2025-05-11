
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, BarChart2, ShieldCheck, TrendingUp, DollarSign, FileText, UserCheck } from "lucide-react"; // Added UserCheck
import Link from "next/link";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";


export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuthMock();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      router.push("/dashboard"); 
    }
  }, [user, isAuthenticated, router]);
  
  if (!user || user.role !== "admin") {
    return <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height)-2rem)] text-center p-8 animate-in fade-in duration-300">
      <ShieldCheck className="w-24 h-24 text-destructive mb-6" />
      <h2 className="text-3xl font-bold text-destructive mb-2">Access Denied</h2>
      <p className="text-lg text-muted-foreground">This area is restricted to administrators only.</p>
      <Button onClick={() => router.push('/dashboard')} className="mt-6">Go to Dashboard</Button>
      </div>;
  }

  const adminActions = [
    { title: "Manage Users", description: "View, edit, or suspend parent and tutor accounts.", href: "/dashboard/admin/manage-users", icon: Users, disabled: true, imageHint: "user management" },
    { title: "Manage Tuitions", description: "Review, approve, or remove tuition postings.", href: "/dashboard/admin/manage-tuitions", icon: BookOpen, disabled: true, imageHint: "document list" },
    { title: "Site Analytics", description: "View platform statistics and user activity.", href: "/dashboard/admin/analytics", icon: BarChart2, disabled: true, imageHint: "dashboard chart" },
  ];

  const quickStats = [
    { title: "Total Users", value: "120", icon: Users, imageHint: "community people" },
    { title: "Active Tutors", value: "75", icon: UserCheck, imageHint: "teacher checkmark" }, 
    { title: "Active Parents", value: "45", icon: UserCheck, imageHint: "parent checkmark" }, 
    { title: "Open Tuitions", value: "200", icon: FileText, imageHint: "open documents" },
  ];


  return (
    <div className="space-y-8">
      <Card className="bg-card border border-border/50 rounded-xl shadow-lg animate-in fade-in duration-700 ease-out overflow-hidden">
        <CardHeader className="p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-primary/10 rounded-lg text-primary shadow-sm">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <CardTitle className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Admin Control Panel</CardTitle>
              <CardDescription className="text-lg md:text-xl text-foreground/80 mt-1">
                Manage users, tuition requirements, and view site analytics.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminActions.map((action, index) => (
          <div 
            key={action.title}
            className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
            style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
          >
            <AdminActionCard {...action} />
          </div>
        ))}
      </div>

       <Card 
        className="mt-8 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden"
        style={{ animationDelay: `${adminActions.length * 0.1 + 0.3}s` }}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <TrendingUp className="w-6 h-6 mr-2.5"/>
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 p-6 pt-0">
          {quickStats.map(stat => (
            <StatCard key={stat.title} {...stat} />
          ))}
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
  imageHint: string;
}

function AdminActionCard({ title, description, href, icon: Icon, disabled, imageHint }: AdminActionCardProps) {
  return (
    <Card className="group bg-card border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden transform hover:-translate-y-1.5 hover:scale-[1.025]">
       <div className="overflow-hidden rounded-t-xl relative">
        <Image
          src={`https://picsum.photos/seed/${title.replace(/\s+/g, '')}/400/200`}
          alt={title}
          width={400}
          height={200}
          className="object-cover w-full aspect-[16/9] transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={imageHint}
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 group-hover:from-black/50 transition-all duration-300"></div>
      </div>
      <CardHeader className="p-5 md:p-6">
        <div className="flex items-center gap-3.5">
           <div className="p-2.5 bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-all duration-300 shadow-sm">
            <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-5 md:p-6 pt-0">
        <p className="text-[15px] text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="p-5 md:p-6 border-t bg-muted/30">
        <Button asChild className="w-full transform transition-transform hover:scale-105 active:scale-95 text-base py-3" disabled={disabled}>
          <Link href={disabled ? "#" : href }>{disabled ? "Coming Soon" : `Go to ${title}`}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  imageHint: string;
}

function StatCard({ title, value, icon: Icon, imageHint }: StatCardProps) {
  return (
    <Card className="bg-card border border-border/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-5 text-center group transform hover:scale-105">
       <div className="p-3 bg-primary/10 rounded-full text-primary inline-block mb-3 group-hover:bg-primary/20 transition-all shadow-sm">
        <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
      </div>
      <p className="text-3xl font-bold text-primary group-hover:text-primary/90 transition-colors">{value}</p>
      <p className="text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors mt-0.5">{title}</p>
    </Card>
  );
}
