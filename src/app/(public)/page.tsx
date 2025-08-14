
"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, NotebookPen, Book, Atom, Code, Globe, Palette, Music, Calculator, Lightbulb, SquarePen, MessageSquareQuote, UserRoundCheck, Send, SearchCheck, Users, Award, Share2, PlusCircle, Briefcase, CalendarCheck, DollarSign, TrendingUp, UsersRound, FileText, Star, Mail, UserPlus, Phone, MapPin, BriefcaseBusiness, Building, Laptop, TrendingUpIcon, Users2, Quote, UsersRoundIcon, BookOpen, CheckCircle, XCircle, HomeIcon, GraduationCap } from "lucide-react"; // Added GraduationCap
// BookUser was removed as it's not defined at runtime
import Image from "next/image";
import Link from "next/link";
import bannerImage from '@/assets/images/banner-9.png'; 
import hireTutorImage from '@/assets/images/banner-8.png';
import becomeTutorImage from '@/assets/images/banner-11.png';
import type { TutorProfile, Testimonial, User } from "@/types"; // Added User
import { TutorProfileCard } from "@/components/tutors/TutorProfileCard";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { useState } from "react"; 
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"; 
import { PostRequirementModal } from "@/components/modals/PostRequirementModal"; 
import { MOCK_TUTOR_PROFILES, MOCK_TESTIMONIALS } from "@/lib/mock-data";
import { useAuthMock } from "@/hooks/use-auth-mock"; // Added useAuthMock
import AuthModal from "@/components/auth/AuthModal";


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


export default function HomePage() {
  const { user, isAuthenticated } = useAuthMock(); 
  const sectionPadding = "py-10 md:py-16"; 
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";
  const [isPostRequirementModalOpen, setIsPostRequirementModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialName, setAuthModalInitialName] = useState<string | undefined>(undefined);
  const [initialSubjectForModal, setInitialSubjectForModal] = useState<string[] | undefined>(undefined);
  const parentContextBaseUrl = isAuthenticated && user?.role === 'parent' ? "/parent/tutors" : undefined;

  const handleTriggerSignIn = (name?: string) => {
    setAuthModalInitialName(name);
    setIsAuthModalOpen(true);
  };
  
  const handleOpenRequirementModal = (subjectName?: string) => {
    setInitialSubjectForModal(subjectName ? [subjectName] : undefined);
    setIsPostRequirementModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center overflow-x-hidden bg-secondary">
      
        {/* Hero Section */}
        <section className={`w-full bg-secondary ${sectionPadding}`}>
          <div className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${containerPadding}`}>
            <div className="flex flex-col justify-center space-y-5 animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
                Find Your Perfect Tutor
              </h2>
              <p className="max-w-[600px] text-foreground/80 md:text-lg">
                Connecting parents with qualified and passionate tutors. Post your tuition needs or find students to teach.
              </p>
              <div className="flex flex-col gap-3.5 min-[400px]:flex-row pt-2">
                <Button asChild size="sm" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                   <Link href="/become-a-tutor">
                    <GraduationCap className="mr-2.5 h-5 w-5" /> Become a Tutor
                  </Link>
                </Button>
                 <Dialog open={isPostRequirementModalOpen} onOpenChange={setIsPostRequirementModalOpen}>
                  <DialogTrigger asChild>
                     <Button size="sm" variant="outline" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 bg-card text-primary hover:text-primary border-primary/40 hover:border-primary hover:bg-card" onClick={() => handleOpenRequirementModal()}>
                      <SquarePen className="mr-2.5 h-5 w-5" /> Post Your Requirement
                    </Button>
                  </DialogTrigger>
                  <DialogContent 
                    className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden"
                  >
                    <DialogTitle className="sr-only">Post Your Requirement</DialogTitle>
                    <PostRequirementModal 
                      startFromStep={1} 
                      onSuccess={() => setIsPostRequirementModalOpen(false)} 
                      onTriggerSignIn={handleTriggerSignIn}
                      initialSubject={initialSubjectForModal}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out order-first lg:order-last">
              <Image
                src={bannerImage}
                alt="Learning Illustration"
                width={550} 
                height={550}
                className="rounded-xl object-contain" 
                priority
                data-ai-hint="education online learning"
              />
            </div>
          </div>
        </section>

        {/* Popular Subjects Section */}
        <section className={`w-full ${sectionPadding} bg-background`}>
          <div className={`${containerPadding}`}>
            <div className="text-center mb-12 md:mb-16 animate-in fade-in duration-500 ease-out">
              <div className="inline-block p-3.5 bg-primary/10 rounded-full mb-4 shadow-sm">
                 <BookOpen className="w-8 h-8 text-primary"/>
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
              <CarouselContent className="-ml-3 md:-ml-4">
                {popularSubjects.map((subject, index) => (
                  <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-3 md:pl-4">
                    <div className="p-1.5" onClick={() => handleOpenRequirementModal(subject.name)}>
                        <Card className="group bg-card hover:shadow-xl transition-all duration-300 rounded-full aspect-square flex flex-col items-center justify-center text-center p-3 md:p-2 shadow-md border hover:border-primary/50 w-[130px] h-[130px] md:w-[140px] md:h-[140px] mx-auto transform hover:scale-105 cursor-pointer">
                          <CardContent className="p-0 flex flex-col items-center justify-center gap-2 md:gap-1.5">
                            <subject.icon className="w-8 h-8 md:w-9 md:h-9 text-primary transition-transform duration-300 group-hover:scale-110" />
                            <p className="text-sm md:text-[13.5px] font-medium text-foreground group-hover:text-primary transition-colors truncate w-full px-1.5">{subject.name}</p>
                          </CardContent>
                        </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center items-center mt-8 space-x-4">
                <CarouselPrevious className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
                <CarouselNext className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
              </div>
            </Carousel>
          </div>
        </section>

         {/* Get An Expert Tutor Section */}
        <section className={`w-full bg-secondary ${sectionPadding}`}>
          <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${containerPadding}`}>
            <div className="flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out">
              <Image
                src={hireTutorImage} 
                alt="Hiring a tutor illustration"
                width={600}
                height={600}
                className="rounded-xl object-contain"
                data-ai-hint="teacher student"
              />
            </div>
            <div className="flex flex-col justify-center space-y-6 animate-in fade-in slide-in-from-right-10 duration-700 ease-out">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Get An Expert Tutor</h2>
                <p className="max-w-[600px] text-foreground/80 md:text-lg">
                  Finding the right tutor is easy and straightforward with Tutorzila. Follow these steps to connect with qualified educators ready to help you succeed.
                </p>
                <div className="space-y-5 mt-4">
                  {howItWorksSteps.map((step, index) => (
                    <Card key={index} className="group bg-card p-5 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.02]">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 bg-white p-3.5 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm">
                          <step.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-md font-semibold text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                          <p className="text-sm text-foreground/70 mt-1">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center lg:justify-start mt-6">
                  <Dialog open={isPostRequirementModalOpen} onOpenChange={setIsPostRequirementModalOpen}>
                    <DialogTrigger asChild>
                       <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95" onClick={() => handleOpenRequirementModal()}>
                        <PlusCircle className="mr-2.5 h-5 w-5" /> Request A Tutor
                      </Button>
                    </DialogTrigger>
                     <DialogContent 
                       className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden"
                     >
                       <DialogTitle className="sr-only">Post Your Requirement</DialogTitle>
                       <PostRequirementModal 
                         startFromStep={1} 
                         onSuccess={() => setIsPostRequirementModalOpen(false)}
                         onTriggerSignIn={handleTriggerSignIn}
                         initialSubject={initialSubjectForModal}
                       />
                     </DialogContent>
                  </Dialog>
                </div>
            </div>
          </div>
        </section>

        {/* Meet Our Tutors Section */}
        <section className={`w-full ${sectionPadding} bg-background`}>
          <div className={`${containerPadding}`}>
            <div className="text-center mb-12 md:mb-16 animate-in fade-in duration-500 ease-out">
                <div className="inline-block p-3.5 bg-primary/10 rounded-full mb-4 shadow-sm">
                    <UsersRoundIcon className="w-8 h-8 text-primary"/>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Meet Our Tutors</h2>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: MOCK_TUTOR_PROFILES.length > 3, 
              }}
              className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-3.5 md:-ml-4.5">
                {MOCK_TUTOR_PROFILES.slice(0, 5).map((tutor, index) => (
                  <CarouselItem key={tutor.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/3 pl-3.5 md:pl-4.5">
                    <div className="p-1.5 h-full">
                      <TutorProfileCard tutor={tutor} parentContextBaseUrl={parentContextBaseUrl} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center items-center mt-10 space-x-4">
                <CarouselPrevious className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
                <CarouselNext className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
              </div>
            </Carousel>
          </div>
        </section>

        {/* Become A Tutor Section */}
        <section className={`w-full bg-secondary ${sectionPadding}`}>
          <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${containerPadding}`}>
            <div className="flex flex-col justify-center space-y-6 animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Become A Tutor with Tutorzila</h2>
                <p className="max-w-[600px] text-foreground/80 md:text-lg">
                  Share your knowledge, inspire students, and earn on your own schedule. Join our community of passionate educators today.
                </p>
                <div className="space-y-5 mt-4">
                  {becomeTutorBenefits.map((benefit, index) => (
                     <Card key={index} className="group bg-card p-5 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.02]">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 bg-white p-3.5 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm">
                          <benefit.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-md font-semibold text-foreground group-hover:text-primary transition-colors">{benefit.title}</h3>
                          <p className="text-sm text-foreground/70 mt-1">{benefit.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                 <div className="flex justify-center lg:justify-start mt-6">
                    <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                      <Link href="/become-a-tutor"> 
                        <GraduationCap className="mr-2.5 h-5 w-5" /> Start Teaching Today
                      </Link>
                    </Button>
                  </div>
            </div>
             <div className="flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out order-first lg:order-last">
              <Image
                src={becomeTutorImage}
                alt="Teacher explaining concepts"
                width={600}
                height={600}
                className="rounded-xl object-contain"
                data-ai-hint="teaching online teacher"
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className={`w-full text-center ${sectionPadding} bg-background`}>
          <div className={`${containerPadding} animate-in fade-in zoom-in-95 duration-700 ease-out`}>
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-5 shadow-sm">
                <Star className="w-9 h-9 text-primary"/>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-foreground/80 md:text-lg">
              Whether you&apos;re looking for a tutor or want to share your expertise, Tutorzila is the place to connect and grow.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-100 animate-pulse-once py-3.5 px-8 text-base">
                <Link href="/sign-up">
                   Sign Up Now <Send className="ml-2.5 h-4.5 w-4.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={`w-full bg-secondary ${sectionPadding}`}>
          <div className={`${containerPadding}`}>
            <div className="text-center mb-12 md:mb-16 animate-in fade-in duration-500 ease-out">
                 <div className="inline-block p-3.5 bg-primary/10 rounded-full mb-4 shadow-sm">
                    <Quote className="w-8 h-8 text-primary"/>
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
              <CarouselContent className="-ml-3.5 md:-ml-4.5">
                {MOCK_TESTIMONIALS.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id} className="basis-full sm:basis-1/2 lg:basis-1/3 pl-3.5 md:pl-4.5">
                     <div className="p-1.5 h-full">
                        <TestimonialCard testimonial={testimonial} />
                     </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
               <div className="flex justify-center items-center mt-10 space-x-4">
                <CarouselPrevious className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
                <CarouselNext className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
              </div>
            </Carousel>
          </div>
        </section>
        
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onOpenChange={setIsAuthModalOpen} 
          initialName={authModalInitialName}
        />
      )}
      </div>
    
  );
}


    