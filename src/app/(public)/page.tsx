
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Search, UserPlus, Edit, Users, ArrowRight, Book, Atom, Code, Globe, Palette, Music, Calculator } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const howItWorksItems = [
  {
    icon: UserPlus,
    title: "1. Sign Up",
    description: "Create your account as a parent looking for a tutor or as a tutor offering your expertise."
  },
  {
    icon: Search,
    title: "2. Post or Search",
    description: "Parents post specific tuition requirements. Tutors search for opportunities matching their skills."
  },
  {
    icon: CheckCircle,
    title: "3. Connect",
    description: "Connect with suitable matches and start the learning journey."
  }
];

const popularSubjects = [
  { name: "Mathematics", icon: Calculator, color: "bg-blue-500", hoverColor: "hover:bg-blue-600", borderColor: "border-blue-700" },
  { name: "Science", icon: Atom, color: "bg-green-500", hoverColor: "hover:bg-green-600", borderColor: "border-green-700" },
  { name: "English", icon: Book, color: "bg-red-500", hoverColor: "hover:bg-red-600", borderColor: "border-red-700" },
  { name: "Coding", icon: Code, color: "bg-purple-500", hoverColor: "hover:bg-purple-600", borderColor: "border-purple-700" },
  { name: "History", icon: Globe, color: "bg-yellow-500", hoverColor: "hover:bg-yellow-600", borderColor: "border-yellow-700" },
  { name: "Art", icon: Palette, color: "bg-pink-500", hoverColor: "hover:bg-pink-600", borderColor: "border-pink-700" },
  { name: "Music", icon: Music, color: "bg-indigo-500", hoverColor: "hover:bg-indigo-600", borderColor: "border-indigo-700" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden bg-secondary">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
            >
              Find Your Perfect Learning Match with Tutorzila
            </h2>
            <p
              className="mt-4 text-lg text-foreground/80 md:text-xl animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
              style={{ animationDelay: "0.2s" }}
            >
              Connecting parents with qualified and passionate tutors. Post your tuition needs or find students to teach.
            </p>
            <div
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
              style={{ animationDelay: "0.4s" }}
            >
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                <Link href="/dashboard/post-requirement">
                  <Edit className="mr-2 h-5 w-5" /> Post Your Requirement
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                <Link href="/search-tuitions">
                  <Users className="mr-2 h-5 w-5" /> Search Tutors
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subjects Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 sm:text-4xl animate-in fade-in duration-500 ease-out">
            Explore Popular Subjects
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {popularSubjects.map((subject, index) => (
              <Link href={`/search-tuitions?subject=${encodeURIComponent(subject.name)}`} key={subject.name}>
                <Card
                  className={`group rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1 active:translate-y-0.5 cursor-pointer
                              border-b-4 active:border-b-2
                              ${subject.borderColor} ${subject.color} text-white
                              animate-in fade-in slide-in-from-bottom-5 duration-500`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 aspect-square">
                    <subject.icon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110" />
                    <p className="text-sm sm:text-base font-semibold text-center">{subject.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
           <div className="text-center mt-12 animate-in fade-in duration-500 ease-out" style={{ animationDelay: `${popularSubjects.length * 0.1 + 0.2}s` }}>
            <Button asChild variant="ghost" className="text-primary hover:text-primary/80 text-lg group">
              <Link href="/search-tuitions">
                View All Subjects <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 sm:text-4xl animate-in fade-in duration-500 ease-out">How Tutorzila Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorksItems.map((item, index) => (
              <Card
                key={item.title}
                className="group shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out bg-card"
                style={{ animationDelay: `${index * 0.15 + 0.2}s` }}
              >
                <CardHeader className="items-center">
                  <item.icon className="w-12 h-12 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Placeholder for Image Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background/50">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
          <div className="animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
            <Image
              src="https://picsum.photos/600/400?random=1"
              alt="Happy student learning"
              width={600}
              height={400}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              data-ai-hint="education learning"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-right-10 duration-700 ease-out">
            <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">Unlock Your Potential</h3>
            <p className="max-w-[600px] text-foreground/80 md:text-lg">
              Tutorzila is dedicated to fostering a supportive learning environment where students can thrive and tutors can make a difference.
            </p>
            <Button asChild className="w-fit shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
              <Link href="/privacy-policy">Learn More About Us</Link> 
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6 text-center animate-in fade-in duration-700 ease-out">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Start?</h2>
          <p className="mt-4 text-lg text-foreground/80 md:text-xl">
            Join Tutorzila today and take the next step in your educational journey.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-100 animate-pulse-once">
              <Link href="/sign-up">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

