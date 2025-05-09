
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { Lightbulb, PlusCircle, Search, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuthMock();

  if (!user) {
    return <div className="text-center p-8">Loading user data or please sign in.</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg bg-gradient-to-r from-primary/10 to-transparent">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome back, {user.name}!</CardTitle>
          <CardDescription className="text-lg">
            You are logged in as a {user.role}. Here&apos;s your dashboard overview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Manage your tuition activities and settings from here.</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user.role === "parent" && (
          <>
            <ActionCard
              title="Post New Requirement"
              description="Need a tutor? Post your requirements and let tutors find you."
              href="/dashboard/post-requirement"
              icon={PlusCircle}
              imageHint="writing list"
            />
            <ActionCard
              title="My Requirements"
              description="View and manage your active tuition postings."
              href="/dashboard/my-requirements"
              icon={Lightbulb}
              imageHint="task checklist"
            />
          </>
        )}

        {user.role === "tutor" && (
          <>
            <ActionCard
              title="Search Tuitions"
              description="Find tuition opportunities that match your expertise and schedule."
              href="/dashboard/search-tuitions"
              icon={Search}
              imageHint="magnifying glass map"
            />
             <ActionCard
              title="My Profile"
              description="Update your tutor profile to attract more students."
              href="/dashboard/profile"
              icon={UserCheck}
              imageHint="profile curriculum"
              disabled
            />
          </>
        )}
        
        {user.role === "admin" && (
           <>
            <ActionCard
              title="Manage Users"
              description="Oversee parent and tutor accounts."
              href="/dashboard/admin/manage-users"
              icon={Users}
              imageHint="people community"
              disabled
            />
            <ActionCard
              title="Manage Tuitions"
              description="Review and manage all tuition postings."
              href="/dashboard/admin/manage-tuitions"
              icon={BookOpen}
              imageHint="library books"
              disabled
            />
          </>
        )}

        <Card className="shadow-md hover:shadow-lg transition-shadow col-span-full lg:col-span-1">
          <CardHeader>
             <Image
                src={`https://picsum.photos/seed/${user.id}activity/400/200`}
                alt="Activity Feed"
                width={400}
                height={200}
                className="rounded-t-lg object-cover w-full aspect-[2/1]"
                data-ai-hint="activity chart"
              />
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Updates on your postings and applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity to display yet.</p>
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
    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
       <Image
        src={`https://picsum.photos/seed/${title.replace(/\s+/g, '')}/400/200`}
        alt={title}
        width={400}
        height={200}
        className="rounded-t-lg object-cover w-full aspect-[2/1]"
        data-ai-hint={imageHint}
      />
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardContent>
        <Button asChild className="w-full" disabled={disabled}>
          <Link href={disabled ? "#" : href}>{title}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

