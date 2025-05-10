
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, NotebookPen, Book, Atom, Code, Globe, Palette, Music, Calculator, Lightbulb, SquarePen, MessageSquareQuote, UserRoundCheck, Send, SearchCheck, Users, Award, Share2, PlusCircle, Briefcase, CalendarCheck, DollarSign, TrendingUp, UsersRound, FileText, Star, Mail, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import bannerImage from '@/assets/images/banner-9.png'; 
import hireTutorImage from '@/assets/images/banner-8.png';
import becomeTutorImage from '@/assets/images/banner-11.png';


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

const becomeTutorBenefits = [
  {
    icon: Users,
    title: "Reach Students",
    description: "Connect with thousands of potential students actively looking for tutors like you.",
  },
  {
    icon: Briefcase, 
    title: "Flexible Schedule & Rates",
    description: "Set your own working hours and competitive rates that suit your expertise.",
  },
  {
    icon: CalendarCheck, 
    title: "Manage Easily",
    description: "Utilize our user-friendly platform to manage your profile, bookings, and communication.",
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
    <div className="flex flex-col items-center overflow-x-hidden bg-secondary text-sm">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-12 bg-secondary">
        <div className="container px-6 sm:px-8 md:px-10 lg:px-12 grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
            >
              Find Your Perfect Learning Match with Tutorzila
            </h2>
            <p
              className="mt-4 text-foreground/80 md:text-lg animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
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
              <Button asChild size="lg" className="bg-card text-primary border border-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-card/90">
                <Link href="/dashboard/post-requirement"> 
                  <SquarePen className="mr-2 h-5 w-5" /> Post Your Requirement
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
      <section className="w-full py-8 md:py-12 bg-background/50">
        <div className="container px-6 sm:px-8 md:px-10 lg:px-12">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 sm:text-4xl animate-in fade-in duration-500 ease-out">
            Explore Popular Subjects
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-4 md:-ml-4 py-4"> {/* Adjusted negative margin */}
              {popularSubjects.map((subject, index) => (
                <CarouselItem key={subject.name} className="pl-4 md:pl-4 basis-auto sm:basis-auto md:basis-auto lg:basis-auto"> {/* Increased padding */}
                  <Link href={`/search-tuitions?subject=${encodeURIComponent(subject.name)}`} >
                    <Card
                      className={`group rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-out transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer
                                  border-b-2 active:border-b-1 border-border/30
                                  bg-card text-primary hover:bg-primary/10 
                                  w-28 h-28 flex items-center justify-center
                                  animate-in fade-in slide-in-from-bottom-5 duration-500`}
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <CardContent className="flex flex-col items-center justify-center gap-1 p-2 text-center h-full">
                        <subject.icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                        <p className="text-xs font-semibold leading-tight line-clamp-2">{subject.name}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center items-center gap-4 mt-6">
                <CarouselPrevious className="static translate-y-0 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-10 w-10 sm:h-12 sm:w-12 [&_svg]:h-6 [&_svg]:w-6" />
                <CarouselNext className="static translate-y-0 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-10 w-10 sm:h-12 sm:w-12 [&_svg]:h-6 [&_svg]:w-6" />
            </div>
          </Carousel>
        </div>
      </section>

       {/* Get An Expert Tutor Section */}
      <section className="w-full py-8 md:py-12 bg-secondary">
        <div className="container px-6 sm:px-8 md:px-10 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-10 duration-700 ease-out order-1 lg:order-none">
            <Image
              src={hireTutorImage} 
              alt="Hiring a tutor illustration"
              width={550}
              height={550}
              className="mx-auto rounded-lg object-contain"
            />
          </div>
          <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-700 ease-out">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Get An Expert Tutor
            </h2>
            <p className="text-foreground/80 md:text-lg">
              Finding the right tutor is easy and straightforward with Tutorzila. Follow these steps to connect with qualified educators ready to help you succeed.
            </p>
            <div className="space-y-5 mt-6">
              {howItWorksSteps.map((step, index) => (
                <div 
                  key={step.title} 
                  className="flex items-start gap-4 group animate-in fade-in slide-in-from-bottom-5 duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 bg-card text-primary p-3 rounded-full group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground/90">{step.title}</h3>
                    <p className="text-foreground/70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div 
              className="mt-8 flex justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-5 duration-500"
              style={{ animationDelay: `${howItWorksSteps.length * 0.1}s` }}
            >
              <Button 
                asChild 
                size="lg" 
                className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <Link href="/dashboard/post-requirement">
                  <Send className="mr-2 h-5 w-5" /> Request A Tutor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Become A Tutor Section */}
      <section className="w-full py-8 md:py-12 bg-background/50">
        <div className="container px-6 sm:px-8 md:px-10 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Become A Tutor with Tutorzila
            </h2>
            <p className="text-foreground/80 md:text-lg">
              Share your knowledge, inspire students, and earn on your own schedule. Join our community of passionate educators today.
            </p>
            <div className="space-y-5 mt-6">
              {becomeTutorBenefits.map((benefit, index) => (
                <div 
                  key={benefit.title} 
                  className="flex items-start gap-4 group animate-in fade-in slide-in-from-bottom-5 duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 bg-card text-primary p-3 rounded-full group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground/90">{benefit.title}</h3>
                    <p className="text-foreground/70">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div 
              className="mt-8 flex justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-5 duration-500"
              style={{ animationDelay: `${becomeTutorBenefits.length * 0.1}s` }}
            >
              <Button 
                asChild 
                size="lg" 
                className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <Link href="/sign-up"> 
                  <PlusCircle className="mr-2 h-5 w-5" /> Start Teaching Today
                </Link>
              </Button>
            </div>
          </div>
          <div className="animate-in fade-in slide-in-from-right-10 duration-700 ease-out">
            <Image
              src={becomeTutorImage} 
              alt="Tutor teaching online"
              width={550}
              height={550}
              className="mx-auto rounded-lg object-contain"
              data-ai-hint="teaching online teacher"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-8 md:py-12 bg-background/50">
        <div className="container px-6 sm:px-8 md:px-10 lg:px-12 text-center animate-in fade-in duration-700 ease-out">
          <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Ready to Start Your Journey?</h2>
          <p className="mt-4 text-foreground/80 md:text-lg max-w-2xl mx-auto">
            Whether you&apos;re looking for a tutor or want to share your expertise, Tutorzila is the place to connect and grow.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
              <Link href="/sign-up">
                 <UserPlus className="mr-2 h-5 w-5" /> Sign Up Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

