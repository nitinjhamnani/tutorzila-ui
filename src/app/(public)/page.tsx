

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, NotebookPen, Book, Atom, Code, Globe, Palette, Music, Calculator, Lightbulb, SquarePen, MessageSquareQuote, UserRoundCheck, Send, SearchCheck, Users, Award, Share2, PlusCircle, Briefcase, CalendarCheck, DollarSign, TrendingUp, UsersRound, FileText, Star, Mail, UserPlus, Phone, MapPin, BriefcaseBusiness, Building, Laptop, TrendingUpIcon, Users2, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import bannerImage from '@/assets/images/banner-9.png'; 
import hireTutorImage from '@/assets/images/banner-8.png';
import becomeTutorImage from '@/assets/images/banner-11.png';
import type { TutorProfile, Testimonial } from "@/types";
import { TutorProfileCard } from "@/components/tutors/TutorProfileCard";
import { TestimonialCard } from "@/components/shared/TestimonialCard";


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
    icon: BriefcaseBusiness, 
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

// Mock data for Tutor Profiles - copied from TutorProfileSearch for use in this server component
const MOCK_TUTOR_PROFILES: TutorProfile[] = [
  { id: "t1", name: "Dr. Emily Carter", email: "emily.carter@example.com", role: "tutor", avatar: "https://picsum.photos/seed/emilycarter/128", subjects: ["Physics", "Mathematics", "Chemistry"], grade: "Doctorate Level", experience: "10+ years", hourlyRate: "5000", bio: "PhD in Physics with a passion for demystifying complex scientific concepts for students of all levels.", teachingMode: "Online" },
  { id: "t2", name: "John Adebayo", email: "john.adebayo@example.com", role: "tutor", avatar: "https://picsum.photos/seed/johnadebayo/128", subjects: ["English Literature", "History", "Creative Writing"], grade: "Master's Level", experience: "5-7 years", hourlyRate: "4000", bio: "MA in English Literature. Dedicated to fostering critical thinking and a love for the humanities.", teachingMode: "In-person" },
  { id: "t3", name: "Sophia Chen", email: "sophia.chen@example.com", role: "tutor", avatar: "https://picsum.photos/seed/sophiachen/128", subjects: ["Computer Science", "Mathematics", "Web Development"], grade: "University Level", experience: "3-5 years", hourlyRate: "4500", bio: "Software engineer and CS graduate, specializing in Python, Java, and web technologies.", teachingMode: "Hybrid" },
  { id: "t4", name: "David Miller", email: "david.miller@example.com", role: "tutor", avatar: "https://picsum.photos/seed/davidmiller/128", subjects: ["Biology", "Chemistry"], grade: "High School & College", experience: "7+ years", hourlyRate: "4800", bio: "Former research scientist with extensive experience in tutoring high school and college biology.", teachingMode: "Online" },
  { id: "t5", name: "Linda Garcia", email: "linda.garcia@example.com", role: "tutor", avatar: "https://picsum.photos/seed/lindagarcia/128", subjects: ["Spanish", "French"], grade: "All Levels", experience: "3-5 years", hourlyRate: "3500", bio: "Native Spanish speaker, fluent in French. Passionate about language learning and cultural exchange.", teachingMode: "In-person" },
];

const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: "testimonial1", name: "Sarah L. (Parent)", avatarSeed: "sarahparent", role: "Parent", text: "Tutorzila helped us find the perfect math tutor for our son. His grades have improved significantly!", rating: 5, date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "testimonial2", name: "David K. (Tutor)", avatarSeed: "davidtutor", role: "Tutor", text: "I love the flexibility of teaching on Tutorzila. I can set my own hours and connect with students who genuinely want to learn.", rating: 5, date: new Date(Date.now() - 86400000 * 12).toISOString() },
  { id: "testimonial3", name: "Maria P. (Parent)", avatarSeed: "mariaparent", role: "Parent", text: "The platform is user-friendly, and the quality of tutors is excellent. Highly recommend!", rating: 4, date: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: "testimonial4", name: "Ahmed R. (Tutor)", avatarSeed: "ahmedtutor", role: "Tutor", text: "A great way to find students and manage my tutoring business. The support team is also very responsive.", rating: 5, date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "testimonial5", name: "Jessica B. (Parent)", avatarSeed: "jessicaparent", role: "Parent", text: "Finding a qualified physics tutor was so easy with Tutorzila. My daughter is much more confident now.", rating: 5, date: new Date(Date.now() - 86400000 * 8).toISOString() },
];


export default function HomePage() {
  const sectionPadding = "pt-8 md:pt-12 pb-16 md:pb-24"; 
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";

  return (
    <div className="flex flex-col items-center overflow-x-hidden bg-secondary text-sm">
      {/* Hero Section */}
      <section className={`w-full ${sectionPadding} bg-secondary`}>
        <div className={`${containerPadding} grid lg:grid-cols-2 gap-8 items-center`}>
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
              <Button asChild size="lg" className="bg-card text-primary border border-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-primary/5">
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
      <section className={`w-full ${sectionPadding} bg-background/50`}>
        <div className={`${containerPadding}`}>
          <div className="text-center mb-10 space-y-4 animate-in fade-in duration-700 ease-out">
            <NotebookPen className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl animate-in fade-in duration-500 ease-out text-primary">
              Explore Popular Subjects
            </h2>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-4 md:-ml-4 py-4">
              {popularSubjects.map((subject, index) => (
                <CarouselItem key={subject.name} className="pl-4 md:pl-4 basis-auto sm:basis-auto md:basis-auto lg:basis-auto">
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
      <section className={`w-full ${sectionPadding} bg-secondary`}>
        <div className={`${containerPadding} grid lg:grid-cols-2 gap-12 items-center`}>
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

      {/* Meet Our Tutors Section */}
      <section className={`w-full ${sectionPadding} bg-background/50`}>
        <div className={`${containerPadding}`}>
          <div className="text-center mb-10 space-y-4 animate-in fade-in duration-700 ease-out">
            <Users2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Meet Our Tutors
            </h2>
          </div>
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto relative animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4 py-2">
                {MOCK_TUTOR_PROFILES.slice(0, 5).map((tutor, index) => (
                  <CarouselItem key={tutor.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/3"> 
                    <div className="p-1">
                      <TutorProfileCard tutor={tutor} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center items-center gap-4 mt-6">
                <CarouselPrevious className="static translate-y-0 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-10 w-10 sm:h-12 sm:w-12 [&_svg]:h-6 [&_svg]:w-6" />
                <CarouselNext className="static translate-y-0 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-10 w-10 sm:h-12 sm:w-12 [&_svg]:h-6 [&_svg]:w-6" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Become A Tutor Section */}
      <section className={`w-full ${sectionPadding} bg-secondary`}>
        <div className={`${containerPadding} grid lg:grid-cols-2 gap-12 items-center`}>
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
      <section className={`w-full ${sectionPadding} bg-background/50`}>
        <div className={`${containerPadding} text-center animate-in fade-in duration-700 ease-out`}>
          <TrendingUpIcon className="w-16 h-16 text-primary mx-auto mb-4" />
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

      {/* Testimonials Section */}
      <section className={`w-full ${sectionPadding} bg-secondary`}>
        <div className={`${containerPadding}`}>
          <div className="text-center mb-10 space-y-4 animate-in fade-in duration-700 ease-out">
            <Quote className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              What Our Users Say
            </h2>
          </div>
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto relative animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 py-2">
                {MOCK_TESTIMONIALS.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center items-center gap-4 mt-6">
                <CarouselPrevious className="static translate-y-0 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-10 w-10 sm:h-12 sm:w-12 [&_svg]:h-6 [&_svg]:w-6" />
                <CarouselNext className="static translate-y-0 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-10 w-10 sm:h-12 sm:w-12 [&_svg]:h-6 [&_svg]:w-6" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
    </div>
  );
}

