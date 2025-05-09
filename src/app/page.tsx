
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Search, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
              Find Your Perfect Learning Match with Tutorzila
            </h1>
            <p className="mt-4 text-lg text-foreground/80 md:text-xl">
              Connecting parents with qualified and passionate tutors. Post your tuition needs or find students to teach.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/dashboard/search-tuitions">Browse Tuitions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 sm:text-4xl">How Tutorzila Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="items-center">
                <UserPlus className="w-12 h-12 text-primary mb-4" />
                <CardTitle>1. Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Create your account as a parent looking for a tutor or as a tutor offering your expertise.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="items-center">
                <Search className="w-12 h-12 text-primary mb-4" />
                <CardTitle>2. Post or Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Parents post specific tuition requirements. Tutors search for opportunities matching their skills.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="items-center">
                <CheckCircle className="w-12 h-12 text-primary mb-4" />
                <CardTitle>3. Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Connect with suitable matches and start the learning journey.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Placeholder for Image Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
          <Image
            src="https://picsum.photos/600/400?random=1"
            alt="Happy student learning"
            width={600}
            height={400}
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            data-ai-hint="education learning"
          />
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">Unlock Your Potential</h3>
            <p className="max-w-[600px] text-foreground/80 md:text-lg">
              Tutorzila is dedicated to fostering a supportive learning environment where students can thrive and tutors can make a difference.
            </p>
            <Button asChild className="w-fit shadow-md hover:shadow-lg transition-shadow">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Start?</h2>
          <p className="mt-4 text-lg text-foreground/80 md:text-xl">
            Join Tutorzila today and take the next step in your educational journey.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/sign-up">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
