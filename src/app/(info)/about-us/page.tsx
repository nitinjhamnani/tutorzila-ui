
"use client";

import {
  Users,
  CheckCircle,
  Award,
  Target,
  GraduationCap,
  Sparkles,
  PhoneCall,
  UserCheck,
  BookOpen,
  Star,
  School,
  ClipboardList,
  Search,
  NotebookPen,
  Book,
  Atom,
  Code,
  Globe,
  Palette,
  Music,
  Calculator,
  Lightbulb,
  SquarePen,
  MessageSquareQuote,
  UserRoundCheck,
  Send,
  SearchCheck,
  Share2,
  PlusCircle,
  Briefcase,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  UsersRound,
  FileText,
  Mail,
  UserPlus,
  Phone,
  MapPin,
  BriefcaseBusiness,
  Building,
  Laptop,
  TrendingUpIcon,
  Users2,
  Quote,
  UsersRoundIcon,
  XCircle,
  HomeIcon,
  MessageSquareText,
  Settings,
  ShieldCheck,
  FlaskConical,
  Microscope,
  Landmark
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import bannerImage from '@/assets/images/banner-9.png';
import hireTutorImage from '@/assets/images/banner-8.png';
import becomeTutorImage from '@/assets/images/banner-11.png';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TutorProfile, Testimonial, User } from "@/types"; 
import { TutorProfileCard } from "@/components/tutors/TutorProfileCard";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { useState, useEffect, useRef } from "react"; 
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; 
import { PostRequirementModal } from "@/components/common/modals/PostRequirementModal"; 
import { MOCK_TUTOR_PROFILES, MOCK_TESTIMONIALS } from "@/lib/mock-data";
import { useAuthMock } from "@/hooks/use-auth-mock"; 
import AuthModal from "@/components/auth/AuthModal";
import { useRouter } from "next/navigation";


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
    icon: UserRoundCheck,
    title: "Start Learning",
    description: "Finalize with your chosen tutor and begin personalized sessions.",
  },
];

const whyJoinUsBenefits = [
  {
    icon: CheckCircle,
    title: "Quality & Verified Leads",
    description: "We share only genuine, pre-verified student enquiries so you never waste time on non-serious prospects."
  },
  {
    icon: CalendarCheck,
    title: "Guaranteed Demo Bookings",
    description: "Our team coordinates everything with parents to ensure your demo sessions happen smoothly and on time."
  },
  {
    icon: TrendingUp,
    title: "Higher Earning Potential",
    description: "Top-performing tutors get preference in recommendations and increased visibility, helping you earn more."
  },
  {
    icon: MessageSquareText,
    title: "No Cold Calling or Follow-Ups",
    description: "We handle all parent communication so you can focus purely on teaching."
  },
  {
    icon: Award,
    title: "Performance-Based Boost",
    description: "Your ratings, reviews, and teaching consistency help your profile rise to the top—bringing more opportunities your way."
  },
  {
    icon: BriefcaseBusiness,
    title: "Teach in Your Expertise Zone",
    description: "We match you with students who fit your subject strengths, preferred grades, and teaching style."
  }
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
  { name: "History", icon: Landmark, hoverColor: "hover:bg-yellow-600" },
  { name: "Physics", icon: Lightbulb, hoverColor: "hover:bg-teal-600" },
  { name: "Chemistry", icon: FlaskConical, hoverColor: "hover:bg-cyan-600" },
  { name: "Biology", icon: Microscope, hoverColor: "hover:bg-lime-600" },
  { name: "Geography", icon: Globe, hoverColor: "hover:bg-orange-600" },
  { name: "Economics", icon: TrendingUp, hoverColor: "hover:bg-amber-600" },
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

export default function AboutUsPage() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthMock(); 
  const containerPadding = 'container mx-auto px-6 sm:px-8 md:px-10 lg:px-12';
  const sectionPadding = "py-10 md:py-16"; 
  const [isPostRequirementModalOpen, setIsPostRequirementModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialName, setAuthModalInitialName] = useState<string | undefined>(undefined);
  const [initialSubjectForModal, setInitialSubjectForModal] = useState<string[] | undefined>(undefined);
  const [authModalInitialView, setAuthModalInitialView] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();
  
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated && user) {
      let targetPath = "/";
      switch(user.role) {
        case 'admin':
          targetPath = '/admin/dashboard';
          break;
        case 'tutor':
          targetPath = '/tutor/dashboard';
          break;
        case 'parent':
          targetPath = '/parent/dashboard';
          break;
      }
      if (targetPath !== "/") {
        router.replace(targetPath);
      }
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  const handleTriggerSignIn = (name?: string) => {
    setAuthModalInitialName(name);
    setAuthModalInitialView('signin');
    setIsAuthModalOpen(true);
  };
  
  const handleTriggerSignUp = () => {
    setAuthModalInitialView('signup');
    setIsAuthModalOpen(true);
  };

  const handleOpenRequirementModal = (subjectName?: string) => {
    setInitialSubjectForModal(subjectName ? [subjectName] : undefined);
    setIsPostRequirementModalOpen(true);
  };
  
  const postRequirementStartStep = isAuthenticated && user?.role === 'parent' ? 2 : 1;

  const whatWeDoPoints = [
    {
      title: 'Personalised Tuition',
      description: 'Provide personalised home tuition and online tuition.',
      icon: GraduationCap,
    },
    {
      title: 'All Subjects & Levels',
      description: 'Offer tutors for all subjects and grade levels.',
      icon: BookOpen,
    },
    {
      title: 'Needs Analysis',
      description:
        'Begin with a short counselling call to understand your child’s learning needs.',
      icon: PhoneCall,
    },
    {
      title: 'Demo Classes',
      description: 'Arrange demo classes so you can choose confidently.',
      icon: Sparkles,
    },
    {
      title: 'Full Support',
      description: 'Support parents from enquiry to class onboarding.',
      icon: UserCheck,
    },
  ];

  const whoWeSupportPoints = [
    {
      title: 'Preschool & Early Learners',
      icon: Sparkles,
    },
    {
      title: 'Primary & Middle School',
      icon: School,
    },
    {
      title: 'Academic Support Seekers',
      icon: BookOpen,
    },
    {
      title: 'Local Home Tuition',
      icon: Users,
    },
    {
      title: 'Global Online Tuition',
      icon: ClipboardList,
    },
  ];

  return (
    <>
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className={`w-full ${containerPadding} py-12 md:py-20`}>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
              About Tutorzila
            </h1>
            <p className="max-w-[600px] text-foreground/80 md:text-lg">
              Tutorzila connects parents with highly qualified, experienced
              one-on-one home tutors and online tutors for all academic needs.
              Our focus is simple: personalised learning that matches your
              child’s pace, style, and goals.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out">
            <Image
              src={bannerImage}
              alt="About Us Illustration"
              width={500}
              height={500}
              className="rounded-xl object-contain"
              data-ai-hint="education learning teamwork"
            />
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className={`w-full bg-background ${containerPadding} py-12 md:py-16`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
            What We Do
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-foreground/80 md:text-lg">
            We provide a complete, end-to-end service to ensure your child gets the best learning experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {whatWeDoPoints.map((item, index) => (
            <Card
              key={index}
              className="group bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.05]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                  {item.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Who We Support Section - REDESIGNED */}
      <section className={`w-full bg-secondary ${containerPadding} py-12 md:py-16`}>
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Who We Support</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {whoWeSupportPoints.map((item, index) => (
            <Card
                key={index}
                className="group bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.05]"
            >
                <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm mb-4">
                    <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                    {item.title}
                </h3>
                </div>
            </Card>
            ))}
        </div>
      </section>
    </div>
    
    {/* Sections from Home Page */}

    {/* Why Parents Choose Us Section */}
    <section className={`w-full bg-secondary ${sectionPadding}`}>
      <div className={`${containerPadding}`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Why Parents Choose Tutorzila</h2>
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

     {/* Get An Expert Tutor Section */}
    <section className={`w-full bg-background ${sectionPadding}`}>
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
                   onPointerDownOutside={(e) => e.preventDefault()}
                 >
                   <PostRequirementModal 
                     startFromStep={postRequirementStartStep}
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

    {/* Why Join Us Section */}
    <section className={`w-full bg-secondary ${sectionPadding}`}>
      <div className={`${containerPadding}`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Why Join Us as a Tutor?</h2>
          <p className="mt-4 max-w-3xl mx-auto text-foreground/80 md:text-lg">
            We empower educators by providing the tools and opportunities you need to succeed in your tutoring career.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {whyJoinUsBenefits.map((benefit, index) => (
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

    {/* Become A Tutor Section */}
    <section className={`w-full bg-background ${sectionPadding}`}>
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
    
  {isAuthModalOpen && (
    <AuthModal 
      isOpen={isAuthModalOpen} 
      onOpenChange={setIsAuthModalOpen} 
      initialName={authModalInitialName}
      initialForm={authModalInitialView}
    />
  )}
  </>
  );
}
