
"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, NotebookPen, Book, Atom, Code, Globe, Palette, Music, Calculator, Lightbulb, SquarePen, MessageSquareQuote, UserRoundCheck, Send, SearchCheck, Users, Award, Share2, PlusCircle, Briefcase, CalendarCheck, DollarSign, TrendingUp, UsersRound, FileText, Star, Mail, UserPlus, Phone, MapPin, BriefcaseBusiness, Building, Laptop, TrendingUpIcon, Users2, Quote, UsersRoundIcon, BookUser, BookOpen, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import bannerImage from '@/assets/images/banner-9.png'; 
import hireTutorImage from '@/assets/images/banner-8.png';
import becomeTutorImage from '@/assets/images/banner-11.png';
import type { TutorProfile, Testimonial } from "@/types";
import { TutorProfileCard } from "@/components/tutors/TutorProfileCard";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { useState } from "react"; 
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; 
import { PostRequirementModal } from "@/components/modals/PostRequirementModal"; 


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

const MOCK_TUTOR_PROFILES: TutorProfile[] = [
  { id: "t1", name: "Dr. Emily Carter", email: "emily.carter@example.com", role: "tutor", avatar: "https://picsum.photos/seed/emilycarter/128", subjects: ["Physics", "Mathematics", "Chemistry"], grade: "Doctorate Level", experience: "10+ years", hourlyRate: "5000", bio: "PhD in Physics with a passion for demystifying complex scientific concepts for students of all levels.", teachingMode: "Online", status: "Active" },
  { id: "t2", name: "John Adebayo", email: "john.adebayo@example.com", role: "tutor", avatar: "https://picsum.photos/seed/johnadebayo/128", subjects: ["English Literature", "History", "Creative Writing"], grade: "Master's Level", experience: "5-7 years", hourlyRate: "4000", bio: "MA in English Literature. Dedicated to fostering critical thinking and a love for the humanities.", teachingMode: "In-person", status: "Active" },
  { id: "t3", name: "Sophia Chen", email: "sophia.chen@example.com", role: "tutor", avatar: "https://picsum.photos/seed/sophiachen/128", subjects: ["Computer Science", "Mathematics", "Web Development"], grade: "University Level", experience: "3-5 years", hourlyRate: "4500", bio: "Software engineer and CS graduate, specializing in Python, Java, and web technologies.", teachingMode: "Hybrid", status: "Active" },
  { id: "t4", name: "David Miller", email: "david.miller@example.com", role: "tutor", avatar: "https://picsum.photos/seed/davidmiller/128", subjects: ["Biology", "Chemistry"], grade: "High School & College", experience: "7+ years", hourlyRate: "4800", bio: "Former research scientist with extensive experience in tutoring high school and college biology.", teachingMode: "Online", status: "Active" },
  { id: "t5", name: "Linda Garcia", email: "linda.garcia@example.com", role: "tutor", avatar: "https://picsum.photos/seed/lindagarcia/128", subjects: ["Spanish", "French"], grade: "All Levels", experience: "3-5 years", hourlyRate: "3500", bio: "Native Spanish speaker, fluent in French. Passionate about language learning and cultural exchange.", teachingMode: "In-person", status: "Inactive" },
];

const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: "testimonial1", name: "Sarah L. (Parent)", avatarSeed: "sarahparent", role: "Parent", text: "Tutorzila helped us find the perfect math tutor for our son. His grades have improved significantly!", rating: 5, date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "testimonial2", name: "David K. (Tutor)", avatarSeed: "davidtutor", role: "Tutor", text: "I love the flexibility of teaching on Tutorzila. I can set my own hours and connect with students who genuinely want to learn.", rating: 5, date: new Date(Date.now() - 86400000 * 12).toISOString() },
  { id: "testimonial3", name: "Maria P. (Parent)", avatarSeed: "mariaparent", role: "Parent", text: "The platform is user-friendly, and the quality of tutors is excellent. Highly recommend!", rating: 4, date: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: "testimonial4", name: "Ahmed R. (Tutor)", avatarSeed: "ahmedtutor", role: "Tutor", text: "A great way to find students and manage my tutoring business. The support team is also very responsive.", rating: 5, date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "testimonial5", name: "Jessica B. (Parent)", avatarSeed: "jessicaparent", role: "Parent", text: "Finding a qualified physics tutor was so easy with Tutorzila. My daughter is much more confident now.", rating: 5, date: new Date(Date.now() - 86400000 * 8).toISOString() },
];


export default function HomePage() {
  const sectionPadding = "pt-8 md:pt-12 pb-12 md:pb-16"; 
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";
  const [isPostRequirementModalOpen, setIsPostRequirementModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center overflow-x-hidden bg-secondary">
      
        {/* Hero Section */}
        <section className={`w-full py-12 md:py-20 lg:py-28 bg-secondary ${sectionPadding}`}>
          <div className={`grid items-center gap-6 lg:grid-cols-2 lg:gap-12 ${containerPadding}`}>
            <div className="flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
                Find Your Perfect Learning Match with Tutorzila
              </h2>
              <p className="max-w-[600px] text-foreground/80 md:text-lg lg:text-base xl:text-lg">
                Connecting parents with qualified and passionate tutors. Post your tuition needs or find students to teach.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                   <Link href="/search-tuitions">
                    <Search className="mr-2 h-5 w-5" /> Search Tutors
                  </Link>
                </Button>
                 <Dialog open={isPostRequirementModalOpen} onOpenChange={setIsPostRequirementModalOpen}>
                  <DialogTrigger asChild>
                     <Button size="lg" variant="outline" className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 bg-card text-primary hover:bg-card/90 hover:text-primary">
                      <SquarePen className="mr-2 h-5 w-5" /> Post Your Requirement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px] p-0 bg-card">
                    <PostRequirementModal onSuccess={() => setIsPostRequirementModalOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out order-first lg:order-last">
              <Image
                src={bannerImage}
                alt="Learning Illustration"
                width={500}
                height={500}
                className="rounded-lg object-contain"
                priority
                data-ai-hint="education online learning"
              />
            </div>
          </div>
        </section>

        {/* Popular Subjects Section */}
        <section className={`w-full ${sectionPadding}`}>
          <div className={`${containerPadding}`}>
            <div className="text-center mb-10 md:mb-12 animate-in fade-in duration-500 ease-out">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
                 <BookOpen className="w-7 h-7 text-primary"/>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Explore Popular Subjects</h2>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {popularSubjects.map((subject, index) => (
                  <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-3 md:pl-4">
                    <div className="p-1">
                      <Card className="group bg-card hover:shadow-md transition-all duration-300 rounded-full aspect-square flex flex-col items-center justify-center text-center p-3 md:p-2 shadow-sm border hover:border-primary/40 w-[120px] h-[120px] md:w-[130px] md:h-[130px] mx-auto">
                        <CardContent className="p-0 flex flex-col items-center justify-center gap-1.5 md:gap-1">
                          <subject.icon className="w-7 h-7 md:w-8 md:h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                          <p className="text-xs md:text-[13px] font-medium text-foreground group-hover:text-primary transition-colors truncate w-full px-1">{subject.name}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center items-center mt-6 space-x-3">
                <CarouselPrevious className="static transform-none w-10 h-10 bg-card hover:bg-primary/10 text-primary border-primary/50 hover:border-primary" />
                <CarouselNext className="static transform-none w-10 h-10 bg-card hover:bg-primary/10 text-primary border-primary/50 hover:border-primary" />
              </div>
            </Carousel>
          </div>
        </section>

         {/* Get An Expert Tutor Section */}
        <section className={`w-full bg-background/50 ${sectionPadding}`}>
          <div className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${containerPadding}`}>
            <div className="flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out">
              <Image
                src={hireTutorImage} 
                alt="Hiring a tutor illustration"
                width={550}
                height={550}
                className="rounded-lg object-contain"
                data-ai-hint="teacher student"
              />
            </div>
            <div className="flex flex-col justify-center space-y-6 animate-in fade-in slide-in-from-right-10 duration-700 ease-out">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Get An Expert Tutor</h2>
                <p className="max-w-[600px] text-foreground/80 md:text-lg lg:text-base xl:text-lg">
                  Finding the right tutor is easy and straightforward with Tutorzila. Follow these steps to connect with qualified educators ready to help you succeed.
                </p>
                <div className="space-y-5 mt-3">
                  {howItWorksSteps.map((step, index) => (
                    <Card key={index} className="group bg-card p-4 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg border hover:border-primary/40">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                          <step.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-md font-semibold text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                          <p className="text-sm text-foreground/70 mt-0.5">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center lg:justify-start mt-6">
                  <Dialog open={isPostRequirementModalOpen} onOpenChange={setIsPostRequirementModalOpen}>
                    <DialogTrigger asChild>
                       <Button size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                        <PlusCircle className="mr-2 h-5 w-5" /> Request A Tutor
                      </Button>
                    </DialogTrigger>
                     <DialogContent className="sm:max-w-[625px] p-0 bg-card">
                       <PostRequirementModal onSuccess={() => setIsPostRequirementModalOpen(false)} />
                     </DialogContent>
                  </Dialog>
                </div>
            </div>
          </div>
        </section>

        {/* Meet Our Tutors Section */}
        <section className={`w-full ${sectionPadding}`}>
          <div className={`${containerPadding}`}>
            <div className="text-center mb-10 md:mb-12 animate-in fade-in duration-500 ease-out">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
                    <UsersRoundIcon className="w-7 h-7 text-primary"/>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Meet Our Tutors</h2>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: MOCK_TUTOR_PROFILES.length > 4, 
              }}
              className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {MOCK_TUTOR_PROFILES.slice(0, 5).map((tutor, index) => (
                  <CarouselItem key={tutor.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-3 md:pl-4">
                    <div className="p-1 h-full">
                      <TutorProfileCard tutor={tutor} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center items-center mt-8 space-x-3">
                <CarouselPrevious className="static transform-none w-10 h-10 bg-card hover:bg-primary/10 text-primary border-primary/50 hover:border-primary" />
                <CarouselNext className="static transform-none w-10 h-10 bg-card hover:bg-primary/10 text-primary border-primary/50 hover:border-primary" />
              </div>
            </Carousel>
          </div>
        </section>

        {/* Become A Tutor Section */}
        <section className={`w-full bg-background/50 ${sectionPadding}`}>
          <div className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${containerPadding}`}>
            <div className="flex flex-col justify-center space-y-6 animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Become A Tutor with Tutorzila</h2>
                <p className="max-w-[600px] text-foreground/80 md:text-lg lg:text-base xl:text-lg">
                  Share your knowledge, inspire students, and earn on your own schedule. Join our community of passionate educators today.
                </p>
                <div className="space-y-5 mt-3">
                  {becomeTutorBenefits.map((benefit, index) => (
                     <Card key={index} className="group bg-card p-4 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg border hover:border-primary/40">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                          <benefit.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-md font-semibold text-foreground group-hover:text-primary transition-colors">{benefit.title}</h3>
                          <p className="text-sm text-foreground/70 mt-0.5">{benefit.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                 <div className="flex justify-center lg:justify-start mt-6">
                    <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                      <Link href="/sign-up"> 
                        <BookUser className="mr-2 h-5 w-5" /> Start Teaching Today
                      </Link>
                    </Button>
                  </div>
            </div>
             <div className="flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out order-first lg:order-last">
              <Image
                src={becomeTutorImage}
                alt="Teacher explaining concepts"
                width={550}
                height={550}
                className="rounded-lg object-contain"
                data-ai-hint="teaching online teacher"
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className={`w-full text-center ${sectionPadding}`}>
          <div className={`${containerPadding} animate-in fade-in zoom-in-95 duration-700 ease-out`}>
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                <Star className="w-8 h-8 text-primary"/>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-foreground/80 md:text-lg lg:text-base xl:text-lg">
              Whether you&apos;re looking for a tutor or want to share your expertise, Tutorzila is the place to connect and grow.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-100 animate-pulse-once">
                <Link href="/sign-up">
                   Sign Up Now <Send className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={`w-full bg-background/50 ${sectionPadding}`}>
          <div className={`${containerPadding}`}>
            <div className="text-center mb-10 md:mb-12 animate-in fade-in duration-500 ease-out">
                 <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
                    <Quote className="w-7 h-7 text-primary"/>
                </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">What Our Users Say</h2>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: MOCK_TESTIMONIALS.length > 2, 
              }}
              className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {MOCK_TESTIMONIALS.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id} className="basis-full sm:basis-1/2 lg:basis-1/3 pl-3 md:pl-4">
                     <div className="p-1 h-full">
                        <TestimonialCard testimonial={testimonial} />
                     </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
               <div className="flex justify-center items-center mt-8 space-x-3">
                <CarouselPrevious className="static transform-none w-10 h-10 bg-card hover:bg-primary/10 text-primary border-primary/50 hover:border-primary" />
                <CarouselNext className="static transform-none w-10 h-10 bg-card hover:bg-primary/10 text-primary border-primary/50 hover:border-primary" />
              </div>
            </Carousel>
          </div>
        </section>
        
      </div>
    
  );
}

    