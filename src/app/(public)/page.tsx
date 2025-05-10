
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CheckCircle, Search, UserPlus, Edit, Users, ArrowRight, Book, Atom, Code, Globe, Palette, Music, Calculator, Lightbulb, SquarePen, CircleCheckBig, BookUser, Send, UserRoundCheck, UsersRound, MessageSquareQuote, FilePenLine, NotebookPen, SearchCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import bannerImage from '@/assets/images/banner-9.png'; 
// import hireTutorImage from '@/assets/images/hire-tutor.png'; // Removed missing import

const howItWorksSteps = [
  {
    icon: SquarePen,
    title: "Post Your Need",
    description: "Clearly outline the subject, grade, and specific help required.",
  },
  {
    icon: SearchCheck,
    title: "Browse Profiles",
    description: "Review detailed tutor profiles, experience, and qualifications.",
  },
  {
    icon: MessageSquareQuote,
    title: "Connect & Discuss",
    description: "Message tutors to discuss requirements and schedule a trial.",
  },
  {
    icon: UserRoundCheck,
    title: "Start Learning",
    description: "Finalize with your chosen tutor and begin personalized sessions.",
  },
];


const popularSubjects = [
  { name: "Mathematics", icon: Calculator, hoverColor: "hover:bg-blue-600" },
  { name: "Science", icon: Atom, hoverColor: "hover:bg-green-600" },
  { name: "English", icon: Book, hoverColor: "hover:bg-red-600" },
  { name: "Coding", icon: Code, hoverColor: "hover:bg-purple-600" },
  { name: "History", icon: Globe, hoverColor: "hover:bg-yellow-600" },
  { name: "Art", icon: Palette, hoverColor: "hover:bg-pink-600" },
  { name: "Music", icon: Music, hoverColor: "hover:bg-indigo-600" },
  { name: "Physics", icon: Lightbulb, hoverColor: "hover:bg-teal-600" },
  { name: "Chemistry", icon: Atom, hoverColor: "hover:bg-cyan-600" },
  { name: "Biology", icon: Atom, hoverColor: "hover:bg-lime-600" },
  { name: "Geography", icon: Globe, hoverColor: "hover:bg-orange-600" },
  { name: "Economics", icon: Calculator, hoverColor: "hover:bg-amber-600" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden bg-secondary">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-12 lg:py-16 bg-secondary">
        <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
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
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
              style={{ animationDelay: "0.4s" }}
            >
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                <Link href="/search-tuitions">
                  <Search className="mr-2 h-5 w-5" /> Search Tutors
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                <Link href="/dashboard/post-requirement"> {/* This will likely be a route in the dashboard */}
                  <NotebookPen className="mr-2 h-5 w-5" /> Post Your Requirement
                </Link>
              </Button>
            </div>
          </div>
           <div className="hidden lg:flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out" style={{ animationDelay: "0.3s" }}>
            <Image
              src={bannerImage} 
              alt="Learning Illustration"
              width={500}
              height={500}
              className="rounded-lg object-contain" 
              priority
            />
          </div>
        </div>
      </section>

      {/* Popular Subjects Section */}
      <section className="w-full py-8 md:py-12 lg:py-16 bg-background/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 sm:text-4xl animate-in fade-in duration-500 ease-out">
            Explore Popular Subjects
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto"
          >
            <CarouselContent className="-ml-1 md:-ml-2 py-4">
              {popularSubjects.map((subject, index) => (
                <CarouselItem key={subject.name} className="pl-1 md:pl-2 basis-auto">
                  <Link href={`/search-tuitions?subject=${encodeURIComponent(subject.name)}`} >
                    <Card
                      className={`group rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1 active:translate-y-0.5 cursor-pointer
                                  border-b-4 active:border-b-2 border-border/50
                                  bg-secondary text-primary hover:bg-primary/10 
                                  animate-in fade-in slide-in-from-bottom-5 duration-500`}
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <CardContent className="flex flex-col items-center justify-center gap-1 p-2 sm:p-2.5 aspect-square w-[70px] h-[70px] sm:w-[80px] sm:h-[80px]">
                        <subject.icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
                        <p className="text-[9px] sm:text-[10px] font-semibold text-center leading-tight">{subject.name}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 sm:-left-6 md:-left-8 top-1/2 -translate-y-1/2 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-8 w-8 sm:h-9 sm:w-9" />
            <CarouselNext className="absolute -right-4 sm:-right-6 md:-right-8 top-1/2 -translate-y-1/2 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-8 w-8 sm:h-9 sm:w-9" />
          </Carousel>
           <div className="text-center mt-10 animate-in fade-in duration-500 ease-out" style={{ animationDelay: `${popularSubjects.length * 0.1 + 0.2}s` }}>
            <Button asChild variant="ghost" className="text-primary hover:text-primary/80 text-lg group">
              <Link href="/search-tuitions">
                View All Subjects <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

       {/* Get An Expert Tutor Section */}
      <section className="w-full py-8 md:py-12 lg:py-16 bg-secondary">
        <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-10 duration-700 ease-out order-1 lg:order-none">
            <Image
              src="https://picsum.photos/seed/hire-tutor/550/550" // Placeholder image
              alt="Hiring a tutor"
              width={550}
              height={550}
              className="mx-auto rounded-lg object-contain"
              data-ai-hint="teacher student"
            />
          </div>
          <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-700 ease-out">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Get An Expert Tutor in Simple Steps
            </h2>
            <p className="text-lg text-foreground/80 md:text-xl">
              Finding the right tutor is easy and straightforward with Tutorzila. Follow these steps to connect with qualified educators ready to help you succeed.
            </p>
            <div className="space-y-5 mt-6">
              {howItWorksSteps.map((step, index) => (
                <div 
                  key={step.title} 
                  className="flex items-start gap-4 group animate-in fade-in slide-in-from-bottom-5 duration-500"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground/90">{step.title}</h3>
                    <p className="text-foreground/70 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              asChild 
              size="lg" 
              className="mt-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-5 duration-500"
              style={{ animationDelay: `${howItWorksSteps.length * 0.15 + 0.1}s` }}
            >
              <Link href="/dashboard/post-requirement">
                <Send className="mr-2 h-5 w-5" /> Request A Tutor
              </Link>
            </Button>
          </div>
        </div>
      </section>


      {/* Placeholder for Image Section */}
      <section className="w-full py-8 md:py-12 lg:py-16 bg-background/50">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
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
      <section className="w-full py-8 md:py-12 lg:py-16 border-t">
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

