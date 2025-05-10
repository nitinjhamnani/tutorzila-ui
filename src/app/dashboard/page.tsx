"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Added CardFooter
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Lightbulb, PlusCircle, Search, UserCheck, Users, BookOpen, Activity, Briefcase, ListChecks } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import type { TutorProfile } from "@/types";

export default function DashboardPage() {
  const { user } = useAuthMock();

  if (!user) {
    return <div className="text-center p-8">Loading user data or please sign in.</div>;
  }

  const actionCards = [];

  if (user.role === "parent") {
    actionCards.push(
      <ActionCard
        key="post-requirement"
        title="Post New Requirement"
        description="Need a tutor? Post your requirements and let tutors find you."
        href="/dashboard/post-requirement"
        icon={PlusCircle}
        imageHint="writing list"
      />,
      <ActionCard
        key="my-requirements"
        title="My Requirements"
        description="View and manage your active tuition postings."
        href="/dashboard/my-requirements"
        icon={ListChecks} 
        imageHint="task checklist"
      />
    );
  } else if (user.role === "tutor") {
    actionCards.push(
      <ActionCard
        key="search-tuitions"
        title="Search Tuitions"
        description="Find tuition opportunities that match your expertise and schedule."
        href="/search-tuitions" 
        icon={Search}
        imageHint="magnifying glass map"
      />,
      <ActionCard
        key="my-applications" 
        title="My Applications"
        description="Track your applications for tuition jobs." 
        href="/dashboard/my-applications" 
        icon={Briefcase} 
        imageHint="profile curriculum"
        disabled 
      />
    );
  } else if (user.role === "admin") {
    actionCards.push(
      <ActionCard
        key="manage-users"
        title="Manage Users"
        description="Oversee parent and tutor accounts."
        href="/dashboard/admin/manage-users"
        icon={Users}
        imageHint="people community"
        disabled
      />,
      <ActionCard
        key="manage-tuitions"
        title="Manage Tuitions"
        description="Review and manage all tuition postings."
        href="/dashboard/admin/manage-tuitions"
        icon={BookOpen}
        imageHint="library books"
        disabled
      />
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-xl bg-gradient-to-br from-primary/15 via-card to-card border-none animate-in fade-in duration-700 ease-out rounded-xl overflow-hidden">
        <CardHeader className="p-6 md:p-8">
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Welcome back, {user.name}!</CardTitle>
          <CardDescription className="text-lg md:text-xl text-foreground/80 mt-1">
            {user.role === 'tutor'
              ? "Manage your tuition activities and profile from here."
              : `You are logged in as a ${user.role}. Here's your dashboard overview.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 pt-0">
          {user.role !== 'tutor' && (
            <p className="text-foreground/70">Manage your tuition activities and settings from here.</p>
          )}
        </CardContent>
      </Card>

      {user.role === 'tutor' && (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out" style={{ animationDelay: `0.1s` }}>
          <ProfileCompletionCard tutor={user as TutorProfile} />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {actionCards.map((card, index) => (
          <div 
            key={index} 
            className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
            style={{ animationDelay: `${index * 0.1 + (user.role === 'tutor' ? 0.3 : 0.2)}s` }} 
          >
            {card}
          </div>
        ))}

        <Card 
          className="shadow-lg hover:shadow-xl transition-all duration-300 col-span-full lg:col-span-1 group bg-card border border-border/30 hover:border-primary/50 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
          style={{ animationDelay: `${actionCards.length * 0.1 + (user.role === 'tutor' ? 0.3 : 0.2)}s` }}
        >
          <CardHeader className="p-0 relative">
             <Image
                src={`https://picsum.photos/seed/${user.id}activity/400/200`}
                alt="Activity Feed Illustration"
                width={400}
                height={200}
                className="rounded-t-xl object-cover w-full aspect-[16/9] transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="activity chart"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-xl"></div>
              <div className="absolute bottom-0 left-0 p-4 md:p-5">
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </div>
          </CardHeader>
          <CardContent className="p-4 md:p-5">
            <CardDescription className="mb-3 text-sm">Updates on your postings and applications.</CardDescription>
            <p className="text-muted-foreground text-sm">No recent activity to display yet.</p>
            {/* Placeholder for activity feed items */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  imageHint: string;
  disabled?: boolean;
}

function ActionCard({ title, description, href, icon: Icon, imageHint, disabled }: ActionCardProps) {
  return (
    <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col bg-card h-full rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transform hover:-translate-y-1 hover:scale-[1.02]">
       <div className="overflow-hidden rounded-t-xl relative">
        <Image
          src={`https://picsum.photos/seed/${title.replace(/\s+/g, '')}/400/200`}
          alt={title}
          width={400}
          height={200}
          className="object-cover w-full aspect-[16/9] transition-transform duration-300 group-hover:scale-110"
          data-ai-hint={imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 group-hover:from-black/40 transition-all duration-300"></div>
      </div>
      <CardHeader className="p-4 md:p-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-all duration-300">
             <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 md:p-5 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="p-4 md:p-5 border-t bg-muted/20">
        <Button asChild className="w-full transform transition-transform hover:scale-105 active:scale-95 text-base py-2.5" disabled={disabled}>
          <Link href={disabled ? "#" : href}>{disabled ? "Coming Soon" : title}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

