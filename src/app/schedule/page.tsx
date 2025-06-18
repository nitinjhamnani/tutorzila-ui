import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, History } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const upcomingSessions = [
  { id: '1', subject: 'Calculus I', tutor: 'Marcus Chen', date: '2024-07-17', time: '13:00 - 15:00', status: 'Confirmed' },
  { id: '2', subject: 'Quantum Physics', tutor: 'Dr. Eleanor Vance', date: '2024-07-20', time: '10:00 - 12:00', status: 'Confirmed' },
];

const pastSessions = [
  { id: '3', subject: 'Creative Writing', tutor: 'Sofia Rodriguez', date: '2024-07-01', time: '16:00 - 18:00', status: 'Completed' },
];


export default function SchedulePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">My Schedule</h1>
        <p className="text-muted-foreground">
          Manage your upcoming and past tutoring sessions.
        </p>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Link href="/tutors" passHref>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <CalendarPlus className="mr-2 h-5 w-5" /> Book New Session
            </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Upcoming Sessions</CardTitle>
          <CardDescription>Your scheduled tutoring sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length > 0 ? (
            <ul className="space-y-4">
              {upcomingSessions.map(session => (
                <li key={session.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background hover:bg-accent/10">
                  <div>
                    <h3 className="font-semibold text-primary">{session.subject}</h3>
                    <p className="text-sm text-muted-foreground">With: {session.tutor}</p>
                    <p className="text-sm text-muted-foreground">Date: {session.date} at {session.time}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">{session.status}</span>
                     <Button variant="outline" size="sm" className="ml-2 mt-2 sm:mt-0">Manage</Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">You have no upcoming sessions. <Link href="/tutors" className="text-primary underline">Book a session now!</Link></p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center"><History className="mr-2 h-5 w-5 text-primary" /> Past Sessions</CardTitle>
           <CardDescription>Review your completed sessions.</CardDescription>
        </CardHeader>
        <CardContent>
           {pastSessions.length > 0 ? (
            <ul className="space-y-3">
              {pastSessions.map(session => (
                <li key={session.id} className="p-3 border rounded-md text-sm text-muted-foreground">
                  {session.subject} with {session.tutor} on {session.date} - Status: {session.status}
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-muted-foreground">No past sessions recorded.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
