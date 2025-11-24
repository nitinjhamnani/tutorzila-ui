
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Search,
  BookOpen,
  GraduationCap,
  MapPin,
  RadioTower,
  Calculator,
  Atom,
  Code,
  Globe,
  Palette,
  Music,
  Lightbulb,
  SquarePen,
  SearchCheck,
  MessageSquareQuote,
  UserRoundCheck,
  PlusCircle,
  ShieldCheck,
  Presentation,
  DollarSign,
  UsersRound,
  ClipboardEdit,
  Users,
  FlaskConical,
  Microscope,
  Landmark,
  TrendingUp,
  Star,
  Send,
  HomeIcon,
  Laptop,
  Quote,
  PhoneCall,
  Settings,
} from "lucide-react";
import { PostRequirementModal } from "@/components/common/modals/PostRequirementModal";
import bannerImage from "@/assets/images/banner-9.png";
import hireTutorImage from "@/assets/images/banner-8.png";
import { useAuthMock } from "@/hooks/use-auth-mock";
import AuthModal from "@/components/auth/AuthModal";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";
import { TestimonialCard } from "@/components/shared/TestimonialCard";

const popularSubjects = [
  { name: "Mathematics", icon: Calculator, hoverColor: "hover:bg-blue-600" },
  { name: "Science", icon: Atom, hoverColor: "hover:bg-green-600" },
  { name: "English", icon: BookOpen, hoverColor: "hover:bg-red-600" },
  { name: "Coding", icon: Code, hoverColor: "hover:bg-purple-600" },
  { name: "History", icon: Landmark, hoverColor: "hover:bg-yellow-600" },
  { name: "Physics", icon: Lightbulb, hoverColor: "hover:bg-teal-600" },
  { name: "Chemistry", icon: FlaskConical, hoverColor: "hover:bg-cyan-600" },
  { name: "Biology", icon: Microscope, hoverColor: "hover:bg-lime-600" },
  { name: "Geography", icon: Globe, hoverColor: "hover:bg-orange-600" },
  { name: "Economics", icon: TrendingUp, hoverColor: "hover:bg-amber-600" },
];

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

const whyParentsChooseUs = [
  {
    icon: SearchCheck,
    title: "Fast Tutor Matching",
    description: "Get the right tutor recommendation — faster than ever.",
  },
  {
    icon: ShieldCheck,
    title: "3000+ Verified Tutors",
    description: "Choose from a large pool of experienced and trusted educators.",
  },
  {
    icon: PhoneCall,
    title: "Counselling on Call",
    description: "We guide you personally to understand your child’s needs and suggest the best tutor.",
  },
  {
    icon: Settings,
    title: "Dedicated Coordination",
    description: "We handle communication, demo scheduling, and smooth onboarding for you.",
  },
  {
    icon: HomeIcon,
    title: "Home & Online Options",
    description: "Select what suits your child—comfort of home or flexibility of online classes.",
  },
];

const useInView = (ref: React.RefObject<Element>, options: IntersectionObserverInit) => {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return isInView;
};

const Counter = ({ end, duration = 2, suffix = "" } : { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const endValue = end;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round((duration * 1000) / frameDuration);
      const increment = endValue / totalFrames;

      const counter = setInterval(() => {
        start += increment;
        if (start >= endValue) {
          setCount(endValue);
          clearInterval(counter);
        } else {
          setCount(Math.ceil(start));
        }
      }, frameDuration);

      return () => clearInterval(counter);
    }
  }, [isInView, end, duration]);

  return (
    <p ref={ref} className="text-4xl font-bold text-primary-foreground">
      {count.toLocaleString()}{suffix}
    </p>
  );
};


export default function TutorsInBangalorePage() {
  const [isPostRequirementModalOpen, setIsPostRequirementModalOpen] =
    useState(false);
  const [initialSubjectForModal, setInitialSubjectForModal] = useState<
    string[] | undefined
  >(undefined);
  const { user, isAuthenticated } = useAuthMock();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'signin' | 'signup'>('signup');
  
  const handleOpenRequirementModal = (subjectName?: string) => {
    setInitialSubjectForModal(subjectName ? [subjectName] : undefined);
    setIsPostRequirementModalOpen(true);
  };
  
  const handleTriggerSignIn = () => {
    setIsPostRequirementModalOpen(false);
    setIsAuthModalOpen(true);
  };
  
  const handleTriggerSignUp = () => {
    setAuthModalInitialView('signup');
    setIsAuthModalOpen(true);
  };


  const sectionPadding = "py-10 md:py-16";
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";

  return (
    <>
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className={`w-full bg-secondary ${sectionPadding}`}>
        <div
          className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${containerPadding}`}
        >
          <div className="flex flex-col justify-center space-y-5 animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
              Best Tutors in Bangalore – Home & Online Tuition for All Subjects
            </h1>
            <p className="max-w-[600px] text-foreground/80 md:text-lg">
              Find verified, experienced tutors in Bangalore for all subjects
              and classes. Tutorzila connects students with qualified home
              tutors and online tutors across Electronic City, Whitefield, HSR
              Layout, Koramangala, Marathahalli, Indiranagar, and more. Browse
              profiles, check experience, compare fees, and book a demo
              instantly.
            </p>
            <div className="flex flex-col gap-3.5 min-[400px]:flex-row pt-2">
              <Dialog
                open={isPostRequirementModalOpen}
                onOpenChange={setIsPostRequirementModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                    onClick={() => handleOpenRequirementModal()}
                  >
                    <SquarePen className="mr-2.5 h-5 w-5" /> Post Your
                    Requirement
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden"
                  onPointerDownOutside={(e) => e.preventDefault()}
                >
                  <PostRequirementModal
                    startFromStep={isAuthenticated && user?.role === 'parent' ? 2 : 1}
                    onSuccess={() => setIsPostRequirementModalOpen(false)}
                    initialSubject={initialSubjectForModal}
                     onTriggerSignIn={handleTriggerSignIn}
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
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Explore Popular Subjects
            </h2>
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
                <CarouselItem
                  key={index}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-3 md:pl-4"
                >
                  <div
                    className="p-1.5"
                    onClick={() => handleOpenRequirementModal(subject.name)}
                  >
                    <Card className="group bg-card hover:shadow-xl transition-all duration-300 rounded-full aspect-square flex flex-col items-center justify-center text-center p-3 md:p-2 shadow-md border hover:border-primary/50 w-[130px] h-[130px] md:w-[140px] md:h-[140px] mx-auto transform hover:scale-105 cursor-pointer">
                      <CardContent className="p-0 flex flex-col items-center justify-center gap-2 md:gap-1.5">
                        <subject.icon className="w-8 h-8 md:w-9 md:h-9 text-primary transition-transform duration-300 group-hover:scale-110" />
                        <p className="text-sm md:text-[13.5px] font-medium text-foreground group-hover:text-primary transition-colors truncate w-full px-1.5">
                          {subject.name}
                        </p>
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
        <div
          className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${containerPadding}`}
        >
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Get An Expert Tutor in Bangalore
            </h2>
            <p className="max-w-[600px] text-foreground/80 md:text-lg">
              Finding the right tutor is easy and straightforward with
              Tutorzila. Follow these steps to connect with qualified educators
              ready to help you succeed.
            </p>
            <div className="space-y-5 mt-4">
              {howItWorksSteps.map((step, index) => (
                <Card
                  key={index}
                  className="group bg-card p-5 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-white p-3.5 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-foreground group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-foreground/70 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-center lg:justify-start mt-6">
              <Dialog
                open={isPostRequirementModalOpen}
                onOpenChange={setIsPostRequirementModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                    onClick={() => handleOpenRequirementModal()}
                  >
                    <PlusCircle className="mr-2.5 h-5 w-5" /> Request A Tutor
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden"
                  onPointerDownOutside={(e) => e.preventDefault()}
                >
                  <PostRequirementModal
                    startFromStep={isAuthenticated && user?.role === 'parent' ? 2 : 1}
                    onSuccess={() => setIsPostRequirementModalOpen(false)}
                    initialSubject={initialSubjectForModal}
                     onTriggerSignIn={handleTriggerSignIn}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={`w-full bg-background ${sectionPadding}`}>
        <div className={`${containerPadding}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Why Choose Tutorzila in Bangalore</h2>
            <p className="mt-4 max-w-3xl mx-auto text-foreground/80 md:text-lg">
              We're committed to providing a seamless and trustworthy experience for finding the best educational support for your child.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {whyParentsChooseUs.map((benefit, index) => (
              <Card key={index} className="group bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.05]">
                <div className="flex flex-col items-center text-center">
                  <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{benefit.title}</h3>
                  <p className="text-xs text-foreground/70 mt-2">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className={`w-full text-center ${sectionPadding} bg-primary`}>
        <div className={`${containerPadding} animate-in fade-in zoom-in-95 duration-700 ease-out`}>
          <div className="inline-block p-4 bg-primary-foreground/10 rounded-full mb-5 shadow-sm">
              <Star className="w-9 h-9 text-white"/>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-white/90 md:text-lg">
            Whether you&apos;re looking for a tutor or want to share your expertise, Tutorzila is the place to connect and grow.
          </p>
          <div className="mt-10">
             <Button size="lg" variant="secondary" className="shadow-xl text-secondary-foreground hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-100 animate-pulse-once py-3.5 px-8 text-base" onClick={handleTriggerSignUp}>
                 Sign Up Now <Send className="ml-2.5 h-4.5 w-4.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className={`w-full bg-primary text-primary-foreground ${sectionPadding}`}>
          <div className={`${containerPadding}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="flex flex-col items-center text-center p-4 md:p-8">
                      <HomeIcon className="w-12 h-12 text-primary-foreground mb-4" />
                      <Counter end={2000} suffix="+" />
                      <p className="text-lg font-semibold text-primary-foreground/90 mt-2">Home Tutors</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 md:p-8">
                      <Laptop className="w-12 h-12 text-primary-foreground mb-4" />
                      <Counter end={1000} suffix="+" />
                      <p className="text-lg font-semibold text-primary-foreground/90 mt-2">Online Tutors</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 md:p-8">
                      <UsersRound className="w-12 h-12 text-primary-foreground mb-4" />
                      <Counter end={1000} suffix="+" />
                      <p className="text-lg font-semibold text-primary-foreground/90 mt-2">Happy Students</p>
                  </div>
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
      
      {/* Newsletter Section */}
      <section className={`w-full bg-primary text-primary-foreground ${sectionPadding}`}>
          <div className={`${containerPadding} text-center`}>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                  Stay Updated with Tutorzila
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-white/90 md:text-lg">
                  Subscribe to our newsletter for the latest updates on tutors, special offers, and educational tips.
              </p>
              <div className="mt-8 max-w-lg mx-auto">
                  <form className="flex flex-col sm:flex-row gap-3">
                      <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="flex-grow bg-card/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white focus:text-card-foreground py-3.5 px-4 text-base h-auto"
                          aria-label="Email address"
                      />
                      <Button type="submit" variant="secondary" size="lg" className="shrink-0 text-secondary-foreground shadow-md hover:shadow-lg transition-shadow">
                          Subscribe
                      </Button>
                  </form>
              </div>
          </div>
      </section>
    </div>
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onOpenChange={setIsAuthModalOpen} 
          initialForm={authModalInitialView}
        />
      )}
    </>
  );
}
